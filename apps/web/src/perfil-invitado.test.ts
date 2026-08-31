import { describe, expect, it } from "vitest";

import { crearRepositorioDePerfilInvitado, type AlmacenamientoClaveValor } from "./perfil-invitado";

function crearAlmacenamientoEnMemoria(): AlmacenamientoClaveValor {
  const valores = new Map<string, string>();
  return {
    getItem: (clave) => valores.get(clave) ?? null,
    setItem: (clave, valor) => valores.set(clave, valor),
    removeItem: (clave) => valores.delete(clave),
  };
}

describe("perfil de invitado", () => {
  it("recupera un perfil vacío cuando no hay datos o están dañados", () => {
    const almacenamiento = crearAlmacenamientoEnMemoria();
    const repositorio = crearRepositorioDePerfilInvitado({ almacenamiento, ahora: () => "2026-08-30T12:00:00.000Z", crearGuestRunId: () => "guest-run-1" });

    expect(repositorio.cargar()).toMatchObject({
      version: 1,
      personalBest: null,
      cartasVistas: [],
      partidaActiva: null,
      guestRunId: null,
    });

    almacenamiento.setItem("draft.perfil-invitado.v1", "{dato inválido");

    expect(repositorio.cargar()).toMatchObject({
      version: 1,
      personalBest: null,
      cartasVistas: [],
      partidaActiva: null,
      guestRunId: null,
    });
  });

  it("conserva la run activa y acumula las cartas vistas sin duplicarlas", () => {
    const repositorio = crearRepositorioDePerfilInvitado({
      almacenamiento: crearAlmacenamientoEnMemoria(),
      ahora: () => "2026-08-30T12:00:00.000Z",
      crearGuestRunId: () => "guest-run-1",
    });
    const partida = {
      idsCartasVistas: ["messi", "batistuta", "messi"],
      completada: false,
      resultado: null,
    } as never;

    const perfil = repositorio.guardarPartida(partida);

    expect(perfil.partidaActiva).toBe(partida);
    expect(perfil.cartasVistas).toEqual(["messi", "batistuta"]);
    expect(perfil.guestRunId).toBe("guest-run-1");
  });

  it("al finalizar una run actualiza el récord máximo y libera la partida activa", () => {
    const repositorio = crearRepositorioDePerfilInvitado({
      almacenamiento: crearAlmacenamientoEnMemoria(),
      ahora: () => "2026-08-30T12:00:00.000Z",
      crearGuestRunId: () => "guest-run-1",
    });
    repositorio.guardarPartida({ idsCartasVistas: ["messi"], completada: false, resultado: null } as never);

    const perfil = repositorio.finalizarPartida({
      idsCartasVistas: ["messi", "maradona"],
      completada: true,
      resultado: { puntaje: 96.4 },
    } as never);

    expect(perfil.partidaActiva).toBeNull();
    expect(perfil.guestRunId).toBeNull();
    expect(perfil.personalBest).toBe(96.4);
    expect(perfil.cartasVistas).toEqual(["messi", "maradona"]);
  });
});
