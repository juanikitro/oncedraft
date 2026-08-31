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

  it("registra una cuenta normalizando el username y entrega una sesión", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const respuesta = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { username: "  Juani_Fulbo ", password: "un-secreto-largo" },
    });

    expect(respuesta.statusCode).toBe(201);
    expect(respuesta.json()).toMatchObject({
      usuario: { username: "juani_fulbo" },
    });
    expect(respuesta.headers["set-cookie"]).toContain("draft_session=");

    await app.close();
  });

  it("rechaza username duplicado sin crear una segunda cuenta", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    const payload = { username: "mismo_usuario", password: "un-secreto-largo" };

    expect((await app.inject({ method: "POST", url: "/v1/auth/register", payload })).statusCode).toBe(201);
    const duplicado = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { ...payload, username: "MISMO_USUARIO" },
    });

    expect(duplicado.statusCode).toBe(409);
    expect(duplicado.json()).toMatchObject({ error: { code: "USERNAME_TAKEN" } });
    await app.close();
  });

  it("no revela si el username existe cuando la contraseña es inválida", async () => {
    const app = await buildServer({ logger: false, repositorio: crearRepositorioDeCuentasEnMemoria() });
    await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { username: "existente", password: "un-secreto-largo" },
    });

    const deCuentaExistente = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { username: "existente", password: "clave-equviocada" },
    });
    const deCuentaInexistente = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { username: "ausente", password: "clave-equviocada" },
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
      payload: { username: "capitan", password: "un-secreto-largo" },
    });

    const login = await app.inject({
      method: "POST",
      url: "/v1/auth/login",
      payload: { username: "CAPITAN", password: "un-secreto-largo" },
    });
    const cookie = login.headers["set-cookie"];

    expect(login.statusCode).toBe(200);
    expect(cookie).toContain("draft_session=");

    const perfil = await app.inject({ method: "GET", url: "/v1/me", headers: { cookie } });
    expect(perfil.statusCode).toBe(200);
    expect(perfil.json()).toMatchObject({ usuario: { username: "capitan" } });

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
        payload: { username: "sin_cuenta", password: "un-secreto-largo" },
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
      payload: { username: "recordista", password: "un-secreto-largo" },
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
      payload: { username: "invitado_a_cuenta", password: "un-secreto-largo" },
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
      payload: { username: "sesion_expira", password: "un-secreto-largo" },
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
      payload: { username: "score_invalido", password: "un-secreto-largo" },
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
