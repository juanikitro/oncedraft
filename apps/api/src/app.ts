import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyBaseLogger, type FastifyInstance, type FastifyReply, type FastifyServerOptions } from "fastify";

import {
  crearRepositorioDeCuentasEnMemoria,
  type RepositorioDeCuentas,
  type Usuario,
  EmailYaExisteError,
  RunDesactualizadaError,
  RunEnConflictoError,
  validarPerfilInvitado,
  validarGuardarRun,
  validarRecordPersonal,
  validarRegistro,
} from "./accounts.js";
import { crearTokenDeSesion, hashearPassword, hashTokenDeSesion, verificarPassword } from "./auth.js";
import {
  AccionDiariaDesactualizadaError,
  DraftDiarioNoDisponibleError,
  IntentoDiarioConsumidoError,
  IntentoDiarioVencidoError,
  type AccionDiaria,
  type RepositorioDeDraftDiario,
} from "./daily-drafts.js";

const NOMBRE_COOKIE_SESION = "draft_session";
const DURACION_SESION_MS = 1000 * 60 * 60 * 24 * 30;

class NoAutenticadoError extends Error {
  constructor() {
    super("Se requiere una sesión válida.");
  }
}

type OpcionesDeApp = {
  logger?: FastifyServerOptions["logger"] | FastifyBaseLogger | boolean;
  repositorio?: RepositorioDeCuentas;
  ahora?: () => Date;
  cookieSecure?: boolean;
  apiOrigin?: string;
  repositorioDiario?: RepositorioDeDraftDiario;
  cronSecret?: string;
};

