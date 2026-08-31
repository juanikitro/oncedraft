# Decisiones de arquitectura

## ARCH-001 — Cuenta local mínima con usuario y contraseña

### Contexto

La vertical slice necesita persistir partida, récord y colección. Se eligió usar una cuenta simple en lugar de estado solo local o sincronización anónima.

### Opciones consideradas

1. Persistencia solo local de PWA.
2. Cuenta mínima con usuario y contraseña.
3. Cuenta obligatoria con proveedor externo.

### Decisión

La vertical slice usa una cuenta mínima basada en nombre de usuario y contraseña. No incluye inicio con proveedores externos, perfil social, verificación de correo ni otras capas de identidad en esta etapa.

### Motivo

Permite asociar de forma clara el progreso de una persona a una cuenta y deja una base compatible con colección, reanudación y futura competición.

### Trade-offs

Agrega fricción antes o después del primer juego y obliga a definir recuperación de acceso y seguridad antes de cualquier uso público. El momento de solicitar la cuenta sigue abierto.

### Qué invalidaría esta decisión

Que la fricción reduzca de forma relevante el inicio de la primera partida, que la cuenta no aporte valor durante la slice o que un modo local temporal sea suficiente para validar el loop.

## ARCH-002 — Juego inmediato con opción de cuenta y captura tras primer resultado

### Contexto

La cuenta mínima no debe bloquear el CTA principal de partida libre, pero el usuario pidió conservar una opción visible para ingresar o crearla desde el inicio.

### Opciones consideradas

1. Cuenta obligatoria antes de jugar.
2. Jugar primero; cuenta opcional visible en landing y ofrecida tras el primer resultado.
3. Cuenta solo al intentar colección o compartir.

### Decisión

La landing permite iniciar la primera partida sin cuenta y muestra “Ingresar / Crear cuenta” como acción secundaria. Tras el primer resultado se ofrece crear o ingresar una cuenta para guardar progreso.

### Motivo

Mantiene la promesa de empezar a jugar de inmediato y permite a quien ya valora el producto identificarse antes, sin perder el momento natural de pedir persistencia después de la primera run.

### Trade-offs

Se necesita una transición clara entre estado temporal local y cuenta. Debe definirse si la invitación del resultado se puede omitir y qué ocurre con progreso temporal.

### Qué invalidaría esta decisión

Que el progreso temporal confunda, que la cuenta se cree demasiado tarde para aportar valor o que el acceso secundario no sea encontrado por jugadores existentes.

## ARCH-003 — Perfil temporal local hasta registrar o ingresar

### Contexto

Después del primer resultado se invita a guardar el progreso, pero no se quiere convertir la cuenta en una barrera para repetir el loop.

### Opciones consideradas

1. Permitir continuar como invitado y conservar el progreso temporalmente en el dispositivo.
2. Exigir cuenta antes de una segunda partida.
3. Permitir omitir la invitación, descartando el progreso temporal.

### Decisión

El jugador puede omitir la invitación y continuar como invitado. Su partida, récord y colección se conservan de manera temporal en el dispositivo actual hasta que cree una cuenta o inicie sesión. Al hacerlo, ese progreso temporal debe asociarse a la cuenta de forma comprensible.

### Motivo

Protege la repetición inmediata —la hipótesis central de la vertical slice— sin renunciar al valor de la cuenta como mecanismo de persistencia.

### Trade-offs

El progreso de invitado puede perderse si se borran los datos locales, se cambia de dispositivo o se usa otro navegador. El traspaso a la cuenta deberá resolver qué ocurre si la cuenta ya contiene progreso; esa regla sigue pendiente.

### Qué invalidaría esta decisión

Que el estado temporal genere pérdida frecuente o confusión, o que mantenerlo añada complejidad que no compense el aprendizaje de la slice.

## ARCH-004 — Fusión automática y no destructiva del perfil temporal

### Contexto

Al registrar o iniciar sesión, una cuenta puede contener progreso previo mientras el dispositivo conserva un perfil temporal con otra colección, récord o partida activa.

### Opciones consideradas

1. Fusionar automáticamente sin perder progreso.
2. Pedir al jugador que elija cuál perfil conservar.
3. Priorizar la cuenta y descartar el perfil temporal.

### Decisión

La transición fusiona automáticamente ambos perfiles: la colección es la unión de cartas descubiertas, el récord personal es el mayor de los dos y una partida activa temporal se conserva si existe.

### Motivo

