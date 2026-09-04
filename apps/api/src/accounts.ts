export type Usuario = {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
};

export type Sesion = {
  tokenHash: string;
  usuarioId: string;
  expiraEn: Date;
  revocadaEn: Date | null;
};

export type Progreso = {
  personalBest: number | null;
};

export type EstadoDeRun = "active" | "completed" | "abandoned";

export type RunPersistida = {
  guestRunId: string;
  catalogVersion: string;
  seed: string;
  snapshot: Record<string, unknown>;
  status: EstadoDeRun;
  clientRevision: number;
};

export type GuardarRun = RunPersistida & {
  cartasVistas: readonly string[];
  personalBest: number | null;
};

export type EstadoDeCuenta = Progreso & {
  runActiva: RunPersistida | null;
  cartasVistas: readonly string[];
};

export class RunDesactualizadaError extends Error {
  constructor() {
    super("La partida fue actualizada desde otro dispositivo.");
  }
}

export class RunEnConflictoError extends Error {
  constructor() {
    super("La revisión de la partida no coincide con el estado guardado.");
  }
}

export interface RepositorioDeCuentas {
  verificarDisponibilidad(): Promise<boolean>;
  crearUsuario(input: Omit<Usuario, "id">): Promise<Usuario>;
  buscarUsuarioPorEmail(email: string): Promise<Usuario | null>;
  buscarUsuarioPorId(id: string): Promise<Usuario | null>;
  listarUsuariosPublicos(): Promise<readonly Pick<Usuario, "id" | "username">[]>;
  crearSesion(sesion: Sesion): Promise<void>;
  buscarSesionActiva(tokenHash: string, ahora: Date): Promise<Sesion | null>;
  revocarSesion(tokenHash: string, ahora: Date): Promise<void>;
  obtenerProgreso(usuarioId: string): Promise<Progreso>;
  guardarRecordPersonal(usuarioId: string, score: number): Promise<Progreso>;
  obtenerEstado(usuarioId: string): Promise<EstadoDeCuenta>;
  guardarRun(usuarioId: string, input: GuardarRun): Promise<EstadoDeCuenta>;
}

export class EmailYaExisteError extends Error {
  constructor() {
    super("Ya existe una cuenta con ese email.");
  }
}

export function crearRepositorioDeCuentasEnMemoria(): RepositorioDeCuentas {
  const usuarios = new Map<string, Usuario>();
  const sesiones = new Map<string, Sesion>();
  const progresos = new Map<string, Progreso>();
  const runs = new Map<string, RunPersistida>();
  const cartasVistas = new Map<string, Set<string>>();
  let siguienteId = 1;

  return {
    async verificarDisponibilidad() {
      return true;
    },
    async crearUsuario(input) {
      if (usuarios.has(input.email)) {
        throw new EmailYaExisteError();
      }

      const usuario = { ...input, id: `usuario-${siguienteId++}` };
      usuarios.set(usuario.email, usuario);
      return usuario;
    },
    async buscarUsuarioPorEmail(email) {
      return usuarios.get(email) ?? null;
    },
    async buscarUsuarioPorId(id) {
      return [...usuarios.values()].find((usuario) => usuario.id === id) ?? null;
    },
    async listarUsuariosPublicos() {
      return [...usuarios.values()].map(({ id, username }) => ({ id, username }));
    },
    async crearSesion(sesion) {
      sesiones.set(sesion.tokenHash, sesion);
    },
    async buscarSesionActiva(tokenHash, ahora) {
      const sesion = sesiones.get(tokenHash);
      if (!sesion || sesion.revocadaEn || sesion.expiraEn <= ahora) {
        return null;
      }
      return sesion;
    },
    async revocarSesion(tokenHash, ahora) {
      const sesion = sesiones.get(tokenHash);
      if (sesion && !sesion.revocadaEn) {
        sesiones.set(tokenHash, { ...sesion, revocadaEn: ahora });
      }
    },
    async obtenerProgreso(usuarioId) {
      return progresos.get(usuarioId) ?? { personalBest: null };
    },
    async guardarRecordPersonal(usuarioId, score) {
      const actual = progresos.get(usuarioId) ?? { personalBest: null };
      const personalBest = actual.personalBest === null ? score : Math.max(actual.personalBest, score);
      const progreso = { personalBest };
      progresos.set(usuarioId, progreso);
      return progreso;
    },
    async obtenerEstado(usuarioId) {
      const progreso = progresos.get(usuarioId) ?? { personalBest: null };
      return {
        ...progreso,
        runActiva: runs.get(usuarioId) ?? null,
        cartasVistas: [...(cartasVistas.get(usuarioId) ?? new Set<string>())],
      };
    },
    async guardarRun(usuarioId, input) {
      const anterior = runs.get(usuarioId);
      if (anterior && anterior.guestRunId === input.guestRunId) {
        if (input.clientRevision < anterior.clientRevision) throw new RunDesactualizadaError();
        if (input.clientRevision === anterior.clientRevision && !esLaMismaRun(anterior, input)) throw new RunEnConflictoError();
      }
      if (anterior && anterior.guestRunId !== input.guestRunId && anterior.status === "active" && input.status === "active") {
        throw new RunEnConflictoError();
      }

      const run: RunPersistida = {
        guestRunId: input.guestRunId,
        catalogVersion: input.catalogVersion,
        seed: input.seed,
        snapshot: input.snapshot,
        status: input.status,
        clientRevision: input.clientRevision,
      };
      if (input.status === "active") runs.set(usuarioId, run);
      else if (!anterior || anterior.guestRunId === input.guestRunId) runs.delete(usuarioId);

      const vistas = cartasVistas.get(usuarioId) ?? new Set<string>();
      input.cartasVistas.forEach((id) => vistas.add(id));
      cartasVistas.set(usuarioId, vistas);
      if (input.personalBest !== null) await this.guardarRecordPersonal(usuarioId, input.personalBest);
      return this.obtenerEstado(usuarioId);
    },
  };
}

