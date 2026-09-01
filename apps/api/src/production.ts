import { buildServer } from "./app.js";
import { cargarConfiguracion, type ConfiguracionApi } from "./config.js";
import { crearPoolOnceDraft } from "./database.js";
import { RepositorioPostgresDeCuentas } from "./postgres-accounts.js";

export async function crearServidorDeProduccion(env: NodeJS.ProcessEnv = process.env): Promise<{
  app: Awaited<ReturnType<typeof buildServer>>;
  configuracion: ConfiguracionApi;
}> {
  const configuracion = cargarConfiguracion(env);
  const pool = crearPoolOnceDraft(configuracion.databaseUrl);
  const app = await buildServer({
    repositorio: new RepositorioPostgresDeCuentas(pool),
    cookieSecure: configuracion.cookieSecure,
    ...(configuracion.apiOrigin ? { apiOrigin: configuracion.apiOrigin } : {}),
  });
  app.addHook("onClose", async () => pool.end());
  return { app, configuracion };
}
