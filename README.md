# 📚 NovelNest

Central workspace repository for NovelNest.

This repository is a project hub (docs + local orchestration), not a monorepo for app source code.

## Repositories

- Frontend: https://github.com/Reyunix/novelnest-frontend
- Backend: https://github.com/Reyunix/novelnest-backend

## Scope of this repo

- Shared documentation (`docs/`)
- Local startup scripts (`dev-up.sh`)
- Root helper scripts (`npm run dev`, `npm run db:up`, `npm run db:down`)

## Project layout

- `docs/`: cross-project documentation
- `dev-up.sh`: starts DB + backend + frontend
- `package.json`: root scripts
- `.ssl/`: optional local SSL artifacts (legacy/optional)

## Prerequisites

- Bun or npm
- Docker
- Git

## Quick start (local)

1. Clone this workspace repository.
2. Clone app repos into these exact directories:
   - `novelnest-frontend/`
   - `novelnest-backend/`
3. Install dependencies in both projects.
4. Configure env files (`novelnest-backend/.env`, `novelnest-frontend/.env.local`).
5. Start everything from root:

```bash
npm run dev
```

This starts:
- PostgreSQL (Docker Compose from backend)
- Prisma schema sync/generate (backend)
- Backend dev server
- Frontend dev server

## Root scripts

- `npm run dev`: full local startup (DB + backend + frontend)
- `npm run db:up`: start PostgreSQL only
- `npm run db:down`: stop PostgreSQL

## Current local networking setup

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5433`

Use `localhost` consistently (avoid mixing with `127.0.0.1`) to prevent cookie/session issues.

## Documentation

- `docs/frontend/auth-context.md`
- `docs/frontend/protected-routes.md`
- `docs/frontend/constants-organization.md`

## Notes

- Frontend and backend are intentionally independent Git repositories.
- Root `.gitignore` excludes `novelnest-frontend/` and `novelnest-backend/`.
- Do not commit secrets (`.env`, private keys, local certs).
