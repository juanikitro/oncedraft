import { describe, expect, it } from "vitest";

import type { Carta, Catalogo, Posicion } from "./index";
import {
  calcularCoberturaDeFormacion,
  calcularOvrEfectivo,
  calcularSquadScore,
  confirmarPick,
  GAME_CORE_VERSION,
  iniciarPartidaConProteccion,
  iniciarPartida,
  moverCartaEntrePlazas,
  planificarProteccionPosicional,
  reorganizarPartida,
  ubicarCartaAutomaticamente,
  usarReroll,
  usarScouting,
} from "./index";

const catalogoDePrueba: Catalogo = {
  version: "prueba-1",
  cartas: [
    {
      id: "arg-1986-1",
      nombre: "Carta argentina 1",
      pais: "Argentina",
      club: "Club A",
      temporada: "1986-87",
      cicloMundial: "1978-1993",
      posicionPrimaria: "MC",
      posicionesSecundarias: [],
      ovr: 80,
      rasgo: "Creador",
    },
    {
      id: "arg-1986-2",
      nombre: "Carta argentina 2",
      pais: "Argentina",
      club: "Club B",
      temporada: "1986-87",
      cicloMundial: "1978-1993",
      posicionPrimaria: "MC",
      posicionesSecundarias: [],
      ovr: 81,
      rasgo: "Tecnico",
    },
    {
      id: "arg-1986-3",
      nombre: "Carta argentina 3",
      pais: "Argentina",
      club: "Club C",
      temporada: "1986-87",
      cicloMundial: "1978-1993",
      posicionPrimaria: "DC",
      posicionesSecundarias: [],
      ovr: 82,
      rasgo: "Rematador",
    },
    {
      id: "bra-2002-1",
      nombre: "Carta brasileña 1",
      pais: "Brasil",
      club: "Club D",
      temporada: "2002-03",
      cicloMundial: "1994-2009",
      posicionPrimaria: "EI",
      posicionesSecundarias: [],
      ovr: 83,
      rasgo: "Velocista",
    },
    {
      id: "bra-2002-2",
      nombre: "Carta brasileña 2",
      pais: "Brasil",
      club: "Club E",
      temporada: "2002-03",
      cicloMundial: "1994-2009",
      posicionPrimaria: "MC",
      posicionesSecundarias: [],
      ovr: 84,
      rasgo: "Creador",
    },
    {
      id: "bra-2002-3",
      nombre: "Carta brasileña 3",
      pais: "Brasil",
      club: "Club F",
      temporada: "2002-03",
      cicloMundial: "1994-2009",
      posicionPrimaria: "DFC",
      posicionesSecundarias: [],
      ovr: 85,
      rasgo: "Muro defensivo",
    },
  ],
};

function crearCatalogoConContextosDeCincoCartas(cantidadDeContextos: number, cartasPorContexto = 5): Catalogo {
  const cartas: Carta[] = [];

  for (let numeroDeContexto = 1; numeroDeContexto <= cantidadDeContextos; numeroDeContexto += 1) {
    for (let numeroDeCarta = 1; numeroDeCarta <= cartasPorContexto; numeroDeCarta += 1) {
      cartas.push({
        id: `contexto-${numeroDeContexto}-carta-${numeroDeCarta}`,
        nombre: `Carta ${numeroDeContexto}-${numeroDeCarta}`,
        pais: `País ${numeroDeContexto}`,
        club: "Club de prueba",
        temporada: "2002-03",
        cicloMundial: "1994-2009",
        posicionPrimaria: "MC",
        posicionesSecundarias: [],
        ovr: 80,
        rasgo: "Creador",
      });
    }
  }

  return { version: "prueba-ofertas-especiales", cartas };
}

function crearCartaDePosicion(id: string, posicionPrimaria: Posicion, posicionesSecundarias: readonly Posicion[] = []): Carta {
  return {
    id,
    nombre: id,
    pais: "Argentina",
    club: "Club de prueba",
    temporada: "2002-03",
    cicloMundial: "1994-2009",
    posicionPrimaria,
    posicionesSecundarias,
    ovr: 80,
    rasgo: "Creador",
  };
}

