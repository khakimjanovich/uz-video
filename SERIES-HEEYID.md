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
| 1 | `h-01-map` | The build map: the perimeter, the edge, two gateways, Keycloak, the stores, TAF, MyID and the bank services. Master app and side apps. | SAD §1, §3, §8 |
| 2 | `h-02-one-identity` | One person, one phone number, one password for all apps. One account in each app, many sessions. The master app and the side apps. One installation for one bank. | BRD FR-84, FR-91, SRS-APP-01…04, SAD A6, ADR-32, ADR-33 |
| 3 | `h-03-identity-words` | Authentication, identity proofing and authorisation. Level 1 and level 2. OAuth 2.1 and OIDC. | SRS §2, C-2 |

### Module 2. Foundations

| # | Id | Concept | Sources |
|---|---|---|---|
| 4 | `h-04-perimeter` | One installation for each bank, two zones, no call to the vendor. The TAF agent already runs in the bank network. | C-1, C-11, C-16, SRS-TEN-01 |
| 5 | `h-05-apps-and-tokens` | One Keycloak realm. One client for each app. Each token names its app (aud, azp). Each backend accepts only its own tokens. | SAD A6, SRS-TEN-03, NFR-S-12 |
| 6 | `h-06-configuration` | No default in the code. OpenTofu gives the deploy values and the policy defaults. A missing value stops the start. The bank changes policies in the panel with maker-checker. | ADR-28, SRS-ADM-07 |
| 7 | `h-07-adapters` | A domain with no I/O. Ports and adapters for TAF, MyID, SMS, push and the customer records. Simulators, timeouts and breakers. | C-15, SAD §8, §10.1 |
| 8 | `h-08-keys` | Vault: the installation KEK, the index key, the code pepper, the audit key, and the MyID, TAF and FCM credentials. | SAD §3.2, §7.2 |
| 9 | `h-09-api-contract` | No heeyID SDK in MVP 1. The OpenAPI contract and the integration guide. The bank puts the MyID and TAF SDKs in the master app. What an app can keep, and what it never keeps. | SAD A7, ADR-14, §7.3 |

### Module 3. Registration (level 1)

| # | Id | Concept | Sources |
|---|---|---|---|
| 10 | `h-10-registration` | In the master app: the code through TAF. In a side app or on the web: the code through the bank SMS service. A password entered two times. | SRS-REG-01…07, SRS-APP-03, SAD §4.1, §4.15 |
| 11 | `h-11-codes-and-limits` | One-time codes, counters and cool-downs in Valkey. | SRS-REG-06, SRS-BLK-01 |
| 12 | `h-12-taf-verdict` | TAF in the master app only. Green, Yellow and Red. The waiting time, the SMS fallback (not scored), the trusted-bank stop, the face confirmation, phone ownership. | C-16, ADR-30, SRS-AF-01…08, SAD §4.14 |
| 13 | `h-13-password` | The Argon2id digest, the wrong-password lock, and the password change. | SRS-REG-10, SRS-DEV-16, SAD §4.13 |

### Module 4. Proofing (level 2)

| # | Id | Concept | Sources |
|---|---|---|---|
| 14 | `h-14-consent` | The consent gate before each MyID call. Versioned consent screens. | SRS-CON-01…03, SAD §4.2 |
| 15 | `h-15-myid-proofing` | MyID only in the master app. The backend opens the session. The one-use result code. A side app gets E-APP-01 and sends the customer to the master app. | C-7, ADR-14, SRS-PRF-01…11, SRS-APP-08, SAD §4.3 |
| 16 | `h-16-prove-once` | The re-check in place of a full proofing while the reusable identifier is valid. | C-8, SRS-PRF-08 |
| 17 | `h-17-verified-identity` | The protected class: keys of the bank, versions, masked reads, each read audited. | SAD §3.3, SRS §6.3 |
| 18 | `h-18-phone-check` | Each check of the number (SMS, TAF, MyID) with the provider, the app and the time. The MyID phone list, then TAF ownership, then the phone review. | BRD FR-85, SRS-PRF-12, SRS-REV-01…02, SAD §4.8 |
| 19 | `h-19-linking` | The link to the bank customer by the personal identification number. | C-9, SRS-LNK-01…07, SAD §4.4 |

### Module 5. Devices and login

