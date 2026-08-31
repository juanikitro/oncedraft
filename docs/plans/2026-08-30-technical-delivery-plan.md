# Plan técnico de entrega — PWA móvil

## Estado y decisión

Aprobado el 2026-08-30. Este plan conserva el catálogo activo como un gate editorial: no se muestran ni cachean cartas de jugadores hasta que las 151 versiones tengan procedencia, hechos de versión y activo local aprobados.

La partida libre opera localmente en el dispositivo; la cuenta sincroniza después y no condiciona cada decisión de juego. Esta regla mantiene el loop inmediato en móvil y no convierte los resultados locales en competencia válida.

## Etapa 0 — Gate de catálogo activo

1. El agente editorial completa y verifica las 151 entradas sin modificar los datos jugables durante la curaduría.
2. `npm run catalog:verify-active` debe pasar antes de escribir contenido activo.
3. Se importa `active-151` de forma transaccional.
4. Un compilador de presentación genera rutas versionadas para imágenes derivadas sin alterar `assets/source/cards` ni hotlinkear proveedores.

**Cierre:** 151 cartas, 151 activos verificados, importación consistente y referencias de presentación que resuelven localmente.

## Etapa 1 — Base PWA y perfil temporal

1. Manifest, ícono propio y service worker para el shell de aplicación.
2. Caché diferida de imágenes en `/catalog/catalog-assets/`: no descargar todo el catálogo en el primer arranque.
3. Perfil local versionado: partida activa, cartas vistas y récord personal.
4. La escritura local ocurre al resolver una acción, no al cerrar la pestaña.

**Cierre:** una run ya iniciada puede recuperarse en el mismo dispositivo; un estado corrupto no bloquea una nueva partida.

**Estado 2026-08-31:** implementados manifest, service worker con precache del shell, caché diferida de `/catalog/catalog-assets/`, perfil temporal versionado y run recuperable. La PWA se niega a iniciar una partida si no puede leer el catálogo publicado activo. El registro del service worker y la lectura visual de las cartas se validaron en Chrome; no hubo errores de consola.

## Etapa 2 — Vertical slice de partida libre

1. Landing y selector de modo, con `Partida libre` activo y `Draft diario` bloqueado.
2. Oferta, inspección sin consecuencias, confirmación de pick, explorar y repetir oferta.
3. Formación 4-3-3 con ubicación automática y reorganización explícita.
4. Explicación de química, traits y Squad Score; resultado, récord y nueva run.
5. Validación en 360, 390 y 430 px, incluidos carriles de tres/cinco opciones.

**Dependencia:** catálogo activo y activos de presentación completos. Ninguna carta visible se sustituye por un placeholder.

**Estado 2026-08-31:** el gate `active-151` pasó, el catálogo se publicó localmente, se importó de forma transaccional en PostgreSQL local y la partida libre ya se publica en producción. El flujo conserva landing, oferta, inspección, confirmación, scouting, reroll confirmado, ubicación automática, reorganización, score y récord local. Chrome validó las dimensiones 360, 390 y 520 px: carril horizontal bajo 520 px y grilla sin desborde desde ese punto. Un teléfono físico sigue siendo una validación adicional recomendable antes de una difusión amplia.

## Etapa 3 — API y sincronización de cuenta

1. Lectura de catálogo activo versionado.
2. Runs y colección con autorización por propietario.
3. Fusión invitado → cuenta idempotente: unión de colección, máximo récord y run activa válida.
4. Reintentos seguros de sincronización sin usar resultados locales para ranking.

**Cierre:** el usuario autenticado puede recuperar su progreso; el invitado sigue funcionando localmente.

## Etapa 4 — Aprendizaje, calidad y salida

1. Contrato de eventos de aprendizaje sin PII antes de elegir proveedor de analítica.
2. Pruebas unitarias del estado de run, integración de PostgreSQL y navegador móvil/PWA.
3. Pruebas de recuperación offline, actualización de catálogo y presupuesto de caché.
4. Antes de lanzamiento público: hosting, cookies seguras, recuperación de contraseña, políticas y backups.

## Fuera de alcance

Draft diario, ranking, economía, pagos, simulación, torneos, PvP y recompensas. Entran sólo después de validar repetición voluntaria de la partida libre.

## Preparación de despliegue

- La primera entrega pública es la PWA estática de **Once Draft** en Vercel, construida desde el workspace raíz y con salida `apps/web/dist`: https://oncedraft.vercel.app.
- Fastify no se publica todavía: la PWA de la slice es jugable como invitado y no presenta aún pantallas de cuenta/sincronización.
- Supabase se evaluará como PostgreSQL administrado para Fastify cuando se implemente la sincronización de cuentas. No se usan Supabase Auth ni Data API, por lo que sus tablas no deben exponerse a clientes ni recibir permisos públicos.
- Antes de una publicación pública con cuentas: URL de PostgreSQL privada/SSL, cookies `Secure`, secreto de entorno, migración aplicada, backup y recuperación de contraseña. El checklist de producción de Supabase exige además revisar RLS si las tablas fueran expuestas por su Data API; no lo estarán en esta arquitectura.
