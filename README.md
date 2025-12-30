# Frontend (monorepo)

This repository is a Vite + React + TypeScript monorepo (npm workspaces). It contains reusable UI packages and a frontend application.

Key points

- Workspace packages: `packages/components-shared`, `packages/ui`, `packages/utils`, `packages/frontend-app`.
- Root package scripts build and manage workspaces; most package builds use `tsc -b`.

Prerequisites

- Node.js (recommend v18+)
- npm (or yarn)

Quick start (development)

```bash
# from repo root
npm install
npm run dev:app   # runs the frontend app (workspace)
```

Build (production)

```bash
npm run build      # builds types and runs vite build
npm run build:packages   # build packages (may be required in CI)
```

Useful scripts

- `npm run dev` — start vite at root (general dev)
- `npm run dev:app` — start `packages/frontend-app` dev server
- `npm run build` — typecheck and build
- `npm run lint` / `npm run lint:fix` — eslint
- `npm run format` — prettier

Workspace packages overview

- `packages/frontend-app` — the application; run with `npm run dev:app`.
- `packages/ui` — UI primitives/components (build with `npm run build:packages` or `npm run -w @nthucscc/ui build`).
- `packages/components-shared` — small shared components and helpers.
- `packages/utils` — utility functions and scripts (i18n helpers, build helpers).

Project layout (important paths)

- `src/` — app source (App.tsx, main.tsx, pages/, components/)
- `packages/` — local reusable packages
- `public/` — static assets
- `vite.config.ts`, `tsconfig.*.json` — build configs

Environment

- Create a `.env` in project root or `packages/frontend-app` if needed to set API endpoints, e.g. `VITE_API_URL`.

Notes

- This repo uses TypeScript project references; building packages before the app is recommended in CI.
- Check `packages/*/package.json` for package-specific scripts.

If you want a tailored README for `packages/frontend-app` or CI steps, I can add them next.
