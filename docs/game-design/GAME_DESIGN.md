# Once Draft — diseño canónico

## Estado

Documento vivo. Refleja decisiones confirmadas y separa explícitamente las hipótesis y preguntas abiertas. No contiene diseño técnico ni implementación.

## Propósito

Diseñar un juego web/PWA propio de construcción de equipos de fútbol mediante draft, en el que el azar presente situaciones y la calidad de la respuesta del jugador determine el resultado.

## Principio de producto

> La suerte crea situaciones. La habilidad determina cómo el jugador responde a ellas.

El producto no debe depender de que una carta individual de mayor OVR resuelva la run. Las opciones deben exponer trade-offs comprensibles entre calidad individual, necesidad posicional y posibles combinaciones.

## Fantasía dominante

> Hacer el mejor draft posible.

El jugador se percibe como un DT/scout que lee un conjunto de oportunidades, construye una squad superior y puede demostrar que sus decisiones fueron mejores bajo condiciones comparables. Descubrir una build ingeniosa refuerza esa satisfacción, pero no la reemplaza.

## Público y curva de dominio

La primera experiencia se optimiza para una persona interesada en fútbol que puede leer roles y comparaciones básicas, pero no necesita conocer a futbolistas concretos ni sus estadísticas reales. La profundidad debe surgir progresivamente de reglas internas, combinaciones y decisiones del draft, no de trivia externa.

La ventaja de una persona experta debe provenir de combinar las variables relevantes de una run. Para que esto sea dominio y no memorización, esas variables deberán ser pocas, visibles y tener efectos conectados.

La anticipación puede entregar inteligencia de distinta potencia. A mayor potencia de información, menor será su probabilidad de aparición. Excepcionalmente podrá revelar una carta exacta con una probabilidad inicial de 5%.

## Plataforma prioritaria

El producto se diseña prioritariamente como **PWA mobile-first**. El loop debe funcionar con taps, lectura breve y sesiones cortas, sin exigir precisión motriz, teclado ni una pantalla grande. Esta prioridad condicionará la cantidad de información simultánea y la complejidad de cada decisión.

Todo texto visible al jugador utiliza español. Los términos de trabajo en inglés que sobrevivan en documentación se mantienen únicamente como alias de transición; no son nombres de interfaz ni de producto.

El MVP usa únicamente una formación 4-3-3 con 11 plazas. Formaciones y configuraciones posicionales futuras pueden mostrarse bloqueadas como “próximamente”, sin funcionalidad ni fecha comprometida.

En cada pick, el jugador elige una carta y luego la coloca en una plaza libre de la formación. La asignación automática no sustituye esta decisión.

La formación es 4-3-3 con once plazas exactas: POR, LD, dos DFC, LI, tres MC, ED, DC y EI. Puede reorganizarse libremente durante toda la partida. La posición afecta la base de OVR, pero ninguna colocación temprana queda bloqueada. Cada carta representa una versión histórica de una temporada concreta, con club, imagen, posiciones y ciclo mundial coherentes con esa etapa. El MVP usa una sola versión por futbolista; versiones adicionales del mismo futbolista quedan habilitadas como expansión futura. Una partida completa apunta a durar 4–6 minutos en móvil y usa reglas reales desde el inicio con ayudas contextuales breves. La landing inicia una partida libre mediante el CTA principal; Draft diario permanece visible como alternativa competitiva secundaria.

## Intención competitiva

El producto debe contar con rankings. La competencia justa se organiza alrededor del **Draft diario**: todos los participantes reciben las mismas oportunidades y se compara el resultado de sus decisiones. El récord personal permanente se conserva como una métrica individual separada. No se asumirá que un ranking global de partidas con oportunidades distintas mide habilidad de forma justa.

Cada Draft diario admite un intento competitivo. Una vez realizado, el jugador puede repetirlo para aprender o experimentar, pero esas repeticiones no afectan el ranking.

## Cierre de run

