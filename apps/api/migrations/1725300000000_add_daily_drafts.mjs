export const shorthands = undefined;

export async function up(pgm) {
  pgm.createTable("daily_challenges", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    challenge_date: { type: "date", notNull: true, unique: true },
    catalog_version_id: { type: "varchar(80)", notNull: true, references: "catalog_versions", onDelete: "restrict" },
    rules_version: { type: "varchar(80)", notNull: true },
    seed: { type: "text", notNull: true },
    starts_at: { type: "timestamptz", notNull: true },
    start_cutoff_at: { type: "timestamptz", notNull: true },
    ends_at: { type: "timestamptz", notNull: true },
    finalized_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint("daily_challenges", "daily_challenges_window_valid", {
    check: "starts_at < start_cutoff_at AND start_cutoff_at < ends_at",
  });

  pgm.createTable("daily_attempts", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    challenge_id: { type: "uuid", notNull: true, references: "daily_challenges", onDelete: "cascade" },
    account_id: { type: "uuid", notNull: true, references: "accounts", onDelete: "cascade" },
    status: { type: "varchar(16)", notNull: true },
    snapshot: { type: "jsonb", notNull: true },
    state_version: { type: "integer", notNull: true, default: 0 },
    score: { type: "numeric(5,1)" },
    started_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    completed_at: { type: "timestamptz" },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  }, { constraints: { unique: ["challenge_id", "account_id"] } });
  pgm.addConstraint("daily_attempts", "daily_attempts_status_valid", { check: "status IN ('active', 'completed', 'expired')" });
  pgm.addConstraint("daily_attempts", "daily_attempts_version_valid", { check: "state_version >= 0" });
  pgm.createIndex("daily_attempts", ["challenge_id", "status", "score"]);

  pgm.createTable("daily_draft_actions", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    attempt_id: { type: "uuid", notNull: true, references: "daily_attempts", onDelete: "cascade" },
    idempotency_key: { type: "uuid", notNull: true },
    state_version: { type: "integer", notNull: true },
    action_type: { type: "varchar(24)", notNull: true },
    action_payload: { type: "jsonb", notNull: true },
    state_after: { type: "jsonb", notNull: true },
    status: { type: "varchar(16)", notNull: true },
    score: { type: "numeric(5,1)" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  }, { constraints: { unique: ["attempt_id", "idempotency_key"] } });
  pgm.addConstraint("daily_draft_actions", "daily_draft_actions_status_valid", { check: "status IN ('active', 'completed', 'expired')" });

  pgm.createTable("daily_awards", {
    challenge_id: { type: "uuid", notNull: true, references: "daily_challenges", onDelete: "cascade" },
    account_id: { type: "uuid", notNull: true, references: "accounts", onDelete: "cascade" },
    attempt_id: { type: "uuid", notNull: true, references: "daily_attempts", onDelete: "cascade" },
    rank: { type: "integer", notNull: true },
    points: { type: "integer", notNull: true },
    score: { type: "numeric(5,1)", notNull: true },
    awarded_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  }, { constraints: { primaryKey: ["challenge_id", "account_id"] } });
  pgm.addConstraint("daily_awards", "daily_awards_points_valid", { check: "(rank = 1 AND points = 10) OR (rank = 2 AND points = 6) OR (rank = 3 AND points = 3)" });
  pgm.createIndex("daily_awards", ["account_id"]);

  pgm.createTable("daily_draft_events", {
    id: { type: "bigserial", primaryKey: true },
    challenge_id: { type: "uuid", notNull: true, references: "daily_challenges", onDelete: "cascade" },
    attempt_id: { type: "uuid", notNull: true, references: "daily_attempts", onDelete: "cascade" },
    event_type: { type: "varchar(40)", notNull: true },
    occurred_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createIndex("daily_draft_events", ["challenge_id", "event_type", "occurred_at"]);

  pgm.createTable("daily_ranking_views", {
    id: { type: "bigserial", primaryKey: true },
    scope: { type: "varchar(24)", notNull: true },
    account_id: { type: "uuid", references: "accounts", onDelete: "set null" },
    occurred_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint("daily_ranking_views", "daily_ranking_views_scope_valid", { check: "scope IN ('hoy', 'ayer', 'ultimos_31_dias')" });
  pgm.createIndex("daily_ranking_views", ["scope", "occurred_at"]);

  pgm.sql(`DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
      REVOKE ALL ON TABLE daily_challenges, daily_attempts, daily_draft_actions, daily_awards, daily_draft_events, daily_ranking_views FROM anon;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
      REVOKE ALL ON TABLE daily_challenges, daily_attempts, daily_draft_actions, daily_awards, daily_draft_events, daily_ranking_views FROM authenticated;
    END IF;
  END $$;`);
}

export async function down(pgm) {
  pgm.dropTable("daily_ranking_views");
  pgm.dropTable("daily_draft_events");
  pgm.dropTable("daily_awards");
  pgm.dropTable("daily_draft_actions");
  pgm.dropTable("daily_attempts");
  pgm.dropTable("daily_challenges");
}
