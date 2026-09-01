import type { EstadoPartida } from "@draft/game-core";

export type UsuarioAutenticado = { email: string; username: string };
export type CodigoDeErrorApi = "EMAIL_TAKEN" | "VALIDATION_ERROR" | "UNAUTHENTICATED" | "RATE_LIMITED" | "STALE_RUN" | "RUN_CONFLICT" | "INVALID_ORIGIN" | "INTERNAL_ERROR";

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

export async function registrar(email: string, password: string): Promise<UsuarioAutenticado> {
  return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/auth/register", { email, password }, "POST")).usuario;
}

export async function iniciarSesion(email: string, password: string): Promise<UsuarioAutenticado> {
  return (await solicitar<{ usuario: UsuarioAutenticado }>("/api/v1/auth/login", { email, password }, "POST")).usuario;
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
  return typeof valor === "string" && ["EMAIL_TAKEN", "VALIDATION_ERROR", "UNAUTHENTICATED", "RATE_LIMITED", "STALE_RUN", "RUN_CONFLICT", "INVALID_ORIGIN", "INTERNAL_ERROR"].includes(valor);
}
