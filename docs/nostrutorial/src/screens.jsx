/* =====================================================================
   NOSTRUTORIAL — Screens 1–4 + shared helpers
   Each screen takes a single `ctx` (state + actions) from the app shell.
   ===================================================================== */
const { useState: useS } = React;

function fmtTs(ts) {
  return new Date(ts * 1000).toLocaleString("es-ES",
    { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function ScreenHead({ eyebrow, icon, title, lead }) {
  return (
    <div className="sh">
      {eyebrow && <span className="sh-eyebrow">{icon && <Icon name={icon} size={13} />}{eyebrow}</span>}
      <h2 className="sh-title">{title}</h2>
      {lead && <p className="sh-lead">{lead}</p>}
    </div>
  );
}

/* friendly-fact builders shared by inspector usages */
function profileFacts(p, npub) {
  return [
    { icon: "user", k: "Qué es", v: "Tu perfil público — un evento de tipo 0 (metadata)." },
    { icon: "pen", k: "Qué guarda", v: <>Nombre: <b>{p.name || "—"}</b>{p.bio ? <> · Bio: “{p.bio}”</> : null}</> },
    { icon: "share", k: "Quién lo firmó", v: <>Tu identidad, <span className="mono">{npub}</span></> },
    { icon: "shield", k: "Por qué importa", v: "Cualquier cliente que abras con tu clave mostrará este perfil. Es tuyo y editable." },
  ];
}
function noteFacts(ev, npub) {
  return [
    { icon: "pen", k: "Qué es", v: "Una nota de texto que escribiste — un evento de tipo 1." },
    { icon: "user", k: "Quién lo firmó", v: <>Tu identidad, <span className="mono">{npub}</span></> },
    { icon: "clock", k: "Cuándo", v: fmtTs(ev.created_at) + " — sellado con la hora de creación." },
    { icon: "shield", k: "Firma", v: "Verificada con tu clave secreta. Nadie más pudo crear este evento." },
  ];
}

/* ---------------- Screen 1 — ¿Qué es Nostr? ---------------- */
function Screen1({ ctx }) {
  return (
    <div>
      <ScreenHead icon="globe" eyebrow={ctx.t("s1_eyebrow")} title={ctx.t("s1_title")} lead={ctx.t("s1_lead")} />

      <div className="block">
        <div className="block-label"><Icon name="spark" size={14} /> {ctx.t("s1_diagram")}</div>
        <div className="kflow">
          <div className="kflow-you">
            <div className="kflow-ava"><Icon name="key" size={26} /></div>
            <b>{ctx.t("s1_you")}</b>
            <span>{ctx.t("s1_youkey")}</span>
          </div>
          <div className="kflow-arrow"><Icon name="arrow" size={22} /></div>
          <div className="kflow-apps">
            <div className="app-chip"><span className="ic"><Icon name="pen" size={15} /></span> {ctx.t("s1_app1")}</div>
            <div className="app-chip"><span className="ic"><Icon name="eye" size={15} /></span> {ctx.t("s1_app2")}</div>
            <div className="app-chip"><span className="ic"><Icon name="user" size={15} /></span> {ctx.t("s1_app3")}</div>
            <div className="app-chip"><span className="ic"><Icon name="globe" size={15} /></span> {ctx.t("s1_app4")}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--ink-3)", marginTop: 12, lineHeight: 1.5 }}>
          {ctx.t("s1_note")}
        </p>
      </div>

      <div className="block">
        <HoodPanel label={ctx.t("hood_label")}>
          <p>Nostr no es una empresa ni una app: es un <Descriptor term="protocolo" plain="un conjunto de reglas que cualquier app puede seguir">protocolo</Descriptor> abierto. Tu identidad es un par de claves que vive contigo, no en el servidor de nadie.</p>
          <p>Por eso ninguna app puede “echarte” o quedarse con tus seguidores: te los llevas a la siguiente. Aquí no publicamos nada en la red real; es un terreno de práctica.</p>
        </HoodPanel>
      </div>
    </div>
  );
}

/* ---------------- Screen 2 — Crea tu identidad ---------------- */
function Screen2({ ctx }) {
  const { idStatus, identity } = ctx;
  const [showSec, setShowSec] = useS(false);
  return (
    <div>
      <ScreenHead icon="key" eyebrow={ctx.t("s2_eyebrow")} title={ctx.t("s2_title")} lead={ctx.t("s2_lead")} />

      <div className="block">
        <div className="engine-chip"><Icon name="spark" size={14} /> Motor de creación: <b>Nstart</b> — estándar de Nostr, envuelto en lenguaje claro.</div>
      </div>

      {idStatus === "idle" && (
        <div className="block">
          <div className="key-grid">
            <div className="keycard pub" style={{ opacity: .55 }}>
              <div className="keycard-top"><span className="keycard-ic"><Icon name="share" size={17} /></span><span className="keycard-name">npub</span><span className="keycard-tag">Pública</span></div>
              <div className="keyval"><span className="v" style={{ color: "var(--ink-3)" }}>aún sin generar…</span></div>
            </div>
            <div className="keycard sec" style={{ opacity: .55 }}>
              <div className="keycard-top"><span className="keycard-ic"><Icon name="lock" size={17} /></span><span className="keycard-name">nsec</span><span className="keycard-tag">Secreta</span></div>
              <div className="keyval"><span className="v" style={{ color: "var(--ink-3)" }}>aún sin generar…</span></div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={ctx.createIdentity}><Icon name="key" size={17} /> {ctx.t("s2_cta")}</button>
            <label className="simfail">
              <input type="checkbox" checked={ctx.sim.s2} onChange={() => ctx.toggleSim("s2")} />
              Simular un fallo al generar
            </label>
          </div>
        </div>
      )}

      {idStatus === "generating" && (
        <div className="block"><StateRow kind="loading" title="Generando tu par de claves…" sub="Tu dispositivo elige un número secreto enorme. Un segundo." /></div>
      )}

      {idStatus === "error" && (
        <div className="block">
          <StateRow kind="err" title="No se pudo completar la generación." sub="No pasó nada raro y no se creó ninguna clave a medias. Puedes reintentar." />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={ctx.createIdentity}><Icon name="refresh" size={16} /> Reintentar</button>
            <label className="simfail">
              <input type="checkbox" checked={ctx.sim.s2} onChange={() => ctx.toggleSim("s2")} />
              Simular un fallo al generar
            </label>
          </div>
        </div>
      )}

      {idStatus === "done" && identity && (
        <div>
          <div className="block">
            <StateRow kind="ok" title="¡Listo! Tu identidad ya existe." sub="Estas dos claves son tuyas y de nadie más. Vive en tu dispositivo, no en Nostrutorial." />
          </div>
          <div className="block key-grid">
            <div className="keycard pub">
              <div className="keycard-top"><span className="keycard-ic"><Icon name="share" size={17} /></span><span className="keycard-name">npub</span><span className="keycard-tag">Pública</span></div>
              <div className="keyval"><span className="v mono">{identity.npub}</span><button title="Copiar" onClick={() => ctx.toast("npub copiado")}><Icon name="copy" size={16} /></button></div>
              <p className="keycard-why"><Descriptor term="npub" plain="tu nombre público, el que compartes con todos">El npub</Descriptor> es como tu @usuario: <b>compártelo sin miedo</b>. Es cómo te encuentran.</p>
            </div>
            <div className="keycard sec">
              <div className="keycard-top"><span className="keycard-ic"><Icon name="lock" size={17} /></span><span className="keycard-name">nsec</span><span className="keycard-tag">Secreta</span></div>
              <div className={"keyval" + (showSec ? "" : " masked")}>
                <span className="v mono">{showSec ? identity.nsec : "nsec1•••••••••••••••••••••••••••••"}</span>
                <button title={showSec ? "Ocultar" : "Mostrar"} onClick={() => setShowSec(s => !s)}><Icon name="eye" size={16} /></button>
              </div>
              <p className="keycard-why"><Descriptor term="nsec" plain="tu clave secreta, que solo tú guardas">El nsec</Descriptor> es tu contraseña maestra: <b>nunca lo compartas</b>. Lo proteges en el paso siguiente.</p>
            </div>
          </div>
          <div className="block">
            <HoodPanel label="¿Cómo se genera una clave? (sin fórmulas)">
              <p>Tu dispositivo elige un número al azar tan grande que es imposible de adivinar (hay más combinaciones que átomos en el universo visible). Ese número es tu <span className="mono">nsec</span>.</p>
              <p>De él se deriva, con matemáticas de un solo sentido, tu <span className="mono">npub</span>: se puede ir de secreto a público, pero <b>nunca al revés</b>. Por eso compartir el npub es seguro.</p>
            </HoodPanel>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Screen 3 — Protege tu clave ---------------- */
function Screen3({ ctx }) {
  const opts = [
    { id: "backup", icon: "cloud", tone: "accent", name: "Respaldo cifrado", what: "Guardas tu nsec en un archivo cifrado con una contraseña que tú eliges.", gain: "simple y bajo tu control total.", give: "si olvidas esa contraseña, vuelves a estar sin acceso.", meta: "Sin apps extra", link: "Cómo hacerlo" },
    { id: "ext", icon: "puzzle", tone: "tech", name: "Extensión del navegador", what: "Un guardián en el navegador (nos2x, Alby) firma por ti sin pegar la clave.", gain: "entras a muchos sitios web con un clic.", give: "solo en ese navegador y equipo.", meta: "nos2x · Alby", link: "Ver herramienta" },
    { id: "signer", icon: "phone", tone: "tech", name: "Firmador (signer)", what: "Una app aparte (Amber, nsec.app) guarda la clave y aprueba cada firma.", gain: "tu clave nunca toca el cliente.", give: "un paso extra al publicar.", meta: "Amber · nsec.app", link: "Ver herramienta" },
    { id: "frost", icon: "split", tone: "nostr", name: "Clave dividida (FROST)", what: "Parte tu clave en varios fragmentos; necesitas varios para firmar.", gain: "máxima resistencia a robo o pérdida.", give: "es la opción más avanzada de configurar.", meta: "Avanzado", link: "Leer sobre FROST" },
  ];
  return (
    <div>
      <ScreenHead icon="shield" eyebrow={ctx.t("s3_eyebrow")} title={ctx.t("s3_title")} lead={ctx.t("s3_lead")} />

      <div className="block">
        <Misconception
          myth="El nsec es como una contraseña: si la pierdo, pido una nueva."
          reality={<>El <span className="mono">nsec</span> <b>no se puede recuperar</b> ni resetear. Si lo pierdes, no hay forma de volver a entrar con esa identidad. Por eso respaldarlo es el paso más importante.</>}
        />
      </div>

      <div className="block">
        <div className="block-label"><Icon name="key" size={14} /> Elige al menos un camino de respaldo</div>
        <div className="client-grid">
          {opts.map(o => (
            <OptionCard key={o.id} icon={o.icon} tone={o.tone} name={o.name} what={o.what} gain={o.gain} give={o.give} meta={o.meta}
              picked={ctx.backup === o.id} onPick={() => { ctx.setBackup(o.id); ctx.toast("Elegiste: " + o.name); }}
              action={<a className="btn btn-ghost" style={{ padding: "9px 13px", fontSize: 13.5 }} href="#" onClick={e => e.preventDefault()}>{o.link} <Icon name="arrow" size={14} /></a>} />
          ))}
        </div>
      </div>

      <div className="block">
        <HoodPanel label="¿Qué significa “firmar” con tu clave?">
          <p>Cada vez que publicas algo, tu nsec crea una <Descriptor term="firma" plain="una marca matemática única que solo tu clave puede producir">firma</Descriptor> sobre ese contenido. Cualquiera puede comprobar, con tu npub, que fuiste tú — sin ver nunca tu secreto.</p>
          <p>Por eso un respaldo no es opcional: <b>tu clave ES tu identidad</b>. Protegerla es protegerte a ti.</p>
        </HoodPanel>
      </div>
    </div>
  );
}

/* ---------------- Screen 4 — Crea tu perfil ---------------- */
function Screen4({ ctx }) {
  const { profile, profileStatus, profileEvent, identity } = ctx;
  const initials = (profile.name || "?").trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const fileRef = React.useRef(null);
  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => ctx.setProfileField("pic", r.result);
    r.readAsDataURL(f);
  };
  return (
    <div>
      <ScreenHead icon="user" eyebrow={ctx.t("s4_eyebrow")} title={ctx.t("s4_title")} lead={ctx.t("s4_lead")} />

      <div className="block">
        <div className="pedit">
          <div>
            <div className="pavatar">
              {profile.pic ? <img src={profile.pic} alt="" /> : (initials || <Icon name="user" size={34} />)}
              <span className="pavatar-edit" onClick={() => fileRef.current && fileRef.current.click()} title="Cambiar foto"><Icon name="pen" size={14} /></span>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
            </div>
          </div>
          <div className="pfields">
            <div className="field"><label>Nombre</label><input value={profile.name} placeholder="¿Cómo quieres que te vean?" onChange={e => ctx.setProfileField("name", e.target.value)} /></div>
            <div className="field"><label>Bio</label><textarea rows="2" value={profile.bio} placeholder="Una línea sobre ti (opcional)" onChange={e => ctx.setProfileField("bio", e.target.value)} /></div>
            <label className="simfail">
              <input type="checkbox" checked={ctx.sim.s4} onChange={() => ctx.toggleSim("s4")} />
              Simular un error de escritura en el relay
            </label>
          </div>
        </div>
      </div>

      {(profileStatus === "idle" || profileStatus === "error") && (
        <div className="block" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <button className="btn btn-primary" disabled={!profile.name.trim()} onClick={ctx.saveProfile}>
            <Icon name="send" size={16} /> {profileStatus === "error" ? "Reintentar" : ctx.t("s4_cta")}
          </button>
          {!profile.name.trim() && <span className="app-nav-hint"><Icon name="info" size={14} /> {ctx.t("hint_profile")}</span>}
        </div>
      )}

      {profileStatus === "saving" && <div className="block"><StateRow kind="loading" title="Guardando tu perfil en los relays…" sub="Tu perfil viaja firmado como un evento de tipo 0." /></div>}
      {profileStatus === "error" && <div className="block"><StateRow kind="err" title="No se pudo escribir en el relay." sub="Suele ser temporal. Tu identidad y tus datos están a salvo — solo hay que reintentar." /></div>}

      {profileStatus === "saved" && profileEvent && (
        <div>
          <div className="block">
            <StateRow kind="ok" title="Tu perfil ya vive en Nostr." sub="Cualquier cliente que abras con tu clave lo mostrará. Puedes editarlo y volver a guardar." />
          </div>
          <div className="block">
            <div className="block-label"><Icon name="eye" size={14} /> Tu primer evento, visto por dentro</div>
            <EventInspector event={profileEvent} friendly={profileFacts(profile, identity ? identity.npub : "npub1…")}
              relay={{ sent: '["EVENT", {"kind":0,"content":"{…tu perfil…}","sig":"…"}]', ok: '["OK", "' + profileEvent.id.slice(0, 8) + '…", true, ""]' }} />
            <p style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
              <Icon name="info" size={15} /> Es la primera vez que ves el inspector — y es sobre algo tuyo. Lo usarás a fondo en el paso 6.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { fmtTs, ScreenHead, profileFacts, noteFacts, Screen1, Screen2, Screen3, Screen4 });
