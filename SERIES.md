# heeyPay Acquiring — Video Products

Workflow: **plan → script (`reels/<id>/script.txt`) → steps + voice → stills check → render on request**.
English first (TTS voice); an Uzbek copy only when asked. Videos never end on a question.

## Products

| Product | Audience | Goal | Status |
|---|---|---|---|
| **Owner pitch**: `pitch-owners`, `pitch-owners-uz` | bank owners | buy or invest | final |
| **Series B, build it yourself**: plan in [`SERIES-BUILD.md`](SERIES-BUILD.md) | backend programmers | build a working acquiring system | planning |

Retired on 2026-10-18: Tier 1 (`ep01`–`ep07`) and Tier 2 (`t2-00`–`t2-08`). They mixed both audiences; the owner pitch and Series B replace them. Restore from commit `67f4751` if ever needed.

## Rules for every video

- **Audience first:** pick one audience and one action before writing a line.
- **Picture first:** the picture carries the idea, the voice explains why, on-screen text stays short. Show the process, not the label.
- **Order by the viewer's questions:** each block arrives because a problem needs it.
- **Emotion:** a person + stakes + change. Keep the hero on screen; every protection protects someone the viewer cares about.
- **Worry → relief:** show the threat coming (never the disaster landing), then the fix.
- **Signposting:** name a list once, then number each item as it arrives, with the same name and look.
- **Terms:** widely known industry names (replay attack, HMAC, nonce, idempotency key, maker-checker), never invented ones.
- **Sources:** the story comes from the BRD; precision comes from the code. Never mention build status ("planned", "not live"). Settings in the code are "the configured time / role / limit", never their default number.

## Owner pitch (final)

Aziza, a toy-figure shop owner, is the hero. Feeling journey: regret → hope → worry/relief → good greed.
Opening (Aziza, money skips the bank) → commission + deposits → alert ("four threats") → 1 fake shop, 2 forged payment, 3 double charge, 4 card theft (each worry → relief) → money flow → summary.

## Later MVPs (BRD only)

Saved cards & recurring (MVP 2) · Invoicing by phone number (MVP 3) · Mobile SDK (MVP 4) · Split payments (MVP 5) · Hold & capture + OFD receipt (MVP 6) · UzQR & MUNIS (separate topic).