Por ahora, una run termina en un **Squad Score explicable**, con desglose de sus componentes y comparación con el récord personal o el ranking aplicable. No hay simulación, torneo ni PvP en esta fase. PvP asíncrono puede evaluarse más adelante como un ranking especial, después de validar que el score por sí mismo vuelve divertido el loop.

El Squad Score se calcula como `promedio de OVR efectivo × multiplicador de química + bonos de traits`. El OVR efectivo es el valor de cada carta tras su corrección posicional (0 en primaria, −4 en secundaria, −10 fuera de posición). La química usa `1 + (conexiones / 33 × 5%)`. Por cada trait, tres copias suman +1 y cinco copias suman +3 en lugar del +1; el total de los bonos activos se añade al final. El desglose muestra las tres capas.

Las sinergias se activan por umbrales de traits. La química se compone de tres fuentes visibles: nacionalidad, club y ciclo mundial. La posición no genera química: corrige solo la base de OVR. Esto permite que un pick por trait tenga un costo explícito si compromete el rendimiento posicional, sin duplicar el castigo.

Cada jugador puede sumar hasta tres conexiones de química: una si comparte nacionalidad con al menos un compañero, una por club y una por ciclo mundial. El total de conexiones alimenta el multiplicador `1 + (conexiones / 33 × 5%)`.

La química solo bonifica: una squad desconectada conserva su score base y una squad cohesionada obtiene un multiplicador positivo. No existe penalización de química por falta de conexiones. La escala inicial es lineal, visible y tiene un tope de +5%; se validará experimentalmente.

El MVP usa seis traits amplios. Cada jugador tiene un trait y las sinergias iniciales se activan a tres y cinco copias por conteo simple, sin patrón posicional ni requisito de contexto. El umbral de cinco reemplaza el bonus de tres por una versión superior. Los seis traits usan los mismos bonos: +1 a tres copias o +3 a cinco. Umbrales, puntajes y efecto sobre el Squad Score son visibles durante toda la run.

El catálogo inicial de rasgos es: **Rematador, Creador, Técnico, Velocista, Físico y Muro defensivo**.

Cada carta recibe exactamente un rasgo. Muro defensivo también puede aplicarse a un arquero: el rasgo expresa un perfil defensivo jugable y no una posición exclusiva.

Cada partida ofrece al menos una ruta viable hacia un umbral de cinco de algún trait; el Draft diario es la aplicación competitiva prioritaria de esta regla. La ruta no garantiza que sea la mejor elección: debe competir contra OVR, posición, química y otros rasgos.

El progreso actual de rasgos se muestra siempre. El scouting puede revelar una oportunidad futura de build, sin mostrar de forma automática una respuesta completa.

Los rolls normales ofrecen tres opciones. Cada partida contiene dos rolls especiales de cinco opciones, en los picks 4 y 8; los hitos son fijos y comunes para todas las runs.

Por defecto, los rolls especiales ocurren en hitos fijos comunes para todos los jugadores. Como hipótesis posterior, una economía podría introducir un recurso que habilite un roll ampliado, pero no forma parte del MVP ni puede comprar ventaja en el Draft diario.

En el modo principal, el RNG determina primero un país y después un ciclo mundial. La oferta resultante contiene exclusivamente versiones cuya nacionalidad y ciclo coinciden con ese contexto de roll. El club no condiciona el roll ni la selección estructural del catálogo, aunque permanece visible y continúa otorgando química en la squad. La agencia se ejerce al elegir carta/plaza y decidir scouting o reroll: el scouting anticipa el roll inmediatamente siguiente y el reroll conserva el contexto activo; la protección posicional selecciona una celda compatible cuando debe garantizar una oportunidad, sin romper el contexto temático.

Los ciclos iniciales son 1962–1977 (1962, 1966, 1970, 1974), 1978–1993 (1978, 1982, 1986, 1990), 1994–2009 (1994, 1998, 2002, 2006) y 2010–2025 (2010, 2014, 2018, 2022). Una temporada pertenece a un único ciclo.

