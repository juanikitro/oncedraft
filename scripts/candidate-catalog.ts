import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Carta, Catalogo, CicloMundial, Posicion, Rasgo } from "@draft/game-core";

export const CANTIDAD_VERSIONES_CANDIDATAS = 151;

const PAISES = ["Argentina", "Brasil", "Italia", "Francia", "España", "Portugal"] as const;

type Pais = (typeof PAISES)[number];

interface VersionCandidata {
  pais: Pais;
  jugador: string;
  cicloMundial: CicloMundial;
  temporada: string;
  club: string;
  posicionPrimaria?: Posicion;
  ovr?: number;
  rasgo?: Rasgo;
  posicionesSecundarias?: readonly Posicion[];
}

export interface ResultadoDeCompilacionCandidata {
  catalogo: Catalogo | null;
  errores: readonly string[];
}

/**
 * Compila el catálogo interno desde los documentos editoriales canónicos.
 * No consulta ni habilita activos visuales: ese gate corresponde al catálogo
 * activo visible y al manifiesto de procedencia.
 */
export function compilarCatalogoCandidato(raiz = process.cwd()): ResultadoDeCompilacionCandidata {
  const errores: string[] = [];
  const versiones = new Map<string, VersionCandidata>();

  for (const [pais, fila] of leerFilasPorPais(raiz, "docs/game-design/FULL_ROSTER_PROPOSAL.md")) {
    const [cicloTexto, jugador, temporada, club] = fila;
    const cicloMundial = normalizarCiclo(cicloTexto);

    if (!cicloMundial || !jugador || !temporada || !club) {
      errores.push(`Roster incompleto en ${pais}.`);
      continue;
    }

    const clave = crearClave(pais, jugador);
    if (versiones.has(clave)) {
      errores.push(`Versión duplicada para ${jugador} (${pais}).`);
      continue;
    }

    versiones.set(clave, { pais, jugador, cicloMundial, temporada, club });
  }

  for (const [pais, fila] of leerFilasPorPais(raiz, "docs/game-design/POSITION_ALLOCATION.md")) {
    const [jugador, posicion] = fila;
    const version = buscarVersion(versiones, errores, pais, jugador, "posición primaria");

    if (version && esPosicion(posicion)) {
      version.posicionPrimaria = posicion;
    } else if (version) {
      errores.push(`Posición primaria inválida para ${jugador}: ${posicion ?? "vacía"}.`);
    }
  }

  for (const [pais, fila] of leerFilasPorPais(raiz, "docs/game-design/OVR_ALLOCATION.md")) {
    const [jugador, temporada, posicion, ovrTexto] = fila;
    const version = buscarVersion(versiones, errores, pais, jugador, "OVR");
    const ovr = Number(ovrTexto);

    if (!version) {
      continue;
    }

    if (version.temporada !== temporada) {
      errores.push(`Temporada distinta para ${jugador}: roster=${version.temporada}, OVR=${temporada}.`);
    }

    if (version.posicionPrimaria !== posicion) {
      errores.push(`Posición distinta para ${jugador}: primaria=${version.posicionPrimaria ?? "vacía"}, OVR=${posicion ?? "vacía"}.`);
    }

    if (!Number.isInteger(ovr) || ovr < 70 || ovr > 100) {
      errores.push(`OVR inválido para ${jugador}: ${ovrTexto ?? "vacío"}.`);
    } else {
      version.ovr = ovr;
    }
  }

  for (const [pais, fila] of leerFilasPorPais(raiz, "docs/game-design/TRAIT_ALLOCATION.md")) {
    const [jugador, rasgoTexto] = fila;
    const version = buscarVersion(versiones, errores, pais, jugador, "trait");
    const rasgo = normalizarRasgo(rasgoTexto);

    if (version && rasgo) {
      version.rasgo = rasgo;
    } else if (version) {
      errores.push(`Trait inválido para ${jugador}: ${rasgoTexto ?? "vacío"}.`);
    }
  }

  for (const [pais, fila] of leerFilasPorPais(raiz, "docs/game-design/SECONDARY_POSITION_ALLOCATION.md")) {
    const [jugador, posicionPrimaria, secundariasTexto] = fila;
    const version = buscarVersion(versiones, errores, pais, jugador, "posiciones secundarias");

    if (!version) {
      continue;
    }

    if (version.posicionPrimaria !== posicionPrimaria) {
      errores.push(`Primaria distinta en secundarias para ${jugador}.`);
    }

    const secundarias = secundariasTexto === "—" ? [] : secundariasTexto?.split(",").map((valor) => valor.trim()) ?? [];
    if (secundarias.length > 2 || secundarias.some((posicion) => !esPosicion(posicion))) {
      errores.push(`Secundarias inválidas para ${jugador}: ${secundariasTexto ?? "vacías"}.`);
    } else {
      version.posicionesSecundarias = secundarias as Posicion[];
    }
  }

  if (versiones.size !== CANTIDAD_VERSIONES_CANDIDATAS) {
    errores.push(`Se esperaban ${CANTIDAD_VERSIONES_CANDIDATAS} versiones y se leyeron ${versiones.size}.`);
  }

  const cartas = [...versiones.values()].flatMap((version) => {
    if (!version.posicionPrimaria || version.ovr === undefined || !version.rasgo || !version.posicionesSecundarias) {
      errores.push(`Campos editoriales incompletos para ${version.jugador} (${version.pais}).`);
      return [];
    }

    return [{
      id: crearIdDeCarta(version),
      nombre: version.jugador,
      pais: version.pais,
      club: version.club,
      temporada: version.temporada,
      cicloMundial: version.cicloMundial,
      posicionPrimaria: version.posicionPrimaria,
      posicionesSecundarias: version.posicionesSecundarias,
      ovr: version.ovr,
      rasgo: version.rasgo,
    } satisfies Carta];
  });
  const ids = new Set(cartas.map((carta) => carta.id));

  if (ids.size !== cartas.length) {
    errores.push("La compilación produjo identificadores de carta duplicados.");
  }

  return {
    catalogo: errores.length > 0 ? null : { version: "candidate-151", cartas },
    errores,
  };
}

