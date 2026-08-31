import { Pool } from "pg";
import { fileURLToPath } from "node:url";

import { compilarCatalogoActivo } from "../../../scripts/active-catalog.js";
import { importarCatalogoActivo } from "./catalog-import.js";
import { cargarConfiguracion } from "./config.js";

const raizDelRepositorio = fileURLToPath(new URL("../../../", import.meta.url));
const resultado = compilarCatalogoActivo(raizDelRepositorio);
if (!resultado.catalogo) {
  console.error(resultado.errores.join("\n"));
  process.exitCode = 1;
} else {
  const configuracion = cargarConfiguracion();
  const pool = new Pool({ connectionString: configuracion.databaseUrl });
  const cliente = await pool.connect();
  try {
    await importarCatalogoActivo(cliente, resultado.catalogo);
    console.log(`Catálogo activo ${resultado.catalogo.version} importado con ${resultado.catalogo.cartas.length} cartas.`);
  } finally {
    cliente.release();
    await pool.end();
  }
}
