# Future Implementations

This file tracks pending features and technical improvements for NovelNest.

## Priority 1 (Core Product)

- [ ] **External API adapter architecture (Google Books -> provider adapters)**
  - Create a provider-agnostic contract (e.g. `BooksAdapter`).
  - Move Google Books logic into `GoogleBooksAdapter`.
  - Keep backend route/service contract stable (`/api/v1/books/search`).
  - Keep frontend schema unchanged by mapping provider response to internal DTO.
  - Add one integration test to guarantee adapter output shape.

- [ ] **User books collection (authenticated CRUD)**
  - `GET /api/v1/users/me/books`
  - `POST /api/v1/users/me/books`
  - `PATCH /api/v1/users/me/books/:entryId`
  - `DELETE /api/v1/users/me/books/:entryId`
  - Validate ownership in every mutation.

- [ ] **Default user lists behavior**
  - Define default lists created at signup (e.g. Want to Read, Reading, Read).
  - Enforce list uniqueness per user.
  - Decide if `isDefault` remains in schema or gets replaced by fixed system lists.

## Priority 2 (Reliability and Security)

- [ ] **Auth hardening**
  - Refresh-token rotation.
  - Device/session invalidation on logout-all.
  - Standardize cookie options by environment (dev vs production).

- [ ] **Error model normalization**
  - Ensure all modules use the same success/error catalog shape.
  - Add explicit 400/401/403/404/409/422/502 mappings where needed.

- [ ] **Rate limiting and external API protection**
  - Add per-IP/user limit for search endpoints.
  - Add timeout/retry policy for provider requests.
  - Add basic response cache for repeated queries.

## Priority 3 (Developer Experience)

- [ ] **Automated tests**
  - Unit tests for auth, books service, and schemas.
  - Integration tests for protected routes and cookie auth flow.
  - Frontend tests for auth context + protected route behavior.

- [ ] **CI pipeline**
  - Lint + typecheck + test in PR workflow.
  - Optional preview build for frontend.

- [ ] **Seed and demo data**
  - Simple Prisma seed script for local demos.
  - Test users and sample user-book entries.

## Priority 4 (Product Features)

- [ ] **Book detail page**
  - Route by `googleBookId`.
  - Use backend adapter/service to fetch and normalize detail payload.

- [ ] **User interactions**
  - Reviews, ratings, likes, comments.
  - Activity timeline per user.

- [ ] **Internationalization (i18n)**
  - Introduce key-based messages (e.g. `MENU_HOME`).
  - Add translation files and language selector.

## Definition of done for each item

- [ ] Route/service/schema/types updated coherently.
- [ ] Error handling uses shared catalog.
- [ ] Basic tests included.
- [ ] Docs updated (`README` + relevant `docs/` file).
