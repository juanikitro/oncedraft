import { randomUUID } from "node:crypto";

import {
  confirmarPick,
  iniciarPartidaConProteccion,
  reorganizarPartida,
  usarReroll,
  usarScouting,
  type Catalogo,
  type EstadoPartida,
  type IdPlaza,
} from "@draft/game-core";

export const ZONA_HORARIA_ARGENTINA = "America/Argentina/Buenos_Aires";
export const PUNTOS_POR_PUESTO: Readonly<Record<number, number>> = { 1: 10, 2: 6, 3: 3 };

export type EstadoIntentoDiario = "active" | "completed" | "expired";
export type AccionDiaria =
  | { tipo: "pick"; idCarta: string; idPlazaDestino?: IdPlaza }
  | { tipo: "reroll" }
  | { tipo: "scouting" }
  | { tipo: "move"; idCarta: string; idPlazaDestino: IdPlaza };

export type DesafioDiario = {
  id: string;
  fecha: string;
  versionCatalogo: string;
  versionReglas: string;
  seed: string;
  iniciaEn: Date;
  limiteInicioEn: Date;
  cierraEn: Date;
  finalizadoEn: Date | null;
};

export type IntentoDiario = {
  id: string;
  desafioId: string;
  cuentaId: string;
  estado: EstadoIntentoDiario;
  partida: EstadoPartida;
  version: number;
  puntaje: number | null;
  iniciadoEn: Date;
  completadoEn: Date | null;
};

export type PremioDiario = {
  desafioId: string;
  cuentaId: string;
  puesto: number;
  puntos: number;
  puntaje: number;
};

export type EstadoDiarioPublico = {
  fecha: string;
  estado: EstadoIntentoDiario;
  partida: EstadoPartida;
  version: number;
  cierraEn: string;
  puestoProvisional: number | null;
};

export type FilaRankingDiario = {
  puesto: number;
  username: string;
  puntaje?: number;
  puntos?: number;
  esPropio: boolean;
};

export type RankingDiario = {
  tipo: "hoy" | "ayer" | "ultimos_31_dias";
  desde: string;
  hasta: string;
  filas: readonly FilaRankingDiario[];
};

export class DraftDiarioNoDisponibleError extends Error {
  constructor(message = "El Draft diario no está disponible en este momento.") {
    super(message);
  }
}

export class IntentoDiarioConsumidoError extends Error {
  constructor() {
    super("Ya usaste el intento competitivo de este Draft diario.");
  }
}

export class IntentoDiarioVencidoError extends Error {
  constructor() {
    super("El Draft diario ya cerró.");
  }
}

export class AccionDiariaDesactualizadaError extends Error {
  constructor() {
    super("La partida diaria cambió en otro dispositivo. Recuperá el estado confirmado.");
  }
}

export interface RepositorioDeDraftDiario {
  iniciarIntento(cuentaId: string, ahora: Date): Promise<EstadoDiarioPublico>;
  obtenerIntento(cuentaId: string, ahora: Date): Promise<EstadoDiarioPublico | null>;
  aplicarAccion(input: {
    cuentaId: string;
    version: number;
    idempotencyKey: string;
    accion: AccionDiaria;
    ahora: Date;
  }): Promise<EstadoDiarioPublico>;
  obtenerRanking(tipo: RankingDiario["tipo"], ahora: Date, cuentaId?: string): Promise<RankingDiario>;
  registrarEventoDeCuenta(cuentaId: string, tipo: "resumed", ahora: Date): Promise<void>;
  finalizarDesafiosVencidos(ahora: Date): Promise<void>;
}

type CuentaPublica = { id: string; username: string };
type AccionGuardada = { estado: EstadoDiarioPublico };

/**
 * Repositorio de referencia para pruebas de la API. La implementación de
 * PostgreSQL conserva las mismas reglas, pero con locks y constraints reales.
 */
