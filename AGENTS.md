<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Engineering Rules

## Next.js & React

* Follow the latest stable features, APIs, conventions, architecture, and page structure supported by the installed versions of Next.js and React.
*  read the relevant version-matched docs in `node_modules/next/dist/docs/`.
* If remembered framework behavior conflicts with the installed docs, the installed docs win.
* Use the App Router only.
* Prefer Server Components by default.
* Use `"use client"` only when client-side behavior is actually required.
* Prefer modern stable Next.js and React features such as Server Actions, Suspense, streaming, nested layouts, route groups, and current React APIs when appropriate.
* Avoid deprecated APIs, Pages Router patterns, and legacy React/Next.js approaches.
* Prefer stable features over canary or experimental APIs unless explicitly requested.

## Project Structure

* Keep Next.js routing inside `src/app`.
* Keep localized routes under `src/app/[locale]/`.
* Keep feature-specific UI and logic inside `src/features`.
* Use route groups such as `(auth)`, `(teacher)`, and `(student)` when useful.
* Prefer nested layouts instead of duplicating page shells.
* Keep shared UI in `src/components`.
* Keep shadcn primitives in `src/components/ui`.
* Keep reusable utilities and integrations in `src/lib`.
* Do not create unnecessary folders or abstraction layers.

Preferred structure not a must :

```text
src/
├── app/
│   └── [locale]/
│       ├── (auth)/
│       ├── (teacher)/
│       ├── (student)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       └── not-found.tsx
│
├── features/
│   └── <feature>/
│       ├── components/
│       ├── actions/
│       ├── schemas/
│       ├── server/
│       ├── types/
│       └── utils/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
├── hooks/
└── types/
```

## Internationalization

* Use `next-intl`.
* Support English (`en`) and Arabic (`ar`) from the beginning.
* Use `/en/...` and `/ar/...` locale-prefixed routes.
* Set the document language and direction from the active locale:

  * English: `lang="en"` and `dir="ltr"`
  * Arabic: `lang="ar"` and `dir="rtl"`
* Do not hard-code translatable user-facing text in components.
* Keep translations in locale message files.
* All shared UI must work correctly in both LTR and RTL.
* Prefer RTL-safe logical spacing/layout instead of hard-coded left/right positioning.
* Verify important UI and routing changes in both English and Arabic.

## UI

* Reuse existing shadcn/ui components before creating new UI primitives.
* Keep UI responsive and accessible.
* Preserve consistent spacing, typography, states, and interaction patterns.
* Handle loading, empty, error, disabled, and success states where relevant.

## Forms

* Prefer Next.js forms, Server Actions, `useActionState`, and Zod.
* Validate untrusted input with Zod.
* Do not add React Hook Form unless a form is genuinely complex enough to require it.

## Architecture

* Keep presentation, domain logic, and external API integration separated.
* Do not call backend APIs directly from arbitrary UI components.
* Keep backend-specific code behind a dedicated integration layer.
* Use strict TypeScript.
* Avoid `any`.
* Avoid unnecessary dependencies and abstractions.
* Do not add Redux, Zustand, TanStack Query, or Axios unless there is a real product requirement.

## Rafiqi authentication

* Use `API_URL` for the Rafiqi API origin; it is the preferred integration variable and must not include a trailing slash.
* Keep API integration in `src/features/auth/server/auth-api.ts`. Never call the authentication API from a client component.
* The Rafiqi login endpoint is `POST /auth/login` with `{ email, password }` and returns `{ access_token }`. The JWT `sub` and `role` claims are the source of truth for the session identity and role.
* `AUTH_API_URL` supports the older generic backend adapter only. Do not replace `API_URL` with it for the Rafiqi API.
* Do not commit `.env.local`, generated secrets, JWTs, or credentials. Production needs `API_URL` and `AUTH_SECRET`.
* For a real local login test, run the API from `https://github.com/VoiceTrace/rafiqi-api`, set `API_URL=http://localhost:8000`, and verify both teacher and student journeys. Details are in `docs/authentication.md`.

## Verification

* Use the `next-dev-loop` Skill when available if not tell me . 
* After meaningful changes, verify affected routes against the running application.
* For UI or routing changes, verify both `/en/...` and `/ar/...`.
* Check compilation errors, TypeScript errors, runtime errors, browser console errors, hydration issues, and rendered UI.
* Run `npm run lint` before considering substantial work complete.
* Do not claim something works without verifying it when runtime verification is available.