export async function buildServer(opciones: OpcionesDeApp = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: opciones.logger ?? true });
  const repositorio = opciones.repositorio ?? crearRepositorioDeCuentasEnMemoria();
  const ahora = opciones.ahora ?? (() => new Date());
  const repositorioDiario = opciones.repositorioDiario;

  await app.register(cookie);
  await app.register(rateLimit, { global: false });

  app.addHook("onRequest", async (request, reply) => {
    if (!opciones.apiOrigin || !["POST", "PUT", "PATCH", "DELETE"].includes(request.method)) return;
    if (request.headers.origin !== opciones.apiOrigin) {
      return reply.status(403).send({ error: { code: "INVALID_ORIGIN", message: "El origen de la solicitud no está permitido." } });
    }
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof EmailYaExisteError) {
      return reply.status(409).send({ error: { code: "EMAIL_TAKEN", message: error.message } });
    }
    if (error instanceof NoAutenticadoError) {
      return reply.status(401).send({ error: { code: "UNAUTHENTICATED", message: error.message } });
    }
    if (error instanceof RunDesactualizadaError) {
      return reply.status(409).send({ error: { code: "STALE_RUN", message: error.message } });
    }
    if (error instanceof RunEnConflictoError) {
      return reply.status(409).send({ error: { code: "RUN_CONFLICT", message: error.message } });
    }
    if (error instanceof DraftDiarioNoDisponibleError) {
      return reply.status(409).send({ error: { code: "DAILY_UNAVAILABLE", message: error.message } });
    }
    if (error instanceof IntentoDiarioConsumidoError) {
      return reply.status(409).send({ error: { code: "DAILY_ATTEMPT_USED", message: error.message } });
    }
    if (error instanceof IntentoDiarioVencidoError) {
      return reply.status(409).send({ error: { code: "DAILY_CLOSED", message: error.message } });
    }
    if (error instanceof AccionDiariaDesactualizadaError) {
      return reply.status(409).send({ error: { code: "DAILY_STALE_ACTION", message: error.message } });
    }
    if (error instanceof Error && /^(El|La) /.test(error.message)) {
      return reply.status(400).send({ error: { code: "VALIDATION_ERROR", message: error.message } });
    }
    if (tieneStatusCode(error, 429)) {
      return reply.status(429).send({
        error: { code: "RATE_LIMITED", message: "Demasiados intentos. Probá de nuevo en un momento." },
      });
    }

    app.log.error(error);
    return reply.status(500).send({ error: { code: "INTERNAL_ERROR", message: "Ocurrió un error inesperado." } });
  });

  app.get("/health", async (_request, reply) => {
    if (!(await repositorio.verificarDisponibilidad())) {
      return reply.status(503).send({ status: "unavailable", dependency: "database" });
    }
    return { status: "ok" };
  });

  app.post("/v1/auth/register", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    const { email, username, password } = validarRegistro(request.body);
    const usuario = await repositorio.crearUsuario({ email, username, passwordHash: await hashearPassword(password) });
    const fechaActual = ahora();
    const { token, tokenHash } = crearTokenDeSesion();
    const expiraEn = new Date(fechaActual.getTime() + DURACION_SESION_MS);

    await repositorio.crearSesion({ tokenHash, usuarioId: usuario.id, expiraEn, revocadaEn: null });
    reply.setCookie(NOMBRE_COOKIE_SESION, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: opciones.cookieSecure ?? false,
      path: "/api",
      expires: expiraEn,
    });
    return reply.status(201).send({ usuario: serializarUsuario(usuario) });
  });

  app.post("/v1/auth/login", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    const { email, password } = validarRegistro(request.body);
    const usuario = await repositorio.buscarUsuarioPorEmail(email);
    if (!usuario || !(await verificarPassword(usuario.passwordHash, password))) {
      throw new NoAutenticadoError();
    }

    return crearSesionDeUsuario(usuario, reply);
  });

  app.post("/v1/auth/access", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    const { email, username, password } = validarRegistro(request.body);
    let usuario = await repositorio.buscarUsuarioPorEmail(email);

    if (usuario) {
      if (!(await verificarPassword(usuario.passwordHash, password))) throw new NoAutenticadoError();
      return crearSesionDeUsuario(usuario, reply);
    }

    try {
      usuario = await repositorio.crearUsuario({ email, username, passwordHash: await hashearPassword(password) });
    } catch (error) {
      if (!(error instanceof EmailYaExisteError)) throw error;
      usuario = await repositorio.buscarUsuarioPorEmail(email);
      if (!usuario || !(await verificarPassword(usuario.passwordHash, password))) throw new NoAutenticadoError();
    }

    return crearSesionDeUsuario(usuario, reply);
  });

  async function crearSesionDeUsuario(usuario: Usuario, reply: FastifyReply): Promise<{ usuario: ReturnType<typeof serializarUsuario> }> {
    const fechaActual = ahora();
    const { token, tokenHash } = crearTokenDeSesion();
    const expiraEn = new Date(fechaActual.getTime() + DURACION_SESION_MS);
    await repositorio.crearSesion({ tokenHash, usuarioId: usuario.id, expiraEn, revocadaEn: null });
    reply.setCookie(NOMBRE_COOKIE_SESION, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: opciones.cookieSecure ?? false,
      path: "/api",
      expires: expiraEn,
    });
    return { usuario: serializarUsuario(usuario) };
  }

  app.post("/v1/auth/logout", async (request, reply) => {
    const token = request.cookies[NOMBRE_COOKIE_SESION];
    if (token) {
      await repositorio.revocarSesion(hashTokenDeSesion(token), ahora());
    }
    reply.clearCookie(NOMBRE_COOKIE_SESION, { path: "/api", secure: opciones.cookieSecure ?? false, sameSite: "lax" });
    return reply.status(204).send();
  });

  app.get("/v1/me", async (request) => {
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    const progreso = await repositorio.obtenerProgreso(usuario.id);
    return { usuario: serializarUsuario(usuario), ...progreso };
  });

  app.get("/v1/me/state", async (request, reply) => {
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    reply.header("Cache-Control", "no-store");
    return repositorio.obtenerEstado(usuario.id);
  });

  app.put("/v1/me/runs/:guestRunId", async (request, reply) => {
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    const parametros = request.params as { guestRunId?: unknown };
    const guestRunId = typeof parametros.guestRunId === "string" ? parametros.guestRunId : "";
    const estado = await repositorio.guardarRun(usuario.id, validarGuardarRun(guestRunId, request.body));
    reply.header("Cache-Control", "no-store");
    return estado;
  });

  app.put("/v1/me/personal-best", async (request) => {
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    const score = validarRecordPersonal(request.body);
    return repositorio.guardarRecordPersonal(usuario.id, score);
  });

  app.post("/v1/me/merge-guest", async (request) => {
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    const invitado = validarPerfilInvitado(request.body);
    if (invitado.personalBest === null) {
      return repositorio.obtenerProgreso(usuario.id);
    }
    return repositorio.guardarRecordPersonal(usuario.id, invitado.personalBest);
  });

  app.get("/v1/daily/rankings/:scope", async (request) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    const parametros = request.params as { scope?: unknown };
    const scope = normalizarScopeRanking(parametros.scope);
    const usuario = await obtenerUsuarioOpcional(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    return diario.obtenerRanking(scope, ahora(), usuario?.id);
  });

  app.get("/v1/me/daily", async (request, reply) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    reply.header("Cache-Control", "no-store");
    return diario.obtenerIntento(usuario.id, ahora());
  });

  app.post("/v1/me/daily/start", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    reply.header("Cache-Control", "no-store");
    return diario.iniciarIntento(usuario.id, ahora());
  });

  app.post("/v1/me/daily/actions", { config: { rateLimit: { max: 60, timeWindow: "1 minute" } } }, async (request, reply) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    const input = validarAccionDiaria(request.body);
    reply.header("Cache-Control", "no-store");
    return diario.aplicarAccion({ cuentaId: usuario.id, ahora: ahora(), ...input });
  });

  app.post("/v1/me/daily/events", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, async (request, reply) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    const usuario = await obtenerUsuarioAutenticado(request.cookies[NOMBRE_COOKIE_SESION], repositorio, ahora);
    if (typeof request.body !== "object" || request.body === null || (request.body as { tipo?: unknown }).tipo !== "resumed") {
      throw new Error("El evento diario no es válido.");
    }
    await diario.registrarEventoDeCuenta(usuario.id, "resumed", ahora());
    return reply.status(204).send();
  });

  app.get("/v1/internal/daily/finalize", async (request, reply) => {
    const diario = exigirRepositorioDiario(repositorioDiario);
    if (!opciones.cronSecret || request.headers.authorization !== `Bearer ${opciones.cronSecret}`) {
      return reply.status(401).send({ error: { code: "UNAUTHORIZED_CRON", message: "No autorizado." } });
    }
    await diario.finalizarDesafiosVencidos(ahora());
    return { status: "ok" };
  });

  return app;
}