export function crearRepositorioDeDraftDiarioEnMemoria(catalogos: readonly Catalogo[], cuentas: () => Promise<readonly CuentaPublica[]>): RepositorioDeDraftDiario {
  const desafios = new Map<string, DesafioDiario>();
  const intentos = new Map<string, IntentoDiario>();
  const premios = new Map<string, PremioDiario>();
  const acciones = new Map<string, AccionGuardada>();

  const catalogoPorVersion = (version: string): Catalogo => {
    const catalogo = catalogos.find((candidato) => candidato.version === version);
    if (!catalogo) throw new DraftDiarioNoDisponibleError("No hay un catálogo activo para el Draft diario.");
    return catalogo;
  };
  const desafioDeHoy = (ahora: Date): DesafioDiario => {
    const fecha = fechaArgentina(ahora);
    const existente = desafios.get(fecha);
    if (existente) return existente;
    const catalogo = catalogos.at(-1);
    if (!catalogo) throw new DraftDiarioNoDisponibleError("No hay un catálogo activo para el Draft diario.");
    const limites = limitesDelDiaArgentina(fecha);
    const desafio: DesafioDiario = {
      id: randomUUID(), fecha, versionCatalogo: catalogo.version, versionReglas: "game-core-0.1.0", seed: randomUUID(),
      iniciaEn: limites.iniciaEn, limiteInicioEn: limites.limiteInicioEn, cierraEn: limites.cierraEn, finalizadoEn: null,
    };
    desafios.set(fecha, desafio);
    return desafio;
  };
  const desafioPorFecha = (fecha: string): DesafioDiario | null => desafios.get(fecha) ?? null;
  const intentoPorCuentaYDesafio = (cuentaId: string, desafioId: string): IntentoDiario | null =>
    [...intentos.values()].find((intento) => intento.cuentaId === cuentaId && intento.desafioId === desafioId) ?? null;
  const puestoActual = (desafioId: string, cuentaId: string): number | null => filasDeDesafio(desafioId).find((fila) => fila.cuentaId === cuentaId)?.puesto ?? null;
  const publicar = (intento: IntentoDiario, desafio: DesafioDiario): EstadoDiarioPublico => ({
    fecha: desafio.fecha, estado: intento.estado, partida: ocultarSemillas(intento.partida), version: intento.version,
    cierraEn: desafio.cierraEn.toISOString(), puestoProvisional: intento.estado === "completed" ? puestoActual(desafio.id, intento.cuentaId) : null,
  });
  const filasDeDesafio = (desafioId: string): Array<{ cuentaId: string; puntaje: number; puesto: number }> => {
    const completados = [...intentos.values()]
      .filter((intento) => intento.desafioId === desafioId && intento.estado === "completed" && intento.puntaje !== null)
      .sort((izquierda, derecha) => (derecha.puntaje! - izquierda.puntaje!) || izquierda.completadoEn!.getTime() - derecha.completadoEn!.getTime());
    let anterior: number | null = null;
    let puesto = 0;
    return completados.map((intento, indice) => {
      if (anterior === null || anterior !== intento.puntaje) puesto = indice + 1;
      anterior = intento.puntaje;
      return { cuentaId: intento.cuentaId, puntaje: intento.puntaje!, puesto };
    });
  };

  return {
    async iniciarIntento(cuentaId, ahora) {
      await this.finalizarDesafiosVencidos(ahora);
      const desafio = desafioDeHoy(ahora);
      if (ahora < desafio.iniciaEn || ahora > desafio.limiteInicioEn || desafio.finalizadoEn) throw new DraftDiarioNoDisponibleError("El inicio del Draft diario cerró a las 23:54 ART.");
      const existente = intentoPorCuentaYDesafio(cuentaId, desafio.id);
      if (existente) {
        if (existente.estado === "active") return publicar(existente, desafio);
        throw new IntentoDiarioConsumidoError();
      }
      const partida = iniciarPartidaConProteccion({ catalogo: catalogoPorVersion(desafio.versionCatalogo), seed: desafio.seed });
      const intento: IntentoDiario = { id: randomUUID(), desafioId: desafio.id, cuentaId, estado: "active", partida, version: 0, puntaje: null, iniciadoEn: ahora, completadoEn: null };
      intentos.set(intento.id, intento);
      return publicar(intento, desafio);
    },

    async obtenerIntento(cuentaId, ahora) {
      await this.finalizarDesafiosVencidos(ahora);
      const desafio = desafioPorFecha(fechaArgentina(ahora));
      if (!desafio) return null;
      const intento = intentoPorCuentaYDesafio(cuentaId, desafio.id);
      return intento ? publicar(intento, desafio) : null;
    },

    async aplicarAccion({ cuentaId, version, idempotencyKey, accion, ahora }) {
      await this.finalizarDesafiosVencidos(ahora);
      const desafio = desafioPorFecha(fechaArgentina(ahora));
      if (!desafio) throw new DraftDiarioNoDisponibleError();
      const intento = intentoPorCuentaYDesafio(cuentaId, desafio.id);
      if (!intento) throw new DraftDiarioNoDisponibleError("Primero iniciá tu intento competitivo.");
      const claveAccion = `${intento.id}|${idempotencyKey}`;
      const repetida = acciones.get(claveAccion);
      if (repetida) return repetida.estado;
      if (intento.estado !== "active" || ahora >= desafio.cierraEn) throw new IntentoDiarioVencidoError();
      if (intento.version !== version) throw new AccionDiariaDesactualizadaError();
      const siguiente = aplicarAccion({ catalogo: catalogoPorVersion(desafio.versionCatalogo), partida: intento.partida, accion });
      const actualizado: IntentoDiario = {
        ...intento, partida: siguiente, version: intento.version + 1,
        estado: siguiente.completada ? "completed" : "active",
        puntaje: siguiente.resultado?.puntaje ?? null,
        completadoEn: siguiente.completada ? ahora : null,
      };
      intentos.set(actualizado.id, actualizado);
      const estado = publicar(actualizado, desafio);
      acciones.set(claveAccion, { estado });
      return estado;
    },

    async obtenerRanking(tipo, ahora, cuentaId) {
      await this.finalizarDesafiosVencidos(ahora);
      const cuentasPublicas = await cuentas();
      const hoy = fechaArgentina(ahora);
      const fecha = tipo === "hoy" ? hoy : restarDias(hoy, 1);
      if (tipo === "ultimos_31_dias") {
        const desde = restarDias(hoy, 30);
        const puntosPorCuenta = new Map<string, number>();
        for (const premio of premios.values()) {
          const desafio = [...desafios.values()].find((candidato) => candidato.id === premio.desafioId);
          if (desafio && desafio.fecha >= desde && desafio.fecha <= hoy) puntosPorCuenta.set(premio.cuentaId, (puntosPorCuenta.get(premio.cuentaId) ?? 0) + premio.puntos);
        }
        const ordenadas = [...puntosPorCuenta.entries()].sort((a, b) => b[1] - a[1]);
        let anterior: number | null = null;
        let puesto = 0;
        return {
          tipo, desde, hasta: hoy,
          filas: ordenadas.map(([id, puntos], indice) => {
            if (anterior === null || anterior !== puntos) puesto = indice + 1;
            anterior = puntos;
            return { puesto, username: cuentasPublicas.find((cuenta) => cuenta.id === id)?.username ?? "Jugador", puntos, esPropio: id === cuentaId };
          }),
        };
      }
      const desafio = desafioPorFecha(fecha);
      return {
        tipo, desde: fecha, hasta: fecha,
        filas: desafio ? filasDeDesafio(desafio.id).map((fila) => ({
          puesto: fila.puesto, username: cuentasPublicas.find((cuenta) => cuenta.id === fila.cuentaId)?.username ?? "Jugador",
          puntaje: fila.puntaje, esPropio: fila.cuentaId === cuentaId,
        })) : [],
      };
    },

    async registrarEventoDeCuenta() {
      // El repositorio en memoria sólo existe para pruebas de contrato.
    },

    async finalizarDesafiosVencidos(ahora) {
      for (const desafio of desafios.values()) {
        if (desafio.finalizadoEn || desafio.cierraEn > ahora) continue;
        for (const intento of intentos.values()) {
          if (intento.desafioId === desafio.id && intento.estado === "active") intentos.set(intento.id, { ...intento, estado: "expired" });
        }
        for (const fila of filasDeDesafio(desafio.id)) {
          const puntos = PUNTOS_POR_PUESTO[fila.puesto];
          if (puntos !== undefined) premios.set(`${desafio.id}|${fila.cuentaId}`, { desafioId: desafio.id, cuentaId: fila.cuentaId, puesto: fila.puesto, puntos, puntaje: fila.puntaje });
        }
        desafios.set(desafio.fecha, { ...desafio, finalizadoEn: ahora });
      }
    },
  };
}