function crearCatalogoParaProteccion(cartasExtraPorContexto = 2): Catalogo {
  const posiciones: readonly Posicion[] = ["POR", "LD", "DFC", "LI", "MC", "ED", "DC", "EI"];
  const cartas: Carta[] = [];

  for (let numeroDeContexto = 1; numeroDeContexto <= 12; numeroDeContexto += 1) {
    for (const posicion of posiciones) {
      cartas.push({
        ...crearCartaDePosicion(`proteccion-${numeroDeContexto}-${posicion}`, posicion),
        pais: `País ${numeroDeContexto}`,
      });
    }

    for (let indiceExtra = 1; indiceExtra <= cartasExtraPorContexto; indiceExtra += 1) {
      cartas.push({
        ...crearCartaDePosicion(`proteccion-${numeroDeContexto}-extra-${indiceExtra}`, "MC"),
        pais: `País ${numeroDeContexto}`,
      });
    }
  }

  return { version: "prueba-proteccion", cartas };
}

function confirmarPrimeraOpcion(partida: ReturnType<typeof iniciarPartida>, catalogo: Catalogo) {
  const cartaElegida = partida.ofertaActiva.opciones[0];

  if (!cartaElegida) {
    throw new Error("La fixture debe producir al menos una opción.");
  }

  return confirmarPick({ catalogo, partida, idCartaElegida: cartaElegida.id });
}

describe("game-core bootstrap", () => {
  it("expone una versión para comprobar la resolución del paquete", () => {
    expect(GAME_CORE_VERSION).toBe("0.1.0");
  });
});

describe("iniciarPartida", () => {
  it("genera la misma oferta normal coherente al repetir catálogo y seed", () => {
    const primera = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-de-prueba" });
    const segunda = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-de-prueba" });

    expect(primera).toEqual(segunda);
    expect(primera.ofertaActiva.opciones).toHaveLength(3);
    expect(
      primera.ofertaActiva.opciones.every((carta) => {
        return (
          carta.pais === primera.ofertaActiva.contexto.pais &&
          carta.cicloMundial === primera.ofertaActiva.contexto.cicloMundial
        );
      }),
    ).toBe(true);
  });

  it("no colapsa todas las seeds iniciales en el mismo contexto", () => {
    const catalogo = crearCatalogoConContextosDeCincoCartas(8);
    const contextos = new Set(
      Array.from({ length: 32 }, (_, indice) => {
        const partida = iniciarPartida({ catalogo, seed: `seed-${indice + 1}` });
        const { pais, cicloMundial } = partida.ofertaActiva.contexto;
        return `${pais}|${cicloMundial}`;
      }),
    );

    expect(contextos.size).toBeGreaterThanOrEqual(4);
  });
});

describe("confirmarPick", () => {
  it("consume únicamente la carta elegida y agota el contexto de su oferta", () => {
    const partidaInicial = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-de-prueba" });
    const cartaElegida = partidaInicial.ofertaActiva.opciones[0];

    if (!cartaElegida) {
      throw new Error("La fixture debe producir al menos una opción.");
    }

    const partidaSiguiente = confirmarPick({
      catalogo: catalogoDePrueba,
      partida: partidaInicial,
      idCartaElegida: cartaElegida.id,
    });

    expect(partidaSiguiente.cartasElegidas).toEqual([cartaElegida]);
    expect(partidaSiguiente.ubicaciones.map((ubicacion) => ubicacion.idCarta)).toEqual([cartaElegida.id]);
    expect(partidaSiguiente.contextosAgotados).toEqual([partidaInicial.ofertaActiva.contexto]);
    expect(partidaSiguiente.ofertaActiva.contexto).not.toEqual(partidaInicial.ofertaActiva.contexto);
  });

  it("genera cinco opciones en los picks especiales 4 y 8", () => {
    const catalogo = crearCatalogoConContextosDeCincoCartas(8);
    let partida = iniciarPartida({ catalogo, seed: "seed-especial" });

    while (partida.numeroDePick < 4) {
      partida = confirmarPrimeraOpcion(partida, catalogo);
    }

    expect(partida.ofertaActiva.opciones).toHaveLength(5);

    while (partida.numeroDePick < 8) {
      partida = confirmarPrimeraOpcion(partida, catalogo);
    }

    expect(partida.ofertaActiva.opciones).toHaveLength(5);
  });

  it("calcula el Squad Score final sobre la plaza manual elegida", () => {
    const catalogo = crearCatalogoConContextosDeCincoCartas(12);
    let partida = iniciarPartida({ catalogo, seed: "seed-pick-final-manual" });

    while (partida.numeroDePick < 11) {
      partida = confirmarPrimeraOpcion(partida, catalogo);
    }

    const cartaFinal = partida.ofertaActiva.opciones[0];
    if (!cartaFinal) throw new Error("La fixture debe producir una carta final.");

    const finalizada = confirmarPick({
      catalogo,
      partida,
      idCartaElegida: cartaFinal.id,
      idPlazaDestino: "POR",
    });

    expect(finalizada.completada).toBe(true);
    expect(finalizada.ubicaciones).toHaveLength(11);
    expect(finalizada.ubicaciones).toContainEqual({ idCarta: cartaFinal.id, idPlaza: "POR" });
    expect(finalizada.resultado?.puntaje).toBeTypeOf("number");
  });
});