La cuenta debe hacer persistente el valor que el jugador ya generó, no ponerlo en riesgo. La regla además es fácil de explicar y no detiene el flujo con una decisión administrativa.

### Trade-offs

La lógica de fusión debe ser idempotente para no duplicar ni degradar datos al reintentarla. Si en el futuro se agregan recursos gastables, historial, compras o progreso competitivo, cada uno necesitará una regla explícita; no se debe asumir que también admite unión automática.

### Qué invalidaría esta decisión

Que existan datos futuros donde la unión permita duplicación, fraude o resultados ambiguos, o que el usuario necesite deliberadamente conservar dos estados incompatibles.

## ARCH-005 — Sin recuperación de contraseña en la vertical slice

### Contexto

Una cuenta compuesta exclusivamente por usuario y contraseña no tiene un canal confiable para comprobar identidad y recuperar el acceso si se olvida la contraseña.

### Opciones consideradas

1. No ofrecer recuperación durante la vertical slice y comunicar esa limitación.
2. Pedir correo electrónico solo para recuperación.
3. Posponer el sistema de cuentas hasta definir recuperación.

### Decisión

La vertical slice no ofrece recuperación de contraseña. La interfaz debe comunicarlo antes de crear la cuenta; si se pierde el acceso, el usuario podrá crear otra.

### Motivo

Respeta el alcance explícito de usuario y contraseña solamente, sin introducir una falsa promesa de recuperación ni ampliar identidad, comunicaciones o datos personales antes de validar el juego.

### Trade-offs

Puede perderse acceso al progreso de cuenta. Esta decisión solo es aceptable para una evaluación acotada: antes de una publicación pública debe reconsiderarse con un mecanismo seguro de recuperación y sus obligaciones de privacidad.

### Qué invalidaría esta decisión

Que la slice se abra a público general, contenga valor económico o competitivo relevante, o que la pérdida de acceso afecte la evaluación de retención.

## ARCH-006 — Motor de reglas determinista preparado para verificación futura

### Contexto

La partida libre debe sentirse inmediata en una PWA móvil. A la vez, el Draft diario futuro exige que una misma seed y una misma secuencia de decisiones produzcan un resultado reproducible y verificable.

### Opciones consideradas

1. Motor determinista aislado; ejecución fluida en cliente para partida libre y verificación/reproducción posterior en servidor para competición.
2. Lógica solo en cliente y servidor como almacén pasivo.
3. Servidor calcula cada roll y cada elección desde la slice.

### Decisión

Las reglas de generación, protección posicional, scouting, reroll, colocación y score se diseñarán como un motor determinista aislado. La partida libre puede ejecutarlo localmente; el servidor podrá reproducir o verificar una run a partir de seed y acciones cuando llegue el Draft diario.

### Motivo

Conserva respuesta inmediata y tolerancia básica a conectividad móvil durante la validación, mientras evita una reescritura conceptual del motor al sumar competencia justa.

### Trade-offs

Exige definir con precisión las entradas y acciones de una run y evitar fuentes ocultas de aleatoriedad o tiempo. En la partida libre no es una barrera antifraude suficiente; la validación autoritativa será necesaria antes de ranking o premios.

### Qué invalidaría esta decisión

Que el motor reproducible resulte significativamente más complejo que el juego validado, o que el producto descarte por completo el Draft diario y cualquier resultado comparable.

## ARCH-007 — Backend y persistencia propios

### Contexto

La slice necesita cuentas, persistencia de colección, récord y partida activa. A futuro puede incorporar verificación del Draft diario y ranking sin que la PWA sea la única fuente de verdad.

### Opciones consideradas

1. Servicio administrado de autenticación y base de datos.
2. API y base de datos propias.
3. Estado exclusivamente local en el dispositivo.

### Decisión

El producto tendrá una API y persistencia propias. No se delegarán el núcleo de autenticación, el modelo de progreso ni las reglas de acceso a un backend administrado como arquitectura principal.

### Motivo

Da control directo sobre la evolución del dominio, reglas de cuenta, verificación futura de runs y ranking, y evita depender de una lógica externa cuando el producto gane complejidad.

### Trade-offs

Aumenta el trabajo inicial de seguridad, operaciones, migraciones, observabilidad y mantenimiento. Para conservar el foco, la primera implementación debe limitarse a los datos de la vertical slice y no adelantar ranking, economía ni PvP.

### Qué invalidaría esta decisión

Que el costo operativo frene la salida de la slice, que el equipo no quiera mantener servicios propios o que un backend administrado cubra de forma suficiente los requisitos reales sin reducir el control necesario.

