# Series B — review checklist

Episodes 00–24 are built in the ecom repos (tag `ep-NN`) and matched to them: script → map, diagram and code steps quoted from `main` → voice → stills checked. Episodes 17–24 are not rendered. Episode 25 is still a plan. A consistency pass on 2026-10-20 checked every code beat against `main`, every reel's cues against its titles and steps, and the docs.

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
| 11 | e-POS terminals (MID/TID) | 1:05 | ✅ Re-cut 2026-10-19: e-POS terminal search (filters, MID/TID search, history); no tests/k6 |
| 12 | Uzcard + Humo adapters | 1:29 | ✅ Re-cut 2026-10-19: adapters as separate services with their own contracts, envelope, commands, status YAML, card module over the clients; no sandbox/tests |
| 13 | BIN registry + card vault | 1:26 | ✅ Re-cut 2026-10-19: BIN sync through the adapters; no Luhn-sandbox, IT or k6 beats |
| 14 | HMAC + idempotency | 1:31 | ✅ Re-cut 2026-10-19: the bank puts signing keys straight into Vault; the app only reads them; no k6 |
| 15 | The payment page | 1:38 | ✅ Built and matched to `ecom@ep-15`: token as credential (hash, expiry), read-only page, scheme checked first, a code per binding, every attempt counted and committed first, page closes, Redis lock |
| 16 | The debit | 1:22 | ✅ Built and matched to `ecom@ep-16`: one conditional claim, route and fee fixed, journal first with one debit per payment, paid/declined/unknown, status table |
| 17 | Observability | 1:39 | ✅ Built and matched to `ecom@ep-17`: OpenTelemetry agent from infra, one trace across services, logs with trace ids, debit metrics, OTLP stack, payments dashboard (not rendered) |
| 18 | When processing goes silent | 1:20 | ✅ Built and matched to `ecom@ep-18`: Temporal resolution workflow with growing waits, same reference, manual review, one workflow per payment, sweep (not rendered) |
| 19 | Outbox + Kafka | 1:37 | ✅ Built and matched to `ecom@ep-19`: final statuses raise an event saved to the outbox in the same transaction, relay with skip locked to Kafka keyed by payment, one webhook per website on its own domain, signed like requests, retries then a dead-letter topic, every attempt logged (not rendered) |
| 20 | Payment links | 1:20 | ✅ Built and matched to `ecom@ep-20`: links made in the portal for live websites only, same page and debit, no client or return address, token shown once, length capped by config, expiry sweep with skip locked, EXPIRED as a final status with its event (not rendered) |
| 21 | Refunds and reversals | 1:25 | ✅ Built and matched to `ecom@ep-21`: the day decides (settlement time zone), reversal (Uzcard `trans.reverse`, Humo `CancelRequest`) or refund within the website's window (Humo `ReturnPayment`), whole amount only, one claim, journal first, refused stays paid, no answer stays RETURNING, event + webhook (not rendered) |
| 22 | Daily reports | 1:15 | ✅ Built and matched to `ecom@ep-22`: business day in the settlement time zone, paid (not reversed) and refunded that day, payout = net − refunded (fee kept on refunds), rebuilt rows replaced, nightly job rebuilds the last days, CSV per day with quoted cells, portal page (not rendered). Replaces the planned API-usage billing |
| 23 | Hardening: limits | 1:20 | ✅ Built and matched to `ecom@ep-23`: per-website limits set by the bank (one payment, one business day), checked by entity and database, one payment refused at creation, daily total reserved in one conditional upsert before the scheme call, released on decline or reversal, kept on unknown (not rendered). Earlier planned gaps (nonce order, KYB at activation) were already closed in episodes 06 and 14 |
| 24 | Deploy to Kubernetes | 1:20 | ✅ Built and matched to `ecom-infra@ep-24`: Kustomize base (3 app replicas, 2 per service), one Dockerfile, Boot probes, rolling update + preStop + 60 s grace, ConfigMap + Secret from Vault, jobs safe on every replica, HPA 3–6 and PDB; local k3s overlay; verified by deleting a pod under k6 load with 0 failed checks (not rendered). Kustomize instead of Helm |
| 25 | Extract the card vault | 0:29 | ⏸ Not built: paused (work in progress kept as a git stash in ecom: card contract with internal paths, card-client, problems forwarded unchanged). The draft video is the old plan |

## Facts learned in review
- Card-processor service only binds cards and reveals numbers; debits live in the payment service and the two adapters.
- `CaptureMode.MANUAL` exists in the schema but is rejected; only automatic capture is built (it matters only for Humo).

## Known rough edges (visual)
- Diagram text is small at 16:9 (boxes are scaled to 62%); fine full-screen, small in a thumbnail.
- The voice still has short pauses between sentences (per-sentence voicing was deferred).
- Some edge labels sit close to boxes.

## Not done (by your instruction)
- No companion code yet: videos first, code after your review.
