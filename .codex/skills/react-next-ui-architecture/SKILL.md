---
name: react-next-ui-architecture
description: Review and safely refactor React and Next.js UI architecture while preserving the existing visual design, behavior, accessibility, responsiveness, and bilingual RTL/LTR experience. Use for component-reuse reviews, page/component decomposition, shared UI extraction, Server/Client Component boundary improvements, and approved structural refactors.
---

# React & Next.js UI Architecture

Use this skill for architecture reviews and structural refactors in this project. The aim is to make the codebase easier to evolve without changing the product's visual language or introducing abstraction for its own sake.

## Two explicit modes

### Review mode

Use review mode when the request includes review, audit, assess, plan, identify, or similar language without explicit implementation approval.

- Do not edit, move, rename, create, or delete files.
- Inspect the applicable routes, feature components, shared components, layouts, and shadcn primitives.
- Read `AGENTS.md` before evaluating or recommending changes.
- Report findings with: what remains page-specific, what can be shared, what can be split, a logical location, affected consumers, and whether the change is worth the added abstraction.
- End with three sections: high-value changes, useful but optional changes, and things that should remain unchanged.
- Wait for explicit approval before entering refactor mode.

### Refactor mode

Use refactor mode only when the requester explicitly approves a reviewed plan or directly asks to implement a clearly scoped structural change.

- Implement only the approved items. Do not add optional improvements opportunistically.
- Preserve all unrelated user changes in a dirty worktree.
- Keep visual hierarchy, copy, spacing, color, interaction behavior, accessibility, responsive layouts, and RTL/LTR behavior unchanged unless the request explicitly includes a UI change.
- Verify the changed flow with lint, TypeScript, a production build, and a targeted rendered check when a local app is available.

## Architecture rules

### Component placement

- Keep routes in `src/app` thin: parse route inputs, fetch server data, enforce access, and render feature entry components.
- Keep domain-specific UI and state in `src/features/<feature>/`.
- Put a component in `src/components/shared` only after it has real cross-feature reuse or represents an app-wide pattern.
- Keep shadcn primitives in `src/components/ui`; compose them rather than duplicating primitives.
- Do not create generic “card”, “section”, “form field”, or “list” abstractions solely because markup looks similar once or twice.
- Favor a small feature-local component over a broad shared component with many conditional props.

### React and Next.js boundaries

- Prefer Server Components by default.
- Add `"use client"` only for state, effects, event handlers, browser APIs, or client-only libraries.
- Keep client islands small. Static parents, page framing, translation loading, and data access should stay server-rendered where possible.
- Never pass non-serializable values from Server Components to Client Components.
- Use `Promise.all` for independent server work and avoid client-side fetching when server rendering is sufficient.
- Keep page-level orchestration separate from focused interactive units such as editors, dialogs, calendars, tabs, and composers.

### UI consistency and accessibility

- Reuse the project’s existing shadcn components, tokens, logical CSS properties, and established patterns.
- Preserve keyboard access, focus handling, labels, live regions, disabled states, and semantic landmarks.
- Keep all shared UI compatible with English/LTR and Arabic/RTL.
- Do not hard-code user-facing copy; use the existing `next-intl` message structure.

## Review workflow

1. Read `AGENTS.md`, `package.json`, relevant route/layout files, and the applicable feature/shared components.
2. Inspect current reuse before proposing new reuse. Similar visuals do not automatically mean the same component.
3. Classify each candidate as one of:
   - keep page-specific;
   - split into focused feature-local components;
   - share inside one feature;
   - promote to shared UI;
   - defer because it would be unnecessary abstraction.
4. Prioritize based on duplication, independent lifecycle/state, number of real consumers, readability, and likelihood of future change.
5. In the review, call out any Server/Client Component boundary that sends avoidable JavaScript, but do not change it in review mode.

## Refactor workflow

1. Re-state the approved scope and inspect `git status`.
2. Read version-matched Next.js documentation from `node_modules/next/dist/docs/` for affected App Router or RSC behavior.
3. Make the smallest coherent structural change:
   - extract focused components close to their feature;
   - keep one orchestrator for shared state and business flow;
   - promote a component to shared only with multiple compatible consumers;
   - preserve public imports where practical or update all consumers together.
4. Do not change visual styles as part of a structural refactor unless needed to preserve the existing result.
5. Run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
6. When possible, render the affected routes in both `/en` and `/ar`, exercise at least one changed interaction, and check for framework overlays or relevant console errors.
7. Report changed files, behavior verified, commands run, and remaining risk.

## Decision guide

Extract a focused feature-local component when it has its own state, interactions, a clear visual responsibility, or materially reduces a parent component’s complexity.

Promote a component to `src/components/shared` only when at least two consumers share the same semantics and prop contract. If consumers merely look alike but have different workflows or state models, keep them separate.

Avoid extracting tiny static fragments, one-off page summaries, route wrappers, framework special files, or components that would require a long prop list to support only hypothetical future use.

## Required final response

For review mode, provide a prioritized plan and state clearly that no files changed.

For refactor mode, lead with the completed outcome, list the major structural changes, include verification results, and state any intentionally deferred items.
