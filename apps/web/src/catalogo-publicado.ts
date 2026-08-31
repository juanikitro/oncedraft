import { CICLOS_MUNDIALES, POSICIONES, type Carta, type Catalogo, type Rasgo } from "@draft/game-core";

export type CartaPublicada = Carta & { imagen: string };
export type CatalogoPublicado = Omit<Catalogo, "cartas"> & { cartas: readonly CartaPublicada[] };

const RASGOS: readonly Rasgo[] = ["Rematador", "Creador", "Tecnico", "Velocista", "Fisico", "Muro defensivo"];

export async function cargarCatalogoPublicado(): Promise<CatalogoPublicado> {
  const respuesta = await fetch("/catalog/catalog.json");
  if (!respuesta.ok) {
    throw new Error("El catálogo activo todavía no está disponible.");
  }
  return interpretarCatalogoPublicado(await respuesta.json());
}

export function interpretarCatalogoPublicado(valor: unknown): CatalogoPublicado {
  if (!esRegistro(valor) || typeof valor.version !== "string" || !Array.isArray(valor.cartas)) {
    throw new Error("El catálogo publicado no tiene una estructura válida.");
  }
  if (!valor.cartas.every(esCartaPublicada)) {
    throw new Error("El catálogo publicado contiene una carta incompleta.");
  }
  return { version: valor.version, cartas: valor.cartas };
}

function esCartaPublicada(valor: unknown): valor is CartaPublicada {
  if (!esRegistro(valor)) {
    return false;
  }
  return (
    typeof valor.id === "string" &&
    typeof valor.nombre === "string" &&
    typeof valor.pais === "string" &&
    typeof valor.club === "string" &&
    typeof valor.temporada === "string" &&
    typeof valor.cicloMundial === "string" &&
    CICLOS_MUNDIALES.includes(valor.cicloMundial as (typeof CICLOS_MUNDIALES)[number]) &&
    typeof valor.posicionPrimaria === "string" &&
    POSICIONES.includes(valor.posicionPrimaria as (typeof POSICIONES)[number]) &&
    Array.isArray(valor.posicionesSecundarias) &&
    valor.posicionesSecundarias.every(
      (posicion) => typeof posicion === "string" && POSICIONES.includes(posicion as (typeof POSICIONES)[number]),
    ) &&
    typeof valor.ovr === "number" &&
    Number.isInteger(valor.ovr) &&
    typeof valor.rasgo === "string" &&
    RASGOS.includes(valor.rasgo as Rasgo) &&
    typeof valor.imagen === "string" &&
    valor.imagen.startsWith("/catalog/catalog-assets/")
  );
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}
