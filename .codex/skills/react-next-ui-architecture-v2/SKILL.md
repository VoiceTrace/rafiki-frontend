---
name: react-next-ui-architecture-v2
description: Review, document, and safely refactor React and Next.js UI architecture while preserving visual consistency, RTL/LTR behavior, accessibility, and the existing design system. Includes a durable component-structure document and shadcn audit.
---

# React & Next.js UI Architecture

Use this project-local skill for UI architecture reviews and approved structural refactors. The purpose is to make the frontend easier to evolve without visual redesign, duplicate primitives, or unnecessary abstraction.

## Operating modes

### Review mode

Use review mode for requests containing review, audit, assess, plan, identify, or similar language without explicit implementation approval.

- Do not edit, move, rename, or delete product code.
- The only permitted write is creating or updating `docs/frontend-architecture.md`.
- Read `AGENTS.md`, `package.json`, `components.json`, affected route/layout files, feature components, shared components, and existing UI primitives.
- Inspect real reuse before recommending a shared component.
- Review each candidate for: page-specific ownership, feature-local extraction, feature-level sharing, global sharing, or unnecessary abstraction.
- Explain logical file placement, affected consumers, Server/Client Component boundaries, RTL/i18n impact, accessibility implications, and whether the refactor is worth doing.
- Complete the architecture document using the required format below.
- End the response with high-value changes, useful-but-optional changes, and things that should remain unchanged.
- Do not enter refactor mode until the requester explicitly approves a written plan or an exact scope.

### Refactor mode

Use refactor mode only after the requester explicitly approves a reviewed plan or requests a clear structural implementation.

- Implement only approved items; do not opportunistically perform optional work.
- Inspect `git status` first and preserve unrelated worktree changes.
- Keep visual hierarchy, copy, spacing, colors, behavior, accessibility, responsive layouts, and RTL/LTR rendering unchanged unless the requester explicitly asks for UI changes.
- Update `docs/frontend-architecture.md` after the refactor so it reflects the implemented structure and decisions.
- Verify with lint, TypeScript, production build, and a targeted rendered interaction when a local app is available.

## Architecture rules

### Project placement

- Keep routes in `src/app` thin: route input parsing, server data access, access control, and feature entry rendering only.
- Keep domain-specific UI, state, and logic in `src/features/<feature>/`.
- Promote UI to `src/components/shared` only after at least two consumers share the same semantics and prop contract.
- Keep design primitives in `src/components/ui`; compose existing primitives rather than duplicating them.
- Prefer focused feature-local components over generic components with many conditional props.
- Do not extract one-off static markup, framework special files, or simple route wrappers.

### React and Next.js

- Prefer Server Components by default.
- Use `"use client"` only for state, effects, browser APIs, event handlers, or client-only dependencies.
- Keep client islands small; static framing, data loading, and translations should remain server-rendered where possible.
- Keep page-level orchestration separate from focused interactive units such as editors, calendars, dialogs, tab controls, and composers.
- Avoid serializing unnecessary data or non-serializable props across Server/Client Component boundaries.
- Use `Promise.all` for independent server work.

### UI, i18n, and accessibility

- Reuse the existing design tokens, logical CSS properties, shadcn components, and established interaction patterns.
- Maintain keyboard behavior, focus management, labels, semantic landmarks, live regions, and state feedback.
- Keep all shared UI compatible with English/LTR and Arabic/RTL.
- Do not hard-code translatable user-facing text; use `next-intl` messages.

## shadcn audit

1. Inspect `components.json`, `src/components/ui`, and current component imports before proposing a new primitive.
2. Inventory installed shadcn primitives and their consumers.
3. For every custom UI control, decide whether it should:
   - remain custom because it is domain-specific;
   - be composed from an already installed shadcn primitive;
   - be replaced by an already installed primitive; or
   - be evaluated as a candidate from the official shadcn registry.
4. For official registry candidates, record component name, dependencies, accessibility value, styling/RTL implications, migration risk, and expected maintenance benefit.
5. Do not install, copy, or replace shadcn components in review mode.
6. In refactor mode, use an official shadcn registry component only after the requester approves that exact candidate. Adapt it to the project’s existing primitives, Base UI setup, tokens, `next-intl`, and RTL support.
7. Never replace a working custom component merely because shadcn has a similarly named component. The replacement must improve consistency, accessibility, or maintenance without changing the intended UI.

## Architecture document

Create or update `docs/frontend-architecture.md` after every review and approved refactor. It is a living, versioned reference; update it rather than creating dated copies unless explicitly asked.

Use these sections:

1. **Purpose and scope** — review date, reviewed area, and operating mode.
2. **Route and layout map** — route groups, layouts, entry components, and feature ownership.
3. **Component structure** — shared components, UI primitives, and feature-local trees; label Client Components and explain why they are client-side.
4. **Reuse decisions** — accepted shared components, feature-local extractions, deferred candidates, and intentionally page-specific UI.
5. **shadcn audit** — installed primitives and consumers, custom-component decisions, official registry candidates, and explicit decisions not to replace.
6. **Architecture rules** — project conventions future contributors must preserve.
7. **Prioritized plan** — high-value changes, optional changes, and unchanged items.
8. **Change log** — concise dated entries for decisions and completed refactors.

Use repository-relative file links, avoid copying source code into the document, and label recommendations separately from implemented decisions.

## Required verification for refactors

1. Read version-matched Next.js documentation from `node_modules/next/dist/docs/` for affected App Router/RSC behavior.
2. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
3. When a local app is available, verify changed routes in both `/en` and `/ar`, exercise at least one changed interaction, and check for relevant console errors or framework overlays.
4. Report changed files, behavior verified, commands run, and remaining risk.
