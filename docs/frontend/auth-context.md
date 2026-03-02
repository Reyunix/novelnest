# Auth Context Flow (Frontend)

This document explains how authentication state works in the frontend.

## Goal

Keep a single source of truth for session state (`loading`, `authenticated`, `unauthenticated`) and make it available to the whole app.

## Files Involved

- `novelnest-frontend/src/features/auth/authContext.ts`
- `novelnest-frontend/src/features/auth/authProvider.tsx`
- `novelnest-frontend/src/pages/auth/Login.tsx`
- `novelnest-frontend/src/routes/guards/ProtectedRoute.tsx`
- `novelnest-frontend/src/layouts/Nav.tsx`

## 1. `authContext.ts`: contract and access point

`AuthContext` only defines the shape of the auth data and actions.

It contains:
- `AuthStatus` type
- `User` type
- `AuthContextValue` interface
- `AuthContext = createContext<AuthContextValue | null>(null)`
- `useAuth()` custom hook

Important: `createContext(...null)` is intentional. It forces usage inside `AuthProvider`. If used outside, `useAuth()` throws an error.

## 2. `AuthProvider`: real state + real logic

`AuthProvider` owns the real auth state:
- `authStatus`
- `user`

And exposes actions:
- `refreshSession()`
- `logout()`

This is the real source of truth. `AuthContext` is just the channel.

## 3. Initial Session Bootstrap

On app mount, `AuthProvider` runs `refreshSession()` inside `useEffect`.

Flow:
1. Initial state is `loading`.
2. `GET /api/v1/auth/me` with `credentials: include`.
3. If response is OK:
   - `authStatus = "authenticated"`
   - `user = payload.user`
4. If response fails:
   - `authStatus = "unauthenticated"`
   - `user = null`

So `loading` is transient; stable idle state without valid session is `unauthenticated`.

## 4. Why `useCallback` is used

`refreshSession` and `logout` are wrapped in `useCallback` to keep stable function references.

Practical effects:
- `useEffect([refreshSession])` does not rerun on every render.
- `useMemo` value is not invalidated by changing function references.

## 5. Why `useMemo` is used for provider `value`

`value` is memoized so consumers only rerender when meaningful auth data changes:
- `authStatus`
- `user`
- exposed actions

This reduces unnecessary rerenders in components using `useAuth()`.

## 6. How UI uses it

- `Login.tsx`: after successful login, calls `refreshSession()` to sync global auth state.
- `ProtectedRoute.tsx`: checks `authStatus` and redirects to `/login` when unauthenticated.
- `Nav.tsx` (layout): switches menu links based on `authStatus`.

## 7. Minimal mental model

- `authContext.ts` = API contract + access hook
- `AuthProvider` = state machine + network calls
- `useAuth()` = read/write auth state from any component

## 8. Common mistakes to avoid

1. Using `useAuth()` outside `AuthProvider`.
2. Assuming functions created with `useCallback` execute automatically.
3. Removing bootstrap `useEffect` and expecting session to load by itself.
4. Mixing `localhost` and `127.0.0.1` origins and breaking cookies/CORS.

## 9. Runtime sequence summary

1. App mounts
2. `AuthProvider` bootstrap calls `/auth/me`
3. Global auth state is resolved
4. Any `useAuth()` consumer rerenders with the new state
5. Login/logout actions update this same global state
