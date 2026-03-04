# Backend Global Error Handler (Fastify)

This document explains how the global error handler works in NovelNest backend, when it is executed, and which errors it does or does not handle.

## 1. Current Implementation

- Plugin file: `novelnest-backend/src/plugins/errorHandler.ts`
- Registration point: `novelnest-backend/src/index.ts`
- API shape source: `novelnest-backend/src/utils/http/errorResponses.ts`

Current behavior:

- If the thrown error is `AppError`, return `sendError(reply, error)`.
- Otherwise, log the error and return `sendError(reply, new AppError("INTERNAL_SERVER_ERROR"))`.

## 2. When It Becomes Active

The global handler becomes active when this plugin is registered:

```ts
app.register(errorHandlerPlugin)
```

in `src/index.ts`.

From that point, Fastify routes/hooks in the same app scope use this handler for uncaught errors.

## 3. Request Lifecycle and Error Flow

Simplified request pipeline:

1. Route match
2. Hooks (`onRequest`, `preParsing`, `preValidation`, `preHandler`, ...)
3. Route handler/controller
4. Reply serialization

If an error is thrown/rejected in step 2 or 3 and is not manually handled, Fastify forwards it to `setErrorHandler`.

## 4. What Is Caught by This Handler

In this project, these are handled globally:

1. Errors in auth pre-handler (`app.authenticate`)
- Example: `request.jwtVerify()` fails -> `throw new AppError("UNAUTHORIZED")`.
- Result: global handler returns standardized `UNAUTHORIZED` payload.

2. Errors thrown in controllers/services
- Example: login validation throws `AppError("INVALID_LOGIN_DATA")`.
- Result: global handler returns standardized error payload.

3. Unexpected runtime errors
- Example: `TypeError`, DB/network crash not wrapped as `AppError`.
- Result: logged server-side + standardized `INTERNAL_SERVER_ERROR` response.

## 5. What Is NOT Caught (or Not Useful to Catch Here)

1. Errors already handled manually inside a controller
- If a controller catches and sends reply itself, there is no uncaught error to propagate.

2. Errors outside request/response lifecycle
- Startup failures, background jobs, standalone scripts, etc.

3. Different encapsulation scopes with their own `setErrorHandler`
- In Fastify, nearest scope handler wins.
- Current setup registers one app-level handler in `index.ts`.

## 6. Why This Refactor Matters

Before global handling, errors thrown in pre-handlers could return Fastify default error shape.

With global handling:

- API error format is consistent (`success: false`, `errorCode`, `message`).
- Controllers can be leaner (less repetitive `try/catch`).
- Pre-handler auth errors and controller/service errors follow one contract.

## 7. Recommended Controller Pattern

Use controllers as thin orchestration layers and let errors bubble:

```ts
export const MeController = async (request, reply) => {
  return sendSuccess(reply, "VALID_TOKEN", { user: request.user });
};
```

Service layer throws typed domain errors:

```ts
if (!identifier) throw new AppError("INVALID_LOGIN_DATA");
```

Global error handler serializes the response.

## 8. Practical Checklist

When adding a new endpoint:

1. Throw `AppError` for expected domain/application errors.
2. Do not duplicate response formatting in each controller.
3. Keep success responses in `sendSuccess`.
4. Let uncaught errors bubble to global handler.

## 9. Current Project Notes

1. `errorHandlerPlugin` is correctly registered before routes in `src/index.ts`.
2. Auth pre-handler (`src/plugins/auth.ts`) throws `AppError("UNAUTHORIZED")`, which is correctly handled globally.
3. This gives consistent unauthorized payloads for `/api/v1/auth/me` when session is invalid.