describe("usarReroll", () => {
  it("mantiene el contexto y reemplaza toda la oferta por cartas inéditas", () => {
    const catalogo = crearCatalogoConContextosDeCincoCartas(1, 6);
    const partidaInicial = iniciarPartida({ catalogo, seed: "seed-reroll" });
    const idsIniciales = new Set(partidaInicial.ofertaActiva.opciones.map((carta) => carta.id));

    const partidaConReroll = usarReroll({ catalogo, partida: partidaInicial });

    expect(partidaConReroll.rerollDisponible).toBe(false);
    expect(partidaConReroll.ofertaActiva.contexto).toEqual(partidaInicial.ofertaActiva.contexto);
    expect(partidaConReroll.ofertaActiva.opciones).toHaveLength(3);
    expect(partidaConReroll.ofertaActiva.opciones.every((carta) => !idsIniciales.has(carta.id))).toBe(true);
  });
});

describe("usarScouting", () => {
  it("anticipa una señal determinista de la próxima oferta sin gastar el pick", () => {
    const partidaInicial = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-scouting" });
    const partidaConScouting = usarScouting({ catalogo: catalogoDePrueba, partida: partidaInicial });

    expect(partidaConScouting.scoutingDisponible).toBe(false);
    expect(partidaConScouting.ofertaActiva).toEqual(partidaInicial.ofertaActiva);
    expect(partidaConScouting.informeScouting).not.toBeNull();
  });
});

