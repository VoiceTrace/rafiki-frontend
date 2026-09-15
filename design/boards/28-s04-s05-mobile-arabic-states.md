# Board 28 - S04/S05 mobile Arabic RTL states

![S04/S05 mobile Arabic RTL states](28-s04-s05-mobile-arabic-states.png)

## Purpose

Mobile Arabic RTL companion for [Board 26](26-s04-warmup-submitted.md) and [Board 27](27-s05-question-sent.md).

## Approval

**Approved for the B5/B7 frontend-only slice (2026-09-13).** This is the mobile Arabic RTL companion specification for Boards 26 and 27. It extends the existing S04/S05 structures and does not authorize backend delivery, persistence, or real teacher visibility.

## States shown

1. S04 answer checking.
2. S04 supportive submitted/saved feedback.
3. S05 question compose/sending.
4. S05 sent, pending, failed/retry, and class-start locked direction.

## Implementation rules

- Retain S04/S05 structure and cards rather than making generic chat or quiz views.
- Use Arabic RTL layout, logical properties, mirrored directional icons, and touch-friendly controls.
- Review Arabic copy before release; generated text is visual direction only.
