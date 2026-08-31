# Sistema visual — propuesta inicial

## Estado y alcance

**Dirección visual aprobada el 2026-08-29.** Se aprobaron Cromo de leyenda, el balance grafito/marfil, el rojo como CTA principal, la tipografía compacta, el patrón de oferta móvil, la semántica de scouting y el uso adaptable de escudos a color o monocromos. La validación en Chrome de los breakpoints 360, 390 y 520 px se completó el 2026-08-31: el carril preserva cartas de 264 px y 12 px mínimos de texto a 360 px; desde 520 px las tres cartas entran sin desborde. Este documento define reglas para una PWA mobile-first y no implementa pantallas, componentes, motor ni catálogo.

La referencia buscada combina el atractivo de carta coleccionable y decisión rápida de un juego arcade con la lectura tranquila de un roguelite de cartas. La referencia deportiva tipo Nike/adidas se traduce en tipografía, composición y energía, no en marcas, nombres, logos ni activos de terceros.

## Input de dirección confirmado

- Personalidad: **memorable, épica, emocionante**.
- Balance: **70% arcade/coleccionable, 30% táctica/estratégica**.
- Prioridades: cartas, sinergias claras y comodidad de lectura inspirada en roguelites de cartas, sin estética de 8 bits.
- Evitar: neón/cyberpunk, exceso de brillos y saturación visual.
- Permitido como referencia: un realismo deportivo contemporáneo, escudos e identidades reales bajo la premisa de licencias ya cubierta por el diseño canónico. Esto no autoriza a reutilizar activos de terceros fuera del catálogo aprobado.
- Sin país, club, competición o estilo nacional que deba excluirse o dominar la identidad.

## Principios de diseño

1. **La decisión se lee antes de sentirse.** OVR, posición, trait y química se distinguen en menos de un vistazo; la foto y el cromo refuerzan, no compiten con ellos.
2. **Energía sin ruido.** El contraste viene de tinta oscura, papel cálido y uno o dos acentos de señal; nunca de fondos luminosos, gradientes eléctricos ni sombras brillantes.
3. **La carta es una promesa táctica.** Cada carta comunica inmediatamente fuerza, encaje y posible sinergia. El detalle amplía evidencia; no oculta una regla esencial.
4. **El tap no debe castigar.** Tocar una carta solo abre o selecciona para inspección. `Elegir` confirma el pick, tal como exige el loop canónico.
5. **Lo especial se marca por ritmo, no por confeti.** Los picks 4 y 8 de cinco cartas se anuncian como un momento de draft ampliado con composición y copy, no con una rareza ficticia ni una recompensa de casino.

## Tres direcciones propias

### A. Cromo de leyenda — aprobada

Cartas de fotografía real sobre una base grafito y marfil; numerales amplios, bloques diagonales muy contenidos y bordes mate. El lenguaje recuerda a una carpeta de scouting convertida en colección: deportivo, intenso y ordenado.

- Aporta: mayor presencia de la carta, emoción de colección y una jerarquía natural para OVR, posición, club y trait.
- Riesgo: si los marcos de rareza o los acentos se multiplican, puede derivar hacia FUT/gacha. La regla de un solo acento fuerte por carta lo evita.
- Encaje: expresa el 70/30 pedido; la carta emociona primero y la información táctica permanece disponible sin convertirse en una planilla.

### B. Relato de estadio

Una dirección editorial de revista deportiva: titulares condensados, mucho marfil, fotos a sangre y datos en cintillos. Las cartas parecen una portada o recorte histórico más que un objeto coleccionable.

- Aporta: una identidad épica, reconocible y muy ligada a la historia del fútbol; excelente para la pantalla de resultado y colección.
- Riesgo: el contenido editorial puede restar rapidez de comparación en la oferta y bajar la sensación de premio inmediato.
- Encaje: prioriza emoción narrativa sobre el comportamiento de juego de cartas.

### C. Tablero del DT

Fondos carbón, retícula tenue de campo y módulos compactos. OVR, posiciones, química y traits funcionan como instrumentación de un tablero táctico; la foto ocupa menos superficie.

