import { randomUUID } from "node:crypto";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { buildServer } from "./app.js";
import { crearPoolOnceDraft } from "./database.js";
import { RepositorioPostgresDeCuentas } from "./postgres-accounts.js";
import { crearServidorDeProduccion } from "./production.js";

const databaseUrl = process.env.DATABASE_URL;
const describeConPostgres = databaseUrl ? describe : describe.skip;

describeConPostgres("sesiones con PostgreSQL", () => {
  const pool = crearPoolOnceDraft(databaseUrl!);
  const emailsCreados: string[] = [];

  afterEach(async () => {
    if (emailsCreados.length > 0) {
      await pool.query("DELETE FROM once_draft.accounts WHERE email = ANY($1)", [emailsCreados.splice(0)]);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("revoca una sesión persistida al cerrar sesión", async () => {
    const app = await buildServer({ logger: false, repositorio: new RepositorioPostgresDeCuentas(pool) });
    const email = `pg_${randomUUID().replaceAll("-", "").slice(0, 20)}@example.test`;
    emailsCreados.push(email);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email, password: "una-clave-local-segura" },
    });
    const cookie = registro.headers["set-cookie"];

    const logout = await app.inject({ method: "POST", url: "/v1/auth/logout", headers: { cookie } });

    expect(logout.statusCode).toBe(204);
    await app.close();
  });

  it("mantiene logout en el bootstrap de producción", async () => {
    const { app } = await crearServidorDeProduccion({ DATABASE_URL: databaseUrl, NODE_ENV: "development" });
    const email = `prod_${randomUUID().replaceAll("-", "").slice(0, 18)}@example.test`;
    emailsCreados.push(email);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email, password: "una-clave-local-segura" },
    });
    const cookie = registro.headers["set-cookie"];

    const logout = await app.inject({ method: "POST", url: "/v1/auth/logout", headers: { cookie } });

    expect(logout.statusCode).toBe(204);
    await app.close();
  });

  it("persiste el mayor récord personal", async () => {
    const app = await buildServer({ logger: false, repositorio: new RepositorioPostgresDeCuentas(pool) });
    const email = `score_${randomUUID().replaceAll("-", "").slice(0, 17)}@example.test`;
    emailsCreados.push(email);
    const registro = await app.inject({
      method: "POST",
      url: "/v1/auth/register",
      payload: { email, password: "una-clave-local-segura" },
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
