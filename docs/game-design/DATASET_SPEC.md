# Especificación del dataset inicial

## Propósito

Definir las restricciones verificables del catálogo inicial antes de seleccionar futbolistas, valorar OVR o recopilar activos. Una carta representa una única versión histórica, anclada a una temporada concreta.

## Alcance confirmado

- 151 cartas reales; una carta por futbolista en el MVP.
- Países: Argentina, Brasil, Italia, Francia, España y Portugal.
- Ciclos mundiales: 1962–1977, 1978–1993, 1994–2009 y 2010–2025.
- Una carta conserva nombre, nacionalidad, club, temporada, posiciones históricas, escudo, imagen de club y procedencia de cada dato.
- OVR, posiciones secundarias y rasgo son valores editoriales propios, documentados junto con su justificación.

## Matriz de capacidad país–ciclo

| País | 1962–1977 | 1978–1993 | 1994–2009 | 2010–2025 | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Argentina | 8 | 10 | 10 | 8 | 36 |
| Brasil | 6 | 6 | 6 | 6 | 24 |
| Italia | 6 | 8 | 10 | 0 | 24 |
| Francia | 0 | 6 | 8 | 10 | 24 |
| España | 6 | 0 | 8 | 10 | 24 |
| Portugal | 6 | 6 | 7 | 0 | 19 |
| **Total** | **32** | **36** | **41** | **34** | **151** |

## Capacidad de oferta

- Celda de 6, 7 u 8: oferta normal de 3 y reroll contextual de 3 candidatos inéditos.
- Celda de 10: oferta especial de 5 y reroll contextual de 5 candidatos inéditos.
- Celdas especiales: Argentina 1978–1993; Argentina 1994–2009; Italia 1994–2009; Francia 2010–2025; España 2010–2025.
- Ninguna carta puede repetirse dentro de una run. El contexto se agota tras la elección, no mientras su oferta o reroll están activos.

## Cuota de posiciones primarias

| Posición | POR | LD | DFC | LI | MC | ED | DC | EI | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Cartas | 14 | 14 | 27 | 14 | 42 | 13 | 13 | 14 | 151 |

Estas cuotas replican la demanda de plazas de la formación 4-3-3. Las posiciones secundarias son independientes y no las compensan.

## Cobertura posicional por contexto

| Posición | POR | LD | DFC | LI | MC | ED | DC | EI |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Contextos activos mínimos | 12 | 12 | 16 | 12 | 20 | 11 | 11 | 12 |

Una posición cuenta una sola vez por celda país–ciclo, aunque esa celda contenga más de una carta de esa primaria. Esta regla distribuye las cuotas globales y permite a la protección encontrar alternativas sin reutilizar siempre los mismos contextos.

## Curva de OVR objetivo

| Banda | 96–100 | 90–95 | 84–89 | 77–83 | 70–76 | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Cartas | 6 | 18 | 43 | 54 | 30 | 151 |

La banda es un objetivo de curaduría. El número exacto de cada carta se asigna mediante la rúbrica editorial y cartas ancla; no se importa de otro juego ni se calcula automáticamente desde estadísticas. El OVR usa enteros entre 70 y 100 y permite valores repetidos; no pretende ordenar de forma absoluta cartas con el mismo número.

## Procedencia y control de calidad

- **Índice y contraste inicial:** Wikidata/Wikipedia.
- **Resolución de ambigüedades históricas:** sitios oficiales de clubes, FIFA o UEFA.
- **Inventario de imágenes:** Wikimedia Commons.
- **Por carta:** registrar fuente, URL y fecha de consulta de hechos y activo visual; descargar y normalizar la imagen de club para servirla localmente.
- **Separación editorial:** OVR, rasgo y posiciones secundarias son decisiones propias del juego con justificación interna; no son campos importados.
- **Umbral de hechos de versión:** cada carta requiere su QID y una fuente que sostenga club y temporada. Una fuente oficial de club, FIFA o UEFA se usa para resolver conflicto, ausencia o ambigüedad; no se exige duplicar evidencia cuando la fuente inicial ya es inequívoca.
- **Ruta visual:** Wikimedia Commons es el inventario preferente si contiene una foto con camiseta coherente. Un archivo de club, FIFA o UEFA es el respaldo si Commons no cubre la versión. Nunca se incorpora una imagen desde un resultado arbitrario de buscador sin procedencia registrada.

