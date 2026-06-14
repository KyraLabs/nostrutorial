# Implementation Documentation

This directory tracks how the Nostrutorial application is built, phase by phase.

The interactive prototype under `docs/Nostrutorial.html` is the design and UX reference. These documents describe the real application (Vite + React + TypeScript, managed with Bun) that is being built at the repository root, and the order in which we get there.

## How this is organized

Work is split into **phases**. Each phase is a self-contained milestone with a clear goal and a Definition of Done. Within a phase, work is broken into **small, independently verifiable tasks** — each task lists its goal, the dependencies it introduces, the files it touches, and how to verify it is complete.

One Markdown file per phase: `phase-<n>-<slug>.md`.

## Document conventions

- Each phase file opens with its **Goal**, **Prerequisites**, and **Definition of Done**.
- Tasks are numbered and ordered by recommended execution sequence.
- Every task has a **Verification** section — a command to run or an observable result.
- A task should be small enough to complete and commit on its own.
- Commits follow Conventional Commits.
- All documentation, code, and commit messages are written in English.

## Phases

| #  | Phase                  | Status      | Document |
|----|------------------------|-------------|----------|
| 1  | Foundations            | Planned     | [phase-1-foundations.md](./phase-1-foundations.md) |

Later phases (design system & theming, app shell & navigation, tutorial screens, i18n, Nostr integration) will be added as the roadmap is refined. This table is the single source of truth for phase status; update the **Status** column as phases move through `Planned -> In progress -> Done`.

## Status legend

- **Planned** — documented, not started.
- **In progress** — tasks are being executed.
- **Done** — all tasks complete and Definition of Done met.
