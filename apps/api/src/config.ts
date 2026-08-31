export type ConfiguracionApi = {
  databaseUrl: string;
  host: string;
  port: number;
  cookieSecure: boolean;
};

export function cargarConfiguracion(env: NodeJS.ProcessEnv = process.env): ConfiguracionApi {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL es obligatoria para iniciar la API.");
  }

  const port = Number(env.PORT ?? "3001");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un puerto válido.");
  }

  return {
    databaseUrl,
    host: env.HOST ?? "127.0.0.1",
    port,
    cookieSecure: env.NODE_ENV === "production",
  };
}
