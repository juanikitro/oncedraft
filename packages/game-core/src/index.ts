export const GAME_CORE_VERSION = "0.1.0";

export const CICLOS_MUNDIALES = ["1962-1977", "1978-1993", "1994-2009", "2010-2025"] as const;
export const POSICIONES = ["POR", "LD", "DFC", "LI", "MC", "ED", "DC", "EI"] as const;

export type CicloMundial = (typeof CICLOS_MUNDIALES)[number];
export type Posicion = (typeof POSICIONES)[number];
export type Rasgo = "Rematador" | "Creador" | "Tecnico" | "Velocista" | "Fisico" | "Muro defensivo";

export const PLAZAS_4_3_3 = [
  { id: "POR", posicion: "POR" },
  { id: "LD", posicion: "LD" },
  { id: "DFC-1", posicion: "DFC" },
  { id: "DFC-2", posicion: "DFC" },
  { id: "LI", posicion: "LI" },
  { id: "MC-1", posicion: "MC" },
  { id: "MC-2", posicion: "MC" },
  { id: "MC-3", posicion: "MC" },
  { id: "ED", posicion: "ED" },
  { id: "DC", posicion: "DC" },
  { id: "EI", posicion: "EI" },
] as const satisfies readonly { id: string; posicion: Posicion }[];

export type IdPlaza = (typeof PLAZAS_4_3_3)[number]["id"];

export interface UbicacionCarta {
  idCarta: string;
  idPlaza: IdPlaza;
}

export interface CoberturaDeFormacion {
  ubicaciones: readonly UbicacionCarta[];
  plazasPendientes: readonly IdPlaza[];
}

export interface BonusDeTrait {
  rasgo: Rasgo;
  cantidad: number;
  bonus: number;
}

export interface SquadScore {
  promedioOvrEfectivo: number;
  conexionesQuimica: number;
  multiplicadorQuimica: number;
  bonosDeTraits: readonly BonusDeTrait[];
  puntaje: number;
}

export type InformeScouting =
  | { tipo: "contexto"; contexto: ContextoDeRoll }
  | { tipo: "posicion_y_rasgo"; posicion: Posicion; rasgo: Rasgo }
  | {
      tipo: "perfil_sin_identidad";
      perfil: Pick<Carta, "pais" | "club" | "cicloMundial" | "posicionPrimaria" | "ovr" | "rasgo">;
    }
  | { tipo: "carta_exacta"; carta: Carta };

export interface Carta {
  id: string;
  nombre: string;
  pais: string;
  club: string;
  temporada: string;
  cicloMundial: CicloMundial;
  posicionPrimaria: Posicion;
  posicionesSecundarias: readonly Posicion[];
  ovr: number;
  rasgo: Rasgo;
}

export interface Catalogo {
  version: string;
  cartas: readonly Carta[];
}

export interface ContextoDeRoll {
  pais: string;
  cicloMundial: CicloMundial;
}

export interface Oferta {
  contexto: ContextoDeRoll;
  opciones: readonly Carta[];
}

/** Un paso interno verificable del plan de oportunidades posicionales. */
export interface PasoDeProteccionPosicional {
  numeroDePick: number;
  contexto: ContextoDeRoll;
  posicionesProtegidas: readonly Posicion[];
}

export interface EstadoPartida {
  versionCatalogo: string;
  seed: string;
  numeroDePick: number;
  cartasElegidas: readonly Carta[];
  ubicaciones: readonly UbicacionCarta[];
  contextosAgotados: readonly ContextoDeRoll[];
  idsCartasVistas: readonly string[];
  rerollDisponible: boolean;
  scoutingDisponible: boolean;
  informeScouting: InformeScouting | null;
  completada: boolean;
  resultado: SquadScore | null;
  planDeProteccion: readonly PasoDeProteccionPosicional[];
  ofertaActiva: Oferta;
}

export type EstadoPartidaInicial = EstadoPartida;

export interface IniciarPartidaInput {
  catalogo: Catalogo;
  seed: string;
  /** El producto pasa el plan validado; fixtures acotadas pueden omitirlo. */
  planDeProteccion?: readonly PasoDeProteccionPosicional[];
}

