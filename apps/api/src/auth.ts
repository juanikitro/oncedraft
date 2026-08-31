import { createHash, randomBytes } from "node:crypto";

import argon2 from "argon2";

export async function hashearPassword(password: string): Promise<string> {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verificarPassword(hash: string, password: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export function crearTokenDeSesion(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashTokenDeSesion(token) };
}

export function hashTokenDeSesion(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
