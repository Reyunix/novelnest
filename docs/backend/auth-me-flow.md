# Backend Auth `/api/v1/auth/me` Flow (End-to-End)

This document explains how the backend resolves the authenticated session check endpoint:

- `GET /api/v1/auth/me`

It also includes the full session lifecycle around it (`login -> me -> refresh -> me -> logout`).

## 1. Purpose

`/auth/me` is the session truth endpoint for the frontend.

It answers:
- Is the current request authenticated?
- If yes, which user is currently represented by the access token?

It does not read the database. It validates and reads the JWT payload already stored in the access token cookie.

## 2. Runtime Components Involved

- Route: `src/modules/auth/auth.routes.ts`
- Controller: `src/modules/auth/auth.controller.ts` (`MeController`)
- Auth plugin: `src/plugins/auth.ts` (`app.authenticate`)
- JWT plugin: `src/plugins/jwt.ts` (`request.jwtVerify` source)
- Session helpers: `src/modules/auth/auth.session.ts`
- Auth constants: `src/modules/auth/auth.constants.ts`
- Response helpers/catalog: `src/utils/http/successResponses.ts`, `src/utils/http/errorResponses.ts`, `src/utils/http/responsesCatalogs.ts`

## 3. Bootstrap Path (why `/me` works)

At app startup (`src/index.ts`), plugin registration order is:

1. `@fastify/cookie`
2. `jwtPlugin`
3. `authPlugin`
4. `corsPlugin`

Why this matters:
- `@fastify/cookie` parses cookies from incoming requests.
- `jwtPlugin` configures `@fastify/jwt` to read the access token from cookie name `access_token`.
- `authPlugin` decorates `app.authenticate`, which internally calls `request.jwtVerify()`.

If `jwtPlugin` or `@fastify/cookie` are missing/misordered, `/me` cannot authenticate correctly.

## 4. End-to-End Sequence

## 4.1 Login creates session cookies

Endpoint:
- `POST /api/v1/auth/login`

Flow:
1. `LoginController` validates credentials (service layer).
2. Builds JWT payload (`buildJwtPayload`).
3. Signs access + refresh tokens (`signAuthTokens`).
4. Sets cookies (`setAuthCookies`):
   - `access_token` (1h)
   - `refresh_token` (7d)

Cookie names come from `TOKEN_CONSTANTS`.

## 4.2 `/me` request arrives

Endpoint:
- `GET /api/v1/auth/me`

Route definition uses pre-handler:
- `{ preHandler: [app.authenticate] }`

Flow:
1. `app.authenticate` runs before controller.
2. `app.authenticate` executes `await request.jwtVerify()`.
3. `jwtVerify` reads `access_token` cookie (configured in `jwtPlugin`).
4. If token is valid:
   - Fastify injects decoded payload into `request.user`.
   - Route continues to `MeController`.
5. `MeController` returns:
   - `sendSuccess(reply, "VALID_TOKEN", { user: request.user })`

## 4.3 Access token expired or missing

If `jwtVerify` fails in `app.authenticate`:
- Plugin throws `new AppError("UNAUTHORIZED")`.
- Controller is not executed.
- Client receives `401` + standardized error payload.

## 4.4 Refresh session

Endpoint:
- `POST /api/v1/auth/refresh`

Flow:
1. Reads `refresh_token` cookie.
2. Verifies refresh token (`refreshAccessToken`).
3. Signs a new access token.
4. Sets only `access_token` cookie again.
5. Returns `TOKEN_REFRESHED`.

Then frontend can call `/auth/me` again.

## 4.5 Logout

Endpoint:
- `POST /api/v1/auth/logout`

Flow:
1. `clearAuthCookies` clears both `access_token` and `refresh_token`.
2. Future `/auth/me` calls will return `401 UNAUTHORIZED`.

## 5. `/auth/me` Contract

## 5.1 Success (200)

Catalog key:
- `VALID_TOKEN`

Payload shape:

```json
{
  "success": true,
  "message": "Acceso autorizado, token valido.",
  "code": "VALID_TOKEN",
  "data": {
    "user": {
      "userId": 1,
      "userName": "alice",
      "userEmail": "alice@example.com",
      "role": "user"
    }
  }
}
```

Note: `user` here is JWT payload, not a fresh DB record.

## 5.2 Unauthorized (401)

Catalog key:
- `UNAUTHORIZED`

Payload shape:

```json
{
  "success": false,
  "errorCode": "UNAUTHORIZED",
  "message": "Acceso no autorizado. Es necesario iniciar sesion"
}
```

## 6. Cookie Configuration (Current Dev Behavior)

From `auth.session.ts`, base cookie options are:
- `httpOnly: true`
- `sameSite: "lax"`
- `path: "/"`
- `secure: process.env.NODE_ENV === "production"`

In local development (`NODE_ENV=development`):
- `secure` is `false`
- Front and back must be same-site friendly (recommended: `http://localhost` everywhere)

## 7. Common Failure Causes

1. Mixed hostnames (`localhost` vs `127.0.0.1`)
- Cookies may not be sent as expected.

2. Missing `credentials: "include"` on frontend requests
- Auth cookies are not sent.

3. Wrong `JWT_SECRET`
- Existing cookies become unverifiable.

4. Missing/incorrect plugin registration
- `request.jwtVerify` or cookie parsing not ready when routes run.

## 8. Practical Debug Checklist

For `/auth/me` troubleshooting:

1. Confirm login response sets both cookies (`access_token`, `refresh_token`).
2. Confirm `/auth/me` request includes `Cookie` header.
3. Confirm frontend uses `credentials: "include"`.
4. Confirm backend logs show route hit and no plugin errors.
5. If 401 after idle time, call `/auth/refresh` then retry `/auth/me`.

## 9. Design Notes

- `/auth/me` is intentionally lightweight and stateless relative to DB.
- Trust boundary is the signed JWT.
- If you need always-fresh profile data (name/email updates reflected immediately), you can keep JWT auth but add an optional DB lookup in `MeController`.
