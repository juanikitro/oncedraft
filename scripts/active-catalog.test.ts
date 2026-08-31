import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { leerEntradasDeProcedencia, validarEntradasDeProcedencia } from "./active-catalog.ts";

describe("gate del catálogo activo", () => {
  it("acepta únicamente una entrada completa y con activo local para cada carta", () => {
    const raiz = mkdtempSync(join(tmpdir(), "draft-active-catalog-"));
    try {
      mkdirSync(join(raiz, "assets/source/cards"), { recursive: true });
      writeFileSync(join(raiz, "assets/source/cards/lionel-messi.jpg"), "imagen");
      const entradas = leerEntradasDeProcedencia(`## Argentina · 1

| Jugador | QID / índice histórico | Hechos de versión | Activo visual de club | Activo local |
| --- | --- | --- | --- | --- |
| Lionel Messi | Q615 | fuente de versión | fuente visual | \`assets/source/cards/lionel-messi.jpg\` |
`);

      const errores = validarEntradasDeProcedencia({
        raiz,
        catalogo: {
          version: "test",
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
        },
        entradas,
      });

      expect(errores).toEqual([]);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it("rechaza una carta pendiente aunque tenga una ruta local declarada", () => {
    const entradas = leerEntradasDeProcedencia(`## Argentina · 1
| Jugador | QID / índice histórico | Hechos de versión | Activo visual de club | Activo local |
| --- | --- | --- | --- | --- |
| Lionel Messi | Q615 | Pendiente | fuente visual | \`assets/source/cards/lionel-messi.jpg\` |
`);
    const errores = validarEntradasDeProcedencia({
      raiz: process.cwd(),
      catalogo: {
        version: "test",
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
      },
      entradas,
    });

    expect(errores).toContain("Procedencia incompleta para Lionel Messi (Argentina).");
  });
});
