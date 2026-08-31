import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, relative, resolve, sep } from "node:path";

import type { Carta, Catalogo } from "@draft/game-core";

import { compilarCatalogoActivo, leerEntradasDeProcedencia, type EntradaDeProcedencia } from "./active-catalog.js";

export type CartaPublicada = Carta & { imagen: string };
export type CatalogoPublicado = { version: string; cartas: readonly CartaPublicada[] };

export function publicarCatalogoParaWeb({
  raiz,
  destino,
  catalogo,
  entradas,
}: {
  raiz: string;
  destino: string;
  catalogo: Catalogo;
  entradas: readonly EntradaDeProcedencia[];
}): CatalogoPublicado {
  const rutaRaiz = resolve(raiz);
  const rutaDestino = resolverRutaDentroDeRaiz(rutaRaiz, destino);
  const rutasDeActivoPorCarta = new Map(
    entradas.map((entrada) => [`${entrada.pais}|${entrada.jugador}`, extraerRutaLocal(entrada.activoLocal)]),
  );

  const cartas = catalogo.cartas.map((carta) => {
    const rutaRelativa = rutasDeActivoPorCarta.get(`${carta.pais}|${carta.nombre}`);
    if (!rutaRelativa) {
      throw new Error(`Falta activo local para publicar ${carta.nombre} (${carta.pais}).`);
    }
    const rutaOrigen = resolverRutaDentroDeRaiz(rutaRaiz, rutaRelativa);
    if (!existsSync(rutaOrigen)) {
      throw new Error(`No existe el activo local para publicar ${carta.nombre} (${carta.pais}).`);
    }
    const extension = extname(rutaOrigen).toLowerCase();
    if (!extension) {
      throw new Error(`El activo local de ${carta.nombre} no tiene extensión de imagen.`);
    }
    return { carta, rutaOrigen, nombreDestino: `${carta.id}${extension}` };
  });

  const rutaPadre = dirname(rutaDestino);
  mkdirSync(rutaPadre, { recursive: true });
  const rutaTemporal = mkdtempSync(resolve(rutaPadre, `.${basename(rutaDestino)}-`));
  try {
    const rutaActivosTemporales = resolve(rutaTemporal, "catalog-assets");
    mkdirSync(rutaActivosTemporales, { recursive: true });
    for (const { rutaOrigen, nombreDestino } of cartas) {
      copyFileSync(rutaOrigen, resolve(rutaActivosTemporales, nombreDestino));
    }

    const publicado: CatalogoPublicado = {
      version: catalogo.version,
      cartas: cartas.map(({ carta, nombreDestino }) => ({
        ...carta,
        imagen: `/catalog/catalog-assets/${nombreDestino}`,
      })),
    };
    writeFileSync(resolve(rutaTemporal, "catalog.json"), `${JSON.stringify(publicado, null, 2)}\n`, "utf8");

    rmSync(rutaDestino, { recursive: true, force: true });
    renameSync(rutaTemporal, rutaDestino);
    return publicado;
  } catch (error) {
    rmSync(rutaTemporal, { recursive: true, force: true });
    throw error;
  }
}

function resolverRutaDentroDeRaiz(raiz: string, ruta: string): string {
  const resuelta = resolve(raiz, ruta);
  const relativa = relative(raiz, resuelta);
  if (relativa === "" || relativa.startsWith(`..${sep}`) || relativa === "..") {
    throw new Error("La ruta de publicación debe permanecer dentro del repositorio.");
  }
  return resuelta;
}

function extraerRutaLocal(valor: string): string | null {
  const coincidencia = /`(assets\/source\/cards\/[^`]+)`/.exec(valor);
  return coincidencia?.[1] ?? null;
}

function publicarCatalogoActivo(): void {
  const raiz = process.cwd();
  const resultado = compilarCatalogoActivo(raiz);
  if (!resultado.catalogo) {
    console.error(resultado.errores.join("\n"));
    process.exitCode = 1;
    return;
  }

  const contenido = readFileSync(resolve(raiz, "docs/game-design/DATA_PROVENANCE_MANIFEST.md"), "utf8");
  const publicado = publicarCatalogoParaWeb({
    raiz,
    destino: "apps/web/public/catalog",
    catalogo: resultado.catalogo,
    entradas: leerEntradasDeProcedencia(contenido),
  });
  console.log(`Catálogo web ${publicado.version} publicado con ${publicado.cartas.length} cartas.`);
}

if (process.argv[1] && basename(process.argv[1]) === "publish-active-catalog-web.ts") {
  publicarCatalogoActivo();
}
