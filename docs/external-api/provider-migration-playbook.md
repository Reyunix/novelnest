# Provider Migration Playbook

This playbook describes the exact process to add a new external books provider without breaking the public NovelNest API contract.

## Scope

Applies to backend books search integration under:

- `src/modules/books/adapters/`
- `src/modules/books/books.dto.ts`
- `src/modules/books/books.service.ts`

## Core rule

Do not expose provider payloads to frontend.

Always follow this pipeline:

1. Provider response validation (provider schema)
2. Mapping to internal DTO (`BooksSearchResponseDto`)
3. Return DTO from route/service

## Prerequisites

- Existing provider is working (`google`)
- `BooksAdapter` contract exists
- Error catalog supports provider configuration errors (`INVALID_BOOKS_PROVIDER`)

## Step-by-step migration

### 1. Add provider folder

Create a provider-specific folder:

- `src/modules/books/adapters/<provider>/`

Example for Open Library:

- `src/modules/books/adapters/openlibrary/`

### 2. Add provider payload schema

Create provider schema file with explicit naming:

- `<provider>.api.schema.ts`

Example:

- `openLibrary.api.schema.ts`
- exports: `OpenLibraryApiResponseSchema`, `OpenLibraryApiResponse`

Use Zod to validate only required fields from provider payload.

### 3. Implement provider adapter

Create adapter class implementing `BooksAdapter`:

- `<provider>.adapter.ts`

Required behavior:

- Build provider URL from internal query (`SearchBookQuery`)
- Fetch provider endpoint
- Validate provider payload using provider schema
- Map provider payload -> `BooksSearchResponseDto`
- Validate mapped DTO (`BooksSearchResponseDtoSchema`) before returning

### 4. Register provider in selector

Update:

- `src/modules/books/adapters/index.ts`

Add switch branch:

- `case "<provider>": return <provider>Adapter`

Keep default strict:

- throw `INVALID_BOOKS_PROVIDER` for unsupported value

### 5. Add env keys

Add provider-specific env keys in backend `.env`.

Naming convention:

- `API_KEY_<PROVIDER>`
- `API_BASE_URL_<PROVIDER>`
- `API_VOLUME_FIELDS_<PROVIDER>` (if applicable)

Selector key:

- `API_BOOKS_PROVIDER=<provider>`

### 6. Keep internal DTO stable

Do not change frontend-facing response shape unless versioning.

Current expected contract:

- `provider`
- `totalItems`
- `page`
- `limit`
- `items[]` (internal fields)

### 7. Manual validation checks

1. Valid provider branch
- Set `API_BOOKS_PROVIDER=<provider>`
- Call `GET /api/v1/books/search?q=test`
- Expect `200` with internal DTO

2. Invalid provider branch
- Set `API_BOOKS_PROVIDER=invalid_provider`
- Expect `INVALID_BOOKS_PROVIDER`

3. Query validation
- Call without search terms
- Expect `INVALID_QUERY_PARAMETER`

4. DTO integrity
- Verify response always matches `BooksSearchResponseDto`

5. Pagination propagation
- Verify `page` and `limit` in response match request params

## Testing requirements (minimum)

- Adapter mapping test:
  - provider payload fixture -> DTO snapshot/assertions
- Invalid provider selector test
- Route integration test:
  - `/api/v1/books/search` returns internal DTO shape

## Rollback plan

If new provider fails in production:

1. Set `API_BOOKS_PROVIDER=google`
2. Restart backend
3. Verify `/api/v1/books/search` health check

No frontend rollback should be needed if DTO contract stayed stable.

## Definition of done

- New adapter registered in selector
- Provider payload validated with Zod
- DTO mapping implemented and validated
- Manual checks passed
- Tests added
- Docs updated (`external-api-integration.md` + this playbook)
