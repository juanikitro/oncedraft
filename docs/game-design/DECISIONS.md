# Registro de decisiones

## Convención

Solo se agregan entradas cuando una decisión material está confirmada por el producto.

```md
## DEC-XXX — título

### Contexto

### Opciones consideradas

### Decisión

### Motivo

### Trade-offs

### Qué invalidaría esta decisión
```

## DEC-001 — La fantasía dominante es hacer el mejor draft posible

### Contexto

El diseño debía definir qué motivo primario sostiene una run y el impulso de iniciar otra. El GDD proponía varias capas posibles: construcción de equipo, builds, supervivencia al RNG y competición.

### Opciones consideradas

1. Ser un DT/scout brillante que arma un equipo coherente.
2. Descubrir builds ingeniosas.
3. Sobrevivir a un draft hostil.
4. Superar a otros con oportunidades equivalentes.

### Decisión

La fantasía dominante combina la maestría de DT/scout con la comparación competitiva justa: **hacer el mejor draft posible y demostrarlo frente a otros con condiciones comparables**. Descubrir builds es un refuerzo, no el objetivo principal.

### Motivo

Centra el mérito en la interpretación y respuesta a oportunidades, en lugar de en recibir una carta superior. Da una razón clara tanto para optimizar una run como para repetir y comparar decisiones.

### Trade-offs

Exige que las reglas de comparación sean percibidas como justas y que el resultado sea explicable. Introducir competición demasiado pronto podría esconder que el loop individual no es divertido.

### Qué invalidaría esta decisión

Que las pruebas indiquen que los jugadores vuelven principalmente por experimentar builds privadas, no por mejorar ni comparar la calidad de sus drafts; o que la competición reduzca la variedad y convierta el juego en resolver una única respuesta óptima.

## DEC-002 — Entrada accesible, dominio progresivo sin trivia externa

### Contexto

Había que definir el público inicial y el conocimiento previo admisible. Una fantasía de “mejor draft” puede depender de conocer futbolistas reales o, en cambio, hacer que el juego enseñe sus propias reglas.

### Opciones consideradas

1. Público casual con decisiones simples y techo bajo.
2. Público estratégico que ya conoce fútbol y sistemas de draft.
3. Entrada casual con profundidad progresiva.

### Decisión

Se adopta una combinación de entrada casual y profundidad progresiva. El jugador no debe necesitar conocer a un futbolista aleatorio ni datos de fútbol real para decidir. Debe poder aprender a dominar el juego con una curva propia.

### Motivo

Amplía la accesibilidad sin renunciar a que mejorar el draft requiera aprendizaje, lectura y criterio.

### Trade-offs

Cada regla adicional debe ser enseñable en contexto y producir una decisión nueva; de lo contrario será ruido. El diseño no puede depender de reconocimiento de nombres para generar interés.

### Qué invalidaría esta decisión

Que una primera run sin conocimiento previo sea confusa o que, al simplificarla, no exista una diferencia observable entre decisiones de una persona nueva y una experta.

## DEC-003 — La curva combina composición, sinergias y una anticipación limitada

### Contexto

Se necesitaba definir cómo una persona experta obtiene ventaja sin depender de trivia de fútbol real. Se consideraron composición visible, sinergias pequeñas, planificación del draft o una combinación por capas.

### Opciones consideradas

1. Composición visible solamente.
2. Posiciones con sinergias pequeñas.
3. Planificación de draft mediante información futura y recursos.
4. Composición visible primero y una única capa de anticipación, con sinergias que generen decisiones.

### Decisión

La curva debe combinar composición visible, buenos sistemas de sinergia y un mecanismo de anticipación limitado. La pericia nace de jugar con todas las variables relevantes de una run.

### Motivo

Esta combinación permite una primera lectura simple y, a la vez, decisiones de más nivel que conectan el estado actual con una oportunidad futura.

### Trade-offs

“Todas las variables” no autoriza añadir sistemas ilimitados. Cada variable debe ser visible, enseñable y afectar elecciones reales; de lo contrario se elimina o posterga. El mecanismo de anticipación y las sinergias concretas siguen sin definir.

### Qué invalidaría esta decisión

Que el jugador no pueda explicar sus decisiones, que la opción óptima se vuelva obvia por cálculo, o que el sistema requiera memorizar combinaciones y no interpretar el estado de la run.

## DEC-004 — La anticipación usa scouting activable con revelación variable

### Contexto

La curva de dominio necesita una capa de anticipación sin convertir el draft en una secuencia totalmente conocida. Se consideraban previews automáticos, pistas parciales y un recurso de scouting.

### Opciones consideradas

1. Ver automáticamente el próximo contexto.
2. Ver automáticamente dos contextos futuros.
3. Recibir una pista parcial automática.
4. Gastar un recurso de scouting para revelar información futura.

### Decisión

La anticipación se basa en un recurso de scouting que el jugador activa en el momento que considere conveniente. El tipo de información revelada puede variar aleatoriamente.

### Motivo

El timing del scouting agrega agencia y tensiona el uso de recursos. La variabilidad preserva incertidumbre en vez de dar control total del futuro.

### Trade-offs

La información debe ser útil aun cuando su tipo varíe; de lo contrario se percibirá como RNG adicional sin decisión. Quedan abiertos los tipos de revelación, su cantidad por run y si el jugador puede saber qué tipo obtendrá antes de gastar el recurso.

### Qué invalidaría esta decisión

Que revelar información no cambie picks o que el mejor momento de usar scouting sea siempre obvio, repetitivo o dependa de suerte no respondible.

## DEC-005 — PWA mobile-first

### Contexto

El producto se proyecta como juego web/PWA y debía establecerse si mobile es una adaptación o el punto de diseño dominante.

### Opciones consideradas

1. Diseñar primero para escritorio y adaptar a móvil.
2. Diseñar simultáneamente para ambos formatos.
3. Diseñar PWA mobile-first, conservando compatibilidad de navegador.

### Decisión

La prioridad es PWA mobile-first.

### Motivo

Encaja con runs cortas, decisiones por tap y la ambición de repetición frecuente.

### Trade-offs

Limita la densidad de información y exige explicar estados complejos sin depender de tooltips, tablas o pantalla amplia. Las decisiones deben seguir siendo estratégicas con lectura breve.

### Qué invalidaría esta decisión

Que el loop requiera comparar tanta información simultánea que el móvil degrade sustancialmente la calidad de decisión frente a escritorio.

## DEC-006 — El scouting tiene resultados aleatorios ponderados por potencia

### Contexto

El recurso de scouting debía definir qué tipo de información variable revela. Se propusieron informes de contexto, necesidad futura, oportunidad de build o una combinación aleatoria de ellos.

### Opciones consideradas

1. Contexto futuro solamente.
2. Necesidad futura solamente.
3. Oportunidad de build solamente.
4. Informe variable entre los tres tipos.

### Decisión

El scouting revela aleatoriamente un informe de contexto, necesidad futura u oportunidad de build. La probabilidad depende de la potencia del informe: las ayudas más fuertes son más raras. Existe una oportunidad inicial de 5% de revelar una carta exacta.

### Motivo

Mantiene incertidumbre y variedad sin renunciar a que la información pueda cambiar una decisión. Una revelación excepcional crea un momento memorable de scout.

### Trade-offs

El 5% de carta exacta puede aumentar la percepción de que una run se gana por suerte, o puede hacer que el jugador guarde el scouting esperando un resultado improbable. Las probabilidades completas, el momento evaluado y la cantidad de usos por run siguen abiertos.

### Qué invalidaría esta decisión

Que el informe fuerte explique desproporcionadamente el resultado de la run, que los informes débiles no afecten elecciones, o que los jugadores perciban la tabla como una lotería sin respuesta estratégica.

## DEC-007 — La rareza del scouting se comunica con color propio

### Contexto

Los resultados de scouting tienen potencia y rareza distintas. En móvil, el jugador necesita reconocerlas rápidamente.

### Opciones consideradas

1. Texto y probabilidad únicamente.
2. Color como señal principal de rareza.
3. Color, icono y texto explicativo.

### Decisión

La rareza de cada informe de scouting cambia su color. La intención se inspira en la lectura rápida de rarezas de cartas, pero se desarrollará una identidad visual propia, sin copiar assets, interfaz, nombres ni estilo de otro producto.

### Motivo

El color permite reconocer la fuerza excepcional del resultado de un vistazo en una PWA móvil.

### Trade-offs

El color por sí solo no debe ser la única señal: habrá que resolver accesibilidad y explicar el efecto mecánico. La paleta y el tratamiento visual concreto no se diseñan en esta fase.

### Qué invalidaría esta decisión

Que el código de color confunda, no sea accesible o induzca a pensar que rareza equivale automáticamente a la mejor decisión.

## DEC-008 — El MVP usa un scouting por run; compras quedan fuera

### Contexto

Se necesitaba acotar la cantidad de scouting para validar el mecanismo antes de introducir una economía.

### Opciones consideradas

1. Uno fijo desde el inicio.
2. Dos fijos desde el inicio.
3. Uno fijo y otro ganado durante la run.
4. Obtenerlos sacrificando otro recurso.

### Decisión

El MVP tendrá un scouting por run. La posibilidad de comprar scouting pertenece a una economía futura y no forma parte del MVP.

### Motivo

Un único uso permite validar el timing y la utilidad del sistema sin introducir economía, ventajas acumulativas ni complejidad adicional.

### Trade-offs

Un uso puede resultar insuficiente para expresar una estrategia amplia. La economía futura deberá respetar la competencia justa y no podrá convertirse en ventaja de pago.

### Qué invalidaría esta decisión

Que la mayoría de jugadores no use el scouting, que un solo uso no produzca decisiones observables o que el loop necesite más recursos para ser interesante incluso en pruebas iniciales.

## DEC-009 — Daily Seed competitivo y récord personal permanente separados

### Contexto

Se quiere incorporar ranking sin confundir habilidad con oportunidades de draft distintas. Las alternativas eran un Daily Seed, un ranking global de runs libres, comparación entre amigos o separar competencia justa de progreso individual.

### Opciones consideradas

1. Daily Seed como ranking principal.
2. Ranking global de runs libres.
3. Ranking entre amigos por seed compartida.
4. Daily Seed principal y récord personal permanente separado.

### Decisión

Se implementa conceptualmente la opción 4: el **Daily Seed** es el ranking competitivo principal y el **récord personal** se mantiene en un circuito individual permanente. Las tablas no se mezclan.

### Motivo

El Daily Seed permite comparar decisiones bajo oportunidades equivalentes; el récord personal conserva una motivación de mejora aun cuando una run no sea competitivamente comparable.

### Trade-offs

El Daily Seed requiere definir desempates, elegibilidad, repetición, visibilidad del seed y medidas anti-cheat antes de publicarlo. No se incluye automáticamente en el MVP solo por ser intención de producto.

### Qué invalidaría esta decisión

Que el seed común derive en una solución única, que el ranking no motive participación o que no resulte posible verificar los resultados sin una complejidad que no justifique el aprendizaje del MVP.

## DEC-010 — Un intento competitivo y replays no rankeados por Daily Seed

### Contexto

Una tabla de Daily Seed puede medir una decisión única o premiar la repetición intensiva de la misma secuencia.

### Opciones consideradas

1. Un intento competitivo por Daily Seed.
2. Reintentos ilimitados, cuenta el mejor score.
3. Dos o tres intentos competitivos.
4. Un intento competitivo y replays posteriores no rankeados.

### Decisión

Cada Daily Seed permite un único intento competitivo. Los replays posteriores son posibles para aprendizaje, exploración o compartir, pero no modifican el ranking.

### Motivo

Mantiene el ranking como comparación de decisión bajo condiciones comunes, sin premiar principalmente horas de reintentos. A la vez, no impide que una persona estudie o disfrute el seed después.

### Trade-offs

Puede sentirse exigente para participantes casuales y no elimina por sí solo la necesidad de una competencia verificable. El juego debe dejar muy claro antes de empezar qué intento cuenta para ranking.

### Qué invalidaría esta decisión

Que el único intento reduzca de forma material la participación o que los replays no rankeados no ofrezcan valor suficiente para quien quiere aprender del resultado.

## DEC-011 — La run termina en Squad Score explicable; PvP queda posterior

### Contexto

Una squad terminada necesita una consecuencia que valide el draft. Se consideraron score directo, simulación contra IA, torneo corto y PvP asíncrono.

### Opciones consideradas

1. Squad Score explicable con desglose y comparación.
2. Score más simulación mínima contra IA.
3. Score más torneo corto.
4. PvP asíncrono.

### Decisión

Por ahora, la run termina con un Squad Score explicable y su desglose, comparado con récord personal o ranking. No hay simulación, torneo ni PvP. PvP asíncrono se considera posteriormente para un ranking especial.

### Motivo

Permite comprobar directamente si el draft y la lectura del resultado son divertidos. Evita que una simulación o competición esconda debilidades del loop.

### Trade-offs

El score debe resultar emocionalmente satisfactorio y transparente por sí mismo. PvP asíncrono no se diseña ni se prepara técnicamente todavía; será reevaluado después de validar el core loop.

### Qué invalidaría esta decisión

Que pruebas de juego muestren que un score claro no aporta consecuencia ni deseo de repetir, aun cuando las decisiones del draft sean comprensibles.

## DEC-012 — Los modos posteriores se muestran bloqueados como próximos

### Contexto

Simulación, torneos y PvP asíncrono no pertenecen al loop validado inicialmente, pero el producto quiere expresar que existen direcciones futuras.

### Opciones consideradas

1. Ocultar por completo los modos posteriores.
2. Mostrarlos como bloqueados y próximos.
3. Implementar prototipos funcionales de esos modos desde el MVP.

### Decisión

Los modos posteriores se mostrarán bloqueados como “próximamente”. No se implementan en esta fase ni se les asigna fecha, recompensa o prioridad sobre la run principal.

### Motivo

Comunica una ambición de producto sin ampliar el alcance del MVP ni fingir que los modos existen.

### Trade-offs

Puede distraer, crear expectativas prematuras o hacer que el producto parezca incompleto. Su ubicación y texto se decidirán durante el diseño del flujo, no ahora.

### Qué invalidaría esta decisión

Que pruebas de la primera experiencia muestren que los bloqueos desvían la atención de iniciar una run o generan frustración sin aumentar comprensión del producto.

## DEC-013 — El Squad Score usa multiplicadores y umbrales

### Contexto

El Squad Score necesita reconocer tanto la calidad continua de una squad como los hitos de composición. Se consideraron suma explícita, multiplicadores, umbrales y un modelo complejo.

### Opciones consideradas

1. Suma explícita únicamente.
2. Multiplicadores.
3. Umbrales.
4. Modelo mixto complejo.

### Decisión

El Squad Score combina multiplicadores y umbrales. La asignación exacta de cada regla, sus magnitudes y su orden de cálculo permanecen abiertos.

### Motivo

Los multiplicadores pueden hacer relevante la calidad conectada de la squad y los umbrales crean hitos reconocibles que refuerzan una build.

### Trade-offs

La combinación puede generar saltos excesivos, efectos compuestos difíciles de anticipar y respuestas óptimas. El desglose debe mostrar cada paso y permitir explicar el resultado.

### Qué invalidaría esta decisión

Que una persona no pueda estimar el efecto de un pick o explicar por qué su score cambió; o que un umbral/multiplicador domine sistemáticamente el OVR, las posiciones y las decisiones previas.

## DEC-014 — Base posicional, química multiplicadora y sinergias por umbral

### Contexto

Tras elegir un Squad Score con multiplicadores y umbrales, había que asignar una responsabilidad clara a posición, química y sinergias.

### Opciones consideradas

1. Química como multiplicador moderado; sinergias como umbrales con bonus fijo; posición como base/penalización.
2. Sinergias como multiplicador; química como umbrales.
3. Química y sinergias únicamente por umbrales.
4. Química y sinergias como multiplicadores según umbrales.

### Decisión

La base del score considera OVR corregido por posición. La química aplica un multiplicador moderado. Las sinergias se activan por umbrales y añaden bonos fijos.

### Motivo

Cada sistema tiene una responsabilidad distinguible: la posición evita atajos, la química recompensa cohesión general y las sinergias reconocen una build concreta.

### Trade-offs

Las magnitudes, los umbrales y la definición de “moderado” siguen abiertas. Una química demasiado fuerte puede hacer que OVR o posición importen poco; demasiados umbrales pueden llevar a perseguir una receta.

### Qué invalidaría esta decisión

Que el desglose no permita anticipar un cambio de score, que una capa domine las demás o que las personas elijan siempre por un umbral sin evaluar estado de squad ni futuro.

## DEC-015 — Traits para sinergias; contextos futbolísticos para química

### Contexto

Sinergias y química necesitan fuentes distintas para no duplicar reglas. Se consideraron traits, contextos futbolísticos, ambos como ejes de sinergia o patrones posicionales.

### Opciones consideradas

1. Traits activan sinergias; contextos quedan disponibles para química.
2. Contextos activan sinergias.
3. Traits y contextos como ejes paralelos de sinergia.
4. Patrones posicionales como sinergias principales.

### Decisión

Los traits activan sinergias mediante umbrales. Los contextos futbolísticos generan química.

### Motivo

Los traits expresan estilo y builds; los contextos expresan conexión entre jugadores. La separación permite que una carta sea interesante por dos razones diferentes, sin que ambas reglas hagan exactamente lo mismo.

### Trade-offs

El juego aún debe definir el número, tipo y presentación de traits, y qué contextos futbolísticos existen. Si ambos ejes se multiplican en exceso, se perderá la accesibilidad buscada.

### Qué invalidaría esta decisión

Que los jugadores no distingan entre química y sinergia, que una de las capas nunca cambie decisiones o que los contextos requieran trivia externa para ser interpretados.

## DEC-016 — La fantasía objetivo usa contenido oficial real, condicionada a derechos verificables

### Contexto

El producto busca que el atractivo emocional incluya jugadores, escudos e imágenes reales y combinaciones históricas reconocibles. El MVP debe evitar que una dependencia de derechos impida evaluar el loop o exponga activos no autorizados.

### Opciones consideradas

1. Universo ficticio completo.
2. Nombres y datos reales sin identidad visual de club.
3. Contenido oficial licenciado: jugadores, escudos e imágenes reales.
4. Híbrido ficticio que evoca fútbol real.

### Decisión

La dirección creativa objetivo es contenido oficial real, incluidos jugadores, escudos e imágenes. El diseño puede trabajar bajo una **suposición explícita de licencias**. Cualquier distribución pública o producción queda bloqueada hasta contar con autorizaciones verificables de los titulares aplicables; no se presupone que una sola licencia cubra todos los activos.

### Motivo

La posibilidad de construir combinaciones históricas y reconocibles es parte central de la magia buscada, no un detalle cosmético.

### Trade-offs

Los derechos pueden afectar costo, territorio, contenido disponible, calendarios y alcance. Se necesita una evaluación legal/comercial específica antes de publicación; esta decisión de producto no equivale a una autorización ni determina qué rights package se puede obtener.

### Qué invalidaría esta decisión

Que las licencias necesarias no resulten viables para el objetivo o que pruebas de concepto demuestren que el deseo de repetir no mejora materialmente con identidades reales frente a un dataset seguro.

## DEC-017 — Traits amplios, uno por jugador, con umbrales de tres y cinco

### Contexto

Los traits deben producir builds sin exigir memorización ni un catálogo inicial extenso. Se consideraron pocos traits amplios, muchos traits estrechos, dos traits por jugador o combinaciones específicas de futbolistas.

### Opciones consideradas

1. 5–6 traits amplios, uno por jugador; umbrales a tres y cinco copias.
2. 8–10 traits estrechos, uno por jugador.
3. Cuatro traits, hasta dos por jugador.
4. Sinergias de jugadores específicos.

### Decisión

El MVP tendrá 5–6 traits amplios. Cada jugador posee un trait y las sinergias iniciales se activan al reunir tres y cinco copias.

### Motivo

Es legible en móvil, permite reconocer una build y limita el contenido/balance necesario para probar el sistema.

### Trade-offs

Por sí solo, contar traits puede convertirse en falsa profundidad si las sinergias son mecánicamente equivalentes. Falta definir condiciones y efectos que hagan una build distinta de otra.

### Qué invalidaría esta decisión

Que los traits nunca cambien una elección frente a OVR, posición y química; o que una combinación de tres/cinco sea tan dominante que borre variedad.

## DEC-018 — Las sinergias de traits se activan por conteo simple

### Contexto

Tras definir traits amplios y umbrales, había que decidir si el umbral requería solo cantidad, un patrón posicional, un contexto compartido o efectos sobre otros sistemas.

### Opciones consideradas

1. Solo contar traits.
2. Trait más patrón posicional.
3. Trait más contexto futbolístico compartido.
4. Traits que alteran scouting, rolls o recursos.

### Decisión

En MVP, una sinergia de trait se activa únicamente al alcanzar su conteo de tres o cinco copias. No requiere posiciones específicas, contextos compartidos ni altera otros recursos.

### Motivo

Mantiene la regla legible en móvil y separa con claridad la función de traits de las posiciones, química y scouting.

### Trade-offs

Es la variante con mayor riesgo de falsa profundidad: dos traits con el mismo umbral y bonus pueden ser mecánicamente intercambiables. Se acepta ese riesgo para aislar y validar el valor del conteo antes de sumar condiciones.

### Qué invalidaría esta decisión

Que los jugadores persigan cualquier contador disponible sin distinguir builds, que los traits no cambien picks o que las pruebas muestren una variedad de squads insuficiente.

## DEC-019 — Química por posición, nacionalidad, club y era

### Contexto

Los traits se simplificaron a conteo simple. Se necesitaba que química aportara las restricciones y conexiones que hagan costoso perseguir una sinergia sin considerar la squad completa.

### Opciones consideradas

1. Nacionalidad solamente.
2. Club solamente.
3. Nacionalidad y club.
4. Nacionalidad, club, era y posición.

### Decisión

La química se forma por cuatro fuentes: **posición, nacionalidad, club y era**. Estar en la posición propia aporta una química mínima; las otras tres fuentes aportan conexiones adicionales.

### Motivo

Permite que un jugador evalúe OVR, trait, posición y conexiones históricas/sociales de una carta. Un tercer Finisher fuera de posición puede completar una sinergia, pero sacrifica química y rendimiento posicional.

### Trade-offs

Posición ahora incide tanto en la base de score como en química. Esto puede ser un doble castigo buscado contra elecciones fuera de rol, pero su severidad, las posiciones secundarias y la forma de sumar las cuatro fuentes permanecen abiertas.

### Qué invalidaría esta decisión

Que cuatro fuentes hagan imposible leer la química en móvil, que una fuente domine, o que una carta fuera de posición quede tan castigada que deje de ser una decisión real.

## DEC-020 — La posición corrige solo OVR y no contribuye a química

### Contexto

DEC-019 había incluido posición tanto en la corrección de OVR como en química. Al evaluar el ejemplo, se identificó que una carta fuera de posición sufriría un doble castigo no buscado.

### Opciones consideradas

1. Doble castigo estricto para cualquier posición no primaria.
2. Posiciones primaria, secundaria e incompatible con química escalonada.
3. Posición corrige solo la base de OVR; química independiente de posición.
4. Posición afecta solo química y no OVR.

### Decisión

La posición afecta exclusivamente la base de OVR. No aporta ni quita química. La química se limita a nacionalidad, club y era.

### Motivo

Evita penalizar dos veces una decisión fuera de rol y conserva un trade-off inteligible: tomar un jugador por OVR/trait puede costar rendimiento posicional, pero no invalida su valor por dos reglas simultáneas.

### Trade-offs

La química tiene una fuente menos de profundidad y las posiciones secundarias pierden prioridad como mecanismo de química. Si el castigo de OVR fuera insuficiente, se revisará su severidad antes de reintroducir otra capa.

