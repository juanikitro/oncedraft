# Métricas y eventos de aprendizaje

## Propósito

Medir si el loop genera decisiones comprensibles y repetición voluntaria. No usar métricas de alcance como prueba de diversión.

## Señales iniciales

| Señal | Criterio inicial | Por qué importa |
| --- | --- | --- |
| Repetición voluntaria | Al menos 40% de quienes completan una partida libre inicia otra en la misma sesión, sin incentivo externo | Prueba directa del loop principal |
| Finalización de primera partida | Al menos 55% de quienes ven el primer roll llega a resultado | Evita aprobar repetición sobre un onboarding débil |
| Ofertas estructuralmente dominadas | Máximo 15% de las ofertas observadas | Detecta si el contenido o el generador eliminan el trade-off antes de decidir añadir filtros |

## Señal cualitativa mínima

Al terminar la primera run se registra una única respuesta abierta: **“Si jugaras otra vez, ¿qué decisión cambiarías y por qué?”**. La respuesta busca evidencia de comprensión, de un trade-off recordable y de una motivación intrínseca para repetir; no se usa como métrica de vanidad ni como encuesta extensa.

Estas señales se aplican cuando exista una prueba con jugadores. La primera evaluación de la vertical slice es una revisión manual del propietario y usa el checklist de `VERTICAL_SLICE.md`.

## Eventos iniciales

| Evento | Datos de producto mínimos | Pregunta que responde |
| --- | --- | --- |
| `partida_iniciada` | modo, seed, primera_partida | ¿Qué modo inicia el jugador? |
| `roll_mostrado` | índice de pick, tipo normal/especial, identificadores de opciones | ¿Qué oportunidades recibió? |
| `carta_elegida` | índice de pick, carta, plaza elegida, OVR resultante | ¿Qué trade-offs aceptó? |
| `reroll_usado` | índice de pick, tipo/tamaño de oferta, cartas descartadas, oferta nueva y carta elegida después | ¿El reroll agrega una decisión valiosa o es un rescate automático? |
| `scouting_usado` | índice de pick, nivel de informe, carta/información descrita, resultado del roll siguiente | ¿El informe altera una decisión? |
| `partida_completada` | modo, puntaje, OVR posicional, química, rasgos, duración | ¿Cómo se distribuyen resultados y builds? |
| `partida_abandonada` | último pick completado, última ayuda contextual mostrada | ¿Dónde y después de qué información se abandona? |
| `resultado_visto` | puntaje, estado de récord, desglose expandido | ¿El jugador revisa y entiende el resultado? |
| `jugar_otra_partida` | modo anterior, tiempo desde resultado | ¿Inicia otra partida voluntariamente? |
| `squad_compartida` | tipo de imagen, puntaje, modo | ¿La squad es un artefacto social natural? |
| `oferta_clasificada` | índice de pick, tipo, clasificación de dominancia, cartas y estado de squad | ¿La oferta dejaba una alternativa inequívocamente superior con la información disponible? |

## Estados

Los nombres son de trabajo y no implican arquitectura, proveedor de analítica ni esquema de almacenamiento.
