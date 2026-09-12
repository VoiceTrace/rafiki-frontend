import "server-only"

import type {
  BackendAuthSession,
  SessionUser,
  UserRole,
} from "@/features/auth/types"

type LoginInput = { email: string; password: string; role: UserRole }
type SignUpInput = LoginInput & { name: string }

type BackendEnvelope<T> = T | { data: T }

const backendUrl = process.env.AUTH_API_URL?.replace(/\/$/, "")
const useMockBackend =
  process.env.NODE_ENV !== "production" &&
  process.env.AUTH_USE_MOCK_BACKEND !== "false" &&
  !backendUrl

export class AuthApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
    message = code,
  ) {
    super(message)
    this.name = "AuthApiError"
  }
}

function unwrap<T>(value: BackendEnvelope<T>): T {
  return typeof value === "object" && value !== null && "data" in value
    ? value.data
    : value
}

async function request<T>(
  path: string,
  init: RequestInit & { body?: string } = {},
): Promise<T> {
  if (!backendUrl) {
    throw new AuthApiError(
      "backendUnavailable",
      503,
      "AUTH_API_URL is not configured.",
    )
  }

  let response: Response

  try {
    response = await fetch(`${backendUrl}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init.headers,
      },
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new AuthApiError("backendUnavailable", 503)
  }

  const payload = (await response.json().catch(() => null)) as
    | BackendEnvelope<T>
    | { code?: string; message?: string }
    | null

  if (!response.ok) {
    const errorPayload = payload as { code?: string; message?: string } | null
    throw new AuthApiError(
      errorPayload?.code ??
        (response.status === 401 ? "invalidCredentials" : "requestFailed"),
      response.status,
      errorPayload?.message,
    )
  }

  if (payload === null) {
    return undefined as T
  }

  return unwrap(payload as BackendEnvelope<T>)
}

function mockUser(input: { email: string; role: UserRole; name?: string }): SessionUser {
  return {
    id: `mock-${input.role}-${input.email}`,
    name:
      input.name ?? (input.role === "teacher" ? "Mr. Adel" : "Ahmed"),
    email: input.email,
    role: input.role,
    emailVerified: true,
  }
}

export async function authenticateUser(
  input: LoginInput,
): Promise<BackendAuthSession> {
  if (useMockBackend) {
    if (input.password.length < 8) {
      throw new AuthApiError("invalidCredentials", 401)
    }

    return { user: mockUser(input) }
  }

  return request<BackendAuthSession>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function refreshAuthSession(refreshToken: string): Promise<{
  accessToken: string
  refreshToken?: string
  accessTokenExpiresAt: number
}> {
  return request("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
}

export async function revokeAuthSession(refreshToken: string): Promise<void> {
  if (useMockBackend) return

  await request<void>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  })
}

export async function registerUser(input: SignUpInput): Promise<SessionUser> {
  if (useMockBackend) return mockUser(input)

  return request<SessionUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (useMockBackend) return

  await request<void>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function resetPassword(input: {
  token: string
  password: string
}): Promise<void> {
  if (useMockBackend) return

  await request<void>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function verifyEmail(token: string): Promise<void> {
  if (useMockBackend) return

  await request<void>("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ token }),
  })
}