describe("planificarProteccionPosicional", () => {
  it("rechaza un catálogo que no puede sostener reroll en los rolls especiales", () => {
    expect(() => {
      return planificarProteccionPosicional({ catalogo: crearCatalogoParaProteccion(0), seed: "seed-sin-reroll-especial" });
    }).toThrow("no permite planificar");
  });

  it("distribuye tres oportunidades por primaria y reserva POR, LD y LI para el cierre aleatorio", () => {
    const plan = planificarProteccionPosicional({ catalogo: crearCatalogoParaProteccion(), seed: "seed-proteccion" });
    const conteos = new Map<Posicion, number>();

    for (const paso of plan) {
      for (const posicion of paso.posicionesProtegidas) {
        conteos.set(posicion, (conteos.get(posicion) ?? 0) + 1);
      }
    }

    expect(plan).toHaveLength(11);
    expect(new Set(plan.map((paso) => `${paso.contexto.pais}|${paso.contexto.cicloMundial}`)).size).toBe(11);
    expect([...conteos.values()]).toEqual(expect.arrayContaining(Array.from({ length: 8 }, () => 3)));
    expect(plan.slice(8).map((paso) => paso.posicionesProtegidas[0]).toSorted()).toEqual(["LD", "LI", "POR"]);
  });

  it("integra el plan en las ofertas sin mezclar país ni ciclo mundial", () => {
    const catalogo = crearCatalogoParaProteccion();
    const plan = planificarProteccionPosicional({ catalogo, seed: "seed-integracion-proteccion" });
    const partida = iniciarPartida({ catalogo, seed: "seed-integracion-proteccion", planDeProteccion: plan });
    const pasoInicial = plan[0];

    if (!pasoInicial) {
      throw new Error("La fixture debe producir el primer paso de protección.");
    }

    expect(partida.ofertaActiva.contexto).toEqual(pasoInicial.contexto);
    expect(
      pasoInicial.posicionesProtegidas.every((posicion) => {
        return partida.ofertaActiva.opciones.some((carta) => carta.posicionPrimaria === posicion);
      }),
    ).toBe(true);

    const cartaElegida = partida.ofertaActiva.opciones[0];
    const pasoSiguiente = plan[1];

    if (!cartaElegida || !pasoSiguiente) {
      throw new Error("La fixture debe producir una carta y un segundo paso.");
    }

    const siguiente = confirmarPick({ catalogo, partida, idCartaElegida: cartaElegida.id });
    expect(siguiente.ofertaActiva.contexto).toEqual(pasoSiguiente.contexto);
    expect(
      pasoSiguiente.posicionesProtegidas.every((posicion) => {
        return siguiente.ofertaActiva.opciones.some((carta) => carta.posicionPrimaria === posicion);
      }),
    ).toBe(true);
  });

  it("inicia una partida protegida sin requerir que el consumidor arme el plan", () => {
    const catalogo = crearCatalogoParaProteccion();
    const partida = iniciarPartidaConProteccion({ catalogo, seed: "seed-inicio-protegido" });

    expect(partida.planDeProteccion).toHaveLength(11);
    expect(partida.ofertaActiva.opciones).toHaveLength(3);
  });
});

describe("calcularOvrEfectivo", () => {
  it("aplica 0, −4 o −10 según posición primaria, secundaria u otra", () => {
    const carta: Carta = {
      id: "carta-versatil",
      nombre: "Carta versátil",
      pais: "Argentina",
      club: "Club de prueba",
      temporada: "2002-03",
      cicloMundial: "1994-2009",
      posicionPrimaria: "DFC",
      posicionesSecundarias: ["LD"],
      ovr: 90,
      rasgo: "Muro defensivo",
    };

    expect(calcularOvrEfectivo(carta, "DFC")).toBe(90);
    expect(calcularOvrEfectivo(carta, "LD")).toBe(86);
    expect(calcularOvrEfectivo(carta, "MC")).toBe(80);
  });
});

describe("moverCartaEntrePlazas", () => {
  it("intercambia ocupantes sin perder ninguna carta durante una reorganización", () => {
    const ubicaciones = moverCartaEntrePlazas({
      ubicaciones: [
        { idCarta: "defensor", idPlaza: "DFC-1" },
        { idCarta: "lateral", idPlaza: "LD" },
      ],
      idCarta: "defensor",
      idPlazaDestino: "LD",
    });

    expect(ubicaciones).toEqual([
      { idCarta: "defensor", idPlaza: "LD" },
      { idCarta: "lateral", idPlaza: "DFC-1" },
    ]);
  });
});

describe("reorganizarPartida", () => {
  it("mueve solo una carta elegida y conserva una run reproducible", () => {
    const partidaInicial = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-reorganizar" });
    const cartaElegida = partidaInicial.ofertaActiva.opciones[0];

    if (!cartaElegida) {
      throw new Error("La fixture debe producir una carta.");
    }

    const partida = confirmarPick({ catalogo: catalogoDePrueba, partida: partidaInicial, idCartaElegida: cartaElegida.id });
    const reorganizada = reorganizarPartida({ partida, idCarta: cartaElegida.id, idPlazaDestino: "MC-1" });

    expect(reorganizada.ubicaciones).toContainEqual({ idCarta: cartaElegida.id, idPlaza: "MC-1" });
    expect(reorganizada.seed).toBe(partida.seed);
  });

  it("rechaza mover una carta que no forma parte de la squad", () => {
    const partida = iniciarPartida({ catalogo: catalogoDePrueba, seed: "seed-reorganizar-invalida" });

    expect(() => reorganizarPartida({ partida, idCarta: "inexistente", idPlazaDestino: "MC-1" })).toThrow(
      "no forma parte de la squad",
    );
  });
});