- Aporta: máxima explicabilidad de química, posiciones y score; es el mejor marco para jugadores que optimizan la run.
- Riesgo: puede sentirse más herramienta de manager que aventura coleccionable y dar demasiada densidad a una sesión de 4–6 minutos.
- Encaje: preserva el 30% táctico, pero no debería dominar el MVP.

### Dirección aprobada

Se adopta **A. Cromo de leyenda**, usando la contención informativa de C para química, traits y desglose. Es la única alternativa que hace de la carta el premio emocional sin sacrificar una lectura móvil rápida.

## Sistema mínimo propuesto para A

### Paleta

La base es oscura y mate; el marfil se usa para superficies de lectura y la energía aparece solo en señales relevantes.

| Token | Valor | Uso |
| --- | --- | --- |
| `ink-950` | `#111517` | Fondo principal, texto sobre marfil |
| `ink-800` | `#20272B` | Superficie oscura elevada, marcos de carta |
| `slate-500` | `#748087` | Texto secundario y estados inactivos |
| `paper-50` | `#F6F1E7` | Superficie de lectura, texto sobre fondo oscuro |
| `paper-200` | `#E3DCCD` | Divisores, superficie secundaria |
| `signal-red-600` | `#C94332` | CTA de confirmación, selección y alertas de decisión |
| `signal-blue-600` | `#2D66C3` | Información, navegación y scouting medio |
| `signal-amber-600` | `#B77A19` | Hitos, scouting de alta precisión y progreso |
| `signal-green-600` | `#24765B` | Química positiva y éxito |
| `signal-danger-650` | `#A83232` | Error, posición no compatible y acción destructiva |

Los colores de trait son etiquetas de clasificación, no una segunda escala de rareza: Rematador `#B84539`, Creador `#2D66C3`, Técnico `#7655A8`, Velocista `#B77A19`, Físico `#8A5A35` y Muro defensivo `#24765B`. Cada uno siempre se acompaña de icono y texto; el color no puede ser la única señal.

### Tipografía

- **Display, OVR y posición:** `Barlow Condensed`, con fallback `Arial Narrow, sans-serif`; pesos 700 y 800. Su función es dar golpe deportivo y permitir números grandes sin ocupar ancho.
- **Interfaz, nombres y explicación:** `Inter`, con fallback `system-ui, sans-serif`; pesos 500, 600 y 700. Es la capa calmada y accesible.
- No se escribe texto corrido en mayúsculas. Las mayúsculas se reservan para posición, microetiquetas y datos de 1–2 palabras.
- Escala compacta aprobada: 12 / 14 / 16 / 18 / 22 / 28 / 40 px. El OVR puede usar 40 px; ningún titular corriente supera 28 px. Interlineado mínimo 1.25 para título y 1.45 para lectura.

La disponibilidad, licencia y carga local/remota de estas familias es una decisión de implementación pendiente; el sistema no añade fuentes todavía.

### Espaciado, bordes y elevación

- Unidad base: 4 px. Escala: `4, 8, 12, 16, 20, 24, 32, 40, 48`.
- Radio: 8 px para chips y controles pequeños; 12 px para filas y botones; 16 px para paneles; 20 px para cartas principales.
- Bordes: 1 px `paper-200` en fondo claro o un blanco al 14% sobre `ink-800`. El borde activo usa `signal-red-600`, no una sombra luminosa.
- Elevación 0: superficie plana. Elevación 1: borde + cambio de tono. Elevación 2: sombra negra al 24%, `0 8px 24px`; solo para carta activa o hoja inferior. Elevación 3 se reserva para el CTA fijo y nunca se combina con brillo.
- **Carta canónica aprobada:** silueta compacta tipo escudo, con hombros recortados y una punta inferior poco profunda; cara marfil, borde grafito fino y textura de papel mate. Es la misma carta en detalle, oferta normal y oferta ampliada: solo cambian escala, estado de inspección y cantidad de información secundaria, nunca forma, jerarquía ni marco base.

### Iconografía

