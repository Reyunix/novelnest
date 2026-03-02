# Constants Organization (Frontend)

This document explains where constants live after the refactor and how to decide the correct location for new constants.

## Why the split

The old `src/consts.ts` mixed unrelated concerns (navigation, API endpoints, form fields, auth error maps).

The new structure keeps constants close to their domain and reduces cross-module coupling.

## Current map

### Shared runtime/config
- `novelnest-frontend/src/shared/config/api.ts`
  - API base endpoints and env-driven URLs (`API_ENDPOINTS`).

### Shared UI/application constants
- `novelnest-frontend/src/shared/constants/navigation.ts`
  - Header and footer menu links.
- `novelnest-frontend/src/shared/constants/formErrorMap.ts`
  - Common errorCode -> field mapping used by `GenerateForm`.

### Feature-specific constants
- `novelnest-frontend/src/features/auth/constants/authForms.ts`
  - Login/Register form fields and links.
- `novelnest-frontend/src/features/contact/constants/contactForm.ts`
  - Contact form fields.

## Placement rules

1. If only one feature uses it, keep it inside that feature.
2. If multiple features use it, place it under `src/shared/constants`.
3. If it depends on environment variables, place it under `src/shared/config`.
4. Keep constants files declarative; no domain logic inside constants modules.

## Practical examples

- New profile form fields for a future profile feature:
  - `src/features/profile/constants/profileForm.ts`
- New global navbar links used by layout:
  - `src/shared/constants/navigation.ts`
- New API endpoint used by multiple features:
  - `src/shared/config/api.ts`

## Migration note

`src/consts.ts` was removed and replaced by these modules. New code should not reintroduce a monolithic constants file.
