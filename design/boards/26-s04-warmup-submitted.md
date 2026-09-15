# Board 26 - S04 warm-up submitted

![S04 warm-up submitted](26-s04-warmup-submitted.png)

## Purpose

Standalone desktop reference for **B5 Student warm-up (Prime)** after an answer is submitted. It extends S04 Ask Rafiqi — Warm-up without becoming a separate quiz experience.

## Approval

**Approved for the B5 frontend-only slice (2026-09-13).** Together with [Board 28](28-s04-s05-mobile-arabic-states.md), this is the UI-state specification for local/demo answer selection, checking, feedback, saved, retry, progress, and completed/locked states. It extends S04; it does not replace the existing Study Cave structure.

## Required UI

- Retain the warm-up question, answer options, Rafiqi companion, follow-up chat, and Ask your teacher area.
- Show answer feedback, progress, saved status, and Continue to Study Cave.
- Define loading, retry, saved, and completed/locked direction in context.

## Boundary

This is UI direction only. Answer persistence, feedback generation, and locking require later services.