- Sistema propio de trazos redondeados de 2 px en retícula de 24 px.
- Las posiciones usan abreviaturas (POR, LD, DFC, LI, MC, ED, DC, EI) y no dependen de un pictograma ambiguo.
- Química distingue explícitamente país, club y ciclo mundial mediante globo/insignia/cronología; los traits usan un glifo propio más su nombre.
- Reroll, scouting, información y confirmación requieren texto visible además de icono. No se reutilizan iconos, escudos ni siluetas identificables de productos de referencia.

### Tokens de precisión de scouting

Estos niveles describen cuánta información revela el scouting, no la calidad del jugador ni la rareza de su carta. Reflejan el contrato actual del motor.

| Token | Contrato visible | Probabilidad actual | Tratamiento |
| --- | --- | ---: | --- |
| `scouting-contexto` | País y ciclo del próximo roll | 50% | `slate-500`, icono de mapa, etiqueta “Pista” |
| `scouting-lectura` | Posición y trait | 30% | `signal-blue-600`, icono de lupa, etiqueta “Lectura” |
| `scouting-perfil` | Perfil sin identidad, incluido OVR | 15% | `signal-amber-600`, icono de expediente, etiqueta “Informe” |
| `scouting-confirmado` | Carta exacta | 5% | `signal-red-600` sobre marfil, icono de sello, etiqueta “Confirmado” |

Ningún nivel usa destellos, cofres, ruletas ni animaciones de revelación de estilo casino. El texto debe explicar qué se sabe y que el dato corresponde al **próximo** roll.

### Estados táctiles y de foco

| Estado | Regla visual y de interacción |
| --- | --- |
| Reposo | Borde neutro, contraste normal, objetivo táctil mínimo de 44 × 44 px |
| Presionado | Oscurecer o aclarar la superficie un nivel durante el toque; escala máxima 0.98, sin rebote |
| Inspeccionado | Borde de selección rojo y etiqueta “Revisando”; aún no altera la run |
| Confirmable | CTA `Elegir` rojo, explícito y separado de la carta |
| Confirmando | Bloqueo breve de doble tap, etiqueta de progreso y preservación de contexto |
| Deshabilitado | Opacidad visual moderada, razón textual visible; no depender solo de gris |
| Éxito | Verde solo para química/acción resuelta, más feedback textual |
| Error o incompatibilidad | Rojo oscuro y explicación de OVR efectivo o penalización; nunca solo un ícono |
| Foco de teclado | Anillo exterior de 2 px azul con separación de 2 px, independiente de la selección |

Las transiciones duran 120–180 ms, respetan `prefers-reduced-motion` y nunca ocultan una actualización de score o química.

### Resumen de química y traits aprobado

- Un panel compacto, separado de la carta, muestra el multiplicador de química, conexiones actuales y su máximo (`n / 33`), con desglose explícito por **país**, **club** y **ciclo**. El verde solo señala el efecto positivo ya obtenido.
- Debajo, los seis traits potenciales se representan como filas de progreso: icono, nombre, conteo actual y umbral. Los umbrales se leen como `2 / 3`, `3 / 5`, etc.; un bonus activo muestra su valor (`+1` o `+3`) sin exigir cálculos mentales.
- La fila puede incluir una pista contextual breve únicamente si el estado de juego la sustenta (por ejemplo, información revelada por scouting). Nunca promete que el siguiente pick completará un trait si no existe tal evidencia.
- La finalidad es explicar una decisión, no exponer una planilla: no muestra estadísticas históricas, fotos, escudos ni datos que no afecten química, traits o score.

### Hoja de scouting aprobada

- Scouting se presenta en una hoja inferior marfil sobre fondo grafito atenuado, con icono de binoculares y un nivel de precisión azul/ámbar/rojo según el token correspondiente.
- El encabezado siempre sitúa la información: `Pick actual · próximo pick`. El cuerpo empieza por “Próximo roll” y muestra exclusivamente lo soportado por el informe: contexto, posición+trait, perfil sin identidad o carta exacta.
- Debajo se explicita lo que el nivel **no** revela cuando aplique. Por ejemplo, `Lectura` aclara que no revela OVR ni identidad. Esto evita que el usuario interprete una pista como una carta garantizada.
- La única salida es `Entendido`; usar scouting no confirma pick, no cambia la oferta actual y no usa lenguajes de cofre, ruleta, premio o rareza de jugador.

