# Docs Planning

## Documentation Structure

### `README.md` (root)
- What NovelNest is
- Tech stack
- How to run everything in 5 minutes
- Links to detailed docs

### `docs/getting-started/`
- `local-setup.md`: full local installation
- `project-structure.md`: backend/frontend modules and layout
- `scripts.md`: what each script does

### `docs/backend/`
- `architecture.md`: plugins, modules, and `route -> controller -> service -> repo`
- `auth-flow.md`: `register/login/me/refresh/logout`, cookies and JWT
- `api-reference.md`: endpoints, request/response, error contracts
- `database.md`: Prisma model, migrations, `User/UserBook/UserList`
- `troubleshooting.md`: CORS, `localhost` vs `127.0.0.1`, 401, port conflicts

### `docs/frontend/`
- `architecture.md`: routes, providers, hooks
- `auth-context.md`: `AuthProvider` / `AuthContext` session lifecycle
- `pages.md`: `Login`, `Register`, `Search`, `MyBooks`
- `state-and-fetch.md`: data fetching and error handling

### `docs/product/`
- `roadmap.md`: MVP and next features
- `known-limitations.md`
- `decisions/`: short ADRs (why Fastify, why cookies+JWT, etc.)

## Execution Order

1. `README.md` (root) + `docs/getting-started/local-setup.md`
2. `docs/backend/api-reference.md` + `docs/backend/auth-flow.md`
3. `docs/backend/database.md` + `docs/frontend/auth-context.md`
4. `docs/backend/troubleshooting.md` with real issues found during development

## Maintenance Rules

- Every PR that changes endpoints/models/auth must update the affected docs.
- No doc update, no PR close.

## Optional Next Step

Create a minimal template for each planned file so documentation can be filled incrementally without losing consistency.
