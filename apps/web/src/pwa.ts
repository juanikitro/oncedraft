/** Registra el shell instalable sin condicionar el juego a una conexión activa. */
export function registrarPwa(): void {
  if (!("serviceWorker" in navigator) || !import.meta.env.PROD) {
    return;
  }

  window.addEventListener("load", () => {
    void navigator.serviceWorker.register("/sw.js");
  });
}
