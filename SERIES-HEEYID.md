# heeyID: Build a customer identity platform

A course that teaches a backend developer who is new to identity to build heeyID MVP 1 from zero: a platform that a bank installs inside its own perimeter to register a customer, prove the customer once with MyID, link the customer to the bank's records, and keep the customer signed in on a trusted phone.

- **Sources:** BRD v2.3 (story), SRS MVP 1 v3.7 (behaviour, `SRS-*` ids), SAD MVP 1 v3.8 (design, `ADR-*`, `C-*`), all of 10.11.2026. Until the code exists, precision comes from the SRS and SAD; after the build, each video is re-cut from the code.
- **Workflow:** docs → design video (this map, then brief → script → voice → stills) → gap list back into SRS/SAD → build the `heeyid` repo lesson by lesson (SAD §10.1) → re-cut the video from the code.
- **Format:** one concept per lesson, 4–7 minutes, 16:9, why and how it works. English only.
- **No code on screen for now:** code appears only after it exists in the repo, shown as it really is, never as a planned layout or a step-by-step edit. Otherwise every change to the code means a second change to the video.
- **Ids:** `h-NN-<slug>` under `studio/src/reels/`, Studio folder `heeyID`, node catalogue in `studio/src/series/heeyid/`.
- **Rules:** all of [`SERIES.md`](SERIES.md). Generic names on screen ("the bank", "the national ID service" may say MyID, since it is the one real provider); no bank names.

## The hero

**Aziz**, a customer of the bank. He uses three apps of the bank: the mobile bank (the master app, the only one with MyID and TAF), the marketplace and the credit conveyor (side apps). One phone number and one password open all of them. He proves who he is one time, in the master app, and all three apps trust it. The threat that follows him through the course: someone else with his old phone number, or a new phone that is not his.

## Lesson map (MVP 1)

Each lesson arrives because the one before it leaves a question open.

### Module 1. Orientation
| # | Id | Concept | Sources |
|---|---|---|---|
| 1 | `h-01-map` | The build map: bank perimeter, edge, two gateways, Keycloak, workers, four stores, TAF, MyID and the bank's services | SAD §1, §3.1–3.2, §8 |
| 2 | `h-02-one-identity` | Why: prove once, reuse in every app of the bank; master app and side apps; one installation per bank | BRD §2, FR-84, FR-91, SAD §1 |
| 3 | `h-03-identity-words` | Authentication vs identity proofing vs authorisation; assurance level 1 and 2; OAuth 2.1 / OIDC, PKCE, DPoP | SRS §2, C-2 |

### Module 2. Foundations
| # | Id | Concept | Sources |
|---|---|---|---|
| 4 | `h-04-perimeter` | One installation per bank, two zones (stage, production), no call to the vendor, data stays in Uzbekistan; the TAF agent already runs in the bank's network | C-1, C-11, C-16, SRS-TEN-01, SRS-TST-01 |
| 5 | `h-05-apps` | One person, one password, one account per app, many sessions; one Keycloak realm, one client per app, tokens with aud = the app; session rank and probation | C-1, A6, ADR-32…35, SRS-APP-01…12 |
| 6 | `h-06-configuration` | Deploy config fails fast; policies and texts come from the catalogue and change with maker-checker | C-12, ADR-28, SRS-ADM-07 |
| 7 | `h-07-adapters` | Domain with no I/O, ports and adapters (TAF, MyID, SMS, push, lookup), simulators, timeout and breaker per dependency | C-15, SAD §8, §10.1 |
| 8 | `h-08-keys` | Vault: installation keys, MyID and TAF credentials, FCM credential, audit HMAC key; key custody | SAD §7.2 |
| 9 | `h-09-api-contract` | No heeyID SDK in MVP 1: the OpenAPI contract and the integration guide; the bank adds the MyID and TAF SDKs to the master app; what the app keeps (device id, tokens, PIN digest) and never keeps (password, personal identification number) | SAD §3.2, A7, ADR-14, §7.3 |

### Module 3. Registration (level 1)
| # | Id | Concept | Sources |
|---|---|---|---|
| 10 | `h-10-registration` | Phone number, one-time code sent through TAF, password entered two times; new, active and blocked numbers | SRS-REG-01…07, SAD §4.1 |
| 11 | `h-11-codes-and-limits` | One-time codes, counters and cool-downs in Valkey | SRS-REG-06, SRS-BLK-01 |
| 12 | `h-12-taf-verdict` | TAF: basic and risk verdict, green / yellow / red, waiting time, fallback to the bank's SMS (not scored), the my.gov.uz trusted-bank stop, face confirmation for level 2, phone ownership | C-16, ADR-30, SRS-AF-01…08, SAD §4.14 |
| 13 | `h-13-password` | Argon2id digest, wrong-password lock, change, and the waiting reset (SMS reset in side apps) | SRS-REG-10, SRS-DEV-16…17, SAD §4.13 |

