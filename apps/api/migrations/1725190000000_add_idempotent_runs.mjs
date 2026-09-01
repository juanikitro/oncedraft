export const shorthands = undefined;

export async function up(pgm) {
  pgm.addColumns("runs", {
    guest_run_id: { type: "uuid" },
    client_revision: { type: "integer", notNull: true, default: 0 },
  });
  pgm.addConstraint("runs", "runs_client_revision_valid", { check: "client_revision >= 0" });
  pgm.createIndex("runs", ["account_id", "guest_run_id"], {
    unique: true,
    where: "guest_run_id IS NOT NULL",
    name: "runs_account_guest_run_unique",
  });
}

export async function down(pgm) {
  pgm.dropIndex("runs", ["account_id", "guest_run_id"], { name: "runs_account_guest_run_unique", ifExists: true });
  pgm.dropConstraint("runs", "runs_client_revision_valid", { ifExists: true });
  pgm.dropColumns("runs", ["guest_run_id", "client_revision"]);
}
