# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Nostrutorial is a bilingual (ES/EN) interactive onboarding tutorial for Nostr — a decentralized social protocol. It teaches users about keypairs, relays, and events by letting them simulate the full flow in a sandboxed prototype.

The repository has two parts:

- **The app** (repository root) — the real product, built with Vite + React 19 + TypeScript, managed with Bun. This is where new development happens.
- **The prototype** (`docs/`) — a self-contained, build-less design/UX reference. The app's screens, theming, and components are being ported from here. See [Reference prototype](#reference-prototype-docs) below.

## The app (root)

Toolchain: Bun (package manager + runtime), Vite (dev/build), React 19, TypeScript 6.

```bash
bun install        # install dependencies
bun run dev        # Vite dev server at http://localhost:5173
bun run build      # type-check (tsc -b) then production build to dist/
bun run preview    # serve the production build locally
bun run typecheck  # type-check only, no emit
```

`bun run build` runs `tsc -b` first, so a type error fails the build. TypeScript is configured in solution-style: `tsconfig.json` references `tsconfig.app.json` (the `src/` app, DOM libs) and `tsconfig.node.json` (Vite config). `strict` plus `noUnusedLocals`/`noUnusedParameters` are on.

There are no tests or linter configured yet.

Entry point: `index.html` → `src/main.tsx` → `src/App.tsx`.

## Reference prototype (docs/)

The prototype under `docs/` has no build step — it is a single static HTML file with in-browser Babel transpilation. Open `docs/Nostrutorial.html` directly in a browser, or serve it:

```bash
python3 -m http.server 8080 --directory docs/
# then open http://localhost:8080/Nostrutorial.html
```

It loads React 18 and Babel Standalone from unpkg, then includes all JSX files as `type="text/babel"` in load order:

```
tweaks-panel.jsx  →  components.jsx  →  showcase.jsx  →  screens.jsx  →  screens2.jsx  →  app.jsx
```

Each file must be loaded before those that depend on it, since there is no module system — everything is on the global scope.

**`app.jsx`** is the orchestrator. Key responsibilities:
- `applyTheme(t)` — mutates CSS custom properties on `document.documentElement` at runtime (no class toggling)
- `TWEAK_DEFAULTS` / `useTweaks` — reads/writes a `TweaksPanel` state object, passed to `applyTheme` on change
- `NostrutorialApp` — the app shell holding all state. It derives `completed[]` from user actions (not stored separately) and passes a `ctx` object to every screen
- Screens 0–6 are mapped by index: `[Screen1, Screen2, ..., Screen7][step]`, rendered inside the shell
- `StepB` renders two independent `NostrutorialApp` instances (desktop + mobile) inside device frames, each with its own key for resetting

**`components.jsx`** — shared UI components used across screens: `Icon` (inline SVG, stroke-based), `EventInspector`, `HoodPanel`, `ProgressMap`, `Misconception`, `OptionCard`, `StateRow`, `jsonHL`.

**`showcase.jsx`** — the Step A design-system showcase (color swatches, component specimens). Rendered before `StepB` in `Root`.

**`screens.jsx`** and **`screens2.jsx`** — one function per screen (`Screen1`–`Screen7`). Each receives only `ctx` and is otherwise stateless.

**`tokens.css`** — the single source of truth for design tokens (CSS custom properties). All component styles reference these variables.

> The three sections below document the prototype's design — they describe the patterns being ported into the app, not the current state of `src/`.

## State model

All interaction state lives in `NostrutorialApp`:

| State | What it tracks |
|---|---|
| `step` | Active screen index (−1 = home/topic grid) |
| `identity` | Generated keypair (simulated) |
| `idStatus` | `"idle" \| "generating" \| "done" \| "error"` |
| `profile` / `profileStatus` / `profileEvent` | Profile form + save flow |
| `backup` | Chosen nsec backup method (step 3 gate) |
| `practice` | Array of simulated sent events |
| `sim` | `{ s2, s4, s6 }` — error-state toggles for each interactive screen |
| `seen` | Steps visited (drives step 0, 4 completion) |
| `finished` / `client` | Step 6 completion signals |

`completed[]` is computed from these at render time and passed into both `TemarioNav` and `TopicGrid`.

## Design system conventions

- `tokens.css` defines all CSS custom properties — never hardcode colors or typography values in components
- `--accent` = warm orange (primary action), `--tech` = cyan (inspector/JSON/relay UI), `--nostr` = purple (Nostr brand nod, used sparingly)
- Dark mode is toggled by re-calling `applyTheme` with `dark: true` — which replaces the full set of CSS vars; there is no `data-theme` attribute or class
- The `TweaksPanel` (from `tweaks-panel.jsx`) manages theme overrides at design time and is not part of the final product UI

## i18n

String translations live in the `T` object in `app.jsx`. The `t(key)` helper falls back to `T.es` if the key is missing in the active language. Step names live in `STEP_NAMES` (separate from `T`). Body copy inside individual screens is written directly in Spanish and not in the translation map.
