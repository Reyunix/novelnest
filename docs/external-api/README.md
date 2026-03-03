# External API Integration (Google Books)

This document describes how NovelNest consumes Google Books, what is currently implemented, and how to migrate safely to other providers.

## Current provider

NovelNest currently uses Google Books API (`/volumes`).

Provider-level configuration in backend env:

- `API_BOOKS_PROVIDER`
- `API_KEY_GOOGLE`
- `API_BASE_URL_GOOGLE`
- `API_VOLUME_FIELDS_GOOGLE`

## Current implementation status

The adapter layer is already implemented in backend:

- Adapter interface: `src/modules/books/adapters/books.adapter.ts`
- Google adapter: `src/modules/books/adapters/googleBooks.adapter.ts`
- Adapter selector: `src/modules/books/adapters/index.ts`

Selection behavior (`API_BOOKS_PROVIDER`):

- `google` -> uses `GoogleBooksAdapter`
- invalid value -> returns `INVALID_BOOKS_PROVIDER`

## Request flow

1. Frontend calls backend search endpoint.
2. Backend validates internal search params.
3. Backend resolves the configured books adapter.
4. Adapter translates internal params to provider query format.
5. Adapter performs fetch to provider.
6. Backend returns response to frontend.

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

## Why this contract matters

Frontend should never know provider-specific syntax (for example `intitle:` or provider `fields`).

This keeps the public app API stable when changing provider.

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
3. Map provider response to your internal DTO contract.
4. Register provider in adapter selector (`adapters/index.ts`).
5. Add adapter tests for mapping and error behavior.

## Rules to keep

- Frontend sends domain filters only.
- Backend translates to provider language.
- Backend owns provider keys and query shape.
- Frontend consumes stable internal response schema.
