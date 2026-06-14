# Phase 1 — Foundations

## Goal

Establish the project's engineering foundation: code quality tooling, automated git hooks, a ready-to-use test runner, continuous integration, and base ergonomics (path aliases, environment variables). After this phase, every change is automatically linted, formatted, type-checked, and validated before it can be committed or merged.

This phase adds **tooling only**. It does not implement product features.

## Prerequisites

- The Vite + React 19 + TypeScript scaffold exists at the repository root (`package.json`, `vite.config.ts`, `tsconfig*.json`, `src/`).
- Bun is installed (`bun --version` >= 1.3).
- `bun run dev`, `bun run build`, and `bun run typecheck` already work.

## Recommended execution order

The tasks build on each other. Execute them in order:

1. Prettier
2. ESLint
3. EditorConfig
4. Path aliases
5. Environment variables
6. Testing setup (Vitest + React Testing Library)
7. Husky + lint-staged
8. commitlint
9. npm scripts consolidation
10. CI with GitHub Actions

Each task is committable on its own. Suggested commit type shown per task.

## Conventions for this phase

- All dev tooling is installed as `devDependencies` (`bun add -d ...`).
- Pin nothing manually; let Bun resolve current versions and rely on the lockfile.
- Prefer flat, modern config formats (ESLint flat config, Prettier defaults with minimal overrides).
- Do not introduce a tool's config without a one-line rationale comment where the format allows it.

---

## Task 1 — Prettier

**Goal:** One canonical formatter for all source, config, and Markdown files.

**Dev dependencies:** `prettier`

**Steps:**
1. `bun add -d prettier`
2. Create `.prettierrc.json` at the root with the project's formatting rules.
3. Create `.prettierignore` (ignore `dist`, `node_modules`, `bun.lock`, and the `docs/` prototype so the legacy build-less code is left untouched).
4. Add scripts: `"format": "prettier --write ."` and `"format:check": "prettier --check ."`.

**Files:**
- `.prettierrc.json` — formatting rules (see below).
- `.prettierignore`
- `package.json` — scripts.

**Suggested `.prettierrc.json`:**
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**Suggested `.prettierignore`:**
```
dist
node_modules
bun.lock
docs/Nostrutorial.html
docs/nostrutorial
```

**Verification:**
- `bun run format:check` runs and reports formatting status without crashing.
- `bun run format` rewrites files consistently (a second run reports no changes).

**Commit:** `chore: add prettier`

---

## Task 2 — ESLint

**Goal:** Static analysis for TypeScript and React, using ESLint flat config, with formatting concerns delegated to Prettier (no rule conflicts).

**Dev dependencies:** `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `eslint-config-prettier`

**Steps:**
1. Install the dependencies above.
2. Create `eslint.config.js` (flat config) extending `@eslint/js` recommended, `typescript-eslint` recommended, the React Hooks rules, and the React Refresh rule for Vite.
3. Add `eslint-config-prettier` **last** in the config array so it disables any stylistic rules that conflict with Prettier.
4. Ignore `dist` and the `docs/` prototype.
5. Add scripts: `"lint": "eslint ."` and `"lint:fix": "eslint . --fix"`.

**Files:**
- `eslint.config.js`
- `package.json` — scripts.

**Reference flat config shape:**
```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist", "docs"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  prettier,
);
```

**Verification:**
- `bun run lint` runs clean against the current `src/`.
- Introducing an unused variable in `src/App.tsx` makes `bun run lint` fail; removing it makes it pass again.

**Risk note:** TypeScript 6 and Vite 8 are very recent. `typescript-eslint` may print a "supported TypeScript versions" warning. Treat as non-blocking unless it errors; if it does, document the resolved versions here.

**Commit:** `chore: add eslint`

---

## Task 3 — EditorConfig

**Goal:** Consistent editor behavior (charset, indentation, final newline) across machines, independent of Prettier.

**Dev dependencies:** none.

**Steps:**
1. Create `.editorconfig` at the root.

**Files:**
- `.editorconfig`

**Suggested content:**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

**Verification:**
- File exists and an EditorConfig-aware editor picks up 2-space indentation.

**Commit:** `chore: add editorconfig`

---

## Task 4 — Path aliases

**Goal:** Clean absolute imports via `@/` mapped to `src/`, avoiding `../../..` chains.

**Dev dependencies:** none (manual config; avoids adding `vite-tsconfig-paths`).

**Steps:**
1. In `vite.config.ts`, add a `resolve.alias` entry mapping `@` to the `src` directory (use `node:path` + `import.meta.dirname`).
2. In `tsconfig.app.json`, add `"baseUrl": "."` and `"paths": { "@/*": ["./src/*"] }` so the TypeScript language server and `tsc` resolve the alias.

**Files:**
- `vite.config.ts`
- `tsconfig.app.json`

**Reference (`vite.config.ts`):**
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
```

