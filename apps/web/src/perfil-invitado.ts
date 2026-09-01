import type { EstadoPartida } from "@draft/game-core";

export const CLAVE_PERFIL_INVITADO = "draft.perfil-invitado.v1";

export interface AlmacenamientoClaveValor {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
  removeItem(clave: string): void;
}

export interface PendienteDeSincronizacion {
  guestRunId: string;
  clientRevision: number;
  partida: EstadoPartida;
  status: "active" | "completed";
  cartasVistas: readonly string[];
  personalBest: number | null;
  ownerEmail: string | null;
}

export interface ConflictoDeSincronizacion {
  code: "STALE_RUN" | "RUN_CONFLICT";
  local: PendienteDeSincronizacion;
  remoto: {
    guestRunId: string;
    clientRevision: number;
    partida: EstadoPartida;
    cartasVistas: readonly string[];
    personalBest: number | null;
  };
}

export interface PerfilInvitado {
  version: 2;
  personalBest: number | null;
  cartasVistas: readonly string[];
  partidaActiva: EstadoPartida | null;
  guestRunId: string | null;
  clientRevision: number | null;
  pendientes: readonly PendienteDeSincronizacion[];
  conflicto: ConflictoDeSincronizacion | null;
  respaldosDeConflicto: readonly ConflictoDeSincronizacion[];
  actualizadoEn: string;
}