### Formación y colocación aprobadas

- La formación 4-3-3 conserva la carta canónica a escala reducida en sus once plazas: cada mini-carta muestra **retrato**, **nombre corto**, **OVR** y **posición**. Una plaza nunca se representa solo con un número, un ícono o una silueta anónima.
- La plaza activa recibe borde rojo y la etiqueta `Elegir plaza`. Al seleccionar una plaza, el área inferior muestra la carta elegida en tamaño mayor, con retrato y nombre completos, más el CTA explícito `Ubicar en [posición]`.
- Esta representación mantiene la magia del jugador dentro del tablero táctico; no se sustituye por marcadores circulares ni fichas abstractas.
- La legibilidad de once retratos y nombres cortos en 360 px es una validación obligatoria antes de fijar el tamaño final de mini-carta.

### Contexto de run y repetición aprobados

- Una franja persistente y compacta muestra `Elección n / 11`, once marcas de progreso, el contexto activo **país · ciclo mundial** y los estados de `Explorar` y `Repetir`. El texto visible al jugador se mantiene en español; `reroll` es solo un alias técnico.
- El contexto país–ciclo es el dato dominante de la franja. `Explorar · 1 uso` se expresa en azul informativo; `Repetir · 1 uso` permanece neutral hasta que el usuario lo solicite. Ninguna de las dos acciones desplaza la jerarquía de las cartas ni del CTA `Elegir`.
- `Repetir oferta` abre una hoja de confirmación. Explica que se reemplazan las **opciones** de la oferta —sin fijar tres o cinco—, que el contexto no cambia y que es un único uso en la partida. La confirmación usa rojo; `Cancelar` conserva un tratamiento neutral equivalente en tamaño.
- La hoja no revela jugadores, no usa banderas obligatorias, no simula apertura de sobres y no promete una mejora de OVR. Al resolverse, las acciones agotadas pasan a estado deshabilitado con motivo visible.

### Ficha expandible de carta aprobada

- Tocar una carta abre una hoja de detalle; **no** confirma la elección. La misma carta canónica se muestra en escala media y el cierre es una acción neutral explícita.
- La ficha agrega, en orden: posición primaria y OVR base, posiciones secundarias y su OVR efectivo, dos o tres hitos de temporada, y el conteo actual del trait dentro de la squad. Estos datos amplían una decisión sin ocultar la información mínima de la carta.
- Los hitos de temporada, escudos, club, temporada e imagen deben proceder del catálogo histórico verificado. Cualquier cifra usada en una lámina de exploración es ilustrativa y no habilita contenido sintético en el producto.
- `Elegir [nombre]` es el único CTA de consecuencia de la ficha. Visualmente se separa de `Cerrar`; la lectura de posiciones, hitos y traits no altera la run.

### Resultado de partida aprobado

- El resultado usa un panel `Puntaje del equipo` que muestra primero el valor final y, sin salir de la vista, resume las tres capas: OVR efectivo, multiplicador de química y bonus de traits. La aritmética visible respeta el orden canónico `OVR efectivo × química + traits`.
- `¿Por qué?` expande el desglose en la misma pantalla. La explicación es un derecho del jugador, no una pantalla de ayuda secundaria ni una recompensa por interacción.
- La comparación con récord personal es condicional: comunica un nuevo récord solo cuando existe y, en caso contrario, muestra una diferencia neutral sin desvalorizar la run. El verde queda reservado para mejora real.
- `Nueva partida` es el CTA primario tras completar una run; `Ver mi formación` es secundario y conserva la squad accesible sin desplazarla. No se usan cofres, monedas, confeti ni lenguaje de premio aleatorio.

### Selector de modos aprobado