export interface ConfirmarPickInput {
  catalogo: Catalogo;
  partida: EstadoPartida;
  idCartaElegida: string;
  /** Permite confirmar directamente la ubicación manual elegida en la pizarra. */
  idPlazaDestino?: IdPlaza;
}

export interface UsarRerollInput {
  catalogo: Catalogo;
  partida: EstadoPartida;
}

export interface UsarScoutingInput {
  catalogo: Catalogo;
  partida: EstadoPartida;
}

const CANTIDAD_OPCIONES_NORMAL = 3;
const CANTIDAD_OPCIONES_ESPECIAL = 5;
const PENALIZACION_POSICION_SECUNDARIA = 4;
const PENALIZACION_FUERA_DE_POSICION = 10;
const POSICIONES_PRIORITARIAS_DE_CIERRE = ["POR", "LD", "LI"] as const satisfies readonly Posicion[];

export function calcularOvrEfectivo(carta: Carta, posicionDePlaza: Posicion): number {
  if (carta.posicionPrimaria === posicionDePlaza) {
    return carta.ovr;
  }

  if (carta.posicionesSecundarias.includes(posicionDePlaza)) {
    return carta.ovr - PENALIZACION_POSICION_SECUNDARIA;
  }

  return carta.ovr - PENALIZACION_FUERA_DE_POSICION;
}

/**
 * Encuentra una secuencia aleatoria y reproducible de contextos que puede
 * ofrecer tres candidatos primarios por posición. Es una precondición de
 * catálogo y, al pasarlo a la partida protegida, guía las ofertas sin romper
 * su contexto país–ciclo.
 */
export function planificarProteccionPosicional({
  catalogo,
  seed,
}: {
  catalogo: Catalogo;
  seed: string;
}): readonly PasoDeProteccionPosicional[] {
  const celdas = obtenerCeldasElegibles(catalogo.cartas, CANTIDAD_OPCIONES_NORMAL);

  for (let intento = 0; intento < 1_000; intento += 1) {
    const aleatorio = crearGeneradorSeeded(`${seed}|proteccion|${intento}`);
    const prioridadesFinales = mezclar([...POSICIONES_PRIORITARIAS_DE_CIERRE], aleatorio);
    const oportunidadesPendientes = new Map<Posicion, number>(
      POSICIONES.map((posicion) => [
        posicion,
        esPosicionPrioritariaDeCierre(posicion) ? 2 : 3,
      ]),
    );
    const usadas = new Set<string>();
    const pasos: PasoDeProteccionPosicional[] = [];

    for (let numeroDePick = 1; numeroDePick <= 8; numeroDePick += 1) {
      const capacidad = cantidadDeOpcionesParaPick(numeroDePick);
      const capacidadConReroll = capacidad * 2;
      const candidatas = mezclar(
        celdas
        .filter(({ contexto, cartas }) => {
          return (
            cartas.length >= capacidadConReroll &&
            !usadas.has(crearClaveDeContexto(contexto.pais, contexto.cicloMundial))
          );
        })
        .map((celda) => ({
          celda,
          posiciones: seleccionarPosicionesPendientes(celda.cartas, oportunidadesPendientes, capacidad, aleatorio),
        })),
        aleatorio,
      ).toSorted((izquierda, derecha) => derecha.posiciones.length - izquierda.posiciones.length);
      const candidata = candidatas[0];

      if (!candidata) {
        break;
      }

      const clave = crearClaveDeContexto(candidata.celda.contexto.pais, candidata.celda.contexto.cicloMundial);
      usadas.add(clave);
      for (const posicion of candidata.posiciones) {
        oportunidadesPendientes.set(posicion, (oportunidadesPendientes.get(posicion) ?? 0) - 1);
      }
      pasos.push({
        numeroDePick,
        contexto: candidata.celda.contexto,
        posicionesProtegidas: candidata.posiciones,
      });
    }

    if (pasos.length !== 8 || [...oportunidadesPendientes.values()].some((cantidad) => cantidad !== 0)) {
      continue;
    }

    const pasosFinales = asignarVentanaFinal({ celdas, usadas, prioridadesFinales, aleatorio });

    if (pasosFinales) {
      return [...pasos, ...pasosFinales];
    }
  }

  throw new Error("El catálogo no permite planificar la protección posicional aprobada.");
}