describe("ubicarCartaAutomaticamente", () => {
  it("prioriza una plaza primaria y luego una secundaria libre", () => {
    const carta: Carta = {
      id: "defensor-lateral",
      nombre: "Defensor lateral",
      pais: "Argentina",
      club: "Club de prueba",
      temporada: "2002-03",
      cicloMundial: "1994-2009",
      posicionPrimaria: "DFC",
      posicionesSecundarias: ["LD"],
      ovr: 85,
      rasgo: "Muro defensivo",
    };

    const ubicaciones = ubicarCartaAutomaticamente({
      carta,
      ubicaciones: [
        { idCarta: "dfc-1", idPlaza: "DFC-1" },
        { idCarta: "dfc-2", idPlaza: "DFC-2" },
      ],
    });

    expect(ubicaciones).toContainEqual({ idCarta: "defensor-lateral", idPlaza: "LD" });
  });
});

describe("calcularCoberturaDeFormacion", () => {
  it("usa una secundaria una sola vez para completar la 4-3-3", () => {
    const cobertura = calcularCoberturaDeFormacion([
      crearCartaDePosicion("por", "POR"),
      crearCartaDePosicion("dfc-1", "DFC"),
      crearCartaDePosicion("dfc-2", "DFC"),
      crearCartaDePosicion("li", "LI"),
      crearCartaDePosicion("mc-1", "MC"),
      crearCartaDePosicion("mc-2", "MC"),
      crearCartaDePosicion("mc-3", "MC"),
      crearCartaDePosicion("ed", "ED"),
      crearCartaDePosicion("dc", "DC"),
      crearCartaDePosicion("ei", "EI"),
      crearCartaDePosicion("defensor-flexible", "DFC", ["LD"]),
    ]);

    expect(cobertura.plazasPendientes).toEqual([]);
    expect(cobertura.ubicaciones).toContainEqual({ idCarta: "defensor-flexible", idPlaza: "LD" });
  });
});

describe("calcularSquadScore", () => {
  it("explica OVR efectivo, química y bonus de trait con la fórmula aprobada", () => {
    const cartas = [
      crearCartaDePosicion("por", "POR"),
      crearCartaDePosicion("ld", "LD"),
      crearCartaDePosicion("dfc-1", "DFC"),
      crearCartaDePosicion("dfc-2", "DFC"),
      crearCartaDePosicion("li", "LI"),
      crearCartaDePosicion("mc-1", "MC"),
      crearCartaDePosicion("mc-2", "MC"),
      crearCartaDePosicion("mc-3", "MC"),
      crearCartaDePosicion("ed", "ED"),
      crearCartaDePosicion("dc", "DC"),
      crearCartaDePosicion("ei", "EI"),
    ];
    const cobertura = calcularCoberturaDeFormacion(cartas);

    const score = calcularSquadScore({ cartas, ubicaciones: cobertura.ubicaciones });

    expect(score.promedioOvrEfectivo).toBe(80);
    expect(score.conexionesQuimica).toBe(33);
    expect(score.multiplicadorQuimica).toBe(1.05);
    expect(score.bonosDeTraits).toEqual([{ rasgo: "Creador", cantidad: 11, bonus: 3 }]);
    expect(score.puntaje).toBe(87);
  });
});

describe("finalizar una partida", () => {
  it("termina después del pick 11 y conserva el Squad Score", () => {
    const catalogo = crearCatalogoConContextosDeCincoCartas(12);
    let partida = iniciarPartida({ catalogo, seed: "seed-completa" });

    while (partida.cartasElegidas.length < 11) {
      partida = confirmarPrimeraOpcion(partida, catalogo);
    }

    expect(partida.completada).toBe(true);
    expect(partida.cartasElegidas).toHaveLength(11);
    expect(partida.resultado?.puntaje).toBeTypeOf("number");
  });
});
