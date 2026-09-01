export const shorthands = undefined;

export async function up(pgm) {
  pgm.dropConstraint("accounts", "accounts_username_format", { ifExists: true });
  pgm.dropConstraint("accounts", "accounts_username_key", { ifExists: true });
  pgm.alterColumn("accounts", "username", { type: "varchar(64)" });
  pgm.addColumn("accounts", { email: { type: "varchar(254)" } });
  pgm.addConstraint("accounts", "accounts_email_unique", { unique: "email" });
}

export async function down(pgm) {
  throw new Error("La migración de email no es reversible: usernames estéticos repetidos pueden existir.");
}
