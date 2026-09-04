import { randomUUID } from "node:crypto";

import { iniciarPartidaConProteccion, type Catalogo, type EstadoPartida } from "@draft/game-core";
import type { Pool, PoolClient } from "pg";

import {
  AccionDiariaDesactualizadaError,
  aplicarAccion,
  DraftDiarioNoDisponibleError,
  fechaArgentina,
  IntentoDiarioConsumidoError,
  IntentoDiarioVencidoError,
  limitesDelDiaArgentina,
  ocultarSemillas,
  restarDias,
  type AccionDiaria,
  type EstadoDiarioPublico,
  type EstadoIntentoDiario,
  type RankingDiario,
  type RepositorioDeDraftDiario,
} from "./daily-drafts.js";

type FilaDesafio = {
  id: string;
  challenge_date: string;
  catalog_version_id: string;
  seed: string;
  starts_at: Date;
  start_cutoff_at: Date;
  ends_at: Date;
  finalized_at: Date | null;
};

type FilaIntento = {
  id: string;
  challenge_id: string;
  account_id: string;
  status: EstadoIntentoDiario;
  snapshot: EstadoPartida;
  state_version: number;
  score: string | null;
  started_at: Date;
  completed_at: Date | null;
};

export class RepositorioPostgresDeDraftDiario implements RepositorioDeDraftDiario {
  constructor(private readonly pool: Pool) {}

  async iniciarIntento(cuentaId: string, ahora: Date): Promise<EstadoDiarioPublico> {
    await this.finalizarDesafiosVencidos(ahora);
    const fecha = fechaArgentina(ahora);
    const cliente = await this.pool.connect();
    try {
      await cliente.query("BEGIN");
      const desafio = await this.obtenerOCrearDesafioActual(cliente, fecha);
      if (desafio.finalized_at || ahora < desafio.starts_at || ahora > desafio.start_cutoff_at) {
        throw new DraftDiarioNoDisponibleError("El inicio del Draft diario cerró a las 23:54 ART.");
      }
      const existente = await this.obtenerIntentoParaActualizar(cliente, cuentaId, desafio.id);
      if (existente) {
        if (existente.status === "active") {
          await cliente.query("COMMIT");
          return this.publicarIntento(existente, desafio, cliente);
        }
        throw new IntentoDiarioConsumidoError();
      }
      const catalogo = await this.obtenerCatalogo(cliente, desafio.catalog_version_id);
      const partida = iniciarPartidaConProteccion({ catalogo, seed: desafio.seed });
      const creada = await cliente.query<FilaIntento>(
        `INSERT INTO once_draft.daily_attempts
           (challenge_id, account_id, status, snapshot, state_version, started_at)
         VALUES ($1, $2, 'active', $3::jsonb, 0, $4)
         RETURNING id, challenge_id, account_id, status, snapshot, state_version, score, started_at, completed_at`,
        [desafio.id, cuentaId, JSON.stringify(partida), ahora],
      );
      const intento = creada.rows[0];
      if (!intento) throw new Error("No se pudo crear el intento diario.");
      await this.registrarEvento(cliente, desafio.id, intento.id, "started", ahora);
      const estado = await this.publicarIntento(intento, desafio, cliente);
      await cliente.query("COMMIT");
      return estado;
    } catch (error) {
      await cliente.query("ROLLBACK");
      throw error;
    } finally {
      cliente.release();
    }
  }

  async obtenerIntento(cuentaId: string, ahora: Date): Promise<EstadoDiarioPublico | null> {
    await this.finalizarDesafiosVencidos(ahora);
    const desafio = await this.obtenerDesafioPorFecha(fechaArgentina(ahora));
    if (!desafio) return null;
    const resultado = await this.pool.query<FilaIntento>(
      `SELECT id, challenge_id, account_id, status, snapshot, state_version, score, started_at, completed_at
       FROM once_draft.daily_attempts WHERE challenge_id = $1 AND account_id = $2`,
      [desafio.id, cuentaId],
    );
    const intento = resultado.rows[0];
    return intento ? this.publicarIntento(intento, desafio) : null;
  }

