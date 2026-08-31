export type Usuario = {
  id: string;
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

export interface RepositorioDeCuentas {
  verificarDisponibilidad(): Promise<boolean>;
  crearUsuario(input: Omit<Usuario, "id">): Promise<Usuario>;
  buscarUsuarioPorUsername(username: string): Promise<Usuario | null>;
  buscarUsuarioPorId(id: string): Promise<Usuario | null>;
  crearSesion(sesion: Sesion): Promise<void>;
  buscarSesionActiva(tokenHash: string, ahora: Date): Promise<Sesion | null>;
  revocarSesion(tokenHash: string, ahora: Date): Promise<void>;
  obtenerProgreso(usuarioId: string): Promise<Progreso>;
  guardarRecordPersonal(usuarioId: string, score: number): Promise<Progreso>;
}

export class UsernameYaExisteError extends Error {
  constructor() {
    super("El nombre de usuario ya está en uso.");
  }
}

export function crearRepositorioDeCuentasEnMemoria(): RepositorioDeCuentas {
  const usuarios = new Map<string, Usuario>();
  const sesiones = new Map<string, Sesion>();
  const progresos = new Map<string, Progreso>();
  let siguienteId = 1;

  return {
    async verificarDisponibilidad() {
      return true;
    },
    async crearUsuario(input) {
      if (usuarios.has(input.username)) {
        throw new UsernameYaExisteError();
      }

      const usuario = { ...input, id: `usuario-${siguienteId++}` };
      usuarios.set(usuario.username, usuario);
      return usuario;
    },
    async buscarUsuarioPorUsername(username) {
      return usuarios.get(username) ?? null;
    },
    async buscarUsuarioPorId(id) {
      return [...usuarios.values()].find((usuario) => usuario.id === id) ?? null;
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
  };
}

export function normalizarUsername(valor: string): string {
  return valor.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

export function validarRegistro(input: unknown): { username: string; password: string } {
  if (!esRegistro(input)) {
    throw new Error("El registro debe incluir username y password.");
  }

  const username = normalizarUsername(input.username);
  if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    throw new Error("El username debe tener entre 3 y 32 caracteres: letras, números o guion bajo.");
  }
  if (input.password.length < 10 || input.password.length > 128) {
    throw new Error("La contraseña debe tener entre 10 y 128 caracteres.");
  }

  return { username, password: input.password };
}

function esRegistro(input: unknown): input is { username: string; password: string } {
  return (
    typeof input === "object" &&
    input !== null &&
    "username" in input &&
    "password" in input &&
    typeof input.username === "string" &&
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
