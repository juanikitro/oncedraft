export type ConfiguracionApi = {
  databaseUrl: string;
  databaseCaBase64?: string;
  host: string;
  port: number;
  cookieSecure: boolean;
  apiOrigin?: string;
  cronSecret?: string;
};

export function cargarConfiguracion(env: NodeJS.ProcessEnv = process.env): ConfiguracionApi {
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL es obligatoria para iniciar la API.");
  }
  const databaseCaBase64 = env.SUPABASE_DB_CA_CERT_BASE64;
  if (env.NODE_ENV === "production" && !databaseCaBase64) {
    throw new Error("SUPABASE_DB_CA_CERT_BASE64 es obligatoria en producción.");
  }

  const port = Number(env.PORT ?? "3001");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT debe ser un puerto válido.");
  }

  const apiOrigin = env.API_ORIGIN;
  const cronSecret = env.CRON_SECRET;
  if (apiOrigin !== undefined && !esOrigenHttp(apiOrigin)) {
    throw new Error("API_ORIGIN debe ser un origen HTTP(S) válido.");
  }
  if (env.NODE_ENV === "production" && !apiOrigin) {
    throw new Error("API_ORIGIN es obligatoria en producción.");
  }

  return {
    databaseUrl,
    ...(databaseCaBase64 ? { databaseCaBase64 } : {}),
    host: env.HOST ?? "127.0.0.1",
    port,
    cookieSecure: env.NODE_ENV === "production",
    ...(apiOrigin ? { apiOrigin } : {}),
    ...(cronSecret ? { cronSecret } : {}),
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
