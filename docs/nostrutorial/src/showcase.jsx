/* =====================================================================
   NOSTRUTORIAL — Step A showcase: visual system + 7 components
   ===================================================================== */
const { useState: useStateS } = React;

/* ---- Sample data for the inspector specimen ---- */
const SAMPLE_NOTE = {
  id: "a3f1c9...e7b2",
  pubkey: "npub1h8s...3kqd",
  created_at: 1749830400,
  kind: 1,
  tags: [["t", "presentacion"]],
  content: "¡Mi primer evento en Nostr! 🐦",
  sig: "9d4e...f02a",
};
const SAMPLE_FRIENDLY = [
  { icon: "pen", k: "Qué es", v: "Una nota de texto que escribiste (un evento de tipo 1)." },
  { icon: "user", k: "Quién lo firmó", v: <>Tu identidad, <span className="mono">npub1h8s…3kqd</span></> },
  { icon: "clock", k: "Cuándo", v: "13 jun 2026, 16:00 — sellado con la hora de creación." },
  { icon: "shield", k: "Firma", v: "Verificada con tu clave secreta. Nadie más pudo crearlo." },
];
const SAMPLE_RELAY = {
  sent: '["EVENT", {"id":"a3f1c9…","kind":1,"content":"¡Mi primer evento…"}]',
  ok: '["OK", "a3f1c9…e7b2", true, ""]',
};

/* ---- A labelled specimen wrapper ---- */
function Spec({ n, title, desc, span, children, surface = "bg2" }) {
  return (
    <section className="spec" style={span ? { gridColumn: "1 / -1" } : null}>
      <header className="spec-head">
        <span className="spec-n">{n}</span>
        <div>
          <h3 className="spec-title">{title}</h3>
          <p className="spec-desc">{desc}</p>
        </div>
      </header>
      <div className={"spec-stage " + surface}>{children}</div>
    </section>
  );
}

function Swatch({ varName, name, hex, dark }) {
  return (
    <div className="swatch">
      <div className="swatch-chip" style={{ background: `var(${varName})`, color: dark ? "#fff" : "var(--ink)" }}>
        <span className="mono">{hex}</span>
      </div>
      <span className="swatch-name">{name}</span>
    </div>
  );
}

