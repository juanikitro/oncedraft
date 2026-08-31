import { compilarCatalogoActivo } from "./active-catalog.ts";

const resultado = compilarCatalogoActivo();

if (!resultado.catalogo) {
  console.error(resultado.errores.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify(resultado.catalogo, null, 2));
}
