---
name: react-next-ui-architecture-v3
description: Review and refactor React and Next.js UI architecture while preserving the existing product design. Performs a read-only shadcn registry audit for missing, installable components before proposing custom UI.
---

# React / Next UI Architecture

Use this skill for architecture reviews, component reuse planning, targeted refactors, or evaluating whether a shadcn component or registry item should be introduced. Keep the visual system, routes, language support, and product behavior intact unless the user explicitly asks to change them.

## Modes and safety

- **Review mode:** do not change product code, dependencies, routes, component locations, or configuration. You may create or update only the architecture documentation requested below.
- **Refactor mode:** make only the changes the user approved from the review. Update the architecture documentation after the change.
- Never run `shadcn add`, accept a CLI overwrite, install an npm package, or add a third-party registry without the user's explicit approval.
- A registry inspection is read-only. An installation is a code and dependency change.

## Architecture rules

- App Router route files should compose feature components; keep pages and layouts as Server Components by default.
- Add `"use client"` only at the smallest component boundary that needs browser APIs, event handlers, client state, effects, or an interactive shadcn primitive.
- Pass data from Server Components into small Client Components through serializable props. Do not make a route client-side just to host a small interactive control.
- Keep domain UI in `src/features/<feature>/components`; place cross-feature product components in `src/components`; retain shadcn primitives in `src/components/ui`.
- Prefer composition over a highly configurable generic abstraction. Extract only when a pattern is truly shared or the source component has multiple independent responsibilities.
- Preserve `next-intl` messages and verify both English and Arabic layouts, including RTL behavior.

## Required shadcn registry audit

Do this during every review or refactor that involves a custom UI pattern, before recommending a new custom component.

1. Inspect `components.json` and `src/components/ui` to identify the project's configured base, installed components, aliases, and existing primitives.
2. Identify the actual user interaction need, not merely a visual label. Examples: searchable selection, keyboard-accessible multi-select, virtualized or anchored chat scrolling, a conversation bubble, modal confirmation, date selection, or command palette.
3. Search the official shadcn registry first, using read-only commands from the frontend project directory:

   ```bash
   pnpm dlx shadcn@latest search @shadcn --query "<need>"
   pnpm dlx shadcn@latest view <candidate>
   pnpm dlx shadcn@latest docs <candidate>
   ```

   When `pnpm` is unavailable, use the project's package manager equivalent. `view` is mandatory for every serious candidate because it exposes files, dependencies, registry dependencies, theme/config changes, and required environment variables.
4. For a known official item, inspect it directly before proposing it, for example:

   ```bash
   pnpm dlx shadcn@latest view combobox
   pnpm dlx shadcn@latest view bubble message message-scroller
   ```

5. Check third-party/community/GitHub registries only if the official registry does not meet the need. Treat every item from them as untrusted code: report its source, license when available, files written, dependencies, maintenance signal, and compatibility risks. Never install it before explicit approval.
6. Classify every candidate as one of:
   - **Install:** a good fit; give the exact item and why.
   - **Compose:** use installed shadcn primitives without installing a new item.
   - **Keep custom:** domain behavior or existing UI makes replacement harmful.
   - **Reject:** wrong interaction, duplicate functionality, incompatible base/dependencies, security/accessibility/i18n risk, or unnecessary abstraction.
7. Assess every recommended item against: configured shadcn base, Tailwind/theme tokens, current utility and alias conventions, Server/Client boundary, keyboard and screen-reader behavior, Arabic/RTL, bundle/client-state cost, and visual consistency.

## Chat-specific rule

For conversation interfaces, audit the official `message-scroller`, `message`, and `bubble` items before building a custom chat surface. Use `message-scroller` only when its anchored-scroll, streaming, restore-history, or jump-to-message behavior is actually required. Keep product-specific AI state, transport, persistence, citations, lesson flow, and Rafiqi design tokens outside the shadcn primitives.

## Review workflow

1. Map app routes, layouts, features, shared components, client boundaries, and existing UI primitives.
2. Review each page/component for responsibility, reuse, rendering boundary, accessibility, internationalization, and over-abstraction risk.
3. Run the required shadcn registry audit for missing patterns.
4. Write or update `docs/frontend-architecture.md`. It must contain:
   - current route and component structure;
   - ownership/location rules and Server/Client boundaries;
   - reuse and extraction decisions with beneficiaries and non-goals;
   - a shadcn registry audit table: need, installed status, official/third-party candidate, classification, rationale, dependencies, and approval status;
   - prioritized plan: high-value, optional, unchanged;
   - dated change log.
5. In the final response, distinguish verified installed components from registry candidates. State plainly that a candidate was not installed unless the user approved it.

## Refactor workflow

1. Confirm the user-approved scope and re-read the architecture documentation.
2. If a shadcn candidate is approved, run `view` and then `add --dry-run` or `add --diff` first. Report the expected file and dependency changes before applying it.
3. Apply the smallest safe change. Keep feature-specific composition outside `src/components/ui`.
4. Run the repository's lint, type-check, and build commands. For rendered changes, test affected English and Arabic routes.
5. Update `docs/frontend-architecture.md` with the actual outcome and any decision reversal.