  async aplicarAccion({ cuentaId, version, idempotencyKey, accion, ahora }: {
    cuentaId: string; version: number; idempotencyKey: string; accion: AccionDiaria; ahora: Date;
  }): Promise<EstadoDiarioPublico> {
    await this.finalizarDesafiosVencidos(ahora);
    const fecha = fechaArgentina(ahora);
    const cliente = await this.pool.connect();
    try {
      await cliente.query("BEGIN");
      const desafio = await this.obtenerDesafioParaActualizar(cliente, fecha);
      if (!desafio) throw new DraftDiarioNoDisponibleError();
      const intento = await this.obtenerIntentoParaActualizar(cliente, cuentaId, desafio.id);
      if (!intento) throw new DraftDiarioNoDisponibleError("Primero iniciá tu intento competitivo.");
      const accionRepetida = await cliente.query<{ state_after: EstadoPartida; state_version: number; status: EstadoIntentoDiario; score: string | null }>(
        `SELECT state_after, state_version, status, score
         FROM once_draft.daily_draft_actions
         WHERE attempt_id = $1 AND idempotency_key = $2`,
        [intento.id, idempotencyKey],
      );
      if (accionRepetida.rows[0]) {
        const repetida = accionRepetida.rows[0];
        const estado = await this.publicarIntento({ ...intento, snapshot: repetida.state_after, state_version: repetida.state_version, status: repetida.status, score: repetida.score }, desafio, cliente);
        await cliente.query("COMMIT");
        return estado;
      }
      if (desafio.finalized_at || ahora >= desafio.ends_at || intento.status !== "active") throw new IntentoDiarioVencidoError();
      if (intento.state_version !== version) throw new AccionDiariaDesactualizadaError();
      const catalogo = await this.obtenerCatalogo(cliente, desafio.catalog_version_id);
      const partida = aplicarAccion({ catalogo, partida: intento.snapshot, accion });
      const status: EstadoIntentoDiario = partida.completada ? "completed" : "active";
      const score = partida.resultado?.puntaje ?? null;
      const versionSiguiente = intento.state_version + 1;
      const actualizada = await cliente.query<FilaIntento>(
        `UPDATE once_draft.daily_attempts
         SET status = $2, snapshot = $3::jsonb, state_version = $4, score = $5,
             completed_at = CASE WHEN $2 = 'completed' THEN $6 ELSE completed_at END,
             updated_at = $6
         WHERE id = $1
         RETURNING id, challenge_id, account_id, status, snapshot, state_version, score, started_at, completed_at`,
        [intento.id, status, JSON.stringify(partida), versionSiguiente, score, ahora],
      );
      const siguiente = actualizada.rows[0];
      if (!siguiente) throw new Error("No se pudo actualizar el intento diario.");
      await cliente.query(
        `INSERT INTO once_draft.daily_draft_actions
           (attempt_id, idempotency_key, state_version, action_type, action_payload, state_after, status, score)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8)`,
        [intento.id, idempotencyKey, versionSiguiente, accion.tipo, JSON.stringify(accion), JSON.stringify(partida), status, score],
      );
      await this.registrarEvento(cliente, desafio.id, intento.id, status === "completed" ? "completed" : "action_confirmed", ahora);
      const estado = await this.publicarIntento(siguiente, desafio, cliente);
      await cliente.query("COMMIT");
      return estado;
    } catch (error) {
      await cliente.query("ROLLBACK");
      throw error;
    } finally {
      cliente.release();
    }
  }

  async obtenerRanking(tipo: RankingDiario["tipo"], ahora: Date, cuentaId?: string): Promise<RankingDiario> {
    await this.finalizarDesafiosVencidos(ahora);
    const hoy = fechaArgentina(ahora);
    await this.pool.query(
      "INSERT INTO once_draft.daily_ranking_views (scope, account_id, occurred_at) VALUES ($1, $2, $3)",
      [tipo, cuentaId ?? null, ahora],
    );
    if (tipo === "ultimos_31_dias") {
      const desde = restarDias(hoy, 30);
      const resultado = await this.pool.query<{ puesto: string; username: string; points: string; es_propio: boolean }>(
        `WITH acumulado AS (
           SELECT a.account_id, SUM(a.points)::integer AS points
           FROM once_draft.daily_awards a
           JOIN once_draft.daily_challenges c ON c.id = a.challenge_id
           WHERE c.challenge_date BETWEEN $1::date AND $2::date
           GROUP BY a.account_id
         ), ranked AS (
           SELECT account_id, points, RANK() OVER (ORDER BY points DESC) AS puesto FROM acumulado
         )
         SELECT ranked.puesto, accounts.username, ranked.points, ranked.account_id = $3 AS es_propio
         FROM ranked JOIN once_draft.accounts accounts ON accounts.id = ranked.account_id
         ORDER BY ranked.puesto, accounts.username
         LIMIT 100`,
        [desde, hoy, cuentaId ?? "00000000-0000-0000-0000-000000000000"],
      );
      return { tipo, desde, hasta: hoy, filas: resultado.rows.map((fila) => ({ puesto: Number(fila.puesto), username: fila.username, puntos: Number(fila.points), esPropio: fila.es_propio })) };
    }
    const fecha = tipo === "hoy" ? hoy : restarDias(hoy, 1);
    const resultado = await this.pool.query<{ puesto: string; username: string; score: string; es_propio: boolean }>(
      `WITH ranked AS (
         SELECT a.account_id, a.score, RANK() OVER (ORDER BY a.score DESC) AS puesto
         FROM once_draft.daily_attempts a
         JOIN once_draft.daily_challenges c ON c.id = a.challenge_id
         WHERE c.challenge_date = $1::date AND a.status = 'completed'
       )
       SELECT ranked.puesto, accounts.username, ranked.score, ranked.account_id = $2 AS es_propio
       FROM ranked JOIN once_draft.accounts accounts ON accounts.id = ranked.account_id
       ORDER BY ranked.puesto, accounts.username
       LIMIT 100`,
      [fecha, cuentaId ?? "00000000-0000-0000-0000-000000000000"],
    );
    return { tipo, desde: fecha, hasta: fecha, filas: resultado.rows.map((fila) => ({ puesto: Number(fila.puesto), username: fila.username, puntaje: Number(fila.score), esPropio: fila.es_propio })) };
  }