| # | Id | Concept | Sources |
|---|---|---|---|
| 20 | `h-20-trusted-device` | The device record, Known and Trusted, the binding check, the app PIN. | SRS-DEV-01…07, SAD §4.5 |
| 21 | `h-21-access-grants` | Tokens through the gateway, the session level, renewal. | C-3, C-6, SRS-DEV-04, SAD §4.5 |
| 22 | `h-22-step-up` | Each app has a required level. A side app sends the customer to the master app for level 2. | SRS-REG-08…09, SRS-DEV-08, SRS-APP-08 |
| 23 | `h-23-known-device-login` | The password, then the one-time code, on a known device. | SRS-DEV-09, SAD §4.9 |
| 24 | `h-24-new-device` | In the master app: the TAF code and the approval on a rank-2 session. MyID for a customer who was ever at level 2. The code alone after the wait. | SRS-DEV-10…14, SAD §4.10 |
| 25 | `h-25-remote-access` | The remote-access event from the master app. | SRS-DEV-12, SAD §4.12 |

### Module 6. Side apps and the master app

| # | Id | Concept | Sources |
|---|---|---|---|
| 26 | `h-26-side-app-login` | The marketplace on the web and on the phone: the password, then the approval in the master app in place of the code, or the bank SMS code. Level 2 only after the approval. | BRD FR-86, FR-87, FR-90, SRS-APP-03…05, SAD §4.15 |
| 27 | `h-27-account-link` | After TAF in the master app: "Is this marketplace account yours?" Yes links it. No ends its sessions and closes it. | BRD FR-88, SRS-APP-06, SAD §4.16 |
| 28 | `h-28-address-sharing` | Each time: "Share your verified address with the marketplace?" No standing consent. The customer can delete a saved address. | BRD FR-89, SRS-APP-07, SAD §4.17 |

### Module 7. Sessions and recovery

| # | Id | Concept | Sources |
|---|---|---|---|
| 29 | `h-29-sessions-and-rank` | The rank of a session (Green, or Yellow and MyID), seniority, the probation period, the list of sessions, ending one session. | BRD FR-92, FR-93, SRS-APP-10, SRS-APP-11, SAD §4.18, ADR-34 |
| 30 | `h-30-password-reset` | The reset in the master app with TAF and MyID, at once. The waiting reset: only a rank-2 session or an operator can cancel it. The SMS reset in side apps. | BRD FR-94, SRS-DEV-17, SRS-APP-12, SAD §4.13, ADR-35 |
| 31 | `h-31-this-was-not-me` | "This was not me": the number goes on hold, the password changes at once, the SIM question, MyID before the number goes. | SRS-DEV-15, SAD §4.10 step 7, ADR-31 |
| 32 | `h-32-number-changes` | Re-registration, number reassignment, a dormant account. | SRS-PRF-14…16, SRS-DEV-11, SAD §4.11 |

### Module 8. Lifecycle and trail

| # | Id | Concept | Sources |
|---|---|---|---|
| 33 | `h-33-refresh` | The identity refresh, document expiry, the restricted flag. | SRS-RFR-01…04, SAD §4.6 |
| 34 | `h-34-blocking` | Blocks, the revocation list, cases. | SRS-BLK-01…06, SAD §4.7 |
| 35 | `h-35-notifications` | The outbox on Kafka, SMS and push. Codes: TAF in the master app, the bank SMS in side apps. New session, number on hold, no SMS to a number on hold. | BRD FR-75, FR-75a, SRS-NTF-01…04 |
| 36 | `h-36-audit-and-retention` | The audit chain with HMAC, the events for the bank, and how long each record is kept. | SRS-AUD-01…04, SRS §6.5, C-10 |

### Module 9. Operations

| # | Id | Concept | Sources |
|---|---|---|---|
| 37 | `h-37-admin-panel` | Staff identity, roles, maker-checker, cases, phone reviews, waiting resets, sessions. | SRS-ADM-01…07 |
| 38 | `h-38-test-identities` | MyID test identities; the stage zone uses only the MyID test environment. | SRS-TST-01…02 |
| 39 | `h-39-installing` | One installation for each bank with OpenTofu and Helm, Compose for local work, the definition of done. | SAD §6, §10.6–10.7 |

## Decisions

- **Hero:** Aziz (2026-11-09).
- **Lesson map v2 (2026-11-10):** 39 lessons in 9 modules, from BRD 2.3, SRS 3.7 and SAD 3.8. The side-app lessons come right after the mobile-bank lessons.
- **Configuration (lesson 6):** deploy values and policy defaults come only from the OpenTofu configuration; the code has no default, and a missing value stops startup. The bank changes policies and texts in the panel with maker-checker (2026-11-10, SAD ADR-28).
- **Code:** `Documents/heeyid/` holds two repos: `heeyid-infra` (same scope as acquiring's infra) and `heeyid` (the Java build, layout from SAD §10.1).
