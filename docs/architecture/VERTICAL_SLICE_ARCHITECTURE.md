# Arquitectura propuesta — Vertical slice

## Estado

Arquitectura aprobada para implementación de la vertical slice. Define límites y responsabilidades de la primera versión; no adelanta Draft diario, economía, simulación o PvP.

## Objetivo técnico

Entregar una PWA móvil que permita jugar una partida libre de punta a punta, conservar temporalmente el progreso de invitado y, de forma opcional, asociarlo a una cuenta con usuario y contraseña. Debe sostener el loop diseñado sin que el cliente sea el único diseño posible para la futura competencia justa.

## Stack decidido

- **PWA:** React con Vite y TypeScript.
- **API propia:** Fastify con TypeScript.
- **Persistencia:** PostgreSQL.

El ORM, el proveedor de hosting y la librería concreta de migraciones se elegirán durante el bootstrap, únicamente si aportan una necesidad comprobable a esta arquitectura. No alteran los límites de dominio aprobados.

## Principios

- Una partida debe responder de inmediato en móvil; no se hace una llamada de red por cada elección.
- La aleatoriedad se expresa mediante una seed y reglas reproducibles; no mediante valores opacos dispersos por la interfaz.
- La partida libre no requiere verificación competitiva. El Draft diario sí la requerirá cuando entre en scope.
- La API conserva datos de usuario y aplica reglas de acceso. No se incorporan economía, compras, PvP, simulación ni ranking en la slice.
- El sistema debe poder explicarse con los conceptos de producto: jugador, run, seed, acción, colección, récord y cuenta.

## Límites del sistema

```text
PWA móvil
  ├─ interfaz de juego y caché de aplicación
  ├─ perfil temporal de invitado
  ├─ motor determinista de draft y score
  └─ acciones/snapshot de la run
           │ sincroniza cuando hay sesión o conexión
           ▼
API propia
  ├─ identidad, sesión y transición invitado → cuenta
  ├─ progreso: colección, récord y run activa
  ├─ catálogo de cartas habilitadas para la slice
  └─ validación de acceso y contratos del producto
           ▼
PostgreSQL
  ├─ usuarios y credenciales protegidas
  ├─ progreso de cuenta
  ├─ runs y acciones/snapshots necesarios
  └─ catálogo/versionado de contenido
```

La PWA y la API son un solo producto desplegable desde la perspectiva del usuario, pero mantienen estas responsabilidades separadas. No se proponen microservicios.

## Responsabilidades por capa

### PWA

- Mostrar landing, draft, selección de posición, resultado, colección y compartir, conforme a `VERTICAL_SLICE.md`.
- Ejecutar el motor de reglas de manera local para que una decisión no dependa de latencia.
- Mantener un perfil de invitado y la partida activa localmente.
- Sincronizar el estado autenticado y resolver reintentos sin perder progreso.
- Presentar datos explicables: OVR por posición, química, traits y desglose de score.

La PWA no es fuente de verdad competitiva: cualquier dato que llegue del dispositivo es apto para partida libre, no para ranking futuro sin verificación.

### Motor de juego determinista

Entradas mínimas: versión del catálogo, seed de run y secuencia ordenada de acciones del jugador (elección, reroll, scouting, colocación y reorganización).

Salidas mínimas: oferta actual, estado del equipo, usos restantes, información de scouting, score y explicación del score.

Invariantes:

- La misma versión de contenido, seed y acciones producen el mismo resultado.
- Cada roll produce un contexto país–ciclo mundial y la oferta contiene únicamente versiones compatibles.
- Un contexto país–ciclo no se repite dentro de una run; país y ciclo pueden reaparecer en otra combinación.
- Un reroll conserva el contexto activo y solo usa cartas no vistas de su misma celda.
- No se repite una carta dentro de una run.
- Se cumplen las protecciones posicionales aprobadas.
- El score proviene exclusivamente de las reglas documentadas, no de cálculos visuales.

El motor no conoce pantallas, sesiones, HTTP ni PostgreSQL. Así puede reproducirse luego en el servidor para Draft diario.

### API propia

