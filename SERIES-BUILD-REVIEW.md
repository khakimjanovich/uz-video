# Series B — review checklist (drafts made 2026-10-18 night)

All 25 episodes are first drafts: script → map + diagram steps → voice (Andrew) → stills checked → rendered to `out/yt-NN-*-dark.mp4`. Nothing is pushed.

For each episode: watch it, tick what matches reality, and note anything to change. Legend:
- **Code** = taken from the real repo (`asakabank/open_banking`).
- **Design** = our teaching design; not in the real code today (decide if the series should say it).
- **Check** = I'm not sure it matches how the bank really works.

| Ep | Title | Length | What to check |
|---|---|---|---|
| 00 | The map | 1:51 | ✅ Re-cut 2026-10-19: separate services row (file service, adapters), S3 on the map |
| 01 | Acquiring in 5 minutes | 1:11 | ✅ Reviewed 2026-10-19. Code: Uzcard single-step debit (`trans.pay.purpose`), Humo hold then immediate capture (SOAP `Payment` ×2), terminal per sales point + scheme. **Open: reversal vs refund rule per scheme (waiting for Uzcard/Humo docs)** |
| 02 | Setup | 1:52 | ✅ Re-cut 2026-10-19 to the final design: Groovy build, platform, version catalog, one error format, contracts, separate services, infra repo |
| 03 | Domain → contract → database | 1:27 | ✅ Re-cut 2026-10-19: no test or k6 beats; current error format |
| 04 | Registration + email OTP | 1:07 | ✅ Re-cut 2026-10-19: OTP library, `otp-exception.yaml`; no k6 beat |
| 05 | Lifecycle + documents | 1:38 | ✅ Re-cut 2026-10-19 as "Lifecycle + documents": KYB uploads to the file service (S3), document review, verify needs the required documents |
| 06 | Four-eyes | 1:13 | ✅ Re-cut 2026-10-19: request/list/approve/reject calls, KYB checked again on open and approve; no tests/k6 |
| 07 | Logins and API clients | 1:09 | ✅ Re-cut 2026-10-19: three realm roles (admin, partner, merchant), route rules in config, name from token, secrets never stored |
| 08 | Sales points + site check | 1:17 | ✅ Re-cut 2026-10-19: sales point logo in its own bucket; no tests/k6/bug beats |
| 09 | Platform libraries | 1:04 | ✅ Re-cut 2026-10-19 as "Platform libraries": security + keycloak libraries, version catalog; no refactor or test beats |
| 10 | Commission | 1:18 | ✅ Re-cut 2026-10-19: filters, levels and history added; no tests/k6 |
| 11 | Terminals (MID/TID) | 1:05 | ✅ Re-cut 2026-10-19: terminal search (filters, MID/TID search, history); no tests/k6 |
| 12 | Uzcard + Humo adapters | 1:29 | ✅ Re-cut 2026-10-19: adapters as separate services with their own contracts, envelope, commands, status YAML, card module over the clients; no sandbox/tests |
| 13 | BIN registry + card vault | 1:26 | ✅ Re-cut 2026-10-19: BIN sync through the adapters; no Luhn-sandbox, IT or k6 beats |
| 14 | HMAC + idempotency | 1:31 | ✅ Re-cut 2026-10-19: the bank puts signing keys straight into Vault; the app only reads them; no k6 |
| 15 | The payment page | 1:38 | ✅ Built and matched to `ecom@ep-15`: token as credential (hash, expiry), read-only page, scheme checked first, a code per binding, every attempt counted and committed first, page closes, Redis lock |
| 16 | The debit | 1:22 | ✅ Built and matched to `ecom@ep-16`: one conditional claim, route and fee fixed, journal first with one debit per payment, paid/declined/unknown, status table |
| 17 | Observability | 1:39 | ✅ Built and matched to `ecom@ep-17`: OpenTelemetry agent from infra, one trace across services, logs with trace ids, debit metrics, OTLP stack, payments dashboard (not rendered) |
| 18 | When processing goes silent | 1:20 | ✅ Built and matched to `ecom@ep-18`: Temporal resolution workflow with growing waits, same reference, manual review, one workflow per payment, sweep (not rendered) |
| 19 | Outbox + Kafka | 1:37 | ✅ Built and matched to `ecom@ep-19`: final statuses raise an event saved to the outbox in the same transaction, relay with skip locked to Kafka keyed by payment, one webhook per website on its own domain, signed like requests, retries then a dead-letter topic, every attempt logged (not rendered) |
| 20 | Payment links | 0:27 | Code: link claim, expiry sweep |
| 21 | Refunds and reversals | 0:32 | **Design: no refund/reversal code in the payment service yet.** Code groundwork only: refunds table, PARTIALLY_REFUNDED/REFUNDED states, DB check refunded ≤ captured, `refund_deadline_at` column (unused). Adapters expose Humo `ReturnPayment` (full only) and Uzcard `trans.reverse` (full). Partial refunds not wired. Refund window now points back to Ep 08; **not enforced in the payment service yet** (`refund_deadline_at` unused) |
| 22 | Billing and reports | 0:26 | Code: billing flush (Spring Batch). **Check: usage counters in Redis; the daily report** (from the BRD, not seen in code) |
| 23 | Hardening | 0:34 | Code gaps found in review: nonce/timestamp window, nonce before signature, KYB not required at activation, no payment limits |
| 24 | Deploy to Kubernetes | 0:38 | Design: Helm, probes, Vault at startup, 3 replicas. ShedLock is real |
| 25 | Extract a module | 0:29 | Code: mirrors the real card-processor-service |

## Facts learned in review
- Card-processor service only binds cards and reveals numbers; debits live in the payment service and the two adapters.
- `CaptureMode.MANUAL` exists in the schema but is rejected; only automatic capture is built (it matters only for Humo).

## Known rough edges (visual)
- Diagram text is small at 16:9 (boxes are scaled to 62%); fine full-screen, small in a thumbnail.
- The voice still has short pauses between sentences (per-sentence voicing was deferred).
- Some edge labels sit close to boxes.

## Not done (by your instruction)
- No companion code yet: videos first, code after your review.
