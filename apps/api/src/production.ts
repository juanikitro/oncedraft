import { Pool } from "pg";

import { buildServer } from "./app.js";
import { cargarConfiguracion, type ConfiguracionApi } from "./config.js";
import { RepositorioPostgresDeCuentas } from "./postgres-accounts.js";

export async function crearServidorDeProduccion(env: NodeJS.ProcessEnv = process.env): Promise<{
  app: Awaited<ReturnType<typeof buildServer>>;
  configuracion: ConfiguracionApi;
}> {
  const configuracion = cargarConfiguracion(env);
  const pool = new Pool({ connectionString: configuracion.databaseUrl });
  const app = await buildServer({
    repositorio: new RepositorioPostgresDeCuentas(pool),
    cookieSecure: configuracion.cookieSecure,
  });
  app.addHook("onClose", async () => pool.end());
  return { app, configuracion };
}
