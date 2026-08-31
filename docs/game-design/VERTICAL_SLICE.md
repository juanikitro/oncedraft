# Vertical slice interna

## Propósito

Verificar el loop de partida libre antes de curar el pool completo de 151 cartas o distribuir contenido públicamente.

## Alcance de contenido

- Pool inicial completo de 151 cartas; la slice anterior de 60 queda supersedida para sostener contextos y rerolls temáticos.
- Seis nacionalidades: Argentina 36, Brasil 24, Italia 24, Francia 24, España 24 y Portugal 19.
- Matriz país–ciclo, en orden 1962–1977 / 1978–1993 / 1994–2009 / 2010–2025: Argentina 8/10/10/8; Brasil 6/6/6/6; Italia 6/8/10/0; Francia 0/6/8/10; España 6/0/8/10; Portugal 6/6/7/0. Las cinco celdas de 10 albergan los rolls especiales.
- Usa versiones reales con nombre, imagen, escudo, temporada y datos históricos; las licencias se consideran cubiertas por premisa del proyecto.
- Mantiene las reglas fundamentales del draft; no reemplaza el objetivo de 151 cartas del MVP.

## Flujo confirmado

`Landing -> Jugar partida libre -> 11 × (roll de país -> roll de ciclo mundial -> oferta compatible -> tocar carta -> detalle breve -> confirmar elección) -> resultado de squad -> puntaje y récord -> Jugar otra partida`

La pulsación inicial nunca consume una opción: abre un detalle breve con OVR efectivo, posición, tres marcadores de química y rasgo. La elección solo se confirma mediante la acción explícita `Elegir`; al volver se conserva la oferta y no se pierde información.

## Sistemas incluidos

- Posiciones, química, rasgos, scouting, reroll, score, récord y reorganización.
- El modo principal usa contexto de roll país–ciclo mundial; club no condiciona generación y permanece como fuente de química.
- Colección visual e imagen compartible de la squad.
- Cada opción muestra directamente sus tres marcadores de química: nacionalidad, club y ciclo mundial. La ficha expandible contiene secundarias e hitos históricos.
- No incluye Draft diario/ranking, simulaciones, torneos, PvP ni eventos roguelite.

## Incompatibilidad a resolver

El piso de 18 cartas por cada uno de seis rasgos requiere al menos 108 cartas. El pool de 151 conserva ese piso; la antigua regla de ocho cartas para una slice de 60 queda supersedida.

## Revisión manual inicial

La primera revisión la realiza el propietario del producto. Debe poder:

- iniciar una partida libre sin ayuda externa;
- completar los 11 picks y reorganizar la formación;
- explicar al menos una elección por OVR/posición, química o rasgo;
- usar o decidir guardar scouting y reroll con un motivo identificable;
- entender el puntaje, el récord y el desglose;
- querer iniciar otra partida libre por una decisión que desea mejorar;
- revisar colección e imagen compartible sin que desvíen el loop.

Esto verifica alineación y problemas obvios. No sustituye una prueba posterior con jugadores ni las métricas de finalización/repetición.