- Crear cuenta e iniciar/cerrar sesión.
- Aplicar límites y validaciones de identidad; nunca recibe ni guarda contraseñas en texto plano.
- Leer y guardar progreso de la cuenta: colección, récord y run activa.
- Recibir y resolver la fusión idempotente del perfil temporal con la cuenta.
- Entregar la versión del catálogo necesaria para iniciar o reanudar una partida.

La API no añade todavía endpoints de ranking, compra, recompensas, matchmaking ni simulación.

### PostgreSQL

La primera migración de dominio solo debe cubrir:

- `usuarios`: identidad y fechas necesarias.
- `credenciales`: identificador de usuario y hash de contraseña; nunca contraseña recuperable.
- `progreso`: récord personal y datos de cuenta derivados.
- `coleccion_descubierta`: relación usuario–carta descubierta.
- `runs`: seed, versión de catálogo, estado/snapshot y ciclo de vida de una partida.
- `cartas`: catálogo de 151 cartas de la vertical slice y sus atributos de diseño.

Los nombres son conceptuales, no una prescripción de tablas o columnas. Las futuras entidades de economía, Draft diario, ranking, partidas y PvP no entran en este esquema inicial.

## Identidad y progreso

1. La landing permite jugar sin cuenta y también muestra `Ingresar / Crear cuenta` como acción secundaria.
2. El invitado guarda partida, récord y colección en el dispositivo actual.
3. Tras el primer resultado se ofrece guardar ese progreso, pero el jugador puede seguir jugando como invitado.
4. Al crear cuenta o iniciar sesión, se fusiona sin pérdida: colección = unión, récord = máximo y la run activa temporal se conserva si existe.
5. La fusión debe ser idempotente: repetir una solicitud no duplica ni empeora datos.
6. La slice no ofrece recuperación de contraseña. Debe comunicarse antes de crear la cuenta; esto bloquea una publicación pública sin rediseñar identidad.

## Sesiones y seguridad mínima

- Contraseñas con un algoritmo de hash lento y moderno, con salt; nunca se registran ni se devuelven.
- Sesión con credenciales seguras, expiración y cierre de sesión; no se guarda la contraseña en el navegador.
- Nombre de usuario único y normalizado antes de persistirlo, con mensajes que no expongan datos innecesarios.
- Límites de intentos y protección básica contra abuso en creación e inicio de sesión.
- Autorización estricta: una cuenta solo lee/escribe sus propios progreso, colección y runs.
- Validación de entradas y versionado del contrato de API desde el inicio.

Estas medidas son el mínimo de una cuenta propia. No sustituyen recuperación, verificación de correo, moderación de nombres ni políticas de privacidad de una publicación abierta.

## Persistencia y conectividad

Supuesto propuesto para la slice: experiencia online-first, con caché de PWA y continuidad local de una run ya iniciada. Si la conexión se corta, la interfaz no pierde la decisión; sincroniza al recuperar red o al iniciar sesión. No se promete inicialmente que una cuenta pueda iniciar una nueva run sin conexión ni que el progreso temporal sobreviva borrar datos del navegador.

Este supuesto conserva el foco de la slice. Si se prioriza una experiencia completamente offline, debe aprobarse como una decisión adicional porque aumenta la complejidad de contenido, caché y sincronización.

## Integridad presente y futura

| Capacidad | Vertical slice | Draft diario futuro |
| --- | --- | --- |
| Partida libre | Motor local y persistencia de progreso | Igual |
| Seed | Reproducible y guardada con la run | Seed diaria compartida |
| Resultado | Útil para récord personal; no competitivo | Reproducido/verificado en servidor |
| Datos del cliente | Se aceptan como estado de experiencia | No se aceptan sin validación |
| Ranking | Fuera de scope | Requiere reglas antiabuso y envío autoritativo |

## Fuera de alcance explícito

