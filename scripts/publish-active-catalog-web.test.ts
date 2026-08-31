import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { publicarCatalogoParaWeb } from "./publish-active-catalog-web.ts";

describe("publicación web del catálogo activo", () => {
  it("copia únicamente los activos aprobados y genera rutas locales estables", () => {
    const raiz = mkdtempSync(join(tmpdir(), "draft-catalog-web-"));
    try {
      mkdirSync(join(raiz, "assets/source/cards"), { recursive: true });
      writeFileSync(join(raiz, "assets/source/cards/lionel-messi.jpg"), "imagen-aprobada");

      publicarCatalogoParaWeb({
        raiz,
        destino: "salida",
        catalogo: {
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
        },
        entradas: [{
          pais: "Argentina",
          jugador: "Lionel Messi",
          indiceHistorico: "Q615",
          hechosDeVersion: "fuente",
          activoVisual: "fuente",
          activoLocal: "`assets/source/cards/lionel-messi.jpg`",
        }],
      });

      expect(readFileSync(join(raiz, "salida/catalog-assets/argentina-lionel-messi-2008-09.jpg"), "utf8")).toBe(
        "imagen-aprobada",
      );
      expect(JSON.parse(readFileSync(join(raiz, "salida/catalog.json"), "utf8"))).toMatchObject({
        version: "active-151",
        cartas: [{
          id: "argentina-lionel-messi-2008-09",
          nombre: "Lionel Messi",
          imagen: "/catalog/catalog-assets/argentina-lionel-messi-2008-09.jpg",
        }],
      });
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });
});
