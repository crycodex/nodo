# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nodo is a minimalist idea-capture tracker: capture ideas fast (text or voice), then move them through a 4-state pipeline (`lluvia_de_ideas` → `validacion` → `mvp` → `descartada`, transitions unrestricted). Full spec: `.claude/prd.md`. Single-page React app, 100% client-side — no backend, no auth, no sync. All data lives in the browser's `localStorage`. Written in TypeScript (strict) end to end — there are no `.js`/`.jsx` files under `src/`.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-checks (`tsc -b`) then produces a production build; a type error fails the build
- `npm run typecheck` — `tsc -b --noEmit`, standalone type-check without bundling
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint (typescript-eslint, type-aware) over the project

There is no test runner configured. Verification is `npm run typecheck` + `npm run lint` + `npm run build` as automated gates, plus manual exercising via `npm run dev`.

## TypeScript setup

Project-references split: `tsconfig.json` (root, references-only) → `tsconfig.app.json` (covers `src/`, strict + `noUncheckedIndexedAccess`/`noUnusedLocals`/etc., `moduleResolution: bundler`, `verbatimModuleSyntax: true`) and `tsconfig.node.json` (covers `vite.config.ts`). `verbatimModuleSyntax` means type-only imports must use `import type { X } from ...` — mixing a type and a value import from the same module needs `import { type X, y } from ...` or two separate import statements. Web Speech API types (`SpeechRecognition`, `SpeechRecognitionEvent`) come from the `@types/dom-speech-recognition` devDependency (not in default `lib.dom`), listed in `tsconfig.app.json`'s `types` array.

## Architecture

**Data model:** a single `Idea` interface (`id`, `titulo`, `idea`, `problema`, `lugar`, `estado`, `fechaCreacion`, `fechaActualizacion`) defined in `src/services/ideaFactory.ts`, along with the `EstadoIdea` union type and `ESTADO_IDEA` const object it's derived from, and `IdeaPartial` (the input shape for `createIdea`). This is the canonical type source — import `Idea`/`EstadoIdea`/`IdeaPartial` from here everywhere else via `import type`. See `.claude/prd.md` §6 for the full field-level spec.

**State — two independent Zustand stores, each with its own `persist` localStorage key:**
- `src/store/ideasStore.ts` (key `nodo-ideas`) — the `ideas: Idea[]` array plus `addIdea`, `updateIdea`, `updateEstado`, `deleteIdea`, `importIdeas`, `resetAll`. Exports `ImportMode` (`'replace' | 'merge'`).
- `src/store/settingsStore.ts` (key `nodo-settings`) — `theme` (`Theme = 'light' | 'dark'`) and `voiceLang`.

Kept separate deliberately: resetting idea data (`resetAll`) must never wipe the user's theme/language preferences. Both stores use the `create<T>()(persist(...))` double-call pattern (not a single call) — this is required for correct type inference of `set`/`get` under strict mode with Zustand's `persist` middleware; don't collapse it back to a single call.

**Storage abstraction rule:** `persist` middleware handles all normal read/write during app usage — components call store actions, never `localStorage` directly. `src/services/storageService.ts` only exists for JSON export/import and full reset; it validates imported data (`validateIdeas`, which takes `unknown` and narrows) and then always routes through store actions (`useIdeasStore.getState().importIdeas(...)`), never writing to `localStorage` directly, to avoid the two layers diverging.

**Routing (`react-router-dom`, declarative, no loaders):** `src/app/router.tsx` defines 3 routes under a shared `src/app/Layout.tsx` shell — Dashboard (`/`), Stats (`/stats`), Settings (`/settings`). `Layout` also mounts `IdeaCaptureModal` once (not per-page) so the capture FAB is available everywhere, and calls `useTheme()` once to sync `settingsStore.theme` onto `document.documentElement.dataset.theme`.

**Feature folders under `src/features/`** — each is self-contained UI + logic for one PRD feature:
- `ideas/` — capture form, modal, voice dictation button.
- `kanban/` — the drag-and-drop board (`@dnd-kit`). `kanbanConfig.ts` is the single source of truth for column order, labels, and per-state colors (exports `ESTADOS: EstadoConfig[]` and `getEstadoConfig`) — read from here rather than hardcoding `estado` strings/colors elsewhere. The board is horizontal-only at all breakpoints (`flex` row + `overflow-x-auto`, no vertical-stack variant); it uses CSS scroll-snap (`snap-x snap-mandatory` on the board, `snap-start` per column) plus a `.kanban-scroll` class (thin-scrollbar styling, defined in `index.css`) for the horizontal-scroll affordance. `IdeaCard` also exposes a `<select>` state-change control as a non-drag accessible fallback. `@dnd-kit`'s drag events are typed via `DragEndEvent`; ids read back off `event.over?.id`/`event.active.id` need an explicit cast/`String()` since dnd-kit's `UniqueIdentifier` is `string | number`.
- `dashboard/`, `stats/`, `settings/` — one page component each, composing smaller pieces. `stats/statsSelectors.ts` holds pure functions (`getDistribution`, `getConversionRate`, `getDiscardRate`, `getCountsByPeriod`) that derive stats from the raw `ideas` array — keep new stats math here, not inline in JSX.

**Shared primitives:** `src/components/ui/` (Button, Modal, ConfirmDialog, Badge, TextField, TextArea) — prop types extend the relevant native `React.*HTMLAttributes<...>` interface rather than hand-rolling attribute lists. `src/hooks/` (`useSpeechRecognition` — wraps `SpeechRecognition`/`webkitSpeechRecognition`, exposes `isSupported` for graceful degradation on browsers without voice support; `useTheme`; `useIdeaFilters` — dashboard search/filter).

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (configured in `vite.config.ts`). Design tokens (colors for light/dark, one accent per pipeline state) are defined in `src/index.css` using `@theme` plus a `[data-theme='dark']` override block — Tailwind utilities like `bg-state-mvp` or `text-text-muted` are generated directly from these `--color-*` custom properties. When adding new themed UI, extend the tokens in `index.css` rather than hardcoding hex colors.

**Gotcha:** percentage-height children inside a flex container need an ancestor with a *definite* height in the flow — `align-items: flex-end` alone leaves siblings at auto height, which makes `height: N%` on a child resolve to 0. `SimpleBarChart.tsx` uses `h-full` + `justify-end` instead of relying on `items-end` for this reason.

## Linting

ESLint config (`eslint.config.js`) is flat-config style, applies to `**/*.{ts,tsx}`, and extends `js.configs.recommended`, `typescript-eslint`'s `recommendedTypeChecked` (type-aware rules — needs `projectService: true` + `tsconfigRootDir` in `languageOptions.parserOptions`, so lint is slower than a plain-JS setup but catches things like unsafe `any` access and floating promises), `eslint-plugin-react-hooks` (flat recommended), and `eslint-plugin-react-refresh` (vite preset, with `allowConstantExport: true`). `dist` is ignored. Because rules are type-checked, promise-returning functions can't be passed directly to void-expecting event handler props — wrap with `(event) => void handler(event)` (see `DataManagement.tsx`'s file-input `onChange` for the pattern).