function esLaMismaRun(anterior: RunPersistida, siguiente: GuardarRun): boolean {
  return JSON.stringify(anterior) === JSON.stringify({
    guestRunId: siguiente.guestRunId,
    catalogVersion: siguiente.catalogVersion,
    seed: siguiente.seed,
    snapshot: siguiente.snapshot,
    status: siguiente.status,
    clientRevision: siguiente.clientRevision,
  });
}

export function normalizarEmail(valor: string): string {
  return valor.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

export function validarRegistro(input: unknown): { email: string; username: string; password: string } {
  if (!esRegistro(input)) {
    throw new Error("El registro debe incluir email y password.");
  }

  const email = normalizarEmail(input.email);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("El email debe ser válido y tener hasta 254 caracteres.");
  }
  if (input.password.length < 5 || input.password.length > 128) {
    throw new Error("La contraseña debe tener entre 5 y 128 caracteres.");
  }

  return { email, username: email.slice(0, email.indexOf("@")), password: input.password };
}

function esRegistro(input: unknown): input is { email: string; password: string } {
  return (
    typeof input === "object" &&
    input !== null &&
    "email" in input &&
    "password" in input &&
    typeof input.email === "string" &&
    typeof input.password === "string"
  );
}

export function validarRecordPersonal(input: unknown): number {
  if (typeof input !== "object" || input === null || !("score" in input) || typeof input.score !== "number") {
    throw new Error("El récord debe incluir un score numérico.");
  }
  if (!Number.isFinite(input.score) || input.score < 0 || input.score > 150 || Math.round(input.score * 10) !== input.score * 10) {
    throw new Error("El score debe estar entre 0 y 150 con un decimal como máximo.");
  }
  return input.score;
}

export function validarPerfilInvitado(input: unknown): { personalBest: number | null } {
  if (typeof input !== "object" || input === null) {
    throw new Error("El perfil invitado debe ser un objeto.");
  }
  if (!("personalBest" in input) || input.personalBest === null) {
    return { personalBest: null };
  }
  return { personalBest: validarRecordPersonal({ score: input.personalBest }) };
}

export function validarGuardarRun(guestRunId: string, input: unknown): GuardarRun {
  if (!esUuid(guestRunId) || typeof input !== "object" || input === null) {
    throw new Error("La partida debe incluir un identificador válido y datos válidos.");
  }
  const valor = input as Record<string, unknown>;
  const catalogVersion = textoAcotado(valor.catalogVersion, 80, "catalogVersion");
  const seed = textoAcotado(valor.seed, 512, "seed");
  if (!esObjeto(valor.snapshot)) throw new Error("La partida debe incluir un snapshot válido.");
  const snapshot = valor.snapshot;
  if (JSON.stringify(snapshot).length > 100_000) throw new Error("El snapshot de la partida es demasiado grande.");
  if (valor.status !== "active" && valor.status !== "completed" && valor.status !== "abandoned") {
    throw new Error("El estado de la partida no es válido.");
  }
  if (!Number.isInteger(valor.clientRevision) || (valor.clientRevision as number) < 0) {
    throw new Error("La partida debe incluir una revisión válida.");
  }
  if (!Array.isArray(valor.cartasVistas) || valor.cartasVistas.length > 151 || !valor.cartasVistas.every((id) => typeof id === "string" && id.length > 0 && id.length <= 120)) {
    throw new Error("Las cartas vistas no son válidas.");
  }
  const personalBest = valor.personalBest === undefined || valor.personalBest === null ? null : validarRecordPersonal({ score: valor.personalBest });
  return { guestRunId, catalogVersion, seed, snapshot, status: valor.status, clientRevision: valor.clientRevision as number, cartasVistas: [...new Set(valor.cartasVistas)], personalBest };
}

function textoAcotado(valor: unknown, maximo: number, nombre: string): string {
  if (typeof valor !== "string" || valor.length === 0 || valor.length > maximo) throw new Error(`El campo ${nombre} no es válido.`);
  return valor;
}

function esUuid(valor: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}