/**
 * Reorganiza plazas sin destruir una carta ya colocada: si el destino estaba
 * ocupado y la carta provenía de otra plaza, ambas intercambian lugar.
 */
export function moverCartaEntrePlazas({
  ubicaciones,
  idCarta,
  idPlazaDestino,
}: {
  ubicaciones: readonly UbicacionCarta[];
  idCarta: string;
  idPlazaDestino: IdPlaza;
}): readonly UbicacionCarta[] {
  const ubicacionOrigen = ubicaciones.find((ubicacion) => ubicacion.idCarta === idCarta);
  const ubicacionDestino = ubicaciones.find((ubicacion) => ubicacion.idPlaza === idPlazaDestino);
  const ubicacionesSinOrigenNiDestino = ubicaciones.filter((ubicacion) => {
    return ubicacion.idCarta !== idCarta && ubicacion.idPlaza !== idPlazaDestino;
  });
  const resultado: UbicacionCarta[] = [{ idCarta, idPlaza: idPlazaDestino }];

  if (ubicacionOrigen && ubicacionDestino) {
    resultado.push({ idCarta: ubicacionDestino.idCarta, idPlaza: ubicacionOrigen.idPlaza });
  }

  return [...resultado, ...ubicacionesSinOrigenNiDestino];
}

/** Reorganiza una carta ya elegida y actualiza el score cuando la squad está completa. */
export function reorganizarPartida({
  partida,
  idCarta,
  idPlazaDestino,
}: {
  partida: EstadoPartida;
  idCarta: string;
  idPlazaDestino: IdPlaza;
}): EstadoPartida {
  if (!partida.cartasElegidas.some((carta) => carta.id === idCarta)) {
    throw new Error("La carta no forma parte de la squad actual.");
  }

  const ubicaciones = moverCartaEntrePlazas({ ubicaciones: partida.ubicaciones, idCarta, idPlazaDestino });
  return {
    ...partida,
    ubicaciones,
    resultado: partida.completada ? calcularSquadScore({ cartas: partida.cartasElegidas, ubicaciones }) : null,
  };
}

/** Coloca una carta nueva en la mejor plaza libre según las reglas de la formación. */
export function ubicarCartaAutomaticamente({
  carta,
  ubicaciones,
}: {
  carta: Carta;
  ubicaciones: readonly UbicacionCarta[];
}): readonly UbicacionCarta[] {
  const ubicacionesSinCarta = ubicaciones.filter((ubicacion) => ubicacion.idCarta !== carta.id);
  const plazasOcupadas = new Set(ubicacionesSinCarta.map((ubicacion) => ubicacion.idPlaza));
  const plazasLibres = PLAZAS_4_3_3.filter((plaza) => !plazasOcupadas.has(plaza.id));
  const plazaPrimaria = plazasLibres.find((plaza) => plaza.posicion === carta.posicionPrimaria);
  const plazaSecundaria = plazasLibres.find((plaza) => carta.posicionesSecundarias.includes(plaza.posicion));
  const plazaConMejorOvr = plazasLibres.toSorted((izquierda, derecha) => {
    return calcularOvrEfectivo(carta, derecha.posicion) - calcularOvrEfectivo(carta, izquierda.posicion);
  })[0];
  const plazaDestino = plazaPrimaria ?? plazaSecundaria ?? plazaConMejorOvr;

  if (!plazaDestino) {
    throw new Error("No queda una plaza libre para ubicar la carta elegida.");
  }

  return [...ubicacionesSinCarta, { idCarta: carta.id, idPlaza: plazaDestino.id }];
}

/**
 * Determina si las cartas elegidas pueden cubrir la formación usando posición
 * primaria o secundaria. Cada carta se asigna como máximo a una plaza.
 */
