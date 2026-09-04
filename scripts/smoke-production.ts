async function main(): Promise<void> {
  const deploymentUrl = process.argv[2];
  if (!deploymentUrl) {
    throw new Error("Se requiere la URL del despliegue para ejecutar el smoke check.");
  }

  const baseUrl = new URL(deploymentUrl);

  async function request(path: string, options?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      return await fetch(new URL(path, baseUrl), { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  const health = await request("/api/health");
  if (!health.ok) {
    throw new Error(`El health check devolvió HTTP ${health.status}.`);
  }

  const healthBody = (await health.json()) as { status?: unknown };
  if (healthBody.status !== "ok") {
    throw new Error("El health check no confirmó estado ok.");
  }

  const login = await request("/api/v1/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "release-gate-no-existe@invalid.example",
      password: "release-gate-no-existe-2026",
    }),
  });
  if (login.status !== 401) {
    throw new Error(`El login de control debía devolver 401 y devolvió ${login.status}.`);
  }

  const state = await request("/api/v1/me/state");
  if (state.status !== 401) {
    throw new Error(`El estado sin sesión debía devolver 401 y devolvió ${state.status}.`);
  }

  console.log("Smoke check de producción aprobado.");
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