### Qué invalidaría esta decisión

Que las posiciones fuera de rol resulten demasiado fáciles de explotar, que química sea demasiado simple para generar decisiones o que pruebas muestren que el trade-off de OVR no se percibe.

## DEC-021 — Una conexión máxima por fuente y jugador

### Contexto

La química proviene de nacionalidad, club y era. Faltaba definir si cada fuente suma una vez, por cada compañero coincidente, por umbrales globales o solo por el vínculo principal.

### Opciones consideradas

1. Un punto por fuente compartida y jugador.
2. Un punto por cada compañero coincidente.
3. Umbrales globales por fuente.
4. Solo la mejor conexión de cada jugador.

### Decisión

Cada jugador puede sumar hasta tres conexiones de química: una por nacionalidad, una por club y una por era. Cada conexión exige compartir esa fuente con al menos otro compañero. No se duplica por múltiples coincidencias.

### Motivo

La regla es fácil de inspeccionar en una carta y evita que un gran stack de un mismo contexto supere desproporcionadamente al resto de la squad.

### Trade-offs

Pierde parte de la profundidad de contar todos los pares posibles y requiere una escala global que transforme las conexiones totales en un multiplicador sin crear saltos confusos.

### Qué invalidaría esta decisión

Que un solo vínculo por fuente vuelva las decisiones demasiado planas, que los jugadores no perciban la diferencia entre una y tres conexiones o que la escala total favorezca un contexto de forma dominante.

## DEC-022 — La química solo bonifica y no penaliza

### Contexto

Con posición limitada a corregir OVR, faltaba decidir si una squad con pocas conexiones de nacionalidad, club y era debía sufrir un multiplicador negativo o simplemente renunciar a un bonus.

### Opciones consideradas

1. Química solo positiva desde una base de ×1,00.
2. Química positiva y negativa alrededor de ×1,00.
3. Penalización solo bajo un mínimo.
4. Tiers de química sin multiplicador continuo.

### Decisión

La química parte de ×1,00 y solo puede aumentar. Una squad desconectada conserva su score base; una conectada recibe un multiplicador positivo hasta un tope.

### Motivo

La falta de química ya representa un costo de oportunidad. Evitar otra penalización permite que un jugador de OVR alto pero desconectado siga siendo una elección real.

### Trade-offs

La escala positiva debe ser suficiente para que química importe, pero no tan alta que una conexión supere sistemáticamente OVR, posición o sinergias.

### Qué invalidaría esta decisión

Que los jugadores ignoren química porque su bonus es irrelevante, o que maximizar conexiones se convierta en la única estrategia correcta.

## DEC-023 — Química lineal y visible con tope inicial de +5%

### Contexto

Cada squad puede acumular hasta 33 conexiones de química. Había que convertir ese total en un multiplicador positivo comprensible.

### Opciones consideradas

1. Escala lineal y con tope.
2. Tiers de conexiones.
3. Rendimientos decrecientes.
4. Escala oculta.

### Decisión

La química usa una escala lineal, visible y con un tope inicial de +5%. La cifra es una hipótesis de balance que requiere validación, no una fórmula final.

### Motivo

Permite anticipar el efecto de cada conexión, evita sumar otro sistema de umbrales y mantiene el máximo de química moderado frente a OVR y sinergias.

### Trade-offs

Un aumento lineal puede hacer que cada conexión se sienta poco dramática; si el +5% es insuficiente o excesivo, se ajustará la escala antes de añadir reglas nuevas.

### Qué invalidaría esta decisión

Que química no cambie picks relevantes, que el tope determine siempre la mejor squad o que los jugadores no puedan estimar su efecto.

## DEC-024 — Cada trait puede tener bonos propios, visibles y balanceados por evidencia

### Contexto

Había que decidir si todos los traits comparten los mismos bonos de sinergia o si cada uno tiene valores propios. El diseño busca la legibilidad de umbrales de juegos de auto-battler, sin copiar su identidad ni sistemas.

### Opciones consideradas

1. Bonos acumulativos iguales para todos los traits.
2. Bonus de cinco que reemplaza al de tres.
3. Una sinergia activa por squad.
4. Bonos específicos por trait.

### Decisión

Cada trait puede tener bonos propios en sus umbrales de tres y cinco. Sus puntajes, requisito alcanzado y efecto deben verse claramente durante el draft y en el desglose final. El balance se validará con datos y pruebas, no se asume resuelto.

### Motivo

Permite que las builds tengan identidad mecánica y no solo nombres distintos, manteniendo la condición de activación simple por conteo.

### Trade-offs

Introduce una superficie de balance mayor y puede volver un trait objetivamente dominante. La claridad de presentación se vuelve requisito del sistema, especialmente en móvil.

### Qué invalidaría esta decisión

Que un trait concentre picks, score alto o victorias de Daily Seed de forma dominante; o que los jugadores no puedan explicar el valor de cada umbral antes de elegir.

## DEC-025 — El umbral de cinco reemplaza el bonus de tres

### Contexto

Los traits tienen umbrales de tres y cinco, con bonos propios. Restaba decidir si el segundo umbral acumula, reemplaza, varía por trait o elimina el hito intermedio.

### Opciones consideradas

1. Bonus acumulativos de tres y cinco.
2. El bonus de cinco reemplaza el de tres.
3. Cada trait decide si acumula o reemplaza.
4. Bonus únicamente al llegar a cinco.

### Decisión

Al llegar a cinco copias de un trait, su bonus reemplaza el bonus que estaba activo a tres por una versión superior.

### Motivo

Mantiene una progresión uniforme, limita saltos acumulativos y permite balancear valores propios por trait sin introducir excepciones de comportamiento.

### Trade-offs

La mejora de cinco debe sentirse suficientemente grande como para justificar perseguirla, aunque no se sume al bonus previo. Requiere que la interfaz muestre claramente el bonus actual y el siguiente.

### Qué invalidaría esta decisión

Que llegar a cinco no motive picks, que el reemplazo resulte contraintuitivo o que la diferencia entre tres y cinco sea sistemáticamente dominante.

## DEC-026 — Rasgos y texto de juego en español

### Contexto

El producto se dirige a público hispanohablante y los rasgos deben poder leerse rápidamente en una pantalla móvil. El catálogo inicial debía cerrar seis estilos sin apoyarse en nombres ingleses de interfaz.

### Opciones consideradas

1. Seis estilos: Finisher, Playmaker, Technician, Speedster, Physical y Defensive Wall.
2. Cinco estilos, eliminando Speedster.
3. Seis estilos, reemplazando Speedster por Leader.
4. Rasgos históricos específicos de jugadores.

### Decisión

El catálogo inicial es **Definidor, Creador, Técnico, Velocista, Físico y Muro defensivo**. Todo texto visible al jugador estará en español; los términos ingleses anteriores se conservan solo como aliases transitorios en documentación.

### Motivo

El catálogo cubre finalización, creación, técnica, velocidad, potencia y defensa con términos breves y reconocibles. Evita introducir Liderazgo, que no tiene aún una función clara en un juego sin simulación de partidos.

### Trade-offs

Algunos nombres requieren validación de comprensión y podrían cambiar por alternativas más naturales sin alterar su función. La documentación heredada aún contiene aliases ingleses que se normalizarán progresivamente.

### Qué invalidaría esta decisión

Que participantes no comprendan un rasgo sin explicación, que dos nombres se interpreten como lo mismo o que el catálogo no produzca estilos de squad distinguibles.

## DEC-027 — “Rematador” y techos de rasgo compensados por accesibilidad

### Contexto

El catálogo inicial debía usar español y los rasgos podían tener bonos propios. Había que decidir si sus techos de puntaje son iguales o si pueden variar con una compensación de frecuencia y dificultad.

### Opciones consideradas

1. Mismo techo a cinco; variación solo en tres copias.
2. Techos distintos compensados por menor frecuencia o mayor costo esperado de completarlos.
3. Techos distintos sin compensación.
4. Valores idénticos para todos los rasgos.

### Decisión

El rasgo se llama **Rematador**, no Definidor. Los rasgos pueden tener techos de puntaje distintos, siempre que su poder esperado se compense por frecuencia de aparición y costo esperado de completar los umbrales.

### Motivo

Permite identidades de build más marcadas sin aceptar que un rasgo con mayor puntaje sea automáticamente mejor cuando aparece con la misma facilidad.

### Trade-offs

El balance depende del dataset y de las probabilidades reales de draft. Antes de disponer del pool no se conocen los valores definitivos; se define un presupuesto de balance y luego se valida mediante simulación, pruebas y distribución observada de picks/scores.

### Qué invalidaría esta decisión

Que un rasgo de mayor techo siga dominando aun descontando su escasez, que la escasez convierta una build en lotería o que el jugador no pueda entender por qué un rasgo vale más.

## DEC-028 — Rutas viables a rasgos de techo alto y “Draft diario”

### Contexto

Los rasgos pueden tener techos distintos compensados por accesibilidad. Había que decidir si su aparición dependía de rareza global pura o si cada partida debía garantizar oportunidades estratégicas.

### Opciones consideradas

1. Rareza global pura sin garantía por partida.
2. Cada partida garantiza al menos una ruta viable a un rasgo de techo alto.
3. Solo el modo competitivo garantiza rutas equivalentes.
4. Todos los rasgos aparecen igual de seguido con techos distintos.

### Decisión

Cada partida garantiza al menos una ruta viable hacia un rasgo de techo alto, sin obligar a elegirla. El **Draft diario** es el nombre visible del modo competitivo y aplica esta regla como prioridad.

### Motivo

La suerte sigue creando oportunidades, pero no puede negar por completo la posibilidad de una decisión de build potente. En el Draft diario, todos evalúan las mismas rutas y se compara cómo responden.

### Trade-offs

La generación de opciones tendrá que preservar rutas alternativas sin revelar una respuesta óptima. “Viable” necesita definición operativa al diseñar los rolls: no puede significar simplemente que una carta rara apareció una vez.

### Qué invalidaría esta decisión

Que la ruta alta resulte siempre dominante, que las demás opciones sean falsas elecciones o que garantizarla haga los drafts demasiado parecidos.

## DEC-029 — Progreso visible y oportunidad futura revelable mediante scouting

### Contexto

La partida garantiza una ruta viable a un rasgo de techo alto. Debía definirse si esa ruta se muestra completa, solo por scouting, parcialmente o permanece oculta.

### Opciones consideradas

1. Ruta siempre visible.
2. Ruta visible solo mediante scouting.
3. Progreso de rasgos visible; scouting revela oportunidad futura de build.
4. Ruta totalmente oculta.

### Decisión

El progreso actual de rasgos se ve siempre. El scouting puede revelar una oportunidad futura de build. No se expone una ruta completa de forma automática.

### Motivo

Permite que el jugador entienda su estado actual y use el scouting para anticipar, sin transformar el draft en resolver una secuencia ya conocida.

### Trade-offs

La información de scouting debe ser accionable pero no una respuesta completa. Falta definir qué detalle exacto revela una oportunidad de build.

### Qué invalidaría esta decisión

Que el scouting no cambie picks, que el progreso visible baste para resolver toda la partida o que la oportunidad revelada sea demasiado vaga para ser útil.

## DEC-030 — Tres opciones normales y rolls especiales ampliados

### Contexto

Cada elección necesita opciones suficientes para producir trade-offs sin sobrecargar móvil. Se consideraron dos, tres, cuatro o una cantidad variable de opciones.

### Opciones consideradas

1. Dos opciones fijas.
2. Tres opciones fijas.
3. Cuatro opciones fijas.
4. Tres opciones normalmente y más opciones en rolls especiales.

### Decisión

Los rolls normales ofrecen tres opciones. Algunos rolls especiales ofrecen más opciones. La cantidad adicional, frecuencia y disparador quedan abiertos.

### Motivo

Tres cartas sostienen el conflicto básico entre calidad, conexión y necesidad. Los rolls especiales pueden crear momentos de mayor agencia o tensión sin inflar todas las decisiones.

### Trade-offs

Un roll ampliado que aparece por suerte y siempre mejora la elección puede convertirse en RNG de premio. Debe tener un disparador y un costo u oportunidad que el jugador entienda.

### Qué invalidaría esta decisión

Que las opciones extra solo produzcan una carta obviamente mejor, que el ritmo se vuelva lento en móvil o que la frecuencia de rolls especiales determine el resultado de una partida.

## DEC-031 — Rolls especiales por hitos fijos; recurso económico posterior

### Contexto

Los rolls especiales amplían las tres opciones normales. Había que decidir si ocurren por hito, azar, desempeño de build o gasto de recurso. También se quiere dejar una vía futura para una economía que agregue decisiones sin afectar competencia justa.

### Opciones consideradas

1. Hitos fijos de la partida.
2. Probabilidad aleatoria por roll.
3. Hito de rasgo o química.
4. Gasto de un recurso.

### Decisión

Por defecto, los rolls especiales ocurren en hitos fijos comunes a toda partida. Se documenta como hipótesis LATER un recurso económico que pueda habilitar un roll ampliado. No integra el MVP ni puede otorgar ventaja comprable en el Draft diario.

### Motivo

Los hitos fijos preservan oportunidades equivalentes, especialmente en competencia. El recurso futuro puede convertirse en una decisión económica significativa solo después de validar el core loop.

### Trade-offs

Los hitos deben elegirse sin volver el draft predecible. La economía posterior deberá resolver obtención, acumulación y separación estricta entre partidas libres y Draft diario; todavía no se diseña.

### Qué invalidaría esta decisión

Que los hitos fijos vuelvan las partidas repetitivas, que el recurso futuro se convierta en pay-to-win o que los rolls especiales no cambien ninguna decisión relevante.

## DEC-032 — Los rolls especiales muestran cinco opciones

### Contexto

Los rolls especiales amplían las tres opciones normales. Se evaluó si debían mostrar cuatro, cinco, una escalada o una cantidad aleatoria.

### Opciones consideradas

1. Cuatro opciones.
2. Cinco opciones.
3. Cuatro en el primer hito y cinco en el segundo.
4. Cantidad aleatoria.

### Decisión

Cada roll especial muestra cinco opciones.

### Motivo

Hace que el hito se sienta distinto de una elección normal y abre más rutas de OVR, química y rasgos en un momento de alta agencia.

### Trade-offs

Cinco opciones elevan la carga de comparación móvil. La interfaz deberá comunicar progresos y conexiones sin exigir leer cinco fichas extensas; la frecuencia se limitará antes de MVP.

### Qué invalidaría esta decisión

Que los jugadores se demoren o abandonen en estos rolls, que cinco cartas generen siempre una opción dominante o que los rolls especiales se vuelvan más importantes que las decisiones normales.

## DEC-033 — Dos rolls especiales por partida

### Contexto

Los rolls especiales muestran cinco opciones y ocurren en hitos fijos. Restaba decidir cuántos caben dentro de una partida de 11 picks.

### Opciones consideradas

1. Un roll especial.
2. Dos rolls especiales.
3. Tres rolls especiales.
4. Ninguno en la primera partida.

### Decisión

Cada partida tendrá dos rolls especiales de cinco opciones. Los picks exactos que los disparan se definirán después.

### Motivo

Ofrecen una oportunidad de orientar y otra de ajustar la squad, sin hacer que cinco opciones sea el estado habitual.

### Trade-offs

La ubicación de los hitos debe evitar que una sola fase del draft concentre todo el poder. Dos momentos de alta comparación exigen una presentación móvil especialmente clara.

### Qué invalidaría esta decisión

Que la duración aumente demasiado, que los rolls normales se sientan irrelevantes o que los dos hitos favorezcan siempre el mismo patrón de build.

## DEC-034 — Una formación 4-3-3 en MVP; futuras visibles y bloqueadas

### Contexto

La estructura de la squad condiciona posiciones, química, umbrales y duración. Se evaluó usar una formación única de 11 plazas, elegir una formación, reducir la squad o usar otra formación fija.

### Opciones consideradas

1. Formación 4-3-3 fija con 11 picks.
2. Otra formación fija.
3. Elección de formación antes de la partida.
4. Squad reducida.

### Decisión

El MVP usa solamente una formación 4-3-3 con 11 plazas. Formaciones y configuraciones posicionales futuras pueden estar visibles como bloqueadas “próximamente”, sin funcionalidad ni fecha.

### Motivo

Fija un terreno común para validar posiciones, química y draft antes de añadir otra variable estratégica. Mantiene visible la dirección de expansión sin ampliar el alcance.

### Trade-offs

La formación única limita variedad inicial y las opciones bloqueadas pueden distraer. No se diseñan ni implementan reglas de formaciones futuras todavía.

### Qué invalidaría esta decisión

Que 4-3-3 no genere suficientes decisiones posicionales, que la formación única reduzca de forma notable el deseo de repetir o que los bloqueos desvíen del primer inicio de partida.

## DEC-035 — Carta elegida y plaza elegida por el jugador

### Contexto

Con una formación fija, había que decidir si las plazas se resuelven en orden, se eligen después de la carta, se filtran antes del roll o se asignan automáticamente.

### Opciones consideradas

1. Plazas en orden fijo.
2. Elegir carta y luego plaza libre.
3. Elegir plaza antes del roll y filtrar opciones.
4. Asignación automática a la mejor plaza.

### Decisión

En cada pick, el jugador elige una carta y después la coloca en cualquier plaza libre de la formación 4-3-3.

### Motivo

Conserva libertad de draft y convierte posición en una decisión real: una carta puede servir ahora, pero cerrar o degradar una plaza que será necesaria después.

### Trade-offs

Requiere una interfaz clara para comparar el impacto de cada plaza en móvil. Queda abierto si la ubicación se bloquea o puede reorganizarse más adelante.

### Qué invalidaría esta decisión

Que el jugador siempre coloque automáticamente en la única plaza sensata, que la comparación de plazas resulte lenta o que los jugadores sientan que pierden por un error temprano no recuperable.

## DEC-036 — Reorganización libre durante la partida

### Contexto

Luego de elegir una carta y ubicarla, todavía pueden aparecer opciones que cambien cuál es la mejor distribución del plantel. Bloquear una colocación temprana castigaría decisiones tomadas con información incompleta.

### Opciones consideradas

1. Bloquear la plaza elegida al seleccionar la carta.
2. Permitir reorganizar libremente durante toda la partida.
3. Permitir reorganizar solo al completar el plantel.
4. Permitir cambios limitados mediante un recurso.

### Decisión

El jugador puede reorganizar libremente sus cartas entre las plazas de la formación durante toda la partida. No tiene coste ni consume recursos en el MVP.

### Motivo

La habilidad debe consistir en interpretar el plantel disponible, no en quedar atrapado por una decisión temprana con información incompleta. La posición conserva relevancia porque modifica el OVR base final de cada carta.

### Trade-offs

Disminuye la tensión inmediata de asignar una plaza. La interfaz debe mostrar con claridad el impacto de cada movimiento sobre OVR y score para que reorganizar sea una decisión comprensible, especialmente en móvil.

### Qué invalidaría esta decisión

Que la reorganización convierta las posiciones en una gestión trivial de último segundo o agregue fricción/confusión relevante en pantallas móviles.

## DEC-037 — Posición primaria y secundaria

### Contexto

La posición afecta exclusivamente al OVR base y las cartas pueden reorganizarse. Faltaba definir si cada jugador sería rígido, versátil por roles amplios o tendría una posición secundaria explícita.

### Opciones consideradas

1. Solo posición primaria.
2. Posición primaria y secundaria.
3. Elegibilidad por grupos amplios: defensa, medio y ataque.
4. Sin efecto posicional sobre OVR.

### Decisión

Cada jugador tendrá una posición primaria y, cuando corresponda, una posición secundaria. La primaria conserva el OVR completo; la secundaria tendrá una penalización leve y las plazas fuera de ambas una penalización mayor. Las magnitudes se definirán mediante pruebas.

### Motivo

Conserva un coste de oportunidad al cubrir una necesidad, pero permite rescatar un draft imperfecto y hallar usos inteligentes para cartas versátiles. Funciona con la reorganización libre sin volver irrelevante la posición.

### Trade-offs

Añade un dato visible por carta y obliga a explicar tres estados de encaje. Si las penalizaciones son demasiado bajas, la formación será decorativa; si son muy altas, la posición secundaria será una falsa promesa.

### Qué invalidaría esta decisión

Que los jugadores no entiendan el beneficio de una secundaria, que casi nunca cambie una elección o que una combinación pequeña de posiciones secundarias domine el Draft diario.

## DEC-038 — Penalizaciones posicionales medias

### Contexto

Tras adoptar posiciones primaria y secundaria, había que definir cuánto OVR se pierde fuera de la posición primaria.

### Opciones consideradas

1. Penalización leve: −2 OVR secundaria, −6 fuera de posición.
2. Penalización media: −4 OVR secundaria, −10 fuera de posición.
3. Penalización dura: −6 OVR secundaria, −15 fuera de posición.
4. Penalización variable según distancia entre posiciones.

### Decisión

En el punto de partida del MVP, una carta pierde 4 OVR en su posición secundaria y 10 OVR fuera de su posición primaria y secundaria.

### Motivo

La secundaria debe ser una herramienta válida de adaptación; jugar fuera de ambas debe seguir siendo una solución de emergencia con una consecuencia fácilmente entendible.

### Trade-offs

Es una hipótesis de balance, no una verdad futbolística. Puede volver demasiado valiosa una secundaria para cartas de OVR alto, o demasiado débil para cartas de OVR bajo.

### Qué invalidaría esta decisión

Que los datos del pool y los resultados del Draft diario muestren que los jugadores ignoran siempre la posición secundaria, la usan siempre, o que los fuera de posición siguen ganando sin una compensación estratégica clara.

## DEC-039 — Hasta dos posiciones secundarias por carta

### Contexto

Las posiciones secundarias aportan flexibilidad. Faltaba poner un límite para evitar que las cartas versátiles vacíen de sentido a las plazas de la formación.

### Opciones consideradas

1. Máximo una posición secundaria.
2. Hasta dos posiciones secundarias.
3. Sin límite fijo, según cada jugador.

### Decisión

Una carta puede tener hasta dos posiciones secundarias en el MVP.

### Motivo

Permite representar jugadores genuinamente versátiles y generar rescates interesantes de un draft, sin otorgar cobertura universal.

### Trade-offs

Añade complejidad de lectura y hace más valiosas algunas cartas. El pool deberá usar las dos secundarias con moderación para que no se conviertan en la opción dominante.

### Qué invalidaría esta decisión

Que las cartas con dos secundarias dominen por encima de su OVR, química y rasgo, o que el jugador deje de sentir presión por cubrir plazas específicas.

## DEC-040 — Formación con once plazas exactas

### Contexto

La 4-3-3 única del MVP requería definir si las posiciones se evalúan como grupos amplios, categorías intermedias o las once plazas específicas de la formación.

### Opciones consideradas

1. Once plazas exactas: POR, LD, DFC, DFC, LI, MC, MC, MC, ED, DC y EI.
2. Cuatro grupos: POR, defensa, medio y ataque.
3. Categorías intermedias: centrales/laterales, mediocentros/interiores y extremos/delantero.

### Decisión

El MVP usa las once plazas exactas de una 4-3-3: POR, LD, dos DFC, LI, tres MC, ED, DC y EI.

### Motivo

Hace significativas las posiciones primaria y secundarias. Genera decisiones sobre cobertura, laterales, centrales, extremos e interiores que no aparecen con grupos amplios.

### Trade-offs

Exige que la generación de opciones proteja contra planteles inviables por azar y que la pantalla móvil comunique once plazas sin saturarse.

### Qué invalidaría esta decisión

Que las plazas se perciban como tecnicismo, que los usuarios no las distingan o que la protección necesaria reduzca el draft a elecciones obvias.

