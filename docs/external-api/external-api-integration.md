# External API Integration (Google Books)

This document describes how NovelNest consumes Google Books, what is already implemented, how to run validation checks, and what is still pending.

## Current provider

NovelNest currently uses Google Books API (`/volumes`).

Provider-level configuration in backend env:

- `API_BOOKS_PROVIDER`
- `API_KEY_GOOGLE`
- `API_BASE_URL_GOOGLE`
- `API_VOLUME_FIELDS_GOOGLE`

## Current implementation status

Implemented in backend:

- Adapter interface: `src/modules/books/adapters/books.adapter.ts`
- Google provider adapter: `src/modules/books/adapters/google/googleBooks.adapter.ts`
- Provider response schema: `src/modules/books/adapters/google/googleBooks.api.schema.ts`
- Adapter selector: `src/modules/books/adapters/index.ts`
- Internal DTO: `src/modules/books/books.dto.ts`

Provider selection behavior (`API_BOOKS_PROVIDER`):

- `google` -> uses `GoogleBooksAdapter`
- invalid value -> returns `INVALID_BOOKS_PROVIDER`

## Request flow

1. Frontend calls backend search endpoint.
2. Backend validates internal search params.
3. Backend resolves configured provider adapter.
4. Adapter translates internal params to provider query format.
5. Adapter validates provider payload.
6. Adapter maps provider payload to internal DTO.
7. Backend returns internal DTO to client.

Current app endpoint:

- `GET /api/v1/books/search`

## Internal search contract (backend API)

Frontend sends domain params (not provider syntax):

- `q`
- `title`
- `author`
- `subject`
- `isbn`
- `sort` (`relevance | newest`)
- `page` (>= 1)
- `limit` (1..40)
- `printType` (`all | books | magazines`)
- `availability` (`partial | full | free-ebooks | paid-ebooks | ebooks`)
- `download` (`epub`)
- `projection` (`full | lite`)

At least one search term is required: `q`, `title`, `author`, `subject`, or `isbn`.

## Mapping to Google Books

NovelNest-to-Google mapping:

- `title` -> `intitle:<value>` in provider `q`
- `author` -> `inauthor:<value>` in provider `q`
- `subject` -> `subject:<value>` in provider `q`
- `isbn` -> `isbn:<value>` in provider `q`
- `q` -> plain text term in provider `q`
- `sort` -> `orderBy`
- `page` + `limit` -> `startIndex` + `maxResults`
- `availability` -> `filter`
- `download` -> `download`
- `printType` -> `printType`
- `projection` -> `projection`

Provider-only fields never come from frontend:

- `key`
- `fields`

## Manual checks (required)

Run these checks after any provider/adapter change.

1. Provider selection check
- Set `API_BOOKS_PROVIDER=google`.
- Call `/api/v1/books/search?q=malaz`.
- Expected: `200` and response with `provider: "google"`.

2. Invalid provider check
- Set `API_BOOKS_PROVIDER=invalid_provider`.
- Call `/api/v1/books/search?q=malaz`.
- Expected: domain error `INVALID_BOOKS_PROVIDER`.

3. Query validation check
- Call `/api/v1/books/search` without any search term.
- Expected: domain error `INVALID_QUERY_PARAMETER`.

4. DTO contract check
- Successful response must include:
  - `provider`
  - `totalItems`
  - `page`
  - `limit`
  - `items[]` with internal DTO fields

5. Pagination propagation check
- Call `/api/v1/books/search?q=malaz&page=2&limit=10`.
- Expected in response DTO: `page=2`, `limit=10`.

## Pending to apply

- Add adapter integration tests for mapping and invalid provider scenarios.
- Add provider timeout + cancellation (`AbortController`) and clear error mapping.
- Add retry policy for transient provider failures.
- Add response caching for repeated search queries.
- Add structured logs/metrics by provider (latency, error rate, status distribution).

## Migration strategy to another external API

### Goal

Use one dedicated adapter per provider while keeping one stable internal contract.

### Recommended shape

- `BooksAdapter` interface (internal contract)
- `GoogleBooksAdapter` implementation
- Future adapters (`OpenLibraryAdapter`, etc.) with same output DTO

### Steps

1. Keep `/api/v1/books/search` contract stable.
2. Implement new adapter class using `BooksAdapter`.
3. Validate provider payload with provider-specific schema.
4. Map provider response to internal DTO contract.
5. Register provider in selector (`adapters/index.ts`).
6. Add adapter tests for mapping and error behavior.

## Rules to keep

- Frontend sends domain filters only.
- Backend translates to provider language.
- Backend owns provider keys and query shape.
- Frontend consumes stable internal response schema.
