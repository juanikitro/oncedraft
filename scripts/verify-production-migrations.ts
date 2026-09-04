import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { Client } from "pg";

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL es obligatoria para verificar las migraciones de producción.");
  }

  const migrationsDirectory = resolve("apps/api/migrations");
  const localMigrations = (await readdir(migrationsDirectory))
    .filter((file) => /^\d+_.+\.mjs$/.test(file))
    .map((file) => file.replace(/\.mjs$/, ""))
    .sort();

  const client = new Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    const result = await client.query<{ name: string }>("SELECT name FROM once_draft.pgmigrations ORDER BY name");
    const appliedMigrations = result.rows.map((row) => row.name);
    const missingMigrations = localMigrations.filter((name) => !appliedMigrations.includes(name));
    const unknownMigrations = appliedMigrations.filter((name) => !localMigrations.includes(name));

    if (missingMigrations.length > 0 || unknownMigrations.length > 0) {
      throw new Error(
        `El historial de migraciones no coincide. Faltan: ${missingMigrations.join(", ") || "ninguna"}. Desconocidas: ${unknownMigrations.join(", ") || "ninguna"}.`,
      );
    }

    console.log(`Migraciones verificadas: ${localMigrations.length}.`);
  } finally {
    await client.end();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
