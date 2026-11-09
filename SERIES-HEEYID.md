# heeyID: Build a customer identity platform

A course that teaches a backend developer who is new to identity to build heeyID MVP 1 from zero: a platform that a bank installs inside its own perimeter to register a customer, prove the customer once with MyID, link the customer to the bank's records, and keep the customer signed in on a trusted phone.

- **Sources:** BRD v1.5 (story), SRS MVP 1 (behaviour, `SRS-*` ids), SAD MVP 1 v2.2 (design, `ADR-*`, `C-*`). Until the code exists, precision comes from the SRS and SAD; after the build, each video is re-cut from the code.
- **Workflow:** docs → design video (this map, then brief → script → voice → stills) → gap list back into SRS/SAD → build the `heeyid` repo lesson by lesson (SAD §10.1) → re-cut the video from the code.
- **Format:** same as heeyMerchant: one concept per lesson, 4–7 minutes, 16:9, why (~20%), how it works (~40%), build it (~40%). English only.
- **Ids:** `h-NN-<slug>` under `studio/src/reels/`, Studio folder `heeyID`, node catalogue in `studio/src/series/heeyid/`.
- **Rules:** all of [`SERIES.md`](SERIES.md). Generic names on screen ("the bank", "the national ID service" may say MyID, since it is the one real provider); no bank names.

## The hero

**Aziz**, a customer of the bank. He uses three apps of the bank: the mobile bank, the marketplace and the credit conveyor. He proves who he is one time, and all three apps trust it. The threat that follows him through the course: someone else with his old phone number, or a new phone that is not his.

## Lesson map (MVP 1)

Each lesson arrives because the one before it leaves a question open.

### Module 1. Orientation
| # | Id | Concept | Sources |
|---|---|---|---|
| 1 | `h-01-map` | The build map: bank perimeter, edge, two gateways, Keycloak, workers, four stores, MyID and the bank's services | SAD §1, §3.1–3.2 |
| 2 | `h-02-one-identity` | Why: prove once, reuse in every app of the bank; tenant and apps | BRD §2, SAD §1 |
| 3 | `h-03-identity-words` | Authentication vs identity proofing vs authorisation; assurance level 1 and 2; OAuth 2.1 / OIDC, PKCE, DPoP | SRS §2, C-2 |

### Module 2. Foundations
| # | Id | Concept | Sources |
|---|---|---|---|
| 4 | `h-04-perimeter` | One installation per bank, two zones (stage, production), no call to the vendor, data stays in Uzbekistan | C-1, C-11, SRS-TEN-01, SRS-TST-01 |
| 5 | `h-05-tenants` | One Keycloak realm per tenant, row-level security, "another tenant's id gives not found" | C-4, SRS-TEN-02…04 |
| 6 | `h-06-configuration` | Deploy config fails fast; policies and texts come from the catalogue and change with maker-checker | C-12, ADR-28, SRS-ADM-07 |
| 7 | `h-07-adapters` | Domain with no I/O, ports and adapters, simulators, timeout and breaker per dependency | C-15, SAD §8, §10.1 |
| 8 | `h-08-keys` | Vault: tenant keys, MyID credential, audit HMAC key; key custody | SAD §7.2 |
| 9 | `h-09-mobile-module` | The mobile module: what it keeps (device id, tokens, PIN digest) and never keeps (password) | SAD §3.2, §7.3 |

### Module 3. Registration (level 1)
| # | Id | Concept | Sources |
|---|---|---|---|
| 10 | `h-10-registration` | Phone number, SMS one-time code, password entered two times; new, active and blocked numbers | SRS-REG-01…07, SAD §4.1 |
| 11 | `h-11-codes-and-limits` | One-time codes, counters and cool-downs in Valkey | SRS-REG-06, SRS-BLK-01 |
| 12 | `h-12-password` | Argon2id digest, wrong-password lock, reset and change | SRS-REG-10, SRS-DEV-16…17, SAD §4.13 |

