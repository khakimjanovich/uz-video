# heeyPay Acquiring — Video Products

Workflow: **plan → script (`reels/<id>/script.txt`) → steps + voice → stills check → render on request**.
English first (TTS voice); an Uzbek copy only when asked. Videos never end on a question.

## Products

| Product | Audience | Goal | Status |
|---|---|---|---|
| **Series B, build an acquiring system**: [`SERIES-BUILD.md`](SERIES-BUILD.md) | backend developers new to payments | build a working acquiring system | producing |

Retired on 2026-10-18: Tier 1 (`ep01`–`ep07`) and Tier 2 (`t2-00`–`t2-08`). The owner pitch was retired on 2026-11-01 (tag `owner-pitch`). Restore from commit `67f4751` if ever needed.

## Rules for every video

- **Audience first:** pick one audience and one action before writing a line.
- **Picture first:** the picture carries the idea, the voice explains why, on-screen text stays short. Show the process, not the label.
- **Order by the viewer's questions:** each block arrives because a problem needs it.
- **Emotion:** a person + stakes + change. Keep the hero on screen; every protection protects someone the viewer cares about.
- **Worry → relief:** show the threat coming (never the disaster landing), then the fix.
- **Signposting:** name a list once, then number each item as it arrives, with the same name and look.
- **Terms:** widely known industry names (replay attack, HMAC, nonce, idempotency key, maker-checker), never invented ones.
- **Sources:** the story comes from the BRD; precision comes from the code. Never mention build status ("planned", "not live"). Settings in the code are "the configured time / role / limit", never their default number.

## Later MVPs (BRD only)

Saved cards & recurring (MVP 2) · Invoicing by phone number (MVP 3) · Mobile SDK (MVP 4) · Split payments (MVP 5) · Hold & capture + OFD receipt (MVP 6) · UzQR & MUNIS (separate topic).