### Module 4. Proofing (level 2)
| # | Id | Concept | Sources |
|---|---|---|---|
| 14 | `h-14-consent` | Consent gate before each MyID call; versioned consent screens | SRS-CON-01…03, SAD §4.2 |
| 15 | `h-15-myid-proofing` | Native in-app MyID, the backend opens the session, one-use result code, lost code | C-7, C-13, SRS-PRF-01…11, SAD §4.3 |
| 16 | `h-16-prove-once` | Re-check instead of full proofing while the reusable id is valid; MyID only when needed | C-8, SRS-PRF-08, SAD §1 |
| 17 | `h-17-verified-identity` | The protected class: encrypted with bank keys, versions, masked reads, each release audited | SAD §3.3 #6, SRS §6.3 |
| 18 | `h-18-phone-check` | Compare with MyID's phone list (old numbers), then TAF phone ownership, then phone review | C-14, SRS-PRF-12, SRS-REV-01…02, SAD §4.8 |
| 19 | `h-19-linking` | Link to the bank customer by personal identification number, retry, comparison note | C-9, SRS-LNK-01…07, SAD §4.4 |

### Module 5. Devices and login
| # | Id | Concept | Sources |
|---|---|---|---|
| 20 | `h-20-trusted-device` | Device record, Known and Trusted, binding check, PIN | SRS-DEV-01…07, SAD §4.5 |
| 21 | `h-21-access-grants` | Tokens issued by Keycloak through the gateway, session assurance level, renewal that never stops | C-3, C-6, SRS-DEV-04, SAD §4.5 |
| 22 | `h-22-step-up` | Each app has a required level; the platform never refuses a step-up | SRS-REG-08…09, SRS-DEV-08 |
| 23 | `h-23-known-device-login` | Password, then one-time code, on a known device | SRS-DEV-09, SAD §4.9 |
| 24 | `h-24-new-device` | New-device code by TAF SMS to the new phone; the other phone approves or says "This was not me"; push with no code; the code alone after the approval wait | SRS-DEV-10…15, SRS-NTF-04, SAD §4.10 |
| 25 | `h-25-number-changes` | Number on hold after "This was not me", re-registration, number reassignment, dormant account, the marketplace account link | SRS-PRF-14…16, SAD §4.11 |
| 26 | `h-26-remote-access` | Remote-access event from the app | SRS-DEV-12, SAD §4.12 |

### Module 6. Lifecycle and trail
| # | Id | Concept | Sources |
|---|---|---|---|
| 27 | `h-27-refresh` | Identity refresh, document expiry, restricted flag | SRS-RFR-01…04, SAD §4.6 |
| 28 | `h-28-blocking` | Blocks, revocation list, cases | SRS-BLK-01…06, SAD §4.7 |
| 29 | `h-29-notifications` | Outbox on Kafka, SMS and push templates, content rules; codes go through TAF, the bank's SMS only as fallback | SRS-NTF-01…04 |
| 30 | `h-30-audit` | Audit chain with HMAC, the shape the bank's security monitoring reads, antifraud events | SRS-AUD-01…04, C-10, SRS §5.4 |

### Module 7. Operations and delivery
| # | Id | Concept | Sources |
|---|---|---|---|
| 31 | `h-31-admin-panel` | Staff identity, roles, proposals with maker-checker, cases, phone reviews, exports | SRS-ADM-01…07 |
| 32 | `h-32-test-identities` | MyID test identities, stage connects only to the MyID test environment | SRS-TST-01…02 |
| 33 | `h-33-installing` | One install per bank: Helm, Compose for local, first sprint definition of done | SAD §6, §10.6–10.7 |

## Decisions

- **Hero:** Aziz (2026-11-09).
- **Configuration (lesson 6):** deploy values (URLs, keys, credentials) have no default and stop startup when missing; business policies and texts have catalogue defaults that the bank changes with maker-checker (2026-11-09). SAD C-12 keeps its wording: it speaks of policies only.
- **Code:** `Documents/heeyid/` holds two repos: `heeyid-infra` (same scope as acquiring's infra) and `heeyid` (the Java build, layout from SAD §10.1).
