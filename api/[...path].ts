import type { IncomingMessage, ServerResponse } from "node:http";

let servidor: ReturnType<typeof iniciarServidor> | undefined;

async function iniciarServidor() {
  const { crearServidorDeProduccion } = await import("../apps/api/src/production.js");
  return crearServidorDeProduccion();
}

async function obtenerServidor() {
  servidor ??= iniciarServidor();
  const resultado = await servidor;
  await resultado.app.ready();
  return resultado.app;
}

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const app = await obtenerServidor();
  const urlOriginal = request.url ?? "/";
  const url = new URL(urlOriginal, `http://${request.headers.host ?? "localhost"}`);
  const rutaReescrita = url.searchParams.get("path");

  if (url.pathname === "/api/[...path]" && rutaReescrita) {
    url.searchParams.delete("path");
    request.url = `/${rutaReescrita}${url.search}`;
  } else {
    request.url = urlOriginal.replace(/^\/api(?=\/|$)/, "") || "/";
  }
  app.server.emit("request", request, response);
}

export const config = { runtime: "nodejs" };