  async registrarEventoDeCuenta(cuentaId: string, tipo: "resumed", ahora: Date): Promise<void> {
    const fecha = fechaArgentina(ahora);
    await this.pool.query(
      `INSERT INTO once_draft.daily_draft_events (challenge_id, attempt_id, event_type, occurred_at)
       SELECT a.challenge_id, a.id, $3, $4
       FROM once_draft.daily_attempts a
       JOIN once_draft.daily_challenges c ON c.id = a.challenge_id
       WHERE a.account_id = $1 AND c.challenge_date = $2::date AND a.status = 'active'`,
      [cuentaId, fecha, tipo, ahora],
    );
  }

  async finalizarDesafiosVencidos(ahora: Date): Promise<void> {
    const candidatas = await this.pool.query<{ id: string }>(
      "SELECT id FROM once_draft.daily_challenges WHERE finalized_at IS NULL AND ends_at <= $1",
      [ahora],
    );
    for (const { id } of candidatas.rows) {
      const cliente = await this.pool.connect();
      try {
        await cliente.query("BEGIN");
        const desafio = await cliente.query<FilaDesafio>("SELECT id, challenge_date, catalog_version_id, seed, starts_at, start_cutoff_at, ends_at, finalized_at FROM once_draft.daily_challenges WHERE id = $1 FOR UPDATE", [id]);
        if (!desafio.rows[0] || desafio.rows[0].finalized_at || desafio.rows[0].ends_at > ahora) {
          await cliente.query("COMMIT");
          continue;
        }
        await cliente.query(
          `WITH expired AS (
             UPDATE once_draft.daily_attempts
             SET status = 'expired', updated_at = $2
             WHERE challenge_id = $1 AND status = 'active'
             RETURNING id
           )
           INSERT INTO once_draft.daily_draft_events (challenge_id, attempt_id, event_type, occurred_at)
           SELECT $1, id, 'expired', $2 FROM expired`,
          [id, ahora],
        );
        await cliente.query(
          `WITH ranked AS (
             SELECT id, account_id, score, RANK() OVER (ORDER BY score DESC) AS puesto
             FROM once_draft.daily_attempts
             WHERE challenge_id = $1 AND status = 'completed'
           )
           INSERT INTO once_draft.daily_awards (challenge_id, account_id, attempt_id, rank, points, score)
           SELECT $1, account_id, id, puesto,
             CASE puesto WHEN 1 THEN 10 WHEN 2 THEN 6 WHEN 3 THEN 3 END,
             score
           FROM ranked WHERE puesto <= 3
           ON CONFLICT (challenge_id, account_id) DO NOTHING`,
          [id],
        );
        await cliente.query("UPDATE once_draft.daily_challenges SET finalized_at = $2 WHERE id = $1", [id, ahora]);
        await cliente.query("COMMIT");
      } catch (error) {
        await cliente.query("ROLLBACK");
        throw error;
      } finally {
        cliente.release();
      }
    }
  }

