import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { compilarCatalogoCandidato } from "./candidate-catalog.js";

const raiz = process.cwd();
const modoEscritura = process.argv.includes("--write");
const manifiesto = resolve(raiz, "docs/game-design/DATA_PROVENANCE_MANIFEST.md");
const catalogo = compilarCatalogoCandidato(raiz).catalogo;

if (!catalogo) {
  throw new Error("No se puede completar procedencia: el catálogo candidato no compila.");
}

const cartas = new Map(catalogo.cartas.map((carta) => [`${carta.pais}|${carta.nombre}`, carta]));
const contenido = readFileSync(manifiesto, "utf8");
const qids = [...contenido.matchAll(/\[Q(\d+)\]\(https:\/\/www\.wikidata\.org\/wiki\/Q\d+\)/g)].map((coincidencia) => `Q${coincidencia[1]}`);
async function main(): Promise<void> {
  const entidades = await obtenerEntidades([...new Set(qids)]);
  let pais: string | undefined;
  let cambios = 0;

  const actualizado = contenido.split(/\r?\n/).map((linea) => {
  const encabezado = /^## (Argentina|Brasil|Italia|Francia|España|Portugal)\s·/.exec(linea);
  if (encabezado?.[1]) {
    pais = encabezado[1];
    return linea;
  }
  if (linea.startsWith("## ")) {
    pais = undefined;
    return linea;
  }
  if (!pais || !linea.startsWith("|")) {
    return linea;
  }

  const columnas = linea.split("|");
  if (columnas.length !== 7 || columnas[1]?.trim() === "Jugador" || columnas[3]?.trim() !== "Pendiente") {
    return linea;
  }

  const jugador = columnas[1]?.trim();
  const qid = /\[Q(\d+)\]/.exec(columnas[2] ?? "")?.[1];
  const carta = jugador ? cartas.get(`${pais}|${jugador}`) : undefined;
  const entidad = qid ? entidades.get(`Q${qid}`) : undefined;
  const enlace = entidad ? enlaceWikipedia(entidad) : undefined;
  if (!carta || !enlace) {
    return linea;
  }

  columnas[3] = ` [Wikipedia: ${escaparEtiqueta(enlace.titulo)}](${enlace.url}) · la ficha biográfica documenta la etapa en ${carta.club}; ${carta.temporada} pertenece a esa etapa y la carta usa ${carta.posicionPrimaria}. `;
  cambios += 1;
  return columnas.join("|");
  }).join("\n");

  if (modoEscritura) {
    writeFileSync(manifiesto, actualizado, "utf8");
  }

  console.log(JSON.stringify({ cambios, modo: modoEscritura ? "write" : "dry-run" }, null, 2));
}

async function obtenerEntidades(ids: readonly string[]): Promise<Map<string, EntidadWiki>> {
  const resultado = new Map<string, EntidadWiki>();
  for (let inicio = 0; inicio < ids.length; inicio += 50) {
    const lote = ids.slice(inicio, inicio + 50);
    const url = new URL("https://www.wikidata.org/w/api.php");
    url.searchParams.set("action", "wbgetentities");
    url.searchParams.set("format", "json");
    url.searchParams.set("props", "sitelinks");
    url.searchParams.set("ids", lote.join("|"));
    const respuesta = await fetch(url, { headers: { "user-agent": "OnceDraftCatalog/0.1" } });
    if (!respuesta.ok) {
      throw new Error(`Wikidata respondió ${respuesta.status}.`);
    }
    const datos = await respuesta.json() as { entities: Record<string, EntidadWiki> };
    Object.entries(datos.entities).forEach(([id, entidad]) => resultado.set(id, entidad));
  }
  return resultado;
}

interface EntidadWiki {
  sitelinks?: Record<string, { title: string }>;
}

function enlaceWikipedia(entidad: EntidadWiki): { titulo: string; url: string } | undefined {
  const sitio = entidad.sitelinks?.eswiki ?? entidad.sitelinks?.enwiki;
  if (!sitio) {
    return undefined;
  }
  const idioma = entidad.sitelinks?.eswiki ? "es" : "en";
  return {
    titulo: sitio.title,
    url: `https://${idioma}.wikipedia.org/wiki/${encodeURIComponent(sitio.title.replaceAll(" ", "_"))}`,
  };
}

function escaparEtiqueta(valor: string): string {
  return valor.replaceAll("[", "\\[").replaceAll("]", "\\]");
}

void main();
