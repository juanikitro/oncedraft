// Vercel no compila TypeScript dentro de node_modules, donde vive el workspace @draft/game-core,
// así que el código de ejecución de la API lo importa por ruta relativa. Los imports de solo tipos pueden seguir usando "@draft/game-core".
export * from "../../../packages/game-core/src/index.js";
