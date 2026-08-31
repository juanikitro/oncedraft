# Core loop

## Estado

Estructura de trabajo aprobada; mantiene parámetros de generación abiertos.

## Loop candidato del GDD

`iniciar run -> roll de país -> roll de ciclo mundial -> recibir oferta compatible -> evaluar opciones -> elegir -> actualizar squad -> repetir -> ver Squad Score y desglose explicables -> intentar mejorar o comparar el draft -> volver a jugar`

El RNG produce un contexto de país y ciclo mundial. Todas las opciones de la oferta comparten nacionalidad y ciclo; pueden diferir en club, OVR, posición y rasgo. El contexto no suma química por sí mismo: solo determina qué versiones pueden aparecer. Tras la elección queda agotado y no inicia otro pick; el país o el ciclo sí pueden volver por separado en otra combinación. Un reroll conserva el contexto activo y sustituye la oferta por candidatos no vistos de esa celda.

En móvil, tocar una opción abre su detalle; no la selecciona. El jugador debe usar `Elegir` para confirmar el pick, de modo que puede revisar química, rasgo y penalización de posición sin riesgo de una selección accidental.

En la partida libre, la acción principal después del resultado es iniciar otra partida libre.

El resultado presenta primero la squad construida; el puntaje y su desglose permanecen accesibles sin desplazarla.

Junto al puntaje se ve un resumen; “¿Por qué?” expande el desglose en esa misma pantalla.

Una partida tiene 11 picks: los picks 4 y 8 son rolls especiales de cinco opciones; los demás muestran tres. Todas las opciones respetan el contexto país–ciclo mundial del roll correspondiente.

La run genera al inicio un plan reproducible de oportunidades: cada primaria recibe tres candidatos en rolls distintos dentro de contextos compatibles. La protección guía la selección de contexto; no rompe su identidad temática. POR, LD y LI reservan su tercera oportunidad para un orden sorteado entre los picks 9–11.

Antes de elegir una oferta, el jugador puede gastar un único scouting para anticipar el roll siguiente.

Una interrupción no descarta la partida: se reanuda desde el mismo estado; el Draft diario puede reanudarse hasta el cierre de ese día.

## Criterio de aprobación

El loop mínimo solo será válido si una persona termina una run, puede explicar su Squad Score y voluntariamente inicia otra porque quiere mejorar una decisión, probar una build diferente o comparar su mérito bajo condiciones equivalentes.
