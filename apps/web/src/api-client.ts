import type { EstadoPartida } from "@draft/game-core";

export type UsuarioAutenticado = { email: string; username: string };
export type CodigoDeErrorApi = "EMAIL_TAKEN" | "VALIDATION_ERROR" | "UNAUTHENTICATED" | "RATE_LIMITED" | "STALE_RUN" | "RUN_CONFLICT" | "INVALID_ORIGIN" | "INTERNAL_ERROR" | "DAILY_UNAVAILABLE" | "DAILY_ATTEMPT_USED" | "DAILY_CLOSED" | "DAILY_STALE_ACTION";

export class ErrorDeApi extends Error {
  constructor(public readonly code: CodigoDeErrorApi | "NETWORK", message: string, public readonly status?: number) {
    super(message);
  }
}

export type RunRemota = {
  guestRunId: string;
  catalogVersion: string;
  seed: string;
  snapshot: Record<string, unknown>;
  status: "active" | "completed" | "abandoned";
  clientRevision: number;
};

export type EstadoRemoto = {
  personalBest: number | null;
  runActiva: RunRemota | null;
  cartasVistas: readonly string[];
};

export type EstadoDiarioRemoto = {
  fecha: string;
  estado: "active" | "completed" | "expired";
  partida: EstadoPartida;
  version: number;
  cierraEn: string;
  puestoProvisional: number | null;
};

export type FilaRankingDiario = { puesto: number; username: string; puntaje?: number; puntos?: number; esPropio: boolean };
export type RankingDiario = { tipo: "hoy" | "ayer" | "ultimos_31_dias"; desde: string; hasta: string; filas: readonly FilaRankingDiario[] };
export type AccionDiaria =
  | { tipo: "pick"; idCarta: string; idPlazaDestino?: string }
  | { tipo: "reroll" }
  | { tipo: "scouting" }
  | { tipo: "move"; idCarta: string; idPlazaDestino: string };

export async function registrar(email: string, password: string): Promise<UsuarioAutenticado> {
  return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/auth/register", { email, password }, "POST")).usuario;
}

export async function iniciarSesion(email: string, password: string): Promise<UsuarioAutenticado> {
  return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/auth/login", { email, password }, "POST")).usuario;
}

export async function acceder(email: string, password: string): Promise<UsuarioAutenticado> {
  return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/auth/access", { email, password }, "POST")).usuario;
}

export async function cerrarSesion(): Promise<void> {
  await solicitar<void>("/api/v1/auth/logout", undefined, "POST");
}

export async function obtenerMiCuenta(): Promise<UsuarioAutenticado | null> {
  try {
    return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/me")).usuario;
  } catch (causa: unknown) {
    if (causa instanceof ErrorDeApi && causa.code === "UNAUTHENTICATED") return null;
    throw causa;
  }
}

export async function obtenerEstadoRemoto(): Promise<EstadoRemoto> {
  return solicitar<EstadoRemoto>("/api/v1/me/state");
}

export async function guardarRunRemota({ guestRunId, partida, clientRevision, cartasVistas, personalBest, status }: {
  guestRunId: string;
  partida: EstadoPartida;
  clientRevision: number;
  cartasVistas: readonly string[];
  personalBest: number | null;
  status: "active" | "completed";
}): Promise<EstadoRemoto> {
  return solicitar<EstadoRemoto>(`/api/v1/me/runs/${guestRunId}`, {
    catalogVersion: partida.versionCatalogo,
    seed: partida.seed,
    snapshot: partida,
    status,
    clientRevision,
    cartasVistas,
    personalBest,
  }, "PUT");
}

export async function obtenerRankingDiario(tipo: RankingDiario["tipo"]): Promise<RankingDiario> {
  return solicitar<RankingDiario>(`/api/v1/daily/rankings/${tipo}`);
}

export async function obtenerIntentoDiario(): Promise<EstadoDiarioRemoto | null> {
  return solicitar<EstadoDiarioRemoto | null>("/api/v1/me/daily");
}

export async function iniciarIntentoDiario(): Promise<EstadoDiarioRemoto> {
  return solicitar<EstadoDiarioRemoto>("/api/v1/me/daily/start", {}, "POST");
}

export async function ejecutarAccionDiaria(version: number, accion: AccionDiaria): Promise<EstadoDiarioRemoto> {
  return solicitar<EstadoDiarioRemoto>("/api/v1/me/daily/actions", {
    version,
    idempotencyKey: crypto.randomUUID(),
    accion,
  }, "POST");
}

export async function registrarReanudacionDiaria(): Promise<void> {
  await solicitar<void>("/api/v1/me/daily/events", { tipo: "resumed" }, "POST");
}

async function solicitar<T>(ruta: string, body?: unknown, metodo: "GET" | "POST" | "PUT" = "GET"): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      credentials: "same-origin",
      ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" } }),
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch {
    throw new ErrorDeApi("NETWORK", "No hay conexión con la cuenta.");
  }

  if (!respuesta.ok) {
    const error = (await respuesta.json().catch(() => null))?.error;
    throw new ErrorDeApi(esCodigoDeErrorApi(error?.code) ? error.code : "INTERNAL_ERROR", error?.message ?? "No se pudo comunicar con la cuenta.", respuesta.status);
  }
  if (respuesta.status === 204) return undefined as T;
  return await respuesta.json() as T;
}

function esCodigoDeErrorApi(valor: unknown): valor is CodigoDeErrorApi {
  return typeof valor === "string" && ["EMAIL_TAKEN", "VALIDATION_ERROR", "UNAUTHENTICATED", "RATE_LIMITED", "STALE_RUN", "RUN_CONFLICT", "INVALID_ORIGIN", "INTERNAL_ERROR", "DAILY_UNAVAILABLE", "DAILY_ATTEMPT_USED", "DAILY_CLOSED", "DAILY_STALE_ACTION"].includes(valor);
}
