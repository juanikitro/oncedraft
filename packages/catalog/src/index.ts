import type { Carta, Catalogo, Posicion } from "@draft/game-core";

/** El catálogo activo se incorpora únicamente tras completar su curaduría. */
export const CATALOG_VERSION = "draft-151-pending-assets";
export const CANTIDAD_CARTAS_ACTIVAS = 151;

export const MINIMOS_CONTEXTOS_POR_POSICION = {
  POR: 12,
  LD: 12,
  DFC: 16,
  LI: 12,
  MC: 20,
  ED: 11,
  DC: 11,
  EI: 12,
} as const satisfies Record<Posicion, number>;

export function validarCatalogoActivo(catalogo: Catalogo): void {
  if (catalogo.cartas.length !== CANTIDAD_CARTAS_ACTIVAS) {
    throw new Error(`El catálogo activo debe contener exactamente ${CANTIDAD_CARTAS_ACTIVAS} cartas.`);
  }

  validarCoberturaPosicional(catalogo.cartas);
}

/**
 * Comprueba que la protección posicional pueda encontrar contextos distintos
 * sin romper el roll temático país-ciclo.
 */
export function validarCoberturaPosicional(cartas: readonly Carta[]): void {
  for (const [posicion, minimo] of Object.entries(MINIMOS_CONTEXTOS_POR_POSICION) as [Posicion, number][]) {
    const contextos = new Set(
      cartas
        .filter((carta) => carta.posicionPrimaria === posicion)
        .map((carta) => `${carta.pais}|${carta.cicloMundial}`),
    );

    if (contextos.size < minimo) {
      throw new Error(`${posicion} requiere al menos ${minimo} contextos; se encontraron ${contextos.size}.`);
    }
  }
}
