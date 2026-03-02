# NovelNest

Central workspace repository for NovelNest.

This repository is **not** a monorepo for application code. It is the project hub for:
- shared documentation
- local development orchestration scripts
- links to the independent frontend/backend repositories

## Repositories

- Frontend: https://github.com/Reyunix/novelnest-frontend
- Backend: https://github.com/Reyunix/novelnest-backend

## Purpose of this repo

- Keep docs in one place (`docs/`)
- Run local stack with one command (`npm run dev`)
- Manage local DB lifecycle from root (`npm run db:up`, `npm run db:down`)

## Project layout

- `docs/`: project documentation
- `dev-up.sh`: starts DB + backend + frontend
- `package.json`: root scripts for local orchestration
- `.ssl/`: local SSL artifacts (development only, not committed externally)

## Quick start (local)

1. Clone this repository.
2. Clone the app repositories into these exact folders:
   - `novelnest-frontend/`
   - `novelnest-backend/`
3. Install dependencies in both projects.
4. From this root, run:

```bash
npm run dev
```

This starts:
- PostgreSQL via Docker Compose (from backend)
- Prisma sync/generate (backend)
- Backend dev server
- Frontend dev server

## Root scripts

- `npm run dev`: full local startup (DB + backend + frontend)
- `npm run db:up`: start PostgreSQL container
- `npm run db:down`: stop PostgreSQL container

## Documentation

Current docs:
- `docs/frontend/auth-context.md`
- `docs/frontend/protected-routes.md`
- `docs/frontend/constants-organization.md`

## Notes

- Frontend and backend are intentionally independent Git repositories.
- Root `.gitignore` excludes `novelnest-frontend/` and `novelnest-backend/`.
- Keep secrets and local certificates out of public repositories.
