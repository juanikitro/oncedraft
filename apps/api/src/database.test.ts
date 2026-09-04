import { describe, expect, it } from "vitest";

import { configuracionPoolOnceDraft } from "./database.js";

describe("configuracionPoolOnceDraft", () => {
  it("limita cada conexión al esquema privado del producto", () => {
    expect(configuracionPoolOnceDraft("postgresql://draft:secret@localhost/draft")).toEqual({
      connectionString: "postgresql://draft:secret@localhost/draft",
      options: "-c search_path=once_draft",
      max: 2,
      min: 1,
      idleTimeoutMillis: 5_000,
      connectionTimeoutMillis: 5_000,
    });
  });

  it("verifica el certificado de la base cuando recibe el CA de Supabase", () => {
    const certificate = "-----BEGIN CERTIFICATE-----\\ntrusted-ca\\n-----END CERTIFICATE-----";

    expect(configuracionPoolOnceDraft("postgresql://draft:secret@localhost/draft", Buffer.from(certificate).toString("base64"))).toMatchObject({
      ssl: {
        ca: certificate,
        rejectUnauthorized: true,
      },
    });
  });
});
