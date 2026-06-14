/* =====================================================================
   NOSTRUTORIAL — Cross-cutting components (the system)
   Exposes: Icon, Descriptor, ProgressMap, ProgressMapMobile, HoodPanel,
            EventInspector, Misconception, OptionCard, StateRow, jsonHL
   ===================================================================== */
const { useState, useEffect, useRef } = React;

/* ---------------- Icons (simple, stroke-based) ---------------- */
function Icon({ name, size = 18, stroke = 2, style }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style, "aria-hidden": true };
  switch (name) {
    case "check": return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
    case "x": return <svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case "chevron": return <svg {...p}><path d="m6 9 6 6 6-6"/></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "back": return <svg {...p}><path d="M19 12H5M11 18l-6-6 6-6"/></svg>;
    case "key": return <svg {...p}><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.5 12.5 8-8M16 5l3 3M14 7l2 2"/></svg>;
    case "lock": return <svg {...p}><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>;
    case "eye": return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "share": return <svg {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>;
    case "user": return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6"/></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "calendar": return <svg {...p}><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>;
    case "pen": return <svg {...p}><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
    case "send": return <svg {...p}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg>;
    case "relay": return <svg {...p}><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 13h.01M11 13h6"/></svg>;
    case "server": return <svg {...p}><rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 17.5h.01"/></svg>;
    case "globe": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"/></svg>;
    case "shield": return <svg {...p}><path d="M12 3 5 6v5c0 4.5 3 7.8 7 9 4-1.2 7-4.5 7-9V6Z"/></svg>;
    case "puzzle": return <svg {...p}><path d="M9 4a2 2 0 1 1 4 0c0 .8.7 1.3 1.4 1l1.6-.6v3.2l1 .4a2 2 0 1 1 0 3.6l-1 .4V19h-3.6l-.4-1a2 2 0 1 0-3.6 0l-.4 1H5v-4.2"/></svg>;
    case "phone": return <svg {...p}><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18.5h2"/></svg>;
    case "split": return <svg {...p}><path d="M6 3v4a4 4 0 0 0 4 4h4a4 4 0 0 1 4 4v6M6 21v-6"/><circle cx="6" cy="3" r="0"/></svg>;
    case "cloud": return <svg {...p}><path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5a3.5 3.5 0 0 1 0 8.5Z"/><path d="M12 13v5M12 13l-2 2M12 13l2 2"/></svg>;
    case "warn": return <svg {...p}><path d="M10.3 3.8 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>;
    case "info": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>;
    case "spark": return <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/></svg>;
    case "globe-out": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M2 12h13M12 8l4 4-4 4"/></svg>;
    case "compass": return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/></svg>;
    case "menu": return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "sun": return <svg {...p}><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.4M12 19.6V22M4 12H1.6M22.4 12H20M5.2 5.2 6.9 6.9M17.1 17.1l1.7 1.7M18.8 5.2 17.1 6.9M6.9 17.1l-1.7 1.7"/></svg>;
    case "moon": return <svg {...p}><path d="M20.5 14.2A8 8 0 1 1 9.8 3.5a6.3 6.3 0 0 0 10.7 10.7Z"/></svg>;
    case "refresh": return <svg {...p}><path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4"/></svg>;
    case "skip": return <svg {...p}><path d="M5 5v14M19 5v14M5 12h14M9 8l4 4-4 4"/></svg>;
    case "copy": return <svg {...p}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>;
    case "dot": return <svg {...p} fill="currentColor" stroke="none"><circle cx="12" cy="12" r="5"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

/* ---------------- JSON syntax highlight ---------------- */
function jsonHL(obj) {
  const json = JSON.stringify(obj, null, 2);
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = esc(json).replace(
    /("(\\.|[^"\\])*"\s*:)|("(\\.|[^"\\])*")|(\b-?\d+\.?\d*\b)|([{}\[\],])/g,
    (m) => {
      if (/:\s*$/.test(m)) return `<span class="j-key">${m.slice(0,-1)}</span><span class="j-punct">:</span>`;
      if (/^"/.test(m)) return `<span class="j-str">${m}</span>`;
      if (/[{}\[\],]/.test(m)) return `<span class="j-punct">${m}</span>`;
      return `<span class="j-num">${m}</span>`;
    }
  );
  return { __html: html };
}

/* ---------------- Inline descriptor (term + translation + tooltip) ---------------- */
function Descriptor({ term, plain, children }) {
  return (
    <span className="descriptor" tabIndex={0}>
      {children || term}
      <span className="tip" role="tooltip">
        <span className="tip-term">{term}</span> — {plain}
      </span>
    </span>
  );
}

/* ---------------- Progress map (desktop side panel) ---------------- */
const DEFAULT_STEPS = [
  "¿Qué es Nostr?",
  "Crea tu identidad",
  "Protege tu clave",
  "Crea tu perfil",
  "Entiende los relays",
  "Prueba a escribir eventos",
  "Elige por dónde empezar",
];

function ProgressMap({ steps = DEFAULT_STEPS, current = 0, done = [], onJump, onHome,
  title = "Temario", subtitle = "Ve a donde quieras: adelanta o vuelve cuando te apetezca." }) {
  const pct = Math.round((done.length / steps.length) * 100);
  return (
    <nav className="pm" aria-label="Temario del tutorial">
      <div className="pm-head">
        <span className="pm-title">{title}</span>
        <span className="pm-count">{done.length} / {steps.length}</span>
      </div>
      <p className="pm-sub">{subtitle}</p>
      {onHome && <button className="pm-allbtn" onClick={onHome}><Icon name="back" size={13} /> Ver todo el temario</button>}
      <div className="pm-bar"><div className="pm-bar-fill" style={{ width: pct + "%" }} /></div>
      <ol className="pm-steps">
        {steps.map((s, i) => {
          const isDone = done.includes(i);
          const isActive = i === current;
          const cls = ["pm-step", isActive && "is-active", isDone && "is-done",
            !isActive && !isDone && "is-pending"].filter(Boolean).join(" ");
          return (
            <li key={i}>
              <button className={cls}
                onClick={() => onJump && onJump(i)}
                aria-current={isActive ? "step" : undefined}>
                <span className="pm-node">{isDone ? <Icon name="check" size={13} /> : isActive ? <span className="pm-cur" /> : null}</span>
                <span>
                  <span className="pm-label">{s}</span>
                  {isActive && <span className="pm-state" style={{display:"block"}}>Estás aquí</span>}
                  {isDone && !isActive && <span className="pm-state" style={{display:"block",color:"var(--ok)"}}>Completado</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------------- Progress map (mobile, collapsible top) ---------------- */
function ProgressMapMobile({ steps = DEFAULT_STEPS, current = 0, done = [], onJump }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pm-m">
      <div className="pm-m-top" role="button" tabIndex={0} onClick={() => setOpen(o => !o)}>
        <span className="pm-m-num">{current + 1}</span>
        <span className="pm-m-meta">
          <span className="pm-m-eyebrow">Tema {current + 1} de {steps.length}</span>
          <span className="pm-m-name">{steps[current]}</span>
        </span>
        <Icon name="chevron" size={20} style={{ color: "var(--ink-3)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </div>
      <div className="pm-m-segs">
        {steps.map((_, i) => (
          <span key={i} className={["pm-m-seg", done.includes(i) && "is-done", i === current && "is-active"].filter(Boolean).join(" ")} />
        ))}
      </div>
      {open && (
        <ul className="pm-m-list">
          {steps.map((s, i) => {
            const isDone = done.includes(i), isActive = i === current;
            return (
              <li key={i}>
                <button className={["pm-step", isActive && "is-active", isDone && "is-done", !isActive && !isDone && "is-pending"].filter(Boolean).join(" ")}
                  onClick={() => { onJump && onJump(i); setOpen(false); }} style={{ width: "100%" }}>
                  <span className="pm-node">{isDone ? <Icon name="check" size={13} /> : isActive ? <span className="pm-cur" /> : null}</span>
                  <span className="pm-label">{s}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ---------------- "How does this work under the hood?" ---------------- */
function HoodPanel({ label = "¿Cómo funciona esto por dentro?", children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={"hood" + (open ? " is-open" : "")}>
      <button className="hood-btn" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="hood-ic"><Icon name="eye" size={15} /></span>
        {label}
        <span className="hood-opt">Opcional</span>
        <span className="hood-chev"><Icon name="chevron" size={18} /></span>
      </button>
      {open && <div className="hood-body">{children}</div>}
    </div>
  );
}

/* ---------------- Misconception block ---------------- */
function Misconception({ myth, reality }) {
  return (
    <div className="miscon" role="note">
      <span className="miscon-tag"><Icon name="warn" size={15} /> Aclaremos un malentendido</span>
      <div className="miscon-myth">
        <span className="miscon-myth-ic"><Icon name="x" size={20} /></span>
        <span className="miscon-myth-t">{myth}</span>
      </div>
      <div className="miscon-real">
        <span className="miscon-real-ic"><Icon name="check" size={20} /></span>
        <span className="miscon-real-t">{reality}</span>
      </div>
    </div>
  );
}

/* ---------------- Option card ---------------- */
function OptionCard({ icon, tone = "accent", name, what, gain, give, meta, action, picked, onPick }) {
  const tones = {
    accent: { bg: "var(--accent-tint)", fg: "var(--accent-deep)" },
    tech:   { bg: "var(--tech-tint)", fg: "var(--tech-ink)" },
    nostr:  { bg: "var(--nostr-tint)", fg: "var(--nostr-deep)" },
    ok:     { bg: "var(--ok-tint)", fg: "var(--ok)" },
  }[tone];
  return (
    <div className={"opt" + (picked ? " is-picked" : "")}>
      <div className="opt-top">
        <span className="opt-ic" style={{ background: tones.bg, color: tones.fg }}><Icon name={icon} size={20} /></span>
        <span className="opt-name">{name}</span>
      </div>
      <p className="opt-what">{what}</p>
      <div className="opt-trade">
        <div className="opt-trade-row opt-gain"><span className="ic"><Icon name="check" size={15} /></span><span><b>Ganas:</b> {gain}</span></div>
        <div className="opt-trade-row opt-give"><span className="ic"><Icon name="info" size={15} /></span><span><b>A cambio:</b> {give}</span></div>
      </div>
      <div className="opt-foot">
        {meta ? <span className="opt-meta"><Icon name="info" size={13} /> {meta}</span> : <span />}
        {action}
        {onPick && (
          <button className={"btn " + (picked ? "btn-primary" : "btn-ghost")} style={{ padding: "9px 16px", fontSize: 14 }} onClick={onPick}>
            {picked ? <><Icon name="check" size={15} /> Elegido</> : "Elegir"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------- System state row (loading / ok / err) ---------------- */
function StateRow({ kind, title, sub, actions }) {
  const ic = { loading: "refresh", ok: "check", err: "warn" }[kind];
  return (
    <div className={"state " + kind}>
      <span className="state-ic"><Icon name={ic} size={20} style={kind === "loading" ? { animation: "spin 1s linear infinite" } : null} /></span>
      <span className="state-txt">
        <span className="state-title">{title}</span>
        {sub && <span className="state-sub">{sub}</span>}
      </span>
      {actions && <span className="state-actions">{actions}</span>}
    </div>
  );
}

/* ---------------- Event inspector ---------------- */
function EventInspector({ event, friendly, relay, compact = false }) {
  const [tab, setTab] = useState("friendly");
  const tabs = [
    { id: "friendly", label: "Vista amigable", icon: "user" },
    { id: "raw", label: "Vista cruda (JSON)", icon: "globe" },
  ];
  if (relay) tabs.push({ id: "relay", label: "Intercambio con el relay", icon: "relay" });
  return (
    <div className="insp">
      <div className="insp-head">
        <span className="insp-title"><Icon name="eye" size={16} style={{ color: "var(--tech)" }} /> Inspector de eventos</span>
        <span className="insp-kind">kind: {event.kind}</span>
      </div>
      <div className="insp-tabs" role="tablist">
        {tabs.map(t => (
          <button key={t.id} role="tab" aria-selected={tab === t.id}
            className={"insp-tab" + (tab === t.id ? " is-active" : "")} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div className="insp-body">
        {tab === "friendly" && (
          <div className="insp-friendly">
            {friendly.map((f, i) => (
              <div className="insp-fact" key={i}>
                <span className="insp-fact-ic"><Icon name={f.icon} size={15} /></span>
                <span>
                  <span className="insp-fact-k">{f.k}</span>
                  <div className="insp-fact-v">{f.v}</div>
                </span>
              </div>
            ))}
          </div>
        )}
        {tab === "raw" && (
          <div>
            <pre className="insp-raw" dangerouslySetInnerHTML={jsonHL(event)} />
            <p className="insp-rawhint"><Icon name="info" size={14} /> Esto es exactamente lo que viaja por la red. Cada campo tiene una explicación en la vista amigable.</p>
          </div>
        )}
        {tab === "relay" && relay && (
          <div>
            <div className="relay-row">
              <span className="relay-dir out">Tú envías →</span>
              <span className="relay-msg">{relay.sent}</span>
            </div>
            <div className="relay-row">
              <span className="relay-dir in">← Relay confirma</span>
              <span className="relay-msg ok">{relay.ok}</span>
            </div>
            <p className="insp-rawhint"><Icon name="check" size={14} style={{ color: "var(--ok)" }} /> El relay respondió <span className="mono">OK ... true</span>: tu evento quedó guardado.</p>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, jsonHL, Descriptor, ProgressMap, ProgressMapMobile, HoodPanel,
  Misconception, OptionCard, StateRow, EventInspector, DEFAULT_STEPS,
});
