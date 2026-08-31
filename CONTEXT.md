# Once Draft

Lenguaje canónico del dominio para describir futbolistas, cartas, versiones históricas y partidas sin mezclar hechos reales con valores de juego.

La identidad pública del producto es **Once Draft**. `draft` se conserva en este documento como término de mecánica: no es el nombre anterior del producto.

## Draft

**Roll**:
Proceso que determina los parámetros de una situación de draft y genera una oferta.
_Evitar_: oferta, carta

**Oferta**:
Conjunto visible de tres o cinco opciones producido por un roll y presentado para una única elección.
_Evitar_: roll, opción individual

**Opción**:
Una carta candidata dentro de una oferta.
_Evitar_: oferta completa

**Confirmación de pick**:
Acción explícita `Elegir` dentro del detalle de una opción. Es el único gesto que consume una opción y resuelve el contexto activo.
_Evitar_: toque inicial, vista de detalle

**Contexto de roll**:
Combinación de país y ciclo mundial determinada por un roll; todas las opciones de su oferta deben coincidir con ambos valores.
_Evitar_: club, química otorgada automáticamente

**Contexto agotado**:
Contexto de roll ya resuelto mediante una elección; no puede iniciar otro pick de la misma run. Un reroll de su oferta activa no constituye un nuevo contexto.
_Evitar_: país agotado, ciclo mundial agotado

**Reroll contextual**:
Reemplazo de la oferta activa por candidatos no vistos del mismo país y ciclo mundial.
_Evitar_: nuevo roll, escape de contexto

## Contenido

**Futbolista**:
Persona real cuya carrera puede originar una o más versiones históricas de carta.
_Evitar_: carta, versión

**Versión histórica**:
Representación de un futbolista durante una temporada concreta, con club, imagen, posiciones y contexto correspondientes a esa etapa. En el MVP existe una sola por futbolista; el modelo permite más en el futuro.
_Evitar_: resumen de carrera, jugador genérico

**Carta**:
Elemento jugable que materializa una versión histórica y añade valores editoriales propios como OVR y rasgo.
_Evitar_: futbolista, perfil completo de carrera

**Temporada de referencia**:
Temporada concreta que delimita qué evidencia histórica, club, imagen y posiciones corresponden a una versión histórica.
_Evitar_: mejor época, prime indeterminado

**Identidad visual de versión**:
Correspondencia entre la imagen del futbolista, la camiseta, el club y la temporada de referencia de una carta.
_Evitar_: foto icónica de otra etapa, camiseta intercambiable

**Ciclo mundial**:
Segmento temporal fijo de 16 años que agrupa cuatro ediciones consecutivas de la Copa del Mundo y se deriva de la temporada de referencia. Los ciclos iniciales son 1962–1977, 1978–1993, 1994–2009 y 2010–2025.
_Evitar_: década, temporada, carrera

**OVR**:
Valor editorial estable de 70 a 100 que representa la fuerza de una versión dentro del universo histórico elegible del producto, a partir del nivel y dominio demostrados en su temporada y contexto. Usa enteros repetibles.
_Evitar_: estadística objetiva, rating importado, promedio de carrera, posición relativa al pool actual

**Posición secundaria**:
Rol alternativo explícito de una carta, limitado a dos y admitido cuando el futbolista lo desempeñó realmente de forma reconocible en su carrera. No exige que sea el rol dominante de la temporada de referencia. Resta 4 OVR al ubicarse en esa plaza.
_Evitar_: versatilidad inventada, compensación de cuotas

**Marcador de química**:
Dato compacto y siempre visible de una carta que identifica su nacionalidad, club o ciclo mundial para evaluar conexiones antes de elegir.
_Evitar_: dato histórico secundario, detalle oculto

**Banda de OVR**:
Categoría editorial de nivel histórico usada para ubicar una versión antes de asignarle un OVR exacto.
_Evitar_: rareza de carta, fórmula estadística

**Carta ancla**:
Versión histórica de referencia contra la que se calibran otras versiones de posición, época o nivel comparables.
_Evitar_: carta obligatoria, mejor carta absoluta