## DEC-041 — Protección de oportunidades para posiciones pendientes

### Contexto

Con once plazas exactas, un draft totalmente libre puede impedir completar posiciones críticas por azar. La intención es proteger la oportunidad de elegir, no garantizar una carta ni impedir que sigan apareciendo cartas de posiciones ya cubiertas.

### Decisión

Mientras una necesidad posicional siga sin cubrirse, el generador debe mostrar como mínimo tres jugadores candidatos de esa posición durante la partida. Las cartas de posiciones cubiertas pueden aparecer igualmente. En la última elección, si queda sin cobertura una plaza de POR, LD o LI, las opciones deben incluir al menos un candidato adecuado para cada necesidad prioritaria pendiente.

### Motivo

La suerte presenta tensiones, pero no debe negar tres veces la posibilidad de resolver una necesidad básica. El jugador sigue decidiendo si prioriza la cobertura, OVR, química o rasgos.

### Trade-offs

La protección ocupa una porción importante de las ofertas: con nueve rolls de tres y dos especiales de cinco habrá 37 cartas mostradas. Debe diseñarse para que no convierta el draft en un guion ni deje pocas opciones libres. La definición precisa de «cubierta» sigue abierta por las plazas repetidas y las posiciones secundarias.

### Qué invalidaría esta decisión

Que el jugador perciba las ofertas protegidas como obligatorias o repetitivas, que aún existan runs inviables, o que la protección haga previsibles las mejores elecciones.

## DEC-042 — Cobertura por capacidad de llenar todas las plazas

### Contexto

La formación tiene categorías con plazas repetidas: dos DFC y tres MC. Había que determinar si bastaba una carta de la categoría, si una secundaria contaba y cuándo se detenía la protección posicional.

### Opciones consideradas

1. La categoría se cubre cuando el plantel puede llenar todas sus plazas con posición primaria o secundaria.
2. Igual, pero solo cuentan posiciones primarias.
3. La primera carta de la categoría detiene la protección.
4. Cada plaza física obtiene su propia garantía de tres candidatos.

### Decisión

Una categoría se considera cubierta cuando el plantel puede llenar todas sus plazas mediante posición primaria o secundaria. Por ejemplo, se requieren dos cartas capaces de jugar DFC y tres capaces de jugar MC.

### Motivo

Reconoce la versatilidad aprobada como una solución real al draft imperfecto, sin ocultar su coste de −4 OVR en posición secundaria.

### Trade-offs

Un jugador secundario puede detener antes la protección, aunque no sea la solución óptima de score. La interfaz debe poder explicar qué plazas están cubiertas y por qué.

### Qué invalidaría esta decisión

Que las secundarias se usen para cortar protección de forma perjudicial, que el jugador no entienda el estado de cobertura o que la regla siga generando planteles inviables.

## DEC-043 — Tres oportunidades en rolls distintos

### Contexto

La protección posicional garantiza tres candidatos para una necesidad pendiente. Había que definir si las tres cartas podían aparecer en una misma oferta o debían convertirse en oportunidades separadas de decisión.

### Opciones consideradas

1. Tres jugadores distintos en tres rolls distintos.
2. Tres jugadores en un mismo roll.
3. Tres jugadores repartidos en al menos dos rolls.

### Decisión

Cada necesidad posicional pendiente debe recibir tres jugadores distintos en tres rolls distintos, salvo que quede cubierta antes.

### Motivo

Convierte la garantía en tres oportunidades temporales reales: el jugador puede posponer una necesidad, evaluar nueva información y asumir conscientemente el riesgo de dejarla pasar.

### Trade-offs

Condiciona más la distribución de ofertas y requiere planificar con anticipación el generador. También puede volver muy visible la protección si no se mezcla bien con OVR, química, rasgos y contextos.

### Qué invalidaría esta decisión

Que los rolls se sientan repetitivos o dirigidos, que el jugador sepa demasiado pronto qué posiciones verá, o que las tres oportunidades no lleguen a tiempo para tomar decisiones informadas.

## DEC-044 — Rolls especiales en los picks 4 y 8

### Contexto

Hay dos rolls especiales de cinco opciones en una partida de once picks. Su ubicación cambia cuánta información tiene el jugador antes de orientar o corregir su plantel.

### Opciones consideradas

1. Picks 4 y 8.
2. Picks 3 y 7.
3. Picks 5 y 9.
4. Picks 4 y 9.

### Decisión

Los rolls especiales ocurren en los picks 4 y 8. Todos los demás picks muestran tres opciones, sujeto a las protecciones posicionales aprobadas.

### Motivo

El pick 4 permite consolidar una dirección tras tres decisiones iniciales. El pick 8 permite corregirla con información suficiente, pero aún deja tres picks para ejecutar las consecuencias.

### Trade-offs

Los hitos fijos son memorizables y pueden incentivar planes repetidos. Su interacción con la protección posicional debe conservar variedad y no entregar automáticamente la solución del plantel.

### Qué invalidaría esta decisión

Que los jugadores ignoren sistemáticamente los picks previos al 4 u 8, que el segundo roll especial resuelva siempre las necesidades pendientes o que el ritmo de la partida se perciba desigual.

## DEC-045 — Los rolls especiales cuentan para la protección posicional

### Contexto

Cada necesidad pendiente exige tres jugadores distintos en tres rolls distintos. Había que definir si los rolls especiales de cinco opciones podían satisfacer una de esas oportunidades.

### Opciones consideradas

1. Los rolls especiales cuentan como oportunidad protegida.
2. La protección cuenta solo en rolls normales.
3. Los especiales cuentan solo sin cobertura previa.

### Decisión

Una aparición compatible en un roll especial cuenta como una de las tres oportunidades de protección posicional, siempre que sea un jugador distinto y ocurra en un roll distinto.

### Motivo

Conserva espacio para variedad en los rolls normales y da valor real a los dos momentos de comparación ampliada, sin modificar la garantía para el jugador.

### Trade-offs

Un roll especial puede satisfacer varias protecciones a la vez y necesitará una presentación clara de qué oportunidades siguen pendientes. No debe convertirse en una respuesta automática a todos los huecos.

### Qué invalidaría esta decisión

Que los rolls especiales resuelvan sistemáticamente todas las necesidades, que las protecciones dejen de ser entendibles o que los rolls normales pierdan relevancia.

## DEC-046 — Un reroll por partida y recurso económico futuro

### Contexto

El draft ya incluye protección posicional, dos rolls especiales y scouting. Se evaluó si el jugador necesitaba una herramienta adicional para responder a una oferta poco útil.

### Opciones consideradas

1. Ningún reroll en MVP.
2. Un reroll por partida.
3. Dos rerolls por partida.
4. Reroll solo en rolls normales.

### Decisión

El MVP otorga un reroll por partida. En una versión futura, la economía podrá incorporar una forma de obtener o gestionar este recurso, todavía sin diseño ni implementación. Esa economía no podrá comprar ventaja en el intento competitivo del Draft diario.

### Motivo

El reroll ofrece una única intervención de alto valor ante una situación mala sin eliminar el riesgo de decidir. También abre una vía económica futura, pero esa posibilidad no justifica ampliar el MVP ni comprometer la competencia justa.

### Trade-offs

Agrega otra decisión de timing y puede superponerse con scouting. La economía futura debe resolver adquisición, límites y equidad antes de existir; no se asume que sea una compra directa.

### Qué invalidaría esta decisión

Que el reroll se use siempre en el mismo pick, que vuelva irrelevantes las protecciones o el scouting, o que una futura economía implique pay-to-win en el Draft diario.

## DEC-047 — Reroll de oferta completa

### Contexto

Tras aprobar un único reroll, había que decidir si sustituía toda la oferta, una carta concreta o todas excepto una elegida.

### Opciones consideradas

1. Reemplazar toda la oferta actual.
2. Reemplazar una carta elegida.
3. Conservar una carta y reemplazar las demás.

### Decisión

El reroll reemplaza una única vez durante la partida toda la oferta actual: tres cartas en un roll normal o cinco en un roll especial.

### Motivo

Es fácil de entender y mantiene una decisión de riesgo nítida: aceptar una oportunidad presente o gastar la única herramienta para buscar otra situación completa.

### Trade-offs

Puede ser muy potente en un roll especial y puede generar frustración si reemplaza una carta necesaria junto a dos malas. La interacción con las oportunidades protegidas debe quedar explícita.

### Qué invalidaría esta decisión

Que el reroll de oferta completa sea claramente superior a cualquier otra decisión de timing, que los jugadores no sepan cuándo gastarlo o que los rolls especiales creen oscilaciones de score excesivas.

## DEC-048 — El reroll no repone oportunidades protegidas

### Contexto

Una oferta puede contener una carta que satisface una oportunidad posicional protegida. Al usar reroll, el jugador la descarta voluntariamente. Faltaba decidir si esa aparición deja de contar para la garantía.

### Opciones consideradas

1. La carta vista cuenta aunque sea descartada con reroll.
2. La carta descartada no cuenta y la protección se repone.
3. Bloquear el reroll cuando haya una carta protegida.

### Decisión

Toda carta protegida que se muestra cuenta como oportunidad posicional, incluso si el jugador usa reroll y la descarta. Las cartas del resultado del reroll también cuentan si cumplen la regla.

### Motivo

El jugador tuvo una oportunidad real de elegir la carta; decidir buscar algo mejor debe tener riesgo. Evita que el reroll se convierta en un mecanismo para exigir protección adicional.

### Trade-offs

Puede sentirse exigente si el candidato protegido es débil frente a las demás variables. La UI debe dejar visible cuántas oportunidades posicionales ya se ofrecieron y cuáles siguen pendientes.

### Qué invalidaría esta decisión

Que los jugadores no entiendan por qué se agotó una garantía, que el reroll se vuelva una trampa de novatos o que se disparen runs con cobertura insuficiente pese a la protección.

## DEC-049 — Rasgos con bono fijo visible de puntaje en MVP

### Contexto

Cada rasgo activa un umbral a tres o cinco copias. Sin partidos ni simulación en el MVP, había que decidir si esos umbrales modificaban solo el resultado final o también química, draft y recursos.

### Opciones consideradas

1. Bonos fijos y visibles al puntaje de equipo.
2. Bonos de puntaje más modificaciones de química.
3. Modificaciones de rolls, reroll o scouting.
4. Efectos reales recién con partidos futuros.

### Decisión

En el MVP, los umbrales de rasgos solo otorgan bonos fijos y visibles al puntaje de equipo. Una interacción de rasgos con economía podrá evaluarse en el futuro, fuera del MVP y sin ventaja comprable para el Draft diario.

### Motivo

El jugador puede explicar de dónde sale el resultado y evaluar el trade-off de perseguir un umbral. Evita sumar reglas sin una consecuencia jugable validada.

### Trade-offs

Los rasgos son menos expresivos que en un juego con partidos y corren el riesgo de sentirse como una tabla de puntos. Los bonos únicos, su disponibilidad y la forma de presentarlos deben compensarlo antes de agregar efectos sistémicos.

### Qué invalidaría esta decisión

Que los jugadores ignoren los rasgos al elegir, que solo persigan uno de ellos o que el puntaje fijo no produzca builds reconocibles ni deseo de repetir.

## DEC-050 — Carta como versión histórica concreta

### Contexto

Club y era son fuentes de química. Para que sean legibles, había que definir si una carta representa a un jugador genérico, una versión histórica específica o varias versiones del mismo jugador.

### Opciones consideradas

1. Una versión histórica concreta por jugador en el MVP.
2. Un jugador genérico con club icónico asignado.
3. Varias versiones del mismo jugador desde el MVP.

### Decisión

Cada carta del MVP representa una versión histórica concreta de un jugador, con club y era inequívocos. El MVP contiene una sola versión por jugador.

### Motivo

Hace que química de club y era sea explicable, permite combinaciones históricas reconocibles y limita el contenido y balance iniciales.

### Trade-offs

Elegir una versión por jugador implica una curaduría discutible: un mismo ídolo puede pertenecer a varias eras o clubes memorables. Las versiones alternativas quedan fuera hasta validar el loop.

### Qué invalidaría esta decisión

Que la única versión por jugador reduzca demasiado la variedad, que los usuarios rechacen la curaduría o que múltiples versiones sean necesarias para que club y era generen decisiones suficientes.

## DEC-051 — Era representada por década

### Contexto

Cada carta tiene una era como fuente de química. Faltaba elegir entre décadas, bloques más cortos o generaciones narrativas.

### Opciones consideradas

1. Décadas: 1980, 1990, 2000, 2010 y 2020.
2. Bloques de cinco años.
3. Generaciones narrativas.

### Decisión

La era de una carta se representa por su década: 1980, 1990, 2000, 2010 o 2020 en el pool inicial.

### Motivo

Es una regla reconocible de un vistazo, admite conexiones suficientes y evita exigir conocimiento histórico preciso.

### Trade-offs

Agrupa periodos con diferencias futbolísticas reales y puede crear conexiones muy amplias. No pretende ser una simulación histórica exacta.

### Qué invalidaría esta decisión

Que la conexión por década sea tan frecuente que deje de importar, que no genere suficiente identidad de build o que los jugadores necesiten una granularidad mayor para encontrar decisiones interesantes.

## DEC-052 — OVR visible en escala propia de 1 a 100

### Contexto

El OVR debe permitir comparaciones rápidas como 96 contra 91, sin adoptar ratings, fórmulas o datos de otro producto.

### Opciones consideradas

1. Escala propia de 1 a 100.
2. Escala de 50 a 99 para el pool seleccionable.
3. Rangos sin número exacto.

### Decisión

El OVR se muestra en una escala propia de 1 a 100. Sus valores y criterio de asignación pertenecen al juego; no se copian ratings ni fórmulas de productos ajenos.

### Motivo

La escala es familiar, hace comprensibles los trade-offs numéricos y permite que posición, química y rasgos se expliquen sobre una base común.

### Trade-offs

La escala puede evocar convenciones conocidas y exige una curaduría consistente del pool. Un número preciso puede parecer una promesa objetiva aunque siempre sea una decisión de diseño.

### Qué invalidaría esta decisión

Que los jugadores no distingan valores cercanos, que el criterio de OVR opaque los demás sistemas o que el pool no pueda sostener una escala coherente.

## DEC-053 — Puntaje basado en promedio posicional

### Contexto

La fórmula aprobada combina OVR corregido por posición, química y bonos fijos de rasgos. Faltaba definir si la base agregada del equipo era promedio, suma o un promedio ponderado por puesto.

### Opciones consideradas

1. Promedio de los once OVR corregidos por posición, luego química y rasgos.
2. Suma de los once OVR corregidos por posición, luego química y rasgos.
3. Promedio ponderado por posición.

### Decisión

El puntaje de equipo parte del promedio de los once OVR ya corregidos por posición. Sobre ese promedio se aplica el multiplicador de química y luego se añaden los bonos fijos de rasgos.

### Motivo

Mantiene el resultado cerca de la escala de OVR, facilita comparaciones y permite explicar por qué una squad obtuvo, por ejemplo, 94 puntos.

### Trade-offs

El promedio oculta la magnitud total de once jugadores y hace que cada plaza tenga el mismo peso. Esa simplicidad es intencional mientras no existan partidos ni roles tácticos.

### Qué invalidaría esta decisión

Que el promedio haga imperceptibles los beneficios de completar posiciones, química o rasgos, o que los jugadores no puedan relacionar sus elecciones con el puntaje final.

## DEC-054 — Puntaje mostrado con un decimal

### Contexto

El puntaje combina promedio, multiplicador de química y bonos de rasgos. Había que elegir entre ocultar precisión con un entero, mostrar un decimal o redondear cada paso.

### Opciones consideradas

1. Cálculo decimal interno y resultado entero redondeado.
2. Resultado visible con un decimal.
3. Redondeo en cada paso de la fórmula.

### Decisión

El puntaje de equipo se muestra con un decimal. Los componentes del desglose conservan la precisión necesaria para explicar el resultado.

### Motivo

Hace visibles pequeñas mejoras de química y posición sin saturar la lectura móvil ni introducir errores por redondeo intermedio.

### Trade-offs

Un decimal puede dar una sensación de precisión mayor que la del modelo de diseño. La interfaz debe priorizar el porqué del cambio por encima de cifras excesivas.

### Qué invalidaría esta decisión

Que el decimal no cambie decisiones ni comprensión, que complique la pantalla o que los jugadores confundan variaciones mínimas con diferencias estratégicas importantes.

## DEC-055 — Química proporcional a las 33 conexiones máximas

### Contexto

Cada una de las once cartas puede aportar hasta tres conexiones binarias: nacionalidad, club y era. El multiplicador de química es lineal con un tope de +5%; faltaba traducir las 33 conexiones posibles a ese tope.

### Opciones consideradas

1. Proporción exacta: conexiones / 33 × 5%.
2. +0,2% por conexión con tope al llegar a 25.
3. Bonos por tramos.

### Decisión

El bonus de química es `conexiones / 33 × 5%`, hasta un máximo de +5%. Se presenta como contador de conexiones y porcentaje, con precisión suficiente para explicar el puntaje.

### Motivo

Todas las conexiones posibles tienen valor y la regla conserva la linealidad ya aprobada. Un jugador puede anticipar el efecto de sumar una relación sin memorizar umbrales.

### Trade-offs

El porcentaje resultante contiene decimales poco redondos. La presentación debe simplificar la lectura sin alterar el cálculo ni ocultar el denominador de 33.

### Qué invalidaría esta decisión

Que los decimales no se entiendan, que el bonus sea demasiado pequeño para cambiar elecciones o que alcanzar muchas conexiones termine siendo la estrategia dominante.

## DEC-056 — Scouting del roll inmediatamente siguiente

### Contexto

Hay un único scouting por partida que revela un informe futuro de potencia aleatoria. Había que definir su horizonte para que aporte anticipación sin resolver el draft.

### Opciones consideradas

1. Informar sobre el roll inmediatamente siguiente.
2. Informar sobre los dos rolls siguientes.
3. Permitir elegir cualquier pick futuro.
4. Activarlo automáticamente antes del pick 4.

### Decisión

Mientras observa una oferta y antes de elegir, el jugador puede gastar su único scouting para recibir un informe sobre el roll inmediatamente siguiente. No puede usarlo si no existe un roll futuro.

### Motivo

Genera una tensión legible: resolver una necesidad actual o conservar una plaza/plan porque el próximo roll podría ofrecer una oportunidad mejor.

### Trade-offs

El valor del scouting depende mucho del momento de uso y puede competir con el reroll como herramienta de rescate. La información del informe debe ser suficientemente concreta para afectar una decisión presente.

### Qué invalidaría esta decisión

Que el scouting se use siempre en el mismo pick, que el informe no cambie ninguna elección o que revele tanto que convierta el siguiente pick en una respuesta automática.

## DEC-057 — El reroll invalida el informe de scouting

### Contexto

Un scouting anticipa la oferta original del roll siguiente. El jugador puede usar reroll al verla. Faltaba decidir si el informe continuaba describiendo la oferta reemplazada.

### Opciones consideradas

1. El informe describe solo la oferta original; el reroll es desconocido.
2. El informe también describe el resultado del reroll.
3. No permitir reroll sobre una oferta anticipada.

### Decisión

El informe de scouting describe exclusivamente la oferta original del roll anticipado. Si el jugador la rerollean, la nueva oferta es desconocida y el informe queda invalidado.

### Motivo

Conserva tensión al combinar los dos recursos: el jugador puede abandonar una información útil para buscar una oferta mejor, pero no obtiene dos capas de control garantizado.

### Trade-offs

La combinación puede resultar exigente para principiantes. Debe comunicarse antes de gastar el reroll que el informe no aplica al resultado nuevo.

### Qué invalidaría esta decisión

Que casi nadie combine recursos por miedo a desperdiciarlos, que la regla no se entienda o que el reroll siga siendo la opción automática tras un scouting.

## DEC-058 — Cuatro niveles de potencia para scouting

### Contexto

El scouting tiene una potencia aleatoria, una revelación exacta con probabilidad inicial de 5% y una comunicación por color. Había que decidir cuántos escalones de información usar.

### Opciones consideradas

1. Tres niveles.
2. Cuatro niveles.
3. Dos niveles.

### Decisión

El scouting del MVP tiene cuatro niveles de potencia, cada uno comunicado con una identidad cromática propia. La revelación de carta exacta ocupa el nivel máximo con probabilidad inicial de 5%.

### Motivo

Permite una progresión perceptible de información y sorpresa sin convertir el sistema en una escalera extensa de rarezas.

### Trade-offs

Cuatro colores y mensajes exigen diferenciación accesible más allá del color, especialmente en móvil. El contenido exacto y las probabilidades de los tres niveles inferiores todavía deben justificar que se perciban distintos.

### Qué invalidaría esta decisión

Que los jugadores no distingan los niveles, que uno sea irrelevante, que el nivel alto se sienta injusto o que la lectura consuma más atención que la decisión de draft.

## DEC-059 — Información escalonada de scouting

### Contexto

Con cuatro niveles de scouting, cada uno necesita aportar información distinta sobre una carta del roll siguiente sin revelar siempre la respuesta completa.

### Opciones consideradas

1. Contexto; posición y rasgo; perfil completo sin identidad; carta exacta.
2. Contexto; posición; OVR; carta exacta.
3. Contexto; dos perfiles parciales; dos perfiles completos; carta exacta.

### Decisión

El nivel 1 revela un contexto de una carta futura (nacionalidad, club o década). El nivel 2 revela su posición primaria y rasgo. El nivel 3 revela OVR, posición, rasgo y contextos de una carta, sin identidad. El nivel 4 revela una carta exacta y conserva una probabilidad inicial de 5%.

### Motivo

Cada escalón puede cambiar una decisión distinta: química, necesidad posicional, build o una apuesta concreta. La identidad permanece como sorpresa salvo en el resultado excepcional.

### Trade-offs

La precisión del nivel 3 puede permitir inferir una identidad en un pool pequeño. Se debe comunicar que la información se refiere a al menos una carta del siguiente roll y no a toda la oferta.

### Qué invalidaría esta decisión

Que los niveles 1 o 2 no modifiquen elecciones, que el nivel 3 sea indistinguible de revelar una carta exacta o que los jugadores no comprendan a qué carta/oferta aplica el informe.

## DEC-060 — Probabilidades iniciales de scouting

### Contexto

El scouting tiene cuatro niveles y la revelación exacta debe ocurrir inicialmente en 5% de los usos. Faltaba repartir el 95% restante entre información contextual, posición+rasgo y perfil sin identidad.

### Opciones consideradas

1. 50% / 30% / 15% / 5%.
2. 65% / 20% / 10% / 5%.
3. 35% / 35% / 25% / 5%.

### Decisión

Las probabilidades iniciales son: 50% contexto, 30% posición y rasgo, 15% perfil sin identidad y 5% carta exacta.

### Motivo

La información básica aparece con frecuencia suficiente para justificar el recurso; los resultados más potentes permanecen escasos y memorables.

### Trade-offs

Es un punto de partida que puede subestimar o sobrevalorar el scouting según el tamaño real del pool y la utilidad de cada informe. No implica que todos los niveles tengan igual valor percibido.

### Qué invalidaría esta decisión

Que el scouting no cambie elecciones, que el perfil completo domine el resultado de las runs o que la carta exacta parezca demasiado frecuente o irrelevante.

## DEC-061 — Scouting prioriza una carta relevante ya generada

### Contexto

El informe de scouting describe una carta del próximo roll. Faltaba decidir si esa carta se tomaba al azar, si el jugador elegía una lente o si se priorizaba por relevancia para el plantel actual.

### Opciones consideradas

