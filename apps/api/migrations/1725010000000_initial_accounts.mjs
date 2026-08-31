export const shorthands = undefined;

export async function up(pgm) {
  pgm.createExtension("pgcrypto", { ifNotExists: true });

  pgm.createTable("accounts", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    username: { type: "varchar(32)", notNull: true, unique: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint("accounts", "accounts_username_format", {
    check: "username ~ '^[a-z0-9_]{3,32}$'",
  });

  pgm.createTable("password_credentials", {
    account_id: { type: "uuid", primaryKey: true, references: "accounts", onDelete: "cascade" },
    password_hash: { type: "text", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createTable("catalog_versions", {
    id: { type: "varchar(80)", primaryKey: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createTable("catalog_cards", {
    id: { type: "varchar(120)", primaryKey: true },
    catalog_version_id: { type: "varchar(80)", notNull: true, references: "catalog_versions", onDelete: "restrict" },
    payload: { type: "jsonb", notNull: true },
  });

  pgm.createTable("runs", {
    id: { type: "uuid", primaryKey: true, default: pgm.func("gen_random_uuid()") },
    account_id: { type: "uuid", notNull: true, references: "accounts", onDelete: "cascade" },
    catalog_version_id: { type: "varchar(80)", notNull: true, references: "catalog_versions", onDelete: "restrict" },
    seed: { type: "text", notNull: true },
    snapshot: { type: "jsonb", notNull: true },
    status: { type: "varchar(16)", notNull: true },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.addConstraint("runs", "runs_status_valid", { check: "status IN ('active', 'completed', 'abandoned')" });
  pgm.createIndex("runs", ["account_id", "status"]);

  pgm.createTable("account_progress", {
    account_id: { type: "uuid", primaryKey: true, references: "accounts", onDelete: "cascade" },
    personal_best: { type: "numeric(5,1)" },
    active_run_id: { type: "uuid", references: "runs", onDelete: "set null" },
    updated_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });

  pgm.createTable("discovered_cards", {
    account_id: { type: "uuid", notNull: true, references: "accounts", onDelete: "cascade" },
    card_id: { type: "varchar(120)", notNull: true, references: "catalog_cards", onDelete: "restrict" },
    discovered_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  }, { constraints: { primaryKey: ["account_id", "card_id"] } });

  pgm.createTable("sessions", {
    token_hash: { type: "char(64)", primaryKey: true },
    account_id: { type: "uuid", notNull: true, references: "accounts", onDelete: "cascade" },
    expires_at: { type: "timestamptz", notNull: true },
    revoked_at: { type: "timestamptz" },
    created_at: { type: "timestamptz", notNull: true, default: pgm.func("current_timestamp") },
  });
  pgm.createIndex("sessions", ["account_id", "expires_at"]);
}

export async function down(pgm) {
  pgm.dropTable("sessions");
  pgm.dropTable("discovered_cards");
  pgm.dropTable("account_progress");
  pgm.dropTable("runs");
  pgm.dropTable("catalog_cards");
  pgm.dropTable("catalog_versions");
  pgm.dropTable("password_credentials");
  pgm.dropTable("accounts");
  pgm.dropExtension("pgcrypto", { ifExists: true });
}
