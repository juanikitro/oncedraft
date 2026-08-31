import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Catalogo } from "@draft/game-core";

import { compilarCatalogoCandidato } from "./candidate-catalog.js";

const PAISES = ["Argentina", "Brasil", "Italia", "Francia", "España", "Portugal"] as const;

type Pais = (typeof PAISES)[number];

export type EntradaDeProcedencia = {
  pais: Pais;
  jugador: string;
  indiceHistorico: string;
  hechosDeVersion: string;
  activoVisual: string;
  activoLocal: string;
};

export type ResultadoDeCatalogoActivo = {
  catalogo: Catalogo | null;
  errores: readonly string[];
};

export function compilarCatalogoActivo(raiz = process.cwd()): ResultadoDeCatalogoActivo {
  const candidato = compilarCatalogoCandidato(raiz);
  if (!candidato.catalogo) {
    return candidato;
  }

  const entradas = leerEntradasDeProcedencia(
    readFileSync(resolve(raiz, "docs/game-design/DATA_PROVENANCE_MANIFEST.md"), "utf8"),
  );
  const errores = validarEntradasDeProcedencia({ catalogo: candidato.catalogo, entradas, raiz });

  return {
    catalogo: errores.length === 0 ? { ...candidato.catalogo, version: "active-151" } : null,
    errores,
  };
}

export function leerEntradasDeProcedencia(contenido: string): readonly EntradaDeProcedencia[] {
  const entradas: EntradaDeProcedencia[] = [];
  let paisActual: Pais | undefined;

  for (const linea of contenido.split(/\r?\n/)) {
    const coincidenciaPais = /^## (Argentina|Brasil|Italia|Francia|España|Portugal)\s·/.exec(linea);
    if (coincidenciaPais?.[1]) {
      paisActual = coincidenciaPais[1] as Pais;
      continue;
    }
    if (linea.startsWith("## ")) {
      paisActual = undefined;
      continue;
    }
    if (!paisActual || !linea.startsWith("|")) {
      continue;
    }

    const columnas = linea
      .split("|")
      .slice(1, -1)
      .map((columna) => columna.trim());
    if (columnas.length !== 5 || columnas[0] === "Jugador" || columnas.every((columna) => /^:?-{3,}:?$/.test(columna))) {
      continue;
    }
    const [jugador, indiceHistorico, hechosDeVersion, activoVisual, activoLocal] = columnas;
    if (!jugador || !indiceHistorico || !hechosDeVersion || !activoVisual || !activoLocal) {
      continue;
    }
    entradas.push({ pais: paisActual, jugador, indiceHistorico, hechosDeVersion, activoVisual, activoLocal });
  }

  return entradas;
}

export function validarEntradasDeProcedencia({
  catalogo,
  entradas,
  raiz,
}: {
  catalogo: Catalogo;
  entradas: readonly EntradaDeProcedencia[];
  raiz: string;
}): readonly string[] {
  const errores: string[] = [];
  const esperadas = new Map(catalogo.cartas.map((carta) => [crearClave(carta.pais, carta.nombre), carta]));
  const vistas = new Set<string>();

  for (const entrada of entradas) {
    const clave = crearClave(entrada.pais, entrada.jugador);
    if (vistas.has(clave)) {
      errores.push(`Entrada de procedencia duplicada: ${entrada.jugador} (${entrada.pais}).`);
      continue;
    }
    vistas.add(clave);
    if (!esperadas.has(clave)) {
      errores.push(`La procedencia contiene una carta que no pertenece al catálogo candidato: ${entrada.jugador} (${entrada.pais}).`);
      continue;
    }
    if (estaPendiente(entrada.indiceHistorico) || estaPendiente(entrada.hechosDeVersion) || estaPendiente(entrada.activoVisual)) {
      errores.push(`Procedencia incompleta para ${entrada.jugador} (${entrada.pais}).`);
    }
    const rutaLocal = extraerRutaLocal(entrada.activoLocal);
    if (!rutaLocal || !existsSync(resolve(raiz, rutaLocal))) {
      errores.push(`Activo local faltante para ${entrada.jugador} (${entrada.pais}).`);
    }
  }

  for (const [clave, carta] of esperadas) {
    if (!vistas.has(clave)) {
      errores.push(`Falta procedencia para ${carta.nombre} (${carta.pais}).`);
    }
  }
  if (entradas.length !== catalogo.cartas.length) {
    errores.push(`El manifiesto tiene ${entradas.length} entradas y el catálogo candidato tiene ${catalogo.cartas.length}.`);
  }
  return errores;
}

function crearClave(pais: string, jugador: string): string {
  return `${pais}|${jugador}`;
}

function estaPendiente(valor: string): boolean {
  return valor.trim() === "Pendiente" || valor.trim() === "";
}

function extraerRutaLocal(valor: string): string | null {
  const coincidencia = /`(assets\/source\/cards\/[^`]+)`/.exec(valor);
  return coincidencia?.[1] ?? null;
}
