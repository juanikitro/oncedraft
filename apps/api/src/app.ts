import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyBaseLogger, type FastifyInstance, type FastifyServerOptions } from "fastify";

import {
  crearRepositorioDeCuentasEnMemoria,
  type RepositorioDeCuentas,
  EmailYaExisteError,
  RunDesactualizadaError,
  RunEnConflictoError,
  validarPerfilInvitado,
  validarGuardarRun,
  validarRecordPersonal,
  validarRegistro,
} from "./accounts.js";
import { crearTokenDeSesion, hashearPassword, hashTokenDeSesion, verificarPassword } from "./auth.js";

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
};

export async function buildServer(opciones: OpcionesDeApp = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: opciones.logger ?? true });
  const repositorio = opciones.repositorio ?? crearRepositorioDeCuentasEnMemoria();
  const ahora = opciones.ahora ?? (() => new Date());

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
    if (error instanceof Error && error.message.startsWith("El ")) {
      return reply.status(400).send({ error: { code: "VALIDATION_ERROR", message: error.message } });
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
  });

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
