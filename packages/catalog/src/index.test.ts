import { describe, expect, it } from "vitest";

import type { Carta, Catalogo, Posicion } from "@draft/game-core";

import { validarCatalogoActivo, validarCoberturaPosicional } from "./index";

function crearCarta(indice: number, pais = "Argentina", posicionPrimaria: Posicion = "MC"): Carta {
  return {
    id: `carta-${indice}`,
    nombre: `Carta ${indice}`,
    pais,
    club: "Club de prueba",
    temporada: "1986-87",
    cicloMundial: "1978-1993",
    posicionPrimaria,
    posicionesSecundarias: [],
    ovr: 80,
    rasgo: "Creador",
  };
}

describe("validarCatalogoActivo", () => {
  it("rechaza un catálogo activo que no contiene exactamente 151 cartas", () => {
    const catalogoIncompleto: Catalogo = {
      version: "prueba-incompleta",
      cartas: Array.from({ length: 150 }, (_, indice) => crearCarta(indice + 1)),
    };

    expect(() => validarCatalogoActivo(catalogoIncompleto)).toThrow("exactamente 151 cartas");
  });
});

describe("validarCoberturaPosicional", () => {
  it("rechaza un pool que no permite tres oportunidades de POR en doce contextos", () => {
    const arquerosEnOnceContextos = Array.from({ length: 11 }, (_, indice) => {
      return crearCarta(indice + 1, `País ${indice + 1}`, "POR");
    });

    expect(() => validarCoberturaPosicional(arquerosEnOnceContextos)).toThrow("POR requiere al menos 12 contextos");
  });
});
