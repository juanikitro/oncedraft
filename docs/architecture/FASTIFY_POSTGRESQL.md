# Fastify y PostgreSQL — desarrollo local

## Alcance actual

La API contiene healthcheck, registro, inicio/cierre de sesión y perfil autenticado. PostgreSQL persiste cuentas, hashes de contraseña, sesiones, progreso, colección, runs y versiones de catálogo. No expone ranking, economía, Draft diario, PvP ni simulación de partidos.

## Contratos HTTP iniciales

| Método y ruta | Resultado |
| --- | --- |
| `GET /health` | Readiness del proceso y PostgreSQL (`{ "status": "ok" }`); responde `503` si la base no está disponible. |
| `POST /v1/auth/register` | Crea cuenta normalizada, sesión y cookie. |
| `POST /v1/auth/login` | Inicia una sesión para una cuenta existente. |
| `POST /v1/auth/logout` | Revoca la sesión actual y borra la cookie. |
| `GET /v1/me` | Devuelve el usuario de la sesión actual; sin sesión responde `401`. |
| `PUT /v1/me/personal-best` | Conserva el mayor Squad Score personal de una partida libre. |
| `POST /v1/me/merge-guest` | Fusiona idempotentemente el récord del perfil temporal actual. |

Los endpoints de registro e inicio aplican cinco intentos por minuto por IP. Las contraseñas nunca se devuelven ni se registran.

La API normaliza el username antes de verificar unicidad, responde igual ante contraseña incorrecta y cuenta inexistente, invalida sesiones vencidas y marca la cookie `Secure` cuando se inicia con `NODE_ENV=production`.

El score personal no es competitivo ni habilita ranking: la API admite el rango técnico actual de 0 a 150 con un decimal para proteger la base de datos, mientras que el diseño del Squad Score sigue sin un tope jugable. La fusión actual conserva el máximo entre el récord de invitado y el de cuenta; colección y runs persistidas no se exponen hasta que exista un catálogo activo con activos verificados.

## Preparación local

1. Copiar `apps/api/.env.example` a `apps/api/.env` y ajustar `DATABASE_URL` si fuera necesario.
2. Iniciar solamente PostgreSQL local: `docker compose up -d postgres`.
3. Cargar el esquema: `npm run db:migrate -w @draft/api`.
4. Iniciar API: `npm run dev:api`.

El volumen `draft_postgres_data` conserva datos locales de desarrollo. No usar esta configuración ni la contraseña de ejemplo como credencial de un entorno público.

## Validación

- Pruebas HTTP aisladas: `npm run test -w @draft/api`.
- Tipos: `npm run typecheck -w @draft/api`.
- Migración real local: `npm run db:migrate -w @draft/api` una vez iniciado PostgreSQL.
- Importación segura de contenido: `npm run catalog:import-active`. Primero ejecuta el gate de procedencia/activos; si falla, no escribe ninguna carta. Si pasa, importa `active-151` de forma transaccional.
