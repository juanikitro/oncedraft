import { useEffect, useMemo, useRef, useState } from "react";

import {
  calcularConexionesDeQuimica,
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
import { crearRepositorioDePerfilInvitado, type PerfilInvitado } from "./perfil-invitado";

type Vista = "inicio" | "draft" | "resultado" | "formacion";

const RASGOS: readonly Rasgo[] = ["Rematador", "Creador", "Tecnico", "Velocista", "Fisico", "Muro defensivo"];

export function App() {
  const repositorio = useMemo(() => crearRepositorioDePerfilInvitado({ almacenamiento: window.localStorage }), []);
  const [perfil, setPerfil] = useState<PerfilInvitado>(() => repositorio.cargar());
  const [catalogo, setCatalogo] = useState<CatalogoPublicado | null>(null);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("inicio");
  const [partida, setPartida] = useState<EstadoPartida | null>(null);
  const [idInspeccionada, setIdInspeccionada] = useState<string | null>(null);
  const [confirmandoRepetir, setConfirmandoRepetir] = useState(false);
  const [idCartaParaMover, setIdCartaParaMover] = useState<string | null>(null);
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const [mostrandoScouting, setMostrandoScouting] = useState(false);

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

  const cartasPorId = useMemo(() => new Map(catalogo?.cartas.map((carta) => [carta.id, carta])), [catalogo]);
  const partidaReanudable = perfil.partidaActiva && !perfil.partidaActiva.completada && perfil.partidaActiva.versionCatalogo === catalogo?.version
    ? perfil.partidaActiva
    : null;

  function persistirPartida(siguiente: EstadoPartida): void {
    setNuevoRecord(Boolean(siguiente.completada && siguiente.resultado && (perfil.personalBest === null || siguiente.resultado.puntaje > perfil.personalBest)));
    const siguientePerfil = siguiente.completada ? repositorio.finalizarPartida(siguiente) : repositorio.guardarPartida(siguiente);
    setPerfil(siguientePerfil);
    setPartida(siguiente);
    setIdInspeccionada(null);
    setIdCartaParaMover(null);
    setConfirmandoRepetir(false);
    setMostrandoScouting(false);
    setVista(siguiente.completada ? "resultado" : "draft");
  }

  function iniciarNuevaPartida(): void {
    if (!catalogo) return;
    try {
      setError(null);
      setNuevoRecord(false);
      persistirPartida(iniciarPartidaConProteccion({ catalogo, seed: crearSeed() }));
    } catch (causa: unknown) {
      setError(causa instanceof Error ? causa.message : "No se pudo iniciar la partida.");
    }
  }

  function confirmarEleccion(): void {
    if (!catalogo || !partida || !idInspeccionada) return;
    try { persistirPartida(confirmarPick({ catalogo, partida, idCartaElegida: idInspeccionada })); }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo confirmar la elección."); }
  }

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
    try { persistirPartida(usarReroll({ catalogo, partida })); }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo repetir la oferta."); }
  }

  function moverCarta(idPlazaDestino: IdPlaza): void {
    if (!partida || !idCartaParaMover) return;
    try { persistirPartida(reorganizarPartida({ partida, idCarta: idCartaParaMover, idPlazaDestino })); }
    catch (causa: unknown) { setError(causa instanceof Error ? causa.message : "No se pudo reorganizar la formación."); }
  }

  if (cargandoCatalogo) return <EstadoDeCatalogo titulo="Verificando el catálogo" detalle="La partida se habilita sólo con las 151 cartas y activos aprobados." />;
  if (!catalogo) return <EstadoDeCatalogo titulo="Catálogo en curaduría" detalle={error ?? "Todavía no hay un catálogo activo disponible."} />;

  if (vista === "resultado" && partida?.completada && partida.resultado) {
    return <Resultado partida={partida} personalBest={perfil.personalBest} nuevoRecord={nuevoRecord} alJugarOtra={iniciarNuevaPartida} alVerFormacion={() => setVista("formacion")} />;
  }

  if (vista === "formacion" && partida?.completada) {
    return <main className="resultado"><p className="eyebrow">Squad completa</p><h1>Tu formación</h1><Formacion partida={partida} cartasPorId={cartasPorId} idCartaParaMover={idCartaParaMover} alElegirCartaParaMover={setIdCartaParaMover} alMoverCarta={moverCarta} /><button className="cta-secundaria" type="button" onClick={() => setVista("resultado")}>Volver al resultado</button></main>;
  }

  if (vista === "draft" && partida) {
    const cartaInspeccionada = idInspeccionada ? cartasPorId.get(idInspeccionada) ?? null : null;
    const cartasDeOferta = partida.ofertaActiva.opciones.flatMap((carta) => {
      const cartaPublicada = cartasPorId.get(carta.id);
      return cartaPublicada ? [cartaPublicada] : [];
    });
    return <main className="app-shell">
      <CabeceraDeRun partida={partida} />
      {error ? <p className="mensaje-error">{error}</p> : null}
      <section className="oferta" aria-labelledby="titulo-oferta"><p className="eyebrow">Oferta actual</p><h1 id="titulo-oferta">Elegí una leyenda</h1>
        {cartasDeOferta.length === 5
          ? <OfertaAmpliada key={cartasDeOferta.map((carta) => carta.id).join("|")} cartas={cartasDeOferta} idInspeccionada={idInspeccionada} alInspeccionar={setIdInspeccionada} />
          : <OfertaNormal key={cartasDeOferta.map((carta) => carta.id).join("|")} cartas={cartasDeOferta} idInspeccionada={idInspeccionada} alInspeccionar={setIdInspeccionada} />}
      </section>
      <PanelDeDecisiones partida={partida} alExplorar={explorarProximoRoll} alPedirRepetir={() => setConfirmandoRepetir(true)} />
      <ResumenDeSquad partida={partida} />
      <Formacion partida={partida} cartasPorId={cartasPorId} idCartaParaMover={idCartaParaMover} alElegirCartaParaMover={setIdCartaParaMover} alMoverCarta={moverCarta} />
      {cartaInspeccionada ? <div className="capa-modal" role="presentation"><aside className="hoja-detalle" role="dialog" aria-modal="true" aria-label={`Detalle de ${cartaInspeccionada.nombre}`}><div className="detalle-scroll"><div className="asa-hoja" /><p className="eyebrow">Ficha de leyenda</p><CartaDeOferta carta={cartaInspeccionada} inspeccionada alInspeccionar={() => setIdInspeccionada(null)} /><div className="detalle-datos"><strong>{cartaInspeccionada.club} · {cartaInspeccionada.temporada}</strong><p>Posición primaria <b>{cartaInspeccionada.posicionPrimaria}</b> · OVR base <b>{cartaInspeccionada.ovr}</b></p>{cartaInspeccionada.posicionesSecundarias.length ? <p className="posiciones-secundarias">Secundarias · {cartaInspeccionada.posicionesSecundarias.join(" · ")}</p> : null}<p>Trait de squad · <b>{cartaInspeccionada.rasgo}</b></p></div></div><div className="acciones-detalle"><button className="cta-principal" type="button" onClick={confirmarEleccion}>Elegir {cartaInspeccionada.nombre}</button><button className="cta-secundaria" type="button" onClick={() => setIdInspeccionada(null)}>Cerrar detalle</button></div></aside></div> : null}
      {confirmandoRepetir ? <div className="capa-modal" role="presentation"><aside className="hoja-confirmacion" aria-label="Confirmar repetir oferta"><div className="asa-hoja" /><p className="eyebrow">Una decisión</p><h2>Repetir oferta</h2><p>Reemplaza estas opciones, mantiene <strong>{partida.ofertaActiva.contexto.pais} · {partida.ofertaActiva.contexto.cicloMundial}</strong> y consume el único uso.</p><p className="nota-confirmacion">No garantiza una mejora de OVR.</p><button className="cta-principal" type="button" onClick={repetirOferta}>Repetir oferta</button><button className="cta-secundaria" type="button" onClick={() => setConfirmandoRepetir(false)}>Cancelar</button></aside></div> : null}
      {mostrandoScouting && partida.informeScouting ? <div className="capa-modal" role="presentation"><HojaScouting informe={partida.informeScouting} alCerrar={() => setMostrandoScouting(false)} /></div> : null}
    </main>;
  }

  return <main className="landing"><div className="marca">ONCE <span>DRAFT</span></div><div className="hero-copy"><p className="eyebrow">Selección histórica · 4–6 minutos</p><h1>La mejor squad no siempre tiene el OVR más alto.</h1><p className="bajada">Once decisiones. País, club, ciclo, posiciones y rasgos para construir una selección que sea realmente tuya.</p></div>{partidaReanudable ? <TarjetaReanudar partida={partidaReanudable} cartasPorId={cartasPorId} alReanudar={() => { setPartida(partidaReanudable); setVista("draft"); }} /> : <section className="modo-principal"><div><span className="numero-modo">11</span><p><b>Partida libre</b><small>elecciones · 4–6 minutos</small></p></div><button className="cta-principal" type="button" onClick={iniciarNuevaPartida}>Iniciar partida</button></section>}<section className="modo-bloqueado" aria-label="Modo próximo"><div><p>Draft diario</p><span>Mismas oportunidades para todos</span></div><b>Próximamente</b></section>{partidaReanudable ? <button className="cta-discreta" type="button" onClick={iniciarNuevaPartida}>Iniciar otra partida</button> : null}</main>;
}