1. Carta al azar dentro de la oferta.
2. Carta relevante para necesidad posicional, química o umbral de rasgo; al azar si no existe.
3. El jugador elige una lente antes de usar scouting.

### Decisión

El scouting prioriza describir una carta ya generada del próximo roll que sea relevante para una necesidad posicional pendiente, una conexión de química posible o un umbral de rasgo. Si no hay una carta relevante, describe una carta al azar. No modifica ni crea la oferta.

### Motivo

El único scouting debe tener probabilidad razonable de informar una decisión sin convertirse en asistencia que fabrique una respuesta. La oferta sigue obedeciendo al generador del draft.

### Trade-offs

La noción de relevancia debe ser explícita y podría revelar indirectamente que existe una oportunidad útil. No puede competir ni interferir con las garantías posicionales.

### Qué invalidaría esta decisión

Que el scouting sea siempre óptimo, que la relevancia no se pueda explicar, que revele demasiada información de la oferta o que los informes aleatorios se sientan inútiles.

## DEC-062 — Sin repetición de cartas históricas dentro de una partida

### Contexto

El MVP usa una versión histórica concreta por jugador. Había que decidir si una carta rechazada podía reaparecer más tarde, incluso como resultado de un reroll.

### Opciones consideradas

1. Cada carta aparece como máximo una vez por partida.
2. Una carta rechazada puede reaparecer.
3. Solo puede reaparecer después de reroll.

### Decisión

Una versión histórica puede aparecer como máximo una vez dentro de una partida, incluso si el jugador usa reroll.

### Motivo

Preserva la fantasía de construir un plantel con jugadores únicos, hace que cada aparición tenga peso y evita duplicados imposibles de la misma carta.

### Trade-offs

Una partida puede mostrar hasta 42 cartas distintas —37 de los 11 picks y hasta cinco adicionales por reroll—, por lo que el pool necesita suficiente tamaño y distribución. El generador no puede usar la repetición como solución fácil a una necesidad pendiente.

### Qué invalidaría esta decisión

Que el pool requerido sea desproporcionado para el MVP, que la variedad entre partidas sea insuficiente o que la falta de repeticiones agrave la cobertura posicional.

## DEC-063 — Pool inicial de 150 cartas históricas

### Contexto

Sin repetición por partida, una run puede mostrar hasta 42 cartas. Había que equilibrar variedad del draft contra coste de curaduría, balance, derechos y contenido.

### Opciones consideradas

1. 80 cartas iniciales.
2. 100 cartas iniciales.
3. 150 cartas iniciales.

### Decisión

El pool inicial objetivo del MVP tendrá 150 cartas históricas, una versión concreta por jugador.

### Motivo

Busca suficiente variedad entre partidas y una representación amplia de posiciones, rasgos, nacionalidades, clubes y décadas sin recurrir a cartas repetidas.

### Trade-offs

Es un compromiso relevante de contenido y balance antes de validar el loop. Exige una curaduría consistente de OVR, posiciones, rasgos y contextos; también amplía el gate de derechos para distribución pública.

### Qué invalidaría esta decisión

Que el coste de curaduría o derechos retrase la prueba del loop, que 150 cartas no produzcan más variedad percibida que un pool menor o que el balance no pueda sostenerse con el tiempo disponible.

## DEC-064 — Distribución posicional proporcional a la 4-3-3

### Contexto

El pool de 150 debe alimentar una formación con una plaza de POR, LD, LI, ED, DC y EI; dos de DFC y tres de MC. Había que decidir si la oferta de cartas seguía esa demanda o priorizaba simetría/atractivo.

### Opciones consideradas

1. Distribución proporcional a las plazas de la 4-3-3.
2. Reparto igual entre las ocho categorías.
3. Prioridad a posiciones ofensivas y jugadores atractivos.

### Decisión

La distribución de las 150 cartas por posición primaria seguirá de forma aproximada la demanda de plazas de la 4-3-3: más MC y DFC; cuota menor pero suficiente para las categorías de una plaza.

### Motivo

Reduce la necesidad de corregir artificialmente el draft con protecciones y alinea la disponibilidad del pool con la construcción que el juego pide.

### Trade-offs

Puede haber menos estrellas ofensivas de las que el público espera y la proporción exacta requiere un compromiso entre simetría lateral, representación histórica y demanda. Las secundarias no reemplazan esta distribución.

### Qué invalidaría esta decisión

Que la oferta normal siga dejando necesidades frecuentes, que la variedad ofensiva se perciba insuficiente o que los datos muestren que una distribución distinta genera mejores decisiones.

## DEC-065 — Cuotas posicionales como objetivos con tolerancia

### Contexto

La distribución proporcional de 150 cartas produce cuotas aproximadas y algunas fracciones incompatibles con una simetría perfecta. Había que decidir si usar cifras rígidas, una banda controlada o una guía informal.

### Opciones consideradas

1. Cuotas exactas por categoría.
2. Objetivos con tolerancia de ±2, preservando simetría de laterales y extremos.
3. Guía informal sin límites.

### Decisión

Las cuotas posicionales son objetivos con tolerancia de ±2 cartas por categoría. Se preserva la simetría entre LD/LI y entre ED/EI salvo una decisión futura explícita de curaduría.

### Motivo

Mantiene una oferta alineada a la formación sin forzar la selección histórica por una diferencia marginal de cuota.

### Trade-offs

Requiere revisar el pool final antes de publicarlo; la tolerancia no puede convertirse en una excusa para privilegiar repetidamente categorías atractivas.

### Qué invalidaría esta decisión

Que la banda produzca déficits de posiciones, que rompa la simetría percibida o que la curaduría se desvíe de la demanda de la formación sin evidencia de mejora.

## DEC-066 — Draft diario determinista en todas sus oportunidades

### Contexto

El Draft diario usa un seed común y un único intento competitivo. Faltaba definir si reroll, scouting y las protecciones mantenían azar individual después de iniciar la partida.

### Opciones consideradas

1. Todas las oportunidades se determinan por seed y acciones.
2. Solo las ofertas iniciales son comunes; reroll y scouting son aleatorios.
3. Solo se comparte una lista de cartas, con generador libre para el resto.

### Decisión

En el Draft diario, las ofertas, protecciones, resultado de reroll y nivel/contenido de scouting se determinan por el seed y el estado de las acciones del jugador. No hay azar individual que altere una comparación competitiva.

### Motivo

Dos jugadores que toman las mismas decisiones reciben las mismas oportunidades. El ranking puede atribuir diferencias al razonamiento, no a una tirada privada.

### Trade-offs

Hace el modo más vulnerable a soluciones compartidas y exige prevenir manipulación o repetición del intento. Esas medidas son LATER hasta que el loop individual justifique el costo.

### Qué invalidaría esta decisión

Que la determinación haga el modo predecible o aburrido, que las soluciones dominantes borren variedad o que el coste de preservar un intento justo supere el valor del modo en MVP.

## DEC-067 — Empates con puesto compartido en Draft diario

### Contexto

El puntaje se muestra con un decimal y el Draft diario compara resultados equivalentes. Había que resolver empates sin premiar conducta ajena a la calidad del draft.

### Opciones consideradas

1. Compartir puesto cuando el puntaje visible es igual.
2. Desempatar con precisión interna no visible.
3. Desempatar por tiempo de partida.
4. Desempatar por recursos no usados.

### Decisión

Los jugadores con el mismo puntaje visible comparten puesto en el ranking del Draft diario.

### Motivo

La clasificación mantiene una regla que el jugador puede comprobar. No incentiva rapidez, retención artificial de recursos ni cálculos invisibles.

### Trade-offs

Puede haber varios primeros puestos, en especial antes de conocer la distribución real de scores. Es preferible a inventar un segundo objetivo no relacionado con el draft.

### Qué invalidaría esta decisión

Que los empates sean tan frecuentes que el ranking pierda interés o que una regla de orden adicional se vuelva necesaria y pueda explicarse sin alterar incentivos.

## DEC-068 — Puntaje de equipo sin tope superior

### Contexto

El OVR individual usa escala de 1 a 100, pero el puntaje de equipo añade química y rasgos. Había que decidir si limitar el resultado final a 100.

### Opciones consideradas

1. Sin tope superior.
2. Tope estricto en 100.
3. Tope en 110.

### Decisión

El puntaje de equipo no tiene tope superior. Un resultado puede superar 100 si el promedio posicional, la química y los rasgos lo justifican.

### Motivo

Evita desperdiciar decisiones exitosas cerca del máximo y comunica que el puntaje de equipo mide composición, no solo calidad individual.

### Trade-offs

La cercanía entre OVR y puntaje puede inducir a confusión; la pantalla debe diferenciar claramente la valoración de una carta del resultado compuesto de la squad.

### Qué invalidaría esta decisión

Que los valores superiores a 100 sean demasiado frecuentes, que el rango pierda legibilidad o que el crecimiento de rasgos/química vuelva irrelevante el OVR.

## DEC-069 — Presupuesto moderado para bonos de rasgos

### Contexto

La química máxima aporta aproximadamente 5% sobre el promedio posicional; en una squad de OVR 90 equivale a unos 4,5 puntos. Había que definir una magnitud inicial para los umbrales de rasgo sin dejar que opaquen OVR y química.

### Opciones consideradas

1. Moderado: alrededor de +1 a tres copias y +3 a cinco.
2. Alto: alrededor de +2 y +6.
3. Bajo: alrededor de +0,5 y +1,5.

### Decisión

El presupuesto inicial de un rasgo es aproximadamente +1 punto al umbral de tres y +3 al de cinco, que reemplaza al anterior. Cada rasgo puede variar ligeramente dentro de esa banda; los valores exactos se fijarán al probar el pool y la frecuencia de activación.

### Motivo

Hace que perseguir un rasgo compita con una buena elección de OVR o química, sin transformar el puntaje en una carrera exclusiva de umbrales.

### Trade-offs

La diferencia entre rasgos será contenida y puede percibirse como insuficiente. A la vez, aún se pueden acumular varios umbrales en una misma squad, por lo que la disponibilidad importa tanto como el valor.

### Qué invalidaría esta decisión

Que los rasgos no afecten picks, que varios umbrales dominen el puntaje o que las pruebas indiquen que un presupuesto distinto mejora diversidad y comprensión.

## DEC-070 — Perfiles de rasgos flexibles por posición

### Contexto

Los seis rasgos deben distribuirse en el pool de 150 cartas. Se buscaba permitir excepciones como un DFC Rematador sin llenar el juego de combinaciones históricamente arbitrarias.

### Opciones consideradas

1. Tendencias por posición con excepciones históricas justificadas.
2. Sin restricción por posición.
3. Límites rígidos por familia de posición.

### Decisión

Cada rasgo tiene posiciones donde aparece con mayor frecuencia, pero una versión histórica puede ser una excepción si la curaduría la justifica. No existen límites rígidos por posición.

### Motivo

Conserva legibilidad futbolística y permite cartas que cambian una decisión de build, como un defensor Rematador, sin tratar todas las combinaciones como equivalentes.

### Trade-offs

La curaduría requiere criterio y podría parecer subjetiva. Las excepciones deben ser escasas y visibles como oportunidad, no un modo de inflar artificialmente un rasgo.

### Qué invalidaría esta decisión

Que los perfiles no se perciban, que las excepciones sean tan frecuentes que no haya identidad posicional o que los límites blandos oculten sesgos de balance en el pool.

## DEC-071 — Duración objetivo de 4 a 6 minutos por partida

### Contexto

La partida incluye 11 picks, dos rolls especiales, un scouting, un reroll y gestión de plantel. En PWA móvil, la duración cambia abandono, deliberación y probabilidad de iniciar otra partida.

### Opciones consideradas

1. 4 a 6 minutos.
2. 7 a 10 minutos.
3. Menos de 3 minutos.

### Decisión

La duración objetivo de una primera partida completa es de 4 a 6 minutos.

### Motivo

Da tiempo suficiente para comparar trade-offs y comprender el resultado, manteniendo una segunda partida viable dentro de una sesión móvil corta.

### Trade-offs

Cada explicación, animación o decisión adicional compite contra este presupuesto. Las ofertas especiales y recursos deben aumentar calidad de decisión, no alargar por fricción.

### Qué invalidaría esta decisión

Que la deliberación real requiera más tiempo para ser satisfactoria, que la completion rate caiga por duración o que reducirla haga que las elecciones se vuelvan automáticas.

## DEC-072 — Primera partida con reglas reales y ayuda contextual

### Contexto

La primera partida debe enseñar posiciones, química, rasgos, scouting y reroll en 4–6 minutos. Había que elegir entre usar todas las reglas, simplificar el primer intento o mostrar un tutorial previo.

### Opciones consideradas

1. Reglas reales desde el inicio, con ayudas breves al aparecer.
2. Primera partida simplificada sin recursos.
3. Tutorial largo antes de jugar.

### Decisión

La primera partida usa las mismas reglas que el resto. Las ayudas son breves, contextuales y aparecen solo cuando una regla puede modificar la decisión actual.

### Motivo

Permite validar el loop auténtico desde el primer intento sin exigir al jugador memorizar una explicación previa ni descubrir después que las reglas cambiaron.

### Trade-offs

La interfaz y el orden de exposición deben estar muy cuidados. Una ayuda que aparezca tarde puede causar pérdida; una que aparezca demasiado pronto puede interrumpir el ritmo.

### Qué invalidaría esta decisión

Que la primera run tenga abandono o confusión altos, que los jugadores no comprendan recursos antes de gastarlos o que las ayudas aumenten la duración más allá del objetivo.

## DEC-073 — Partida libre como CTA principal de la landing

### Contexto

El producto tendrá partida libre y Draft diario. Había que decidir si la landing iniciaba directamente el loop individual, priorizaba la competencia diaria o exigía elegir un modo.

### Opciones consideradas

1. Partida libre como “Jugar”; Draft diario visible y secundario.
2. Draft diario como CTA principal.
3. Selector de modo antes de jugar.

### Decisión

La llamada principal de la landing inicia una partida libre. El Draft diario es visible como alternativa competitiva, pero secundaria en el primer contacto.

### Motivo

Protege la validación de la diversión base y evita exigir ranking, verificación o renovación diaria antes de que el jugador descubra el valor del draft.

### Trade-offs

La competencia puede recibir menos exposición inicial. La landing debe comunicar que el Draft diario existe sin añadir una decisión que retrase el primer pick.

### Qué invalidaría esta decisión

Que el Draft diario sea la razón principal demostrable para volver, que la partida libre no tenga suficiente motivación o que los jugadores no descubran el modo competitivo.

## DEC-074 — Repetir partida libre como CTA principal del resultado

### Contexto

La hipótesis principal es que una persona termina una partida y quiere iniciar otra. Tras una partida libre, había que elegir entre repetir directamente, derivar al Draft diario o abrir un selector.

### Opciones consideradas

1. “Jugar otra partida” libre como acción principal.
2. “Ir al Draft diario” como acción principal.
3. Elegir modo antes de repetir.

### Decisión

La acción principal de la pantalla de resultado de una partida libre inicia inmediatamente otra partida libre.

### Motivo

Mide y favorece el loop que se busca validar: draft, decisiones, resultado y voluntad de mejorar en una nueva run.

### Trade-offs

El Draft diario y otras acciones reciben menos prominencia al final. El resultado debe seguir hacer visibles el puntaje y el récord antes de que el jugador elija repetir.

### Qué invalidaría esta decisión

Que los jugadores quieran comparar/competir antes que repetir, que la repetición inmediata oculte el valor de revisar la squad o que no aumente la tasa de segunda partida.

## DEC-075 — Squad como protagonista de la pantalla de resultado

### Contexto

El resultado debe producir orgullo por el plantel y, a la vez, permitir explicar el puntaje. Había que decidir si el primer impacto visual prioriza el desglose o la presentación de la squad.

### Opciones consideradas

1. Puntaje y desglose antes que la squad.
2. Squad como protagonista visual, con puntaje secundario.
3. Pantalla de revelación y luego desglose separado.

### Decisión

La pantalla de resultado presenta primero la squad construida como protagonista visual. El puntaje permanece visible, pero el desglose no desplaza a los jugadores del primer impacto.

### Motivo

Refuerza la fantasía de haber construido el mejor draft posible y produce un artefacto emocionalmente valioso para revisar o compartir.

### Trade-offs

La causalidad del puntaje puede quedar escondida si el acceso al desglose no es inmediato y claro. La composición móvil debe equilibrar orgullo visual con explicación verificable.

### Qué invalidaría esta decisión

Que los jugadores no logren explicar su resultado, que el puntaje sea ignorado o que la squad visual no genere una reacción más fuerte que una presentación analítica.

## DEC-076 — Desglose expandible en la pantalla de resultado

### Contexto

La pantalla de resultado prioriza la squad, pero el jugador debe poder entender de dónde sale su puntaje. Había que decidir si mostrar un resumen expandible, abrir otra pantalla o revelar el detalle automáticamente.

### Opciones consideradas

1. Resumen compacto y control “¿Por qué?” expandible en la misma pantalla.
2. Pantalla separada de desglose.
3. Desglose automático tras unos segundos.

### Decisión

Junto al puntaje se muestra un resumen compacto; el jugador puede expandir “¿Por qué?” para ver el desglose completo sin salir de la pantalla de resultado.

### Motivo

Conserva a la squad como artefacto principal y hace que la causalidad del puntaje esté disponible de inmediato, a demanda del jugador.

### Trade-offs

El resumen debe ser suficiente para despertar curiosidad sin intentar mostrar toda la fórmula. Un control poco visible volvería a ocultar la transparencia.

### Qué invalidaría esta decisión

Que los jugadores no encuentren ni usen el desglose, que sigan sin explicar sus resultados o que la expansión sature la pantalla móvil.

## DEC-077 — Imagen de squad como primer artefacto social

### Contexto

La pantalla de resultado convierte la squad final en un artefacto visual. Había que elegir el primer mecanismo social entre imagen compartible, link para jugar el seed o replay de decisiones.

### Opciones consideradas

1. Imagen compartible de squad con puntaje, rasgos activos y seed.
2. Link para jugar el mismo seed.
3. Replay completo de picks.

### Decisión

El primer artefacto social del MVP es una imagen compartible de la squad final que incluye puntaje, rasgos activos y seed.

### Motivo

Funciona de forma natural en WhatsApp, Instagram y Discord sin construir una red social, una identidad competitiva completa ni un reproductor de partidas.

### Trade-offs

No permite desafiar al destinatario de forma directa todavía. Debe respetar el gate de derechos aplicable a imágenes, escudos y jugadores antes de cualquier distribución pública.

### Qué invalidaría esta decisión

Que los jugadores no compartan la imagen, que no exprese orgullo/comparación o que un link de seed resulte claramente más útil para crecimiento orgánico.

## DEC-078 — Récord personal siempre visible en el resultado

### Contexto

La pantalla de resultado prioriza la squad y ofrece repetir una partida libre. Había que decidir si el récord personal se mostraba siempre, solo al superarlo o exclusivamente fuera de la run.

### Opciones consideradas

1. Mostrar siempre nuevo récord o distancia exacta al récord.
2. Mostrarlo solo al superarlo.
3. Mostrarlo solo en perfil.

### Decisión

El resultado muestra siempre el estado del récord personal: “nuevo récord” si se supera o la diferencia exacta si no. Aparece cerca del puntaje, sin desplazar a la squad.

### Motivo

Da un objetivo claro para volver a jugar incluso después de una buena run que no alcanza el máximo personal, sin ocultar el progreso individual.

### Trade-offs

Puede frustrar si la brecha parece inalcanzable o incentivar exclusivamente la optimización del puntaje. Debe acompañar el resultado, no reemplazar la valoración de la squad construida.

### Qué invalidaría esta decisión

Que los jugadores perciban el récord como presión, que ignore la variedad de builds o que no incremente la repetición voluntaria.

## DEC-079 — Analítica contextual de reroll

### Contexto

El MVP entrega un reroll de oferta completa por partida. Para saber si agrega una decisión valiosa, no alcanza con contar su uso.

### Opciones consideradas

1. Registrar pick, oferta descartada y elección posterior.
2. Registrar solo cantidad de usos.
3. Registrar todos los toques de la pantalla.

### Decisión

Cada uso de reroll registra el índice de pick, tipo/tamaño de oferta, identificadores de cartas descartadas y la carta que el jugador elige tras la nueva oferta.

### Motivo

Permite analizar timing y resultado de la intervención: si resolvió una necesidad, persiguió una build o se usó de forma automática sin mejorar decisiones.

### Trade-offs

Requiere conservar contexto de oferta y relacionar eventos dentro de una partida. No debe convertirse en captura indiscriminada de interacciones ni información personal.

### Qué invalidaría esta decisión

Que los datos no permitan distinguir una mejora de una elección equivalente, que la instrumentación afecte rendimiento o que el volumen no aporte decisiones de balance.

## DEC-080 — Abandono contextualizado por pick y ayuda

### Contexto

Una partida no completada solo se vuelve aprendizaje si podemos distinguir si el abandono ocurrió frente a una oferta, una regla nueva o una fricción de ritmo.

### Opciones consideradas

1. Registrar último pick completado y última ayuda contextual mostrada.
2. Registrar solo que la partida fue abandonada.
3. Registrar cada toque y tiempo de pantalla.

### Decisión

Al abandonar una partida se registra el último pick completado y la última ayuda contextual mostrada.

### Motivo

Localiza zonas de fricción de forma accionable con un volumen de datos acotado y directamente relacionado con onboarding y decisiones.

### Trade-offs

No identifica por sí solo la causa subjetiva del abandono; deberá complementarse con observación cualitativa en pruebas. No justifica registrar interacción indiscriminada.

### Qué invalidaría esta decisión

Que los abandonos no se concentren en puntos interpretables, que el dato no cambie ninguna iteración o que haga falta una señal adicional claramente vinculada a una hipótesis.

## DEC-081 — Reanudación exacta de partida interrumpida

### Contexto

La PWA es mobile-first y una partida dura 4–6 minutos. Había que decidir si una interrupción del navegador o aplicación destruye la partida, permite reanudarla o abre una decisión adicional.

### Opciones consideradas

1. Reanudar exactamente desde el estado interrumpido; en Draft diario hasta el cierre del día.
2. Perder la partida ante interrupción.
3. Elegir al volver entre reanudar o abandonar.

### Decisión

Una partida interrumpida se puede reanudar exactamente desde su estado anterior. En Draft diario, la reanudación está disponible hasta que cierre el día correspondiente.

### Motivo

Respeta el contexto móvil y evita que una interrupción accidental consuma una run o el intento competitivo. No añade una nueva decisión irrelevante.

### Trade-offs

La partida debe conservar de manera inequívoca su estado y no permitir que reanudar cree oportunidades distintas. En Draft diario no evita que alguien piense fuera de la aplicación, pero tampoco lo haría la pérdida forzada.

### Qué invalidaría esta decisión

Que la reanudación genere estados inconsistentes, habilite manipulación relevante del intento competitivo o no sea usada frente al coste de mantenerla.

## DEC-082 — Draft diario y ranking como SHOULD

### Contexto

El Draft diario tiene una propuesta competitiva definida, pero requiere determinismo, control de intento, ranking y medidas proporcionales de equidad. El objetivo principal del MVP es validar primero la partida libre.

### Opciones consideradas

1. SHOULD: incorporarlo tras validar el loop libre si su coste es proporcional.
2. MUST: incluirlo en la primera entrega.
3. LATER: posponerlo fuera de la primera versión.

### Decisión

Draft diario y ranking se clasifican como SHOULD. Se incorporan solo después de demostrar que la partida libre cumple las señales de diversión y si el costo de comparación justa es proporcional.

### Motivo

Conserva una diferenciación competitiva importante sin permitir que anti-cheat, verificación y backend oculten o retrasen la validación del loop fundamental.

### Trade-offs

