import {
  calcularCoberturaDeFormacion,
  confirmarPick,
  iniciarPartidaConProteccion,
  usarReroll,
  usarScouting,
  type Carta,
  type EstadoPartida,
  type Oferta,
} from "@draft/game-core";

import { compilarCatalogoCandidato } from "./candidate-catalog.ts";

interface Estrategia {
  nombre: "ovr" | "quimica" | "traits" | "cobertura";
  elegir(partida: EstadoPartida): Carta;
  debeUsarReroll?(partida: EstadoPartida): boolean;
}

interface ResumenDeSimulacion {
  estrategia: Estrategia["nombre"];
  runsCompletas: number;
  rerollsUsados: number;
  scoutingsUsados: number;
  ofertas: number;
  ofertasDominadas: number;
  tasaOfertasDominadas: number;
  puntaje: { minimo: number; promedio: number; maximo: number };
  plazasPendientesAlFinal: number;
  contextosInicialesDistintos: number;
  contextosPorRun: { minimo: number; promedio: number; maximo: number };
  umbralesDeTrait: Record<string, number>;
}

const ESTRATEGIAS: readonly Estrategia[] = [
  {
    nombre: "ovr",
    elegir: (partida) => ordenarOpciones(partida, (carta) => carta.ovr)[0]!,
    debeUsarReroll: (partida) => Math.max(...partida.ofertaActiva.opciones.map((carta) => carta.ovr)) < 85,
  },
  {
    nombre: "quimica",
    elegir: (partida) => ordenarOpciones(partida, (carta) => conexionesInmediatas(carta, partida.cartasElegidas) * 100 + carta.ovr)[0]!,
  },
  {
    nombre: "traits",
    elegir: (partida) => ordenarOpciones(partida, (carta) => valorDeTrait(carta, partida.cartasElegidas) * 100 + carta.ovr)[0]!,
  },
  {
    nombre: "cobertura",
    elegir: (partida) => {
      const plazasPendientes = new Set(calcularCoberturaDeFormacion(partida.cartasElegidas).plazasPendientes);
      const posicionesPendientes = new Set(
        [...plazasPendientes].map((idPlaza) => idPlaza.replace(/-\d+$/, "")),
      );
      return ordenarOpciones(partida, (carta) => (posicionesPendientes.has(carta.posicionPrimaria) ? 10_000 : 0) + carta.ovr)[0]!;
    },
  },
];

const cantidadDeSeeds = leerCantidadDeSeeds(process.argv.slice(2)) ?? 1_000;
const compilacion = compilarCatalogoCandidato();

if (!compilacion.catalogo) {
  console.error(compilacion.errores.join("\n"));
  process.exitCode = 1;
} else {
  const informe = ESTRATEGIAS.map((estrategia) => simularEstrategia(compilacion.catalogo, estrategia, cantidadDeSeeds));
  console.log(JSON.stringify({ versionCatalogo: compilacion.catalogo.version, cantidadDeSeeds, informe }, null, 2));
}

