const NOMBRE_CACHE_SHELL = "once-draft-shell-v3";
const RECURSOS_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/icon.svg"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(precachearShell());
  self.skipWaiting();
});

async function precachearShell() {
  const cache = await caches.open(NOMBRE_CACHE_SHELL);
  await cache.addAll(RECURSOS_SHELL);
  const respuesta = await fetch("/");
  if (!respuesta.ok) return;

  await cache.put("/index.html", respuesta.clone());
  const html = await respuesta.text();
  const recursosVersionados = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((coincidencia) => coincidencia[1]);
  await cache.addAll(recursosVersionados.filter(Boolean));
}

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) => Promise.all(nombres.filter((nombre) => nombre !== NOMBRE_CACHE_SHELL).map((nombre) => caches.delete(nombre))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const solicitud = evento.request;
  const url = new URL(solicitud.url);

  if (solicitud.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  if (solicitud.mode === "navigate") {
    evento.respondWith(responderNavegacion(solicitud));
    return;
  }

  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/catalog/catalog-assets/")) {
    evento.respondWith(responderCachePrimero(solicitud));
  }
});

async function responderNavegacion(solicitud) {
  const cache = await caches.open(NOMBRE_CACHE_SHELL);
  try {
    const respuesta = await fetch(solicitud);
    if (respuesta.ok) {
      await cache.put("/index.html", respuesta.clone());
    }
    return respuesta;
  } catch {
    return (await cache.match("/index.html")) ?? Response.error();
  }
}

async function responderCachePrimero(solicitud) {
  const cache = await caches.open(NOMBRE_CACHE_SHELL);
  const respuestaEnCache = await cache.match(solicitud);
  if (respuestaEnCache) {
    return respuestaEnCache;
  }

  const respuesta = await fetch(solicitud);
  if (respuesta.ok) {
    await cache.put(solicitud, respuesta.clone());
  }
  return respuesta;
}