La primera entrega puede tener menos urgencia competitiva. El diseño del modo debe conservarse y revisarse cuando haya evidencia de repetición libre.

### Qué invalidaría esta decisión

Que las pruebas muestren que el Draft diario es el motivo principal para jugar, que la partida libre no se sostenga sola o que el modo competitivo pueda añadirse con costo bajo sin comprometer la validación.

## DEC-083 — Información esencial visible y detalle expandible por carta

### Contexto

Cada opción de draft contiene OVR, posiciones, rasgo y contextos, además de su efecto sobre la squad. En mobile-first, mostrar todo permanentemente puede volver ilegibles tres o cinco cartas; ocultarlo vuelve opacos los trade-offs.

### Opciones consideradas

1. Mostrar información esencial y cambios relevantes; expandir secundarias y contextos con un toque.
2. Mostrar todos los datos de forma permanente.
3. Mostrar solo OVR y una etiqueta simplificada de encaje.

### Decisión

Cada carta muestra directamente OVR, posición primaria, rasgo y cambios relevantes para la squad. Las posiciones secundarias y contextos se expanden con un toque inmediato. Toda la información está disponible antes de elegir sin navegación adicional.

### Motivo

Protege lectura rápida en móvil y permite que un jugador experto inspeccione todas las variables antes de decidir.

### Trade-offs

La definición de “cambios relevantes” debe ser consistente y no ocultar información decisiva. El detalle expandible debe ser accesible y no requerir precisión gestual.

### Qué invalidaría esta decisión

Que los jugadores tomen decisiones sin encontrar los datos necesarios, que los detalles se usen constantemente porque la carta base es insuficiente o que cinco opciones especiales saturen la pantalla.

## DEC-084 — Confirmación explícita de carta en móvil

### Contexto

Elegir una carta es irreversible dentro de la partida. En una interfaz táctil había que equilibrar prevención de toques accidentales contra fricción en once picks.

### Opciones consideradas

1. Primer toque selecciona e inspecciona; “Elegir” confirma; luego se asigna plaza.
2. Un toque confirma directamente y pasa a plaza.
3. Pulsación larga confirma.

### Decisión

El primer toque selecciona la carta y muestra su impacto. Un segundo toque en el botón “Elegir” confirma la carta; después el jugador la asigna a una plaza.

### Motivo

Evita perder una decisión estratégica por un toque accidental y permite revisar información antes de comprometerse, con una interacción familiar para móvil.

### Trade-offs

Agrega un gesto por pick y debe ejecutarse con rapidez. El estado seleccionado y la consecuencia de confirmar deben ser inequívocos.

### Qué invalidaría esta decisión

Que la confirmación aumente materialmente duración o abandono, que siga habiendo elecciones accidentales o que el jugador no entienda cuándo la carta quedó comprometida.

## DEC-085 — OVR exacto visible al asignar plaza

### Contexto

Después de confirmar una carta, el jugador elige entre plazas libres y las posiciones pueden reducir su OVR. Había que decidir si mostrar solo categorías de encaje, el OVR exacto o una sugerencia automática.

### Opciones consideradas

1. Mostrar el OVR exacto de la carta en cada plaza libre.
2. Mostrar solo primaria, secundaria o fuera de posición.
3. Sugerir una única plaza automática.

### Decisión

Al asignar una carta, cada plaza libre muestra el OVR exacto que esa carta tendría allí.

### Motivo

Hace visible el coste posicional antes de comprometer la ubicación y permite comparar alternativas sin cálculo mental, especialmente en móvil.

### Trade-offs

La formación puede mostrar muchos valores a la vez; la jerarquía visual debe evitar que parezca una calculadora. La carta sigue pudiendo reorganizarse luego, por lo que el jugador necesita entender esa libertad.

### Qué invalidaría esta decisión

Que los valores saturen la pantalla, que no cambien ninguna asignación o que los jugadores interpreten equivocadamente el OVR de plaza como un cambio permanente de la carta.

## DEC-086 — Protección posicional con candidatos de posición primaria

### Contexto

Una categoría pendiente recibe tres oportunidades de candidatos y una secundaria puede servir para cubrir plazas con −4 OVR. Había que decidir si una carta secundaria satisface también la garantía de oportunidad.

### Opciones consideradas

1. Solo cartas con posición primaria coincidente cuentan como candidatas protegidas.
2. Las posiciones secundarias también cuentan.
3. Cualquier carta fuera de posición cuenta.

### Decisión

Los tres candidatos garantizados de una necesidad posicional pendiente deben tener esa posición como primaria. Las secundarias no satisfacen la garantía de aparición.

### Motivo

Cuando el juego promete oportunidades para resolver una necesidad, promete tres soluciones de OVR completo. Las secundarias siguen siendo una herramienta valiosa de adaptación, no un sustituto débil de la protección.

### Trade-offs

Condiciona más el generador y puede aumentar apariciones de una misma posición. La cobertura del plantel puede seguir incluir secundarias, de modo que la UI debe distinguir aparición garantizada de necesidad ya cubierta.

### Qué invalidaría esta decisión

Que las ofertas se vuelvan repetitivas, que las secundarias sean irrelevantes o que la protección no llegue a tiempo pese a usar cartas primarias.

## DEC-087 — Ofertas de cartas independientes con protecciones mínimas

### Contexto

Para generar las tres o cinco opciones de un roll se evaluó componer trade-offs deliberados, extraer cartas independientes con las protecciones aprobadas o repetir siempre un molde de categorías de valor.

### Opciones consideradas

1. Componer al menos dos opciones de valor distinto por oferta.
2. Extraer cartas independientes, sujetas a protecciones mínimas.
3. Usar siempre un molde de alta OVR, química y rasgo.

### Decisión

Las cartas de una oferta se extraen de forma independiente, sujetas a las protecciones posicionales y demás reglas ya aprobadas. El generador no compone deliberadamente una estructura fija de trade-offs.

### Motivo

Preserva incertidumbre entre partidas y evita que el jugador aprenda un guion repetido de categorías por oferta.

### Trade-offs

No garantiza que cada oferta tenga alternativas equivalentes: pueden existir elecciones obvias o poco útiles. Las protecciones evitan carencias posicionales, no la dominancia entre cartas.

### Qué invalidaría esta decisión

Que la frecuencia de ofertas dominadas reduzca deliberación, que el reroll se use solo para escapar de ellas o que las pruebas muestren menos variedad/compresión que con un filtro mínimo.

## DEC-088 — Aceptar ofertas dominadas ocasionales

### Contexto

Las extracciones independientes pueden producir una carta claramente peor que otra de la misma oferta. Se evaluó aceptar ese ruido, aplicar un filtro contextual de dominancia o delegar la corrección al reroll.

### Opciones consideradas

1. Aceptar ofertas dominadas ocasionales.
2. Reemplazar una carta solo si es peor o igual en OVR posicional, química inmediata y progreso de rasgo.
3. Confiar en el reroll para corregirlas.

### Decisión

El MVP acepta ofertas dominadas ocasionales. No se aplica un filtro oculto de dominancia y el reroll no se define como corrector obligatorio de la generación.

### Motivo

Mantiene el carácter de incertidumbre de las ofertas independientes y evita introducir una regla contextual opaca antes de probar cuán frecuente es el problema.

### Trade-offs

Algunas decisiones no aportarán profundidad. Esto está en tensión con el objetivo de evitar elecciones obvias y debe ser medido explícitamente, no racionalizado después.

### Qué invalidaría esta decisión

Que una proporción relevante de ofertas tenga una opción dominante, que la deliberación caiga o que el reroll se use predominantemente para escapar de ruido generado.

## DEC-089 — OVR alto con aparición progresivamente más escasa

### Contexto

Las ofertas extraen cartas independientes. Había que definir si una carta de OVR alto tenía la misma probabilidad base que las demás o si su aparición debía ser menos frecuente.

### Opciones consideradas

1. Misma probabilidad base para todas las cartas.
2. Probabilidad progresivamente menor para OVR alto.
3. Rarezas visibles de jugador adicionales al OVR.

### Decisión

Las cartas de OVR alto tienen una probabilidad de aparición progresivamente menor que las de OVR medio/bajo. No se añade una rareza visible de jugador en el MVP.

### Motivo

Una estrella debe crear una oportunidad especial y dejar espacio para que química, rasgos y posiciones compitan con la calidad individual.

### Trade-offs

La probabilidad deja de ser uniforme y necesita una curva calibrada contra el pool real. Si la escasez es excesiva, el OVR alto se vuelve evento puramente afortunado; si es leve, vuelve la dominancia.

### Qué invalidaría esta decisión

Que los jugadores de OVR alto definan demasiado el resultado, que nunca aparezcan en una sesión razonable o que la curva reduzca variedad de builds.

## DEC-090 — Curva interna continua de escasez por OVR

### Contexto

Se aprobó que OVR alto aparezca con menor frecuencia. Faltaba definir si esa escasez se comunica como bandas visibles, se curva internamente o se ajusta de forma manual por carta.

### Opciones consideradas

1. Curva interna continua según OVR, sin rareza visible de jugador.
2. Bandas visibles de rareza de jugador.
3. Pesos manuales por carta.

### Decisión

La escasez se determina por una curva interna continua en función del OVR. Las cartas no muestran una etiqueta de rareza adicional en el MVP.

### Motivo

Conserva una lectura de carta limpia y separa la valoración del jugador del sistema cromático de rareza de scouting.

### Trade-offs

La curva debe documentarse y calibrarse para equipo de diseño aunque no se muestre como una etiqueta. Pesa menos el control editorial individual que con pesos manuales.

### Qué invalidaría esta decisión

Que el comportamiento real se sienta imprevisible o injusto, que ciertos jugadores necesiten excepciones constantes o que las bandas visibles ayuden más a la comprensión sin sumar complejidad.

## DEC-091 — Eventos roguelite no relacionados con draft quedan LATER

### Contexto

El MVP ya combina draft, posiciones, química, rasgos, scouting y reroll. Se evaluó añadir eventos como lesión, transferencia, capitán o mejora durante una partida.

### Opciones consideradas

1. No incluir eventos en MVP; dejarlos para LATER.
2. Incluir un evento de elección por partida.
3. Incluir varios eventos.

### Decisión

Los eventos roguelite no relacionados directamente con el draft quedan LATER. El MVP no incluye lesiones, transferencias, capitanes ni mejoras de evento.

### Motivo

Permite probar si el draft y la construcción de squad sostienen por sí mismos el deseo de repetir, sin ruido que confunda la causa de un buen o mal resultado.

### Trade-offs

La primera versión tendrá menos variedad narrativa de roguelite. Si el loop base es débil, no habrá eventos para disimularlo; si es fuerte, se podrán añadir después con una hipótesis clara.

### Qué invalidaría esta decisión

Que las pruebas muestren repetición baja pese a decisiones de draft sólidas y que un evento pequeño, claramente elegido, resuelva esa carencia sin empeorar comprensión.

## DEC-092 — Colección visual sin poder persistente

### Contexto

Se evaluó mantener solo el récord personal, añadir una colección visual o usar desbloqueos que alteren poder entre partidas.

### Opciones consideradas

1. Solo récord personal.
2. Colección visual sin poder.
3. Desbloqueos de poder.

### Decisión

El MVP incluye una colección visual sin poder persistente. No altera qué cartas aparecen, OVR, recursos, química ni equidad del Draft diario.

### Motivo

Aprovecha el atractivo de las versiones históricas y permite apego/progreso horizontal sin usar poder persistente para compensar o distorsionar el loop.

### Trade-offs

Agrega estado, pantalla y expectativas de completitud antes de validar el núcleo. La colección debe tener una finalidad emocional clara, no convertirse en inventario por inercia.

### Qué invalidaría esta decisión

Que no se consulte, que reduzca foco en repetir partidas o que los jugadores exijan recompensas de poder para verla significativa.

## DEC-093 — Descubrimiento de colección al ver una oferta

### Contexto

La colección visual no otorga poder. Había que decidir si una carta se descubre al verla, al elegirla o solo después de completar una partida con ella.

### Opciones consideradas

1. Descubrir al ver una carta en cualquier oferta.
2. Descubrir solo al elegirla para la squad.
3. Descubrir al completar una partida con ella.

### Decisión

Una carta se descubre para la colección en el momento en que aparece en cualquier oferta de draft.

### Motivo

La colección registra exposición y curiosidad por el contenido sin empujar al jugador a tomar una carta peor para completar un álbum.

### Trade-offs

El progreso puede ser rápido —hasta 42 cartas visibles en una partida con reroll— y la colección no mide maestría. Su valor debe ser visual e informativo, no de escasez artificial.

### Qué invalidaría esta decisión

Que la colección se complete demasiado rápido, que no sea consultada o que descubrir una carta al elegirla genere mejor comportamiento sin distorsionar el draft.

## DEC-094 — Colección accesible desde landing y resultado

### Contexto

La colección visual debe ser accesible sin desplazar la partida libre como CTA principal. Se evaluó mostrarla solo tras resultados, siempre desde la landing o en ambos momentos.

### Opciones consideradas

1. Solo desde resultado con descubrimientos.
2. Siempre desde landing.
3. Desde landing y resultado.

### Decisión

La colección es accesible desde la landing y desde el resultado cuando hay nuevos descubrimientos. En landing tiene jerarquía secundaria frente a “Jugar”.

### Motivo

Permite revisar el progreso cuando el jugador lo busca y celebra la novedad tras una partida, sin convertir la colección en un desvío obligatorio del loop.

### Trade-offs

Añade navegación y puede competir con el CTA principal si no se jerarquiza bien. Debe probarse si los dos accesos generan uso real o solo superficie adicional.

### Qué invalidaría esta decisión

Que la colección reduzca el inicio de partidas, que un acceso resulte redundante o que los jugadores no la encuentren pese a existir en ambos lugares.

## DEC-095 — Cartas no descubiertas como siluetas posicionales

### Contexto

La colección visual registra cartas vistas. Había que definir si las no descubiertas se ocultan por completo, muestran la lista total atenuada o aparecen como siluetas con información mínima.

### Opciones consideradas

1. Siluetas con posición, sin nombre ni datos.
2. Lista completa atenuada con nombre e imagen.
3. Mostrar solo cartas descubiertas.

### Decisión

Las cartas no descubiertas se muestran como siluetas que indican su posición, sin revelar nombre, imagen, OVR, rasgo ni contextos.

### Motivo

Da visibilidad de progreso y curiosidad por el pool sin revelar todas las sorpresas ni convertir la colección en una lista de consulta estratégica.

### Trade-offs

La posición sola puede no ser suficiente para motivar descubrimiento. Debe evitarse que la colección sea una fuente indirecta de información útil para anticipar ofertas.

### Qué invalidaría esta decisión

Que las siluetas no generen interés, que ocultar todo reduzca el uso de colección o que revelar más información fortalezca el apego sin dañar el descubrimiento.

## DEC-096 — Seed fuera de la imagen compartible del MVP

### Contexto

La imagen compartible se eligió como primer artefacto social. Había que decidir si el seed mostrado permitía jugar la misma partida desde el MVP, quedaba como identificador sin acción o se omitía hasta tener desafío reproducible.

### Opciones consideradas

1. Permitir jugar un código desde la landing.
2. Mostrar seed solo como identificador.
3. Omitir seed hasta contar con link/replay o ingreso de código funcional.

### Decisión

La imagen compartible del MVP no muestra el seed. El desafío mediante seed queda LATER hasta disponer de un flujo completo y útil para jugarlo.

### Motivo

Evita publicar un código que el destinatario no puede usar y mantiene la imagen enfocada en squad, puntaje y rasgos activos.

### Trade-offs

Se pospone una vía de desafío orgánico entre amigos. El seed sigue existiendo como concepto para Draft diario y futuras experiencias reproducibles.

### Qué invalidaría esta decisión

Que los jugadores pidan consistentemente desafiar una seed, que el código resulte entendible sin flujo adicional o que un mecanismo mínimo de jugar seed aporte más valor que complejidad.

## DEC-097 — Bonos idénticos para los seis rasgos

### Contexto

Cada rasgo solo aporta puntaje en MVP y el presupuesto moderado aprobado es alrededor de +1 a tres copias y +3 a cinco. Había que decidir si diferenciar cifras por rasgo.

### Opciones consideradas

1. Bonos idénticos: +1 a tres y +3 a cinco.
2. Bonos levemente distintos dentro de una banda acotada.
3. Bonos muy distintos.

### Decisión

Los seis rasgos otorgan exactamente +1 punto al llegar a tres copias y +3 puntos al llegar a cinco, reemplazando el bono de tres.

### Motivo

Mantiene el sistema explicable y evita que el jugador persiga un rasgo por una tabla de puntos superior. La identidad de una build proviene de sus cartas, posiciones, contextos y decisiones de acceso.

### Trade-offs

Los rasgos corren riesgo de sentirse intercambiables. Si ocurre, se deben explorar diferencias de contenido o efectos posteriores, no introducir números desiguales sin evidencia.

### Qué invalidaría esta decisión

Que los jugadores no distingan builds, que todos los rasgos generen los mismos picks o que un rasgo necesite una regla propia para ser interesante.

## DEC-098 — Frecuencia de rasgos guiada por disponibilidad histórica

### Contexto

Los seis rasgos tienen bonos idénticos. Había que decidir si repartirlos por igual entre 150 cartas, seguir la disponibilidad histórica de perfiles o priorizar perfiles atractivos.

### Opciones consideradas

1. Aproximadamente 25 cartas por rasgo.
2. Frecuencia guiada por disponibilidad histórica.
3. Priorizar rasgos atractivos.

### Decisión

La frecuencia de rasgos en el pool se guía por disponibilidad histórica de los perfiles, no por cuotas iguales ni atractivo comercial.

### Motivo

Busca que la colección y las versiones históricas tengan coherencia futbolística antes que una distribución artificial de etiquetas.

### Trade-offs

Con bonos idénticos, un rasgo raro puede ser más difícil de completar sin recompensa superior. Hace falta decidir un piso de aparición o aceptar esa asimetría explícitamente.

### Qué invalidaría esta decisión

Que un rasgo casi nunca active umbrales, que la distribución haga dominantes a perfiles abundantes o que la coherencia histórica no se perciba como valor por el jugador.

## DEC-099 — Piso de presencia para rasgos históricos raros

### Contexto

Los rasgos siguen una distribución histórica, pero sus bonos son idénticos. Había que decidir si aceptar que un perfil raro fuera mucho menos viable o imponer un mínimo de presencia.

### Opciones consideradas

1. Aceptar asimetría completa por fidelidad histórica.
2. Mantener distribución histórica con piso de presencia por rasgo.
3. Compensar perfiles raros con más puntos.

### Decisión

Se mantiene la distribución histórica como guía, pero cada rasgo tendrá un piso de presencia que haga razonablemente viables los umbrales de tres y cinco. El valor exacto se definirá contra la curva de aparición del pool.

### Motivo

Evita builds que existan solo en teoría sin abandonar la coherencia histórica como principio de curaduría.

### Trade-offs

El piso reduce libertad de curaduría y necesita considerar no solo el número de cartas sino su OVR y probabilidad de aparición. No asegura completar cada rasgo en cada partida.

### Qué invalidaría esta decisión

Que los rasgos sigan siendo inviables, que el piso homogeneice de hecho el pool o que la simulación muestre que otro mecanismo protege mejor la diversidad.

## DEC-100 — Piso inicial de 18 cartas por rasgo

### Contexto

Cada rasgo necesita un piso de presencia dentro del pool de 150 para que los umbrales de tres y cinco sean viables sin igualar todas las frecuencias históricas.

### Opciones consideradas

1. 18 cartas por rasgo.
2. 15 cartas por rasgo.
3. 20 cartas por rasgo.

### Decisión

Cada rasgo tendrá al menos 18 cartas en el pool inicial de 150. La frecuencia por encima de ese piso sigue guiada por la curaduría histórica.

### Motivo

Equivale a un mínimo de 12% del pool y deja una expectativa aproximada de cinco apariciones entre hasta 42 cartas vistas, antes de ajustar por la curva de OVR. Es un punto de partida razonable para que los umbrales puedan existir en la práctica.

### Trade-offs

El valor debe validarse con la curva de aparición real y no garantiza cinco apariciones ni cinco elecciones en cada partida. Restringe parte de la curaduría histórica para proteger variedad jugable.

### Qué invalidaría esta decisión

Que los umbrales sigan siendo inviables, que 18 homogeneice de más los perfiles o que la simulación indique un piso distinto.

## DEC-101 — Vertical slice interna de 60 cartas antes del pool completo

### Contexto

El pool objetivo de MVP es de 150 cartas, pero curarlo y verificar derechos puede retrasar ver el loop en acción. Había que decidir si preparar una prueba interna menor, esperar el pool completo o reducir permanentemente el MVP.

### Opciones consideradas

1. Vertical slice interna de 60 cartas con las mismas reglas.
2. Esperar 150 cartas antes de toda versión visible.
3. Reducir formalmente el MVP a 60 cartas.

### Decisión

Se preparará una vertical slice interna de 60 cartas con las mismas reglas fundamentales. No se distribuye públicamente y no reemplaza el objetivo de 150 cartas para el MVP.

### Motivo

Permite observar y probar pronto el loop sin comprometer la ambición de variedad del producto ni saltar el gate de derechos de distribución pública.

### Trade-offs

La slice tendrá menor variedad y no validará completamente balance, colección ni contenido. Debe estar claramente marcada como prueba interna, no como lanzamiento.

### Qué invalidaría esta decisión

Que 60 cartas no alcance para ejecutar las protecciones y rasgos de forma representativa, que su comportamiento difiera demasiado del pool de 150 o que preparemos contenido duplicado inútilmente.

## DEC-102 — Vertical slice con gameplay completo, colección e imagen compartible

### Contexto

La vertical slice de 60 cartas debe decidir si prueba solo el núcleo de gameplay, si incluye además colección e imagen compartible o si simplifica eliminando scouting/reroll.

### Opciones consideradas

1. Gameplay completo; colección e imagen compartible fuera.
2. Gameplay completo más colección e imagen compartible.
3. Solo draft, posiciones y puntaje.

### Decisión

La vertical slice incluye posiciones, química, rasgos, scouting, reroll, puntaje, récord, reorganización, colección visual e imagen compartible de la squad.

### Motivo

Permite evaluar no solo si las decisiones son interesantes, sino si el resultado construido genera orgullo, apego y deseo de mostrarlo.

### Trade-offs

Mezcla señales del loop con presentación/retención y amplía el trabajo de la slice. La lectura de resultados deberá distinguir uso de colección/compartir de repetición voluntaria.

### Qué invalidaría esta decisión

Que la colección e imagen retrasen materialmente la prueba, que maquillen un loop débil o que no aporten ninguna señal de valor en las sesiones internas.

## DEC-103 — Piso de ocho cartas por rasgo en vertical slice

### Contexto

La vertical slice usa 60 cartas y conserva los seis rasgos. El piso de 18 del pool de 150 requeriría 108 cartas solo para rasgos, por lo que no cabe en la slice.

### Opciones consideradas

1. Ocho cartas por rasgo en la slice.
2. Aumentar la slice a 108+ cartas.
3. Mantener 18 con solo tres rasgos.

### Decisión

La vertical slice tiene un piso de ocho cartas por cada uno de los seis rasgos, para un mínimo de 48 de sus 60 cartas. El pool de 150 conserva su piso de 18.

### Motivo

Mantiene las seis builds y permite observar umbrales de tres y cinco sin retrasar una primera versión visible por la curaduría de más de cien cartas.

### Trade-offs

La distribución de rasgos de la slice será más homogénea que la del MVP y sus frecuencias no validan por completo el balance del pool de 150.

### Qué invalidaría esta decisión

