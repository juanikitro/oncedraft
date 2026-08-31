import type { Catalogo } from "@draft/game-core";

export type ClienteDeImportacion = {
  query(sql: string, valores?: readonly unknown[]): Promise<unknown>;
};

export async function importarCatalogoActivo(cliente: ClienteDeImportacion, catalogo: Catalogo): Promise<void> {
  await cliente.query("BEGIN");
  try {
    await cliente.query(
      "INSERT INTO catalog_versions (id) VALUES ($1) ON CONFLICT (id) DO NOTHING",
      [catalogo.version],
    );
    for (const carta of catalogo.cartas) {
      await cliente.query(
        `INSERT INTO catalog_cards (id, catalog_version_id, payload)
         VALUES ($1, $2, $3::jsonb)
         ON CONFLICT (id) DO UPDATE
         SET catalog_version_id = EXCLUDED.catalog_version_id,
             payload = EXCLUDED.payload`,
        [carta.id, catalogo.version, JSON.stringify(carta)],
      );
    }
    await cliente.query("COMMIT");
  } catch (error) {
    await cliente.query("ROLLBACK");
    throw error;
  }
}
