# shadcn audit

**Date:** 2026-09-16  
**Mode:** Architecture review only — no product code or dependencies changed.

## Result

No immediate shadcn registry installation or automatic component replacement is recommended. The project already provides the core primitives it uses, and the larger custom surfaces are product-specific compositions rather than duplicate primitives.

## Installed primitives to continue using

| Primitive | Recommended use |
| --- | --- |
| Button | Actions, links rendered as buttons, icon controls, submit actions |
| Card | Dashboard sections, feature panels, and structured information blocks |
| Checkbox | Task completion, learning progress, and review controls |
| Dialog | Confirmations, mobile menus, search overlays, and event editing |
| Field, Input, Label, Textarea | Forms and editor fields |
| Select | Controlled selection interfaces where the existing custom/native select is insufficient |
| Separator, Skeleton, Spinner | Visual separation and loading feedback |

## Keep custom

| Surface | Decision | Reason |
| --- | --- | --- |
| Application shell | Keep custom composition | Role-aware navigation, locale switching, search, desktop rail, and mobile menu are app-specific. |
| Rafiqi conversation | Keep custom composition | Assistant/student messages, prompt suggestions, attachments, and conversation state are domain-specific. |
| Student calendar | Keep feature-local | Event state, day/week/month views, and editing workflow exceed a generic primitive. |
| Study Cave | Keep feature-local | It combines lesson phases, session access, notes, learning review, and assistant support. |
| Teacher lesson preparation | Keep feature-local | Generation/review status and editable lesson artifacts are workflow-specific. |

## shadcn candidates — defer

| Candidate | Decision | Why |
| --- | --- | --- |
| Tabs | Defer | Existing lesson-stage and calendar-view controls have different state/routing contracts. A shared tabs primitive would not yet simplify them. |
| Accordion | Defer | The learning map uses semantic native `details`/`summary`, which is already accessible and adequate. |
| Calendar / Date Picker | Defer | The schedule needs a workflow calendar and uses a native date input; a registry date picker would add dependencies without a demonstrated need. |
| Select replacement for schedule recurrence | Defer | The native select is accessible. Consider the installed Select only during a real schedule-editor UX change. |

## Explicit non-actions

- Do not install a shadcn registry component merely because an equivalent exists.
- Do not replace working custom workflow components without a measurable consistency, accessibility, or maintenance benefit.
- Do not introduce generic Card, Section, FormField, or List wrappers for one-off markup.

## Recommendation for future changes

When a new UI requirement arrives, first check `src/components/ui` and compose an installed primitive. If none fits, evaluate an official shadcn registry component for dependencies, Base UI compatibility, RTL support, accessibility behavior, and fit with the project tokens before requesting approval to install it.
