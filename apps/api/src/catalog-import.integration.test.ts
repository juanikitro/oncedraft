import { randomUUID } from "node:crypto";

import { afterAll, afterEach, describe, expect, it } from "vitest";

import { importarCatalogoActivo } from "./catalog-import.js";
import { crearPoolOnceDraft } from "./database.js";

const databaseUrl = process.env.DATABASE_URL;
const describeConPostgres = databaseUrl ? describe : describe.skip;

describeConPostgres("importación activa con PostgreSQL", () => {
  const pool = crearPoolOnceDraft(databaseUrl!);
  const versionesCreadas: string[] = [];
  const cartasCreadas: string[] = [];

  afterEach(async () => {
    if (cartasCreadas.length > 0) {
      await pool.query("DELETE FROM catalog_cards WHERE id = ANY($1)", [cartasCreadas.splice(0)]);
    }
    if (versionesCreadas.length > 0) {
      await pool.query("DELETE FROM catalog_versions WHERE id = ANY($1)", [versionesCreadas.splice(0)]);
    }
  });

  afterAll(async () => {
    await pool.end();
  });

  it("guarda versión y payload de carta en la misma importación", async () => {
    const sufijo = randomUUID();
    const version = `active-test-${sufijo}`;
    const cartaId = `test-card-${sufijo}`;
    versionesCreadas.push(version);
    cartasCreadas.push(cartaId);
    const cliente = await pool.connect();
    try {
      await importarCatalogoActivo(cliente, {
        version,
        cartas: [{
          id: cartaId,
          nombre: "Carta de prueba",
          pais: "Argentina",
          club: "Club de prueba",
          temporada: "2002-03",
          cicloMundial: "1994-2009",
          posicionPrimaria: "MC",
          posicionesSecundarias: [],
          ovr: 90,
          rasgo: "Creador",
        }],
      });
    } finally {
      cliente.release();
    }

    const resultado = await pool.query<{ catalog_version_id: string; nombre: string }>(
      "SELECT catalog_version_id, payload->>'nombre' AS nombre FROM catalog_cards WHERE id = $1",
      [cartaId],
    );

    expect(resultado.rows).toEqual([{ catalog_version_id: version, nombre: "Carta de prueba" }]);
  });
});