Que los umbrales no aparezcan de forma suficiente, que ocho cartas distorsione las elecciones o que la slice necesite más contenido para representar posiciones y química.

## DEC-104 — Evaluación manual del propietario para la vertical slice

### Contexto

La vertical slice se prepara para que el propietario del producto la revise personalmente antes de organizar pruebas con otros jugadores. Los umbrales de finalización y repetición no son todavía evidencia aplicable a una cohorte.

### Opciones consideradas

1. Gate cuantitativo y cualitativo con jugadores externos.
2. Gate solo cuantitativo.
3. Revisión manual inicial del propietario con checklist explícito.

### Decisión

La primera evaluación de la vertical slice es manual y la realiza el propietario del producto. Las métricas de 55% de finalización y 40% de repetición quedan documentadas para una prueba posterior con jugadores, no como barrera artificial de esta revisión.

### Motivo

Permite inspeccionar pronto la experiencia, detectar incoherencias obvias y verificar que el producto representa la visión acordada antes de invertir en una prueba más amplia.

### Trade-offs

Una revisión individual no valida retención ni mercado. Puede confirmar alineación de diseño, no demostrar diversión generalizable.

### Qué invalidaría esta decisión

Que se interprete la satisfacción del propietario como evidencia de usuarios, que el checklist no detecte problemas claros o que se omita una prueba con jugadores antes de expandir el producto.

## DEC-105 — Contenido real con licencias asumidas y valores de juego propios

### Contexto

El producto depende de reconocer jugadores y combinaciones históricas. Se pidió dejar de tratar licencias como un bloqueo del proyecto y asegurar que nombres, imágenes, escudos y datos representen entidades reales.

### Opciones consideradas

1. Contenido ficticio o placeholders visuales.
2. Contenido real con licencias tratadas como gate interno de lanzamiento.
3. Contenido real bajo la premisa externa de que las licencias están cubiertas, manteniendo procedencia y calidad como obligaciones técnicas.

### Decisión

Se adopta la opción 3 y se considera cubierta la dimensión de licencias para diseñar e implementar. Cada carta usa nombre, imagen, escudo, nacionalidad, club, década y evidencia posicional reales. OVR, posiciones secundarias de gameplay y rasgo son valores editoriales propios, informados por historia y balance; no se copian de otros juegos.

Esta decisión reemplaza el gate operativo de derechos de DEC-016, pero conserva su dirección creativa de contenido oficial real.

### Motivo

El reconocimiento inmediato de futbolistas, clubes y épocas es parte central de la fantasía. Separar hechos verificables de valores editoriales permite conservar autenticidad sin fingir que existe un OVR universal ni clonar una base ajena.

### Trade-offs

La carga de curaduría aumenta: se necesita fuente por campo, revisión de versiones históricas, selección y normalización de activos. La premisa de licencias es responsabilidad externa del proyecto y no elimina problemas técnicos como enlaces rotos, baja calidad, hotlinking o imágenes de una etapa incorrecta.

### Qué invalidaría esta decisión

Que no se pueda construir un dataset históricamente consistente, que el contenido real retrase de forma desproporcionada la prueba del loop o que la premisa externa de licencias sea retirada por el propietario.

## DEC-106 — Carta anclada a temporada y una versión por futbolista en el MVP

### Contexto

“Datos reales” podía producir cartas incoherentes si club, imagen, posiciones y rendimiento provenían de etapas diferentes de una misma carrera. También debía aclararse si la restricción de una carta por futbolista era permanente.

### Opciones consideradas

1. Anclar cada carta a una temporada concreta.
2. Representar el promedio de toda la carrera.
3. Crear un “prime” compuesto sin temporada inequívoca.

### Decisión

Cada carta representa una versión histórica anclada a una temporada concreta. Sus datos, imagen, club, posiciones y valoración editorial se justifican respecto de esa etapa; la década usada por química se deriva de la temporada. En la vertical slice y el MVP existe una sola versión por futbolista. El modelo de contenido permitirá incorporar varias versiones del mismo futbolista en expansiones futuras.

### Motivo

Evita mezclar etapas incompatibles y hace auditable cada carta. Mantener una versión por futbolista inicialmente maximiza variedad de nombres y reduce curaduría; permitir más versiones futuras conserva espacio para contenido como distintas etapas de Messi o Maradona.

### Trade-offs

Elegir una sola temporada obliga a dejar afuera otras versiones igualmente icónicas y vuelve más sensible la selección inicial. Cuando existan múltiples versiones futuras habrá que definir si pueden aparecer juntas o repetirse dentro de una misma run; esa regla no se necesita para el MVP.

### Qué invalidaría esta decisión

Que una temporada no alcance para representar de forma reconocible al futbolista, que la audiencia prefiera cartas de carrera completa o que múltiples versiones se vuelvan necesarias antes de validar el catálogo inicial.

## DEC-107 — OVR basado en dominio contextual de la temporada

### Contexto

Las versiones históricas enfrentan futbolistas de décadas, posiciones y condiciones competitivas diferentes. Las estadísticas brutas no son directamente comparables y una simulación de cómo rendirían con entrenamiento moderno sería especulativa.

### Opciones consideradas

1. Usar estadísticas brutas de la temporada.
2. Valorar el nivel y dominio demostrado dentro del contexto histórico y convertirlo a una escala común.
3. Estimar rendimiento hipotético bajo condiciones contemporáneas.

### Decisión

El OVR mide el nivel y dominio demostrado por la versión durante su temporada de referencia respecto de su contexto histórico, convertido mediante una rúbrica editorial común a la escala 1–100 del juego.

### Motivo

Permite que versiones icónicas de épocas distintas compitan en una misma escala sin favorecer automáticamente a atacantes modernos por disponibilidad de métricas ni inventar escenarios contrafácticos.

### Trade-offs

Sigue existiendo juicio editorial y desacuerdo legítimo. La rúbrica deberá documentar evidencia, tratar posiciones con criterios equivalentes y separar prestigio de carrera del rendimiento de esa temporada específica.

### Qué invalidaría esta decisión

Que la rúbrica no produzca consistencia entre curadores, que sesgue sistemáticamente épocas o posiciones, o que las pruebas muestren que la audiencia no entiende qué representa el OVR.

## DEC-108 — Marcadores de química siempre visibles en la carta

### Contexto

Se aceptó separar una carta jugable compacta de una ficha histórica expandible, pero la propuesta inicial relegaba nacionalidad y otros contextos al detalle. Eso contradice su función: nacionalidad, club y década determinan química y pueden cambiar una elección.

### Opciones consideradas

1. Ocultar todos los contextos en la ficha expandible.
2. Mostrar nacionalidad, club y década directamente como marcadores compactos; expandir datos secundarios.
3. Mostrar permanentemente toda la ficha histórica y estadística.

### Decisión

Cada opción de draft muestra directamente foto, nombre, escudo/club, temporada, OVR, posición primaria y rasgo. Nacionalidad, club y década son marcadores compactos de química siempre visibles. La ficha expandible contiene posiciones secundarias y dos o tres hitos reales de la temporada; las estadísticas de respaldo permanecen fuera de la carta base.

Esta decisión refina DEC-083: los contextos que afectan química dejan de estar ocultos en el detalle expandible.

### Motivo

El jugador debe comparar química sin realizar acciones adicionales en cada carta. La separación conserva profundidad histórica sin convertir tres o cinco opciones móviles en fichas estadísticas ilegibles.

### Trade-offs

La carta base contiene más señales visuales y necesitará jerarquía estricta, especialmente en rolls de cinco opciones. Los hitos no pueden introducir ventajas mecánicas ocultas ni sustituir marcadores de química.

### Qué invalidaría esta decisión

Que los marcadores vuelvan ilegible la oferta en pantallas pequeñas, que los jugadores no los utilicen o que la ficha expandible sea necesaria constantemente para decidir.

## DEC-109 — Catálogo curado como ecosistema jugable

### Contexto

Elegir las versiones solo por fama u OVR tendería a concentrar atacantes y producir grupos accidentales de química, dejando posiciones difíciles con contenido de relleno.

### Opciones consideradas

1. Elegir los 60 nombres más famosos y corregir desequilibrios después.
2. Asegurar estructura jugable y maximizar reconocimiento dentro de ella.
3. Distribuir el catálogo de forma uniforme sin priorizar fama.

### Decisión

La vertical slice se cura como un ecosistema: primero asegura cobertura posicional, presencia de los seis rasgos y grupos utilizables de nacionalidad, club y década; dentro de esas restricciones elige las versiones más reconocibles y relevantes posibles. Se incorpora un énfasis moderado en Argentina, pendiente de cuantificación.

### Motivo

La fama aporta fantasía, pero solo produce decisiones si las cartas alimentan posiciones y combinaciones reales. El método evita que los futbolistas menos famosos existan únicamente como relleno estructural.

### Trade-offs

Algunos nombres muy famosos pueden quedar fuera de la slice y la selección no equivale a un ranking histórico. Las cuotas deben orientar la curaduría, no volver cada grupo artificialmente simétrico.

### Qué invalidaría esta decisión

Que las restricciones eliminen demasiadas figuras reconocibles, que los grupos vuelvan predecibles todas las runs o que la audiencia perciba el pool como arbitrario.

## DEC-110 — Diez versiones argentinas en la vertical slice

### Contexto

El énfasis argentino acordado necesitaba una magnitud concreta para guiar selección, química y cobertura posicional sin absorber el catálogo.

### Opciones consideradas

Se evaluó una presencia meramente proporcional, una cuota moderada identificable y una representación dominante.

### Decisión

Diez de las 60 versiones históricas de la vertical slice corresponden a futbolistas argentinos. Deben distribuirse entre arquero, defensa, mediocampo y ataque, y abarcar varias décadas.

### Motivo

Un 16,7% del catálogo genera una identidad argentina reconocible y oportunidades frecuentes de química, sin determinar por sí solo la composición de todas las runs.

### Trade-offs

Argentina estará sobrerrepresentada respecto de un reparto mundial uniforme. La cuota reduce plazas disponibles para otras nacionalidades y deberá evitar concentrarse en los nombres ofensivos más obvios.

### Qué invalidaría esta decisión

Que Argentina domine de forma repetitiva las mejores builds, que la cuota impida representar otros grupos reconocibles o que su distribución posicional resulte artificial.

## DEC-111 — OVR mediante bandas editoriales y cartas ancla

### Contexto

Convertir automáticamente goles, asistencias, títulos o premios en OVR crearía una precisión ficticia y sesgos graves contra posiciones defensivas y épocas con menor cobertura estadística.

### Opciones consideradas

1. Fórmula automática basada en estadísticas y logros.
2. Valoración libre carta por carta.
3. Rúbrica por bandas de nivel histórico y comparación con cartas ancla.

### Decisión

Cada versión se asigna primero a una banda editorial de nivel histórico y luego recibe un OVR exacto mediante comparación con cartas ancla de posición, época o nivel comparables. Las estadísticas, premios, títulos, continuidad y consenso histórico son evidencia de curaduría, no una fórmula automática. Las bandas permanecen internas y no crean rarezas visibles.

### Motivo

Hace explícito el juicio editorial, reduce inconsistencias y permite comparar arqueros, defensores, mediocampistas y atacantes sin fingir que sus métricas son equivalentes.

### Trade-offs

Requiere revisión humana y documentación de anclas. Dos curadores todavía pueden discrepar, por lo que cada valoración deberá conservar una breve justificación y pasar una revisión transversal de posiciones y épocas.

### Qué invalidaría esta decisión

Que las bandas no mejoren consistencia, que las anclas perpetúen sesgos o que la curaduría resulte demasiado lenta para producir y mantener el catálogo.

## DEC-112 — Escala OVR estable respecto del universo histórico elegible

### Contexto

Se propuso usar una parte mayor de la escala 1–100 y considerar que un 70 es uno de los futbolistas menos fuertes dentro de un catálogo de estrellas. Faltaba evitar que ese valor cambiara cada vez que el pool creciera.

### Opciones consideradas

1. OVR relativo a las 60 cartas de la slice.
2. OVR relativo a cada pool activo, recalculado en expansiones.
3. OVR estable respecto del universo histórico de versiones elegibles del producto.

### Decisión

El OVR se referencia al universo histórico completo que el producto considera elegible, no al pool activo. Un 70 representa una versión del extremo menos fuerte de ese universo de estrellas, no un mal futbolista profesional. El paso de 60 a 150 cartas no obliga a recalcular valoraciones existentes.

### Motivo

Permite usar una franja más amplia de la escala sin perder estabilidad, conserva comparabilidad entre temporadas del producto y evita inflación o rebases automáticos del catálogo.

### Trade-offs

El significado del número depende de explicar que la población de referencia ya está filtrada por relevancia histórica. La entrada de una versión excepcional puede requerir calibración puntual, pero no debe provocar una redistribución completa.

### Qué invalidaría esta decisión

Que el universo elegible no pueda definirse con consistencia, que las expansiones acumulen inflación o que los jugadores interpreten sistemáticamente un 70 como un futbolista mediocre fuera del contexto del juego.

## DEC-113 — Bandas iniciales de OVR entre 70 y 100

### Contexto

La primera propuesta concentraba las cartas entre 84 y 99. Se decidió aprovechar una franja mayor de la escala porque un valor bajo representa el extremo menos fuerte de un catálogo ya filtrado por relevancia histórica.

### Opciones consideradas

Se compararon una franja estrecha de 84–99, una franja amplia de 70–100 y el uso relativo de toda la escala según cada pool.

### Decisión

La curaduría inicial usa cinco bandas internas: 96–100 cumbre histórica; 90–95 temporada generacional; 84–89 élite mundial; 77–83 élite internacional; 70–76 figura destacada del universo elegible. El jugador ve el OVR, no el nombre de la banda. Más de una versión puede recibir 100 si alcanza el estándar de cumbre histórica.

### Motivo

Amplía espacio de diferenciación sin llamar “malos” a futbolistas del catálogo y conserva mayor resolución para temporadas verdaderamente excepcionales.

### Trade-offs

Una amplitud de treinta puntos puede aumentar elecciones obvias si la distribución de ofertas o los bonos no generan compensaciones suficientes. Debe medirse la frecuencia de cartas bajas elegidas y calibrarse junto con química, posición, rasgos y escasez por OVR.

### Qué invalidaría esta decisión

Que los OVR bajos funcionen como relleno, que las bandas produzcan saltos arbitrarios o que los valores 96–100 se inflen hasta perder significado.

## DEC-114 — Imagen con camiseta correspondiente a la versión

### Contexto

Una foto icónica puede pertenecer a la selección, otro club o una temporada diferente de la versión representada. Usarla junto a otro escudo produciría una identidad visual e histórica contradictoria.

### Opciones consideradas

1. Priorizar siempre la imagen más icónica del futbolista.
2. Exigir que camiseta, club y período de la imagen correspondan a la versión.
3. Permitir imágenes de selección dentro de cartas de club.

### Decisión

La imagen del MVP muestra al futbolista con la camiseta del club correspondiente a su temporada de referencia. No se reemplaza por una foto de selección, de otro club o de otra etapa. Una futura versión de selección será un tipo de versión propio y requerirá reglas explícitas.

### Motivo

Mantiene coherencia inmediata entre imagen, escudo, temporada y marcador de química de club, y hace auditable la procedencia histórica de la carta.

### Trade-offs

Puede obligar a descartar una foto culturalmente más famosa o aceptar una imagen menos espectacular. La búsqueda y verificación de activos será más exigente.

### Qué invalidaría esta decisión

Que no existan imágenes utilizables de la temporada correcta, que la audiencia valore mucho más la foto icónica que la coherencia o que el producto incorpore formalmente versiones de selección.

## DEC-115 — Mérito histórico primero al elegir la temporada

### Contexto

Un futbolista puede tener varias temporadas coherentes con una carta. Elegir una versión solo para completar química de club o década podría producir una carta menos mítica y manipular la historia al servicio del balance.

### Opciones consideradas

1. Elegir siempre la mejor temporada estadística.
2. Priorizar nivel demostrado y reconocimiento histórico; usar necesidades del catálogo como desempate.
3. Elegir la temporada que mejor complete química, aunque sea inferior.

### Decisión

La temporada de referencia se elige principalmente por nivel demostrado y reconocimiento histórico. El equilibrio de química del catálogo solo funciona como desempate entre temporadas que sostienen un mérito comparable.

### Motivo

Cada versión debe resultar mítica por sí misma antes de cumplir una función sistémica. Esto evita que el dataset parezca construido artificialmente para cerrar combinaciones.

### Trade-offs

Puede concentrar clubes o décadas populares y obligar a buscar otros futbolistas para cubrir huecos de química. “Reconocimiento histórico” requerirá una justificación breve y revisión editorial.

### Qué invalidaría esta decisión

Que el criterio produzca un catálogo estructuralmente injugable, que las temporadas elegidas sean poco reconocibles para el público objetivo o que el desempate no alcance para equilibrar contenido.

## DEC-116 — Seis nacionalidades concentradas en la vertical slice

### Contexto

Se pidió evitar una dispersión temprana en muchas nacionalidades y aumentar Argentina de diez a quince versiones. La distribución debía sumar 60 sin dejar cartas aisladas cuya nacionalidad casi nunca pudiera generar química.

### Opciones consideradas

Se compararon muchas nacionalidades pequeñas, cinco grupos casi iguales y seis grupos con una identidad argentina fuerte.

### Decisión

La vertical slice usa seis nacionalidades. Argentina aporta 15 versiones; cuatro nacionalidades aportan 10 cada una y la sexta aporta 5, completando 60. Todos los grupos deben cubrir varias líneas y permitir conexiones reales. Esta concentración no limita la diversidad del pool posterior de 150.

### Motivo

Produce grupos de química legibles y repetibles durante la primera validación, reduce contenido aislado y da al producto una identidad argentina deliberada.

### Trade-offs

Una de cada cuatro cartas será argentina y muchas figuras globales quedarán fuera de la slice por nacionalidad. Los grupos grandes pueden hacer que la química por país sea demasiado automática y deberán medirse contra club y década.

### Qué invalidaría esta decisión

Que las runs converjan siempre en nacionalidades dominantes, que la ausencia de países icónicos reduzca demasiado la fantasía o que seis grupos resulten insuficientes para variar el draft.

## DEC-117 — Argentina, Brasil, Italia, Francia, España y Portugal en la slice

### Contexto

Después de concentrar la vertical slice en seis nacionalidades, había que elegir cuáles maximizaban reconocimiento, cobertura posicional y grupos de club dentro del público objetivo.

### Opciones consideradas

Se evaluaron combinaciones latinoeuropeas y globales, aceptando que varios países históricos quedarían fuera temporalmente.

### Decisión

La distribución es: Argentina 15, Brasil 10, Italia 10, Francia 10, España 10 y Portugal 5.

### Motivo

El conjunto reúne figuras inmediatamente reconocibles de distintas épocas, permite cubrir todas las líneas y conecta naturalmente clubes históricos compartidos entre nacionalidades.

### Trade-offs

Alemania, Países Bajos, Uruguay, Inglaterra y otras selecciones quedan fuera de la slice, junto con varias figuras esenciales de la historia global. Debe comunicarse como alcance inicial de contenido, no como juicio histórico.

### Qué invalidaría esta decisión

Que alguno de los seis grupos no pueda cubrir varias líneas con versiones reconocibles, que la química se vuelva repetitiva o que las ausencias reduzcan demasiado el valor de la primera prueba.

## DEC-118 — Roll temático de país y ciclo mundial en el modo principal

### Contexto

Las ofertas independientes daban variedad carta a carta, pero diluían la identidad de selecciones y épocas. Se propuso que el roll construya primero un contexto reconocible y luego ofrezca futbolistas compatibles.

### Opciones consideradas

1. Mantener extracciones independientes como modo principal.
2. Usar `país → década → oferta compatible` como modo principal.
3. Conservar el roll temático únicamente como modo posterior.

### Decisión

El modo principal de la vertical slice usa rolls temáticos. Cada roll determina primero un país y después una década; todas las opciones de la oferta tienen esa nacionalidad y era. El club no condiciona el roll ni impone cuotas al curar el catálogo, pero permanece como dato real, marcador visible y fuente de química.

Esta decisión reemplaza para el MVP la extracción independiente de DEC-087. H016 queda como alternativa supersedida y H017 como la hipótesis que debe validar el nuevo modo principal.

### Motivo

El encadenamiento país–década crea anticipación, una identidad futbolística clara y ofertas que cuentan una pequeña historia antes de revelar los jugadores.

### Trade-offs

Dos fuentes de química son constantes dentro de cada oferta, por lo que club, OVR, posición y rasgo cargan con la diferenciación entre opciones. El dataset necesita suficientes versiones por celda país–década y la generación debe compatibilizar contexto, no repetición, rolls de cinco y protección posicional. La agencia del jugador, el comportamiento del reroll y la selección de celdas siguen abiertos.

### Qué invalidaría esta decisión

Que el contexto determine demasiado la squad, que las opciones se vuelvan obvias, que el catálogo de 60 no sostenga once ofertas variadas o que adaptar protecciones requiera romper frecuentemente la promesa de país y década.

## DEC-119 — RNG determina país y ciclo mundial

### Contexto

El roll temático debía definir si el jugador elegía el país/el ciclo mundial, si los recibía de forma aleatoria o si intervenía mediante una selección híbrida. Esta elección determina cuánto de la química viene de la situación y cuánto de la planificación.

### Opciones consideradas

1. El jugador elige libremente país y ciclo mundial.
2. El RNG determina ambos parámetros.
3. El RNG propone alternativas y el jugador elige una.

### Decisión

El RNG determina el país y el ciclo mundial de cada roll. El jugador conserva agencia al evaluar la oferta, escoger una carta y plaza, y decidir si usa scouting o reroll.

### Motivo

Aplica el principio central: la suerte crea una situación temática y la habilidad decide cómo responder. Evita que el jugador fuerce siempre el mismo país o ciclo desde el primer pick.

### Trade-offs

La secuencia de contextos puede favorecer o dificultar una build de química antes de que el jugador vea las cartas. Reroll, scouting y protección posicional deben ofrecer contrajuego sin convertir el contexto en una elección encubierta.

### Qué invalidaría esta decisión

Que el jugador sienta que la run se decidió por contextos inevitables, que las mejores estrategias ignoren la oferta o que la falta de control reduzca la intención de volver a jugar.

## DEC-120 — Contexto país–ciclo no repetido por run

### Contexto

Una oferta normal necesita tres cartas y una especial cinco dentro de la misma celda país–ciclo. Repetir una celda con cartas no repetibles exigiría seis o más versiones y concentraría demasiado las runs.

### Opciones consideradas

1. Permitir repetir libremente un contexto exacto.
2. Prohibir el contexto exacto, pero permitir reutilizar país o ciclo en otra combinación.
3. Prohibir repetir tanto país como ciclo durante toda la run.

### Decisión

Una pareja exacta país–ciclo queda agotada después de resolverse con una elección y no vuelve en la misma run. El país puede volver con otro ciclo, y el ciclo con otro país. Las ofertas normales requieren tres versiones inéditas de la celda; las especiales, cinco. Un reroll contextual no inicia otro contexto.

### Motivo

Mantiene variedad temática, respeta la regla de no repetir cartas y hace viable construir suficientes contextos con capacidad real para rerolls.

### Trade-offs

Un jugador no puede insistir en la misma selección y ciclo dentro de una run. El generador necesita reservar contextos suficientes para cada run.

### Qué invalidaría esta decisión

Que las combinaciones restantes no alcancen para once picks, que la prohibición reduzca demasiado la fantasía de construir una selección de época o que la variedad de contextos no se traduzca en variedad de decisiones.

## DEC-121 — Ciclo mundial de cuatro Copas como contexto temporal

### Contexto

