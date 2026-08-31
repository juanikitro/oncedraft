import { compilarCatalogoCandidato } from "./candidate-catalog.ts";

const compilacion = compilarCatalogoCandidato();

if (!compilacion.catalogo) {
  console.error(compilacion.errores.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(compilacion.catalogo, null, 2));
}