Un contexto exacto de país–ciclo queda agotado al resolverse con una elección y no inicia otro pick dentro de esa run. El mismo país puede regresar con otro ciclo y viceversa. Una oferta normal exige al menos tres versiones inéditas del contexto; una especial, cinco. El reroll conserva el contexto activo y lo reemplaza con candidatos no vistos de esa misma celda: necesita seis cartas para una oferta normal y diez para una especial.

La protección posicional conserva su garantía de oportunidades, pero opera a nivel de contexto: al iniciar una run, un plan reproducible sortea once celdas compatibles y reserva tres candidatos primarios por categoría. Las reservas se mezclan con la oferta y no cambian el país–ciclo; POR, LD y LI reciben la tercera oportunidad en orden sorteado dentro de los picks 9–11. Nunca agrega una carta de país o ciclo incompatible.

## Dirección de contenido real

La fantasía usa jugadores, clubes, escudos e imágenes reales y permite cruces históricos reconocibles. Por decisión del propietario, el proyecto trabaja bajo la premisa de que las licencias y autorizaciones necesarias ya están cubiertas; su gestión queda fuera del alcance de diseño e implementación.

Los datos se separan en dos clases. Nombre, nacionalidad, club, temporada y ciclo mundial, posiciones históricas, escudo e imagen deben corresponder a entidades y versiones reales, con fuente y procedencia registradas. OVR, posiciones secundarias de gameplay y rasgo son valores editoriales propios: se apoyan en evidencia histórica, pero se diseñan y balancean para este juego y nunca se copian de FIFA, EA FC, FUT Draft u otro producto. El OVR compara el nivel y dominio demostrado por cada versión dentro de su propia temporada y contexto histórico, traducido mediante una rúbrica común; no compara estadísticas brutas incompatibles ni imagina rendimientos bajo condiciones modernas.

La curaduría usa Wikidata/Wikipedia como índice y primer contraste, y páginas oficiales de clubes, FIFA o UEFA cuando haya ambigüedad histórica. Wikimedia Commons es el inventario inicial de imágenes. Cada carta guarda fuente, URL y fecha de consulta para sus hechos y activo visual; las imágenes se descargan y normalizan localmente, sin hotlinks. Esta procedencia no convierte OVR, rasgo ni posiciones secundarias en datos externos: siguen siendo decisiones editoriales del juego.

La rúbrica de OVR usa bandas editoriales y cartas ancla. Primero clasifica la temporada por nivel histórico; después compara versiones de posición, época o nivel equivalentes para elegir el número exacto. Goles, asistencias, títulos, premios, continuidad y consenso son evidencia, no una fórmula automática. La escala es estable respecto del universo de cartas históricas elegibles, no relativa al pool actual: ampliar el catálogo no recalcula todas las valoraciones. Un OVR 70 puede representar el extremo menos fuerte de un catálogo de estrellas sin describir a un mal profesional. Las bandas no se muestran como rarezas adicionales durante el draft.

Las bandas iniciales son internas: 96–100 cumbre histórica; 90–95 temporada generacional; 84–89 élite mundial; 77–83 élite internacional; 70–76 figura destacada del universo elegible. Varias versiones pueden alcanzar 100 si justifican una cumbre histórica; el valor no declara un único mejor futbolista.

Las anclas iniciales de la banda cumbre son: Diego Maradona (Napoli 1986–87) y Lionel Messi (FC Barcelona 2008–09), 100; Pelé (Santos 1962), 99; Ronaldo (Inter de Milán 1997–98), 98; Zico (Flamengo 1981), 97; y Cristiano Ronaldo (Manchester United 2007–08), 96.

El OVR se expresa en enteros de 70 a 100. Los valores pueden repetirse: un mismo número indica una banda de fuerza editorial comparable, no un orden absoluto entre dos temporadas ni una precisión estadística inexistente.

La opción de draft prioriza lectura inmediata en móvil. Foto, nombre, escudo/club, temporada, OVR, posición primaria y rasgo son visibles. Nacionalidad, club y ciclo mundial funcionan como marcadores compactos de química siempre visibles, porque intervienen directamente en la elección. Una ficha expandible reserva posiciones secundarias y dos o tres hitos reales de la temporada; las estadísticas de respaldo no saturan la carta base.

