# Hipótesis

## H001 — Las decisiones de draft justifican otra run

- **Hipótesis:** las elecciones sucesivas de draft son suficientemente interesantes para que el jugador inicie otra run voluntariamente a fin de mejorar o demostrar la calidad de su draft.
- **Motivo:** es la hipótesis de producto que debe probar el MVP antes de añadir retención o competición.
- **Cómo probarla:** test de una vertical slice sin metaprogresión ni contenido que compense un loop débil.
- **Métrica:** runs por sesión y tasa de `play again` tras una run completada.
- **Criterio de éxito:** al menos 40% de quienes completan una partida libre inicia otra en la misma sesión, sin incentivo externo.
- **Estado:** abierta.

## H002 — Las restricciones simples producen trade-offs comprensibles

- **Hipótesis:** un conjunto mínimo de restricciones de squad evita que el OVR máximo sea siempre la elección correcta.
- **Motivo:** concreta el principio de que la habilidad responda a situaciones creadas por RNG.
- **Cómo probarla:** comparar elecciones, variedad de squads y explicación verbal de las decisiones en pruebas de juego.
- **Métrica:** pendiente de definir.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H003 — La profundidad se aprende dentro del juego

- **Hipótesis:** una persona puede completar y disfrutar su primera run sin trivia futbolística, mientras que la experiencia desarrolla una curva de dominio mediante sus propias reglas.
- **Motivo:** el producto busca accesibilidad sin un techo estratégico plano.
- **Cómo probarla:** pruebas con participantes de conocimiento futbolístico diverso; observar primera run y comparar decisiones tras aprendizaje guiado por el juego.
- **Métrica:** completion rate de primera run, comprensión declarada y calidad/variedad de decisiones posteriores.
- **Criterio de éxito:** al menos 55% de quienes ven su primer roll llega a la pantalla de resultado de su primera partida.
- **Estado:** abierta.

## H004 — Anticipar con una variable limitada mejora el draft

- **Hipótesis:** una única capa de anticipación, combinada con composición y sinergias, permite decisiones de mayor dominio sin sobrecargar la primera run.
- **Motivo:** se eligió como fuente potencial de ventaja experta.
- **Cómo probarla:** comparar una versión de draft con y sin el mecanismo; observar comprensión, deliberación y deseo de repetir.
- **Métrica:** tiempo por pick, completion rate, explicación de decisión y `play again` rate.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H005 — La información excepcional mejora la tensión sin dominar el mérito

- **Hipótesis:** informes de scouting ponderados por potencia, incluida una revelación exacta con 5% inicial, aumentan la tensión y el interés sin hacer que el resultado se atribuya al RNG.
- **Motivo:** el scouting debe aportar agencia, no sustituir el juicio del jugador.
- **Cómo probarla:** comparar percepción de justicia, decisiones tras cada informe y resultado de run según tipo de informe recibido.
- **Métrica:** uso por tipo de informe, cambio de pick, score final, explicación de mérito y `play again` rate.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H006 — El Draft diario motiva competencia por habilidad

- **Hipótesis:** comparar Daily Seeds con oportunidades equivalentes incrementa el deseo de optimizar una run y competir sin percepción dominante de lucky-to-win.
- **Motivo:** es la base del ranking competitivo elegido.
- **Cómo probarla:** probar el mismo seed con participantes múltiples, comparar participación, variedad de decisiones y percepción de justicia contra runs libres.
- **Métrica:** participación en Daily Seed, reintentos, distribución de scores, diversidad de squads y percepción declarada de justicia.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H007 — El Squad Score basta como consecuencia inicial

- **Hipótesis:** un Squad Score con desglose comprensible y comparación resulta suficiente para que una run se sienta concluida y motive otra, sin simulación de partidos.
- **Motivo:** se eligió como consecuencia mínima del MVP.
- **Cómo probarla:** pruebas de vertical slice solo con score, desglose, récord personal y `play again`.
- **Métrica:** completion rate, comprensión del score, `play again` rate y feedback cualitativo sobre satisfacción del final.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H008 — Las identidades reales elevan la magia de construir squads

- **Hipótesis:** poder combinar futbolistas y equipos reconocibles aumenta de forma material la atracción y el deseo de repetir frente a entidades genéricas.
- **Motivo:** el contenido oficial real es una dirección creativa central y puede tener costos/condiciones significativos.
- **Cómo probarla:** investigación cualitativa y pruebas de concepto con material autorizado o representaciones que no se distribuyan sin derechos; comparar reacción, comprensión y deseo de iniciar otra run.
- **Métrica:** intención de jugar/repetir, preferencia declarada y feedback cualitativo.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H009 — El conteo simple de traits basta para generar elecciones de build

- **Hipótesis:** cinco o seis traits amplios, con umbrales simples de tres y cinco, generan picks de build distinguibles sin requisitos adicionales.
- **Motivo:** se eligió deliberadamente la forma mínima de sinergia para MVP.
- **Cómo probarla:** observar si traits afectan picks, la distribución de builds y las explicaciones de los jugadores en pruebas de run.
- **Métrica:** frecuencia de sinergias, diversidad de traits finales, picks que cambian por trait y comprensión declarada.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H010 — Tres fuentes de química equilibran el conteo simple de traits