- Draft diario, leaderboard o premiación.
- Economía, venta de rerolls/scoutings, pagos o publicidad.
- Partidos simulados, torneos, PvP asincrónico y matchmaking.
- Recuperación de contraseña, correo, proveedores sociales o perfiles públicos.
- Telemetría de producción completa; los eventos de aprendizaje ya definidos se conectarán cuando se implemente la slice.
- Negociación y validación de licencias: el proyecto las considera cubiertas. Sí entra el pipeline técnico para descargar, normalizar, versionar y servir imágenes y escudos reales.

## Riesgos y límites de salida

1. **Cuenta sin recuperación.** Apta solo para evaluación controlada; no para lanzamiento público.
2. **Backend propio.** Debe mantenerse pequeño: autenticar, persistir y proteger datos, no anticipar producto futuro.
3. **Contenido real inconsistente.** Cada carta necesita una versión histórica inequívoca y procedencia por dato/activo; encontrar una imagen en internet no garantiza estabilidad, calidad ni correspondencia temporal.
4. **Partida libre alterable.** No presentar récords de cliente como resultados competitivos.
5. **Pérdida local.** El invitado puede perder estado al borrar datos; la interfaz lo debe dejar claro al ofrecer cuenta.

## Primera entrega técnica propuesta

1. Esqueleto PWA móvil y catálogo interno de 151 cartas.
2. Motor determinista con una run completa, protecciones, reroll, scouting y score explicable.
3. Persistencia local de invitado, reanudación y personal best.
4. API propia + PostgreSQL: cuenta, sesión, progreso, colección y fusión idempotente.
5. Flujo completo del vertical slice, share image y los eventos de medición esenciales.

Cada punto debe validarse en móvil antes de sumar el siguiente. No se agrega el Draft diario hasta comprobar que el loop libre genera repetición voluntaria.

## Estructura de repositorio aprobada

La implementación usa `npm workspaces`, aprovechando el runtime ya disponible y sin introducir un gestor adicional. La estructura mínima es:

```text
apps/
  web/          # React + Vite + PWA mobile-first
  api/          # Fastify
packages/
  game-core/    # motor determinista y tipos de run
  catalog/      # catálogo validado y versión de contenido
assets/
  source/cards/ # originales curados, nunca hotlinks de runtime
```

`game-core` no depende de React, Fastify, PostgreSQL ni del navegador. `catalog` puede depender de sus tipos para validar cartas, pero no de pantallas o HTTP. Las aplicaciones importan ambos paquetes y conservan sus responsabilidades de interfaz o persistencia. No se crea un paquete de contratos separado hasta que exista una duplicación real que lo justifique.

## Pipeline de datos y activos reales

- **Metadatos históricos:** cada versión se ancla a una temporada de referencia. Importar o registrar nombre, nacionalidad, club, temporada, ciclo mundial derivado (1962–1977, 1978–1993, 1994–2009 o 2010–2025) y posiciones observadas desde fuentes estructuradas; conservar fuente y fecha de consulta.
- **Curaduría de gameplay:** elegir la temporada por mérito y reconocimiento histórico, usando necesidades de química solo como desempate entre versiones comparables. Asignar OVR, posiciones secundarias y rasgo con una rúbrica propia y revisión manual. El OVR traduce nivel y dominio demostrado en la temporada/contexto a una escala común; no usa estadísticas brutas entre épocas como equivalencia directa. Estos campos son editoriales, no hechos universales.
- **Imágenes y escudos:** descargar archivos donde el futbolista vista la camiseta del club de su temporada de referencia; registrar URL/proveedor, normalizar tamaño/formato/encuadre y servir copias controladas. No usar imágenes de selección u otra etapa ni depender de hotlinks en runtime.
- **Control de calidad:** validar que imagen, escudo, club, posiciones y ciclo mundial correspondan a la temporada concreta de la carta; impedir registros incompletos antes de incorporarlos al catálogo activo.
- **Versionado:** una run conserva la versión del catálogo con la que empezó para que cambios editoriales posteriores no alteren su reproducción.

## Criterio para empezar implementación

La implementación puede empezar con este documento, incluido su supuesto online-first y el stack decidido. Las decisiones concretas de bootstrap (ORM, migraciones y hosting) deben preservar las decisiones anteriores, no reabrir el diseño de juego.