function EstadoDeCatalogo({ titulo, detalle }: { titulo: string; detalle: string }) { return <main className="estado-catalogo"><div className="marca">ONCE <span>DRAFT</span></div><h1>{titulo}</h1><p>{detalle}</p></main>; }
function TarjetaReanudar({ partida, cartasPorId, alReanudar }: { partida: EstadoPartida; cartasPorId: ReadonlyMap<string, CartaPublicada>; alReanudar: () => void }) { const elegidas = partida.cartasElegidas.flatMap((carta) => { const publicada = cartasPorId.get(carta.id); return publicada ? [publicada] : []; }); return <section className="tarjeta-reanudar"><div className="reanudar-encabezado"><div><p className="eyebrow">Partida en curso</p><h2>Elección {partida.numeroDePick} / 11</h2></div><span>{partida.ofertaActiva.contexto.pais}<small>{partida.ofertaActiva.contexto.cicloMundial}</small></span></div><div className="tira-reanudacion" aria-label={`${elegidas.length} cartas elegidas`}>{elegidas.slice(-5).map((carta) => <div className="mini-carta-reanudar" key={carta.id}><span>{carta.ovr}<small>{carta.posicionPrimaria}</small></span><img src={carta.imagen} alt="" /><b>{nombreCorto(carta.nombre)}</b></div>)}{Array.from({ length: Math.max(0, Math.min(5, partida.numeroDePick - 1) - elegidas.length) }, (_, indice) => <i key={indice} />)}</div><p className="persistencia-local">Tu progreso sigue guardado en este dispositivo.</p><button className="cta-principal" type="button" onClick={alReanudar}>Reanudar partida</button></section>; }
function CabeceraDeRun({ partida }: { partida: EstadoPartida }) { return <header className="cabecera-run"><div><span>Elección</span><strong>{partida.numeroDePick} / 11</strong><ol className="progreso-picks" aria-label={`${partida.numeroDePick - 1} elecciones confirmadas de 11`}>{Array.from({ length: 11 }, (_, indice) => <li key={indice} className={indice < partida.numeroDePick - 1 ? "completo" : indice === partida.numeroDePick - 1 ? "actual" : ""} />)}</ol></div><div className="contexto"><span>Contexto</span><strong>{partida.ofertaActiva.contexto.pais} · {partida.ofertaActiva.contexto.cicloMundial}</strong></div></header>; }
function CartaDeOferta({ carta, inspeccionada, alInspeccionar }: { carta: CartaPublicada; inspeccionada: boolean; alInspeccionar: () => void }) { return <button data-rasgo={carta.rasgo} className={`carta ${inspeccionada ? "carta-inspeccionada" : ""}`} type="button" aria-pressed={inspeccionada} onClick={alInspeccionar}><span className="marco-interior" aria-hidden="true" /><span className="carta-ovr">{carta.ovr}<small>{carta.posicionPrimaria}</small></span><span className="retrato-carta"><img src={carta.imagen} alt={`${carta.nombre} con camiseta de ${carta.club}`} /></span><span className="carta-identidad"><span className="carta-nombre">{carta.nombre}</span><span className="carta-meta">{carta.club} · {carta.temporada}</span></span><span className="carta-trait">{carta.rasgo}</span><span className="marcadores-quimica"><i title={`País: ${carta.pais}`}><b>PA</b>{carta.pais}</i><i title={`Club: ${carta.club}`}><b>CL</b>{carta.club}</i><i title={`Ciclo mundial: ${carta.cicloMundial}`}><b>CM</b>{carta.cicloMundial}</i></span>{inspeccionada ? <span className="estado-revision">Revisando</span> : null}</button>; }
function OfertaNormal(props: { cartas: readonly CartaPublicada[]; idInspeccionada: string | null; alInspeccionar: (id: string) => void }) { return <OfertaEnCarril {...props} ampliada={false} />; }
function OfertaAmpliada(props: { cartas: readonly CartaPublicada[]; idInspeccionada: string | null; alInspeccionar: (id: string) => void }) { return <OfertaEnCarril {...props} ampliada />; }
function OfertaEnCarril({ cartas, idInspeccionada, alInspeccionar, ampliada }: { cartas: readonly CartaPublicada[]; idInspeccionada: string | null; alInspeccionar: (id: string) => void; ampliada: boolean }) { const [indiceVisible, setIndiceVisible] = useState(0); const referencias = useRef<Array<HTMLDivElement | null>>([]); function actualizarIndice(scrollLeft: number, scrollWidth: number, clientWidth: number): void { const recorrido = scrollWidth - clientWidth; setIndiceVisible(recorrido <= 0 ? 0 : Math.min(cartas.length - 1, Math.round(scrollLeft / (recorrido / (cartas.length - 1))))); } function enfocar(indice: number, id: string): void { setIndiceVisible(indice); alInspeccionar(id); referencias.current[indice]?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest", inline: "center" }); } return <div className={ampliada ? "oferta-ampliada" : "oferta-normal"}>{ampliada ? <div className="cabecera-carril"><p className="etiqueta-oferta-ampliada">Oferta ampliada · 5 opciones</p><strong aria-live="polite">{indiceVisible + 1} de {cartas.length}</strong></div> : null}<div className={ampliada ? "carril-cartas" : "grilla-cartas"} onScroll={(evento) => actualizarIndice(evento.currentTarget.scrollLeft, evento.currentTarget.scrollWidth, evento.currentTarget.clientWidth)}>{cartas.map((carta, indice) => <div className="envoltura-carta" key={carta.id} ref={(elemento) => { referencias.current[indice] = elemento; }}><CartaDeOferta carta={carta} inspeccionada={carta.id === idInspeccionada} alInspeccionar={() => enfocar(indice, carta.id)} /></div>)}</div><div className="puntos-carril" aria-hidden="true">{cartas.map((carta, indice) => <i key={carta.id} className={indice === indiceVisible ? "actual" : ""} />)}</div><div className="tira-comparativa" aria-label={`Comparación de las ${cartas.length} opciones`}>{cartas.map((carta, indice) => <button key={carta.id} className={indice === indiceVisible ? "comparador-activo" : ""} type="button" aria-label={`Inspeccionar ${carta.nombre}: OVR ${carta.ovr}, ${carta.posicionPrimaria}, ${carta.rasgo}`} onClick={() => enfocar(indice, carta.id)}><b>{carta.ovr}<small>{carta.posicionPrimaria}</small></b><i>{etiquetaCortaDeRasgo(carta.rasgo)}</i></button>)}</div></div>; }
function PanelDeDecisiones({ partida, alExplorar, alPedirRepetir }: { partida: EstadoPartida; alExplorar: () => void; alPedirRepetir: () => void }) { return <section className="decisiones" aria-label="Acciones de la partida"><button type="button" disabled={!partida.scoutingDisponible || partida.numeroDePick === 11} onClick={alExplorar}>Explorar {partida.scoutingDisponible ? "· 1 uso" : "agotado"}</button><button type="button" disabled={!partida.rerollDisponible} onClick={alPedirRepetir}>Repetir oferta {partida.rerollDisponible ? "· 1 uso" : "agotado"}</button></section>; }
function HojaScouting({ informe, alCerrar }: { informe: NonNullable<EstadoPartida["informeScouting"]>; alCerrar: () => void }) { const nivel = informe.tipo === "contexto" ? "Pista" : informe.tipo === "posicion_y_rasgo" ? "Lectura" : informe.tipo === "perfil_sin_identidad" ? "Informe" : "Confirmado"; const limite = informe.tipo === "contexto" ? "No revela posición, OVR ni identidad." : informe.tipo === "posicion_y_rasgo" ? "No revela OVR ni identidad." : informe.tipo === "perfil_sin_identidad" ? "No revela el nombre de la carta." : "La carta exacta aparecerá en el próximo roll."; return <aside className={`hoja-scouting scouting-${informe.tipo}`} aria-label={`Scouting: ${nivel}`}><p className="eyebrow">Pick actual · próximo pick</p><span className="nivel-scouting">{nivel}</span><h2>Próximo roll</h2><p>{textoDeScouting(informe)}</p><small>{limite}</small><button className="cta-principal" type="button" onClick={alCerrar}>Entendido</button></aside>; }
function ResumenDeSquad({ partida }: { partida: EstadoPartida }) { const conexiones = calcularConexionesDeQuimica(partida.cartasElegidas); const conteos = new Map<Rasgo, number>(); for (const carta of partida.cartasElegidas) conteos.set(carta.rasgo, (conteos.get(carta.rasgo) ?? 0) + 1); return <section className="resumen-squad"><div className="quimica-resumen"><span>Química</span><strong>{conexiones} / 33</strong><small>País · club · ciclo</small></div><div className="traits">{RASGOS.map((rasgo) => { const cantidad = conteos.get(rasgo) ?? 0; const umbral = cantidad >= 3 ? 5 : 3; const bonus = cantidad >= 5 ? "+3" : cantidad >= 3 ? "+1" : null; return <span data-rasgo={rasgo} key={rasgo}><i>{rasgo}</i><b>{cantidad} / {umbral}</b>{bonus ? <em>{bonus}</em> : null}</span>; })}</div></section>; }
function Formacion({ partida, cartasPorId, idCartaParaMover, alElegirCartaParaMover, alMoverCarta }: { partida: EstadoPartida; cartasPorId: ReadonlyMap<string, CartaPublicada>; idCartaParaMover: string | null; alElegirCartaParaMover: (id: string | null) => void; alMoverCarta: (id: IdPlaza) => void }) { const [plazaDestino, setPlazaDestino] = useState<IdPlaza | null>(null); useEffect(() => { setPlazaDestino(null); }, [idCartaParaMover]); const ubicacionPorPlaza = new Map(partida.ubicaciones.map((ubicacion) => [ubicacion.idPlaza, ubicacion.idCarta])); const cartaParaMover = idCartaParaMover ? cartasPorId.get(idCartaParaMover) ?? null : null; const destino = plazaDestino ? PLAZAS_4_3_3.find((plaza) => plaza.id === plazaDestino) ?? null : null; const ajuste = cartaParaMover && destino ? destino.posicion === cartaParaMover.posicionPrimaria ? 0 : cartaParaMover.posicionesSecundarias.includes(destino.posicion) ? -4 : -10 : null; function confirmarDestino(): void { if (!plazaDestino) return; alMoverCarta(plazaDestino); setPlazaDestino(null); } return <section className="formacion"><div className="formacion-titulo"><div><p className="eyebrow">Pizarra táctica</p><h2>Formación 4-3-3</h2></div><span>{idCartaParaMover ? "Elegí plaza" : `${partida.cartasElegidas.length} / 11`}</span></div><div className="cancha">{PLAZAS_4_3_3.map((plaza) => { const idCarta = ubicacionPorPlaza.get(plaza.id); const carta = idCarta ? cartasPorId.get(idCarta) : null; const activa = plaza.id === plazaDestino; return <button key={plaza.id} type="button" aria-label={carta ? `${carta.nombre}, OVR ${carta.ovr}, ${plaza.posicion}` : `Plaza ${plaza.posicion} vacante`} className={`plaza ${idCartaParaMover === idCarta ? "plaza-seleccionada" : ""} ${activa ? "plaza-destino" : ""}`} onClick={() => idCartaParaMover ? setPlazaDestino(plaza.id) : carta ? alElegirCartaParaMover(carta.id) : undefined}><span className="plaza-dato"><b>{carta?.ovr ?? "—"}</b><small>{plaza.posicion}</small></span>{carta ? <><img src={carta.imagen} alt="" /><strong>{nombreCorto(carta.nombre)}</strong></> : <i>Vacante</i>}{activa ? <em>Destino</em> : null}</button>; })}</div>{cartaParaMover ? <div className="dock-ubicacion"><div className="carta-a-ubicar"><img src={cartaParaMover.imagen} alt="" /><span><b>{cartaParaMover.ovr} · {cartaParaMover.posicionPrimaria}</b><strong>{cartaParaMover.nombre}</strong><small>{cartaParaMover.rasgo}</small></span></div>{destino && ajuste !== null ? <div className={`compatibilidad ajuste-${ajuste === 0 ? "primario" : ajuste === -4 ? "secundario" : "fuera"}`}><span>{destino.posicion} · {ajuste === 0 ? "Posición primaria" : ajuste === -4 ? "Posición secundaria" : "Fuera de posición"}</span><b>OVR {cartaParaMover.ovr + ajuste} <small>{ajuste === 0 ? "±0" : ajuste}</small></b></div> : <p className="ayuda-mover">Tocá una plaza para comparar su OVR efectivo.</p>}<button className="cta-principal" type="button" disabled={!destino} onClick={confirmarDestino}>{destino ? `Ubicar en ${destino.posicion}` : "Elegí una plaza"}</button><button className="cta-discreta" type="button" onClick={() => alElegirCartaParaMover(null)}>Cancelar</button></div> : <p className="ayuda-mover">Tocá una carta para reorganizarla.</p>}</section>; }
function Resultado({ partida, personalBest, nuevoRecord, alJugarOtra, alVerFormacion }: { partida: EstadoPartida; personalBest: number | null; nuevoRecord: boolean; alJugarOtra: () => void; alVerFormacion: () => void }) { const resultado = partida.resultado!; return <main className="resultado"><p className="eyebrow">Squad completa</p><h1>Puntaje del equipo</h1><strong className="puntaje">{resultado.puntaje}</strong><p>{nuevoRecord ? "Nuevo récord personal" : `Récord personal: ${personalBest ?? "—"}`}</p><section className="desglose"><p>OVR efectivo <b>{resultado.promedioOvrEfectivo.toFixed(1)}</b></p><p>Química <b>×{resultado.multiplicadorQuimica.toFixed(3)}</b></p><p>Traits <b>+{resultado.bonosDeTraits.reduce((total, bonus) => total + bonus.bonus, 0)}</b></p></section><button className="cta-principal" type="button" onClick={alJugarOtra}>Nueva partida</button><button className="cta-secundaria" type="button" onClick={alVerFormacion}>Ver mi formación</button></main>; }
function etiquetaCortaDeRasgo(rasgo: Rasgo): string { return { Rematador: "Remat.", Creador: "Cread.", Tecnico: "Técn.", Velocista: "Veloc.", Fisico: "Fís.", "Muro defensivo": "Muro" }[rasgo]; }
function nombreCorto(nombre: string): string { return nombre.split(" ").at(-1) ?? nombre; }
function textoDeScouting(informe: NonNullable<EstadoPartida["informeScouting"]>): string { if (informe.tipo === "contexto") return `Próximo roll: ${informe.contexto.pais} · ${informe.contexto.cicloMundial}.`; if (informe.tipo === "posicion_y_rasgo") return `Próximo roll: ${informe.posicion} · ${informe.rasgo}.`; if (informe.tipo === "perfil_sin_identidad") return `Próximo roll: ${informe.perfil.posicionPrimaria}, OVR ${informe.perfil.ovr} · identidad no revelada.`; return `Próximo roll confirmado: ${informe.carta.nombre}.`; }
function crearSeed(): string { const bytes = new Uint32Array(2); crypto.getRandomValues(bytes); return `libre-${bytes[0]?.toString(36)}${bytes[1]?.toString(36)}`; }
