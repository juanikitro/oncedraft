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
      version: 2,
      personalBest: null,
      cartasVistas: [],
      partidaActiva: null,
      guestRunId: null,
    });

    almacenamiento.setItem("draft.perfil-invitado.v1", "{dato inválido");

    expect(repositorio.cargar()).toMatchObject({
      version: 2,
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
    expect(perfil.pendientes).toMatchObject([{ guestRunId: "guest-run-1", clientRevision: 1, status: "completed" }]);
  });

  it("compacta la cola de una run y vincula el progreso de invitado al primer email", () => {
    const repositorio = crearRepositorioDePerfilInvitado({
      almacenamiento: crearAlmacenamientoEnMemoria(),
      ahora: () => "2026-09-01T12:00:00.000Z",
      crearGuestRunId: () => "guest-run-1",
    });
    repositorio.guardarPartida({ idsCartasVistas: ["messi"], completada: false, resultado: null } as never);
    const perfil = repositorio.guardarPartida({ idsCartasVistas: ["messi", "maradona"], completada: false, resultado: null } as never);
    const vinculado = repositorio.vincularPendientes("juani@example.com");

    expect(perfil.pendientes).toHaveLength(1);
    expect(perfil.pendientes[0]).toMatchObject({ guestRunId: "guest-run-1", clientRevision: 1, status: "active" });
    expect(vinculado.pendientes[0]?.ownerEmail).toBe("juani@example.com");
  });

  it("migra una run v1 pendiente para que pueda sincronizarse al iniciar sesión", () => {
    const almacenamiento = crearAlmacenamientoEnMemoria();
    const partida = { idsCartasVistas: ["messi"], completada: false, resultado: null } as never;
    almacenamiento.setItem("draft.perfil-invitado.v1", JSON.stringify({ version: 1, personalBest: 88, cartasVistas: ["messi"], partidaActiva: partida, guestRunId: "guest-run-1", actualizadoEn: "2026-08-30T12:00:00.000Z" }));
    const repositorio = crearRepositorioDePerfilInvitado({ almacenamiento, crearGuestRunId: () => "guest-run-2" });

    expect(repositorio.cargar().pendientes).toMatchObject([{ guestRunId: "guest-run-1", clientRevision: 0, status: "active", ownerEmail: null }]);
  });
});
