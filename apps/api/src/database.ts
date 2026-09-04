import { type PoolConfig, Pool } from "pg";

export const ESQUEMA_ONCE_DRAFT = "once_draft";

export function configuracionPoolOnceDraft(databaseUrl: string, databaseCaBase64?: string): PoolConfig {
  const ssl = databaseCaBase64
    ? { ca: Buffer.from(databaseCaBase64, "base64").toString("utf8"), rejectUnauthorized: true }
    : undefined;

  return {
    connectionString: databaseUrl,
    ...(ssl ? { ssl } : {}),
    options: `-c search_path=${ESQUEMA_ONCE_DRAFT}`,
    max: 2,
    min: 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 5_000,
  };
}

export function crearPoolOnceDraft(databaseUrl: string, databaseCaBase64?: string): Pool {
  return new Pool(configuracionPoolOnceDraft(databaseUrl, databaseCaBase64));
}
