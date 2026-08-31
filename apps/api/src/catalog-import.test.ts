import { describe, expect, it } from "vitest";

import { importarCatalogoActivo } from "./catalog-import.js";

describe("importación de catálogo activo", () => {
  it("persiste la versión y las cartas en una única transacción", async () => {
    const consultas: Array<{ sql: string; valores?: readonly unknown[] }> = [];
    const cliente = {
      async query(sql: string, valores?: readonly unknown[]) {
        consultas.push(valores === undefined ? { sql } : { sql, valores });
      },
    };

    await importarCatalogoActivo(cliente, {
      version: "active-151",
      cartas: [{
        id: "argentina-lionel-messi-2008-09",
        nombre: "Lionel Messi",
        pais: "Argentina",
        club: "FC Barcelona",
        temporada: "2008-09",
        cicloMundial: "1994-2009",
        posicionPrimaria: "ED",
        posicionesSecundarias: [],
        ovr: 100,
        rasgo: "Tecnico",
      }],
    });

    expect(consultas.map((consulta) => consulta.sql)).toEqual([
      "BEGIN",
      expect.stringContaining("INSERT INTO catalog_versions"),
      expect.stringContaining("INSERT INTO catalog_cards"),
      "COMMIT",
    ]);
    expect(consultas[2]?.valores?.[0]).toBe("argentina-lionel-messi-2008-09");
  });
});