export function calcularCoberturaDeFormacion(cartas: readonly Carta[]): CoberturaDeFormacion {
  const cartasPorId = new Map(cartas.map((carta) => [carta.id, carta]));
  const cartaPorPlaza = new Map<IdPlaza, string>();

  function intentarAsignar(idCarta: string, plazasVisitadas: Set<IdPlaza>): boolean {
    const carta = cartasPorId.get(idCarta);

    if (!carta) {
      return false;
    }

    for (const plaza of plazasCompatibles(carta)) {
      if (plazasVisitadas.has(plaza.id)) {
        continue;
      }

      plazasVisitadas.add(plaza.id);
      const idCartaOcupante = cartaPorPlaza.get(plaza.id);

      if (!idCartaOcupante || intentarAsignar(idCartaOcupante, plazasVisitadas)) {
        cartaPorPlaza.set(plaza.id, carta.id);
        return true;
      }
    }

    return false;
  }

  for (const carta of cartas) {
    intentarAsignar(carta.id, new Set());
  }

  const ubicaciones = PLAZAS_4_3_3.flatMap((plaza) => {
    const idCarta = cartaPorPlaza.get(plaza.id);
    return idCarta ? [{ idCarta, idPlaza: plaza.id }] : [];
  });
  const plazasPendientes = PLAZAS_4_3_3.filter((plaza) => !cartaPorPlaza.has(plaza.id)).map((plaza) => plaza.id);

  return { ubicaciones, plazasPendientes };
}

/** Calcula el puntaje explicable de una squad completa según DEC-140. */
export function calcularSquadScore({
  cartas,
  ubicaciones,
}: {
  cartas: readonly Carta[];
  ubicaciones: readonly UbicacionCarta[];
}): SquadScore {
  if (cartas.length !== PLAZAS_4_3_3.length || ubicaciones.length !== PLAZAS_4_3_3.length) {
    throw new Error("El Squad Score requiere las once cartas ubicadas en la formación.");
  }

  const plazasPorId = new Map(PLAZAS_4_3_3.map((plaza) => [plaza.id, plaza]));
  const ubicacionPorCarta = new Map(ubicaciones.map((ubicacion) => [ubicacion.idCarta, ubicacion]));
  const ovrsEfectivos = cartas.map((carta) => {
    const ubicacion = ubicacionPorCarta.get(carta.id);
    const plaza = ubicacion ? plazasPorId.get(ubicacion.idPlaza) : undefined;

    if (!plaza) {
      throw new Error(`Falta una ubicación válida para ${carta.id}.`);
    }

    return calcularOvrEfectivo(carta, plaza.posicion);
  });
  const promedioOvrEfectivo = ovrsEfectivos.reduce((total, ovr) => total + ovr, 0) / ovrsEfectivos.length;
  const conexionesQuimica = calcularConexionesDeQuimica(cartas);
  const multiplicadorQuimica = 1 + (conexionesQuimica / 33) * 0.05;
  const cantidadesPorTrait = new Map<Rasgo, number>();

  for (const carta of cartas) {
    cantidadesPorTrait.set(carta.rasgo, (cantidadesPorTrait.get(carta.rasgo) ?? 0) + 1);
  }

  const bonosDeTraits = [...cantidadesPorTrait.entries()]
    .map(([rasgo, cantidad]) => ({
      rasgo,
      cantidad,
      bonus: cantidad >= 5 ? 3 : cantidad >= 3 ? 1 : 0,
    }))
    .filter(({ bonus }) => bonus > 0);
  const bonusTotal = bonosDeTraits.reduce((total, { bonus }) => total + bonus, 0);
  const puntaje = redondearUnDecimal(promedioOvrEfectivo * multiplicadorQuimica + bonusTotal);

  return { promedioOvrEfectivo, conexionesQuimica, multiplicadorQuimica, bonosDeTraits, puntaje };
}

/** Cuenta las conexiones de química visibles por país, club y ciclo mundial. */
export function calcularConexionesDeQuimica(cartas: readonly Carta[]): number {
  return cartas.reduce((total, carta, indice) => {
    const companeros = cartas.filter((_, indiceCompanero) => indiceCompanero !== indice);
    const conexiones = [
      companeros.some((companero) => companero.pais === carta.pais),
      companeros.some((companero) => companero.club === carta.club),
      companeros.some((companero) => companero.cicloMundial === carta.cicloMundial),
    ].filter(Boolean).length;

    return total + conexiones;
  }, 0);
}

function plazasCompatibles(carta: Carta): readonly (typeof PLAZAS_4_3_3)[number][] {
  return PLAZAS_4_3_3.filter((plaza) => {
    return carta.posicionPrimaria === plaza.posicion || carta.posicionesSecundarias.includes(plaza.posicion);
  });
}

function redondearUnDecimal(valor: number): number {
  return Math.round(valor * 10) / 10;
}

