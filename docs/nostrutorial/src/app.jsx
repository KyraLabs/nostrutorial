/* =====================================================================
   NOSTRUTORIAL — App orchestrator: theme, i18n, state machine,
   app shell (desktop + mobile), device frames, root.
   ===================================================================== */
const { useState: useA, useEffect: useEffA, useRef: useRefA } = React;

/* ---------- Theme (Tweaks → CSS vars) ---------- */
const ACCENTS = {
  "Naranja": { a:"#E36F46", d:"#C8542E", t:"#F8DDD0", t2:"#FCEDE6", on:"#3A1A0E" },
  "Rojo":    { a:"#9E2023", d:"#841A1D", t:"#F0D6D6", t2:"#F8E8E8", on:"#FFFFFF" },
  "Ámbar":   { a:"#D98A2B", d:"#BE7314", t:"#F6E6C8", t2:"#FBF1DD", on:"#3A2A12" },
};
const HEAD_FONTS = { "Literata": '"Literata", Georgia, serif', "Newsreader": '"Newsreader", Georgia, serif', "Helvetica": '"Helvetica Neue", Helvetica, Arial, sans-serif' };
const BODY_FONTS = {
  "Helvetica": '"Helvetica Neue", Helvetica, "Hanken Grotesk", Arial, sans-serif',
  "Hanken Grotesk": '"Hanken Grotesk", system-ui, sans-serif',
  "Figtree": '"Figtree", system-ui, sans-serif',
};
function hexRgb(h) { h = h.replace("#", ""); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
function lighten(h, amt) { const [r, g, b] = hexRgb(h); const f = c => Math.round(c + (255 - c) * amt); return `rgb(${f(r)},${f(g)},${f(b)})`; }
function applyTheme(t) {
  const r = document.documentElement.style, S = (k, v) => r.setProperty(k, v);
  const ac = ACCENTS[t.accent] || ACCENTS["Naranja"];
  const [ar, ag, ab] = hexRgb(ac.a);
  if (t.dark) {
    S("--bg", "#1A1715"); S("--bg-2", "#231F1C"); S("--card", "#201D1A"); S("--card-2", "#272320");
    S("--line", "#342F2A"); S("--line-strong", "#473F39");
    S("--ink", "#ECE6DD"); S("--ink-2", "#B3ABA0"); S("--ink-3", "#857D72");
    S("--accent", ac.a); S("--accent-deep", lighten(ac.a, .24));
    S("--accent-tint", `rgba(${ar},${ag},${ab},.18)`); S("--accent-tint-2", `rgba(${ar},${ag},${ab},.10)`); S("--on-accent", ac.on);
    S("--tech", "#3DBCDD"); S("--tech-deep", "#65CFEC"); S("--tech-tint", "rgba(0,173,216,.16)"); S("--tech-ink", "#A4DEEE"); S("--tech-bright", "#00ADD8");
    S("--ok", "#69B584"); S("--ok-tint", "rgba(62,125,83,.20)");
    S("--warn", "#D9A858"); S("--warn-tint", "rgba(176,122,30,.20)");
    S("--err", "#DE5C52"); S("--err-tint", "rgba(158,32,35,.26)");
  } else {
    S("--bg", "#F4F0E8"); S("--bg-2", "#EBE4D8"); S("--card", "#FBF9F4"); S("--card-2", "#FFFFFF");
    S("--line", "#E6DECF"); S("--line-strong", "#D7CDBA");
    S("--ink", "#2A2622"); S("--ink-2", "#5A5249"); S("--ink-3", "#897F70");
    S("--accent", ac.a); S("--accent-deep", ac.d); S("--accent-tint", ac.t); S("--accent-tint-2", ac.t2); S("--on-accent", ac.on);
    S("--tech", "#1391B5"); S("--tech-deep", "#0E7186"); S("--tech-tint", "#D7EEF6"); S("--tech-ink", "#0B5567"); S("--tech-bright", "#00ADD8");
    S("--ok", "#3E7D53"); S("--ok-tint", "#E0EEE2");
    S("--warn", "#B07A1E"); S("--warn-tint", "#F6E9CC");
    S("--err", "#9E2023"); S("--err-tint", "#F1DADA");
  }
  S("--font-head", HEAD_FONTS[t.headFont] || HEAD_FONTS["Literata"]);
  S("--font-body", BODY_FONTS[t.bodyFont] || BODY_FONTS["Helvetica"]);
  if (!t.purple) {
    if (t.dark) { S("--nostr", "#9A9082"); S("--nostr-deep", "#B3ABA0"); S("--nostr-tint", "rgba(150,140,125,.18)"); }
    else { S("--nostr", "#8A7F70"); S("--nostr-deep", "#5C544A"); S("--nostr-tint", "#EFE7D7"); }
  } else {
    if (t.dark) { S("--nostr", "#AC8EDF"); S("--nostr-deep", "#C6B2EC"); S("--nostr-tint", "rgba(122,91,190,.22)"); }
    else { S("--nostr", "#7A5BBE"); S("--nostr-deep", "#5E43A0"); S("--nostr-tint", "#ECE6F6"); }
  }
}
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Naranja",
  "headFont": "Literata",
  "bodyFont": "Helvetica",
  "purple": true,
  "dark": false
}/*EDITMODE-END*/;