La imagen respeta la identidad visual de la versión: el futbolista viste la camiseta del club correspondiente a la temporada de referencia. Una foto más icónica de la selección, otro club u otra etapa no puede sustituirla. Las futuras versiones de selección deberán modelarse como versiones propias con reglas explícitas, no como variaciones visuales del MVP.

Cuando un futbolista tiene varias temporadas elegibles, se prioriza la que mejor combina nivel demostrado y reconocimiento histórico. La composición de química del catálogo solo desempata entre versiones históricamente comparables; no justifica elegir una temporada claramente inferior.

El catálogo inicial contiene 151 cartas y no es una lista de los futbolistas con mayor OVR. Se cura como un ecosistema jugable: primero cubre la demanda posicional de la 4-3-3, los seis rasgos y suficientes celdas jugables de país–ciclo mundial; dentro de esas restricciones maximiza reconocimiento y relevancia histórica. El club no impone cuotas de selección: se registra por autenticidad y química, pero no fuerza inclusiones. La distribución es Argentina 36, Brasil 24, Italia 24, Francia 24, España 24 y Portugal 19. Todas deben cubrir varias líneas; expansiones posteriores podrán ampliar países.

Entre candidatos que cumplen las cuotas, se priorizan reconocimiento e identidad mítica por encima de una selección exclusivamente estadística. La temporada concreta sigue exigiendo mérito y reconocimiento históricos; no se incorpora una carta débil solo por ser conocida.

La matriz país–ciclo es fija para esta primera versión: Argentina 8/10/10/8; Brasil 6/6/6/6; Italia 6/8/10/0; Francia 0/6/8/10; España 6/0/8/10; Portugal 6/6/7/0, en el orden de ciclos 1962–1977, 1978–1993, 1994–2009 y 2010–2025. Una celda de 6, 7 u 8 soporta oferta normal y reroll; una de 10 también puede alojar oferta especial y su reroll. Las cinco celdas de 10 son los contextos elegibles para los dos rolls especiales.

Las 151 posiciones primarias se distribuyen por demanda de la 4-3-3: 14 POR, 14 LD, 27 DFC, 14 LI, 42 MC, 13 ED, 13 DC y 14 EI. Las posiciones secundarias no cuentan para estas cuotas: son una propiedad adicional de la carta y se asignan después de asegurar esta cobertura.

La curva editorial objetivo de OVR del catálogo es: 6 cartas entre 96–100, 18 entre 90–95, 42 entre 84–89, 54 entre 77–83 y 30 entre 70–76. Es una distribución de curaduría, no una probabilidad de aparición ni una fórmula para derivar la valoración de un futbolista.

Los modos posteriores pueden mostrarse como bloqueados y “próximamente” para comunicar la dirección del producto, pero sin fechas, recompensas ni llamadas que compitan con el loop principal.

## Fuente inicial

El punto de partida es `Game Design Document — Once Draft.pdf`, leído el 2026-08-28. Sus propuestas se tratan como hipótesis, no como requisitos aprobados.

## Decisiones de mayor impacto

Las decisiones estructurales de producto están cerradas: la curva de dominio surge de posiciones, química, traits, scouting y reroll; la run termina en Squad Score explicable; el contenido usa identidades reales bajo la premisa de licencias cubiertas; y la competencia futura se organiza alrededor de Draft diario determinista. Las calibraciones se revisarán con evidencia de pruebas y quedan registradas en `HYPOTHESES.md`, `METRICS.md` y `RISKS.md`.

## Guardrails confirmados

- La implementación no forma parte de este documento; se aborda en una fase técnica separada, sobre la arquitectura aprobada.
- No clonar interfaz, identidad, economía, contenido ni progresión de otros juegos.
- Favorecer decisiones repetibles y comprensibles antes que cantidad de sistemas.
- Todo sistema debe justificar cómo prueba que el loop es divertido; si no, queda para más adelante.