/**
 * Crea el primer estado de una partida libre.
 * No consulta tiempo, red ni estado global: catálogo y seed bastan para reproducirla.
 */
export function iniciarPartida({ catalogo, seed, planDeProteccion = [] }: IniciarPartidaInput): EstadoPartidaInicial {
  const ofertaActiva = generarOferta({
    catalogo,
    seed,
    numeroDePick: 1,
    contextosAgotados: [],
    idsCartasVistas: [],
    pasoDeProteccion: obtenerPasoDeProteccion(planDeProteccion, 1),
  });

  return {
    versionCatalogo: catalogo.version,
    seed,
    numeroDePick: 1,
    cartasElegidas: [],
    ubicaciones: [],
    contextosAgotados: [],
    idsCartasVistas: ofertaActiva.opciones.map((carta) => carta.id),
    rerollDisponible: true,
    scoutingDisponible: true,
    informeScouting: null,
    completada: false,
    resultado: null,
    planDeProteccion,
    ofertaActiva,
  };
}

/** Inicia una partida de producto con el plan posicional aprobado aplicado. */
export function iniciarPartidaConProteccion({
  catalogo,
  seed,
}: Omit<IniciarPartidaInput, "planDeProteccion">): EstadoPartidaInicial {
  return iniciarPartida({
    catalogo,
    seed,
    planDeProteccion: planificarProteccionPosicional({ catalogo, seed }),
  });
}

/** Confirma una carta de la oferta activa y crea la siguiente oferta normal. */
export function confirmarPick({ catalogo, partida, idCartaElegida, idPlazaDestino }: ConfirmarPickInput): EstadoPartida {
  if (partida.completada) {
    throw new Error("La partida ya fue completada.");
  }

  const cartaElegida = partida.ofertaActiva.opciones.find((carta) => carta.id === idCartaElegida);

  if (!cartaElegida) {
    throw new Error("La carta elegida no pertenece a la oferta activa.");
  }

  const contextosAgotados = [...partida.contextosAgotados, partida.ofertaActiva.contexto];
  const cartasElegidas = [...partida.cartasElegidas, cartaElegida];
  const ubicacionesAutomaticas = ubicarCartaAutomaticamente({ carta: cartaElegida, ubicaciones: partida.ubicaciones });
  const ubicaciones = idPlazaDestino
    ? moverCartaEntrePlazas({ ubicaciones: ubicacionesAutomaticas, idCarta: cartaElegida.id, idPlazaDestino })
    : ubicacionesAutomaticas;
  const esPickFinal = partida.numeroDePick === PLAZAS_4_3_3.length;

  if (esPickFinal) {
    return {
      ...partida,
      cartasElegidas,
      ubicaciones,
      contextosAgotados,
      completada: true,
      resultado: calcularSquadScore({ cartas: cartasElegidas, ubicaciones }),
    };
  }

  const numeroDePickSiguiente = partida.numeroDePick + 1;
  const ofertaActiva = generarOferta({
    catalogo,
    seed: partida.seed,
    numeroDePick: numeroDePickSiguiente,
    contextosAgotados,
    idsCartasVistas: partida.idsCartasVistas,
    pasoDeProteccion: obtenerPasoDeProteccion(partida.planDeProteccion, numeroDePickSiguiente),
  });

  return {
    versionCatalogo: partida.versionCatalogo,
    seed: partida.seed,
    numeroDePick: numeroDePickSiguiente,
    cartasElegidas,
    ubicaciones,
    contextosAgotados,
    idsCartasVistas: [...partida.idsCartasVistas, ...ofertaActiva.opciones.map((carta) => carta.id)],
    rerollDisponible: partida.rerollDisponible,
    scoutingDisponible: partida.scoutingDisponible,
    informeScouting: null,
    completada: false,
    resultado: null,
    planDeProteccion: partida.planDeProteccion,
    ofertaActiva,
  };
}

