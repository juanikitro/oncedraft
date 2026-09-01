import { type PoolConfig, Pool } from "pg";

export const ESQUEMA_ONCE_DRAFT = "once_draft";

export function configuracionPoolOnceDraft(databaseUrl: string): PoolConfig {
  return {
    connectionString: databaseUrl,
    options: `-c search_path=${ESQUEMA_ONCE_DRAFT}`,
    max: 2,
    min: 1,
    idleTimeoutMillis: 5_000,
    connectionTimeoutMillis: 5_000,
  };
}

export function crearPoolOnceDraft(databaseUrl: string): Pool {
  return new Pool(configuracionPoolOnceDraft(databaseUrl));
}
