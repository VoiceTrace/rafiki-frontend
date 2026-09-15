# Board 20 - S06 live-session states, mobile Arabic RTL

![MVP live session mobile Arabic RTL](20-mvp-live-session-mobile-arabic.png)

## Purpose

Responsive Arabic RTL student companion to [Board 19](19-mvp-live-session-lifecycle.md) for C1/C2 implementation review. Every phone is the existing **S06 · Study Cave · During class** structure, with a compact state layer above—not a separate mobile dashboard.

## States shown

1. **Ready to join:** a compact Arabic join card above notes, Rafiqi observations, matching notes, and live lesson context.
2. **Reconnecting:** an Arabic retry state while the existing study content stays visible.
3. **Connected:** a green Arabic live banner above the unchanged Study Cave panels.
4. **Ended/locked:** a compact completion summary while notes and the class record remain available.

## Implementation rules

- Use Arabic RTL layout, logical spacing, and mirrored directional icons.
- Preserve the same state meaning and action hierarchy as the desktop board.
- Preserve the S06 header, phase tabs, class notes, Rafiqi insight, matched notes, and lesson-context cards. Do not reduce it to a join screen.
- Review Arabic educational copy before production release; generated visual copy is direction only.

## Frontend implementation note (2026-09-13)

The approved state layer is implemented in the existing Study Cave page as local UI only. For review, `?phase=during&session=ready|joining|connected|reconnecting|failed|locked` selects the state without creating, joining, synchronizing, or locking a real class session. This is an intentional C1/C2 frontend-slice boundary, not a replacement for the later backend/realtime implementation.

## Revision

The previous generic mobile lifecycle composition is **deprecated** as of 2026-09-13. This replacement is the approved direction because it keeps the existing S06 Study Cave page in every state.
