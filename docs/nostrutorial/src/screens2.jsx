/* =====================================================================
   NOSTRUTORIAL — Screens 5–7
   ===================================================================== */
const { useState: useS2 } = React;

/* ---------------- Screen 5 — Entiende los relays ---------------- */
function Screen5({ ctx }) {
  const relays = ["relay.damus.io", "nos.lol", "relay.primal.net", "relay.snort.social"];
  const whys = [
    { ic: "shield", b: "Redundancia", p: "Si uno se cae, tus eventos siguen en los demás. No dependes de nadie." },
    { ic: "globe", b: "Alcance", p: "Cuantos más relays, más gente puede encontrarte y leerte." },
    { ic: "key", b: "Resistencia a censura", p: "Nadie puede silenciarte del todo: publicas en varios a la vez." },
    { ic: "spark", b: "Relays de pago", p: "Algunos cobran una pequeña cuota: menos spam y mejor servicio." },
  ];
  return (
    <div>
      <ScreenHead icon="relay" eyebrow={ctx.t("s5_eyebrow")} title={ctx.t("s5_title")} lead={ctx.t("s5_lead")} />

      <div className="block">
        <div className="tree">
          <div className="tree-node you"><Icon name="user" size={16} /> Tú (tu cliente)</div>
          <div className="tree-trunk" />
          <div className="tree-kids">
            {relays.map(r => (
              <div className="tree-kid" key={r}><div className="tree-node"><span className="ic"><Icon name="server" size={15} /></span>{r}</div></div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 14.5, color: "var(--ink-2)", marginTop: 14, lineHeight: 1.6 }}>
          Un <Descriptor term="relay" plain="un servidor que guarda y reparte eventos">relay</Descriptor> es un servidor sencillo: recibe tus eventos, los guarda y se los entrega a quien los pida. Tu cliente habla con <b>varios a la vez</b> — por eso conviene tener más de uno.
        </p>
      </div>

      <div className="block">
        <div className="block-label"><Icon name="info" size={14} /> Por qué varios relays valen la pena</div>
        <div className="why-grid">
          {whys.map(w => (
            <div className="why-item" key={w.b}><span className="ic"><Icon name={w.ic} size={16} /></span><b>{w.b}</b><p>{w.p}</p></div>
          ))}
        </div>
      </div>

      <div className="block">
        <div className="relaycard">
          <span className="relaycard-ic"><Icon name="relay" size={20} /></span>
          <div>
            <h4>Tu relay de práctica</h4>
            <span className="addr"><Icon name="server" size={14} /> wss://practica.nostrutorial.app</span>
            <p>En el siguiente paso escribirás eventos aquí. Es un relay de práctica: puedes añadir esta dirección a <b>otro cliente</b> para comprobar tú mismo lo que publicas. Todo lo de aquí se borra solo a los 15 días.</p>
          </div>
        </div>
      </div>

      <div className="block">
        <HoodPanel label="¿Qué le dice exactamente un cliente a un relay?">
          <p>Para <b>pedir</b> eventos, tu cliente manda un mensaje <span className="mono">REQ</span>:</p>
          <p className="mono" style={{ background: "var(--bg-2)", padding: "10px 12px", borderRadius: 10, fontSize: 12.5 }}>["REQ", "sub1", {'{'}"kinds":[1], "limit":20{'}'}]</p>
          <p>Para <b>enviar</b> uno, manda un <span className="mono">EVENT</span> con tu evento firmado dentro. El relay responde <span className="mono">["OK", id, true, ""]</span> si lo aceptó. Eso es todo el “idioma”.</p>
        </HoodPanel>
      </div>
    </div>
  );
}

/* ---------------- Screen 6 — Prueba a escribir eventos ---------------- */
function StudyCard({ ev, npub, onToast }) {
  const [open, setOpen] = useS2(false);
  const days = 15;
  return (
    <div className="study">
      <div className="study-head">
        <span className="study-badge">Evento · kind 1</span>
        <span className="study-eph"><Icon name="clock" size={13} /> se borra en {days} días</span>
      </div>
      <div className="study-body">
        <p className="study-content">{ev.content}</p>
        <div className="study-meta">
          <span className="m"><Icon name="user" size={13} /> {npub.slice(0, 12)}…</span>
          <span className="m"><Icon name="clock" size={13} /> {fmtTs(ev.created_at)}</span>
          <span className="m" style={{ color: "var(--ok)" }}><span className="pulse-dot" style={{ display: "inline-block" }} /> en el relay de práctica</span>
        </div>
      </div>
      <div className="study-actions">
        {!open ? (
          <button className="btn btn-ghost study-inspect-btn" onClick={() => setOpen(true)}><Icon name="eye" size={16} /> Inspeccionar este evento</button>
        ) : (
          <div>
            <EventInspector event={ev} friendly={noteFacts(ev, npub)}
              relay={{ sent: '["EVENT", {"id":"' + ev.id.slice(0, 8) + '…","kind":1,"content":"' + ev.content.slice(0, 18) + '…"}]', ok: '["OK", "' + ev.id.slice(0, 8) + '…", true, ""]' }} />
            <button className="btn btn-quiet" style={{ marginTop: 10 }} onClick={() => setOpen(false)}><Icon name="chevron" size={15} style={{ transform: "rotate(180deg)" }} /> Cerrar inspector</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Screen6({ ctx }) {
  const [text, setText] = useS2("");
  const { practice, practiceStatus, identity } = ctx;
  const npub = identity ? identity.npub : "npub1…";
  const send = () => { if (!text.trim()) return; ctx.sendPractice(text.trim()); setText(""); };
  return (
    <div>
      <div className="block">
        <div className="bench-banner">
          <span className="ic"><Icon name="info" size={18} /></span>
          <span><b>Esto es un banco de pruebas, no una red social.</b> Tus eventos viven solo en el relay de práctica y se autodestruyen a los 15 días. Nada se publica en la red real.</span>
        </div>
      </div>

      <ScreenHead icon="pen" eyebrow={ctx.t("s6_eyebrow")} title={ctx.t("s6_title")} lead={ctx.t("s6_lead")} />

      <div className="block">
        <div className="composer">
          <textarea value={text} onChange={e => setText(e.target.value)} maxLength={280}
            placeholder="Escribe algo para firmar y enviar… (p. ej. «Hola, Nostr»)" />
          <div className="composer-foot">
            <label className="simfail">
              <input type="checkbox" checked={ctx.sim.s6} onChange={() => ctx.toggleSim("s6")} />
              Simular fallo de conexión
            </label>
            <span className="composer-foot count">{text.length}/280</span>
            <button className="btn btn-primary" disabled={!text.trim() || (practiceStatus !== "idle" && practiceStatus !== "error")} onClick={send}>
              <Icon name="send" size={16} /> Firmar y enviar
            </button>
          </div>
        </div>
      </div>

      {practiceStatus === "signing" && <div className="block"><StateRow kind="loading" title="Firmando con tu clave…" sub="Tu nsec crea una firma única sobre este texto." /></div>}
      {practiceStatus === "sending" && <div className="block"><StateRow kind="loading" title="Enviando al relay de práctica…" sub="Viaja como un mensaje EVENT." /></div>}
      {practiceStatus === "error" && (
        <div className="block"><StateRow kind="err" title="No se pudo conectar con el relay." sub="Pasa a veces y no es grave. Tu evento sigue firmado; puedes reintentar."
          actions={<button className="btn btn-tech" style={{ padding: "9px 14px", fontSize: 14 }} onClick={() => ctx.retryPractice()}><Icon name="refresh" size={15} /> Reintentar</button>} /></div>
      )}

      <div className="block">
        <div className="block-label"><Icon name="pen" size={14} /> Tus eventos de práctica {practice.length > 0 && <span style={{ color: "var(--ink-3)", fontWeight: 600 }}>· {practice.length}</span>}</div>
        {practice.length === 0 ? (
          <div className="bench-empty"><Icon name="pen" size={22} style={{ color: "var(--ink-3)", marginBottom: 8 }} /><p style={{ fontWeight: 600, color: "var(--ink-2)" }}>Aún no has escrito nada.</p><p style={{ fontSize: 13.5, marginTop: 4 }}>Escribe arriba y pulsa “Firmar y enviar”. Tu evento aparecerá aquí como ficha de estudio.</p></div>
        ) : (
          <div className="bench-list">
            {practice.map(ev => <StudyCard key={ev.id} ev={ev} npub={npub} onToast={ctx.toast} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Screen 7 — Elige por dónde empezar ---------------- */
function Screen7({ ctx }) {
  if (ctx.finished) {
    const cl = CLIENTS.find(c => c.id === ctx.client);
    return (
      <div className="done-hero">
        <div className="done-medal"><Icon name="check" size={34} /></div>
        <h2>Tu identidad está lista.</h2>
        <p>Te acompañamos hasta aquí — que es el principio. Llévate tu <span className="mono">{ctx.identity ? ctx.identity.npub.slice(0, 14) : "npub1…"}…</span> a donde quieras: siempre será tuya.</p>
        <a className="btn btn-primary" style={{ fontSize: 16, padding: "14px 24px" }} href="#" onClick={e => e.preventDefault()}>
          <Icon name="globe-out" size={18} /> Abrir {cl ? cl.name : "tu cliente"}
        </a>
        <p style={{ marginTop: 18, fontSize: 13.5, color: "var(--ink-3)" }}>¿Quieres explorar otro? Vuelve atrás cuando quieras — tu identidad no cambia.</p>
      </div>
    );
  }
  return (
    <div>
      <ScreenHead icon="compass" eyebrow={ctx.t("s7_eyebrow")} title={ctx.t("s7_title")} lead={ctx.t("s7_lead")} />

      <div className="block">
        <div className="exit-hero">
          <span className="badge"><span style={{ width: 8, height: 8, borderRadius: 99, background: "var(--nostr)", display: "inline-block" }} /> Una identidad, todas las apps</span>
          <h3>Con tu misma clave entras a cualquiera.</h3>
          <p>No creas una cuenta nueva en cada sitio. Abres el cliente que prefieras con tu npub y tu nsec — y tu perfil, tus notas y tus contactos van contigo.</p>
        </div>
      </div>

      <div className="block">
        <div className="block-label"><Icon name="compass" size={14} /> Elige por dónde empezar</div>
        <div className="client-grid">
          {CLIENTS.map(c => (
            <OptionCard key={c.id} icon={c.icon} tone={c.tone} name={c.name} what={c.what} gain={c.gain} give={c.give} meta={c.meta}
              picked={ctx.client === c.id} onPick={() => { ctx.setClient(c.id); ctx.toast("Elegiste: " + c.name); }}
              action={<span className="opt-meta"><Icon name="globe-out" size={14} /> {c.platform}</span>} />
          ))}
        </div>
      </div>

      <div className="block" style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn btn-primary" style={{ fontSize: 16, padding: "14px 24px" }} disabled={!ctx.client} onClick={ctx.finish}>
          <Icon name="globe-out" size={18} /> {ctx.client ? ("Salir hacia " + (CLIENTS.find(c => c.id === ctx.client) || {}).name) : "Elige un cliente arriba"}
        </button>
      </div>

      <div className="block">
        <HoodPanel label="¿Cómo entra un cliente sin pedirte contraseña?">
          <p>Cuando abres un cliente, le das tu clave (o conectas tu firmador). El cliente <b>no tiene cuentas</b>: usa tu nsec para firmar y tu npub para identificarte. No hay “usuario y contraseña” que un servidor guarde.</p>
          <p>Por eso la misma identidad funciona en todos: no es “tu cuenta de esa app”, es <b>tuya</b>, y la app solo la usa.</p>
        </HoodPanel>
      </div>
    </div>
  );
}

const CLIENTS = [
  { id: "damus", icon: "phone", tone: "accent", name: "Damus", platform: "iOS", what: "Cliente nativo para iPhone: pulido, rápido y muy cuidado.", gain: "la experiencia más fluida en iOS.", give: "solo para Apple." , meta: "App Store" },
  { id: "amethyst", icon: "phone", tone: "tech", name: "Amethyst", platform: "Android", what: "El cliente de referencia en Android, muy completo.", gain: "todas las funciones, en tu bolsillo.", give: "solo Android.", meta: "Play Store" },
  { id: "primal", icon: "globe", tone: "nostr", name: "Primal", platform: "Web · iOS · Android", what: "Rápido y fácil para empezar, en todas partes.", gain: "el más sencillo para recién llegados.", give: "menos ajustes avanzados.", meta: "Multiplataforma" },
  { id: "nostrudel", icon: "globe", tone: "tech", name: "Nostrudel", platform: "Web", what: "Funciona en el navegador, sin instalar nada.", gain: "lo abres y ya está.", give: "interfaz más densa.", meta: "Navegador" },
];

Object.assign(window, { Screen5, Screen6, Screen7, StudyCard, CLIENTS });