/* ---------- i18n (spine strings; body copy is Spanish) ---------- */
const STEP_NAMES = {
  es: ["¿Qué es Nostr?", "Crea tu identidad", "Protege tu clave", "Crea tu perfil", "Entiende los relays", "Prueba a escribir eventos", "Elige por dónde empezar"],
  en: ["What is Nostr?", "Create your identity", "Protect your key", "Build your profile", "Understand relays", "Try writing events", "Choose where to start"],
};
const T = {
  es: {
    cta_start: "Empezar", cta_continue: "Continuar", cta_restart: "Reiniciar",
    choose_client: "Elige un cliente", head_out: "Salir hacia ",
    hint_backup: "Elige un respaldo para continuar", hint_profile: "Pon un nombre para guardar tu perfil", hint_practice: "Escribe e inspecciona al menos un evento",
    creating: "Creando…", saving: "Guardando…", retry: "Reintentar",
    s1_eyebrow: "Empieza aquí", s1_title: "Vas a tener una identidad que nadie te puede quitar.",
    s1_lead: "Una sola identidad que funciona en decenas de apps de Nostr. No es la cuenta de ninguna empresa: es tuya, y te la llevas a donde quieras.",
    s1_diagram: "Una identidad, muchas apps", s1_you: "Tú", s1_youkey: "+ tu clave",
    s1_app1: "App de notas", s1_app2: "App de fotos", s1_app3: "App social", s1_app4: "Y muchas más",
    s1_note: "La misma clave abre todas. Cambias de app sin perder tu perfil ni tus contactos.",
    hood_label: "¿Cómo funciona esto por dentro?",
    s2_eyebrow: "Tu par de claves", s2_title: "Crea tu identidad",
    s2_lead: "Vas a crear un par de claves: una pública que compartes y una secreta que solo tú guardas. Es como una cerradura y su única llave.", s2_cta: "Crear mi identidad",
    s3_eyebrow: "Lo más importante", s3_title: "Protege tu clave (y entiende por qué)",
    s3_lead: "Tu nsec es tu identidad entera. Aquí eliges cómo guardarlo a salvo — con sus ventajas y sus renuncias, sin letra pequeña.",
    s4_eyebrow: "Tu cara pública", s4_title: "Crea tu perfil",
    s4_lead: "Ponle nombre y cara a tu identidad. Al guardar, tu perfil se escribe en relays reales como un evento — y lo verás por dentro.", s4_cta: "Guardar perfil",
    s5_eyebrow: "Dónde vive todo", s5_title: "Entiende los relays",
    s5_lead: "Tus eventos no viven en un servidor central, sino en relays: varios servidores que los guardan y reparten. Tener varios es tu seguro.",
    s6_eyebrow: "Aprende haciendo", s6_title: "Prueba a escribir eventos",
    s6_lead: "Escribe algo: se firma con tu clave, viaja al relay de práctica y aparece abajo como ficha de estudio que puedes abrir y examinar.",
    s7_eyebrow: "La salida", s7_title: "Elige por dónde empezar",
    s7_lead: "Ya tienes identidad, perfil y práctica. Ahora elige un cliente real para usarla de verdad — entras con la misma clave.",
  },
  en: {
    cta_start: "Get started", cta_continue: "Continue", cta_restart: "Restart",
    choose_client: "Choose a client", head_out: "Head out to ",
    hint_backup: "Choose a backup to continue", hint_profile: "Add a name to save your profile", hint_practice: "Write and inspect at least one event",
    creating: "Creating…", saving: "Saving…", retry: "Retry",
    s1_eyebrow: "Start here", s1_title: "You're about to get an identity no one can take from you.",
    s1_lead: "One identity that works across dozens of Nostr apps. It isn't any company's account — it's yours, and it goes wherever you go.",
    s1_diagram: "One identity, many apps", s1_you: "You", s1_youkey: "+ your key",
    s1_app1: "Notes app", s1_app2: "Photos app", s1_app3: "Social app", s1_app4: "And many more",
    s1_note: "The same key opens them all. Switch apps without losing your profile or contacts.",
    hood_label: "How does this work under the hood?",
    s2_eyebrow: "Your key pair", s2_title: "Create your identity",
    s2_lead: "You'll create a pair of keys: a public one you share and a secret one only you keep. Like a lock and its only key.", s2_cta: "Create my identity",
    s3_eyebrow: "The important part", s3_title: "Protect your key (and learn why)",
    s3_lead: "Your nsec is your whole identity. Here you choose how to keep it safe — trade-offs and all, no fine print.",
    s4_eyebrow: "Your public face", s4_title: "Build your profile",
    s4_lead: "Give your identity a name and a face. On save, your profile is written to real relays as an event — and you'll see it from the inside.", s4_cta: "Save profile",
    s5_eyebrow: "Where it all lives", s5_title: "Understand relays",
    s5_lead: "Your events don't live on one central server — they live on relays: several servers that store and share them. Having several is your safety net.",
    s6_eyebrow: "Learn by doing", s6_title: "Try writing events",
    s6_lead: "Write something: it's signed with your key, travels to the practice relay, and shows up below as a study card you can open and examine.",
    s7_eyebrow: "The way out", s7_title: "Choose where to start",
    s7_lead: "You've got an identity, a profile, and practice. Now pick a real client to use it for real — you sign in with the same key.",
  },
};