**Verification:**
- Change an import in `src/main.tsx` from `"./App.tsx"` to `"@/App.tsx"`.
- `bun run typecheck` passes and `bun run build` succeeds.

**Commit:** `chore: add @ path alias`

---

## Task 5 — Environment variables

**Goal:** A typed, documented pattern for environment configuration using Vite's `import.meta.env`.

**Dev dependencies:** none.

**Steps:**
1. Create `.env.example` documenting every variable the app reads (all prefixed `VITE_` to be exposed to the client). Seed it with a placeholder such as the default Nostr relay list once needed.
2. Confirm `.env.local` and `*.local` are git-ignored (already covered by the root `.gitignore`).
3. Type the variables in `src/vite-env.d.ts` by declaring `ImportMetaEnv`.

**Files:**
- `.env.example`
- `src/vite-env.d.ts` — extend with the env interface.

**Reference (`src/vite-env.d.ts`):**
```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_RELAYS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Verification:**
- `bun run typecheck` passes.
- `import.meta.env.VITE_DEFAULT_RELAYS` autocompletes and is typed as `string`.
- `.env.example` is committed; no real `.env` file is committed.

**Commit:** `chore: add env config pattern`

---

## Task 6 — Testing setup (Vitest + React Testing Library)

**Goal:** A working test runner wired to the Vite config, with DOM matchers, so future tasks can ship tests. Includes one smoke test to prove the pipeline.

**Dev dependencies:** `vitest`, `@vitejs/plugin-react` (already present), `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

**Steps:**
1. Install the dependencies above.
2. Add a `test` block to `vite.config.ts` (reference `vitest/config`) with `environment: "jsdom"`, `globals: true`, and a `setupFiles` entry.
3. Create `src/test/setup.ts` importing `@testing-library/jest-dom/vitest`.
4. Add `"vitest"` types and the setup so matchers are typed.
5. Write `src/App.test.tsx` rendering `<App />` and asserting the heading renders.
6. Add scripts: `"test": "vitest run"` and `"test:watch": "vitest"`.

**Files:**
- `vite.config.ts` — `test` block.
- `src/test/setup.ts`
- `src/App.test.tsx`
- `package.json` — scripts.

**Reference (`vite.config.ts` test block):**
```ts
/// <reference types="vitest/config" />
// ...
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: false,
  },
});
```

**Reference smoke test:**
```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "@/App";

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /nostrutorial/i })).toBeInTheDocument();
  });
});
```

**Verification:**
- `bun run test` runs the smoke test and reports 1 passing test.
- `bun run typecheck` still passes (test files included via `tsconfig.app.json`).

**Risk note:** Vitest must be compatible with the installed Vite 8. Install the latest Vitest and confirm; if a peer-range mismatch appears, record the working versions here.

**Commit:** `chore: add vitest and testing-library`

---

## Task 7 — Husky + lint-staged

**Goal:** Run lint and format only on staged files at commit time, keeping every commit clean and fast.

**Dev dependencies:** `husky`, `lint-staged`