/** Sustituye la oferta activa una única vez, sin cambiar su contexto. */
export function usarReroll({ catalogo, partida }: UsarRerollInput): EstadoPartida {
  if (partida.completada) {
    throw new Error("No se puede usar reroll después de completar la partida.");
  }

  if (!partida.rerollDisponible) {
    throw new Error("El reroll ya fue utilizado en esta partida.");
  }

  const ofertaActiva = generarOferta({
    catalogo,
    seed: `${partida.seed}|reroll`,
    numeroDePick: partida.numeroDePick,
    contextosAgotados: partida.contextosAgotados,
    idsCartasVistas: partida.idsCartasVistas,
    contextoForzado: partida.ofertaActiva.contexto,
  });

  return {
    ...partida,
    idsCartasVistas: [...partida.idsCartasVistas, ...ofertaActiva.opciones.map((carta) => carta.id)],
    rerollDisponible: false,
    informeScouting: null,
    ofertaActiva,
  };
}

/** Revela una señal ponderada sobre la oferta que seguirá al pick actual. */
export function usarScouting({ catalogo, partida }: UsarScoutingInput): EstadoPartida {
  if (partida.completada || partida.numeroDePick === PLAZAS_4_3_3.length) {
    throw new Error("No hay un próximo roll para anticipar.");
  }

  if (!partida.scoutingDisponible) {
    throw new Error("El scouting ya fue utilizado en esta partida.");
  }

  const proximaOferta = generarOferta({
    catalogo,
    seed: partida.seed,
    numeroDePick: partida.numeroDePick + 1,
    contextosAgotados: [...partida.contextosAgotados, partida.ofertaActiva.contexto],
    idsCartasVistas: partida.idsCartasVistas,
    pasoDeProteccion: obtenerPasoDeProteccion(partida.planDeProteccion, partida.numeroDePick + 1),
  });
  const informeScouting = crearInformeScouting(
    proximaOferta,
    crearGeneradorSeeded(`${partida.seed}|scouting|${partida.numeroDePick}`),
  );

  return {
    ...partida,
    scoutingDisponible: false,
    informeScouting,
  };
}

interface CeldaElegible {
  contexto: ContextoDeRoll;
  cartas: readonly Carta[];
}

interface GenerarOfertaInput {
  catalogo: Catalogo;
  seed: string;
  numeroDePick: number;
  contextosAgotados: readonly ContextoDeRoll[];
  idsCartasVistas: readonly string[];
  contextoForzado?: ContextoDeRoll;
  pasoDeProteccion?: PasoDeProteccionPosicional | undefined;
}

function generarOferta({
  catalogo,
  seed,
  numeroDePick,
  contextosAgotados,
  idsCartasVistas,
  contextoForzado,
  pasoDeProteccion,
}: GenerarOfertaInput): Oferta {
  const cantidadDeOpciones = cantidadDeOpcionesParaPick(numeroDePick);
  const idsVistos = new Set(idsCartasVistas);
  const clavesAgotadas = new Set(contextosAgotados.map(({ pais, cicloMundial }) => crearClaveDeContexto(pais, cicloMundial)));
  const cartasIneditas = catalogo.cartas.filter((carta) => !idsVistos.has(carta.id));
  const celdasElegibles = obtenerCeldasElegibles(cartasIneditas, cantidadDeOpciones).filter(({ contexto }) => {
    return !clavesAgotadas.has(crearClaveDeContexto(contexto.pais, contexto.cicloMundial));
  });

  if (celdasElegibles.length === 0) {
    throw new Error("No quedan contextos país-ciclo elegibles para generar una oferta.");
  }

  const aleatorio = crearGeneradorSeeded(`${seed}|pick|${numeroDePick}`);
  const contextoObjetivo = contextoForzado ?? pasoDeProteccion?.contexto;
  const celda = contextoObjetivo
    ? celdasElegibles.find(({ contexto }) => {
        return (
          contexto.pais === contextoObjetivo.pais && contexto.cicloMundial === contextoObjetivo.cicloMundial
        );
      })
    : celdasElegibles[Math.floor(aleatorio() * celdasElegibles.length)];

  if (!celda) {
    throw new Error("No hay suficientes cartas inéditas para generar la oferta del contexto activo.");
  }

  return {
    contexto: celda.contexto,
    opciones: seleccionarOfertaConProteccion(celda.cartas, cantidadDeOpciones, pasoDeProteccion, aleatorio),
  };
}

function cantidadDeOpcionesParaPick(numeroDePick: number): number {
  return numeroDePick === 4 || numeroDePick === 8 ? CANTIDAD_OPCIONES_ESPECIAL : CANTIDAD_OPCIONES_NORMAL;
}