function simularEstrategia(
  catalogo: NonNullable<typeof compilacion.catalogo>,
  estrategia: Estrategia,
  semillas: number,
): ResumenDeSimulacion {
  let rerollsUsados = 0;
  let scoutingsUsados = 0;
  let ofertas = 0;
  let ofertasDominadas = 0;
  let plazasPendientesAlFinal = 0;
  const puntajes: number[] = [];
  const contextosIniciales = new Set<string>();
  const contextosPorRun: number[] = [];
  const umbralesDeTrait: Record<string, number> = {};

  for (let indice = 1; indice <= semillas; indice += 1) {
    let partida = iniciarPartidaConProteccion({ catalogo, seed: `sim-${estrategia.nombre}-${indice}` });
    const contextos = new Set<string>();
    contextosIniciales.add(claveDeContexto(partida.ofertaActiva));

    while (!partida.completada) {
      contextos.add(claveDeContexto(partida.ofertaActiva));
      ofertas += 1;
      ofertasDominadas += esOfertaDominada(partida.ofertaActiva, partida.cartasElegidas) ? 1 : 0;

      if (partida.scoutingDisponible && partida.numeroDePick < 11) {
        partida = usarScouting({ catalogo, partida });
        scoutingsUsados += 1;
      }

      if (partida.rerollDisponible && estrategia.debeUsarReroll?.(partida)) {
        partida = usarReroll({ catalogo, partida });
        rerollsUsados += 1;
        ofertas += 1;
        ofertasDominadas += esOfertaDominada(partida.ofertaActiva, partida.cartasElegidas) ? 1 : 0;
      }

      const carta = estrategia.elegir(partida);
      partida = confirmarPick({ catalogo, partida, idCartaElegida: carta.id });
    }

    const puntaje = partida.resultado?.puntaje;
    if (puntaje === undefined) {
      throw new Error("Una run completada debe tener Squad Score.");
    }

    puntajes.push(puntaje);
    contextosPorRun.push(contextos.size);
    plazasPendientesAlFinal += calcularCoberturaDeFormacion(partida.cartasElegidas).plazasPendientes.length;

    for (const bonus of partida.resultado?.bonosDeTraits ?? []) {
      umbralesDeTrait[bonus.rasgo] = (umbralesDeTrait[bonus.rasgo] ?? 0) + 1;
    }
  }

  return {
    estrategia: estrategia.nombre,
    runsCompletas: puntajes.length,
    rerollsUsados,
    scoutingsUsados,
    ofertas,
    ofertasDominadas,
    tasaOfertasDominadas: redondear(ofertasDominadas / ofertas),
    puntaje: resumenNumerico(puntajes),
    plazasPendientesAlFinal,
    contextosInicialesDistintos: contextosIniciales.size,
    contextosPorRun: resumenNumerico(contextosPorRun),
    umbralesDeTrait,
  };
}

function ordenarOpciones(partida: EstadoPartida, valor: (carta: Carta) => number): readonly Carta[] {
  return partida.ofertaActiva.opciones.toSorted((izquierda, derecha) => {
    const diferencia = valor(derecha) - valor(izquierda);
    return diferencia !== 0 ? diferencia : izquierda.id.localeCompare(derecha.id);
  });
}

function conexionesInmediatas(carta: Carta, elegidas: readonly Carta[]): number {
  return [
    elegidas.some((compañero) => compañero.pais === carta.pais),
    elegidas.some((compañero) => compañero.club === carta.club),
    elegidas.some((compañero) => compañero.cicloMundial === carta.cicloMundial),
  ].filter(Boolean).length;
}

function valorDeTrait(carta: Carta, elegidas: readonly Carta[]): number {
  const cantidadActual = elegidas.filter((elegida) => elegida.rasgo === carta.rasgo).length;
  const cantidadNueva = cantidadActual + 1;
  return cantidadNueva === 5 ? 10 : cantidadNueva === 3 ? 6 : cantidadNueva;
}

function esOfertaDominada(oferta: Oferta, elegidas: readonly Carta[]): boolean {
  return oferta.opciones.some((candidata) => {
    return oferta.opciones.some((comparada) => {
      if (candidata.id === comparada.id || candidata.posicionPrimaria !== comparada.posicionPrimaria || candidata.rasgo !== comparada.rasgo) {
        return false;
      }

      const candidataConexiones = conexionesInmediatas(candidata, elegidas);
      const comparadaConexiones = conexionesInmediatas(comparada, elegidas);
      return (
        candidata.ovr >= comparada.ovr &&
        candidataConexiones >= comparadaConexiones &&
        (candidata.ovr > comparada.ovr || candidataConexiones > comparadaConexiones)
      );
    });
  });
}

function claveDeContexto(oferta: Oferta): string {
  return `${oferta.contexto.pais}|${oferta.contexto.cicloMundial}`;
}

function resumenNumerico(valores: readonly number[]): { minimo: number; promedio: number; maximo: number } {
  return {
    minimo: Math.min(...valores),
    promedio: redondear(valores.reduce((total, valor) => total + valor, 0) / valores.length),
    maximo: Math.max(...valores),
  };
}

function redondear(valor: number): number {
  return Math.round(valor * 10_000) / 10_000;
}

function leerCantidadDeSeeds(argumentos: readonly string[]): number | undefined {
  const valor = argumentos.find((argumento) => argumento.startsWith("--seeds="));
  const cantidad = Number(valor?.slice("--seeds=".length));
  return Number.isInteger(cantidad) && cantidad > 0 ? cantidad : undefined;
}
