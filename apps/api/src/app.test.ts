import { describe, expect, it } from "vitest";

import { buildServer } from "./app.js";
import { crearRepositorioDeCuentasEnMemoria } from "./accounts.js";

describe("API de cuentas", () => {
  it("declara no disponible si la persistencia no responde", async () => {
    const repositorioBase = crearRepositorioDeCuentasEnMemoria();
    const app = await buildServer({
      logger: false,
      repositorio: { ...repositorioBase, verificarDisponibilidad: async () => false },
    });

    const respuesta = await app.inject({ method: "GET", url: "/health" });

    expect(respuesta.statusCode).toBe(503);
    expect(respuesta.json()).toEqual({ status: "unavailable", dependency: "database" });
    await app.close();
  });

  it("registra una cuenta normalizando el email y deriva un username visible", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const respuesta = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "  Juani.Fulbo@Example.com ", password: "un-secreto-largo" },
    });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.json()).toMatchObject({
      usuario: { email: "juani.fulbo@example.com", username: "juani.fulbo" },
    });
    expect(respuesta.headers["set-cookie"]).toContain("draft_session=");

    await app.close();
  });

  it("rechaza email duplicado sin crear una segunda cuenta", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const payload = { email: "mismo.usuario@example.com", password: "un-secreto-largo" };

    expect((await app.inject({ method: "POST", url: "/v1/auth/register", payload })).statusCode).toBe(201);
    const duplicado = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { ...payload, email: "MISMO.USUARIO@EXAMPLE.COM" },
    });

    expect(duplicado.statusCode).toBe(409);
    expect(duplicado.json()).toMatchObject({ error: { code: "EMAIL_TAKEN" } });
    await app.close();
  });

  it("no revela si el email existe cuando la contraseña es inválida", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "existente@example.com", password: "un-secreto-largo" },
    });

    const deCuentaExistente = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "existente@example.com", password: "clave-equviocada" },
    });
    const deCuentaInexistente = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "ausente@example.com", password: "clave-equviocada" },
    });

    expect(deCuentaExistente.statusCode).toBe(401);
    expect(deCuentaInexistente.statusCode).toBe(401);
    expect(deCuentaExistente.json()).toEqual(deCuentaInexistente.json());
    await app.close();
  });

  it("inicia y cierra sesión sin permitir leer el perfil después", async () => {
    const repositorio = crearRepositorioDeCuentasEnMemoria();
    const app = await buildServer({ logger: false, repositorio });
    await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "capitan@example.com", password: "un-secreto-largo" },
    });

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { email: "CAPITAN@EXAMPLE.COM", password: "un-secreto-largo" },
    });
    const cookie = login.headers["set-cookie"];

    expect(login.statusCode).toBe(200);
    expect(cookie).toContain("draft_session=");

    const perfil = await app.inject({ method: "GET", url: "/v1/me", headers: { cookie } });
    expect(perfil.statusCode).toBe(200);
    expect(perfil.json()).toMatchObject({ usuario: { email: "capitan@example.com", username: "capitan" } });

    const logout = await app.inject({ method: "POST", url: "/v1/auth/logout", headers: { cookie } });
    expect(logout.statusCode).toBe(204);

    const perfilSinSesion = await app.inject({ method: "GET", url: "/v1/me", headers: { cookie } });
    expect(perfilSinSesion.statusCode).toBe(401);
    expect(perfilSinSesion.json()).toMatchObject({ error: { code: "UNAUTHENTICATED" } });

    await app.close();
  });

  it("limita los intentos repetidos de inicio de sesión", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const intento = () =>
      app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email: "sin_cuenta@example.com", password: "un-secreto-largo" },
      });

    for (let numero = 0; numero < 5; numero += 1) {
      expect((await intento()).statusCode).toBe(401);
    }
    expect((await intento()).statusCode).toBe(429);

    await app.close();
  });

  it("conserva solo el mejor Squad Score personal de una partida libre", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "recordista@example.com", password: "un-secreto-largo" },
    });
    const cookie = registro.headers["set-cookie"];

    const primerRecord = await app.inject({
      method: "PUT",
      url: "/v1/me/personal-best",
      headers: { cookie },
      payload: { score: 101.4 },
    });
    const recordMenor = await app.inject({
      method: "PUT",
      url: "/v1/me/personal-best",
      headers: { cookie },
      payload: { score: 95.2 },
    });
    const perfil = await app.inject({ method: "GET", url: "/v1/me", headers: { cookie } });

    expect(primerRecord.json()).toEqual({ personalBest: 101.4 });
    expect(recordMenor.json()).toEqual({ personalBest: 101.4 });
    expect(perfil.json()).toMatchObject({ personalBest: 101.4 });

    await app.close();
  });

  it("fusiona de forma idempotente el récord de un perfil invitado", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "invitado_a_cuenta@example.com", password: "un-secreto-largo" },
    });
    const cookie = registro.headers["set-cookie"];
    const invitado = { personalBest: 101.4 };

    const primeraFusion = await app.inject({
      method: "POST",
      url: "/v1/me/merge-guest",
      headers: { cookie },
      payload: invitado,
    });
    const segundaFusion = await app.inject({
      method: "POST",
      url: "/v1/me/merge-guest",
      headers: { cookie },
      payload: invitado,
    });

    expect(primeraFusion.json()).toEqual({ personalBest: 101.4 });
    expect(segundaFusion.json()).toEqual({ personalBest: 101.4 });
    await app.close();
  });

  it("persiste una run de invitado de forma idempotente y expone el estado de cuenta", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "run_idempotente@example.com", password: "un-secreto-largo" },
    });
    const cookie = registro.headers["set-cookie"];
    const payload = {
      catalogVersion: "active-151",
      seed: "libre-abc",
      snapshot: { numeroDePick: 3 },
      status: "active",
      clientRevision: 2,
      cartasVistas: ["messi", "maradona", "messi"],
      personalBest: null,
    };
    const url = "/v1/me/runs/ce8cae6e-6d10-4c7f-a75e-cf3b716c2d37";

    const primera = await app.inject({ method: "PUT", url, headers: { cookie }, payload });
    const reintento = await app.inject({ method: "PUT", url, headers: { cookie }, payload });
    const estado = await app.inject({ method: "GET", url: "/v1/me/state", headers: { cookie } });

    expect(primera.statusCode).toBe(200);
    expect(reintento.statusCode).toBe(200);
    expect(estado.json()).toMatchObject({
      runActiva: { guestRunId: "ce8cae6e-6d10-4c7f-a75e-cf3b716c2d37", clientRevision: 2 },
      cartasVistas: ["messi", "maradona"],
    });
    expect(estado.headers["cache-control"]).toBe("no-store");
    await app.close();
  });

  it("rechaza una revisión de run que llega tarde", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({ method: "POST", url: "/v1/auth/register", payload: { email: "run_stale@example.com", password: "un-secreto-largo" } });
    const cookie = registro.headers["set-cookie"];
    const url = "/v1/me/runs/137e0872-17f2-4ece-b0c9-6e7e0708662d";
    const base = { catalogVersion: "active-151", seed: "libre-abc", snapshot: { numeroDePick: 3 }, status: "active", cartasVistas: [], personalBest: null };

    await app.inject({ method: "PUT", url, headers: { cookie }, payload: { ...base, clientRevision: 2 } });
    const stale = await app.inject({ method: "PUT", url, headers: { cookie }, payload: { ...base, clientRevision: 1 } });

    expect(stale.statusCode).toBe(409);
    expect(stale.json()).toMatchObject({ error: { code: "STALE_RUN" } });
    await app.close();
  });

  it("fusiona una run completada sin reemplazar la run activa de otro dispositivo", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({ method: "POST", url: "/v1/auth/register", payload: { email: "runs@example.com", password: "un-secreto-largo" } });
    const cookie = registro.headers["set-cookie"];
    const base = { catalogVersion: "active-151", seed: "libre-abc", snapshot: { numeroDePick: 3 }, cartasVistas: ["messi"], personalBest: null };

    await app.inject({ method: "PUT", url: "/v1/me/runs/137e0872-17f2-4ece-b0c9-6e7e0708662d", headers: { cookie }, payload: { ...base, status: "active", clientRevision: 1 } });
    const completada = await app.inject({ method: "PUT", url: "/v1/me/runs/247e0872-17f2-4ece-b0c9-6e7e0708662d", headers: { cookie }, payload: { ...base, status: "completed", clientRevision: 0, cartasVistas: ["maradona"], personalBest: 101.4 } });
    const estado = await app.inject({ method: "GET", url: "/v1/me/state", headers: { cookie } });

    expect(completada.statusCode).toBe(200);
    expect(estado.json()).toMatchObject({ runActiva: { guestRunId: "137e0872-17f2-4ece-b0c9-6e7e0708662d" }, personalBest: 101.4, cartasVistas: ["messi", "maradona"] });
    await app.close();
  });

  it("requiere el origen configurado para mutaciones", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria(), apiOrigin: "https://oncedraft.vercel.app" });
    const respuesta = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "origen_seguro@example.com", password: "un-secreto-largo" },
    });

    expect(respuesta.statusCode).toBe(403);
    expect(respuesta.json()).toMatchObject({ error: { code: "INVALID_ORIGIN" } });
    await app.close();
  });

  it("rechaza una sesión expirada y marca la cookie como segura cuando corresponde", async () => {
    let instante = new Date("2026-08-30T12:00:00.000Z");
    const app = await buildServer({
      logger: false,
      repositorio: crearRepositorioDeCuentasEnMemoria(),
      ahora: () => instante,
      cookieSecure: true,
    });
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "sesion_expira@example.com", password: "un-secreto-largo" },
    });
    const cookie = registro.headers["set-cookie"];

    instante = new Date("2026-10-01T12:00:00.000Z");
    const perfil = await app.inject({ method: "GET", url: "/v1/me", headers: { cookie } });

    expect(cookie).toContain("Secure");
    expect(perfil.statusCode).toBe(401);
    await app.close();
  });

  it("rechaza un récord fuera del rango técnico permitido", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email: "score_invalido@example.com", password: "un-secreto-largo" },
    });

    const respuesta = await app.inject({
      method: "PUT",
      url: "/v1/me/personal-best",
      headers: { cookie: registro.headers["set-cookie"] },
      payload: { score: 150.1 },
    });

    expect(respuesta.statusCode).toBe(400);
    expect(respuesta.json()).toMatchObject({ error: { code: "VALIDATION_ERROR" } });
    await app.close();
  });
});
