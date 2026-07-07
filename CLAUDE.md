# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nodo is a minimalist idea-capture tracker: capture ideas fast (text or voice), then move them through a 4-state pipeline (`lluvia_de_ideas` → `validacion` → `mvp` → `descartada`, transitions unrestricted). Full spec: `.claude/prd.md`. Single-page React app, 100% client-side — no backend, no auth, no sync. All data lives in the browser's `localStorage`.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint over the project

There is no test runner configured. Verification is manual (`npm run dev` + exercising the app) plus lint/build as automated gates.

## Architecture

**Data model:** a single `Idea` entity (`id`, `titulo?`, `idea?`, `problema?`, `lugar?`, `estado`, `fechaCreacion`, `fechaActualizacion`) — see `.claude/prd.md` §6 for the full shape and the enum of valid `estado` values.

**State — two independent Zustand stores, each with its own `persist` localStorage key:**
- `src/store/ideasStore.js` (key `nodo-ideas`) — the `ideas` array plus `addIdea`, `updateIdea`, `updateEstado`, `deleteIdea`, `importIdeas`, `resetAll`.
- `src/store/settingsStore.js` (key `nodo-settings`) — `theme` and `voiceLang`.

Kept separate deliberately: resetting idea data (`resetAll`) must never wipe the user's theme/language preferences.

**Storage abstraction rule:** `persist` middleware handles all normal read/write during app usage — components call store actions, never `localStorage` directly. `src/services/storageService.js` only exists for JSON export/import and full reset; it validates imported data (`validateIdeas`) and then always routes through store actions (`useIdeasStore.getState().importIdeas(...)`), never writing to `localStorage` directly, to avoid the two layers diverging. `src/services/ideaFactory.js` builds a new `Idea` with defaults (`createIdea`) and exports the `ESTADO_IDEA` enum used throughout the app.

**Routing (`react-router-dom`, declarative, no loaders):** `src/app/router.jsx` defines 3 routes under a shared `src/app/Layout.jsx` shell — Dashboard (`/`), Stats (`/stats`), Settings (`/settings`). `Layout` also mounts `IdeaCaptureModal` once (not per-page) so the capture FAB is available everywhere, and calls `useTheme()` once to sync `settingsStore.theme` onto `document.documentElement.dataset.theme`.

**Feature folders under `src/features/`** — each is self-contained UI + logic for one PRD feature:
- `ideas/` — capture form, modal, voice dictation button.
- `kanban/` — the drag-and-drop board (`@dnd-kit`). `kanbanConfig.js` is the single source of truth for column order, labels, and per-state colors — read from here rather than hardcoding `estado` strings/colors elsewhere. `IdeaCard` also exposes a `<select>` state-change control as a non-drag accessible fallback.
- `dashboard/`, `stats/`, `settings/` — one page component each, composing smaller pieces. `stats/statsSelectors.js` holds pure functions (`getDistribution`, `getConversionRate`, `getDiscardRate`, `getCountsByPeriod`) that derive stats from the raw `ideas` array — keep new stats math here, not inline in JSX.

**Shared primitives:** `src/components/ui/` (Button, Modal, ConfirmDialog, Badge, TextField, TextArea) and `src/hooks/` (`useSpeechRecognition` — wraps `SpeechRecognition`/`webkitSpeechRecognition`, exposes `isSupported` for graceful degradation on browsers without voice support; `useTheme`; `useIdeaFilters` — dashboard search/filter).

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (configured in `vite.config.js`). Design tokens (colors for light/dark, one accent per pipeline state) are defined in `src/index.css` using `@theme` plus a `[data-theme='dark']` override block — Tailwind utilities like `bg-state-mvp` or `text-text-muted` are generated directly from these `--color-*` custom properties. When adding new themed UI, extend the tokens in `index.css` rather than hardcoding hex colors.

**Gotcha:** percentage-height children inside a flex container need an ancestor with a *definite* height in the flow — `align-items: flex-end` alone leaves siblings at auto height, which makes `height: N%` on a child resolve to 0. `SimpleBarChart.jsx` uses `h-full` + `justify-end` instead of relying on `items-end` for this reason.

## Linting

ESLint config (`eslint.config.js`) is flat-config style, applies to `**/*.{js,jsx}`, and extends `js.configs.recommended`, `eslint-plugin-react-hooks` (flat recommended), and `eslint-plugin-react-refresh` (vite preset). `dist` is ignored.