## Criterio de selección de futbolistas

Primero se cumplen las restricciones de país–ciclo, posición primaria, curva de OVR y presencia de rasgos. Entre los candidatos válidos, se prioriza reconocimiento e identidad mítica antes que una selección puramente estadística. La fama no permite incluir una temporada que no alcance el estándar de mérito y reconocimiento histórico del catálogo.

## Orden de curaduría

1. **Identidad histórica:** jugador, temporada, club, país, ciclo mundial, posición primaria y fuente.
2. **Balance editorial y visual:** banda y valor OVR, rasgo, posiciones secundarias, justificación, imagen de club y manifiesto del activo.

Una carta no recibe valores editoriales definitivos ni activo final hasta que su identidad histórica haya sido revisada en la primera pasada.

La propuesta completa de identidad fue aprobada el 2026-08-28 y se conserva en [FULL_ROSTER_PROPOSAL.md](FULL_ROSTER_PROPOSAL.md). El 2026-08-29 se aprobó una ampliación puntual a 151 con Deco (FC Porto 2003–04) para llevar MC a veinte contextos; queda registrada en DEC-149. La siguiente pasada puede corregir hechos verificables, pero no sustituye un futbolista aprobado para resolver una necesidad de balance sin revisión editorial explícita.

La asignación propuesta de posiciones primarias está en [POSITION_ALLOCATION.md](POSITION_ALLOCATION.md) y cumple exactamente las cuotas globales aprobadas. Una carta puede recibir hasta dos posiciones secundarias, únicamente si ese rol fue desempeñado realmente de forma reconocible en su carrera; no exige que sea dominante en la temporada representada.

La propuesta de secundarias está en [SECONDARY_POSITION_ALLOCATION.md](SECONDARY_POSITION_ALLOCATION.md). Debe contrastarse en el manifiesto de procedencia antes de convertirse en catálogo activo.

La asignación de rasgos está en [TRAIT_ALLOCATION.md](TRAIT_ALLOCATION.md): 29 Creador, 26 Técnico, 25 Muro defensivo, 24 Velocista, 24 Físico y 23 Rematador. Todas las cartas tienen uno; Muro defensivo también puede aplicarse a POR.

La asignación editorial de OVR está en [OVR_ALLOCATION.md](OVR_ALLOCATION.md). Conserva exactamente la curva aprobada y las seis cartas ancla; sus valores se revisarán mediante pruebas de oferta antes de convertirse en datos activos.

El estado por carta de fuentes y activos se mantiene en [DATA_PROVENANCE_MANIFEST.md](DATA_PROVENANCE_MANIFEST.md). Distingue el índice histórico de la verificación de la versión y de la imagen local final para no presentar una de esas capas como si cubriera las demás.

## Anclas OVR de la banda cumbre

| OVR | Jugador | Temporada | Club |
| ---: | --- | --- | --- |
| 100 | Diego Maradona | 1986–87 | Napoli |
| 100 | Lionel Messi | 2008–09 | FC Barcelona |
| 99 | Pelé | 1962 | Santos FC |
| 98 | Ronaldo | 1997–98 | Inter de Milán |
| 97 | Zico | 1981 | Flamengo |
| 96 | Cristiano Ronaldo | 2007–08 | Manchester United |

Estas seis cartas ocupan íntegramente la banda 96–100 aprobada. Las restantes 144 se valoran por comparación editorial con estas anclas y con pares históricos de posición y época.

## Verificaciones restantes antes de activar el catálogo

1. Revisar OVR editorial mediante pruebas de oferta, respetando bandas y anclas aprobadas.
2. Contrastar las posiciones secundarias ya propuestas en el manifiesto de procedencia.
3. Completar manifiesto de hechos y activos visuales para las 151 cartas, incluidas descargas locales normalizables.
4. Verificar identidad histórica por carta antes de publicar el catálogo.
