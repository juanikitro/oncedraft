import { randomUUID } from "node:crypto";

import { Pool } from "pg";
import { afterAll, afterEach, describe, expect, it } from "vitest";

import { buildServer } from "./app.js";
import { RepositorioPostgresDeCuentas } from "./postgres-accounts.js";
import { crearServidorDeProduccion } from "./production.js";

const databaseUrl = process.env.DATABASE_URL;
const describeConPostgres = databaseUrl ? describe : describe.skip;

describeConPostgres("sesiones con PostgreSQL", () => {
  const pool = new Pool({ connectionString: databaseUrl });
  const usernamesCreados: string[] = [];

  afterEach(async () => {
    if (usernamesCreados.length > 0) {
      await pool.query("DELETE FROM accounts WHERE username = ANY($1)", [usernamesCreados.splice(0)]);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("revoca una sesión persistida al cerrar sesión", async () => {
    const app = await buildServer({ logger: false, repositorio: new RepositorioPostgresDeCuentas(pool) });
    const username = `pg_${randomUUID().replaceAll("-", "").slice(0, 20)}`;
    usernamesCreados.push(username);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { username, password: "una-clave-local-segura" },
    });
    const cookie = registro.headers["set-cookie"];

    const logout = await app.inject({ method: "POST", url: "/v1/auth/logout", headers: { cookie } });

    expect(logout.statusCode).toBe(204);
    await app.close();
  });

  it("mantiene logout en el bootstrap de producción", async () => {
    const { app } = await crearServidorDeProduccion({ DATABASE_URL: databaseUrl, NODE_ENV: "development" });
    const username = `prod_${randomUUID().replaceAll("-", "").slice(0, 18)}`;
    usernamesCreados.push(username);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { username, password: "una-clave-local-segura" },
    });
    const cookie = registro.headers["set-cookie"];

    const logout = await app.inject({ method: "POST", url: "/v1/auth/logout", headers: { cookie } });

    expect(logout.statusCode).toBe(204);
    await app.close();
  });

  it("persiste el mayor récord personal", async () => {
    const app = await buildServer({ logger: false, repositorio: new RepositorioPostgresDeCuentas(pool) });
    const username = `score_${randomUUID().replaceAll("-", "").slice(0, 17)}`;
    usernamesCreados.push(username);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { username, password: "una-clave-local-segura" },
    });
    const cookie = registro.headers["set-cookie"];

    await app.inject({
      method: "PUT",
      url: "/v1/me/personal-best",
      headers: { cookie },
      payload: { score: 101.4 },
    });
    const resultado = await app.inject({
      method: "PUT",
      url: "/v1/me/personal-best",
      headers: { cookie },
      payload: { score: 95.2 },
    });

    expect(resultado.json()).toEqual({ personalBest: 101.4 });
    await app.close();
  });
});
