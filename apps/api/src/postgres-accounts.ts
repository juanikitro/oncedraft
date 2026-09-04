import type { Pool, PoolClient } from "pg";

import {
  type RepositorioDeCuentas,
  type Progreso,
  type EstadoDeCuenta,
  type GuardarRun,
  type RunPersistida,
  RunDesactualizadaError,
  RunEnConflictoError,
  type Sesion,
  type Usuario,
  EmailYaExisteError,
} from "./accounts.js";

type FilaUsuario = {
  id: string;
  email: string;
  username: string;
  password_hash: string;
};

type FilaSesion = {
  token_hash: string;
  account_id: string;
  expires_at: Date;
  revoked_at: Date | null;
};

type FilaRun = {
  guest_run_id: string;
  catalog_version_id: string;
  seed: string;
  snapshot: Record<string, unknown>;
  status: RunPersistida["status"];
  client_revision: number;
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
      const resultado = await cliente.query<{ id: string; email: string; username: string }>(
        "INSERT INTO once_draft.accounts (email, username) VALUES ($1, $2) RETURNING id, email, username",
        [input.email, input.username],
      );
      const usuario = resultado.rows[0];
      if (!usuario) {
        throw new Error("No se pudo crear la cuenta.");
      }
      await cliente.query("INSERT INTO once_draft.password_credentials (account_id, password_hash) VALUES ($1, $2)", [
        usuario.id,
        input.passwordHash,
      ]);
      await cliente.query("COMMIT");
      return { ...usuario, passwordHash: input.passwordHash };
    } catch (error: unknown) {
      await cliente.query("ROLLBACK");
      if (esEmailDuplicado(error)) {
        throw new EmailYaExisteError();
      }
      throw error;
    } finally {
      cliente.release();
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
    const resultado = await this.pool.query<FilaUsuario>(
      `SELECT a.id, a.email, a.username, c.password_hash
       FROM once_draft.accounts a
       JOIN once_draft.password_credentials c ON c.account_id = a.id
       WHERE a.email = $1`,
      [email],
    );
    return aUsuario(resultado.rows[0]);
  }

  async buscarUsuarioPorId(id: string): Promise<Usuario | null> {
    const resultado = await this.pool.query<FilaUsuario>(
      `SELECT a.id, a.email, a.username, c.password_hash
       FROM once_draft.accounts a
       JOIN once_draft.password_credentials c ON c.account_id = a.id
       WHERE a.id = $1`,
      [id],
    );
    return aUsuario(resultado.rows[0]);
  }

  async listarUsuariosPublicos(): Promise<readonly Pick<Usuario, "id" | "username">[]> {
    const resultado = await this.pool.query<{ id: string; username: string }>("SELECT id, username FROM once_draft.accounts");
    return resultado.rows;
  }

  async crearSesion(sesion: Sesion): Promise<void> {
    await this.pool.query(
      `INSERT INTO once_draft.sessions (token_hash, account_id, expires_at, revoked_at)
       VALUES ($1, $2, $3, $4)`,
      [sesion.tokenHash, sesion.usuarioId, sesion.expiraEn, sesion.revocadaEn],
    );
  }

  async buscarSesionActiva(tokenHash: string, ahora: Date): Promise<Sesion | null> {
    const resultado = await this.pool.query<FilaSesion>(
      `SELECT token_hash, account_id, expires_at, revoked_at
       FROM once_draft.sessions
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
    await this.pool.query("UPDATE once_draft.sessions SET revoked_at = $2 WHERE token_hash = $1 AND revoked_at IS NULL", [
      tokenHash,
      ahora,
    ]);
  }

  async obtenerProgreso(usuarioId: string): Promise<Progreso> {
    const resultado = await this.pool.query<{ personal_best: string | null }>(
      "SELECT personal_best FROM once_draft.account_progress WHERE account_id = $1",
      [usuarioId],
    );
    const personalBest = resultado.rows[0]?.personal_best;
    return { personalBest: personalBest === null || personalBest === undefined ? null : Number(personalBest) };
  }

  async guardarRecordPersonal(usuarioId: string, score: number): Promise<Progreso> {
    const resultado = await this.pool.query<{ personal_best: string }>(
      `INSERT INTO once_draft.account_progress (account_id, personal_best)
       VALUES ($1, $2)
       ON CONFLICT (account_id) DO UPDATE
       SET personal_best = GREATEST(once_draft.account_progress.personal_best, EXCLUDED.personal_best),
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

  async obtenerEstado(usuarioId: string): Promise<EstadoDeCuenta> {
    const [progreso, run, cartas] = await Promise.all([
      this.pool.query<{ personal_best: string | null; active_run_id: string | null }>(
        "SELECT personal_best, active_run_id FROM once_draft.account_progress WHERE account_id = $1",
        [usuarioId],
      ),
      this.pool.query<FilaRun>(
        `SELECT r.guest_run_id, r.catalog_version_id, r.seed, r.snapshot, r.status, r.client_revision
         FROM once_draft.account_progress p
         JOIN once_draft.runs r ON r.id = p.active_run_id
         WHERE p.account_id = $1`,
        [usuarioId],
      ),
      this.pool.query<{ card_id: string }>(
        "SELECT card_id FROM once_draft.discovered_cards WHERE account_id = $1 ORDER BY discovered_at ASC, card_id ASC",
        [usuarioId],
      ),
    ]);
    const personalBest = progreso.rows[0]?.personal_best;
    return {
      personalBest: personalBest === null || personalBest === undefined ? null : Number(personalBest),
      runActiva: aRun(run.rows[0]),
      cartasVistas: cartas.rows.map((fila) => fila.card_id),
    };
  }

  async guardarRun(usuarioId: string, input: GuardarRun): Promise<EstadoDeCuenta> {
    const cliente = await this.pool.connect();
    try {
      await cliente.query("BEGIN");
      await cliente.query(
        "INSERT INTO once_draft.account_progress (account_id) VALUES ($1) ON CONFLICT (account_id) DO NOTHING",
        [usuarioId],
      );
      await cliente.query(
        "SELECT account_id FROM once_draft.account_progress WHERE account_id = $1 FOR UPDATE",
        [usuarioId],
      );
      const activa = await cliente.query<FilaRun>(
        `SELECT r.guest_run_id, r.catalog_version_id, r.seed, r.snapshot, r.status, r.client_revision
         FROM once_draft.account_progress p
         JOIN once_draft.runs r ON r.id = p.active_run_id
         WHERE p.account_id = $1 FOR UPDATE`,
        [usuarioId],
      );
      const existente = await cliente.query<FilaRun>(
        `SELECT guest_run_id, catalog_version_id, seed, snapshot, status, client_revision
         FROM once_draft.runs WHERE account_id = $1 AND guest_run_id = $2 FOR UPDATE`,
        [usuarioId, input.guestRunId],
      );
      const runExistente = aRun(existente.rows[0]);
      if (runExistente && input.clientRevision < runExistente.clientRevision) throw new RunDesactualizadaError();
      if (runExistente && input.clientRevision === runExistente.clientRevision && !coincideRun(runExistente, input)) throw new RunEnConflictoError();
      const runActiva = aRun(activa.rows[0]);
      if (runActiva && runActiva.guestRunId !== input.guestRunId && runActiva.status === "active" && input.status === "active") {
        throw new RunEnConflictoError();
      }

      let runId: string;
      if (runExistente) {
        const actualizada = await cliente.query<{ id: string }>(
          `UPDATE once_draft.runs
           SET catalog_version_id = $3, seed = $4, snapshot = $5::jsonb, status = $6, client_revision = $7, updated_at = current_timestamp
           WHERE account_id = $1 AND guest_run_id = $2 RETURNING id`,
          [usuarioId, input.guestRunId, input.catalogVersion, input.seed, JSON.stringify(input.snapshot), input.status, input.clientRevision],
        );
        runId = actualizada.rows[0]?.id ?? "";
      } else {
        const creada = await cliente.query<{ id: string }>(
          `INSERT INTO once_draft.runs (account_id, guest_run_id, catalog_version_id, seed, snapshot, status, client_revision)
           VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7) RETURNING id`,
          [usuarioId, input.guestRunId, input.catalogVersion, input.seed, JSON.stringify(input.snapshot), input.status, input.clientRevision],
        );
        runId = creada.rows[0]?.id ?? "";
      }
      if (!runId) throw new Error("No se pudo guardar la partida.");
      if (input.cartasVistas.length > 0) {
        await cliente.query(
          `INSERT INTO once_draft.discovered_cards (account_id, card_id)
           SELECT $1, id FROM once_draft.catalog_cards WHERE id = ANY($2)
           ON CONFLICT (account_id, card_id) DO NOTHING`,
          [usuarioId, input.cartasVistas],
        );
      }
      await cliente.query(
        `UPDATE once_draft.account_progress
         SET active_run_id = CASE WHEN $4 = 'active' THEN $2 ELSE active_run_id END,
             personal_best = CASE WHEN $3::numeric IS NULL THEN personal_best ELSE GREATEST(COALESCE(personal_best, $3), $3) END,
             updated_at = current_timestamp
         WHERE account_id = $1`,
        [usuarioId, runId, input.personalBest, input.status],
      );
      await cliente.query("COMMIT");
    } catch (error) {
      await cliente.query("ROLLBACK");
      throw error;
    } finally {
      cliente.release();
    }
    return this.obtenerEstado(usuarioId);
  }
}

function aRun(fila: FilaRun | undefined): RunPersistida | null {
  if (!fila) return null;
  return {
    guestRunId: fila.guest_run_id,
    catalogVersion: fila.catalog_version_id,
    seed: fila.seed,
    snapshot: fila.snapshot,
    status: fila.status,
    clientRevision: fila.client_revision,
  };
}

function coincideRun(anterior: RunPersistida, siguiente: GuardarRun): boolean {
  return JSON.stringify(anterior) === JSON.stringify({
    guestRunId: siguiente.guestRunId,
    catalogVersion: siguiente.catalogVersion,
    seed: siguiente.seed,
    snapshot: siguiente.snapshot,
    status: siguiente.status,
    clientRevision: siguiente.clientRevision,
  });
}

function aUsuario(fila: FilaUsuario | undefined): Usuario | null {
  if (!fila) {
    return null;
  }
  return { id: fila.id, email: fila.email, username: fila.username, passwordHash: fila.password_hash };
}

function esEmailDuplicado(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}

export type ClienteTransaccional = Pick<PoolClient, "query">;
