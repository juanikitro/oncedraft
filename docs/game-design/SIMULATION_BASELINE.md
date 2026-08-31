# Línea base de simulación — catálogo candidato 151

## Estado y límite de evidencia

Ejecución interna reproducible del 2026-08-29. Sirve para detectar invariantes rotos, repetición y dominancia mecánica; **no demuestra diversión, comprensión, justicia percibida ni valor del scouting**. No modifica el contenido automáticamente.

## Configuración

- Catálogo candidato: `candidate-151`.
- Seeds: 1.000 por estrategia.
- Estrategias deliberadamente simples: priorizar OVR, química inmediata, traits y cobertura de formación.
- Motor: 4-3-3, once picks, protección posicional y un scouting mecánico por run. Solo la estrategia OVR usa reroll (si su mejor oferta es menor a 85).
- Reproducción: `npm run catalog:simulate`.

## Hechos medidos

| Estrategia | Score medio | Score mínimo–máximo | Ofertas dominadas | Plazas pendientes medias | Contextos por run |
| --- | ---: | --- | ---: | ---: | ---: |
| OVR | 91,99 | 86,9–97,9 | 4,73% | 2,084 | 11 |
| Química | 90,63 | 84,7–96,5 | 3,43% | 1,851 | 11 |
| Traits | 89,30 | 80,4–96,9 | 3,55% | 2,926 | 11 |
| Cobertura | 90,09 | 82,6–96,4 | 3,36% | 0,508 | 11 |

- Las 4.000 runs se completaron sin romper los invariantes del motor.
- El planificador generó once contextos distintos por run; el conjunto inicial contiene 20 contextos posibles.
- La dominancia mecánica quedó por debajo del guardrail provisional de 15% de DEC-147.
- Un reroll de una oferta especial de cinco exige diez cartas disponibles en su contexto. El planificador ahora lo garantiza; ocho cartas no alcanzaban porque, tras mostrar cinco, no quedaban cinco inéditas para refrescar.

## Interpretación y próximos controles

1. La protección evita estados imposibles, pero la heurística de cobertura todavía deja 0,508 plazas de formación pendientes por run en promedio. Es una señal para prueba con jugadores y para revisar la heurística; no autoriza a cambiar el catálogo ni a endurecer las ofertas sin evidencia adicional.
2. Las estrategias no representan personas reales ni optimizan el draft. En particular, el scouting se activa para ejercitar su ruta técnica, pero las estrategias no reaccionan a su informe.
3. El rango de scores y la diferencia entre estrategias son puntos de calibración iniciales. Deben contrastarse con decisiones humanas, explicación del score y repetición voluntaria.

