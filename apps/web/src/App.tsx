import { useEffect, useMemo, useRef, useState } from "react";

import {
  calcularConexionesDeQuimica,
  calcularOvrEfectivo,
  confirmarPick,
  iniciarPartidaConProteccion,
  PLAZAS_4_3_3,
  reorganizarPartida,
  usarReroll,
  usarScouting,
  type EstadoPartida,
  type IdPlaza,
  type Rasgo,
} from "@draft/game-core";

import { cargarCatalogoPublicado, type CartaPublicada, type CatalogoPublicado } from "./catalogo-publicado";
import { cerrarSesion, ErrorDeApi, guardarRunRemota, iniciarSesion, obtenerEstadoRemoto, obtenerMiCuenta, registrar, type EstadoRemoto, type UsuarioAutenticado } from "./api-client";
import { crearRepositorioDePerfilInvitado, esEstadoPartidaPersistido, type ConflictoDeSincronizacion, type PerfilInvitado } from "./perfil-invitado";

type Vista = "inicio" | "draft" | "resultado" | "formacion";
type ModoDraft = "pizarra" | "oferta";
type PanelAnalisis = "quimica" | "traits" | null;
type FaseRevelacion = "pais" | "epoca" | "cartas";
type EstadoCuenta = { tipo: "cargando" | "invitado" } | { tipo: "autenticado"; usuario: UsuarioAutenticado };
type EstadoSincronizacion = "inactiva" | "sincronizando" | "offline" | "error" | "conflicto";

const RASGOS: readonly Rasgo[] = ["Rematador", "Creador", "Tecnico", "Velocista", "Fisico", "Muro defensivo"];

