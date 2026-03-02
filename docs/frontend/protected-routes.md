# Protected Routes (Frontend)

This document explains how protected routing works in NovelNest frontend and where each responsibility lives after the architecture refactor.

## Files Involved

- `novelnest-frontend/src/routes/AppRoutes.tsx`
- `novelnest-frontend/src/routes/guards/ProtectedRoute.tsx`
- `novelnest-frontend/src/layouts/MainLayout.tsx`
- `novelnest-frontend/src/features/auth/authProvider.tsx`
- `novelnest-frontend/src/features/auth/authContext.ts`

## Current Routing Structure

- `AppRoutes` defines route map and route guard usage.
- `MainLayout` wraps all pages with shared UI (`Header`, `Footer`, and `Outlet`).
- `ProtectedRoute` guards private pages (currently `/mis-libros`).

## How ProtectedRoute Works

`ProtectedRoute` reads auth state from context (`useAuth`) and decides what to render:

1. Calls `refreshSession()` on mount.
2. While `authStatus === "loading"`, renders a loading state.
3. If `authStatus === "unauthenticated"`, redirects to `/login` with `replace`.
4. If authenticated, renders `children`.

## Why `replace` on Redirect

Using `<Navigate to="/login" replace />` avoids leaving the protected URL in browser history. Pressing Back does not immediately send the user to the forbidden route again.

## Current Protected Endpoint Dependency

The guard depends on `AuthProvider.refreshSession`, which calls backend:

- `GET /api/v1/auth/me`

If backend responds non-2xx, provider sets:

- `authStatus = "unauthenticated"`
- `user = null`

## Local Dev Assumptions

Current local setup expects:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Cookies in backend dev mode: `sameSite: "lax"`, `secure: false`
- CORS origin in backend: `http://localhost:5173`

Use `localhost` consistently (avoid mixing with `127.0.0.1`) to prevent cookie/session issues.

## Where to Add New Protected Pages

In `AppRoutes`, wrap page element with `ProtectedRoute`:

```tsx
<Route
  path="/example-private"
  element={
    <ProtectedRoute>
      <ExamplePrivatePage />
    </ProtectedRoute>
  }
/>
```

## Common Errors

- Using guard component from `pages/` instead of `routes/guards/`.
- Forgetting `AuthProvider` at app root (`App.tsx`).
- Missing `credentials: "include"` in session requests.
- Protocol mismatch (`http` vs `https`) between frontend and backend in local dev.
- Host mismatch (`localhost` vs `127.0.0.1`) causing cookies to be ignored.

## Future Improvement

If you want to avoid one extra `refreshSession()` per protected navigation, add a bootstrap flag in provider (for example `sessionChecked`) and let the guard trust that initial check when already completed.
