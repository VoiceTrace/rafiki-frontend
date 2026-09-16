# Board 31 — S11 first-time onboarding mobile Arabic RTL

![Mobile Arabic RTL onboarding states](31-s11-onboarding-mobile-arabic.png)

[Open editable SVG](31-s11-onboarding-mobile-arabic.svg)

## Superseded proposal

**Superseded on 2026-09-14 by [Board 32 — First-login student onboarding](32-first-login-onboarding.md).** The revised requirement places onboarding immediately after first login, before the student  workspace.

## Status

**Proposed companion board for Board 30. Do not implement yet.** It validates the mobile hierarchy and RTL direction for the same A2/A3 concept.

## Frames

1. **Welcome:** Rafiqi introduction, voluntary-sharing note, primary start action, and persistent **تخطي الآن**.
2. **Question:** one prompt, suggestion chip, composer, and a live profile update.
3. **Complete:** first-profile confirmation with editable certainty-labelled cards.

## Arabic design copy

| English intent | Arabic label |
| --- | --- |
| Skip for now | تخطي الآن |
| Meet your learning companion | تعرّف إلى رفيقك في التعلّم |
| A private two-minute chat | محادثة خاصة لمدة دقيقتين |
| Let’s get to know each other | لنبدأ التعرّف عليك |
| What do you enjoy learning or doing outside class? | ما الذي تستمتع بتعلّمه أو فعله خارج الفصل؟ |
| How Rafiqi understands you | كيف يفهمك رفيقي |
| Your first profile is ready | ملفك الأول جاهز |
| Not quite me? | لستُ كذلك تمامًا؟ |

Arabic copy should receive a final product-language review before implementation; the board establishes direction and hierarchy.

## RTL and mobile rules

- Align Arabic headings, prompts, and profile labels to the logical start edge.
- Keep progress and quiet actions in reading order; mirror directional send icons.
- Stack chat before profile and keep both within the same page. Do not open a separate form or route.
- Use full-width controls where possible and maintain at least 44 px touch targets.
- Announce the updated profile card after an answer without moving keyboard or screen-reader focus unexpectedly.
- Keep the certainty label written in Arabic in implementation; color alone is insufficient.

## Boundary

This board is a visual and interaction reference only. It does not change the current frontend or approve persistence, inference, or sharing behavior.