export function App() {
  const repositorio = useMemo(() => crearRepositorioDePerfilInvitado({ almacenamiento: window.localStorage }), []);
  const [perfil, setPerfil] = useState<PerfilInvitado>(() => repositorio.cargar());
  const [catalogo, setCatalogo] = useState<CatalogoPublicado | null>(null);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("inicio");
  const [modoDraft, setModoDraft] = useState<ModoDraft>("oferta");
  const [faseRevelacion, setFaseRevelacion] = useState<FaseRevelacion>("cartas");
  const [secuenciaOferta, setSecuenciaOferta] = useState(0);
  const [pasoRuleta, setPasoRuleta] = useState(0);
  const [partida, setPartida] = useState<EstadoPartida | null>(null);
  const [idInspeccionada, setIdInspeccionada] = useState<string | null>(null);
  const [idCartaEnPrueba, setIdCartaEnPrueba] = useState<string | null>(null);
  const [idPlazaEnPrueba, setIdPlazaEnPrueba] = useState<IdPlaza | null>(null);
  const [panelAnalisis, setPanelAnalisis] = useState<PanelAnalisis>(null);
  const [confirmandoRepetir, setConfirmandoRepetir] = useState(false);
  const [idCartaParaMover, setIdCartaParaMover] = useState<string | null>(null);
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const [mostrandoScouting, setMostrandoScouting] = useState(false);
  const [cuenta, setCuenta] = useState<EstadoCuenta>({ tipo: "cargando" });
  const [estadoSincronizacion, setEstadoSincronizacion] = useState<EstadoSincronizacion>("inactiva");
  const [mostrandoCuenta, setMostrandoCuenta] = useState(false);
  const [modoCuenta, setModoCuenta] = useState<"registro" | "login">("registro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorCuenta, setErrorCuenta] = useState<string | null>(null);
  const [enviandoCuenta, setEnviandoCuenta] = useState(false);
  const perfilActual = useRef(perfil);
  const cuentaActual = useRef<EstadoCuenta>(cuenta);
  const sincronizando = useRef(false);
  const sincronizacionSolicitada = useRef(false);

  useEffect(() => { perfilActual.current = perfil; }, [perfil]);
  useEffect(() => { cuentaActual.current = cuenta; }, [cuenta]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [vista]);

  useEffect(() => {
    if (!secuenciaOferta) return;
    setFaseRevelacion("pais");
    setPasoRuleta(0);
    const pais = window.setTimeout(() => {
      setFaseRevelacion("epoca");
      setPasoRuleta(0);
    }, 500);
    const epoca = window.setTimeout(() => setFaseRevelacion("cartas"), 1_000);
    return () => {
      window.clearTimeout(pais);
      window.clearTimeout(epoca);
    };
  }, [secuenciaOferta]);

  useEffect(() => {
    if (faseRevelacion === "cartas") return;
    const ruleta = window.setInterval(() => setPasoRuleta((paso) => paso + 1), 50);
    return () => window.clearInterval(ruleta);
  }, [faseRevelacion]);

  useEffect(() => {
    let activa = true;
    void cargarCatalogoPublicado()
      .then((catalogoPublicado) => {
        if (!activa) return;
        setCatalogo(catalogoPublicado);
        const partidaGuardada = repositorio.cargar().partidaActiva;
        if (partidaGuardada && !partidaGuardada.completada && partidaGuardada.versionCatalogo === catalogoPublicado.version) {
          setPartida(partidaGuardada);
        }
      })
      .catch((causa: unknown) => {
        if (activa) setError(causa instanceof Error ? causa.message : "No se pudo verificar el catálogo activo.");
      })
      .finally(() => {
        if (activa) setCargandoCatalogo(false);
      });
    return () => { activa = false; };
  }, [repositorio]);

  useEffect(() => {
    if (!catalogo) return;
    let activa = true;
    void restaurarSesion();
    window.addEventListener("online", alReconectar);
    return () => {
      activa = false;
      window.removeEventListener("online", alReconectar);
    };

    async function restaurarSesion(): Promise<void> {
      if (!navigator.onLine) {
        if (activa) {
          setCuenta({ tipo: "invitado" });
          setEstadoSincronizacion("offline");
        }
        return;
      }
      try {
        const usuario = await obtenerMiCuenta();
        if (!activa) return;
        if (!usuario) {
          setCuenta({ tipo: "invitado" });
          setEstadoSincronizacion("inactiva");
          return;
        }
        const siguiente = { tipo: "autenticado", usuario } as const;
        setCuenta(siguiente);
        cuentaActual.current = siguiente;
        await sincronizarProgreso(usuario);
      } catch (causa: unknown) {
        if (!activa) return;
        setCuenta({ tipo: "invitado" });
        setEstadoSincronizacion(esErrorDeRed(causa) ? "offline" : "error");
      }
    }

    function alReconectar(): void {
      const actual = cuentaActual.current;
      if (actual.tipo === "autenticado") void sincronizarProgreso(actual.usuario);
      else void restaurarSesion();
    }
  }, [catalogo, repositorio]);

  const cartasPorId = useMemo(() => new Map(catalogo?.cartas.map((carta) => [carta.id, carta])), [catalogo]);
  const partidaReanudable = perfil.partidaActiva && !perfil.partidaActiva.completada && perfil.partidaActiva.versionCatalogo === catalogo?.version
    ? perfil.partidaActiva
    : null;
  function persistirPartida(siguiente: EstadoPartida): void {
    setNuevoRecord(Boolean(siguiente.completada && siguiente.resultado && (perfil.personalBest === null || siguiente.resultado.puntaje > perfil.personalBest)));
    const ownerEmail = cuentaActual.current.tipo === "autenticado" ? cuentaActual.current.usuario.email : null;
    const siguientePerfil = siguiente.completada ? repositorio.finalizarPartida(siguiente, ownerEmail) : repositorio.guardarPartida(siguiente, ownerEmail);
    actualizarPerfil(siguientePerfil);
    setPartida(siguiente);
    setIdInspeccionada(null);
    setIdCartaEnPrueba(null);
    setIdPlazaEnPrueba(null);
    setPanelAnalisis(null);
    setIdCartaParaMover(null);
    setConfirmandoRepetir(false);
    setMostrandoScouting(false);
    setVista(siguiente.completada ? "resultado" : "draft");
    if (cuentaActual.current.tipo === "autenticado") void sincronizarProgreso(cuentaActual.current.usuario);
  }

  function actualizarPerfil(siguiente: PerfilInvitado): void {
    perfilActual.current = siguiente;
    setPerfil(siguiente);
  }

  async function sincronizarProgreso(usuario: UsuarioAutenticado): Promise<void> {
    if (!catalogo) return;
    if (sincronizando.current) {
      sincronizacionSolicitada.current = true;
      return;
    }
    if (!navigator.onLine) {
      setEstadoSincronizacion("offline");
      return;
    }

    sincronizando.current = true;
    setEstadoSincronizacion("sincronizando");
    try {
      actualizarPerfil(repositorio.vincularPendientes(usuario.email));
      const remoto = await obtenerEstadoRemoto();
      const conflicto = prepararConflicto(perfilActual.current, remoto);
      if (conflicto) {
        actualizarPerfil(repositorio.registrarConflicto(conflicto));
        setEstadoSincronizacion("conflicto");
        return;
      }

      const runRemota = convertirRunRemota(remoto);
      if (runRemota && !perfilActual.current.partidaActiva) {
        actualizarPerfil(repositorio.hidratarRunRemota(runRemota));
        setPartida(runRemota.partida);
      }

      for (const pendiente of perfilActual.current.pendientes) {
        if (pendiente.ownerEmail !== usuario.email) continue;
        await guardarRunRemota(pendiente);
        actualizarPerfil(repositorio.confirmarPendiente(pendiente.guestRunId, pendiente.clientRevision));
      }
      setEstadoSincronizacion("inactiva");
    } catch (causa: unknown) {
      if (causa instanceof ErrorDeApi && (causa.code === "STALE_RUN" || causa.code === "RUN_CONFLICT")) {
        const local = perfilActual.current.pendientes.find((pendiente) => pendiente.ownerEmail === usuario.email);
        try {
          const remoto = await obtenerEstadoRemoto();
          const runRemota = convertirRunRemota(remoto);
          if (local && runRemota) {
            actualizarPerfil(repositorio.registrarConflicto({ code: causa.code, local, remoto: runRemota }));
            setEstadoSincronizacion("conflicto");
            return;
          }
        } catch {
          // Se conserva la cola local y se muestra el error recuperable abajo.
        }
      }
      if (causa instanceof ErrorDeApi && causa.code === "UNAUTHENTICATED") {
        setCuenta({ tipo: "invitado" });
        setEstadoSincronizacion("inactiva");
      } else {
        setEstadoSincronizacion(esErrorDeRed(causa) ? "offline" : "error");
      }
    } finally {
      sincronizando.current = false;
      if (sincronizacionSolicitada.current) {
        sincronizacionSolicitada.current = false;
        void sincronizarProgreso(usuario);
      }
    }
  }

  function prepararConflicto(local: PerfilInvitado, remoto: EstadoRemoto): ConflictoDeSincronizacion | null {
    const runRemota = convertirRunRemota(remoto);
    const pendiente = local.partidaActiva && local.guestRunId
      ? local.pendientes.find((item) => item.guestRunId === local.guestRunId) ?? null
      : null;
    if (!runRemota || !pendiente) return null;
    const mismoContenido = pendiente.guestRunId === runRemota.guestRunId && pendiente.clientRevision === runRemota.clientRevision && JSON.stringify(pendiente.partida) === JSON.stringify(runRemota.partida);
    if (mismoContenido || (pendiente.guestRunId === runRemota.guestRunId && pendiente.clientRevision > runRemota.clientRevision)) return null;
    return { code: pendiente.guestRunId === runRemota.guestRunId ? "STALE_RUN" : "RUN_CONFLICT", local: pendiente, remoto: runRemota };
  }

  function convertirRunRemota(remoto: EstadoRemoto): ConflictoDeSincronizacion["remoto"] | null {
    const run = remoto.runActiva;
    if (!run || run.status !== "active" || !esEstadoPartidaPersistido(run.snapshot) || run.catalogVersion !== catalogo?.version) return null;
    return { guestRunId: run.guestRunId, clientRevision: run.clientRevision, partida: run.snapshot, cartasVistas: remoto.cartasVistas, personalBest: remoto.personalBest };
  }

  async function enviarCuenta(evento: React.FormEvent<HTMLFormElement>): Promise<void> {
    evento.preventDefault();
    setEnviandoCuenta(true);
    setErrorCuenta(null);
    try {
      const usuario = modoCuenta === "registro" ? await registrar(email, password) : await iniciarSesion(email, password);
      const siguiente = { tipo: "autenticado", usuario } as const;
      setCuenta(siguiente);
      cuentaActual.current = siguiente;
      setPassword("");
      await sincronizarProgreso(usuario);
    } catch (causa: unknown) {
      setErrorCuenta(mensajeDeCuenta(causa));
    } finally {
      setEnviandoCuenta(false);
    }
  }

  async function salirDeCuenta(): Promise<void> {
    try {
      await cerrarSesion();
    } catch (causa: unknown) {
      setErrorCuenta(mensajeDeCuenta(causa));
      return;
    }
    setCuenta({ tipo: "invitado" });
    cuentaActual.current = { tipo: "invitado" };
    setEstadoSincronizacion("inactiva");
    setMostrandoCuenta(false);
  }

  function usarProgresoDeCuenta(): void {
    const conflicto = perfilActual.current.conflicto;
    if (!conflicto) return;
    const siguiente = repositorio.usarRunRemota(conflicto);
    actualizarPerfil(siguiente);
    setPartida(conflicto.remoto.partida);
    setEstadoSincronizacion("inactiva");
  }

  function mantenerProgresoLocal(): void {
    const conflicto = perfilActual.current.conflicto;
    const actual = cuentaActual.current;
    if (!conflicto || actual.tipo !== "autenticado") return;
    const siguiente = repositorio.mantenerRunLocal(conflicto, actual.usuario.email);
    actualizarPerfil(siguiente);
    setPartida(siguiente.partidaActiva);
    setEstadoSincronizacion("inactiva");
    void sincronizarProgreso(actual.usuario);
  }

  function iniciarNuevaPartida(): void {
    if (!catalogo) return;
    try {
      setError(null);
      setNuevoRecord(false);
      prepararRevelacionDeOferta();
      persistirPartida(iniciarPartidaConProteccion({ catalogo, seed: crearSeed() }));
    } catch (causa: unknown) {
      setError(causa instanceof Error ? causa.message : "No se pudo iniciar la partida.");
    }
  }

  function abrirOferta(): void {
    setError(null);
    setIdCartaEnPrueba(null);
    setIdPlazaEnPrueba(null);
    setModoDraft("oferta");
  }

  function prepararRevelacionDeOferta(): void {
    setFaseRevelacion("pais");
    setModoDraft("oferta");
    setSecuenciaOferta((secuencia) => secuencia + 1);
  }

  function probarCarta(idCarta: string): void {
    if (!catalogo || !partida) return;
    try {
      const simulacionInicial = confirmarPick({ catalogo, partida, idCartaElegida: idCarta });
      const ubicacionInicial = simulacionInicial.ubicaciones.find((ubicacion) => ubicacion.idCarta === idCarta);
      if (!ubicacionInicial) throw new Error("No se pudo preparar la carta para la pizarra.");
      setError(null);
      setIdInspeccionada(null);
      setIdCartaEnPrueba(idCarta);
      setIdPlazaEnPrueba(ubicacionInicial.idPlaza);
      setModoDraft("pizarra");
    } catch (causa: unknown) {
      setError(causa instanceof Error ? causa.message : "No se pudo probar la carta elegida.");
    }
  }

  function cancelarPrueba(): void {
    setIdInspeccionada(null);
    setIdCartaEnPrueba(null);
    setIdPlazaEnPrueba(null);
    setModoDraft("oferta");
  }

  function confirmarPruebaYAvanzar(): void {
    if (!catalogo || !partida || !idCartaEnPrueba || !idPlazaEnPrueba) return;
    try {
      persistirPartida(confirmarPick({ catalogo, partida, idCartaElegida: idCartaEnPrueba, idPlazaDestino: idPlazaEnPrueba }));
      prepararRevelacionDeOferta();
    } catch (causa: unknown) {
      setError(causa instanceof Error ? causa.message : "No se pudo confirmar la carta en esa plaza.");
    }
  }

  const partidaEnPrueba = useMemo(() => {
    if (!catalogo || !partida || !idCartaEnPrueba || !idPlazaEnPrueba) return null;
    try {
      return confirmarPick({ catalogo, partida, idCartaElegida: idCartaEnPrueba, idPlazaDestino: idPlazaEnPrueba });
    } catch {
      return null;
    }
  }, [catalogo, idCartaEnPrueba, idPlazaEnPrueba, partida]);

  function explorarProximoRoll(): void {
    if (!catalogo || !partida) return;
    try {
      persistirPartida(usarScouting({ catalogo, partida }));
      setMostrandoScouting(true);
    }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo explorar el próximo roll."); }
  }

  function repetirOferta(): void {
    if (!catalogo || !partida) return;
    try { const siguiente = usarReroll({ catalogo, partida }); prepararRevelacionDeOferta(); persistirPartida(siguiente); }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo repetir la oferta."); }
  }

  function moverCarta(idPlazaDestino: IdPlaza): void {
    if (!partida || !idCartaParaMover) return;
    try { persistirPartida(reorganizarPartida({ partida, idCarta: idCartaParaMover, idPlazaDestino })); }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo reorganizar la formación."); }
  }

  const modalCuenta = mostrandoCuenta ? <CuentaModal cuenta={cuenta} estadoSincronizacion={estadoSincronizacion} modo={modoCuenta} email={email} password={password} error={errorCuenta} enviando={enviandoCuenta} conflicto={perfil.conflicto} alCerrar={() => setMostrandoCuenta(false)} alCambiarModo={setModoCuenta} alCambiarEmail={setEmail} alCambiarPassword={setPassword} alEnviar={enviarCuenta} alCerrarSesion={salirDeCuenta} alUsarRemoto={usarProgresoDeCuenta} alMantenerLocal={mantenerProgresoLocal} /> : null;

  if (cargandoCatalogo) return <EstadoDeCatalogo titulo="Verificando el catálogo" detalle="La partida se habilita sólo con las 151 cartas y activos aprobados." />;
  if (!catalogo) return <EstadoDeCatalogo titulo="Catálogo en curaduría" detalle={error ?? "Todavía no hay un catálogo activo disponible."} />;

  if (vista === "resultado" && partida?.completada && partida.resultado) {
    return <><Resultado partida={partida} personalBest={perfil.personalBest} nuevoRecord={nuevoRecord} alJugarOtra={iniciarNuevaPartida} alVerFormacion={() => setVista("formacion")} />{modalCuenta}</>;
  }

  if (vista === "formacion" && partida?.completada) {
    return <><main className="resultado"><button className="cuenta-disparador" type="button" onClick={() => setMostrandoCuenta(true)}>Cuenta</button><p className="eyebrow">Squad completa</p><h1>Tu formación</h1><Formacion partida={partida} cartasPorId={cartasPorId} idCartaParaMover={idCartaParaMover} alElegirCartaParaMover={setIdCartaParaMover} alMoverCarta={moverCarta} /><button className="cta-secundaria" type="button" onClick={() => setVista("resultado")}>Volver al resultado</button></main>{modalCuenta}</>;
  }

  if (vista === "draft" && partida) {
    const cartaInspeccionada = idInspeccionada ? cartasPorId.get(idInspeccionada) ?? null : null;
    const cartasDeOferta = partida.ofertaActiva.opciones.flatMap((carta) => {
      const cartaPublicada = cartasPorId.get(carta.id);
      return cartaPublicada ? [cartaPublicada] : [];
    });
    const partidaVisible = partidaEnPrueba ?? partida;
    const cartaEnPrueba = idCartaEnPrueba ? cartasPorId.get(idCartaEnPrueba) ?? null : null;
    return <main className="app-shell">
      <CabeceraDeRun partida={partida} etiquetaCuenta={etiquetaCuenta(cuenta, estadoSincronizacion)} alAbrirCuenta={() => setMostrandoCuenta(true)} />
      {error ? <p className="mensaje-error">{error}</p> : null}
      {modoDraft === "oferta" ? <section className="oferta oferta-viewport" aria-labelledby="titulo-oferta"><div className="oferta-encabezado"><h1 id="titulo-oferta">Elegí una leyenda</h1><button className="cta-discreta" type="button" disabled={faseRevelacion !== "cartas"} onClick={() => setModoDraft("pizarra")}>Volver a pizarra</button></div>
        <ContextoDeOferta contexto={partida.ofertaActiva.contexto} fase={faseRevelacion} pasoRuleta={pasoRuleta} />
        <PanelDeDecisiones partida={partida} bloqueada={faseRevelacion !== "cartas"} alExplorar={explorarProximoRoll} alPedirRepetir={() => setConfirmandoRepetir(true)} />
        {cartasDeOferta.length === 5
          ? <OfertaAmpliada key={cartasDeOferta.map((carta) => carta.id).join("|")} cartas={cartasDeOferta} bloqueada={faseRevelacion !== "cartas"} alProbar={probarCarta} />
          : <OfertaNormal key={cartasDeOferta.map((carta) => carta.id).join("|")} cartas={cartasDeOferta} bloqueada={faseRevelacion !== "cartas"} alProbar={probarCarta} />}
      </section> : <section className="pizarra-viewport" aria-label="Pizarra de la partida">
        <ResumenDeSquad partida={partidaVisible} simulacion={Boolean(partidaEnPrueba)} alAnalizar={() => setPanelAnalisis("quimica")} />
        <Formacion partida={partidaVisible} cartasPorId={cartasPorId} idCartaParaMover={idCartaParaMover} alElegirCartaParaMover={setIdCartaParaMover} alMoverCarta={moverCarta} idCartaEnPrueba={idCartaEnPrueba} idPlazaEnPrueba={idPlazaEnPrueba} alCambiarPlazaEnPrueba={setIdPlazaEnPrueba} />
        {cartaEnPrueba ? <aside className="prueba-activa"><div><p>Simulación · sin confirmar</p><strong>{cartaEnPrueba.nombre}</strong><small>{cartaEnPrueba.ovr} · {cartaEnPrueba.posicionPrimaria} · {cartaEnPrueba.rasgo}</small></div><button className="cta-discreta" type="button" onClick={() => setIdInspeccionada(cartaEnPrueba.id)}>Inspeccionar</button></aside> : null}
        <div className="dock-siguiente">{cartaEnPrueba ? <button className="cta-discreta" type="button" onClick={cancelarPrueba}>Cancelar prueba</button> : null}<button className="cta-principal" type="button" disabled={Boolean(cartaEnPrueba && !idPlazaEnPrueba)} onClick={cartaEnPrueba ? confirmarPruebaYAvanzar : abrirOferta}>Siguiente opción</button>{cartaEnPrueba && idPlazaEnPrueba ? <small>Confirma a {cartaEnPrueba.nombre} en {PLAZAS_4_3_3.find((plaza) => plaza.id === idPlazaEnPrueba)?.posicion}</small> : null}</div>
      </section>}
      {cartaInspeccionada ? <div className="capa-modal" role="presentation"><aside className="hoja-detalle" role="dialog" aria-modal="true" aria-label={`Detalle de ${cartaInspeccionada.nombre}`}><div className="detalle-scroll"><div className="asa-hoja" /><p className="eyebrow">Ficha de leyenda</p><CartaDeOferta carta={cartaInspeccionada} inspeccionada alInspeccionar={() => setIdInspeccionada(null)} /><div className="detalle-datos"><strong>{cartaInspeccionada.club} · {cartaInspeccionada.temporada}</strong><p>Posición primaria <b>{cartaInspeccionada.posicionPrimaria}</b> · OVR base <b>{cartaInspeccionada.ovr}</b></p>{cartaInspeccionada.posicionesSecundarias.length ? <p className="posiciones-secundarias">Secundarias · {cartaInspeccionada.posicionesSecundarias.join(" · ")}</p> : null}<p>Trait de squad · <b>{cartaInspeccionada.rasgo}</b></p></div></div><div className="acciones-detalle"><button className="cta-secundaria" type="button" onClick={() => setIdInspeccionada(null)}>Cerrar detalle</button></div></aside></div> : null}
      {panelAnalisis ? <div className="capa-modal" role="presentation"><HojaAnalisis partida={partidaVisible} panel={panelAnalisis} alCambiarPanel={setPanelAnalisis} alCerrar={() => setPanelAnalisis(null)} /></div> : null}
      {confirmandoRepetir ? <div className="capa-modal" role="presentation"><aside className="hoja-confirmacion" aria-label="Confirmar repetir oferta"><div className="asa-hoja" /><p className="eyebrow">Una decisión</p><h2>Repetir oferta</h2><p>Reemplaza estas opciones, mantiene <strong>{partida.ofertaActiva.contexto.pais} · {partida.ofertaActiva.contexto.cicloMundial}</strong> y consume el único uso.</p><p className="nota-confirmacion">No garantiza una mejora de OVR.</p><button className="cta-principal" type="button" onClick={repetirOferta}>Repetir oferta</button><button className="cta-secundaria" type="button" onClick={() => setConfirmandoRepetir(false)}>Cancelar</button></aside></div> : null}
      {mostrandoScouting && partida.informeScouting ? <div className="capa-modal" role="presentation"><HojaScouting informe={partida.informeScouting} alCerrar={() => setMostrandoScouting(false)} /></div> : null}
      {modalCuenta}
    </main>;
  }

  return <><main className="landing"><button className="cuenta-disparador" type="button" onClick={() => setMostrandoCuenta(true)}>{etiquetaCuenta(cuenta, estadoSincronizacion)}</button><div className="marca">ONCE <span>DRAFT</span></div><div className="hero-copy"><p className="eyebrow">Selección histórica · 4–6 minutos</p><h1>Tu selección de 11 leyendas</h1><p className="bajada">Elegí cada leyenda de una combinación de país y época.</p></div>{partidaReanudable ? <TarjetaReanudar partida={partidaReanudable} cartasPorId={cartasPorId} alReanudar={() => { setPartida(partidaReanudable); prepararRevelacionDeOferta(); setVista("draft"); }} /> : <section className="modo-principal"><div><span className="numero-modo">11</span><p><b>Partida libre</b><small>elecciones · 4–6 minutos</small></p></div><button className="cta-principal" type="button" onClick={iniciarNuevaPartida}>Iniciar partida</button></section>}<section className="modo-bloqueado" aria-label="Modo próximo"><div><p>Draft diario</p><span>Mismas oportunidades para todos</span></div><b>Próximamente</b></section>{partidaReanudable ? <button className="cta-discreta" type="button" onClick={iniciarNuevaPartida}>Iniciar otra partida</button> : null}</main>{modalCuenta}</>;
}

function EstadoDeCatalogo({ titulo, detalle }: { titulo: string; detalle: string }) { return <main className="estado-catalogo"><div className="marca">ONCE <span>DRAFT</span></div><h1>{titulo}</h1><p>{detalle}</p></main>; }
function TarjetaReanudar({ partida, cartasPorId, alReanudar }: { partida: EstadoPartida; cartasPorId: ReadonlyMap<string, CartaPublicada>; alReanudar: () => void }) { const elegidas = partida.cartasElegidas.flatMap((carta) => { const publicada = cartasPorId.get(carta.id); return publicada ? [publicada] : []; }); return <section className="tarjeta-reanudar"><div className="reanudar-encabezado"><div><p className="eyebrow">Partida en curso</p><h2>Elección {partida.numeroDePick} / 11</h2></div><span>{partida.ofertaActiva.contexto.pais}<small>{partida.ofertaActiva.contexto.cicloMundial}</small></span></div><div className="tira-reanudacion" aria-label={`${elegidas.length} cartas elegidas`}>{elegidas.slice(-5).map((carta) => <div className="mini-carta-reanudar" key={carta.id}><span>{carta.ovr}<small>{carta.posicionPrimaria}</small></span><img src={carta.imagen} alt="" /><b>{nombreCorto(carta.nombre)}</b></div>)}{Array.from({ length: Math.max(0, Math.min(5, partida.numeroDePick - 1) - elegidas.length) }, (_, indice) => <i key={indice} />)}</div><p className="persistencia-local">Tu progreso sigue guardado en este dispositivo.</p><button className="cta-principal" type="button" onClick={alReanudar}>Reanudar partida</button></section>; }
function CabeceraDeRun({ partida, etiquetaCuenta, alAbrirCuenta }: { partida: EstadoPartida; etiquetaCuenta: string; alAbrirCuenta: () => void }) { return <header className="cabecera-run"><div className="progreso-run"><span>Elección</span><strong>{partida.numeroDePick} / 11</strong><ol className="progreso-picks" aria-label={`${partida.numeroDePick - 1} elecciones confirmadas de 11`}>{Array.from({ length: 11 }, (_, indice) => <li key={indice} className={indice < partida.numeroDePick - 1 ? "completo" : indice === partida.numeroDePick - 1 ? "actual" : ""} />)}</ol></div><button className="cuenta-disparador" type="button" onClick={alAbrirCuenta}>{etiquetaCuenta}</button></header>; }
function ContextoDeOferta({ contexto, fase, pasoRuleta }: { contexto: EstadoPartida["ofertaActiva"]["contexto"]; fase: FaseRevelacion; pasoRuleta: number }) { const pais = fase === "pais" ? textoDescifrado(contexto.pais, pasoRuleta) : contexto.pais; const epoca = fase === "cartas" ? contexto.cicloMundial : fase === "epoca" ? textoDescifrado(contexto.cicloMundial, pasoRuleta) : "····"; const anuncio = fase === "pais" ? "Revelando país de la oferta" : fase === "epoca" ? `País revelado: ${contexto.pais}. Revelando época.` : `Contexto revelado: ${contexto.pais}, ${contexto.cicloMundial}.`; return <section className={`contexto-oferta fase-${fase}`} aria-busy={fase !== "cartas"}><p className="lectura-asistida" role="status">{anuncio}</p><span>País</span><strong>{pais}</strong><span>Época</span><b>{epoca}</b></section>; }
const GLIFOS_DESCIFRADO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+";
function textoDescifrado(valorFinal: string, paso: number): string { const caracteres = Array.from(valorFinal); const cantidadRevelada = Math.min(caracteres.length, Math.floor((paso / 10) * caracteres.length)); return caracteres.map((caracter, indice) => caracter === " " || caracter === "-" || indice < cantidadRevelada ? caracter : GLIFOS_DESCIFRADO[(paso * 13 + indice * 7) % GLIFOS_DESCIFRADO.length] ?? caracter).join(""); }
function CartaDeOferta({ carta, inspeccionada, alInspeccionar, deshabilitada = false }: { carta: CartaPublicada; inspeccionada: boolean; alInspeccionar: () => void; deshabilitada?: boolean }) { return <button data-rasgo={carta.rasgo} className={`carta ${inspeccionada ? "carta-inspeccionada" : ""}`} type="button" disabled={deshabilitada} aria-pressed={inspeccionada} onClick={alInspeccionar}><span className="marco-interior" aria-hidden="true" /><span className="carta-ovr">{carta.ovr}<small>{carta.posicionPrimaria}</small></span><span className="retrato-carta"><img src={carta.imagen} alt={`${carta.nombre} con camiseta de ${carta.club}`} /></span><span className="carta-identidad"><span className="carta-nombre">{carta.nombre}</span><span className="carta-meta">{carta.club} · {carta.temporada}</span></span><span className="carta-trait">{carta.rasgo}</span><span className="marcadores-quimica"><i title={`País: ${carta.pais}`}><b>PA</b>{carta.pais}</i><i title={`Club: ${carta.club}`}><b>CL</b>{carta.club}</i><i title={`Ciclo mundial: ${carta.cicloMundial}`}><b>CM</b>{carta.cicloMundial}</i></span>{inspeccionada ? <span className="estado-revision">Revisando</span> : null}</button>; }
function OfertaNormal(props: { cartas: readonly CartaPublicada[]; bloqueada: boolean; alProbar: (id: string) => void }) { return <OfertaEnCarril {...props} ampliada={false} />; }
function OfertaAmpliada(props: { cartas: readonly CartaPublicada[]; bloqueada: boolean; alProbar: (id: string) => void }) { return <OfertaEnCarril {...props} ampliada />; }
function OfertaEnCarril({ cartas, bloqueada, alProbar, ampliada }: { cartas: readonly CartaPublicada[]; bloqueada: boolean; alProbar: (id: string) => void; ampliada: boolean }) { const carrilRef = useRef<HTMLDivElement>(null); const [indiceVisible, setIndiceVisible] = useState(() => Math.floor(cartas.length / 2)); useEffect(() => { const cartaCentral = carrilRef.current?.children[indiceVisible] as HTMLElement | undefined; cartaCentral?.scrollIntoView({ block: "nearest", inline: "center" }); }, []); function actualizarIndice(): void { const carril = carrilRef.current; if (!carril || bloqueada) return; const centro = carril.getBoundingClientRect().left + carril.clientWidth / 2; const diapositivas = Array.from(carril.children) as HTMLElement[]; const indiceNuevo = diapositivas.reduce((mejor, diapositiva, indice) => Math.abs(diapositiva.getBoundingClientRect().left + diapositiva.offsetWidth / 2 - centro) < Math.abs(diapositivas[mejor]!.getBoundingClientRect().left + diapositiva.offsetWidth / 2 - centro) ? indice : mejor, 0); setIndiceVisible(indiceNuevo); } function navegarConTeclado(evento: React.KeyboardEvent<HTMLDivElement>): void { if (bloqueada || (evento.key !== "ArrowLeft" && evento.key !== "ArrowRight")) return; evento.preventDefault(); carrilRef.current?.scrollBy({ left: (evento.key === "ArrowLeft" ? -1 : 1) * carrilRef.current.clientWidth * .72, behavior: "smooth" }); } return <div className={`${ampliada ? "oferta-ampliada" : "oferta-normal"} oferta-carrusel ${bloqueada ? "oferta-bloqueada" : ""}`}><div className="cabecera-carril"><p className="etiqueta-oferta-ampliada">{ampliada ? "Oferta ampliada · 5 opciones" : "Oferta actual · 3 opciones"}</p><strong aria-live="polite">{indiceVisible + 1} de {cartas.length}</strong></div><div ref={carrilRef} className="carril-oferta" tabIndex={bloqueada ? -1 : 0} aria-label={`Carrusel de ${cartas.length} leyendas`} aria-disabled={bloqueada} onScroll={actualizarIndice} onKeyDown={navegarConTeclado}>{cartas.map((carta, indice) => <article className={indice === indiceVisible ? "carril-carta carril-carta-activa" : "carril-carta"} key={carta.id}><CartaDeOferta carta={carta} inspeccionada={false} deshabilitada={bloqueada} alInspeccionar={() => alProbar(carta.id)} /></article>)}</div><p className="ayuda-carrusel">{bloqueada ? "Preparando las leyendas…" : "Deslizá para comparar · tocá la carta del centro para probarla"}</p></div>; }
function PanelDeDecisiones({ partida, bloqueada, alExplorar, alPedirRepetir }: { partida: EstadoPartida; bloqueada: boolean; alExplorar: () => void; alPedirRepetir: () => void }) { return <section className="decisiones" aria-label="Acciones de la partida"><button type="button" disabled={bloqueada || !partida.scoutingDisponible || partida.numeroDePick === 11} onClick={alExplorar}>Explorar {partida.scoutingDisponible ? "· 1 uso" : "agotado"}</button><button type="button" disabled={bloqueada || !partida.rerollDisponible} onClick={alPedirRepetir}>Repetir oferta {partida.rerollDisponible ? "· 1 uso" : "agotado"}</button></section>; }
function HojaScouting({ informe, alCerrar }: { informe: NonNullable<EstadoPartida["informeScouting"]>; alCerrar: () => void }) { const nivel = informe.tipo === "contexto" ? "Pista" : informe.tipo === "posicion_y_rasgo" ? "Lectura" : informe.tipo === "perfil_sin_identidad" ? "Informe" : "Confirmado"; const limite = informe.tipo === "contexto" ? "No revela posición, OVR ni identidad." : informe.tipo === "posicion_y_rasgo" ? "No revela OVR ni identidad." : informe.tipo === "perfil_sin_identidad" ? "No revela el nombre de la carta." : "La carta exacta aparecerá en el próximo roll."; return <aside className={`hoja-scouting scouting-${informe.tipo}`} aria-label={`Scouting: ${nivel}`}><p className="eyebrow">Pick actual · próximo pick</p><span className="nivel-scouting">{nivel}</span><h2>Próximo roll</h2><p>{textoDeScouting(informe)}</p><small>{limite}</small><button className="cta-principal" type="button" onClick={alCerrar}>Entendido</button></aside>; }
function calcularPromedioOvrEfectivo(partida: EstadoPartida): number | null { if (!partida.ubicaciones.length) return null; const cartasPorId = new Map(partida.cartasElegidas.map((carta) => [carta.id, carta])); const total = partida.ubicaciones.reduce((acumulado, ubicacion) => { const carta = cartasPorId.get(ubicacion.idCarta); const plaza = PLAZAS_4_3_3.find((candidata) => candidata.id === ubicacion.idPlaza); return carta && plaza ? acumulado + calcularOvrEfectivo(carta, plaza.posicion) : acumulado; }, 0); return total / partida.ubicaciones.length; }
function HojaAnalisis({ partida, panel, alCambiarPanel, alCerrar }: { partida: EstadoPartida; panel: Exclude<PanelAnalisis, null>; alCambiarPanel: (panel: Exclude<PanelAnalisis, null>) => void; alCerrar: () => void }) { const conexiones = calcularConexionesDeQuimica(partida.cartasElegidas); const promedioOvr = calcularPromedioOvrEfectivo(partida); const conteos = contarRasgos(partida); return <aside className="hoja-analisis" role="dialog" aria-modal="true" aria-label="Análisis táctico"><div className="asa-hoja" /><p className="eyebrow">Pizarra táctica</p><h2>Análisis</h2><div className="pestanas-analisis" role="tablist"><button type="button" role="tab" aria-selected={panel === "quimica"} onClick={() => alCambiarPanel("quimica")}>Química</button><button type="button" role="tab" aria-selected={panel === "traits"} onClick={() => alCambiarPanel("traits")}>Traits</button></div>{panel === "quimica" ? <section className="analisis-contenido"><strong>{conexiones} / 33</strong><p>Conexiones activas por país, club y ciclo mundial.</p><p className="ovr-analisis">OVR efectivo <b>{promedioOvr?.toFixed(1) ?? "—"}</b></p><small>El OVR se actualiza con la plaza que probás.</small></section> : <section className="analisis-contenido traits">{RASGOS.map((rasgo) => { const cantidad = conteos.get(rasgo) ?? 0; const umbral = cantidad >= 3 ? 5 : 3; const bonus = cantidad >= 5 ? "+3" : cantidad >= 3 ? "+1" : "—"; return <span data-rasgo={rasgo} key={rasgo}><i>{rasgo}</i><b>{cantidad} / {umbral}</b><em>{bonus}</em></span>; })}</section>}<button className="cta-secundaria" type="button" onClick={alCerrar}>Volver a la pizarra</button></aside>; }
function ResumenDeSquad({ partida, simulacion = false, alAnalizar }: { partida: EstadoPartida; simulacion?: boolean; alAnalizar?: () => void }) { const conexiones = calcularConexionesDeQuimica(partida.cartasElegidas); const promedioOvr = calcularPromedioOvrEfectivo(partida); const conteos = contarRasgos(partida); return <section className="resumen-squad resumen-compacto"><div className="quimica-resumen"><div><span>Química</span><strong>{conexiones} / 33</strong></div><div><span>OVR</span><strong>{promedioOvr?.toFixed(1) ?? "—"}</strong></div><small>{simulacion ? "Simulación · país · club · ciclo" : "País · club · ciclo"}</small></div><div className="traits traits-resumen">{RASGOS.filter((rasgo) => (conteos.get(rasgo) ?? 0) > 0).slice(0, 3).map((rasgo) => <span data-rasgo={rasgo} key={rasgo}><i>{rasgo}</i><b>{conteos.get(rasgo)} / {(conteos.get(rasgo) ?? 0) >= 3 ? 5 : 3}</b></span>)}</div>{alAnalizar ? <button className="cta-discreta" type="button" onClick={alAnalizar}>Analizar</button> : null}</section>; }
function Formacion({ partida, cartasPorId, idCartaParaMover, alElegirCartaParaMover, alMoverCarta, idCartaEnPrueba = null, idPlazaEnPrueba = null, alCambiarPlazaEnPrueba }: { partida: EstadoPartida; cartasPorId: ReadonlyMap<string, CartaPublicada>; idCartaParaMover: string | null; alElegirCartaParaMover: (id: string | null) => void; alMoverCarta: (id: IdPlaza) => void; idCartaEnPrueba?: string | null; idPlazaEnPrueba?: IdPlaza | null; alCambiarPlazaEnPrueba?: (id: IdPlaza) => void }) { const [plazaDestino, setPlazaDestino] = useState<IdPlaza | null>(null); useEffect(() => { setPlazaDestino(null); }, [idCartaParaMover]); const ubicacionPorPlaza = new Map(partida.ubicaciones.map((ubicacion) => [ubicacion.idPlaza, ubicacion.idCarta])); const cartaParaMover = idCartaParaMover ? cartasPorId.get(idCartaParaMover) ?? null : null; const destino = plazaDestino ? PLAZAS_4_3_3.find((plaza) => plaza.id === plazaDestino) ?? null : null; const ajuste = cartaParaMover && destino ? destino.posicion === cartaParaMover.posicionPrimaria ? 0 : cartaParaMover.posicionesSecundarias.includes(destino.posicion) ? -4 : -10 : null; function confirmarDestino(): void { if (!plazaDestino) return; alMoverCarta(plazaDestino); setPlazaDestino(null); } return <section className="formacion"><div className="formacion-titulo"><div><p className="eyebrow">Pizarra táctica</p><h2>Formación 4-3-3</h2></div><span>{idCartaEnPrueba ? "Probando carta" : idCartaParaMover ? "Elegí plaza" : `${partida.cartasElegidas.length} / 11`}</span></div><div className="cancha">{PLAZAS_4_3_3.map((plaza) => { const idCarta = ubicacionPorPlaza.get(plaza.id); const carta = idCarta ? cartasPorId.get(idCarta) : null; const activa = idCartaEnPrueba ? plaza.id === idPlazaEnPrueba : plaza.id === plazaDestino; return <button key={plaza.id} type="button" aria-label={carta ? `${carta.nombre}, OVR ${carta.ovr}, ${plaza.posicion}` : `Plaza ${plaza.posicion} vacante`} className={`plaza ${idCartaEnPrueba === idCarta ? "plaza-seleccionada" : ""} ${activa ? "plaza-destino" : ""}`} onClick={() => idCartaEnPrueba ? alCambiarPlazaEnPrueba?.(plaza.id) : idCartaParaMover ? setPlazaDestino(plaza.id) : carta ? alElegirCartaParaMover(carta.id) : undefined}><span className="plaza-dato"><b>{carta?.ovr ?? "—"}</b><small>{plaza.posicion}</small></span>{carta ? <><img src={carta.imagen} alt="" /><strong>{nombreCorto(carta.nombre)}</strong></> : <i>Vacante</i>}{activa ? <em>{idCartaEnPrueba ? "Prueba" : "Destino"}</em> : null}</button>; })}</div>{idCartaEnPrueba ? <p className="ayuda-mover">Tocá una plaza para comparar cómo cambia la carta antes de avanzar.</p> : cartaParaMover ? <div className="dock-ubicacion"><div className="carta-a-ubicar"><img src={cartaParaMover.imagen} alt="" /><span><b>{cartaParaMover.ovr} · {cartaParaMover.posicionPrimaria}</b><strong>{cartaParaMover.nombre}</strong><small>{cartaParaMover.rasgo}</small></span></div>{destino && ajuste !== null ? <div className={`compatibilidad ajuste-${ajuste === 0 ? "primario" : ajuste === -4 ? "secundario" : "fuera"}`}><span>{destino.posicion} · {ajuste === 0 ? "Posición primaria" : ajuste === -4 ? "Posición secundaria" : "Fuera de posición"}</span><b>OVR {cartaParaMover.ovr + ajuste} <small>{ajuste === 0 ? "±0" : ajuste}</small></b></div> : <p className="ayuda-mover">Tocá una plaza para comparar su OVR efectivo.</p>}<button className="cta-principal" type="button" disabled={!destino} onClick={confirmarDestino}>{destino ? `Ubicar en ${destino.posicion}` : "Elegí una plaza"}</button><button className="cta-discreta" type="button" onClick={() => alElegirCartaParaMover(null)}>Cancelar</button></div> : <p className="ayuda-mover">Tocá una carta para reorganizarla.</p>}</section>; }
function Resultado({ partida, personalBest, nuevoRecord, alJugarOtra, alVerFormacion }: { partida: EstadoPartida; personalBest: number | null; nuevoRecord: boolean; alJugarOtra: () => void; alVerFormacion: () => void }) { const resultado = partida.resultado!; const bonusTraits = resultado.bonosDeTraits.reduce((total, bonus) => total + bonus.bonus, 0); return <main className="resultado"><section className="certificado-resultado"><p className="cinta-resultado">Partida completada</p><p className="eyebrow">Squad completa</p><h1>Puntaje del equipo</h1><strong className="puntaje">{resultado.puntaje}</strong><p className="record-resultado">{nuevoRecord ? "Nuevo récord personal" : `Récord personal: ${personalBest ?? "—"}`}</p><section className="desglose"><p><span>OVR efectivo</span><b>{resultado.promedioOvrEfectivo.toFixed(1)}</b></p><p><span>Química</span><b>×{resultado.multiplicadorQuimica.toFixed(3)}</b></p><p><span>Traits</span><b>+{bonusTraits}</b></p></section><details className="explicacion-puntaje"><summary>¿Por qué este puntaje?</summary><p>OVR efectivo × química + bonus de traits.</p></details></section><div className="acciones-resultado"><button className="cta-principal" type="button" onClick={alJugarOtra}>Nueva partida</button><button className="cta-secundaria" type="button" onClick={alVerFormacion}>Ver mi formación</button></div></main>; }
function CuentaModal({ cuenta, estadoSincronizacion, modo, email, password, error, enviando, conflicto, alCerrar, alCambiarModo, alCambiarEmail, alCambiarPassword, alEnviar, alCerrarSesion, alUsarRemoto, alMantenerLocal }: { cuenta: EstadoCuenta; estadoSincronizacion: EstadoSincronizacion; modo: "registro" | "login"; email: string; password: string; error: string | null; enviando: boolean; conflicto: ConflictoDeSincronizacion | null; alCerrar: () => void; alCambiarModo: (modo: "registro" | "login") => void; alCambiarEmail: (email: string) => void; alCambiarPassword: (password: string) => void; alEnviar: (evento: React.FormEvent<HTMLFormElement>) => void; alCerrarSesion: () => void; alUsarRemoto: () => void; alMantenerLocal: () => void }) { return <div className="capa-modal" role="presentation"><aside className="hoja-cuenta" role="dialog" aria-modal="true" aria-label="Cuenta y progreso"><div className="asa-hoja" /><div className="cuenta-encabezado"><div><p className="eyebrow">Progreso de Once Draft</p><h2>Cuenta</h2></div><button className="cta-discreta" type="button" onClick={alCerrar}>Cerrar</button></div>{cuenta.tipo === "autenticado" ? <section className="cuenta-sesion"><p><strong>{cuenta.usuario.username}</strong><small>{cuenta.usuario.email}</small></p><EstadoDeSincronizacion estado={estadoSincronizacion} />{conflicto ? <section className="cuenta-conflicto"><strong>Encontramos dos partidas activas.</strong><p>Nada se borró. Elegí cuál querés conservar en tu cuenta.</p><button className="cta-principal" type="button" onClick={alMantenerLocal}>Mantener este dispositivo</button><button className="cta-secundaria" type="button" onClick={alUsarRemoto}>Usar progreso de la cuenta</button></section> : null}<button className="cta-discreta" type="button" onClick={alCerrarSesion}>Cerrar sesión</button></section> : <><div className="pestanas-cuenta" role="tablist"><button type="button" role="tab" aria-selected={modo === "registro"} onClick={() => alCambiarModo("registro")}>Crear cuenta</button><button type="button" role="tab" aria-selected={modo === "login"} onClick={() => alCambiarModo("login")}>Iniciar sesión</button></div><form className="formulario-cuenta" onSubmit={alEnviar}><label>Email<input type="email" autoComplete="email" value={email} onChange={(evento) => alCambiarEmail(evento.target.value)} required /></label><label>Contraseña<input type="password" autoComplete={modo === "registro" ? "new-password" : "current-password"} minLength={10} maxLength={128} value={password} onChange={(evento) => alCambiarPassword(evento.target.value)} required /></label>{modo === "registro" ? <small>Tu nombre visible será la parte anterior a @. Podrás recuperar tu contraseña por email más adelante.</small> : null}{error ? <p className="mensaje-cuenta" role="alert">{error}</p> : null}<button className="cta-principal" type="submit" disabled={enviando}>{enviando ? "Conectando…" : modo === "registro" ? "Crear y guardar progreso" : "Iniciar sesión"}</button></form><EstadoDeSincronizacion estado={estadoSincronizacion} /></>}</aside></div>; }
function EstadoDeSincronizacion({ estado }: { estado: EstadoSincronizacion }) { const texto = estado === "sincronizando" ? "Sincronizando progreso…" : estado === "offline" ? "Sin conexión: tu progreso sigue en este dispositivo." : estado === "error" ? "No se pudo sincronizar todavía. Tu progreso local está seguro." : estado === "conflicto" ? "Necesita tu decisión para sincronizar." : "Progreso guardado en este dispositivo."; return <p className={`estado-sincronizacion estado-${estado}`}>{texto}</p>; }
function contarRasgos(partida: EstadoPartida): ReadonlyMap<Rasgo, number> { const conteos = new Map<Rasgo, number>(); for (const carta of partida.cartasElegidas) conteos.set(carta.rasgo, (conteos.get(carta.rasgo) ?? 0) + 1); return conteos; }
function etiquetaCortaDeRasgo(rasgo: Rasgo): string { return { Rematador: "Remat.", Creador: "Cread.", Tecnico: "Técn.", Velocista: "Veloc.", Fisico: "Fís.", "Muro defensivo": "Muro" }[rasgo]; }
function nombreCorto(nombre: string): string { return nombre.split(" ").at(-1) ?? nombre; }
function textoDeScouting(informe: NonNullable<EstadoPartida["informeScouting"]>): string { if (informe.tipo === "contexto") return `Próximo roll: ${informe.contexto.pais} · ${informe.contexto.cicloMundial}.`; if (informe.tipo === "posicion_y_rasgo") return `Próximo roll: ${informe.posicion} · ${informe.rasgo}.`; if (informe.tipo === "perfil_sin_identidad") return `Próximo roll: ${informe.perfil.posicionPrimaria}, OVR ${informe.perfil.ovr} · identidad no revelada.`; return `Próximo roll confirmado: ${informe.carta.nombre}.`; }
function etiquetaCuenta(cuenta: EstadoCuenta, estado: EstadoSincronizacion): string { if (estado === "sincronizando") return "Guardando…"; if (estado === "offline") return "Sin conexión"; return cuenta.tipo === "autenticado" ? cuenta.usuario.username : "Cuenta"; }
function esErrorDeRed(causa: unknown): boolean { return causa instanceof ErrorDeApi && causa.code === "NETWORK"; }
function mensajeDeCuenta(causa: unknown): string { if (causa instanceof ErrorDeApi) { if (causa.code === "EMAIL_TAKEN") return "Ya existe una cuenta con ese email."; if (causa.code === "UNAUTHENTICATED") return "Email o contraseña incorrectos."; if (causa.code === "RATE_LIMITED") return "Demasiados intentos. Probá de nuevo en un momento."; return causa.message; } return "No se pudo completar la operación de cuenta."; }
function crearSeed(): string { const bytes = new Uint32Array(2); crypto.getRandomValues(bytes); return `libre-${bytes[0]?.toString(36)}${bytes[1]?.toString(36)}`; }
