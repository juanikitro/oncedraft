import { planificarProteccionPosicional } from "@draft/game-core";

import { compilarCatalogoCandidato } from "./candidate-catalog.ts";

const compilacion = compilarCatalogoCandidato();

if (!compilacion.catalogo) {
  console.error(compilacion.errores.join("\n"));
  process.exitCode = 1;
} else {
  const { catalogo } = compilacion;
  const planesDeProteccion = Array.from({ length: 100 }, (_, indice) => {
    return planificarProteccionPosicional({ catalogo, seed: `preflight-${indice + 1}` });
  });
  const posicionesPorContexto = Object.fromEntries(
    [...new Set(catalogo.cartas.map((carta) => `${carta.pais}|${carta.cicloMundial}`))]
      .toSorted()
      .map((contexto) => {
        const posiciones = [...new Set(
          catalogo.cartas
            .filter((carta) => `${carta.pais}|${carta.cicloMundial}` === contexto)
            .map((carta) => carta.posicionPrimaria),
        )].toSorted();
        return [contexto, posiciones];
      }),
  );
  const coberturaPorPosicion = Object.fromEntries(
    ["POR", "LD", "DFC", "LI", "MC", "ED", "DC", "EI"].map((posicion) => {
      return [
        posicion,
        new Set(
          catalogo.cartas
            .filter((carta) => carta.posicionPrimaria === posicion)
            .map((carta) => `${carta.pais}|${carta.cicloMundial}`),
        ).size,
      ];
    }),
  );

  console.log(
    JSON.stringify(
      {
        version: catalogo.version,
        versiones: catalogo.cartas.length,
        distribucionPorPais: contar(catalogo.cartas, (carta) => carta.pais),
        distribucionPorPosicion: contar(catalogo.cartas, (carta) => carta.posicionPrimaria),
        distribucionPorTrait: contar(catalogo.cartas, (carta) => carta.rasgo),
        coberturaPorPosicion,
        posicionesPorContexto,
        preflightProteccion: {
          seedsVerificadas: planesDeProteccion.length,
          contextoInicialesDistintos: new Set(
            planesDeProteccion.map(([primerPaso]) => `${primerPaso?.contexto.pais}|${primerPaso?.contexto.cicloMundial}`),
          ).size,
          ejemplo: planesDeProteccion[0],
        },
      },
      null,
      2,
    ),
  );
}

function contar<T>(valores: Iterable<T>, clave: (valor: T) => string): Record<string, number> {
  const conteos: Record<string, number> = {};

  for (const valor of valores) {
    const etiqueta = clave(valor);
    conteos[etiqueta] = (conteos[etiqueta] ?? 0) + 1;
  }

  return conteos;
}
