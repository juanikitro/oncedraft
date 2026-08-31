import type { EstadoPartida } from "@draft/game-core";

export const CLAVE_PERFIL_INVITADO = "draft.perfil-invitado.v1";

export interface AlmacenamientoClaveValor {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
  removeItem(clave: string): void;
}

export interface PerfilInvitado {
  version: 1;
  personalBest: number | null;
  cartasVistas: readonly string[];
  partidaActiva: EstadoPartida | null;
  guestRunId: string | null;
  actualizadoEn: string;
}

export function crearRepositorioDePerfilInvitado({
  almacenamiento,
  ahora = () => new Date().toISOString(),
  crearGuestRunId = crearGuestRunIdSeguro,
}: {
  almacenamiento: AlmacenamientoClaveValor;
  ahora?: () => string;
  crearGuestRunId?: () => string;
}) {
  function cargar(): PerfilInvitado {
    const serializado = almacenamiento.getItem(CLAVE_PERFIL_INVITADO);
    if (!serializado) {
      return crearPerfilVacio(ahora());
    }

    try {
      const candidato: unknown = JSON.parse(serializado);
      return esPerfilInvitado(candidato) ? normalizarPerfil(candidato) : crearPerfilVacio(ahora());
    } catch {
      return crearPerfilVacio(ahora());
    }
  }

  function guardarPartida(partida: EstadoPartida): PerfilInvitado {
    const perfilAnterior = cargar();
    const perfil: PerfilInvitado = {
      ...perfilAnterior,
      cartasVistas: unirCartasVistas(perfilAnterior.cartasVistas, partida.idsCartasVistas),
      partidaActiva: partida,
      guestRunId: perfilAnterior.guestRunId ?? crearGuestRunId(),
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function finalizarPartida(partida: EstadoPartida): PerfilInvitado {
    if (!partida.completada || !partida.resultado) {
      throw new Error("Solo se puede finalizar una partida completada con resultado.");
    }

    const perfilAnterior = cargar();
    const perfil: PerfilInvitado = {
      ...perfilAnterior,
      personalBest: Math.max(perfilAnterior.personalBest ?? 0, partida.resultado.puntaje),
      cartasVistas: unirCartasVistas(perfilAnterior.cartasVistas, partida.idsCartasVistas),
      partidaActiva: null,
      guestRunId: null,
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function limpiar(): void {
    almacenamiento.removeItem(CLAVE_PERFIL_INVITADO);
  }

  function guardar(perfil: PerfilInvitado): void {
    almacenamiento.setItem(CLAVE_PERFIL_INVITADO, JSON.stringify(perfil));
  }

  return { cargar, guardarPartida, finalizarPartida, limpiar };
}

function crearPerfilVacio(actualizadoEn: string): PerfilInvitado {
  return {
    version: 1,
    personalBest: null,
    cartasVistas: [],
    partidaActiva: null,
    guestRunId: null,
    actualizadoEn,
  };
}

function unirCartasVistas(actuales: readonly string[], nuevas: readonly string[]): readonly string[] {
  return [...new Set([...actuales, ...nuevas])];
}

function esPerfilInvitado(valor: unknown): valor is PerfilInvitado {
  if (!esRegistro(valor) || valor.version !== 1 || typeof valor.actualizadoEn !== "string") {
    return false;
  }
  if (valor.personalBest !== null && (typeof valor.personalBest !== "number" || !Number.isFinite(valor.personalBest))) {
    return false;
  }
  if (!Array.isArray(valor.cartasVistas) || !valor.cartasVistas.every((id) => typeof id === "string")) {
    return false;
  }
  return (
    (valor.guestRunId === undefined || valor.guestRunId === null || typeof valor.guestRunId === "string") &&
    (valor.partidaActiva === null || esEstadoPartidaPersistido(valor.partidaActiva))
  );
}

function normalizarPerfil(perfil: PerfilInvitado): PerfilInvitado {
  return { ...perfil, guestRunId: perfil.guestRunId ?? null };
}

function esEstadoPartidaPersistido(valor: unknown): valor is EstadoPartida {
  return (
    esRegistro(valor) &&
    Array.isArray(valor.idsCartasVistas) &&
    valor.idsCartasVistas.every((id) => typeof id === "string") &&
    typeof valor.completada === "boolean"
  );
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function crearGuestRunIdSeguro(): string {
  return crypto.randomUUID();
}