- `Partida libre` es la acción de entrada dominante: comunica 11 elecciones y una duración estimada de 4–6 minutos, y usa `Iniciar partida` como único CTA principal.
- `Draft diario` puede permanecer visible como dirección competitiva, pero en el MVP se presenta claramente bloqueado como `Próximamente`: sin CTA, fecha, contador, recompensa ni estado simulado. Su mensaje explica equidad (“Mismas oportunidades para todos”), no urgencia.
- La jerarquía entre ambos evita que una funcionalidad futura desvíe atención del loop que se está validando.

### Reanudación de partida aprobada

- Cuando existe una partida local válida, se presenta una tarjeta `Partida en curso` con elección actual, contexto país–ciclo y una tira de cartas canónicas ya elegidas. Cada mini-carta conserva retrato y nombre para que la run se perciba como una squad propia, no como un estado abstracto.
- `Reanudar partida` es la única acción dominante. El mensaje informa que el progreso sigue en el dispositivo; no sugiere respaldo en nube, sincronización ni cuenta hasta que esas capacidades existan.
- Esta superficie no expone una acción directa para descartar o reemplazar la run. Si se habilita iniciar otra desde una partida persistida, requerirá una confirmación posterior que explique su consecuencia.

### Colección visual aprobada

- La colección se expresa como archivo de `Cartas vistas`, con progreso sobre el catálogo activo y filtros simples de todas, país y trait. No se presentan sobres, monedas, recursos, niveles de rareza ni casillas de jugador desconocido.
- Cada mini-carta conserva la silueta canónica, retrato, nombre, OVR y posición. La colección refuerza historia personal de drafts, no una economía de obtención.
- El conteo y los filtros se alimentarán solo del catálogo activo y del historial real de cartas vistas. No se muestran cartas sintéticas ni placeholders visibles.

### Compatibilidad posicional aprobada

- Antes de confirmar una ubicación, un componente compacto compara la misma carta canónica contra plaza primaria, secundaria y fuera de posición. Cada fila declara posición, clasificación, OVR efectivo y variación numérica: `0`, `−4` o `−10`.
- Verde, ámbar y rojo acompañan respectivamente primaria, secundaria y fuera de posición, pero el texto y los números hacen legible la consecuencia sin depender del color.
- La plaza seleccionada se identifica con una etiqueta explícita y el CTA adopta el destino (`Ubicar en ED`). Ninguna colocación se confirma por tocar una fila de comparación.

### Continuidad offline aprobada

- Cuando se verifica que una run local ya fue persistida, una banda no bloqueante comunica `Sin conexión` y que la partida actual sigue disponible en ese dispositivo. Es un estado de red, no un error del jugador ni una promesa de sincronización remota.
- El aviso usa ámbar informativo, puede cerrarse y no interrumpe un pick. Nunca debe afirmar que una partida está a salvo si la persistencia local falló; ese escenario requiere un estado de error distinto y explícito.

## Reglas de carta y oferta en móvil vertical

### Jerarquía mínima de una carta

La carta base siempre muestra, en este orden perceptivo:

1. **OVR** grande y **posición primaria** en el mismo bloque superior.
2. Nombre y foto de la versión histórica.
3. Club, temporada y escudo verificado.
4. Trait con contador de progreso actual hacia 3 o 5.
5. Tres marcadores compactos de química: país, club y ciclo mundial.
6. Señal clara si la colocación propuesta implica OVR secundario o fuera de posición.

Posiciones secundarias e hitos históricos viven en el detalle expandible. No se reduce el tamaño de OVR, posición, trait o marcadores de química para añadir estadística decorativa.

### Oferta normal: tres cartas

- Bajo 520 px, usar carril horizontal con snap y un resumen fijo de comparación (OVR, posición y trait) para las tres opciones. Cada carta conserva hombros recortados, punta inferior, OVR/posición, retrato, nombre, trait y tres marcadores de química. No se usan cartas rectangulares ni una variante más alta para esta oferta.
- Desde 520 px, mostrar las tres cartas canónicas compactas y comparables en una grilla de tres columnas. Nunca comprimir texto por debajo de 12 px.
- Tocar abre la inspección; `Elegir` aparece en una zona fija inferior solo después de inspeccionar una carta.