## ARCH-008 — PostgreSQL como persistencia principal

### Contexto

La API propia requiere persistir identidades, estado de cuenta, colección, récord, partidas activas y, después de la slice, consultas comparables de Draft diario.

### Opciones consideradas

1. Base de datos relacional PostgreSQL.
2. Base de datos documental.
3. Diferir la elección.

### Decisión

PostgreSQL será la persistencia principal del producto.

### Motivo

Usuarios, progreso, partidas y futuros rankings tienen relaciones e invariantes claros. PostgreSQL permite modelarlos y consultarlos sin inventar una estructura documental para cada combinación.

### Trade-offs

Exige definir migraciones y un esquema evolutivo. No debe llevar a diseñar desde ahora tablas de economía, PvP o ranking que la vertical slice todavía no necesita.

### Qué invalidaría esta decisión

Que el volumen, patrón de acceso o un requisito futuro demuestre que una parte específica necesita otro almacén; eso no justificaría reemplazar la fuente de verdad relacional sin evidencia.

## ARCH-009 — PWA React/Vite y API Fastify en TypeScript

### Contexto

La arquitectura aprobada requiere una PWA móvil, una API propia y un motor determinista reutilizable, sin sumar una estructura desproporcionada para la vertical slice.

### Opciones consideradas

1. React/Vite para PWA y Fastify para API, ambos en TypeScript.
2. Next.js como aplicación full-stack.
3. React/Vite con Express, NestJS o Django.

### Decisión

La vertical slice usará React/Vite para la PWA y Fastify para la API; el lenguaje común será TypeScript. PostgreSQL sigue siendo la persistencia principal.

### Motivo

Separa claramente la experiencia mobile-first de la API y permite compartir tipos y el motor determinista sin mezclar la interfaz con reglas de persistencia. Vite mantiene el cliente ligero y Fastify aporta una API validable y de bajo peso.

### Trade-offs

Se mantienen dos procesos/despliegues lógicos y se debe cuidar el contrato entre PWA y API. No se adopta una estructura más opinionada que podría ser útil después, pero no es necesaria para validar la slice.

### Qué invalidaría esta decisión

Que el despliegue independiente añada una fricción que retrase la slice, que el producto demande convenciones de backend mucho más rígidas o que una plataforma única resuelva el flujo completo con menos coste comprobable.

## ARCH-010 — Npm workspaces con motor y catálogo compartidos

### Contexto

React/Vite y Fastify necesitan compartir el motor determinista y el catálogo sin copiar reglas entre cliente y servidor. El repositorio no tenía estructura de código previa y el entorno dispone de Node.js y npm.

### Opciones consideradas

1. `npm workspaces` con `apps/web`, `apps/api`, `packages/game-core` y `packages/catalog`.
2. Dos proyectos totalmente separados, con tipos y reglas duplicados.
3. Un monorepo con herramientas adicionales de orquestación desde el primer día.

### Decisión

Se adopta la opción 1. La estructura compartirá únicamente el motor determinista y el catálogo; no se crea un paquete de contratos o una capa de infraestructura adicional sin necesidad demostrada.

### Motivo

Evita divergencia de reglas antes de Draft diario, conserva límites simples y aprovecha npm ya disponible sin introducir herramientas de build, caché o despliegue prematuras.

### Trade-offs

Se configura un workspace desde el inicio y las aplicaciones deben declarar bien sus dependencias. La estructura añade carpetas, pero reduce el riesgo mayor de reescribir o duplicar el motor.

### Qué invalidaría esta decisión

Que una aplicación nunca necesite el motor compartido, que el workspace imponga una fricción comprobable desproporcionada o que las necesidades de despliegue exijan una separación física posterior.

## ARCH-011 — Credenciales y sesiones revocables del MVP

### Contexto

La cuenta mínima aprobada necesita proteger contraseñas y permitir cerrar o invalidar una sesión sin introducir proveedores externos ni JWT de larga vida en el navegador.

### Opciones consideradas

1. Argon2id, token opaco hasheado y sesión persistida en PostgreSQL.
2. JWT autocontenido sin estado de sesión.
3. Sesión de servidor en memoria.

### Decisión

Se adopta la opción 1: Argon2id para el hash de contraseña; un token aleatorio opaco solo en cookie `HttpOnly`, `SameSite=Lax` y `Secure` en producción; y solo su hash SHA-256, fecha de expiración y revocación en PostgreSQL. La migración se ejecuta con `node-pg-migrate`; no se incorpora ORM.

