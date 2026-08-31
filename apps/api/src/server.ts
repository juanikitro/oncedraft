import { crearServidorDeProduccion } from "./production.js";

const { app, configuracion } = await crearServidorDeProduccion();

void app.listen({ host: configuracion.host, port: configuracion.port });
