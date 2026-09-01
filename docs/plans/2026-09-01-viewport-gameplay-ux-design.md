# UX de jugabilidad centrada en viewport

## Estado

Diseño aprobado el 2026-09-01. Este documento cubre solo el juego: no modifica
la landing ni las reglas del motor, el catálogo, los recursos o la fórmula de
puntaje.

## Objetivo

Convertir la experiencia de draft en una interfaz sin scroll de página, donde
la pizarra sea el hogar principal de la partida y la oferta sea un momento de
decisión a pantalla completa.

## Principios

1. Una pantalla, una tarea dominante. La pizarra sirve para componer el
   equipo; la oferta para decidir una carta.
2. La decisión debe poder probarse antes de confirmarse, sin debilitar el
   riesgo del draft.
3. Química y traits explican, pero no compiten con la cancha ni la carta.
4. El CTA principal mantiene el ritmo: confirma una prueba válida y abre la
   siguiente opción en el mismo gesto.
5. No se modifica el estado persistido de la run hasta que se confirme una
   incorporación.

## Arquitectura de viewport

Todos los estados usan `100dvh`, respetan las safe areas del dispositivo y no
permiten scroll vertical. Cuando una explicación no entra, se separa en vistas
compactas, no en un panel desplazable.

### Pizarra

- Cabecera mínima con `Elección n / 11` y progreso.
- Cancha 4-3-3 como superficie dominante.
- Card táctica compacta, anclada sin tapar plazas: multiplicador/conexiones de
  química, contexto país-club-ciclo y un resumen de traits.
- `Analizar` abre una capa con las vistas `Química` y `Traits` y vuelve a la
  pizarra al cerrarse.
- Un dock inferior fijo contiene el CTA principal.

En pantallas anchas, la card táctica puede convertirse en una columna lateral;
la cancha conserva la jerarquía principal.

### Oferta

La oferta reemplaza completamente la pizarra para aprovechar el viewport.

- Cabecera con progreso y recursos actuales (`Explorar`, `Repetir`).
- En móvil, una carta grande por vez con controles explícitos `1 / n`, anterior
  y siguiente; una tira fija compara OVR, posición y trait de toda la oferta.
  No se usa scroll de página.
- En pantallas anchas, las tres cartas se muestran comparables a la vez.
- Los recursos se separan visualmente de las cartas para no competir con la
  decisión.
- Tocar una carta abre la pizarra en modo prueba; no confirma la elección.

## Flujo de una elección

```text
Pizarra
  -> Siguiente opción
Oferta + recursos
  -> tocar carta
Pizarra con carta en prueba
  -> Cancelar prueba -> misma oferta
  -> Siguiente opción -> confirma ubicación y abre la oferta siguiente
```

### Estados

#### Pizarra lista

El CTA fijo `Siguiente opción` abre la oferta del pick actual.

#### Oferta activa

Conserva los contratos actuales de recursos. `Explorar` no confirma una carta.
`Repetir` mantiene su confirmación y, al ejecutarse, reemplaza la oferta de
manera irreversible según las reglas actuales.

#### Carta en prueba

La carta se renderiza en una plaza elegida, pero es una simulación: la run no
incorpora la carta ni persiste ese cambio. Se puede mover entre plazas y el
OVR efectivo, la química y los traits se recalculan visualmente. La card
táctica debe decir `Simulación · sin confirmar`.

La ficha secundaria de la carta se abre desde la carta probada y no altera su
ubicación ni confirma el pick.

#### Cancelar prueba

Regresa a la misma oferta con sus cartas y recursos en el último estado
válido. No restaura recursos que ya fueron consumidos ni revierte un reroll.

#### Confirmar y avanzar

Durante una prueba, `Siguiente opción` se habilita solo cuando existe una
plaza válida. La acción se acompaña del texto contextual `Confirma a [nombre]
en [plaza]`. Un toque bloquea el doble envío, confirma la incorporación y abre
inmediatamente la oferta siguiente, sin una confirmación intermedia.

## Información táctica e inspección

La card táctica compacta muestra la información de decisión rápida; color
nunca es el único indicador. `Analizar` presenta el desglose sin scroll:

- **Química:** conexiones, máximo y capas país, club y ciclo.
- **Traits:** conteo, umbral y bonus activo.

La inspección de una carta conserva los datos canónicos (posición primaria y
secundarias, OVR, club, temporada y trait) y funciona como una capa de lectura;
nunca modifica la run.

## Criterios de aceptación

- En 360, 390 y 430 px no hay scroll vertical ni contenido esencial fuera del
  viewport.
- La pizarra inicia y sostiene la partida con cancha y resumen táctico legibles.
- `Siguiente opción` abre la oferta; desde una prueba válida confirma la plaza
  y abre la oferta siguiente en una única interacción.
- `Cancelar prueba` restaura exactamente la oferta vigente.
- Durante la prueba, química, traits y OVR representan valores hipotéticos; al
  confirmar, representan la run real.
- `Analizar` e inspección se abren y cierran sin mutar la partida.
- `Explorar` y `Repetir` conservan sus reglas y estados agotados actuales.
- La landing queda fuera del cambio.

## Validación prevista

- Pruebas de flujo: abrir oferta, probar carta, moverla, cancelar, elegir otra,
  confirmar y avanzar; además de explorar y repetir.
- Pruebas de no mutación: inspeccionar, analizar y cancelar no persisten una
  carta ni cambian recursos.
- Revisión visual en 360, 390 y 430 px, más una pantalla ancha.
- Revisión de foco, controles de 44 px y ausencia de scroll de página.

## Implementación esperada

La implementación queda confinada a la superficie web, principalmente
`apps/web/src/App.tsx` y `apps/web/src/styles.css`, y debe reutilizar los
contratos de `@draft/game-core`. La carta en prueba será estado de presentación
local, separado del estado confirmado que actualmente se persiste.

## Refinamiento aprobado: carrusel y simulación (2026-09-01)

- La oferta se recorre con un carrusel horizontal con `scroll-snap`: la carta
  activa queda centrada y se ven las vecinas; no hay botones `Anterior` ni
  `Siguiente`, ni una tira comparativa que compita con la carta.
- El resumen táctico muestra química y OVR efectivo. La química continúa
  dependiendo de país, club y ciclo; al cambiar una plaza, lo que se actualiza
  es el OVR de simulación según la compatibilidad posicional.
- Las miniaturas de la cancha cubren todo el área visual de su plaza y el
  estado `Prueba` se superpone arriba del retrato.
- La confirmación del pick 11 recibe la plaza manual antes de calcular el
  Squad Score; no se calcula un resultado intermedio con una ubicación distinta.
- Traits en el análisis tienen contraste explícito sobre la hoja clara.
