import { buildServer } from "./app.js";
import { cargarConfiguracion, type ConfiguracionApi } from "./config.js";
import { crearPoolOnceDraft } from "./database.js";
import { RepositorioPostgresDeCuentas } from "./postgres-accounts.js";
import { RepositorioPostgresDeDraftDiario } from "./postgres-daily-drafts.js";

export async function crearServidorDeProduccion(env: NodeJS.ProcessEnv = process.env): Promise<{
  app: Awaited<ReturnType<typeof buildServer>>;
  configuracion: ConfiguracionApi;
}> {
  const configuracion = cargarConfiguracion(env);
  const pool = crearPoolOnceDraft(configuracion.databaseUrl, configuracion.databaseCaBase64);
  const repositorio = new RepositorioPostgresDeCuentas(pool);
  const app = await buildServer({
    repositorio,
    repositorioDiario: new RepositorioPostgresDeDraftDiario(pool),
    cookieSecure: configuracion.cookieSecure,
    ...(configuracion.apiOrigin ? { apiOrigin: configuracion.apiOrigin } : {}),
    ...(configuracion.cronSecret ? { cronSecret: configuracion.cronSecret } : {}),
  });
  app.addHook("onClose", async () => pool.end());
  return { app, configuracion };
}
