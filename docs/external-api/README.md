# External API Integration (Google Books)

This document explains which external API NovelNest currently uses, how it is consumed today, why it is currently coupled to the project schemas, and how to migrate to a different provider without breaking frontend/backend.

## Current external API

NovelNest currently uses the Google Books API:

- Base URL: `https://www.googleapis.com/books/v1/volumes?`
- Backend consumed endpoint: query search (`q`)
- Authentication: API key in query string (`key=...`)

Current backend environment variables (`novelnest-backend/.env`):
- `API_KEY`
- `BASE_URL`
- `URL_FIELD`

## Current consumption flow

1. Frontend calls backend:
- `GET /api/v1/books/search?q=<text>`

2. Backend validates query:
- `novelnest-backend/src/modules/books/books.schema.ts`
- `novelnest-backend/src/modules/books/books.service.ts` (`validateQuery`)

3. Backend builds external URL:
- `novelnest-backend/src/utils/FormatUrl.ts`
- uses `BASE_URL`, `URL_FIELD`, `API_KEY`, `q`, `startIndex`, `maxResults`, etc.

4. Backend fetches Google Books and returns the result:
- `novelnest-backend/src/modules/books/books.service.ts` (`fetchBooks`)

5. Frontend consumes typed response:
- `novelnest-frontend/src/features/books/hooks/useBookSearch.ts`
- `novelnest-frontend/src/schemas/apiResponseSchema.ts`

## Current coupling status

There is currently strong coupling to the Google Books payload shape.

## Evidence

- Backend types the response with a schema that mirrors the external payload:
  - `novelnest-backend/src/schemas/bookApiSchema.ts`
- Frontend types the same external response structure:
  - `novelnest-frontend/src/schemas/apiResponseSchema.ts`
- Backend does not transform into an internal DTO; it returns the provider shape almost directly.

## Consequence

If Google changes fields, types, or nesting, it directly impacts:
- backend service
- frontend schemas
- UI components (`BookCard`, `SearchPage`, etc.)

## How to migrate to another API (recommended strategy)

The key is to decouple via an internal contract.

## Goal

Define a stable internal domain model (DTO) and adapt each external provider to that model.

## Migration plan (phased)

1. Define internal search contract in backend
- Create, for example, `BookSearchResult` and `BookSearchItem`.
- Include only fields actually needed by UI (`id`, `title`, `authors`, `thumbnail`, `canonicalLink`, `publishedDate`, etc.).

2. Create provider adapter layer
- Add an adapter module, for example:
  - `src/modules/books/providers/googleBooks.adapter.ts`
- Responsibility:
  - input: Google payload
  - output: internal DTO (`BookSearchResult`)

3. Update service to return internal DTO
- `fetchBooks` should no longer return raw Google schema.
- Return normalized internal contract.

4. Update frontend to internal contract
- Replace `apiResponseSchema.ts` with schema matching the backend internal contract.
- Update `BookCard` and other consumers to the stable shape.

5. Add new provider without breaking UI
- Implement a second adapter:
  - `openLibrary.adapter.ts` (or chosen provider)
- Same DTO output.
- Provider selection by backend config/env.

## Technical checklist for safe migration

- [ ] Add mapping tests (provider payload -> internal DTO)
- [ ] Keep `/api/v1/books/search` route unchanged
- [ ] Version response if you introduce breaking changes (`/api/v2/...`)
- [ ] Add fallback handling for optional fields in adapter
- [ ] Document final contract in backend and frontend

## Architectural recommendation

Keep this rule:

- External provider -> **adapter** -> backend internal contract -> frontend

Do not expose external payload directly to frontend.

This reduces maintenance cost and makes provider migration feasible without rewriting the whole app.
