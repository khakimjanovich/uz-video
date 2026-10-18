# Series B — review checklist (drafts made 2026-10-18 night)

All 25 episodes are first drafts: script → map + diagram steps → voice (Andrew) → stills checked → rendered to `out/yt-NN-*-dark.mp4`. Nothing is pushed.

For each episode: watch it, tick what matches reality, and note anything to change. Legend:
- **Code** = taken from the real repo (`asakabank/open_banking`).
- **Design** = our teaching design; not in the real code today (decide if the series should say it).
- **Check** = I'm not sure it matches how the bank really works.

| Ep | Title | Length | What to check |
|---|---|---|---|
| 00 | The map | 1:43 | Part list and order; Kafka/observability/Kubernetes placement. Updated: Keycloak arrives in Part 1, Vault in Part 4 |
| 01 | Acquiring in 5 minutes | 1:11 | ✅ Reviewed 2026-10-19. Code: Uzcard single-step debit (`trans.pay.purpose`), Humo hold then immediate capture (SOAP `Payment` ×2), terminal per sales point + scheme. **Open: reversal vs refund rule per scheme (waiting for Uzcard/Humo docs)** |
| 02 | Setup | 1:42 | ✅ Reviewed 2026-10-19, updated to match `ecom@ep-02`: platform libraries (version catalog, openapi, error-starter), layer packages and constants, database user per module, three test kinds, code beats from the real files |
| 03 | Domain → contract → database | 1:45 | ✅ Updated 2026-10-19 to match `ecom@ep-03`: entity rule, one-page sketch, spec in platform/openapi, generated jar, migration, own data source, layers, PARTNER_NOT_FOUND problem detail, unit + integration tests, Swagger UI, k6 numbers |
| 04 | Registration + email OTP | 1:08 | ✅ Built and matched to `ecom@ep-04`: register / verify / resend contract, otp-starter (hashed codes in Redis, ttl, attempt and send limits), notification service over Spring Mail + Mailpit, stable error codes, k6 registration scenario (4,931 flows in 30 s) |
| 05 | Partner lifecycle | 1:22 | ✅ Built and matched to `ecom@ep-05`: transition table in `PartnerStatus`, email before verify, unique contract number, status history, activate/restore from their own state, admin header until 07, tests, k6 (3,095 lifecycles in 30 s) |
| 06 | Four-eyes | 1:18 | ✅ Built and matched to `ecom@ep-06`: activation request, decided once, no self-approval, configured expiry, ShedLock sweep, partial unique index, tests, k6 (2,838 activations in 30 s) |
| 07 | Logins and API clients | 1:17 | ✅ Built and matched to `ecom@ep-07`: Keycloak realm, password only in Keycloak, partner role on email verification, route rules, admin name from token, M2M clients with rotation, full-app IT, k6 with tokens. Vault moved to 14 |
| 08 | Sales points + site check | 0:43 | **Check: video says two admins check the site; in code a site check is recorded by one admin** (two-admin is your stated process for KYB). Added 2026-10-19: refund window from the deal (code: `refundWindowDays`, `extendedRefundDays` + `extendedRefundReason`, capped) |
| 09 | Extract the starters | 0:43 | Code: error/security/otp/redis starters exist |
| 10 | Commission | 0:47 | Code: scope priority, tie by priority, fee ≥ amount refused, maker-checker, history, fee snapshot |
| 11 | Terminals (MID/TID) | 0:38 | Code: EPOS per sales point and scheme, fail closed, audit log |
| 12 | Uzcard + Humo adapters | 0:46 | Code: REST (SVGate) + SOAP (Humo), command pattern. Check: "errors translated to our own codes" |
| 13 | BIN registry + card vault | 0:41 | Code: BIN sync job, AES-GCM, token, reveal only to processing, card audit trail |
| 14 | HMAC + idempotency | 1:05 | Code: HMAC fields, timestamp window, nonce, idempotency semantics, fail closed. Design: Vault path `secret/merchants` (real: `HMAC_SECRET_<clientId>` provisioned by DevOps) |
| 15 | Hosted page: card → OTP | 0:42 | Code: hashed session token + TTL, OTP by scheme or SMS, Redis lock, attempt limits (card attempts are hardcoded to 3 in code) |
| 16 | The debit | 0:44 | Code: atomic claim, terminal, fee snapshot, journal, authorize + capture, RRN, state machine |
| 17 | Observability | 0:42 | **Design: no metrics/tracing in the real repo today** |
| 18 | When processing goes silent | 0:39 | Code: Temporal resolution, backoff, manual review, sweep every minute |
| 19 | Outbox + Kafka | 0:39 | Code: `event_outbox` is written. **Design: relay + Kafka + webhook consumer don't exist yet** |
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