### Motivo

Permite cerrar sesión y revocar credenciales sin depender de una lista de bloqueo de JWT ni perder todas las sesiones al reiniciar el proceso. Mantiene el contrato mínimo y separa la API de `game-core`.

### Trade-offs

Cada request autenticado consulta PostgreSQL y se deben ejecutar migraciones antes de iniciar el proceso. La slice no ofrece recuperación de contraseña; por ARCH-005, no es apta para publicación pública sin rediseñar identidad.

### Qué invalidaría esta decisión

Que el volumen o la operación muestren que la consulta de sesión exige un almacén adicional, o que se necesite identidad federada/recuperación de cuenta. Ninguno justifica exponer contraseñas ni reemplazar el motor determinista.

## ARCH-012 — Catálogo activo publicado como único origen visual de la PWA

### Contexto

El catálogo candidato es útil para simulación y balance, pero no garantiza que cada carta tenga procedencia, temporada y activo visual aprobados. La PWA no puede mezclar ambos estados sin exponer contenido incompleto.

### Opciones consideradas

1. Cargar directamente el catálogo candidato en la PWA.
2. Publicar un artefacto de runtime únicamente después del gate activo.
3. Mostrar cartas incompletas con placeholders hasta terminar la curaduría.

### Decisión

Se adopta la opción 2. `catalog:publish-web` compila el artefacto con las cartas, rutas locales y copias de runtime sólo si `catalog:verify-active` pasa. La PWA carga exclusivamente ese archivo; si falta, comunica que el catálogo continúa en curaduría y no inicia una run.

### Motivo

Hace cumplir técnicamente la distinción editorial entre candidato y activo, evita hotlinks y preserva la identidad visual de cada versión histórica.

### Trade-offs

La interfaz completa permanece no jugable hasta terminar los 151 activos. La publicación actual copia archivos web-nativos sin recodificarlos; la optimización de peso es una mejora posterior que deberá conservar el gate y los nombres versionados.

### Qué invalidaría esta decisión

Que el producto decida explícitamente permitir contenido de ejemplo o que el catálogo activo no pueda producir un artefacto consistente y local.

## ARCH-013 — Temporada como campo obligatorio de Carta

### Contexto

La fuente editorial ya ancla cada versión a una temporada y la UI aprobada debe mostrar club y temporada. El compilador mantenía ese dato durante su lectura pero lo descartaba al construir la carta jugable.

### Opciones consideradas

1. Mantener temporada sólo en documentación de procedencia.
2. Hacer `temporada` opcional en la carta de runtime.
3. Incorporar `temporada` como dato obligatorio de toda Carta.

### Decisión

Se adopta la opción 3. El contrato compartido de Carta exige temporada y el compilador candidato la conserva hasta el artefacto de runtime.

### Motivo

Una carta es una versión histórica concreta; perder la temporada rompe la explicación visual y la trazabilidad con club, camiseta, imagen y ciclo mundial.

### Trade-offs

Fixtures, importadores y futuros contratos deben incluir un campo más. No cambia el cálculo de draft ni de score.

### Qué invalidaría esta decisión

Que el producto abandone las versiones históricas concretas y adopte cartas de carrera sin temporada, contradiciendo DEC-106.

## ARCH-014 — Identificador local estable para la run de invitado

### Contexto

La futura fusión de una run temporal con una cuenta puede reintentarse por conectividad móvil. Sin una identidad persistente, cada reintento podría crear otra run en el servidor.

### Opciones consideradas

1. Generar una UUID local al iniciar la run y conservarla hasta su cierre.
2. Usar sólo el seed como identidad de sincronización.
3. Asignar una identidad únicamente cuando el servidor reciba la run.

### Decisión

Se adopta la opción 1. El perfil temporal guarda `guestRunId` junto con la run activa; se crea una UUID al primer guardado de esa run y se limpia al finalizarla.

### Motivo

Permite que un futuro endpoint de sincronización haga upsert de la misma run incluso si el cliente reintenta su petición. El seed sigue siendo reproducibilidad de juego, no identidad de persistencia.

### Trade-offs

El perfil local tiene un campo adicional y la futura tabla/contrato deberá imponer unicidad por cuenta y `guestRunId`. Una run finalizada no conserva ese identificador porque el MVP sólo fusiona su récord y colección.

### Qué invalidaría esta decisión

Que el producto deje de sincronizar runs activas de invitado o que se adopte una identidad de dispositivo con garantías más fuertes y una migración explícita.
