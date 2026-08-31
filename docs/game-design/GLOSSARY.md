# Glosario

## Estado

Definiciones canónicas del MVP. Los conceptos de modos y expansiones futuras se mantienen identificados como posteriores.

| Término | Definición de trabajo |
| --- | --- |
| Run | Intento autocontenido de construir una squad y obtener un resultado. |
| Draft | Secuencia de situaciones en la que el jugador recibe opciones y elige una. |
| Roll | Proceso que determina los parámetros de una situación de draft y genera una oferta. No es el conjunto de cartas resultante. |
| Oferta | Conjunto visible de tres o cinco opciones producido por un roll y presentado para una única elección. |
| Opción | Una carta candidata dentro de una oferta. |
| Contexto de roll | Combinación de país y ciclo mundial que restringe todas las opciones de una oferta. El país corresponde a la nacionalidad de la versión; el club no forma parte del contexto. |
| Contexto agotado | Pareja exacta país–ciclo mundial ya resuelta mediante una elección. No inicia otro pick de la run, aunque el país pueda reaparecer con otro ciclo. Un reroll de la oferta activa no constituye un contexto nuevo. |
| Squad | Conjunto de jugadores elegido durante una run. |
| OVR | Valoración editorial estable de 70 a 100, en enteros repetibles, que traduce el nivel y dominio demostrados por una versión a su fuerza dentro del universo histórico elegible del producto. No se recalcula al cambiar el pool; no es una estadística objetiva, promedio de carrera ni rating importado. |
| Banda de OVR | Categoría editorial de nivel histórico que ordena una versión antes de asignarle un número exacto; no es una rareza visible de carta. |
| Carta ancla | Versión de referencia utilizada para calibrar OVR de otras versiones comparables por posición, época o nivel. |
| Posición | Rol de un jugador o plaza de la formación. Afecta solo el OVR base: la primaria conserva todo el OVR, la secundaria resta 4 OVR y las demás plazas restan 10 OVR. |
| Posición primaria | Posición de mejor encaje de una carta; conserva su OVR base completo. |
| Posición secundaria | Posición alternativa explícita de una carta; puede usarse con una penalización de 4 OVR. Una carta puede tener hasta dos, únicamente cuando el futbolista desempeñó realmente ese rol de forma reconocible en su carrera; no exige que fuera el rol dominante de la temporada representada. |
| Plaza de formación | Uno de los once destinos de la 4-3-3: POR, LD, DFC, LI, MC, ED, DC o EI; DFC y MC aparecen más de una vez. |
| Protección posicional | Plan reproducible del generador que asegura al menos tres jugadores primarios distintos en tres rolls distintos por categoría. No obliga a elegirlos ni bloquea otras posiciones; POR, LD y LI reservan su tercera oportunidad para el cierre en orden sorteado. |
| Categoría cubierta | Estado de una posición cuando el plantel puede llenar todas sus plazas con jugadores de posición primaria o secundaria; por ejemplo, dos DFC y tres MC. |
| Reorganización | Movimiento libre de cartas entre plazas de la formación durante una partida; no consume recursos en el MVP. |
| Colocación automática | Ubicación inicial de una carta recién elegida en la mejor plaza libre: primero su primaria, luego una secundaria y, por último, la plaza libre con mayor OVR efectivo. No sustituye la reorganización manual. |
| Contexto futbolístico | Atributo de relación entre jugadores que alimenta química; inicialmente nacionalidad, club y ciclo mundial. |
| Contenido oficial real | Jugadores, clubes, escudos e imágenes reales utilizados bajo las autorizaciones aplicables. |
| Futbolista | Persona real cuya carrera puede originar una o más versiones históricas. No es sinónimo de carta. |
| Versión histórica | Representación de un futbolista durante una temporada concreta, con club, imagen, posiciones y contexto correspondientes a esa etapa. En el MVP hay una sola por futbolista; el modelo permite varias en el futuro. |
| Temporada de referencia | Temporada concreta que delimita la evidencia histórica utilizada para una versión. El ciclo mundial visible de química se deriva de ella. |
| Identidad visual de versión | Coherencia obligatoria entre foto, camiseta, club y temporada de referencia. Se prioriza que el jugador sea reconocible por rostro o silueta; excepcionalmente se admite una toma de espaldas si la camiseta y el dorsal lo identifican de forma inequívoca. Una imagen de selección u otro club no representa una versión de club distinta. |
| Sin repetición por partida | Regla que impide que una misma versión histórica aparezca más de una vez dentro de una partida, incluso tras reroll. |
| Carta descubierta | Carta registrada en la colección visual al aparecer en cualquier oferta de draft; no otorga poder persistente. |
| Confirmación de pick | Acción explícita `Elegir` que selecciona una carta desde su detalle. Tocar una opción solamente abre información y nunca consume un pick. |
| Ciclo mundial | Segmento temporal fijo de 16 años que agrupa cuatro Copas del Mundo consecutivas. Los ciclos iniciales son 1962–1977, 1978–1993, 1994–2009 y 2010–2025; comparte química con cartas del mismo ciclo y restringe el roll. |
| Química | Multiplicador del puntaje de equipo derivado de nacionalidad, club y ciclo mundial: `1 + (conexiones / 33 × 5%)`, con tope de +5%. |
| Conexión de química | Punto aportado por un jugador al compartir nacionalidad, club o ciclo mundial con al menos un compañero. Cada fuente cuenta como máximo una vez por jugador. |
| Marcador de química | Identificador compacto y siempre visible de nacionalidad, club o ciclo mundial en una opción de draft. Permite evaluar conexiones sin abrir detalles. |
| Rasgo (trait) | Etiqueta mecánica amplia de estilo. Cada jugador tiene uno; tres copias activan +1 punto y cinco activan +3 en su lugar. El catálogo inicial es Rematador, Creador, Técnico, Velocista, Físico y Muro defensivo. |
| Tabla de rasgo | Información visible que muestra los umbrales comunes de +1 a tres y +3 a cinco durante una partida. |
| Sinergia | Bonus fijo del Squad Score que se activa al alcanzar un umbral de traits. |
| Scouting | Recurso de anticipación único activable antes de elegir una oferta; revela un informe de potencia aleatoria sobre el roll inmediatamente siguiente y puede revelar una carta exacta en casos excepcionales. |
| Informe invalidado | Informe de scouting que deja de aplicar cuando el jugador rerollea la oferta anticipada. |
| Rareza de scouting | Uno de cuatro niveles de potencia/probabilidad de un informe; se comunica con color e indicador adicional propios. El máximo revela una carta exacta con probabilidad inicial de 5%. |
| Perfil sin identidad | Informe de scouting que revela OVR, posición, rasgo, nacionalidad, club y ciclo mundial de una carta del próximo roll, sin mostrar su nombre ni imagen. |
| Ranking | Clasificación comparativa de resultados. Su criterio de justicia y modalidad siguen abiertos. |
| Puesto compartido | Regla de ranking por la que jugadores con el mismo puntaje visible ocupan la misma posición. |
| Reroll | Recurso único por partida que reemplaza toda la oferta actual: tres cartas en un roll normal o cinco en uno especial. |
| Reroll contextual | Reroll que conserva el país y ciclo mundial de la oferta activa y muestra candidatos no vistos de esa misma celda. |
| Oportunidad consumida | Aparición protegida que ya cuenta para la garantía, incluso cuando el jugador la descarta mediante reroll. |
| Refresh | Término reservado para una posible sustitución de opciones dentro de una situación. No forma parte del MVP; el mecanismo activo es el reroll contextual. |
| Puntaje de equipo | Resultado explicable: promedio de los 11 OVR efectivos, multiplicado por `1 + (conexiones / 33 × 5%)`, más bonos de rasgos. Se muestra con un decimal y puede superar 100. |
| Build | Patrón reconocible de composición de squad que resulta de decisiones compatibles; su peso en el producto sigue abierto. |
| Seed | Identificador reproducible de una secuencia de condiciones de una run. |
| Draft diario | Modo competitivo diario con oportunidades equivalentes y deterministas según seed y acciones; habilita el ranking principal. |
| Intento competitivo | Única partida de un Draft diario que puede afectar su ranking. |
| Repetición no rankeada | Repetición de un Draft diario después del intento competitivo; sirve para aprendizaje o exploración y no cambia la tabla. |
| Récord personal | Mejor resultado individual permanente. No forma parte del ranking competitivo del Draft diario; el resultado muestra si se supera o la diferencia exacta. |