type PerfilV1 = Omit<PerfilInvitado, "version" | "clientRevision" | "pendientes" | "conflicto" | "respaldosDeConflicto"> & { version: 1 };

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
    if (!serializado) return crearPerfilVacio(ahora());

    try {
      const candidato: unknown = JSON.parse(serializado);
      if (esPerfilV2(candidato)) return normalizarPerfil(candidato);
      if (esPerfilV1(candidato)) return migrarPerfilV1(candidato);
      return crearPerfilVacio(ahora());
    } catch {
      return crearPerfilVacio(ahora());
    }
  }

  function guardarPartida(partida: EstadoPartida, ownerEmail: string | null = null): PerfilInvitado {
    const anterior = cargar();
    const guestRunId = anterior.guestRunId ?? crearGuestRunId();
    const clientRevision = anterior.guestRunId === guestRunId ? (anterior.clientRevision ?? -1) + 1 : 0;
    const cartasVistas = unirCartasVistas(anterior.cartasVistas, partida.idsCartasVistas);
    const pendiente: PendienteDeSincronizacion = {
      guestRunId,
      clientRevision,
      partida,
      status: "active",
      cartasVistas,
      personalBest: anterior.personalBest,
      ownerEmail,
    };
    const perfil: PerfilInvitado = {
      ...anterior,
      cartasVistas,
      partidaActiva: partida,
      guestRunId,
      clientRevision,
      pendientes: reemplazarPendiente(anterior.pendientes, pendiente),
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function finalizarPartida(partida: EstadoPartida, ownerEmail: string | null = null): PerfilInvitado {
    if (!partida.completada || !partida.resultado) throw new Error("Solo se puede finalizar una partida completada con resultado.");

    const anterior = cargar();
    const guestRunId = anterior.guestRunId ?? crearGuestRunId();
    const clientRevision = (anterior.clientRevision ?? -1) + 1;
    const personalBest = Math.max(anterior.personalBest ?? 0, partida.resultado.puntaje);
    const cartasVistas = unirCartasVistas(anterior.cartasVistas, partida.idsCartasVistas);
    const pendiente: PendienteDeSincronizacion = { guestRunId, clientRevision, partida, status: "completed", cartasVistas, personalBest, ownerEmail };
    const perfil: PerfilInvitado = {
      ...anterior,
      personalBest,
      cartasVistas,
      partidaActiva: null,
      guestRunId: null,
      clientRevision: null,
      pendientes: reemplazarPendiente(anterior.pendientes, pendiente),
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function vincularPendientes(email: string): PerfilInvitado {
    const anterior = cargar();
    const perfil = { ...anterior, pendientes: anterior.pendientes.map((pendiente) => pendiente.ownerEmail === null ? { ...pendiente, ownerEmail: email } : pendiente), actualizadoEn: ahora() };
    guardar(perfil);
    return perfil;
  }

  function confirmarPendiente(guestRunId: string, clientRevision: number): PerfilInvitado {
    const anterior = cargar();
    const perfil = { ...anterior, pendientes: anterior.pendientes.filter((pendiente) => pendiente.guestRunId !== guestRunId || pendiente.clientRevision !== clientRevision), actualizadoEn: ahora() };
    guardar(perfil);
    return perfil;
  }

  function registrarConflicto(conflicto: ConflictoDeSincronizacion): PerfilInvitado {
    const anterior = cargar();
    const perfil = { ...anterior, conflicto, actualizadoEn: ahora() };
    guardar(perfil);
    return perfil;
  }

  function usarRunRemota(conflicto: ConflictoDeSincronizacion): PerfilInvitado {
    const anterior = cargar();
    const perfil: PerfilInvitado = {
      ...anterior,
      personalBest: maximo(anterior.personalBest, conflicto.remoto.personalBest),
      cartasVistas: unirCartasVistas(anterior.cartasVistas, conflicto.remoto.cartasVistas),
      partidaActiva: conflicto.remoto.partida,
      guestRunId: conflicto.remoto.guestRunId,
      clientRevision: conflicto.remoto.clientRevision,
      pendientes: anterior.pendientes.filter((pendiente) => pendiente.guestRunId !== conflicto.local.guestRunId),
      conflicto: null,
      respaldosDeConflicto: [...anterior.respaldosDeConflicto, conflicto],
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function mantenerRunLocal(conflicto: ConflictoDeSincronizacion, email: string): PerfilInvitado {
    const anterior = cargar();
    const pendiente: PendienteDeSincronizacion = {
      ...conflicto.local,
      guestRunId: conflicto.remoto.guestRunId,
      clientRevision: conflicto.remoto.clientRevision + 1,
      ownerEmail: email,
      cartasVistas: unirCartasVistas(conflicto.local.cartasVistas, conflicto.remoto.cartasVistas),
      personalBest: maximo(conflicto.local.personalBest, conflicto.remoto.personalBest),
    };
    const perfil: PerfilInvitado = {
      ...anterior,
      personalBest: pendiente.personalBest,
      cartasVistas: pendiente.cartasVistas,
      partidaActiva: pendiente.partida,
      guestRunId: pendiente.guestRunId,
      clientRevision: pendiente.clientRevision,
      pendientes: reemplazarPendiente(anterior.pendientes.filter((item) => item.guestRunId !== conflicto.local.guestRunId), pendiente),
      conflicto: null,
      respaldosDeConflicto: [...anterior.respaldosDeConflicto, conflicto],
      actualizadoEn: ahora(),
    };
    guardar(perfil);
    return perfil;
  }

  function hidratarRunRemota(remoto: ConflictoDeSincronizacion["remoto"]): PerfilInvitado {
    const anterior = cargar();
    const perfil: PerfilInvitado = {
      ...anterior,
      personalBest: maximo(anterior.personalBest, remoto.personalBest),
      cartasVistas: unirCartasVistas(anterior.cartasVistas, remoto.cartasVistas),
      partidaActiva: remoto.partida,
      guestRunId: remoto.guestRunId,
      clientRevision: remoto.clientRevision,
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

  return { cargar, guardarPartida, finalizarPartida, vincularPendientes, confirmarPendiente, registrarConflicto, usarRunRemota, mantenerRunLocal, hidratarRunRemota, limpiar };
}

export function esEstadoPartidaPersistido(valor: unknown): valor is EstadoPartida {
  return esRegistro(valor) && Array.isArray(valor.idsCartasVistas) && valor.idsCartasVistas.every((id) => typeof id === "string") && typeof valor.completada === "boolean";
}

function crearPerfilVacio(actualizadoEn: string): PerfilInvitado {
  return { version: 2, personalBest: null, cartasVistas: [], partidaActiva: null, guestRunId: null, clientRevision: null, pendientes: [], conflicto: null, respaldosDeConflicto: [], actualizadoEn };
}

function migrarPerfilV1(perfil: PerfilV1): PerfilInvitado {
  const pendiente = perfil.partidaActiva && perfil.guestRunId
    ? [{ guestRunId: perfil.guestRunId, clientRevision: 0, partida: perfil.partidaActiva, status: "active" as const, cartasVistas: perfil.cartasVistas, personalBest: perfil.personalBest, ownerEmail: null }]
    : [];
  return { ...perfil, version: 2, clientRevision: perfil.guestRunId ? 0 : null, pendientes: pendiente, conflicto: null, respaldosDeConflicto: [] };
}

function normalizarPerfil(perfil: PerfilInvitado): PerfilInvitado {
  return { ...perfil, guestRunId: perfil.guestRunId ?? null, clientRevision: perfil.guestRunId ? perfil.clientRevision ?? 0 : null, pendientes: perfil.pendientes ?? [], conflicto: perfil.conflicto ?? null, respaldosDeConflicto: perfil.respaldosDeConflicto ?? [] };
}

function reemplazarPendiente(pendientes: readonly PendienteDeSincronizacion[], siguiente: PendienteDeSincronizacion): readonly PendienteDeSincronizacion[] {
  return [...pendientes.filter((pendiente) => pendiente.guestRunId !== siguiente.guestRunId), siguiente];
}

function unirCartasVistas(actuales: readonly string[], nuevas: readonly string[]): readonly string[] {
  return [...new Set([...actuales, ...nuevas])];
}

function maximo(actual: number | null, siguiente: number | null): number | null {
  if (actual === null) return siguiente;
  if (siguiente === null) return actual;
  return Math.max(actual, siguiente);
}

function esPerfilV1(valor: unknown): valor is PerfilV1 {
  return esRegistro(valor) && valor.version === 1 && typeof valor.actualizadoEn === "string" && (valor.personalBest === null || typeof valor.personalBest === "number") && Array.isArray(valor.cartasVistas) && (valor.partidaActiva === null || esEstadoPartidaPersistido(valor.partidaActiva)) && (valor.guestRunId === undefined || valor.guestRunId === null || typeof valor.guestRunId === "string");
}

function esPerfilV2(valor: unknown): valor is PerfilInvitado {
  if (!esRegistro(valor)) return false;
  const clientRevision = valor.clientRevision;
  return valor.version === 2 && typeof valor.actualizadoEn === "string" && (valor.personalBest === null || typeof valor.personalBest === "number") && Array.isArray(valor.cartasVistas) && (valor.partidaActiva === null || esEstadoPartidaPersistido(valor.partidaActiva)) && (valor.guestRunId === null || typeof valor.guestRunId === "string") && (clientRevision === null || (typeof clientRevision === "number" && Number.isInteger(clientRevision) && clientRevision >= 0)) && Array.isArray(valor.pendientes) && (valor.conflicto === null || esRegistro(valor.conflicto)) && (valor.respaldosDeConflicto === undefined || Array.isArray(valor.respaldosDeConflicto));
}

function esRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function crearGuestRunIdSeguro(): string {
  return crypto.randomUUID();
}