La década generaba celdas demasiado pequeñas para sostener ofertas temáticas y rerolls con el mismo país. Se propuso ampliar el período a dieciséis años, entendido como un ciclo de cuatro Mundiales consecutivos.

### Opciones consideradas

1. Mantener décadas como contexto temporal.
2. Usar períodos calendarios arbitrarios más largos.
3. Usar ciclos fijos de dieciséis años que agrupan cuatro Copas del Mundo consecutivas.

### Decisión

La fuente temporal de química y del roll deja de ser la década. Cada versión pertenece a un ciclo mundial de dieciséis años que agrupa cuatro Mundiales consecutivos; el contexto principal pasa a ser `país → ciclo mundial → oferta`. Los límites concretos de los ciclos se fijarán antes de curar el dataset.

Esta decisión refina DEC-118 y reemplaza el uso de décadas en el modo principal.

### Motivo

Un ciclo mundial reúne suficientes figuras de un mismo país para ofrecer más decisiones y permite que el período se lea como una generación futbolística reconocible, no solo como una división arbitraria de calendario.

### Trade-offs

Las conexiones temporales serán más frecuentes y menos precisas que con décadas. La definición de bordes debe ser única y estable para no clasificar temporadas de modo ambiguo. El pool de 60 queda insuficiente para sostener el nuevo comportamiento y debe ampliarse antes de implementación.

### Qué invalidaría esta decisión

Que los ciclos sigan produciendo celdas insuficientes, que se vuelvan tan amplios que la época pierda significado o que el jugador no perciba una diferencia temática frente a una década.

## DEC-122 — Reroll contextual con candidatos no vistos

### Contexto

El reroll que generaba un país/ciclo nuevo permitía escapar de la situación creada por el RNG. Se prefirió ampliar el pool para que el recurso pudiera mejorar la oferta sin abandonar su identidad temática.

### Opciones consideradas

1. Reroll hacia un contexto nuevo.
2. Reroll contextual con candidatos no vistos del mismo país/ciclo.
3. Eliminar el reroll del modo temático.

### Decisión

El reroll conserva el país y ciclo mundial de la oferta activa y muestra una nueva oferta de candidatos no vistos de esa misma celda. No cuenta como un roll de contexto adicional. Una celda normal requiere al menos seis cartas para soportar un reroll; una celda que pueda alojar oferta especial y reroll requiere diez.

### Motivo

Hace que el recurso sea una respuesta táctica a una mala oferta dentro de una situación temática, en vez de un botón para buscar otro país o época. Mantiene el principio de que el RNG crea la situación.

### Trade-offs

El pool debe crecer y distribuirse con capacidad real por celda. Una oferta pobre dentro de un país/ciclo que no interesa seguirá siendo parcialmente una situación adversa, por lo que deben validarse percepción de agencia y protección posicional.

### Qué invalidaría esta decisión

Que el tamaño de pool necesario sea desproporcionado, que los jugadores consideren inútil el reroll contextual o que se convierta en una elección automática cada vez que no aparece una carta de OVR alto.

## DEC-123 — Cuatro ciclos mundiales iniciales fijos

### Contexto

Un ciclo mundial de cuatro Copas necesitaba límites de calendario únicos para clasificar todas las temporadas y permitir celdas país–ciclo auditables.

### Opciones consideradas

Se consideraron bandas por década, ciclos con límites móviles y cuatro bandas fijas de dieciséis años ancladas a Mundiales.

### Decisión

El pool inicial usa los ciclos 1962–1977 (Mundiales 1962, 1966, 1970, 1974), 1978–1993 (1978, 1982, 1986, 1990), 1994–2009 (1994, 1998, 2002, 2006) y 2010–2025 (2010, 2014, 2018, 2022). Cada temporada se asigna a uno solo.

### Motivo

Incluye generaciones desde Pelé y Eusébio hasta Messi, Cristiano y Mbappé; también produce segmentos temporales estables, legibles y adecuados para el roll temático.

### Trade-offs

Versiones previas a 1962 quedan fuera del pool inicial y los bordes pueden separar temporadas cercanas en ciclos distintos. El catálogo posterior deberá agregar ciclos anteriores o futuros como expansión explícita.

### Qué invalidaría esta decisión

Que los cuatro ciclos no alcancen para cobertura posicional/contextual, que los bordes generen demasiadas clasificaciones contraintuitivas o que el pool requiera figuras anteriores a 1962 para cumplir su fantasía.

## DEC-124 — Pool inicial de 150 cartas para el draft temático

### Contexto

El pool de 60 no puede sostener ofertas por país–ciclo, rerolls contextuales y dos ofertas especiales sin agotar demasiadas celdas. El MVP ya contemplaba 150 como objetivo de producción.

### Opciones consideradas

1. Mantener 60 cartas y simplificar o eliminar el reroll contextual.
2. Usar 150 cartas con distribución suficiente por país–ciclo.
3. Ampliar por encima de 150 antes de validar el loop.

### Decisión

El pool inicial contiene 150 cartas históricas reales. Su distribución nacional es Argentina 36; Brasil, Italia, Francia y España 24 cada uno; Portugal 18. Reemplaza definitivamente la slice de 60 como alcance de contenido para el modo temático.

### Motivo

Recupera el objetivo de contenido original y proporciona profundidad para que país–ciclo, rerolls, rolls especiales y variedad de runs coexistan sin degradar la regla de no repetición de cartas.

### Trade-offs

Multiplica el costo de curaduría, imágenes, verificación y balance antes de una primera prueba interactiva. A cambio, evita validar una versión cuyo generador sería materialmente distinto del producto propuesto.

### Qué invalidaría esta decisión

Que 150 siga siendo insuficiente al distribuir celdas y posiciones, que el tiempo de curaduría bloquee por completo la prueba o que las pruebas demuestren que una muestra menor reproduce fielmente el comportamiento del modo temático.

## DEC-125 — Protección posicional contextual

### Contexto

La garantía de tres oportunidades por necesidad posicional seguía siendo obligatoria, pero una inyección libre de cartas rompería la promesa de que todas las opciones comparten país y ciclo mundial.

### Opciones consideradas

1. Eliminar o debilitar la protección posicional en el modo temático.
2. Insertar una carta de otra nacionalidad/ciclo cuando falte una posición.
3. Guiar el RNG hacia una celda país–ciclo compatible e incluir allí un candidato de posición primaria.

### Decisión

Cuando una posición pendiente requiere una oportunidad garantizada, el RNG selecciona entre celdas país–ciclo con al menos un candidato inédito de posición primaria y la oferta incluye ese candidato. La oferta entera sigue respetando un único contexto. Se conservan las tres oportunidades en rolls distintos hasta cubrir la categoría y la prioridad final para POR, LD y LI.

### Motivo

Conserva el tema de cada roll y evita que una mala secuencia de contextos convierta una run en una derrota inevitable por falta de posiciones.

### Trade-offs

El RNG ya no es uniforme entre todas las celdas y el catálogo debe distribuir posiciones con cuidado. Si la guía se vuelve demasiado frecuente, el jugador puede percibir que las situaciones están guionizadas.

### Qué invalidaría esta decisión

Que no existan celdas compatibles al vencer una garantía, que la protección vuelva las ofertas obvias o que la identidad país–ciclo no compense el control oculto necesario.

## DEC-126 — Matriz fija de celdas país–ciclo para 150 cartas

### Contexto

El pool de 150 debía soportar once contextos no repetidos por run, un reroll contextual y dos ofertas especiales de cinco cartas. Las cuotas nacionales no bastaban: había que decidir qué países existen en cada ciclo y qué capacidad tiene cada celda.

### Opciones consideradas

1. Repartir las 150 cartas de manera uniforme entre todas las combinaciones país–ciclo.
2. Concentrar cada país en sus períodos históricamente más ricos, manteniendo seis cartas como mínimo en toda celda activa y diez para celdas especiales.
3. Ampliar el pool antes de fijar capacidad por celda.

### Decisión

Se adopta la siguiente matriz, en el orden 1962–1977 / 1978–1993 / 1994–2009 / 2010–2025:

| País | 1962–1977 | 1978–1993 | 1994–2009 | 2010–2025 | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| Argentina | 8 | 10 | 10 | 8 | 36 |
| Brasil | 6 | 6 | 6 | 6 | 24 |
| Italia | 6 | 8 | 10 | 0 | 24 |
| Francia | 0 | 6 | 8 | 10 | 24 |
| España | 6 | 0 | 8 | 10 | 24 |
| Portugal | 6 | 6 | 6 | 0 | 18 |

Una celda activa de seis u ocho cartas sostiene una oferta normal de tres y su reroll contextual. Las cinco celdas de diez —Argentina 1978–1993, Argentina 1994–2009, Italia 1994–2009, Francia 2010–2025 y España 2010–2025— son las únicas elegibles para los dos rolls especiales y sus rerolls.

### Motivo

Mantiene países y generaciones reconocibles sin inflar el catálogo. Argentina conserva presencia fuerte en los cuatro ciclos; Brasil también cubre los cuatro, y Portugal conserva tres generaciones diferenciadas. La capacidad de las celdas coincide con el comportamiento real del generador, en lugar de asumir que una cuota nacional total garantiza ofertas viables.

### Trade-offs

Los rolls especiales no son uniformes entre países ni ciclos: provienen de cinco contextos densos. Algunas combinaciones históricas quedan deliberadamente fuera. Esta matriz aún debe satisfacer la cobertura posicional y de rasgos durante la curaduría.

### Qué invalidaría esta decisión

Que las cinco celdas especiales sesguen de forma perceptible las runs, que la protección posicional no encuentre celdas compatibles con suficiente frecuencia o que los 150 lugares no alcancen para posiciones y rasgos sin incluir cartas de poco interés.

## DEC-127 — Cuotas exactas de posiciones primarias

### Contexto

El pool debe permitir cubrir la 4-3-3 y activar la protección posicional, pero una regla aproximada por demanda no bastaba para empezar la curaduría ni para detectar desequilibrios del catálogo.

### Opciones consideradas

1. Dejar la frecuencia de posiciones a la disponibilidad histórica de figuras.
2. Asignar una cuota exacta proporcional a las plazas de la formación.
3. Sobrerrepresentar atacantes para maximizar reconocimiento inmediato.

### Decisión

Las 150 cartas se distribuyen en 14 POR, 14 LD, 27 DFC, 14 LI, 41 MC, 13 ED, 13 DC y 14 EI como posiciones primarias. Las posiciones secundarias no alteran estas cuotas.

### Motivo

Replica la demanda estructural de la 4-3-3, protege a las posiciones difíciles de cubrir y deja que los mediocampistas ocupen su peso natural de tres plazas sin depender de cartas fuera de posición.

### Trade-offs

La lista no será una simple selección de los 150 nombres más famosos: habrá que curar laterales, arqueros y defensores con el mismo rigor. La distribución por celda país–ciclo aún debe respetar estas cuotas globales.

### Qué invalidaría esta decisión

Que la simulación del generador muestre escasez de una posición pese a las cuotas, que la protección seleccione siempre las mismas celdas o que la curaduría histórica no alcance una categoría sin diluir el estándar de reconocimiento.

## DEC-128 — Curva editorial de OVR para el catálogo inicial

### Contexto

Al usar únicamente figuras históricas reconocibles, existía riesgo de concentrar artificialmente el catálogo por encima de 90 OVR y hacer que la fama sustituyera los trade-offs de draft. Hacía falta una distribución objetivo antes de asignar valores individuales.

### Opciones consideradas

1. Valorar cada carta sin una curva global y aceptar la distribución resultante.
2. Usar una curva concentrada en OVR altos porque el catálogo contiene estrellas.
3. Fijar una curva editorial descendente por bandas, manteniendo 70 como extremo inferior de un universo de figuras.

### Decisión

Las 150 cartas se reparten en seis valores de 96–100, dieciocho de 90–95, cuarenta y dos de 84–89, cincuenta y cuatro de 77–83 y treinta de 70–76. La curva no determina el valor exacto de ninguna carta ni sus probabilidades de oferta.

### Motivo

Preserva el prestigio del catálogo y, a la vez, deja espacio para que posición, química y rasgo compitan con el OVR. Mantiene pocas cumbres históricas realmente excepcionales sin describir como malos a los valores 70–76.

### Trade-offs

La clasificación individual requerirá discusión editorial y cartas ancla para no parecer arbitraria, especialmente entre épocas y posiciones. La curva puede limitar la inclusión de una figura popular si su temporada elegida no justifica desplazar otra.

### Qué invalidaría esta decisión

Que las pruebas muestren ofertas sin trade-offs por falta de dispersión, que las cumbres sean demasiado frecuentes o demasiado raras para la fantasía, o que el equipo editorial no pueda justificar con consistencia las fronteras entre bandas.

## DEC-129 — Política de procedencia para datos y activos reales

### Contexto

El catálogo usa identidades, temporadas, clubes, escudos e imágenes reales. Incluso bajo la premisa de que las licencias están cubiertas, los datos pueden ser inconsistentes y los activos pueden corresponder a una etapa errónea. Se necesitaba una política de curaduría trazable antes de producir las cartas.

### Opciones consideradas

1. Confiar en una única fuente pública para todos los campos.
2. Usar fuentes oficiales solo y descartar todo activo no publicado por un club o competición.
3. Usar un índice público para curar, fuentes oficiales para resolver ambigüedades y registrar procedencia por carta.

### Decisión

Wikidata/Wikipedia se usan para descubrir y contrastar datos. Cuando exista una ambigüedad relevante, se verifica en páginas oficiales de clubes, FIFA o UEFA. Para imágenes se comparan Commons, archivos oficiales de clubes, FIFA y UEFA, y se elige la mejor candidata válida por calidad visual e identidad de versión. Cada carta registra fuente, URL, proveedor, fecha y licencia o condición visible para hechos y activo visual. El original se descarga íntegro, sin transformar, y sirve localmente; nunca depende de un hotlink. OVR, rasgo y posiciones secundarias se conservan como valores editoriales propios.

### Motivo

Combina velocidad de curaduría con una vía de verificación más fuerte para errores que sí cambian la identidad de la carta. Mantiene un dataset auditable y separa la evidencia histórica de las decisiones de balance.

### Trade-offs

Requiere trabajo manual por carta y no elimina todos los desacuerdos históricos. Las fuentes oficiales pueden no ofrecer el encuadre fotográfico adecuado, por lo que la correspondencia visual se revisa explícitamente.

### Qué invalidaría esta decisión

Que las fuentes seleccionadas no cubran suficientes cartas o imágenes, que la verificación manual sea inasumible, o que aparezcan inconsistencias repetidas que requieran una fuente canónica adicional.

## DEC-130 — Criterio de selección: reconocimiento bajo restricciones jugables

### Contexto

El catálogo necesita laterales, defensores y cartas de distintas bandas OVR, pero su fantasía depende de ver cruces históricos reconocibles. Una selección puramente estadística podía perder identidad; una lista guiada solo por fama podía degradar la calidad deportiva de las temporadas.

### Opciones consideradas

1. Elegir únicamente por rendimiento histórico medible.
2. Elegir únicamente por reconocimiento popular.
3. Cumplir primero las restricciones jugables y, entre candidatos históricos válidos, priorizar reconocimiento e identidad mítica.

### Decisión

La curaduría cubre primero país–ciclo, posición, curva OVR y rasgos. Entre candidatos que satisfacen esas reglas se priorizan reconocimiento e identidad mítica por encima de una selección exclusivamente estadística. Toda versión elegida conserva un estándar suficiente de mérito y reconocimiento histórico en su temporada concreta.

### Motivo

Protege la magia de combinar nombres que el jugador reconoce sin convertir el catálogo en un listado de celebridades desconectado del rendimiento que el OVR representa.

### Trade-offs

Algunas elecciones discutibles por rendimiento bruto se resolverán a favor de una figura más reconocible, siempre que la banda OVR y la temporada sigan siendo defendibles. La lista requiere una justificación breve para casos límite.

### Qué invalidaría esta decisión

Que participantes no reconozcan una parte relevante del catálogo, que las cartas populares sean sistemáticamente sobrevaloradas, o que las cuotas obliguen a incluir nombres sin suficiente calidad histórica.

## DEC-131 — Curaduría en dos pasadas

### Contexto

La identidad histórica de una carta y su balance jugable son tareas distintas. Asignar OVR, rasgo, secundarias e imágenes antes de validar jugador, club y temporada puede duplicar trabajo y esconder errores de curaduría detrás de datos de gameplay.

### Opciones consideradas

1. Completar cada carta de punta a punta antes de pasar a la siguiente.
2. Curar primero las 150 identidades históricas y después aplicar el balance editorial y visual.
3. Usar una lista de nombres sin temporada antes de cualquier verificación.

### Decisión

La primera pasada produce una lista revisable de 150 versiones con jugador, temporada, club, país, ciclo, posición primaria y fuente. Solo después de revisar esa identidad se asignan OVR exacto, rasgo, secundarias e imagen final.

### Motivo

Reduce retrabajo, permite discutir el contenido que el jugador realmente reconocerá y separa hechos verificables de decisiones editoriales.

### Trade-offs

La primera lista no será aún jugable ni visualmente final. Requiere disciplina para no anticipar valoraciones cuando una identidad todavía puede cambiar.

### Qué invalidaría esta decisión

Que la segunda pasada revele que muchas identidades correctas no pueden balancearse dentro de las cuotas, o que el proceso en dos etapas resulte más lento que una curaduría integral sin mejorar la revisión.

## DEC-132 — Cobertura de posiciones entre contextos

### Contexto

Las cuotas globales de posiciones no garantizan que la protección contextual encuentre ofertas distintas durante una run: catorce arqueros concentrados en pocas celdas producirían el total correcto pero un generador frágil.

### Opciones consideradas

1. Controlar solo el total global por posición.
2. Exigir que todas las posiciones aparezcan en las veinte celdas activas.
3. Fijar mínimos realistas de contextos por posición según su cuota y criticidad.

### Decisión

Cada primaria debe aparecer, como mínimo, en 12 contextos para POR, LD, LI y EI; 16 para DFC; 20 para MC; y 11 para ED y DC. Una celda cuenta una sola vez aunque tenga varias cartas de la posición.

### Motivo

Distribuye las alternativas para la protección sin exigir que cada contexto contenga artificialmente todas las posiciones. Da cobertura adicional a arquero y laterales, que pueden bloquear una formación si faltan.

### Trade-offs

Restringe la curaduría de cada país y ciclo, sobre todo en celdas de seis cartas. Algunas celdas incluirán perfiles menos obvios para cumplir diversidad posicional.

### Qué invalidaría esta decisión

Que la curaduría no encuentre figuras suficientes para una posición en tantas celdas, que la simulación siga agotando alternativas o que el reparto vuelva las ofertas históricamente inverosímiles.

## DEC-133 — Aprobación global del roster de 150 identidades

### Contexto

La revisión por celda entregaba información correcta, pero no permitía evaluar si el conjunto transmitía la fantasía completa del producto ni si había ausencias o repeticiones de identidad entre generaciones. Se solicitó revisar la propuesta completa antes de continuar con fuentes y balance.

### Opciones consideradas

1. Aprobar o rechazar cada celda de forma aislada.
2. Mostrar una lista completa de 150 versiones y aprobar la identidad del catálogo como conjunto.
3. Saltar directamente a OVR y rasgos sin revisar todos los nombres.

### Decisión

Se aprobó el roster completo de 150 identidades contenido en `FULL_ROSTER_PROPOSAL.md`. La selección cumple las cuotas de país y ciclo y no repite futbolistas. Las pasadas posteriores verifican hechos y aplican balance; no reemplazan una identidad aprobada salvo por error histórico verificable o nueva revisión editorial explícita.

### Motivo

Permite evaluar de una vez la magia, reconocimiento y cobertura generacional del catálogo, y evita que cambios locales destruyan la coherencia que el usuario ya aprobó globalmente.

### Trade-offs

El balance tendrá menos libertad para solucionar una carencia reemplazando nombres. Algunas temporadas o roles podrán requerir ajustes de detalle durante la verificación, con trazabilidad clara.

### Qué invalidaría esta decisión

Que la verificación revele datos históricos incompatibles en cantidad relevante, que el roster no satisfaga las cuotas de posiciones al clasificarse de forma rigurosa o que las pruebas demuestren una ausencia de identidad tan material que el conjunto deba reabrirse.

## DEC-134 — Muro defensivo puede aplicar a arqueros

### Contexto

Todas las cartas deben tener un rasgo, pero el catálogo inicial de seis no incluía uno específico para arqueros. Agregar una séptima categoría habría aumentado reglas, distribución y condiciones de sinergia sin demostrar valor en el MVP.

### Opciones consideradas

1. Crear un rasgo exclusivo de arquero.
2. Dejar a los arqueros sin rasgo.
3. Permitir que Muro defensivo describa un perfil defensivo de arquero.

### Decisión

Muro defensivo puede asignarse a arqueros. El rasgo expresa un perfil de juego, no una posición exclusiva; cada arquero conserva igualmente una sola posición primaria POR.

### Motivo

Mantiene la regla simple de un rasgo por carta sin agregar una capa de sinergias con frecuencia y balance desconocidos. Además hace legible que una carta de arquero contribuya a una build defensiva.

### Trade-offs

Muro defensivo abarca perfiles de arquero y de campo, por lo que su nombre debe explicarse como perfil y no como etiqueta posicional literal. No todos los arqueros necesariamente requerirán el mismo rasgo en expansiones futuras.

### Qué invalidaría esta decisión

Que los jugadores interpreten sistemáticamente el trait como incompatible con POR, que los arqueros vuelvan una build de Muro demasiado fácil o que pruebas revelen un valor claro de un rasgo propio de arquero.

## DEC-135 — Distribución inicial de rasgos del roster

### Contexto

Se había definido un piso de dieciocho cartas por rasgo y una preferencia por curaduría histórica, pero faltaba fijar la distribución concreta necesaria para asignar una sola etiqueta a cada una de las 150 cartas.

### Opciones consideradas

1. Repartir exactamente veinticinco cartas por rasgo.
2. Dejar la frecuencia totalmente libre según interpretación histórica.
3. Usar una distribución cercana al equilibrio, con variación editorial limitada.

### Decisión

El roster contiene 28 Creador, 26 Técnico, 25 Muro defensivo, 24 Velocista, 24 Físico y 23 Rematador. La asignación individual se conserva en `TRAIT_ALLOCATION.md`.

### Motivo

Cumple el piso de disponibilidad para builds y conserva una leve diferencia editorial entre perfiles, sin crear una rareza oculta que convierta un trait en ventaja de RNG.

### Trade-offs

Algunas asignaciones representan el perfil de juego más útil y reconocible, no una descripción exhaustiva de la carrera. Deberán revisarse contra las ofertas simuladas y la potencia final de cada sinergia.

### Qué invalidaría esta decisión

Que un trait alcance sus umbrales mucho más que los demás, que las asignaciones resulten contraintuitivas de forma recurrente o que la percepción de roles históricos se deteriore en pruebas de jugadores.

## DEC-136 — Anclas de OVR para la banda cumbre

### Contexto

La curva reservaba seis cartas para 96–100, pero sin referencias concretas los valores inferiores podían convertirse en una percepción editorial inconsistente entre países, épocas y posiciones.

### Opciones consideradas

1. Asignar todos los números sin anclas explícitas.
2. Reservar 100 para un único futbolista y ordenar el resto alrededor de él.
3. Definir seis temporadas ancla de la banda cumbre, permitiendo más de un 100 cuando la evidencia editorial lo sostenga.

### Decisión

Maradona (Napoli 1986–87) y Messi (FC Barcelona 2008–09) reciben 100. Pelé (Santos 1962), Ronaldo (Inter 1997–98), Zico (Flamengo 1981) y Cristiano Ronaldo (Manchester United 2007–08) reciben, respectivamente, 99, 98, 97 y 96. Ocupan las seis plazas de la banda cumbre.