function Showcase({ dark, onToggleTheme }) {
  // demo state for progress map
  const [cur, setCur] = useStateS(3);
  const doneSteps = [0, 1, 2];

  return (
    <div className="page">
      {/* ---------- Masthead ---------- */}
      <header className="mast">
        <div className="mast-wrap">
          <div className="mast-brand">
            <span className="mast-logo"><span className="mast-logo-dot" />Nostrutorial</span>
            <span className="mast-tag">Sistema de diseño</span>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mast-step">Paso A · Dirección visual + 7 componentes</span>
            <button className="iconbtn" onClick={onToggleTheme} title={dark ? "Tema claro" : "Tema oscuro"} aria-label="Cambiar tema">
              <Icon name={dark ? "sun" : "moon"} size={16} />
            </button>
          </span>
        </div>
      </header>

      {/* ---------- Intro / reasoning ---------- */}
      <div className="container intro">
        <span className="eyebrow">Para validar antes de las 7 pantallas</span>
        <h1 className="intro-h1">Calma, calidez y “esto tiene final”.</h1>
        <p className="intro-lead">
          Antes de armar el recorrido, fijo el sistema que le da coherencia. La apuesta visual es
          deliberadamente <b>lo contrario a la estética cripto</b>: nada de morados neón ni muros de texto.
          Tomo la paleta de <b>KYRA LABS</b> — un <b>naranja</b> para la única acción principal de cada pantalla
          y un <b>cian</b> reservado a las zonas técnicas (inspector, JSON, relays) — sobre papel cálido y tinta carbón.
        </p>
        <div className="intro-notes">
          <div className="intro-note">
            <span className="intro-note-ic" style={{ background: "var(--accent-tint)", color: "var(--accent-deep)" }}><Icon name="spark" size={16} /></span>
            <p><b>El guiño morado de Nostr</b> aparece con cuentagotas: solo en los momentos “esto es la red real” (insignias en vivo, marca Nostr). Puedes apagarlo en Tweaks.</p>
          </div>
          <div className="intro-note">
            <span className="intro-note-ic" style={{ background: "var(--tech-tint)", color: "var(--tech-ink)" }}><Icon name="eye" size={16} /></span>
            <p><b>La profundidad es opcional y siempre está.</b> Cada pantalla esconde un panel “¿cómo funciona por dentro?”, cerrado por defecto. Diagramas antes que párrafos.</p>
          </div>
          <div className="intro-note">
            <span className="intro-note-ic" style={{ background: "var(--ok-tint)", color: "var(--ok)" }}><Icon name="check" size={16} /></span>
            <p><b>Accesible por defecto:</b> foco visible, navegación por teclado, y la información de estados/errores nunca depende solo del color (siempre hay ícono + texto).</p>
          </div>
        </div>
        <p className="intro-hint"><Icon name="info" size={15} /> Abre <b>Tweaks</b> (arriba a la derecha) para probar el naranja vs. rojo de KYRA, cambiar entre Helvetica y la serif, y apagar el morado. Todo lo de abajo reacciona en vivo.</p>
      </div>

      {/* ---------- Visual direction ---------- */}
      <div className="container">
        <div className="sec-label"><span className="sec-label-line" /> Dirección visual</div>
        <div className="dir-grid">
          {/* palette */}
          <div className="card dir-card">
            <h3 className="dir-h">Paleta</h3>
            <div className="swatch-row">
              <Swatch varName="--bg" name="Papel (fondo)" hex="#F4F0E8" />
              <Swatch varName="--card" name="Tarjeta" hex="#FBF9F4" />
              <Swatch varName="--ink" name="Carbón (texto)" hex="#2A2622" dark />
              <Swatch varName="--ink-2" name="Texto 2" hex="#5A5249" dark />
            </div>
            <div className="swatch-row">
              <Swatch varName="--accent" name="Naranja KYRA · acción" hex="#E36F46" dark />
              <Swatch varName="--tech" name="Cian KYRA · técnico" hex="#00ADD8" dark />
              <Swatch varName="--err" name="Rojo KYRA" hex="#9E2023" dark />
              <Swatch varName="--nostr" name="Morado Nostr" hex="nod" dark />
            </div>
            <p className="dir-foot">Paleta de <b>KYRA LABS</b> (naranja, cian, rojo) sobre papel cálido; el morado de Nostr entra solo en los momentos “red real”.</p>
          </div>
          {/* type */}
          <div className="card dir-card">
            <h3 className="dir-h">Tipografía</h3>
            <div className="type-spec">
              <span className="type-role">Títulos · serif humanista</span>
              <span className="type-sample type-head">Tu identidad, en tus manos</span>
            </div>
            <div className="type-spec">
              <span className="type-role">Cuerpo · sans humanista</span>
              <span className="type-sample type-bodys">Una clave pública que compartes y una secreta que guardas. Lenguaje humano, no de protocolo.</span>
            </div>
            <div className="type-spec">
              <span className="type-role">Mono · solo en el inspector</span>
              <span className="type-sample mono" style={{ fontSize: 15 }}>["OK", "a3f1c9…", true, ""]</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- The 7 components ---------- */}
      <div className="container">
        <div className="sec-label"><span className="sec-label-line" /> Los 7 componentes del sistema</div>
        <div className="comp-grid">

          <Spec n="1" title="Temario (índice navegable)" desc="Los 7 temas como índice, no como pasos: cualquiera se abre cuando quieras y lo completado se marca con ✓. Panel lateral en escritorio, barra plegable arriba en móvil." surface="bg2">
            <div className="pm-demos">
              <div style={{ width: 290 }}>
                <span className="demo-cap">Escritorio · índice lateral</span>
                <ProgressMap current={cur} done={doneSteps} onJump={setCur} />
              </div>
              <div style={{ width: 300 }}>
                <span className="demo-cap">Móvil · plegable arriba</span>
                <div className="phone-mini"><ProgressMapMobile current={cur} done={doneSteps} onJump={setCur} /></div>
                <p className="demo-cap" style={{ marginTop: 10, color: "var(--ink-3)" }}>Toca la barra para desplegar la lista completa.</p>
              </div>
            </div>
          </Spec>

          <Spec n="2" title="“¿Cómo funciona por dentro?”" desc="Bloque plegable, cerrado por defecto, con etiqueta que invita (nunca “documentación técnica”). Mismo patrón en cada pantalla: la profundidad es opcional.">
            <HoodPanel>
              <p>Una <Descriptor term="clave" plain="un número enorme, imposible de adivinar">clave</Descriptor> de Nostr es, en el fondo, un número gigantesco elegido al azar. De ese número secreto se deriva matemáticamente tu clave pública.</p>
              <p>Nadie las reparte ni las controla: tu dispositivo las genera solo. Por eso nadie te las puede quitar… y por eso tampoco hay un botón de “recuperar”.</p>
            </HoodPanel>
          </Spec>

          <Spec n="3" title="Inspector de eventos" desc="El componente estrella. Para un evento: vista amigable (qué es, quién firmó, cuándo), vista cruda (JSON resaltado) y, cuando aplica, el intercambio con el relay. Abre en amigable; lo crudo está a un clic." span>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <EventInspector event={SAMPLE_NOTE} friendly={SAMPLE_FRIENDLY} relay={SAMPLE_RELAY} />
            </div>
          </Spec>

          <Spec n="4" title="Bloque de malentendido" desc="Un aviso visualmente distinto (no un párrafo más). Formato: el mito tachado → la realidad. La diferencia nunca depende solo del color: ícono ✕ y ✓ + texto.">
            <Misconception
              myth="El nsec es como una contraseña: si la pierdo, la reseteo."
              reality={<>El <span className="mono">nsec</span> <b>no se puede recuperar</b>. Si lo pierdes, no hay forma de volver a entrar con esa identidad.</>}
            />
          </Spec>

          <Spec n="5" title="Descriptor en línea" desc="Cada término real (npub, nsec, relay, evento) aparece la primera vez con su traducción en lenguaje humano, y un tooltip para volver a verla.">
            <p className="desc-demo">
              Vas a recibir un <Descriptor term="npub" plain="tu nombre público, el que compartes con todos">npub</Descriptor> y
              un <Descriptor term="nsec" plain="tu clave secreta, que solo tú guardas">nsec</Descriptor>. Tus notas viajan a
              varios <Descriptor term="relays" plain="servidores que guardan y reparten tus eventos">relays</Descriptor> en
              forma de <Descriptor term="eventos" plain="cada acción firmada: una nota, tu perfil, un me gusta">eventos</Descriptor>.
              <span className="desc-hint"><Icon name="info" size={14} /> Pasa el cursor (o toca) sobre cualquier palabra subrayada.</span>
            </p>
          </Spec>

          <Spec n="6" title="Tarjeta de opción" desc="Para proteger la clave y para elegir cliente. Nombre, “qué es” en una línea, su compromiso honesto (qué ganas / qué cedes) y una acción. Comparables de un vistazo." span>
            <div className="opt-demo">
              <OptionCard icon="puzzle" tone="accent" name="Extensión del navegador"
                what="Un guardián de tu clave que vive en el navegador (nos2x, Alby) y firma por ti."
                gain="comodidad: entras a muchos sitios sin pegar tu clave."
                give="solo funciona en ese navegador y equipo." meta="nos2x · Alby"
                action={<a className="btn btn-ghost" style={{ padding: "9px 14px", fontSize: 14 }} href="#">Ver herramienta <Icon name="arrow" size={15} /></a>} />
              <OptionCard icon="phone" tone="tech" name="Firmador (signer)"
                what="Una app aparte (Amber, nsec.app) que guarda la clave y aprueba cada firma."
                gain="tu clave nunca toca el cliente; apruebas acción por acción."
                give="un paso extra cada vez que publicas." meta="Amber · nsec.app"
                action={<a className="btn btn-ghost" style={{ padding: "9px 14px", fontSize: 14 }} href="#">Ver herramienta <Icon name="arrow" size={15} /></a>} />
            </div>
          </Spec>

          <Spec n="7" title="Estados del sistema" desc="Toda acción de red necesita: cargando, éxito (confirmación clara y visible) y error (mensaje humano + salida: reintentar / omitir / seguir). Un error de red es normal, no una catástrofe." span>
            <div className="state-demo">
              <StateRow kind="loading" title="Enviando tu evento al relay…" sub="Firmado con tu clave. Suele tardar uno o dos segundos." />
              <StateRow kind="ok" title="¡Llegó! Tu evento vive en el relay de práctica." sub="Confirmado con OK · true. Puedes inspeccionarlo abajo." />
              <StateRow kind="err" title="No pudimos conectar con el relay." sub="Pasa a veces y no es grave. Tu clave está a salvo."
                actions={<><button className="btn btn-tech" style={{ padding: "9px 14px", fontSize: 14 }}><Icon name="refresh" size={15} /> Reintentar</button><button className="btn btn-quiet" style={{ fontSize: 14 }}>Omitir</button></>} />
            </div>
          </Spec>

        </div>
      </div>

      <footer className="foot">
        <p>Fin del Paso A · abajo, el sistema aplicado a las 7 pantallas (móvil + escritorio, navegables).</p>
        <p style={{ marginTop: 8, fontWeight: 600, letterSpacing: ".02em" }}>Un proyecto de <span style={{ color: "var(--accent-deep)" }}>KYRA&nbsp;LABS</span> · kyra.codes</p>
      </footer>
    </div>
  );
}

window.Showcase = Showcase;
