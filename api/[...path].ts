import type { IncomingMessage, ServerResponse } from "node:http";

import { crearServidorDeProduccion } from "../apps/api/src/production.js";

let servidor: Promise<Awaited<ReturnType<typeof crearServidorDeProduccion>>> | undefined;

async function obtenerServidor() {
  servidor ??= crearServidorDeProduccion();
  const resultado = await servidor;
  await resultado.app.ready();
  return resultado.app;
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const app = await obtenerServidor();
  const urlOriginal = request.url ?? "/";
  request.url = urlOriginal.replace(/^\/api(?=\/|$)/, "") || "/";
  app.server.emit("request", request, response);
}

export const config = { runtime: "nodejs" };