### Motivo

Da referencias memorables y discutibles de manera explícita, evita importar una jerarquía de otro juego y muestra que la escala representa temporadas/versions, no una clasificación absoluta de carreras.

### Trade-offs

Algunas leyendas igualmente icónicas quedan en bandas inferiores, no porque sean inferiores como carrera, sino porque esta versión concreta compite con las seis temporadas ancla. La comunidad puede debatir anclas con intensidad.

### Qué invalidaría esta decisión

Que las comparaciones editoriales del resto resulten inestables frente a estas referencias, que usuarios interpreten los números como un ranking absoluto de personas o que las pruebas requieran más dispersión en la banda cumbre.

## DEC-137 — Escala de OVR entera con valores repetibles

### Contexto

Las bandas y las seis anclas ya definen el rango, pero faltaba decidir si cada carta debía tener un valor exclusivo o si el número podía representar una categoría editorial compartida.

### Opciones consideradas

1. Usar valores enteros de 70 a 100 y permitir repeticiones.
2. Forzar un orden único sin valores repetidos.
3. Usar decimales para distinguir temporadas cercanas.

### Decisión

El OVR se expresa con enteros de 70 a 100 y los valores se pueden repetir.

### Motivo

Conserva la lectura inmediata y familiar de una carta de fútbol, permite que diferencias pequeñas sean visibles cuando sirven al juego y evita fingir una precisión histórica o estadística que el sistema editorial no posee.

### Trade-offs

Dos cartas con el mismo OVR no comunican una diferencia de fuerza por sí solas; su posición, química, rasgo y situación de draft deberán sostener la decisión. Una comunidad que busque un ranking estricto puede percibir menos granularidad.

### Qué invalidaría esta decisión

Que los empates hagan demasiadas elecciones planas, que las pruebas requieran distinguir de manera confiable temporadas muy próximas o que el score final necesite una resolución que los enteros no puedan aportar.

## DEC-138 — Curaduría individual de OVR dentro de bandas

### Contexto

La escala, distribución y anclas no resolvían aún cómo fijar los 144 valores restantes sin caer en una fórmula opaca o en una copia de valoraciones externas.

### Opciones consideradas

1. Curar cada carta individualmente, comparándola con anclas y pares de posición y época.
2. Derivar el OVR automáticamente de estadísticas históricas.
3. Copiar o adaptar ratings de un videojuego existente.

### Decisión

Los 144 valores no ancla se asignan por curaduría editorial individual dentro de las bandas aprobadas. La propuesta se mantiene en `OVR_ALLOCATION.md`.

### Motivo

Permite valorar temporadas de contextos históricos distintos sin convertir el diseño en una fórmula que oculte sus supuestos. También preserva la identidad propia del producto y hace visibles las referencias utilizadas.

### Trade-offs

La valoración exige revisión editorial y podrá despertar desacuerdos razonables. Aun con anclas, no reemplaza la validación de balance: un OVR históricamente defendible puede producir decisiones de draft pobres.

### Qué invalidaría esta decisión

Que la curaduría no pueda sostener consistencia entre cartas comparables, que el proceso resulte inmanejable al ampliar el catálogo o que las pruebas revelen que el OVR domina sistemáticamente química, trait y posición.

## DEC-139 — Posiciones secundarias basadas en desempeño histórico

### Contexto

Las secundarias reducen la penalización posicional y por eso pueden ampliar decisiones del draft. Sin un criterio, también pueden convertirse en flexibilidad ficticia creada solo para cuadrar el balance.

### Opciones consideradas

1. Asignarlas solo a roles que el futbolista haya desempeñado realmente y de forma reconocible en su carrera, hasta dos por carta.
2. Asignarlas por la versatilidad que convenga al balance, aunque no haya antecedente real.
3. Eliminar secundarias del MVP.

### Decisión

Cada carta puede tener cero, una o dos posiciones secundarias, únicamente cuando exista desempeño histórico real y reconocible del rol en la carrera del futbolista. No se exige que fuera el rol dominante de la temporada de referencia.

### Motivo

Mantiene la fantasía de cartas históricas auténticas sin forzar una investigación de alineaciones de cada temporada. Conserva un coste legible de jugar fuera de puesto y evita que el sistema corrija artificialmente las cuotas ya resueltas por las primarias.

### Trade-offs

Algunas posiciones quedarán menos flexibles que otras y el catálogo requerirá verificación razonable. La carta puede ser más flexible que la foto de su temporada, a cambio de sacrificar fidelidad estricta de versión.

### Qué invalidaría esta decisión

Que el número de secundarias verificables sea tan bajo que las decisiones de colocación no aporten, que genere problemas repetidos de cobertura o que la evidencia histórica no pueda sostenerse de manera práctica por carta.

## DEC-140 — Fórmula exacta de Squad Score para el MVP

### Contexto

Las capas de score ya estaban aprobadas, pero “moderado” y “bonos fijos” aún no permitían a un jugador calcular el efecto de una elección ni evaluar el balance del catálogo.

### Opciones consideradas

1. Promedio de OVR efectivo, química lineal hasta +5% y traits idénticos de +1/+3.
2. Bonos distintos para cada trait o una química no lineal.
3. Una fórmula con subatributos y multiplicadores por línea.

### Decisión

`Squad Score = promedio de OVR efectivo × (1 + conexiones / 33 × 5%) + bonos de traits`.

El OVR efectivo aplica 0 en posición primaria, −4 en secundaria y −10 fuera de posición. Cada trait suma +1 al reunir tres cartas o +3 al reunir cinco; el segundo reemplaza al primero. La pantalla muestra el resultado con un decimal y el score no tiene tope superior.

### Motivo

Hace visible qué sistema explica cada cambio: colocación, cohesión y build. La química máxima sobre un promedio de 90 aporta 4,5 puntos; los traits siguen siendo relevantes sin eclipsar al OVR.

### Trade-offs

Los traits no se diferencian por efecto en el MVP y la fórmula puede crear empates de score. La simplicidad sacrifica simulación futbolística detallada y requerirá validar que +1/+3 basta para cambiar elecciones reales.

### Qué invalidaría esta decisión

Que los tests muestren que los traits no cambian picks, que la química alcance o supere de forma sistemática la diferencia de OVR que debería compensar, que haya demasiados empates competitivos o que los jugadores no puedan explicar el desglose.

## DEC-141 — Catálogo completo como condición de primera versión visible

### Contexto

Se propuso mostrar antes un slice interno de treinta cartas para acelerar la validación visual y de flujo mientras se completaban las ciento cincuenta. La identidad del producto depende, sin embargo, de descubrir y combinar figuras reales con su imagen de club correcta.

### Opciones consideradas

1. Lanzar primero una versión visible con treinta cartas reales.
2. Exigir las ciento cincuenta cartas completas y verificadas antes de cualquier versión visible.
3. Usar placeholders o imágenes genéricas temporalmente.

### Decisión

La primera versión visible requiere el catálogo completo de 150 cartas reales: identidad histórica, datos, escudo, imagen con la camiseta de club correspondiente y procedencia registrada. No habrá un catálogo reducido, placeholders ni imágenes genéricas visibles.

### Motivo

El usuario considera que la magia del producto nace de las combinaciones míticas de jugadores reales. Una muestra pequeña o visualmente incompleta podría validar una interfaz, pero no la fantasía ni el loop que se desea lanzar.

### Trade-offs

El primer hito tarda más y la curaduría de datos/activos se vuelve una dependencia crítica antes de probar con usuarios. La cobertura visual debe someterse a revisión de calidad rigurosa.

### Qué invalidaría esta decisión

Que la curaduría completa bloquee de manera desproporcionada la prueba del loop o que las pruebas internas demuestren que la riqueza de 150 cartas no cambia la evaluación de diversión frente a un conjunto menor. Cualquier excepción requerirá una nueva decisión explícita.

## DEC-142 — Umbral mínimo de evidencia para hechos de versión

### Contexto

El catálogo de 150 cartas necesita sostener club y temporada reales, pero exigir múltiples fuentes oficiales por cada caso haría que la curaduría creciera más que el valor que aporta antes de detectar una duda concreta.

### Opciones consideradas

1. QID estable y una fuente que confirme club/temporada; fuente oficial solo ante duda o conflicto.
2. Dos fuentes por carta, una de ellas oficial siempre.
3. Aceptar el QID como única evidencia de versión.

### Decisión

Cada carta requiere QID y una fuente que respalde club y temporada. Si la fuente no es inequívoca, falta información o se contradice, se añade y prioriza una fuente oficial de club, FIFA o UEFA.

### Motivo

Hace trazable la versión sin convertir el catálogo en una investigación duplicada. Mantiene un mecanismo claro para elevar el nivel de evidencia cuando la historia o el nombre crean ambigüedad.

### Trade-offs

La calidad de la fuente inicial puede variar y algunos casos antiguos requerirán revisión manual. El QID no prueba por sí mismo una temporada concreta; la imagen continúa necesitando una cadena de procedencia separada.

### Qué invalidaría esta decisión

Que aparezcan errores recurrentes de club o temporada, que las fuentes iniciales sean insuficientes para resolver demasiados casos o que la revisión de imágenes revele mezclas sistemáticas de versión.

## DEC-143 — Ruta de procedencia para imágenes de carta

### Contexto

Cada carta necesita una imagen real con camiseta de club coherente, pero los resultados de búsqueda mezclan selecciones, otras temporadas, fotos editoriales sin contexto y archivos sin procedencia clara.

### Opciones consideradas

1. Comparar las candidatas de Wikimedia Commons, archivos oficiales de clubes, FIFA y UEFA, y aprobar la mejor imagen válida.
2. Buscar primero en Wikimedia Commons y usar archivos oficiales solo como respaldo.
3. Usar cualquier imagen visible en un buscador o depender únicamente de un proveedor comercial externo.

### Decisión

La calidad visual y la identidad de versión prevalecen sobre la prioridad de proveedor. Para cada carta se comparan candidatas con página fuente concreta de Wikimedia Commons, archivo oficial del club, FIFA o UEFA; se aprueba la mejor que muestre al futbolista reconocible con la camiseta del club de la carta. Una imagen de club, FIFA o UEFA puede reemplazar a una candidata válida de Commons si es objetivamente superior. Todo activo registra fuente, URL, proveedor, fecha y licencia o condición visible antes de descargarse íntegro y sin transformar a almacenamiento local.

### Motivo

Evita que la disponibilidad o el rate limit de un único proveedor rebajen la calidad del catálogo o frenen la curaduría. Conserva una ruta trazable y evita que una búsqueda casual incorpore fotos de selección o de club equivocado. Mantiene el original local como unidad final del producto.

### Trade-offs

La comparación entre fuentes aumenta el tiempo editorial por carta y los archivos oficiales pueden exponer metadatos menos uniformes que Commons. A cambio, reduce bloqueos operativos de un proveedor y permite priorizar una imagen más legible en móvil.

### Qué invalidaría esta decisión

Que la evaluación entre fuentes introduzca criterios inconsistentes, que ninguna fuente autorizada cubra suficientes camisetas coherentes o que el coste editorial de comparar candidatas haga inviable la condición de catálogo completo.

## DEC-144 — Umbral de reconocimiento de la imagen de carta

### Contexto

La revisión de Messi FC Barcelona 2009 encontró una toma real y contextualizada donde aparece de espaldas: camiseta correcta y dorsal 10 inequívoco, pero sin rostro visible. Era necesario fijar si esa imagen puede representar una carta sin reducir todo el criterio visual a una regla rígida que excluya buenas fotos históricas.

### Opciones consideradas

1. Exigir rostro o identificación visual directa en todas las cartas.
2. Aceptar cualquier foto con camiseta y dorsal correctos.
3. Priorizar rostro o silueta reconocible, con excepción puntual para camiseta y dorsal inequívocos.

### Decisión

Se adopta la opción 3. La foto debe priorizar al futbolista reconocible por rostro o silueta. Una toma de espaldas solo se aprueba excepcionalmente cuando camiseta y dorsal permiten identificar la carta sin ambigüedad. Messi FC Barcelona 2009 queda aprobado bajo esta excepción.

### Motivo

Preserva el carácter mítico y la lectura rápida en mobile, sin descartar una foto históricamente precisa y reconocible por los signos futbolísticos que el producto ya muestra en la carta.

### Trade-offs

La evaluación sigue requiriendo juicio editorial y las excepciones deben registrarse. Un criterio estricto de rostro elevaría la dificultad de curar figuras históricas; uno demasiado amplio bajaría la fuerza visual de la colección.

### Qué invalidaría esta decisión

Que las pruebas en móvil muestren que las excepciones no se identifican con rapidez, que se acumulen excepciones de calidad baja o que el público interprete mal la identidad de una carta al verla sin su contexto textual completo.

## DEC-145 — Confirmación explícita de pick en móvil

### Contexto

Una oferta reúne información que cambia el valor de una carta: OVR efectivo, posición, química y rasgo. En una pantalla mobile-first, seleccionar al primer toque aceleraría el draft, pero puede convertir un toque impreciso o una lectura incompleta en una pérdida irreversible.

### Opciones consideradas

1. Elegir la carta al primer toque.
2. Abrir detalle breve y confirmar con `Elegir`.
3. Elegir al primer toque y ofrecer deshacer.

### Decisión

Se adopta la opción 2. Tocar una carta abre su detalle breve; solo `Elegir` confirma el pick. Volver al draft conserva la oferta sin penalización.

### Motivo

Reduce selecciones accidentales y da espacio para entender los trade-offs que hacen interesante el draft, sin exigir una pantalla de información separada ni añadir una regla de deshacer.

### Trade-offs

Agrega una interacción por pick y debe diseñarse con velocidad para no alargar la run más allá de la duración objetivo. El detalle debe mantener la jerarquía de información y permitir volver al contexto de oferta rápidamente.

### Qué invalidaría esta decisión

Que los tests móviles muestren que la confirmación frena de manera medible la finalización o la repetición, o que los jugadores no necesiten el detalle para tomar decisiones informadas.

## DEC-146 — Sin control adicional del contexto en el MVP

### Contexto

Cada oferta del modo principal comparte país y ciclo mundial; ambas son fuentes de química. Esto hace que una parte de la composición sea una situación creada por RNG. Se evaluó añadir una elección de contexto o un recurso adicional para reforzar el control del jugador.

### Opciones consideradas

1. Mantener el contexto aleatorio y medir la agencia de las herramientas existentes.
2. Añadir un cambio de contexto por partida, separado del reroll.
3. Hacer elegir entre dos contextos antes de cada oferta.

### Decisión

Se adopta la opción 1. El MVP no añade una nueva elección ni un recurso de cambio de contexto. Se conserva el roll aleatorio de país–ciclo, el reroll contextual, el scouting, las posiciones, los clubes y los traits como las capas de decisión existentes.

### Motivo

Permite probar el loop con el menor número de reglas y saber si esas capas ya dan suficiente respuesta hábil a una situación aleatoria. Un control nuevo ahora añadiría fricción y haría más difícil atribuir la diversión o el problema a una causa concreta.

### Trade-offs

Nacionalidad y ciclo mundial seguirán siendo parcialmente impuestos por el roll. Si la química se percibe como un premio o castigo aleatorio, el producto tendrá que ajustar el sistema después de medirlo.

### Qué invalidaría esta decisión

Que los tests muestren que los jugadores atribuyen sus resultados principalmente al contexto recibido, que química no altere elecciones de forma comprensible o que el reroll/scouting no ofrezcan margen de respuesta suficiente.

## DEC-147 — Guardrail de ofertas dominadas sin filtro preventivo

### Contexto

El riesgo de una oferta con una carta claramente superior debía ser medible, pero prohibir toda dominancia desde el generador convertiría el draft en un sistema guionado y ocultaría la distribución real que recibe el jugador.

### Opciones consideradas

1. Medir la dominancia, tolerar hasta 15% y revisar contenido/reglas solo al superar el umbral.
2. Impedir preventivamente cualquier oferta dominada.
3. No medir la dominancia.

### Decisión

Se adopta la opción 1. Una oferta se clasifica como estructuralmente dominada solo entre dos opciones que comparten posición primaria y trait: para el estado de squad disponible, una no es peor en OVR efectivo ni conexiones inmediatas, y es mejor en al menos una de esas dimensiones. Opciones de distinto trait o posición nunca se clasifican como dominadas por esta métrica, pues pueden abrir futuros distintos. El guardrail inicial es un máximo de 15% de ofertas clasificadas así. No se añade un filtro preventivo al generador.

### Motivo

Conserva incertidumbre y permite detectar un problema real con datos. El umbral no define diversión ni obliga a una corrección automática: activa una revisión de curaduría, de presentación o de reglas.

### Trade-offs

La clasificación es deliberadamente conservadora: no puede detectar toda elección fácil, pero evita declarar irrelevante una opción con otro rol o build potencial. Algunas elecciones fáciles son deseables como respiración dentro de una run; una tasa cero sería artificial.

### Qué invalidaría esta decisión

Que 15% resulte demasiado alto o bajo frente a observación de jugadores, que la clasificación no se correlacione con deliberación real o que aparezcan ofertas problemáticas que el criterio no detecta.

## DEC-148 — Colocación automática tras confirmar un pick

### Contexto

La formación aporta decisiones de OVR efectivo y cobertura, pero exigir que cada pick incluya además una elección de plaza ralentizaría el draft mobile-first antes de que el jugador pueda inspeccionar su squad completo.

### Opciones consideradas

1. Elegir una plaza obligatoriamente al confirmar cada carta.
2. Colocar automáticamente y permitir reorganización libre posterior.
3. Mantener todas las cartas sin plaza hasta el final.

### Decisión

Se adopta la opción 2. Cada carta confirmada se ubica en la mejor plaza libre: primero una de posición primaria, luego una secundaria y, si no existe, la plaza libre que conserve el mayor OVR efectivo. Los empates se resuelven por el orden estable de la 4-3-3. La persona puede reorganizar la squad sin coste durante toda la partida.

### Motivo

Mantiene el ritmo del draft en móvil y muestra de inmediato el efecto posicional de cada pick, sin quitar la agencia de optimizar la formación antes o después de decisiones posteriores.

### Trade-offs

La colocación inicial puede no ser la óptima para una build futura. Debe ser visible, explicable y fácil de corregir; no debe presentarse como una decisión irreversible ni como consejo estratégico perfecto.

### Qué invalidaría esta decisión

Que las pruebas muestren que el automatismo oculta una decisión que los jugadores quieren tomar, cause demasiadas reorganizaciones correctivas o confunda la lectura de OVR efectivo.

## DEC-149 — Ampliación puntual del catálogo a 151 con Deco

### Contexto

El analizador reproducible detectó que MC estaba presente en diecinueve contextos país–ciclo, uno menos que el mínimo de veinte necesario para que la protección posicional no recaiga repetidamente en las mismas celdas. Todas las demás cuotas del catálogo aprobado de 150 se mantenían.

### Opciones consideradas

1. Rebajar el mínimo de cobertura de MC a diecinueve.
2. Reasignar la posición primaria o ciclo de una carta ya aprobada.
3. Añadir una versión histórica que abra el vigésimo contexto de MC.

### Decisión

Se adopta la opción 3. El catálogo pasa a 151 cartas con Deco, FC Porto 2003–04, como MC con OVR editorial 87, trait Creador y sin secundaria en el MVP. Su contexto Portugal 1994–2009 ya existía con seis cartas; al pasar a siete conserva oferta normal y reroll de tres candidatos inéditos.

### Motivo

Corrige exactamente el déficit sin alterar las cartas existentes, sin reducir el guardrail de protección y sin crear una nueva celda frágil. La temporada representa a un mediocampista creativo del FC Porto campeón europeo 2003–04; la identidad y activo siguen sujetos al manifiesto de procedencia.

### Trade-offs

Portugal sube de dieciocho a diecinueve cartas; MC de cuarenta y una a cuarenta y dos; Creador de veintiocho a veintinueve; y la banda 84–89 de cuarenta y dos a cuarenta y tres. La incorporación genera una fila adicional pendiente de hechos y activo visual en el manifiesto, que no se modificó aquí por estar en curaduría concurrente.

### Qué invalidaría esta decisión

Que la verificación de identidad no sostenga la versión FC Porto 2003–04, que no pueda conseguirse un activo con camiseta coherente conforme al gate del catálogo, o que las simulaciones muestren que el séptimo candidato de esa celda altera materialmente la variedad o el balance de ofertas.

## DEC-150 — Ventana final distribuida para posiciones prioritarias

### Contexto

La salvaguarda original podía concentrar POR, LD y LI en el último pick cuando siguieran pendientes. El análisis reproducible del roster confirma que existen celdas compatibles; no había una imposibilidad estructural. Sin embargo, concentrar esa solución en un único hito reducía la incertidumbre de cierre frente a la preferencia explícita por mayor aleatoriedad.

### Opciones consideradas

1. Mantener un único contexto y distribuir la oportunidad final de POR, LD y LI entre rolls distintos.
2. Romper excepcionalmente el contexto país–ciclo en la última oferta.
3. Cambiar el roster hasta crear una celda que contenga las tres posiciones.

### Decisión

Se adopta la opción 1. POR, LD y LI pendientes reciben su tercera oportunidad protegida en una ventana de cierre de rolls distintos; cuando las tres siguen pendientes, se distribuyen entre los picks 9, 10 y 11 en orden sorteado. Cada oferta conserva un solo país–ciclo y la persona sigue viendo opciones alternativas de esa misma celda.

### Motivo

Preserva la identidad temática del modo y la preferencia por aleatoriedad: evita que una solución final concentrada ocurra siempre en el mismo pick. La garantía se mantiene como tres oportunidades reales, solo cambia su distribución temporal.

### Trade-offs

Al aproximarse al cierre, puede hacerse perceptible que se están resolviendo necesidades prioritarias, aunque el orden sea aleatorio. El planificador debe demostrar con el catálogo real que puede ubicar todas las oportunidades requeridas sin agotar contextos ni convertir demasiadas opciones en candidatas protegidas.

### Qué invalidaría esta decisión

Que la simulación no encuentre planes válidos para una proporción material de seeds, que la ventana final se perciba como guion en pruebas de usuario o que aún existan runs sin tres oportunidades para una categoría pendiente.

## DEC-151 — PostgreSQL para cuentas y progreso del MVP

### Contexto

El MVP incorporará cuenta simple con username y contraseña, sesión, récord personal, colección y run activa. Fastify ya está decidido como API propia, pero hacía falta confirmar una persistencia duradera antes de implementar esos contratos.

### Opciones consideradas

1. PostgreSQL como persistencia del producto.
2. Almacenamiento en memoria o archivos locales del servidor.
3. Mantener solo progreso de invitado en el navegador.

### Decisión

Se adopta la opción 1. PostgreSQL persiste usuarios, credenciales protegidas, sesiones, progreso, colección, runs y versión de catálogo. La PWA conserva una partida libre localmente; el servidor no se convierte todavía en árbitro competitivo.

### Motivo

Una cuenta con contraseña y progreso entre sesiones necesita durabilidad, consultas consistentes y una base clara para la futura verificación de Draft diario. PostgreSQL cubre esa necesidad sin introducir microservicios ni una economía prematura.

### Trade-offs

Incorpora migraciones, configuración por entorno, copias de seguridad y pruebas de integración. Algoritmo de hash, formato de sesión y herramienta de migración se elegirán antes de esa implementación, con seguridad y reversibilidad explícitas.

### Qué invalidaría esta decisión

Que el MVP se reduzca formalmente a una prueba local sin cuentas, o que un proveedor/plataforma imponga una persistencia administrada con garantías equivalentes y menor complejidad operacional.
