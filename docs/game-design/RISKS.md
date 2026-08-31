# Riesgos y pre-mortem

## Estado

Pre-mortem inicial basado en el GDD. Se actualizará al tomar decisiones.

| Si el producto fracasa, podría ser porque… | Señal temprana | Mitigación a validar |
| --- | --- | --- |
| El draft se siente superficial | Se elige el OVR mayor sin deliberación | Reducir atributos y diseñar trade-offs visibles |
| Las ofertas temáticas generan elecciones dominadas | Una carta es claramente mejor que las demás en demasiados rolls país–ciclo | Medir frecuencia de dominancia y ajustar curaduría o filtro mínimo sin romper el contexto |
| El RNG determina resultados | Jugadores atribuyen el resultado al contexto o carta recibida | Medir primero la agencia del reroll contextual, scouting, posiciones, club y traits; no añadir control extra de contexto sin evidencia |
| El generador muestra patrones reconocibles entre runs | Seeds distintas repiten demasiado los mismos contextos u ofertas y el jugador anticipa el guion | Probar diversidad de contextos, cartas y builds sobre muchas seeds; corregir el generador, no maquillar la interfaz |
| La protección posicional guioniza el draft o falla al final | Aparecen oportunidades forzadas demasiado pronto, o una run termina sin POR/LD/LI | Contar oportunidades distintas por categoría pendiente, mantener el contexto país–ciclo y ejecutar simulaciones de cobertura antes de ajustar su urgencia |
| La protección evita imposibles pero no alcanza una 4-3-3 completa | Incluso una heurística que prioriza cobertura termina con plazas pendientes | La línea base interna marca 0,508 plazas pendientes por run para esa heurística; probar con jugadores y ajustar el planificador solo si el problema se confirma |
| Hay demasiadas reglas | Abandono o confusión antes de terminar | Introducción progresiva y systems mínimos |
| La curva depende de trivia de fútbol real | Participantes sin conocimiento previo no pueden justificar picks | Diseñar señales y reglas autocontenidas |
| “Todas las variables” se vuelve sobrecarga | El jugador tarda mucho o no puede explicar un pick | Limitar variables, mantenerlas visibles y validar una capa por vez |
| El scouting revela datos que no sirven | Se gasta el recurso pero no cambia ningún pick | Limitar las clases de información a señales accionables y comparar uso contra resultado |
| El informe exacto decide la run | Una carta revelada explica la mayor parte de scores altos o la percepción de victoria | Medir su impacto real y limitar probabilidad, número de usos o poder resultante |
| El ranking compara oportunidades desiguales | El score depende más de seed o contenido recibido que de decisiones | Separar la comparación justa de las runs libres y validar con seeds comunes |
| El Daily Seed se resuelve con una sola respuesta | Los squads y picks líderes convergen demasiado | Analizar variedad de decisiones y revisar reglas que hagan dominante una build |
| El score no se siente como un final | Buena completion rate pero baja tasa de `play again` y feedback de final anticlimático | Validar el score antes de añadir simulaciones que oculten el problema |
| Los modos bloqueados distraen | Usuarios intentan abrirlos o postergan la primera run | Mantenerlos secundarios y validar que no reduzcan inicio/completion de runs |
| Multiplicadores y umbrales vuelven opaco el score | Jugadores no pueden prever cambios ni explicar resultados | Mostrar desglose por capas y limitar el número de reglas que se combinan |
| Química y sinergias se perciben como lo mismo | Los jugadores no pueden explicar qué regla causó cada bonus | Mostrar fuentes y efectos separados; validar con pruebas de comprensión |
| Tres fuentes de química saturan la primera run | El jugador no puede leer por qué gana o pierde química | Presentar progresivamente y validar la comprensión en móvil |
| Las conexiones no cambian decisiones | Los jugadores ignoran nacionalidad, club y ciclo mundial al elegir | Ajustar su escala antes de añadir fuentes o reglas nuevas |
| El bonus de química domina el OVR | Squads conectadas de menor calidad ganan siempre | Definir un tope moderado y contrastarlo contra picks de OVR alto |
| El +5% es arbitrario o no se siente | La química no altera picks o el máximo domina el score | Tratar la cifra como hipótesis y calibrarla con decisiones representativas |
| Fuera de posición deja de ser una elección | La penalización de OVR hace que nunca convenga | Probar severidad antes de añadir otra capa de castigo |
| Traits equivalentes producen falsa profundidad | Da igual qué build se complete mientras alcance el mismo umbral | Medir si el conteo simple cambia picks; añadir condiciones solo si la evidencia lo exige |
| No hay deseo de repetir | Baja tasa de `play again` | Validar el loop sin metaprogresión que lo maquille |
| El contenido real contiene errores o versiones históricas mezcladas | Club, ciclo mundial, posición o imagen no corresponden a la carta representada | Fuente por campo, revisión manual y versión concreta por jugador |
| Las imágenes obtenidas de internet son frágiles o inconsistentes | Enlaces rotos, hotlink bloqueado, baja resolución, encuadres y formatos incompatibles | Descargar, normalizar y servir activos propios con manifiesto de procedencia; las licencias se consideran cubiertas por premisa del proyecto |
| El scope se expande | Partidos, social y economía se suman antes de validar | Mantener clasificación MUST/SHOULD/LATER/NO |
| La primera partida sobrecarga | Confusión, abandono o uso erróneo de recursos antes del resultado | Usar las reglas reales con ayudas contextuales breves y medir abandono por pick |
| El pool de 151 cartas retrasa la validación | Curaduría, imágenes y verificación histórica bloquean la primera prueba de draft | Curar por celdas y validar la cobertura del catálogo, sin rebajar silenciosamente las reglas del modo temático |
