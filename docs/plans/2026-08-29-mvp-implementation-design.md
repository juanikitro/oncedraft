# Plan técnico ejecutable — MVP

## Estado

Diseño técnico aprobado para comenzar la implementación, pero este documento no inicializa dependencias ni contiene código. Sigue la arquitectura de `docs/architecture/VERTICAL_SLICE_ARCHITECTURE.md` y las reglas canónicas de `docs/game-design/`.

## Resultado objetivo

Una PWA mobile-first donde una persona invitada pueda completar una partida libre de 11 picks con el catálogo completo y validado, entender su resultado, conservar localmente run, colección y récord, y volver a jugar. La cuenta propia, API y PostgreSQL completan el MVP después de que ese loop local esté validado.

La primera versión visible no se habilita hasta que las 151 cartas y sus activos requeridos estén completos conforme a DEC-141. Durante el desarrollo se admiten fixtures sintéticas solo en pruebas automatizadas del motor; nunca en una pantalla visible del producto.

## Estructura

```text
apps/
  web/          React, Vite, TypeScript y configuración PWA
  api/          Fastify y límites de cuenta/progreso
packages/
  game-core/    dominio determinista de run
  catalog/      contenido activo y validadores de catálogo
assets/
  source/cards/ originales de imágenes curadas
docs/
  architecture/ decisiones y límites
  game-design/  reglas y contenido canónicos
```

Se usa `npm workspaces`. No se añade un paquete de contratos separado, ORM, biblioteca de estado global, sistema de diseño, telemetría de terceros ni capa de despliegue hasta que una fase lo requiera y se apruebe.

## Contrato de juego

`game-core` recibe una versión de catálogo, una seed y una secuencia ordenada de acciones. Devuelve el estado de la run, oferta activa, recursos, squad y explicación de score.

Acciones iniciales:

- iniciar run;
- usar scouting antes de resolver una oferta;
- usar reroll contextual;
- abrir detalle de opción (sin alterar estado de juego);
- confirmar pick;
- colocar o reorganizar una carta;
- completar run.

Invariantes que se prueban antes de construir pantallas:

- misma seed + mismas acciones = mismo estado;
- no se repite carta ni contexto país–ciclo resuelto;
- la oferta respeta país y ciclo;
- el reroll conserva contexto y usa cartas inéditas;
- la protección posicional cumple oportunidades sin insertar cartas incompatibles;
- el score coincide exactamente con DEC-140;
- una pulsación de detalle no consume una opción; `Elegir` sí.

## Fases de implementación

### Fase 0 — Bootstrap reproducible

Crear el workspace, TypeScript base, scripts de test/lint/build por aplicación y configuración de paquetes. Validar que web, API y paquetes compartidos se resuelven sin dependencias circulares.

### Fase 1 — Catálogo y motor determinista

Modelar cartas, versiones de contenido, run, ofertas, acciones y score en `game-core` y `catalog`. Incluir validadores que rechacen un catálogo activo con menos de 151 cartas, campos editoriales faltantes o activos visuales no verificados. Construir tests de seed, oferta, protección, reroll, scouting, posiciones, traits y score usando fixtures de prueba aisladas.

### Fase 2 — PWA de invitado

Construir landing, draft, detalle con confirmación, formación reorganizable, resultado explicable, récord local y reanudación. Persistir perfil temporal y run activa en almacenamiento local. Configurar manifest, instalación y caché de la aplicación; una run ya iniciada debe sobrevivir a pérdida de conexión sin perder acciones.

### Fase 3 — Catálogo visual completo y QA móvil

Incorporar únicamente el catálogo activo completo y las imágenes/escudos curados. Validar en teléfono o emulación móvil los rolls de tres y cinco, detalle, reorganización, score, primera ayuda contextual, resultado, colección y artefacto compartible. No se publica ni se considera completa mientras falten activos.

### Fase 4 — Cuenta, API y PostgreSQL

Agregar Fastify, PostgreSQL, hash de contraseñas, sesión segura, límites básicos de login, progreso, colección, run activa y fusión idempotente del perfil invitado. Mantener el motor local para partida libre; el servidor persiste y posteriormente podrá verificar runs competitivas.

### Fase 5 — Medición y prueba de loop

Conectar solo los eventos de aprendizaje definidos en `METRICS.md`, incluida clasificación de ofertas dominadas. Ejecutar revisión manual del propietario y pruebas con jugadores. No sumar Draft diario, economía, simulación ni PvP antes de revisar completion, repetición y comprensión del score.

## Orden y gates

Las fases 0 y 1 pueden avanzar mientras continúa la curaduría visual. La fase 2 puede construirse con el motor y pruebas, pero no mostrar cartas incompletas. La fase 3 exige el catálogo/activos finalizados. La fase 4 no bloquea una prueba local controlada, pero sí es requisito antes de ofrecer cuentas. La fase 5 decide si el loop merece expansión.

## Riesgos técnicos a controlar

- No convertir estado del navegador en fuente competitiva de verdad.
- No permitir que cambios de catálogo alteren una run iniciada: toda run conserva versión.
- No mezclar campos históricos verificados con valores editoriales sin distinguirlos.
- No descargar ni normalizar activos sin registro de procedencia.
- No iniciar un sistema de cuentas público sin recuperación de contraseña, como indica ARCH-005.
- No ocultar fallas de persistencia local: el usuario debe poder reanudar o saber que su progreso temporal depende del dispositivo.

## Validación por fase

Cada fase informa los comandos ejecutados y su resultado. Además de tests unitarios, la fase 2 y la fase 3 requieren una verificación manual en viewport móvil; la fase 4 requiere pruebas de autorización y de fusión idempotente. Un build exitoso no sustituye estas pruebas.
