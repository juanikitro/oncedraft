import { describe, expect, it } from "vitest";

import { interpretarCatalogoPublicado } from "./catalogo-publicado";

describe("catálogo publicado para la PWA", () => {
  it("acepta una carta jugable únicamente si tiene una ruta de imagen local", () => {
    expect(
      interpretarCatalogoPublicado({
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
          imagen: "/catalog/catalog-assets/argentina-lionel-messi-2008-09.jpg",
        }],
      }),
    ).toMatchObject({ version: "active-151", cartas: [{ nombre: "Lionel Messi" }] });
  });

  it("rechaza datos que no puedan representar una carta completa", () => {
    expect(() => interpretarCatalogoPublicado({ version: "active-151", cartas: [{ id: "incompleta" }] })).toThrow(
      "catálogo publicado",
    );
  });
});