  private async obtenerOCrearDesafioActual(cliente: PoolClient, fecha: string): Promise<FilaDesafio> {
    const existente = await this.obtenerDesafioParaActualizar(cliente, fecha);
    if (existente) return existente;
    const catalogo = await cliente.query<{ id: string }>("SELECT id FROM once_draft.catalog_versions ORDER BY created_at DESC, id DESC LIMIT 1");
    const version = catalogo.rows[0]?.id;
    if (!version) throw new DraftDiarioNoDisponibleError("No hay un catálogo activo para el Draft diario.");
    const limites = limitesDelDiaArgentina(fecha);
    const creada = await cliente.query<FilaDesafio>(
      `INSERT INTO once_draft.daily_challenges
         (challenge_date, catalog_version_id, rules_version, seed, starts_at, start_cutoff_at, ends_at)
       VALUES ($1, $2, 'game-core-0.1.0', $3, $4, $5, $6)
       ON CONFLICT (challenge_date) DO NOTHING
       RETURNING id, challenge_date, catalog_version_id, seed, starts_at, start_cutoff_at, ends_at, finalized_at`,
      [fecha, version, randomUUID(), limites.iniciaEn, limites.limiteInicioEn, limites.cierraEn],
    );
    return creada.rows[0] ?? (await this.obtenerDesafioParaActualizar(cliente, fecha))!;
  }

  private async obtenerDesafioParaActualizar(cliente: PoolClient, fecha: string): Promise<FilaDesafio | null> {
    const resultado = await cliente.query<FilaDesafio>(
      `SELECT id, challenge_date, catalog_version_id, seed, starts_at, start_cutoff_at, ends_at, finalized_at
       FROM once_draft.daily_challenges WHERE challenge_date = $1::date FOR UPDATE`, [fecha],
    );
    return resultado.rows[0] ?? null;
  }

  private async obtenerDesafioPorFecha(fecha: string): Promise<FilaDesafio | null> {
    const resultado = await this.pool.query<FilaDesafio>(
      `SELECT id, challenge_date, catalog_version_id, seed, starts_at, start_cutoff_at, ends_at, finalized_at
       FROM once_draft.daily_challenges WHERE challenge_date = $1::date`, [fecha],
    );
    return resultado.rows[0] ?? null;
  }

  private async obtenerIntentoParaActualizar(cliente: PoolClient, cuentaId: string, desafioId: string): Promise<FilaIntento | null> {
    const resultado = await cliente.query<FilaIntento>(
      `SELECT id, challenge_id, account_id, status, snapshot, state_version, score, started_at, completed_at
       FROM once_draft.daily_attempts WHERE challenge_id = $1 AND account_id = $2 FOR UPDATE`, [desafioId, cuentaId],
    );
    return resultado.rows[0] ?? null;
  }

  private async obtenerCatalogo(cliente: Pick<PoolClient, "query">, version: string): Promise<Catalogo> {
    const resultado = await cliente.query<{ payload: Catalogo["cartas"][number] }>(
      "SELECT payload FROM once_draft.catalog_cards WHERE catalog_version_id = $1 ORDER BY id", [version],
    );
    if (!resultado.rows.length) throw new DraftDiarioNoDisponibleError("El catálogo del desafío no está disponible.");
    return { version, cartas: resultado.rows.map((fila) => fila.payload) };
  }

  private async publicarIntento(intento: FilaIntento, desafio: FilaDesafio, cliente: Pick<PoolClient, "query"> = this.pool): Promise<EstadoDiarioPublico> {
    const puesto = intento.status === "completed"
      ? await cliente.query<{ puesto: string }>(
        `SELECT puesto FROM (
           SELECT account_id, RANK() OVER (ORDER BY score DESC) AS puesto
           FROM once_draft.daily_attempts WHERE challenge_id = $1 AND status = 'completed'
         ) ranked WHERE account_id = $2`, [desafio.id, intento.account_id],
      )
      : { rows: [] };
    return {
      fecha: desafio.challenge_date, estado: intento.status, partida: ocultarSemillas(intento.snapshot), version: intento.state_version,
      cierraEn: desafio.ends_at.toISOString(), puestoProvisional: puesto.rows[0] ? Number(puesto.rows[0].puesto) : null,
    };
  }

  private async registrarEvento(cliente: Pick<PoolClient, "query">, desafioId: string, intentoId: string, tipo: string, ahora: Date): Promise<void> {
    await cliente.query(
      "INSERT INTO once_draft.daily_draft_events (challenge_id, attempt_id, event_type, occurred_at) VALUES ($1, $2, $3, $4)",
      [desafioId, intentoId, tipo, ahora],
    );
  }
}
