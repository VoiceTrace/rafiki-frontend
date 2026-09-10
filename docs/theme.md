# Rafiqi theme and shell

Visual sources: `design/boards/01-teacher-today.png`, `16-mobile-flows.png`, `17-arabic-rtl.png`, and `18-components-states.png` in the parent product workspace.

## Token mapping
| Reference | Semantic token | Usage |
| --- | --- | --- |
| Orange #F57436 | primary / sidebar-primary | Wordmark, primary controls |
| Peach #FFE8DF | secondary / accent / sidebar-accent | Selected navigation and quiet emphasis |
| Ink #20252B | foreground / card-foreground | Headings and primary text |
| Muted #6B7280 | muted-foreground | Supporting text, inactive mobile navigation |
| Warm canvas #F7F7F5 | background | Page background |
| White #FFFFFF | card / popover / sidebar | Surfaces, header, mobile bar, menus |
| Assistant #EADFFD | assistant | Companion surfaces |
| Success #DFF3E4 | success | Positive feedback surfaces |
| Soft neutral line | border / sidebar-border | Surface boundaries |

Colors are stored as OKLCH values in `src/app/globals.css`. Selected navigation uses a darker orange foreground for legibility on peach. Existing generated dark infrastructure remains, without introducing a new dark design.

## Scale
- Geist and Geist Mono remain configured through next/font. Arabic uses the system Tahoma/Arial stack through the shared type system.
- Page / section / card-title utilities: 32 / 24 / 18px; body 16px; UI 14px; captions 12px.
- Standard font weights: regular, medium, semibold, bold.
- Base radius 12px, derived shadcn radius scale, restrained surface and overlay shadows.
- Spacing follows Tailwind's 4px rhythm: 16–32px page padding, 12px navigation gaps, 48px minimum desktop navigation targets.
- Desktop sidebar 240px; tablet rail 80px; header 72px.
- Mobile navigation follows the reference's full-width white bottom bar, with a bottom sheet for secondary destinations.

## Architecture
The base-nova configuration and existing `src/components/ui/*` primitives are preserved. Shared navigation consumes semantic Tailwind utilities; the former shell CSS module and private color variables are removed.

The header search filters the current role's real navigation destinations. It does not imply student, course, or resource data search is implemented. Locale switching reloads the same route in the other language so document lang and dir are updated consistently.

Teacher and student content pages remain minimal. `/en/theme-preview` and `/ar/theme-preview` are development-only component checks and return not-found in production.

## Verification
`scripts/verify-shell.mjs` checks both roles in both locales at 320, 390, 768, 1024, and 1440px, including mobile links, menu bounds, keyboard focus, active states, and locale switching. Results and screenshots are in `verification/`.

Run `npm run lint`. To build while next dev remains running, set `NEXT_BUILD_DIR=.next-production` and run `npm run build`; this preserves the dev server's .next state.
