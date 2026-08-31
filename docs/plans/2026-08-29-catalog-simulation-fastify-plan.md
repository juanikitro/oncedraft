# Plan ejecutable — Catálogo, simulación y Fastify

## Estado

Aprobado el 2026-08-29. Este plan ordena las próximas tres fases y reemplaza las referencias de alcance de 150 cartas por el catálogo actual de 151. No autoriza Draft diario, ranking, economía, simulación de partidos ni PvP.

## Objetivo

Convertir el catálogo editorial en datos de juego verificables, comprobar el balance del draft con seeds reproducibles y después incorporar una API Fastify respaldada por PostgreSQL para cuentas, sesiones y progreso. Ninguna fase habilita una pantalla visible con cartas o activos incompletos.

## Fase 1 — Compilador de catálogo

### Entradas canónicas

- `FULL_ROSTER_PROPOSAL.md`
- `POSITION_ALLOCATION.md`
- `OVR_ALLOCATION.md`
- `TRAIT_ALLOCATION.md`
- `SECONDARY_POSITION_ALLOCATION.md`
- `DATA_PROVENANCE_MANIFEST.md`

### Trabajo

1. Extraer las 151 versiones y convertirlas a una representación tipada de `Carta` para el motor.
2. Mantener una sola fuente editorial: el resultado se genera desde los documentos, no se edita como una segunda lista manual.
3. Validar identidad, primaria, secundarias, OVR, trait, ciclo, nacionalidad y club por cada carta.
4. Separar dos estados: **catálogo candidato**, apto para simulación interna; y **catálogo activo visible**, que exige procedencia e imagen local verificadas para las 151 cartas. `npm run catalog:verify-active` implementa este gate y debe fallar ante cualquier fila incompleta, activo faltante, duplicación o desalineación con el candidato.
5. Hacer fallar el proceso ante identificadores duplicados, campos ausentes, cobertura posicional insuficiente, activos sin aprobar o una versión de contenido inconsistente.

### Entregables y validación

- Comando reproducible de compilación y chequeo.
- Catálogo candidato consumible por `game-core` y por la simulación.
- Reporte de errores por carta, sin hotlinks ni placeholders de runtime.
- Pruebas de unión de las seis fuentes y de rechazo ante datos incompletos.
- Importador transaccional de catálogo activo que sólo puede ejecutarse después de `npm run catalog:verify-active`.

## Fase 2 — Simulación de seeds y balance

### Alcance

Ejecutar corridas deterministas sobre el catálogo candidato. No genera resultados competitivos ni decide automáticamente valores de diseño.

### Trabajo

1. Simular un volumen inicial de seeds acordado en el script, con estrategias explícitas: priorizar OVR, química, traits y cobertura.
2. Medir por seed y por estrategia: contextos, cartas vistas, ofertas de tres/cinco, diversidad de builds, oportunidades posicionales, reroll, scouting, score y abandono lógico por incapacidad de completar.
3. Implementar la clasificación conservadora de oferta dominada de DEC-147 y contrastarla con el guardrail de 15%.
4. Comprobar el planificador de protección sobre múltiples seeds: once contextos distintos, tres oportunidades primarias por categoría y cierre sorteado de POR/LD/LI.
5. Emitir un informe reproducible que distingue hechos medidos, inferencias y decisiones que requieren revisión humana.

### Gates

- Ninguna seed puede romper los invariantes del motor.
- El catálogo debe producir planes de protección válidos para todas las seeds de la muestra.
- Si dominancia, repetición de contexto o distribución de score parecen problemáticas, se abre una revisión editorial; no se maquilla el resultado ni se agrega un filtro automático.

## Fase 3 — Fastify y PostgreSQL

### Límite de responsabilidad

`game-core` conserva el draft y score deterministas. Fastify autentica, autoriza, persiste y expone contratos; PostgreSQL conserva datos de cuenta y progreso. La partida libre sigue respondiendo localmente en móvil.

### 3.1 Bootstrap de API

1. Consolidar `apps/api` como proceso Fastify con configuración explícita por entorno, healthcheck y cierre ordenado.
2. Definir contratos versionados de error, autenticación, perfil, récord, colección y run activa.
3. Añadir validación de entrada, manejo centralizado de errores y tests HTTP sin depender de la PWA.
4. Elegir la herramienta de migración únicamente al implementar la primera migración; no añadir ORM por anticipación.

**Estado 2026-08-30:** implementados Fastify, contratos HTTP iniciales, validación de entrada, formato centralizado de errores, límites de intentos y récord personal persistido. Se eligieron `node-pg-migrate` para migraciones SQL versionadas, Argon2id para contraseñas y sesiones opacas revocables en PostgreSQL; ver `docs/architecture/FASTIFY_POSTGRESQL.md`. Colección y runs quedan preparados en esquema, pero no se exponen hasta el gate de catálogo activo.

### 3.2 Persistencia

La primera migración cubre únicamente usuarios, credenciales protegidas, sesiones, progreso, colección descubierta, runs y versión de catálogo. No incluye economía, ranking, Draft diario, partidos ni tablas de PvP.

### 3.3 Cuenta y sesión

1. Registrar e iniciar sesión con username normalizado y contraseña hasheada; nunca registrar ni devolver el secreto.
2. Crear sesión expirable y cierre de sesión; aplicar límites de intentos a registro e inicio.
3. Autorizar estrictamente por propietario para perfil, colección, récord y run.
4. Fusionar invitado → cuenta de forma idempotente: colección como unión, récord como máximo y run activa preservada cuando sea válida.

La elección concreta de algoritmo de hash, forma de sesión y herramienta de migración se confirma dentro de esta fase antes de incorporarla: son detalles de seguridad/operación que no deben inventarse ni dejarse implícitos.

### Validación

- Migración aplicable sobre PostgreSQL vacío y repetible en entorno de prueba.
- Pruebas de autorización, username duplicado, contraseña inválida, límite de login, expiración/cierre de sesión y fusión repetida.
- Reproducción de una run guardada con su `catalogVersion`, seed y acciones/snapshot.
- No exponer endpoints de ranking ni aceptar resultados locales como competitivos.

## Orden de ejecución y dependencia externa

1. Implementar el compilador de catálogo.
2. Ejecutar y revisar simulación; solo ajustar contenido con evidencia.
3. Bootstrap Fastify y PostgreSQL, seguido de cuenta/progreso.
4. El agente de activos completa en paralelo el manifiesto e imágenes. Hasta ese gate no se conecta el catálogo a una UI pública o visible.

## Criterio de cierre del plan

El plan queda realizado cuando existe un catálogo candidato compilado y validado, un informe de simulación revisable y una API Fastify/PostgreSQL probada para cuenta, sesión y progreso. La PWA visible sigue esperando el catálogo activo visual completo y un sistema de diseño aprobado.
