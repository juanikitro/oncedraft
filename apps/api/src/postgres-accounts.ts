import type { Pool, PoolClient } from "pg";

import {
  type RepositorioDeCuentas,
  type Progreso,
  type Sesion,
  type Usuario,
  UsernameYaExisteError,
} from "./accounts.js";

type FilaUsuario = {
  id: string;
  username: string;
  password_hash: string;
};

type FilaSesion = {
  token_hash: string;
  account_id: string;
  expires_at: Date;
  revoked_at: Date | null;
};

export class RepositorioPostgresDeCuentas implements RepositorioDeCuentas {
  constructor(private readonly pool: Pool) {}

  async verificarDisponibilidad(): Promise<boolean> {
    try {
      await this.pool.query("SELECT 1");
      return true;
    } catch {
      return false;
    }
  }

  async crearUsuario(input: Omit<Usuario, "id">): Promise<Usuario> {
    const cliente = await this.pool.connect();
    try {
      await cliente.query("BEGIN");
      const resultado = await cliente.query<{ id: string; username: string }>(
        "INSERT INTO accounts (username) VALUES ($1) RETURNING id, username",
        [input.username],
      );
      const usuario = resultado.rows[0];
      if (!usuario) {
        throw new Error("No se pudo crear la cuenta.");
      }
      await cliente.query("INSERT INTO password_credentials (account_id, password_hash) VALUES ($1, $2)", [
        usuario.id,
        input.passwordHash,
      ]);
      await cliente.query("COMMIT");
      return { ...usuario, passwordHash: input.passwordHash };
    } catch (error: unknown) {
      await cliente.query("ROLLBACK");
      if (esUsernameDuplicado(error)) {
        throw new UsernameYaExisteError();
      }
      throw error;
    } finally {
      cliente.release();
    }
  }

  async buscarUsuarioPorUsername(username: string): Promise<Usuario | null> {
    const resultado = await this.pool.query<FilaUsuario>(
      `SELECT a.id, a.username, c.password_hash
       FROM accounts a
       JOIN password_credentials c ON c.account_id = a.id
       WHERE a.username = $1`,
      [username],
    );
    return aUsuario(resultado.rows[0]);
  }

  async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    const resultado = await this.pool.query<FilaUsuario>(
      `SELECT a.id, a.username, c.password_hash
       FROM accounts a
       JOIN password_credentials c ON c.account_id = a.id
       WHERE a.id = $1`,
      [id],
    );
    return aUsuario(resultado.rows[0]);
  }

  async crearSesion(sesion: Sesion): Promise<void> {
    await this.pool.query(
      `INSERT INTO sessions (token_hash, account_id, expires_at, revoked_at)
       VALUES ($1, $2, $3, $4)`,
      [sesion.tokenHash, sesion.usuarioId, sesion.expiraEn, sesion.revocadaEn],
    );
  }

  async buscarSesionActiva(tokenHash: string, ahora: Date): Promise<Sesion | null> {
    const resultado = await this.pool.query<FilaSesion>(
      `SELECT token_hash, account_id, expires_at, revoked_at
       FROM sessions
       WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > $2`,
      [tokenHash, ahora],
    );
    const sesion = resultado.rows[0];
    if (!sesion) {
      return null;
    }
    return {
      tokenHash: sesion.token_hash,
      usuarioId: sesion.account_id,
      expiraEn: sesion.expires_at,
      revocadaEn: sesion.revoked_at,
    };
  }

  async revocarSesion(tokenHash: string, ahora: Date): Promise<void> {
    await this.pool.query("UPDATE sessions SET revoked_at = $2 WHERE token_hash = $1 AND revoked_at IS NULL", [
      tokenHash,
      ahora,
    ]);
  }

  async obtenerProgreso(usuarioId: string): Promise<Progreso> {
    const resultado = await this.pool.query<{ personal_best: string | null }>(
      "SELECT personal_best FROM account_progress WHERE account_id = $1",
      [usuarioId],
    );
    const personalBest = resultado.rows[0]?.personal_best;
    return { personalBest: personalBest === null || personalBest === undefined ? null : Number(personalBest) };
  }

  async guardarRecordPersonal(usuarioId: string, score: number): Promise<Progreso> {
    const resultado = await this.pool.query<{ personal_best: string }>(
      `INSERT INTO account_progress (account_id, personal_best)
       VALUES ($1, $2)
       ON CONFLICT (account_id) DO UPDATE
       SET personal_best = GREATEST(account_progress.personal_best, EXCLUDED.personal_best),
           updated_at = current_timestamp
       RETURNING personal_best`,
      [usuarioId, score],
    );
    const personalBest = resultado.rows[0]?.personal_best;
    if (personalBest === undefined) {
      throw new Error("No se pudo guardar el récord personal.");
    }
    return { personalBest: Number(personalBest) };
  }
}

function aUsuario(fila: FilaUsuario | undefined): Usuario | null {
  if (!fila) {
    return null;
  }
  return { id: fila.id, username: fila.username, passwordHash: fila.password_hash };
}

function esUsernameDuplicado(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export type ClienteTransaccional = Pick<PoolClient, "query">;