function esPosicionPrioritariaDeCierre(posicion: Posicion): posicion is (typeof POSICIONES_PRIORITARIAS_DE_CIERRE)[number] {
  return (POSICIONES_PRIORITARIAS_DE_CIERRE as readonly Posicion[]).includes(posicion);
}

function seleccionarPosicionesPendientes(
  cartas: readonly Carta[],
  oportunidadesPendientes: ReadonlyMap<Posicion, number>,
  capacidad: number,
  aleatorio: () => number,
): readonly Posicion[] {
  const posicionesDisponibles = [...new Set(cartas.map((carta) => carta.posicionPrimaria))].filter((posicion) => {
    return (oportunidadesPendientes.get(posicion) ?? 0) > 0;
  });

  return mezclar(posicionesDisponibles, aleatorio)
    .toSorted((izquierda, derecha) => {
      const diferencia = (oportunidadesPendientes.get(derecha) ?? 0) - (oportunidadesPendientes.get(izquierda) ?? 0);
      return diferencia;
    })
    .slice(0, capacidad);
}

function asignarVentanaFinal({
  celdas,
  usadas,
  prioridadesFinales,
  aleatorio,
}: {
  celdas: readonly CeldaElegible[];
  usadas: ReadonlySet<string>;
  prioridadesFinales: readonly Posicion[];
  aleatorio: () => number;
}): readonly PasoDeProteccionPosicional[] | null {
  const pasos: PasoDeProteccionPosicional[] = [];
  const clavesUsadas = new Set(usadas);

  for (const [indice, posicion] of prioridadesFinales.entries()) {
    const numeroDePick = 9 + indice;
    const capacidad = cantidadDeOpcionesParaPick(numeroDePick);
    const capacidadConReroll = capacidad * 2;
    const candidatas = mezclar(
      celdas.filter(({ contexto, cartas }) => {
        return (
          cartas.length >= capacidadConReroll &&
          !clavesUsadas.has(crearClaveDeContexto(contexto.pais, contexto.cicloMundial)) &&
          cartas.some((carta) => carta.posicionPrimaria === posicion)
        );
      }),
      aleatorio,
    );
    const candidata = candidatas[0];

    if (!candidata) {
      return null;
    }

    clavesUsadas.add(crearClaveDeContexto(candidata.contexto.pais, candidata.contexto.cicloMundial));
    pasos.push({ numeroDePick, contexto: candidata.contexto, posicionesProtegidas: [posicion] });
  }

  return pasos;
}

function mezclar<T>(valores: readonly T[], aleatorio: () => number): T[] {
  const resultado = [...valores];

  for (let indice = resultado.length - 1; indice > 0; indice -= 1) {
    const intercambio = Math.floor(aleatorio() * (indice + 1));
    const actual = resultado[indice];
    const siguiente = resultado[intercambio];

    if (actual !== undefined && siguiente !== undefined) {
      resultado[indice] = siguiente;
      resultado[intercambio] = actual;
    }
  }

  return resultado;
}

function obtenerCeldasElegibles(cartas: readonly Carta[], cantidadMinima: number): readonly CeldaElegible[] {
  const cartasPorContexto = new Map<string, Carta[]>();

  for (const carta of cartas) {
    const clave = crearClaveDeContexto(carta.pais, carta.cicloMundial);
    const candidatas = cartasPorContexto.get(clave) ?? [];
    candidatas.push(carta);
    cartasPorContexto.set(clave, candidatas);
  }

  return [...cartasPorContexto.entries()]
    .map(([clave, candidatas]) => {
      const [pais, cicloMundial] = clave.split("|") as [string, CicloMundial];
      return {
        contexto: { pais, cicloMundial },
        cartas: candidatas.toSorted((izquierda, derecha) => izquierda.id.localeCompare(derecha.id)),
      };
    })
    .filter(({ cartas: candidatas }) => candidatas.length >= cantidadMinima)
    .toSorted((izquierda, derecha) => {
      return crearClaveDeContexto(izquierda.contexto.pais, izquierda.contexto.cicloMundial).localeCompare(
        crearClaveDeContexto(derecha.contexto.pais, derecha.contexto.cicloMundial),
      );
    });
}

