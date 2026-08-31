import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

describe("service worker publicado", () => {
  it("es JavaScript ejecutable por el navegador", () => {
    const ruta = fileURLToPath(new URL("./sw.js", import.meta.url));
    const codigo = readFileSync(ruta, "utf8");

    expect(() => new Function(codigo)).not.toThrow();
    expect(codigo).toContain('url.pathname.startsWith("/catalog/catalog-assets/"))');
  });
});
