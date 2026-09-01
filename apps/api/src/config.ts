export type ConfiguracionApi = {
  databaseUrl: string;
  host: string;
  port: number;
  cookieSecure: boolean;
  apiOrigin?: string;
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

  const apiOrigin = env.API_ORIGIN;
  if (apiOrigin !== undefined && !esOrigenHttp(apiOrigin)) {
    throw new Error("API_ORIGIN debe ser un origen HTTP(S) válido.");
  }
  if (env.NODE_ENV === "production" && !apiOrigin) {
    throw new Error("API_ORIGIN es obligatoria en producción.");
  }

  return {
    databaseUrl,
    host: env.HOST ?? "127.0.0.1",
    port,
    cookieSecure: env.NODE_ENV === "production",
    ...(apiOrigin ? { apiOrigin } : {}),
  };
}

function esOrigenHttp(valor: string): boolean {
  try {
    const url = new URL(valor);
    return (url.protocol === "https:" || url.protocol === "http:") && url.origin === valor;
  } catch {
    return false;
  }
}