export { NOMBRE_COOKIE_SESION };

function serializarUsuario(usuario: { email: string; username: string }) {
  return { email: usuario.email, username: usuario.username };
}

function tieneStatusCode(error: unknown, statusCode: number): boolean {
  return typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === statusCode;
}

async function obtenerUsuarioAutenticado(
  token: string | undefined,
  repositorio: RepositorioDeCuentas,
  ahora: () => Date,
) {
  if (!token) {
    throw new NoAutenticadoError();
  }
  const sesion = await repositorio.buscarSesionActiva(hashTokenDeSesion(token), ahora());
  if (!sesion) {
    throw new NoAutenticadoError();
  }
  const usuario = await repositorio.buscarUsuarioPorId(sesion.usuarioId);
  if (!usuario) {
    throw new NoAutenticadoError();
  }
  return usuario;
}

async function obtenerUsuarioOpcional(
  token: string | undefined,
  repositorio: RepositorioDeCuentas,
  ahora: () => Date,
) {
  if (!token) return null;
  const sesion = await repositorio.buscarSesionActiva(hashTokenDeSesion(token), ahora());
  return sesion ? repositorio.buscarUsuarioPorId(sesion.usuarioId) : null;
}

function exigirRepositorioDiario(repositorio: RepositorioDeDraftDiario | undefined): RepositorioDeDraftDiario {
  if (!repositorio) throw new DraftDiarioNoDisponibleError("El Draft diario todavía no está configurado.");
  return repositorio;
}

function normalizarScopeRanking(valor: unknown): "hoy" | "ayer" | "ultimos_31_dias" {
  if (valor === "hoy" || valor === "ayer" || valor === "ultimos_31_dias") return valor;
  throw new Error("El ranking solicitado no es válido.");
}

function validarAccionDiaria(input: unknown): { version: number; idempotencyKey: string; accion: AccionDiaria } {
  if (typeof input !== "object" || input === null) throw new Error("La acción diaria no es válida.");
  const valor = input as Record<string, unknown>;
  if (!Number.isInteger(valor.version) || (valor.version as number) < 0) throw new Error("La versión de la acción no es válida.");
  if (typeof valor.idempotencyKey !== "string" || !esUuid(valor.idempotencyKey)) throw new Error("La clave de la acción no es válida.");
  if (typeof valor.accion !== "object" || valor.accion === null) throw new Error("La acción diaria no es válida.");
  const accion = valor.accion as Record<string, unknown>;
  if (accion.tipo === "reroll" || accion.tipo === "scouting") return { version: valor.version as number, idempotencyKey: valor.idempotencyKey, accion: { tipo: accion.tipo } };
  if (accion.tipo === "pick" && typeof accion.idCarta === "string" && (accion.idPlazaDestino === undefined || esIdPlaza(accion.idPlazaDestino))) {
    return { version: valor.version as number, idempotencyKey: valor.idempotencyKey, accion: { tipo: "pick", idCarta: accion.idCarta, ...(accion.idPlazaDestino ? { idPlazaDestino: accion.idPlazaDestino } : {}) } };
  }
  if (accion.tipo === "move" && typeof accion.idCarta === "string" && esIdPlaza(accion.idPlazaDestino)) {
    return { version: valor.version as number, idempotencyKey: valor.idempotencyKey, accion: { tipo: "move", idCarta: accion.idCarta, idPlazaDestino: accion.idPlazaDestino } };
  }
  throw new Error("La acción diaria no es válida.");
}

function esIdPlaza(valor: unknown): valor is Extract<AccionDiaria, { tipo: "move" }>["idPlazaDestino"] {
  return typeof valor === "string" && ["POR", "LD", "DFC-1", "DFC-2", "LI", "MC-1", "MC-2", "MC-3", "ED", "DC", "EI"].includes(valor);
}

function esUuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}
