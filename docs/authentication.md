# Authentication and profile integration contract

This document records the frontend/backend contract established while resolving PR #2. Read it before changing authentication, protected layouts, the app-shell user menu, or profile code.

The backend OpenAPI document is the source of truth. For local development it is currently available at `http://127.0.0.1:8001/openapi.json`. Re-check it before changing this contract.

## Current backend contract

The backend currently implements this authentication and self-profile surface:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/login` | Accepts `{ email, password }` and returns `{ access_token, token_type }`. |
| GET | `/users/me` | Returns the authenticated `UserRead` record. |
| PATCH | `/users/me` | Updates the authenticated user's `full_name` and/or `password`. |
| PUT | `/users/me/avatar` | Uploads JPEG, PNG, or WebP in multipart field `file`, maximum 5 MB. |
| DELETE | `/users/me/avatar` | Removes the authenticated user's avatar. |

The access token is a six-hour bearer JWT. Its claims include `sub`, `school_id`, `role`, and `exp`. The backend remains authoritative for identity, role, school scope, and authorization.

`UserRead` contains `id`, `school_id`, `email`, `full_name`, `role`, `is_active`, `avatar_url`, `created_at`, and `updated_at`.

The current backend does not implement refresh, token revocation/logout, registration, password recovery, or email verification endpoints.

## Frontend behavior that must be preserved

- `src/features/auth/server/auth-api.ts` owns the backend login integration. Do not move direct authentication fetches into UI components or `src/auth.ts`.
- Login sends only email and password to the backend. The role selected in the UI is navigation context, not authorization input.
- After login, the frontend calls `GET /users/me` with the new bearer token. The returned role, name, email, and ID replace any client assumptions.
- The backend token is stored in the encrypted, HTTP-only Auth.js JWT cookie. Do not copy it to `session.user` or pass it to Client Components.
- Server-only backend calls obtain the token through `getBackendAccessToken()` in `src/features/auth/server/dal.ts`.
- `verifySession(locale, requiredRole)` remains the authoritative server-side route guard for teacher and student layouts. `src/proxy.ts` is only an early redirect layer.
- Localized auth pages stay under `src/app/[locale]/(auth)`. Do not recreate `src/app/[locale]/login/page.tsx`.
- Preserve the teacher and student profile routes, `ProfileForm`, `UserMenu`, and the `/users/me` profile operations added by PR #2.
- `src/lib/api.ts` accepts either `API_URL` or `AUTH_API_URL` as the backend origin so auth and profile calls use the same service.
- Relative avatar paths returned by the backend are joined with the server-configured backend origin before being passed to the profile UI.
- The existing refresh and backend logout code is dormant for the current login response because no refresh token or expiry metadata is returned. Do not fabricate those values from the access JWT.
- `isEmailVerified` is currently a frontend compatibility placeholder. It must not be treated as a backend-verified fact until the backend exposes verification state.

## Current limitations

The sign-up, forgot-password, reset-password, and verify-email screens came from `main`, but their real API endpoints do not exist in the current backend. They may be used as mock UI in local development. Do not claim these flows work against the real backend.

Auth.js sign-out currently clears the local encrypted session. It cannot revoke a backend session because the backend issues no refresh token and exposes no revocation endpoint.

## Backend work for stronger authentication

### Refresh-token rotation

Add `POST /auth/refresh`. A recommended request and response are:

```json
{
  "refresh_token": "<opaque refresh token>"
}
```

```json
{
  "access_token": "<JWT>",
  "refresh_token": "<new opaque refresh token>",
  "token_type": "bearer",
  "expires_in": 21600
}
```

Store only refresh-token hashes. Rotate on every refresh, invalidate the previous token immediately, and reject expired, revoked, or reused tokens. Associate tokens with the user, school, expiry, and a session or token-family ID.

### Logout and revocation

Add `POST /auth/logout` to revoke the supplied refresh-token family. It should be idempotent. Consider `POST /auth/logout-all` to revoke every active session after password changes or account compromise.

When `PATCH /users/me` changes the password, revoke existing refresh-token sessions and record a security audit event without storing passwords or tokens.

### Account lifecycle

Implement these only when the product supports their flows:

- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`

Recovery and verification tokens must be random, single-use, hashed at rest, and short-lived. Recovery responses must not reveal whether an email address exists.

### Abuse protection and errors

Rate-limit login, refresh, registration, and recovery by account and source. Record security events for login thresholds, refresh-token reuse, password changes, and revocation.

Continue using the structured backend error envelope and add stable codes when the new routes exist, such as `invalid_refresh_token`, `refresh_token_reused`, `session_revoked`, `rate_limited`, and `invalid_reset_token`.

## Change checklist

When an agent changes auth or profile integration:

1. Read this file and the live OpenAPI schema.
2. Preserve backend-authoritative role and school scoping.
3. Keep bearer tokens out of browser-visible session data and Client Components.
4. Verify both teacher and student route guards.
5. Verify English and Arabic login/profile routes.
6. Run targeted ESLint and `npm run build`.
7. Update this document in the same commit if the backend contract changes.
