# Authentication integration

Rafiqi uses Auth.js credentials sessions as its browser-facing authentication boundary. All forms submit to Server Actions, session cookies are HTTP-only and encrypted by Auth.js, `src/proxy.ts` performs fast optimistic route checks, and `src/features/auth/server/dal.ts` performs the authoritative check before protected UI or data is returned.

## Connect the backend

Set `AUTH_SECRET` and `AUTH_API_URL`, then adapt only `src/features/auth/server/auth-api.ts` if the backend's paths or envelopes differ. Production never falls back to mock authentication. Local development uses the mock only when no `AUTH_API_URL` exists and `AUTH_USE_MOCK_BACKEND` is not `false`.

The frontend currently expects these JSON endpoints:

| Method | Path | Request | Successful response |
| --- | --- | --- | --- |
| POST | `/auth/login` | `{ email, password, role }` | `{ user, accessToken?, refreshToken?, accessTokenExpiresAt? }` |
| POST | `/auth/register` | `{ name, email, password, role }` | `user` |
| POST | `/auth/forgot-password` | `{ email }` | empty or JSON |
| POST | `/auth/reset-password` | `{ token, password }` | empty or JSON |
| POST | `/auth/verify-email` | `{ token }` | empty or JSON |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ accessToken, refreshToken?, accessTokenExpiresAt }` |
| POST | `/auth/logout` | `{ refreshToken }` | empty or JSON |

Responses may be direct values or wrapped in `{ "data": ... }`. Errors should use `{ "code": "machineReadableCode", "message": "optional diagnostics" }` with the appropriate HTTP status. Return `401` for invalid credentials and `409` for an existing account. `accessTokenExpiresAt` is an epoch timestamp in milliseconds.

The user payload is:

```ts
type User = {
  id: string
  name: string
  email: string
  role: "teacher" | "student"
  emailVerified: boolean
}
```

Access and refresh tokens stay inside the encrypted Auth.js JWT cookie and are not copied into the browser-visible session object. When the backend issues expiring access tokens, Auth.js refreshes them before expiry and invalidates the local session if refresh fails. Logout also asks the backend to revoke the refresh token.

## Security contract

- Never authorize from hidden UI or `proxy.ts` alone. Use `verifySession()` in server-side data access and re-check ownership/role for every mutation.
- Treat Server Actions and Route Handlers as public endpoints: validate input, verify the session, and scope backend queries to the authenticated user.
- Keep password hashing, rate limits, lockout policy, email delivery, reset-token hashing/expiry, audit logs, and MFA in the backend or identity provider.
- The forgot-password action intentionally returns the same success state for existing and unknown emails to prevent account enumeration.
- Callback URLs are restricted to same-origin paths to prevent open redirects.

## Local preview

With no `AUTH_API_URL`, choose either role, use any syntactically valid email, and a password of at least eight characters (for example `password123`). Sign-up, forgot password, reset password, and verification flows operate as UI previews without persisting users.