/* ---------- random-ish key/event builders (demo only) ---------- */
function rid(n) { const c = "0123456789abcdef"; let s = ""; for (let i = 0; i < n; i++) s += c[Math.floor(Math.random() * 16)]; return s; }
function mkIdentity() { return { pubkey: rid(64), npub: "npub1" + rid(58), nsec: "nsec1" + rid(58), created: Math.floor(Date.now() / 1000) }; }
function mkProfileEvent(p, id) {
  return { id: rid(64), pubkey: id.pubkey, created_at: Math.floor(Date.now() / 1000), kind: 0, tags: [],
    content: JSON.stringify({ name: p.name, about: p.bio, picture: p.pic ? "https://i.nostr.build/tu-foto.jpg" : "" }), sig: rid(128) };
}
function mkNote(text, id) { return { id: rid(64), pubkey: id.pubkey, created_at: Math.floor(Date.now() / 1000), kind: 1, tags: [], content: text, sig: rid(128) }; }

/* ---------- Temario (syllabus) home ---------- */
const TOPICS = [
  { icon: "globe", cat: "Empieza aquí", title: "¿Qué es Nostr?", desc: "La promesa: una identidad tuya que funciona en muchas apps." },
  { icon: "key", cat: "Tu par de claves", title: "Crea tu identidad", desc: "Genera tu npub y tu nsec y entiende la diferencia." },
  { icon: "shield", cat: "Lo más importante", title: "Protege tu clave", desc: "Por qué el nsec no se recupera y cómo respaldarlo bien." },
  { icon: "user", cat: "Tu cara pública", title: "Crea tu perfil", desc: "Nombre, bio y foto: tu primer evento real en relays." },
  { icon: "relay", cat: "Dónde vive todo", title: "Entiende los relays", desc: "Qué son, por qué tener varios y el relay de práctica." },
  { icon: "pen", cat: "Aprende haciendo", title: "Prueba a escribir eventos", desc: "Firma, envía e inspecciona en un banco de pruebas." },
  { icon: "compass", cat: "La salida", title: "Elige por dónde empezar", desc: "Lleva tu identidad a un cliente real cuando quieras." },
];

