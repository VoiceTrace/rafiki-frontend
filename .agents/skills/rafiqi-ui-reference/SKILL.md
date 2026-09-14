---
name: rafiqi-ui-reference
description: Create, redesign, or modify Rafiqi pages and UI using the approved design package, product stories, and bilingual responsive patterns.
---

# Rafiqi UI reference workflow

Use this skill for any Rafiqi page or UI change.

## Required references

Read the relevant parts of these sources before proposing or editing UI:

- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/design/README.md`
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/design/COVERAGE.md`
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/design/WIREFRAMES.md`
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/design/boards/` — inspect only the boards relevant to the requested flow.
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/PRODUCT_DESCRIPTION_AND_USER_STORIES.md`
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/MVP_SIMPLE_TICKETS.md`
- `C:/Users/Qassas/Documents/ChatGPT/rafiky ai/CURRENT_FRONTEND_PAGE_REFERENCE.md`

Treat the SVG wireframes and `screens.json` as the structural design reference; use PNG boards for visual direction. Compare the current route/component with the latest relevant reference before editing.

## Current implementation comparison

Before proposing or changing a page, inspect the corresponding current frontend route and feature component under `Frontend/rafiky-frontend/src/`, alongside `CURRENT_FRONTEND_PAGE_REFERENCE.md` and the related board/wireframe.

Make a short comparison of the existing implementation against the reference:

- **Matches:** preserve these approved patterns and behavior.
- **Differences:** identify whether each is an intentional documented difference, an incomplete implementation, or a design/story conflict.
- **Decision required:** for every undocumented difference, stop and ask the user whether to **keep** the current implementation, **change** it to match the reference, **remove** it, or **update** the reference.

Do not silently remove, restyle, replace, or extend current UI because a board differs. After the user decides, document the approved decision in the affected frontend/design/product Markdown before making the related change.

## Implementation rules

- Reuse the existing Rafiqi visual language: semantic theme tokens, shadcn-style primitives, shared shell, spacing, cards, responsive layouts, and `next-intl` translations.
- Preserve the current route and feature structure where possible; otherwise, create a new route or feature if needed and the best fit.
- Check the affected UI at desktop and mobile widths, in English LTR and Arabic RTL. Use logical CSS properties and translated copy that reflects the intended user experience.
- Include the relevant visible states: loading, populated, empty, error, permission-denied, disabled, and success when the flow needs them or the user can take action.
- After changes, compare the rendered implementation against the selected design reference and document any intentional, approved differences.

## Design and story mismatch gate

Before changing UI, compare the request with the relevant design, MVP plan, user stories, and product documentation.

If the request is absent from the approved design, conflicts with it, or the implementation intentionally differs from it:

1. Stop before editing implementation, design, stories, or product documentation.
2. Clearly name the mismatch and the affected reference files.
3. Ask whether to update the design/reference or continue following the existing design.
4. After explicit confirmation, record the decision in the relevant design or product Markdown.
5. When replacing a reference, mark the prior guidance as deprecated and link to its replacement; never silently overwrite or deprecate it.
