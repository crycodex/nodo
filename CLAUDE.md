# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh `create-vite` React scaffold (React 19 + Vite 8) that has not yet diverged from the template. `src/App.jsx` still contains the default starter markup. There is no router, state management library, backend, or test setup configured yet — treat any architectural decisions as greenfield.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint over the project

There is no test runner configured.

## Structure

- `src/main.jsx` — entry point, mounts `App` into `#root`
- `src/App.jsx` — root component (currently the default template content)
- `src/App.css` / `src/index.css` — global/component styles
- `src/assets/` — static images (`hero.png`, logos)
- `public/` — files served as-is (e.g. `icons.svg`, favicon)
- `index.html` — Vite HTML entry

## Linting

ESLint config (`eslint.config.js`) is flat-config style, applies to `**/*.{js,jsx}`, and extends `js.configs.recommended`, `eslint-plugin-react-hooks` (flat recommended), and `eslint-plugin-react-refresh` (vite preset). `dist` is ignored.