function TopicGrid({ completed, onOpen }) {
  return (
    <div className="temario">
      <div className="temario-intro">
        <span className="sh-eyebrow"><Icon name="compass" size={13} /> Temario</span>
        <h2 className="sh-title">Aprende Nostr a tu ritmo.</h2>
        <p className="sh-lead">Siete temas, sin orden obligatorio. Entra al que te interese y vuelve cuando quieras; lo que completes se marca solo.</p>
        <span className="temario-meta"><span className="pulse-dot" /> {completed.length} de {TOPICS.length} completados · tú eliges por dónde</span>
      </div>
      <div className="tg-grid">
        {TOPICS.map((tp, i) => {
          const done = completed.includes(i);
          return (
            <button key={i} className={"tg-card" + (done ? " is-done" : "")} onClick={() => onOpen(i)}>
              {done && <span className="tg-check"><Icon name="check" size={14} /></span>}
              <span className="tg-ic"><Icon name={tp.icon} size={20} /></span>
              <span className="tg-cat">{tp.cat}</span>
              <span className="tg-title">{tp.title}</span>
              <span className="tg-desc">{tp.desc}</span>
              <span className="tg-foot">
                <span className={"tg-status" + (done ? " done" : "")}>{done ? <><Icon name="check" size={13} /> Completado</> : "Abrir tema"}</span>
                <Icon name="arrow" size={16} style={{ color: "var(--ink-3)" }} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Grouped Temario sidebar (persistent spine) ---------- */
const TEMARIO_GROUPS = [
  { label: "Lo básico", items: [0] },
  { label: "Tu identidad", items: [1, 2] },
  { label: "Hazlo tuyo", items: [3, 4, 5] },
  { label: "Sal al mundo", items: [6] },
];

const GLOSSARY = [
  { term: "npub", plain: "tu clave pública, la que compartes", topic: 1 },
  { term: "nsec", plain: "tu clave secreta, la que guardas", topic: 2 },
  { term: "clave", plain: "tu par de claves", topic: 1 },
  { term: "relay", plain: "servidor que guarda y reparte eventos", topic: 4 },
  { term: "evento", plain: "cada acción firmada en Nostr", topic: 5 },
  { term: "firma", plain: "firmar con tu clave", topic: 2 },
  { term: "perfil", plain: "tu metadata pública (kind 0)", topic: 3 },
  { term: "respaldo", plain: "cómo proteger tu nsec", topic: 2 },
  { term: "cliente", plain: "una app de Nostr", topic: 6 },
  { term: "inspector", plain: "ver un evento por dentro", topic: 5 },
];

const LOCKED_TRACKS = [
  { id: "dev", icon: "pen", label: "Desarrollo", note: "Firmar y publicar eventos desde tu propio código, los NIPs y cómo construir un cliente. En preparación." },
  { id: "infra", icon: "server", label: "Infraestructura", note: "Monta y opera tu propio relay, controla tus datos y su disponibilidad. En preparación." },
];

function TemarioNav({ current, completed, onSelect }) {
  const [query, setQuery] = React.useState("");
  const [collapsed, setCollapsed] = React.useState({});
  const [notes, setNotes] = React.useState({});
  const q = query.trim().toLowerCase();
  const toggle = (label) => setCollapsed(c => ({ ...c, [label]: !c[label] }));

  const topicHits = q ? TOPICS.map((t, i) => ({ t, i })).filter(({ t }) =>
    (t.title + " " + t.desc + " " + t.cat).toLowerCase().includes(q)) : [];
  const termHits = q ? GLOSSARY.filter(g => g.term.includes(q) || g.plain.toLowerCase().includes(q)) : [];

  const item = (i) => {
    const done = completed.includes(i), active = current === i;
    return (
      <button key={"t" + i} className={"tnav-item" + (active ? " is-active" : "") + (done ? " is-done" : "")}
        onClick={() => onSelect(i)} aria-current={active ? "page" : undefined}>
        <span className="tnav-mark">
          {done ? <Icon name="check" size={13} /> : active ? <span className="tnav-dot" /> : <span className="tnav-hollow" />}
        </span>
        <span className="tnav-label">{TOPICS[i].title}</span>
      </button>
    );
  };

  return (
    <nav className="tnav" aria-label="Temario">
      <div className="tnav-head">
        <span className="tnav-title">Temario</span>
        <span className="tnav-count">{completed.length}/7</span>
      </div>
      <div className="tnav-search">
        <Icon name="search" size={15} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="busca: tema, npub, relay…" aria-label="Buscar en el temario" />
        {query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><Icon name="x" size={14} /></button>}
      </div>

      {q ? (
        <div className="tnav-results">
          {topicHits.length > 0 && <div className="tnav-glabel">Temas</div>}
          {topicHits.map(({ i }) => item(i))}
          {termHits.length > 0 && <div className="tnav-glabel" style={{ marginTop: 12 }}>Términos</div>}
          {termHits.map(g => (
            <button key={g.term} className="tnav-item tnav-term" onClick={() => onSelect(g.topic)}>
              <span className="tnav-mark"><Icon name="info" size={13} /></span>
              <span className="tnav-label"><b className="mono">{g.term}</b> <span className="tnav-termgo">en “{TOPICS[g.topic].title}”</span></span>
            </button>
          ))}
          {topicHits.length === 0 && termHits.length === 0 && (
            <p className="tnav-empty">Nada para “{query}”. Prueba <b>relay</b>, <b>nsec</b> o <b>perfil</b>.</p>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div className="tnav-track is-open">
            <div className="tnav-trackhead is-active">
              <span className="tnav-trackic"><Icon name="spark" size={15} /></span>
              <span className="tnav-tracklabel">Principiante</span>
              <span className="tnav-trackbadge ok">Aquí estás</span>
            </div>
            <div className="tnav-trackbody">
              <button className={"tnav-item tnav-home" + (current < 0 ? " is-active" : "")} onClick={() => onSelect(-1)}>
                <span className="tnav-mark" style={{ color: "var(--ink-3)" }}><Icon name="compass" size={15} /></span>
                <span className="tnav-label">Resumen</span>
              </button>
              {TEMARIO_GROUPS.map(g => {
                const isCol = !!collapsed[g.label];
                return (
                  <div className={"tnav-group" + (isCol ? " collapsed" : "")} key={g.label}>
                    <button className="tnav-glabel tnav-gbtn" onClick={() => toggle(g.label)} aria-expanded={!isCol}>
                      {g.label}
                      <Icon name="chevron" size={14} style={{ color: "var(--ink-3)", transform: isCol ? "rotate(-90deg)" : "none", transition: "transform .2s" }} />
                    </button>
                    {!isCol && g.items.map(i => item(i))}
                  </div>
                );
              })}
            </div>
          </div>
          {LOCKED_TRACKS.map(tr => {
            const open = !!notes[tr.id];
            return (
              <div className="tnav-track is-locked" key={tr.id}>
                <button className="tnav-trackhead" onClick={() => setNotes(n => ({ ...n, [tr.id]: !n[tr.id] }))} aria-expanded={open}>
                  <span className="tnav-trackic"><Icon name={tr.icon} size={15} /></span>
                  <span className="tnav-tracklabel">{tr.label}</span>
                  <span className="tnav-trackbadge"><Icon name="lock" size={11} /> Pronto</span>
                </button>
                {open && <p className="tnav-tracknote">{tr.note}</p>}
              </div>
            );
          })}
        </React.Fragment>
      )}
    </nav>
  );
}

/* ---------- The prototype app (one per frame) ---------- */
function NostrutorialApp({ device, onReset, dark, onToggleTheme }) {
  const m = device === "mobile";
  const [lang, setLang] = useA("es");
  const [step, setStep] = useA(-1);
  const [seen, setSeen] = useA([]);
  const [idStatus, setIdStatus] = useA("idle");
  const [identity, setIdentity] = useA(null);
  const [profile, setProfile] = useA({ name: "", bio: "", pic: "" });
  const [profileStatus, setProfileStatus] = useA("idle");
  const [profileEvent, setProfileEvent] = useA(null);
  const [backup, setBackup] = useA(null);
  const [practice, setPractice] = useA([]);
  const [practiceStatus, setPracticeStatus] = useA("idle");
  const [lastText, setLastText] = useA("");
  const [client, setClient] = useA(null);
  const [finished, setFinished] = useA(false);
  const [sim, setSim] = useA({ s2: false, s4: false, s6: false });
  const [toastMsg, setToastMsg] = useA(null);
  const [drawerOpen, setDrawerOpen] = useA(false);
  const scrollRef = useRefA(null);
  const toastTimer = useRefA(null);

  useEffA(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    if (step >= 0) setSeen(s => s.includes(step) ? s : [...s, step]);
  }, [step, finished]);

  const t = (k) => (T[lang] && T[lang][k]) || T.es[k] || k;
  const go = (n) => { setStep(n); };
  const next = () => setStep(s => Math.min(s + 1, 6));
  const back = () => setStep(s => Math.max(s - 1, 0));
  const toast = (msg) => { setToastMsg(msg); clearTimeout(toastTimer.current); toastTimer.current = setTimeout(() => setToastMsg(null), 1900); };
  const toggleSim = (k) => setSim(s => ({ ...s, [k]: !s[k] }));

  const createIdentity = () => {
    setIdStatus("generating");
    setTimeout(() => {
      if (sim.s2) { setIdStatus("error"); }
      else { const id = mkIdentity(); setIdentity(id); setIdStatus("done"); toast("Identidad creada"); }
    }, 1400);
  };
  const saveProfile = () => {
    setProfileStatus("saving");
    setTimeout(() => {
      if (sim.s4) { setProfileStatus("error"); }
      else { setProfileEvent(mkProfileEvent(profile, identity)); setProfileStatus("saved"); toast("Perfil publicado"); }
    }, 1300);
  };
  const sendPractice = (text) => {
    setLastText(text); setPracticeStatus("signing");
    setTimeout(() => {
      setPracticeStatus("sending");
      setTimeout(() => {
        if (sim.s6) { setPracticeStatus("error"); }
        else { setPractice(p => [mkNote(text, identity), ...p]); setPracticeStatus("idle"); toast("¡Llegó al relay!"); }
      }, 800);
    }, 550);
  };
  const retryPractice = () => sendPractice(lastText);
  const finish = () => setFinished(true);

  const completed = [];
  if (seen.includes(0)) completed.push(0);
  if (idStatus === "done") completed.push(1);
  if (backup) completed.push(2);
  if (profileStatus === "saved") completed.push(3);
  if (seen.includes(4)) completed.push(4);
  if (practice.length > 0) completed.push(5);
  if (finished || client) completed.push(6);

  const ctx = {
    m, lang, t, step, done: completed, go, next, back, toast,
    idStatus, identity, createIdentity,
    profile, setProfileField: (k, v) => setProfile(p => ({ ...p, [k]: v })), profileStatus, profileEvent, saveProfile,
    backup, setBackup, practice, practiceStatus, sendPractice, retryPractice,
    client, setClient, finished, finish, sim, toggleSim, onReset,
  };

  const atHome = step < 0;
  const Cur = atHome ? null : [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7][step];

  const langSel = (
    <div className="lang" role="group" aria-label="Idioma">
      <button className={lang === "es" ? "on" : ""} onClick={() => setLang("es")}>ES</button>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );
  const select = (i) => { setStep(i); setDrawerOpen(false); };

  const themeBtn = (
    <button className="iconbtn" onClick={onToggleTheme} title={dark ? "Tema claro" : "Tema oscuro"} aria-label="Cambiar tema">
      <Icon name={dark ? "sun" : "moon"} size={17} />
    </button>
  );

  const sidebar = <TemarioNav current={step} completed={completed} onSelect={select} />;
  const content = (
    <div className="app-main-inner">
      {atHome ? <TopicGrid completed={completed} onOpen={select} /> : <Cur ctx={ctx} />}
    </div>
  );
  const nextLink = !atHome && step < 6 ? (
    <div className="app-nav">
      <span className="spacer" />
      <button className="btn btn-quiet" onClick={() => select(step + 1)}>Siguiente tema <Icon name="arrow" size={16} /></button>
    </div>
  ) : null;

  if (m) {
    return (
      <div className="app m">
        <div className="app-mtop">
          <button className="tnav-toggle" onClick={() => setDrawerOpen(o => !o)}>
            <Icon name="menu" size={16} /> Temario
          </button>
          <span className="app-mtop-cur">{atHome ? "Resumen" : TOPICS[step].title}</span>
          <span className="app-top-spacer" />
          {themeBtn}
          {langSel}
        </div>
        {drawerOpen && <div className="tnav-drawer">{sidebar}</div>}
        <div className="app-scroll" ref={scrollRef}>
          {content}
          {nextLink}
        </div>
        {toastMsg && <div className="toast"><Icon name="check" size={15} /> {toastMsg}</div>}
      </div>
    );
  }
  return (
    <div className="app">
      <div className="app-top">
        <span className="app-brand clickable" onClick={() => select(-1)}><span className="d" /> Nostrutorial</span>
        <span className="app-top-spacer" />
        {themeBtn}
        {langSel}
        <span className="app-count">{completed.length} / 7 completados</span>
      </div>
      <div className="app-body">
        <aside className="app-rail">{sidebar}</aside>
        <div className="app-main" ref={scrollRef}>
          {content}
          {nextLink}
        </div>
      </div>
      {toastMsg && <div className="toast"><Icon name="check" size={15} /> {toastMsg}</div>}
    </div>
  );
}

/* ---------- Step B section: both frames ---------- */
function StepB({ dark, onToggleTheme }) {
  const [dkey, setDkey] = useA(0);
  const [mkey, setMkey] = useA(0);
  return (
    <section className="stepb">
      <div className="stepb-head">
        <div className="stepb-eyebrow"><span className="sec-label-line" /> Paso B · El sistema aplicado</div>
        <h2 className="stepb-h">El temario, en vivo.</h2>
        <p className="stepb-sub">Este es el track <b>Principiante</b> (más adelante: desarrollo e infraestructura). Un temario libre: entra a cualquier tema desde la barra lateral, en el orden que quieras. Crea una identidad, protégela, escribe tu perfil, prueba a publicar e inspecciona tus eventos. Móvil y escritorio comparten el mismo sistema; cada uno es independiente.</p>
      </div>
      <div className="stepb-stage">
        <div>
          <div className="frame-cap"><span className="dot" /> Escritorio · navegable
            <button className="btn btn-quiet frame-reset" onClick={() => setDkey(k => k + 1)}><Icon name="refresh" size={13} /> Reiniciar</button>
          </div>
          <div className="dframe">
            <div className="dframe-bar">
              <span className="dframe-lights"><i style={{ background: "#E1654E" }} /><i style={{ background: "#E6B23C" }} /><i style={{ background: "#7CA86A" }} /></span>
              <span className="dframe-url"><Icon name="lock" size={12} style={{ color: "var(--ok)" }} /> nostrutorial.app</span>
              <span style={{ width: 54 }} />
            </div>
            <div className="dframe-screen"><NostrutorialApp key={dkey} device="desktop" dark={dark} onToggleTheme={onToggleTheme} onReset={() => setDkey(k => k + 1)} /></div>
          </div>
        </div>
        <div>
          <div className="frame-cap"><span className="dot" /> Móvil · navegable
            <button className="btn btn-quiet frame-reset" onClick={() => setMkey(k => k + 1)}><Icon name="refresh" size={13} /> Reiniciar</button>
          </div>
          <div className="mframe">
            <div className="mframe-notch" />
            <div className="mframe-screen"><NostrutorialApp key={mkey} device="mobile" dark={dark} onToggleTheme={onToggleTheme} onReset={() => setMkey(k => k + 1)} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Root ---------- */
function Root() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffA(() => { applyTheme(t); }, [t.accent, t.headFont, t.bodyFont, t.purple, t.dark]);
  return (
    <React.Fragment>
      <Showcase dark={t.dark} onToggleTheme={() => setTweak("dark", !t.dark)} />
      <StepB dark={t.dark} onToggleTheme={() => setTweak("dark", !t.dark)} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Tema" />
        <TweakRadio label="Fondo" value={t.dark ? "Oscuro" : "Claro"} options={["Claro", "Oscuro"]} onChange={(v) => setTweak("dark", v === "Oscuro")} />
        <TweakSection label="Acento principal" />
        <TweakRadio label="Color de acción" value={t.accent} options={["Naranja", "Rojo", "Ámbar"]} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Tipografía" />
        <TweakRadio label="Títulos" value={t.headFont} options={["Literata", "Newsreader", "Helvetica"]} onChange={(v) => setTweak("headFont", v)} />
        <TweakSelect label="Cuerpo" value={t.bodyFont} options={["Helvetica", "Hanken Grotesk", "Figtree"]} onChange={(v) => setTweak("bodyFont", v)} />
        <TweakSection label="Marca" />
        <TweakToggle label="Guiño morado de Nostr" value={t.purple} onChange={(v) => setTweak("purple", v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("app")).render(<Root />);