- **Hipótesis:** nacionalidad, club y ciclo mundial hacen que completar un umbral de trait implique trade-offs suficientes, sin que la química resulte ilegible.
- **Motivo:** se eligió esta estructura para contrapesar traits de conteo simple.
- **Cómo probarla:** observar picks que enfrentan trait contra posición/química y pedir explicación del resultado de química a participantes.
- **Métrica:** tiempo por pick, cambios de pick por química, comprensión declarada y distribución de química final.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H011 — Las conexiones binarias son legibles y estratégicas

- **Hipótesis:** limitar cada fuente de química a una conexión por jugador conserva trade-offs de composición y permite explicar la química sin contar pares complejos.
- **Motivo:** se eligió para mantener legibilidad mobile-first.
- **Cómo probarla:** pedir a participantes que anticipen y expliquen el cambio de química antes y después de un pick.
- **Métrica:** precisión de explicación, tiempo por pick, cambios de pick por química y feedback de comprensión.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H012 — Un tope de química de +5% crea trade-offs reales

- **Hipótesis:** una escala lineal y visible de química hasta +5% permite que un jugador conectado compita con más OVR sin volver la conexión dominante.
- **Motivo:** es la escala inicial elegida.
- **Cómo probarla:** simular y testear elecciones entre OVR alto aislado y OVR menor conectado, observando resultado y explicación de decisión.
- **Métrica:** picks influenciados por química, score distribuido, diversidad de conexiones y comprensión declarada.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** abierta.

## H013 — Bonos iguales de traits mantienen builds legibles

- **Hipótesis:** usar exactamente +1 a tres copias y +3 a cinco para los seis traits permite que la identidad de una build nazca de qué cartas se sacrifican, no de memorizar seis tablas de poder.
- **Motivo:** el MVP necesita aislar si los conteos simples ya producen decisiones interesantes.
- **Cómo probarla:** analizar frecuencia de picks, activaciones, score, elección de build y comprensión antes de cada pick.
- **Métrica:** diversidad de builds, tasa de pick por trait, frecuencia de activación y comprensión declarada de umbrales.
- **Criterio de éxito:** los participantes identifican el coste y el beneficio de perseguir un trait sin consultar una regla externa.
- **Estado:** abierta.

## H014 — Los bonos fijos de rasgos son suficientes en un MVP sin partidos

- **Hipótesis:** umbrales de rasgos que solo suman bonos fijos y visibles al puntaje generan builds comprensibles y decisiones repetibles.
- **Motivo:** el MVP no incluye simulación; mezclar rasgos con química o recursos podría ocultar la causa del resultado.
- **Cómo probarla:** observar elecciones de rasgos, explicación del puntaje y repetición de partidas en pruebas de prototipo.
- **Métrica:** tasa de elección por rasgo, comprensión declarada del puntaje y tasa de volver a jugar.
- **Criterio de éxito:** los participantes identifican qué umbral persiguieron y por qué afectó su puntaje sin explicación externa.
- **Estado:** abierta.

## H016 — Las ofertas independientes toleran dominancia ocasional

- **Hipótesis:** extracciones independientes con protecciones posicionales mantienen suficiente incertidumbre y decisiones interesantes aunque aparezcan ofertas dominadas de forma ocasional.
- **Motivo:** se priorizó no guionizar las ofertas ni introducir filtros ocultos antes de medir el problema.
- **Cómo probarla:** clasificar ofertas por dominancia contextual y observar deliberación, reroll y elección de carta.
- **Métrica:** proporción de ofertas dominadas, tiempo por pick, uso de reroll y tasa de otra partida.
- **Criterio de éxito:** pendiente de definir.
- **Estado:** supersedida como dirección de MVP por DEC-118; conservar solo como alternativa de comparación si se prototipa.

## H017 — Un roll temático por país y ciclo mundial aumenta identidad

- **Hipótesis:** estructurar una oferta como `país → ciclo mundial → jugadores de ese país y ciclo` genera más anticipación, coherencia histórica y fantasía que una oferta de cartas independientes.
- **Motivo:** las selecciones nacionales se perciben como una identidad más mítica que el club dentro del acto de rolear.
- **Cómo probarla:** comparar prototipos del draft independiente y del roll temático usando el mismo catálogo, observando variedad de decisiones, comprensión de química y deseo de repetir.
- **Métrica:** tiempo de elección, diversidad de nacionalidades/ciclos finales, picks influenciados por posición/rasgo/OVR, química final, preferencia declarada y `play again`.
- **Criterio de éxito:** el roll temático aumenta anticipación y preferencia sin volver las decisiones obvias ni hacer que la química quede determinada principalmente por el RNG.
- **Estado:** adoptada como dirección del modo principal; RNG, ciclos, reroll, protección y matriz de celdas están definidos. Falta validar diversión, distribución por posiciones, rasgos y curva de OVR.

## Evidencia interna asociada

- La línea base reproducible de 1.000 seeds por estrategia está en [SIMULATION_BASELINE.md](SIMULATION_BASELINE.md). Confirma invariantes, variedad de contextos y dominancia mecánica acotada; no sustituye las pruebas con personas definidas en H001–H017.