function leerFilasPorPais(raiz: string, rutaRelativa: string): readonly [Pais, readonly string[]][] {
  const contenido = readFileSync(resolve(raiz, rutaRelativa), "utf8");
  const filas: [Pais, readonly string[]][] = [];
  let paisActual: Pais | undefined;

  for (const linea of contenido.split(/\r?\n/)) {
    const coincidenciaPais = /^## (Argentina|Brasil|Italia|Francia|España|Portugal)\b/.exec(linea);

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
      .map((valor) => valor.trim());

    if (columnas.length === 0 || columnas.every((valor) => /^:?-{3,}:?$/.test(valor)) || esEncabezado(columnas[0])) {
      continue;
    }

    filas.push([paisActual, columnas]);
  }

  return filas;
}

function buscarVersion(
  versiones: ReadonlyMap<string, VersionCandidata>,
  errores: string[],
  pais: Pais,
  jugador: string | undefined,
  campo: string,
): VersionCandidata | undefined {
  if (!jugador) {
    errores.push(`Fila sin jugador en ${campo} para ${pais}.`);
    return undefined;
  }

  const version = versiones.get(crearClave(pais, jugador));
  if (!version) {
    errores.push(`${jugador} (${pais}) aparece en ${campo} pero no en roster.`);
  }

  return version;
}

function crearClave(pais: Pais, jugador: string): string {
  return `${pais}|${jugador}`;
}

function crearIdDeCarta(version: VersionCandidata): string {
  return `${version.pais}-${version.jugador}-${version.temporada}`
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es-AR")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizarCiclo(ciclo: string | undefined): CicloMundial | undefined {
  const normalizado = ciclo?.replaceAll("–", "-");
  return normalizado === "1962-1977" || normalizado === "1978-1993" || normalizado === "1994-2009" || normalizado === "2010-2025"
    ? normalizado
    : undefined;
}

function esPosicion(valor: string | undefined): valor is Posicion {
  return ["POR", "LD", "DFC", "LI", "MC", "ED", "DC", "EI"].includes(valor as Posicion);
}

function esEncabezado(valor: string | undefined): boolean {
  return ["Ciclo", "Jugador"].includes(valor ?? "");
}

function normalizarRasgo(rasgo: string | undefined): Rasgo | undefined {
  const rasgos: Record<string, Rasgo> = {
    Rematador: "Rematador",
    Creador: "Creador",
    Técnico: "Tecnico",
    Velocista: "Velocista",
    Físico: "Fisico",
    "Muro defensivo": "Muro defensivo",
  };
  return rasgo ? rasgos[rasgo] : undefined;
}