**Steps:**
1. Install the dependencies above.
2. Initialize Husky: `bunx husky init` (creates `.husky/` and a `prepare` script).
3. Replace the generated `.husky/pre-commit` contents with `bunx lint-staged`.
4. Add a `lint-staged` config (in `package.json` or `.lintstagedrc.json`) running ESLint `--fix` and Prettier `--write` on staged files.
5. Ensure `"prepare": "husky"` is in `package.json` scripts so hooks install on `bun install`.

**Files:**
- `.husky/pre-commit`
- `package.json` — `prepare` script and `lint-staged` config (or `.lintstagedrc.json`).

**Suggested `lint-staged` config:**
```json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{js,json,css,md}": ["prettier --write"]
}
```

**Verification:**
- Stage a file with a lint error and a formatting issue, then commit: the hook auto-fixes formatting and blocks the commit on the unfixable lint error.
- A clean staged change commits without friction.

**Commit:** `chore: add husky and lint-staged`

---

## Task 8 — commitlint (Conventional Commits)

**Goal:** Enforce Conventional Commits on the commit message via a `commit-msg` hook.

**Dev dependencies:** `@commitlint/cli`, `@commitlint/config-conventional`

**Steps:**
1. Install the dependencies above.
2. Create `commitlint.config.js` extending `@commitlint/config-conventional`.
3. Add a `.husky/commit-msg` hook running `bunx commitlint --edit $1`.

**Files:**
- `commitlint.config.js`
- `.husky/commit-msg`

**Reference (`commitlint.config.js`):**
```js
export default { extends: ["@commitlint/config-conventional"] };
```

**Verification:**
- A commit message like `wip` is rejected.
- A message like `chore: add commitlint` is accepted.

**Commit:** `chore: add commitlint`

---

## Task 9 — Consolidate npm scripts

**Goal:** A complete, discoverable script surface so contributors and CI use the same commands.

**Dev dependencies:** none.

**Steps:**
1. Review `package.json` scripts and ensure the full set is present and consistent.

**Target script set:**
```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "typecheck": "tsc -b --noEmit",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "prepare": "husky"
}
```

**Verification:**
- Each script runs without "missing binary" errors.

**Commit:** `chore: consolidate package scripts`

---

## Task 10 — CI with GitHub Actions

**Goal:** Every push and pull request is validated with the same checks developers run locally, using Bun.

**Dev dependencies:** none.

**Steps:**
1. Create `.github/workflows/ci.yml`.
2. Use `oven-sh/setup-bun` to install Bun, `bun install --frozen-lockfile` to install from the lockfile, then run typecheck, lint, format check, test, and build.

**Files:**
- `.github/workflows/ci.yml`

**Reference workflow:**
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun run typecheck
      - run: bun run lint
      - run: bun run format:check
      - run: bun run test
      - run: bun run build
```

**Verification:**
- Push a branch and open a PR: the `quality` job runs all steps and passes on a clean tree.
- A lint or type error fails the job.

**Commit:** `ci: add github actions quality workflow`

---

## Dependencies added in this phase

All `devDependencies`:

| Tool | Packages |
|------|----------|
| Prettier | `prettier` |
| ESLint | `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `eslint-config-prettier` |
| Testing | `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` |
| Git hooks | `husky`, `lint-staged` |
| Commit lint | `@commitlint/cli`, `@commitlint/config-conventional` |

No runtime `dependencies` are added in this phase.

## Definition of Done

- [ ] `bun run format:check` passes on a clean tree.
- [ ] `bun run lint` passes on a clean tree.
- [ ] `bun run typecheck` passes.
- [ ] `bun run test` runs and the smoke test passes.
- [ ] `bun run build` succeeds.
- [ ] Committing runs Husky: lint-staged fixes staged files and commitlint validates the message.
- [ ] The `@/` alias resolves in both the editor and `tsc`.
- [ ] `.env.example` documents env variables; no real `.env` is committed.
- [ ] CI runs all checks on push and pull request and passes on `main`.
- [ ] Root `CLAUDE.md` is updated to reflect the new commands and tooling.