export function aplicarAccion({ catalogo, partida, accion }: { catalogo: Catalogo; partida: EstadoPartida; accion: AccionDiaria }): EstadoPartida {
  switch (accion.tipo) {
    case "pick": return confirmarPick({ catalogo, partida, idCartaElegida: accion.idCarta, ...(accion.idPlazaDestino ? { idPlazaDestino: accion.idPlazaDestino } : {}) });
    case "reroll": return usarReroll({ catalogo, partida });
    case "scouting": return usarScouting({ catalogo, partida });
    case "move":
      if (partida.completada) throw new Error("No se puede reorganizar una partida diaria terminada.");
      return reorganizarPartida({ partida, idCarta: accion.idCarta, idPlazaDestino: accion.idPlazaDestino });
  }
}

/** El seed y el plan futuro son privados: el cliente sólo recibe la oferta presente. */
export function ocultarSemillas(partida: EstadoPartida): EstadoPartida {
  return { ...partida, seed: "servidor", planDeProteccion: [] };
}

export function fechaArgentina(instante: Date): string {
  const partes = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA_HORARIA_ARGENTINA, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instante);
  const valor = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

export function limitesDelDiaArgentina(fecha: string): { iniciaEn: Date; limiteInicioEn: Date; cierraEn: Date } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new Error("La fecha del Draft diario no es válida.");
  const iniciaEn = new Date(`${fecha}T03:00:00.000Z`);
  const cierraEn = new Date(iniciaEn.getTime() + 24 * 60 * 60 * 1_000);
  return { iniciaEn, limiteInicioEn: new Date(cierraEn.getTime() - 6 * 60 * 1_000), cierraEn };
}

export function restarDias(fecha: string, dias: number): string {
  const base = new Date(`${fecha}T12:00:00.000Z`);
  base.setUTCDate(base.getUTCDate() - dias);
  return base.toISOString().slice(0, 10);
}
