# Nodo

Minimalist idea-capture tracker: capture ideas fast (text or voice), then move them through a 4-state pipeline (`lluvia_de_ideas` → `validacion` → `mvp` → `descartada`). Single-page React app, 100% client-side — no backend, no auth, no sync. All data lives in the browser's `localStorage`.

See `CLAUDE.md` for architecture details.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-checks (`tsc -b`) then produces a production build
- `npm run typecheck` — standalone type-check without bundling
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint over the project