### Oferta especial: cinco cartas

- No intentar cinco cartas completas en una única fila móvil. Mostrar la misma carta canónica, ampliada en un carril horizontal con snap, contador “1 de 5” y una tira compacta persistente de OVR/posición/trait para las cinco opciones.
- El contexto país–ciclo, progreso de la run y acciones disponibles permanecen anclados fuera del carril. Solo la galería se desplaza.
- El hito se comunica como “Oferta ampliada” y `5 opciones`; no como una caja de premio ni una rareza monetizable.

### CTA de confirmación

- Único CTA de consecuencia: `Elegir [nombre]`.
- Ubicación inferior persistente por encima del área segura del dispositivo; 48 px de alto mínimo y texto con el nombre para impedir confirmaciones ambiguas.
- Scouting y reroll son acciones secundarias, nunca visualmente más fuertes que `Elegir` una vez inspeccionada una carta.

## Decisiones de implementación

| Decisión | Estado |
| --- | --- |
| Dirección final: **Cromo de leyenda** | Aprobada |
| Base cromática grafito/marfil | Aprobada |
| Rojo de señal como CTA principal; azul/ámbar para scouting | Aprobada |
| Barlow Condensed + Inter, con escala compacta de 12–40 px | Aprobada |
| Tres cartas: fila desde 360 px y carril bajo ese ancho | Aprobada |
| Cinco cartas: carril + tira comparativa + inspección antes de `Elegir` | Aprobada |
| Carta canónica compacta de silueta angular en todos los contextos | Aprobada |
| Niveles de scouting como precisión de información, no calidad de carta | Aprobada |
| Escudos: color por defecto; versión monocroma permitida cuando preserve legibilidad/paleta | Aprobada |
| Panel compacto de química y progreso de traits | Aprobada |
| Hoja inferior de scouting explícita sobre el próximo roll | Aprobada |
| Formación 4-3-3 con mini-cartas que muestran retrato y nombre | Aprobada |
| Franja de contexto, progreso y estados de acción de la run | Aprobada |
| Confirmación contextual de `Repetir oferta` | Aprobada |
| Ficha expandible con posiciones, hitos y trait de la carta | Aprobada |
| Panel de resultado y desglose explicable del puntaje | Aprobada |
| Selector de `Partida libre` y `Draft diario` bloqueado | Aprobada |
| Reanudación local de run con cartas ya elegidas | Aprobada |
| Archivo de colección basado en cartas vistas | Aprobada |
| Comparación explícita de OVR por compatibilidad posicional | Aprobada |
| Banda no bloqueante de continuidad offline local | Aprobada |
| Lectura en 360–430 px antes de fijar dimensiones | Ejecutada; quedan dos brechas de integración visual |

## Handoff de integración y gate de QA visual

Este bloque no prescribe estructura de código. Es el contrato de aceptación para la implementación visual; no se debe cerrar con capturas hechas con fixtures, placeholders ni cartas sin activo aprobado.

### No negociables de la primera integración

- La carta en oferta, detalle, formación, reanudación y colección conserva la misma silueta angular, borde y jerarquía de datos. En la formación puede simplificar detalle, pero nunca convertirse en ficha circular o marcador anónimo: conserva retrato, nombre, OVR y posición.
- A 360 px, una oferta de tres es compacta (no una carta alta y angosta); bajo ese ancho se transforma en carril. Una oferta de cinco es siempre carril con snap, contador y tira comparativa persistente. No se intenta mostrar cinco cartas completas en una fila.
- La exploración abre su hoja de información sobre el próximo roll. La carta se inspecciona antes de elegirla. `Elegir [nombre]` queda fijo sobre el área segura y es el único CTA con consecuencia.
- Química distingue país, club y ciclo; los traits muestran nombre, conteo, umbral y bonus al activarse. Color e icono complementan el texto, no lo sustituyen.
- La formación ofrece selección de plaza y compatibilidad primaria/secundaria/fuera de posición antes de confirmar una ubicación. La reanudación, colección y estado offline comunican únicamente capacidades locales ya existentes, sin prometer cuenta ni nube.
- En pantallas de juego, los titulares comunes se mantienen en la escala compacta aprobada (máximo 28 px); OVR es la excepción de 40 px. El énfasis procede de peso, contraste y composición, no de tipografía gigante, sombras fuertes o brillo.