### Module 4. Proofing (level 2)
| # | Id | Concept | Sources |
|---|---|---|---|
| 13 | `h-13-consent` | Consent gate before each MyID call; versioned consent screens | SRS-CON-01…03, SAD §4.2 |
| 14 | `h-14-myid-proofing` | Native in-app MyID, the backend opens the session, one-use result code, lost code | C-7, C-13, SRS-PRF-01…11, SAD §4.3 |
| 15 | `h-15-prove-once` | Re-check instead of full proofing while the reusable id is valid; MyID only when needed | C-8, SRS-PRF-08, SAD §1 |
| 16 | `h-16-verified-identity` | The protected class: encrypted with bank keys, versions, masked reads, each release audited | SAD §3.3 #6, SRS §6.3 |
| 17 | `h-17-phone-check` | Compare with MyID's phone list (old numbers), phone review | C-14, SRS-PRF-12, SRS-REV-01…02, SAD §4.8 |
| 18 | `h-18-linking` | Link to the bank customer by personal identification number, retry, comparison note | C-9, SRS-LNK-01…07, SAD §4.4 |

### Module 5. Devices and login
| # | Id | Concept | Sources |
|---|---|---|---|
| 19 | `h-19-trusted-device` | Device record, Known and Trusted, binding check, PIN | SRS-DEV-01…07, SAD §4.5 |
| 20 | `h-20-access-grants` | Tokens issued by Keycloak through the gateway, session assurance level, renewal that never stops | C-3, C-6, SRS-DEV-04, SAD §4.5 |
| 21 | `h-21-step-up` | Each app has a required level; the platform never refuses a step-up | SRS-REG-08…09, SRS-DEV-08 |
| 22 | `h-22-known-device-login` | Password, then one-time code, on a known device | SRS-DEV-09, SAD §4.9 |
| 23 | `h-23-new-device` | New-device code in the app on the other phone, "This was not me", push with no code, SMS after the wait | SRS-DEV-10…15, SRS-NTF-04, SAD §4.10 |
| 24 | `h-24-number-changes` | Re-registration, number reassignment, dormant account | SRS-PRF-14…16, SAD §4.11 |
| 25 | `h-25-remote-access` | Remote-access event from the app | SRS-DEV-12, SAD §4.12 |

### Module 6. Lifecycle and trail
| # | Id | Concept | Sources |
|---|---|---|---|
| 26 | `h-26-refresh` | Identity refresh, document expiry, restricted flag | SRS-RFR-01…04, SAD §4.6 |
| 27 | `h-27-blocking` | Blocks, revocation list, cases | SRS-BLK-01…06, SAD §4.7 |
| 28 | `h-28-notifications` | Outbox on Kafka, SMS and push templates, content rules | SRS-NTF-01…04 |
| 29 | `h-29-audit` | Audit chain with HMAC, the shape the bank's security monitoring reads, antifraud events | SRS-AUD-01…04, C-10, SRS §5.4 |

### Module 7. Operations and delivery
| # | Id | Concept | Sources |
|---|---|---|---|
| 30 | `h-30-admin-panel` | Staff identity, roles, proposals with maker-checker, cases, phone reviews, exports | SRS-ADM-01…07 |
| 31 | `h-31-test-identities` | MyID test identities, stage connects only to the MyID test environment | SRS-TST-01…02 |
| 32 | `h-32-installing` | One install per bank: Helm, Compose for local, first sprint definition of done | SAD §6, §10.6–10.7 |

## Decisions

- **Hero:** Aziz (2026-11-09).
- **Configuration (lesson 6):** deploy values (URLs, keys, credentials) have no default and stop startup when missing; business policies and texts have catalogue defaults that the bank changes with maker-checker (2026-11-09). SAD C-12 keeps its wording: it speaks of policies only.
- **Code:** `Documents/heeyid/` holds two repos: `heeyid-infra` (same scope as acquiring's infra) and `heeyid` (the Java build, layout from SAD §10.1).