function seleccionarSinRepetir(
  candidatas: readonly Carta[],
  cantidad: number,
  aleatorio: () => number,
): readonly Carta[] {
  const disponibles = [...candidatas];
  const seleccionadas: Carta[] = [];

  while (seleccionadas.length < cantidad) {
    const indice = Math.floor(aleatorio() * disponibles.length);
    const [carta] = disponibles.splice(indice, 1);

    if (!carta) {
      throw new Error("No se pudo seleccionar una carta elegible.");
    }

    seleccionadas.push(carta);
  }

  return seleccionadas;
}

function seleccionarOfertaConProteccion(
  candidatas: readonly Carta[],
  cantidad: number,
  pasoDeProteccion: PasoDeProteccionPosicional | undefined,
  aleatorio: () => number,
): readonly Carta[] {
  const posicionesProtegidas = pasoDeProteccion?.posicionesProtegidas ?? [];

  if (posicionesProtegidas.length > cantidad) {
    throw new Error("El plan de protección excede la capacidad de la oferta.");
  }

  const seleccionadas: Carta[] = [];
  for (const posicion of posicionesProtegidas) {
    const candidatasDePosicion = candidatas.filter((carta) => {
      return carta.posicionPrimaria === posicion && !seleccionadas.some((seleccionada) => seleccionada.id === carta.id);
    });
    if (candidatasDePosicion.length === 0) {
      throw new Error(`El contexto planificado no contiene una carta primaria ${posicion}.`);
    }

    const candidata = seleccionarSinRepetir(candidatasDePosicion, 1, aleatorio)[0];

    if (!candidata) {
      throw new Error(`No se pudo seleccionar la carta primaria ${posicion}.`);
    }

    seleccionadas.push(candidata);
  }

  return [...seleccionadas, ...seleccionarSinRepetir(
    candidatas.filter((carta) => !seleccionadas.some((seleccionada) => seleccionada.id === carta.id)),
    cantidad - seleccionadas.length,
    aleatorio,
  )];
}

function obtenerPasoDeProteccion(
  planDeProteccion: readonly PasoDeProteccionPosicional[],
  numeroDePick: number,
): PasoDeProteccionPosicional | undefined {
  const paso = planDeProteccion.find((candidato) => candidato.numeroDePick === numeroDePick);

  if (paso && paso.numeroDePick !== numeroDePick) {
    throw new Error(`El plan de protección no corresponde al pick ${numeroDePick}.`);
  }

  return paso;
}

function crearClaveDeContexto(pais: string, cicloMundial: CicloMundial): string {
  return `${pais}|${cicloMundial}`;
}

function crearInformeScouting(oferta: Oferta, aleatorio: () => number): InformeScouting {
  const carta = oferta.opciones[Math.floor(aleatorio() * oferta.opciones.length)];

  if (!carta) {
    throw new Error("No se puede crear scouting sin opciones.");
  }

  const potencia = aleatorio();

  if (potencia < 0.5) {
    return { tipo: "contexto", contexto: oferta.contexto };
  }

  if (potencia < 0.8) {
    return { tipo: "posicion_y_rasgo", posicion: carta.posicionPrimaria, rasgo: carta.rasgo };
  }

  if (potencia < 0.95) {
    return {
      tipo: "perfil_sin_identidad",
      perfil: {
        pais: carta.pais,
        club: carta.club,
        cicloMundial: carta.cicloMundial,
        posicionPrimaria: carta.posicionPrimaria,
        ovr: carta.ovr,
        rasgo: carta.rasgo,
      },
    };
  }

  return { tipo: "carta_exacta", carta };
}

function crearGeneradorSeeded(seed: string): () => number {
  let estado = 2_166_136_261;

  for (let indice = 0; indice < seed.length; indice += 1) {
    estado ^= seed.charCodeAt(indice);
    estado = Math.imul(estado, 16_777_619);
  }

  return () => {
    estado += 0x6d2b79f5;
    let resultado = estado;
    resultado = Math.imul(resultado ^ (resultado >>> 15), resultado | 1);
    resultado ^= resultado + Math.imul(resultado ^ (resultado >>> 7), resultado | 61);
    return ((resultado ^ (resultado >>> 14)) >>> 0) / 4_294_967_296;
  };
}