### Recorrido de validación, con catálogo activo real

1. En 360, 390 y 430 px CSS, recorrer una run que cubra una oferta de tres y una de cinco. Confirmar nombre, OVR, posición, trait y tres marcadores de química sin recorte ilegible ni scroll horizontal de toda la página.
2. Inspeccionar una carta y confirmar que no cambia la run hasta pulsar `Elegir [nombre]`; revisar CTA fijo, retorno, foco de teclado y toque de 44 × 44 px o mayor.
3. Usar cada precisión de scouting y repetir oferta. Verificar que el texto describe solo el próximo roll, que repetir conserva país–ciclo y que ambos usos agotados explican su estado.
4. Formar el once, seleccionar y mover una mini-carta; comprobar en 360 px que retrato, nombre corto, OVR, posición y penalización de colocación siguen siendo reconocibles.
5. Terminar una run, revisar el cálculo visible de resultado, récord y reanudación; después simular desconexión tras persistir una run y validar que la banda offline no afirma una garantía que no pueda demostrar.
6. Verificar colección y sus filtros con cartas realmente vistas. No se admiten cartas inventadas, economías de sobres ni información no proveniente del catálogo activo.

### Ejecución de QA — 2026-08-31

- Se publicó `active-151` con 151 cartas y se recorrió una run real en 360, 390 y 430 px: oferta de tres, dos ofertas de cinco (picks 4 y 8), inspección, confirmación, resultado, formación y selección táctil de plaza. No hubo overflow horizontal de la página ni errores de consola.
- El build de producción, los tests de todos los workspaces y el gate del catálogo pasaron. La simulación del catálogo completó 1.000 runs por estrategia sin romper los invariantes reportados por el script.
- **Brecha 1 — oferta de cinco: resuelta.** El carril conserva tarjetas completas, el contador visible refleja `n de 5` al navegar o comparar y la tira permite inspeccionar las cinco opciones por OVR, posición y trait.
- **Brecha 2 — formación: resuelta.** Cada plaza usa una mini-carta de silueta angular y conserva foto, nombre corto, OVR y posición; ya no presenta retrato circular aislado.
- La verificación focalizada de ambas brechas pasó en navegador real a 360, 390 y 430 px, sin overflow horizontal ni errores de consola. Scouting, reroll y reanudación local también fueron recorridos: no confirman una carta, conservan el contexto y persisten la run. Colección y banda de continuidad offline no existen todavía en el MVP; quedan como alcance explícito de la siguiente iteración de UI, no como una falla del gate técnico. No cambian motor, catálogo ni reglas de draft.

### Condición de cierre

La dirección visual queda aprobada. La **integración visual** solo pasa a “validada” cuando el catálogo activo complete sus 151 cartas, 151 activos locales verificados y hechos de versión requeridos, y el recorrido anterior se pruebe en un navegador o teléfono real. Hasta entonces, cualquier resultado es una implementación detrás del gate editorial, no una PWA visual lista para mostrar.

## Fuera de alcance de este documento

- Pantallas completas, prototipos, componentes, CSS/tokens de código y dependencias.
- Cambios al motor, a la oferta, al catálogo, a los activos de jugadores o a las reglas de licencia/procedencia.
- Economía, monetización, recompensas, cofres, rarezas de jugador, simulación, PvP o Draft diario.

## Evidencia consultada

- `docs/game-design/GAME_DESIGN.md`: prioridad mobile-first, información obligatoria por carta, reglas de química/traits, dos ofertas de cinco, detalle antes de confirmar y premisa de licencias.
- `docs/game-design/CORE_LOOP.md`: el tap abre detalle, `Elegir` confirma y el scouting anticipa el próximo roll.
- `packages/game-core/src/index.ts`: cuatro precisiones concretas de scouting y sus probabilidades actuales (50/30/15/5).
