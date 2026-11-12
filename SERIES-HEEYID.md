# heeyID: Build a customer identity platform

A course that teaches a backend developer who is new to identity to build heeyID MVP 1 from zero: a platform that a bank installs inside its own perimeter, so that a new customer registers in the mobile bank, proves who he is once with MyID, and gets **one phone that can move money**.

- **Scope:** MVP 1 is one journey, the first money phone (owner decision, 12.11.2026). Everything else is a later module (see the last section).
- **Sources:** BRD 1.7 (story), SRS 1.6 (behaviour), SAD 1.6 (design), 12.11.2026. Read the current rule in the documents before each script.
- **Workflow:** docs → design video (this map, then brief → script → voice → stills) → build the `heeyid` repo lesson by lesson → re-cut the video from the code.
- **Format:** one concept per lesson, 4–7 minutes, 16:9, why and how it works. English only.
- **Phase 1, the product only:** no code, paths, document names, ids or error codes on screen or in the voice. Code appears only after it exists in the repo, shown as it really is.
- **Ids:** folders keep their first ids (`h-NN-<slug>` under `studio/src/reels/`); the lesson number on screen and in the voice is the course order below. Studio folder `heeyID`, node catalogue and map in `studio/src/series/heeyid/`.
- **Rules:** all of [`SERIES.md`](SERIES.md). Generic names on screen ("the bank", "the SMS vendor"; MyID may be named, since it is the one real provider); no bank names.

## The hero

**Aziz**, a new customer of the bank, with **one phone** and one laptop. In MVP 1 he uses only the mobile bank (the master app). One journey: from registration to his first money phone.

| Lessons | Time | Level | What happens |
|---|---|---|---|
| 1–2 | today (a look ahead) | 2 | Aziz with his money phone. No "last week". |
| 3–7 | no time | – | "Suppose" scenes: no day, no level. |
| 8 | week 1, Sunday | 0 → 1 | He installs the mobile bank and registers: the TAF code by SMS, then a password, two times. |
| 9–11 | week 1 | 1 | A night of codes he did not ask for. Monday at the café: Red on the Wi-Fi, Green on the mobile network. Thursday: leaked passwords against his number, and the lock. |
| 12–15 | week 2, Saturday | 1 → 2 | **The one step-up:** he wants to send money to his mother, and money needs level 2. Consent, MyID in the lift (after the root and emulator check), his old university number on the MyID record, TAF asks who owns the number. Level 2. |
| 16–17 | week 2 | 2 | His phone becomes the trusted phone, the money phone. He sets the app PIN; the first transfer goes. |
| 18 | Monday | 2 | He logged out because of his nephew; he logs in again on the same phone: password, then code. |
| 19–21 | a Friday, months later | 2 | He loses the phone in the bazaar and calls the bank: one operator blocks. A stranger finds it and sees a push that says nothing. Sunday the phone comes back; a second operator approves the unblock. Months later, the audit answers his letter. |
| 22 | – | – | Aziz as the test persona; one line says what the next module adds: a new phone. |

Fixed facts: one phone in the whole course, no new phone, no number change, no password reset. The only closures are the two that MVP 1 has: TAF says "not owner" in the step-up from level 1, and an operator rejects a phone review. Known limit of MVP 1 (the owner knows): a customer who loses the phone or forgets the password cannot come back alone; no lesson promises a path for that.

## Lesson map (MVP 1, 22 lessons)

Each lesson arrives because the one before it leaves a question open.

### Module 1. Orientation

| # | Folder | Concept |
|---|---|---|
| 1 | `h-01-map` | The build map: the perimeter, the edge, two gateways, Keycloak, the stores, the adapters; TAF inside; MyID, the SMS vendor and the push service outside. One person, one phone number, one password (takes in `h-02`). |
| 2 | `h-03-identity-words` | Authentication, identity proofing and authorisation. Level 1 and level 2. OAuth 2.1 and OIDC. |

### Module 2. Foundations

| # | Folder | Concept |
|---|---|---|
| 3 | `h-04-perimeter` | One installation for each bank, two zones, no call to the vendor. Only MyID, the SMS vendor and the push service are outside; the TAF agent runs in the bank network. |
| 4 | `h-06-configuration` | No default in the code. OpenTofu gives the deploy values and the policy defaults. A missing value stops the start. |
| 5 | `h-07-adapters` | A domain with no I/O. Ports and adapters for MyID, TAF, SMS and push. Simulators, timeouts and breakers. |
| 6 | `h-08-keys` | Vault: the installation key-encryption key, the index key, the code pepper, the audit key, and the MyID, TAF and push credentials. |
| 7 | `h-09-api-contract` | No heeyID SDK. The OpenAPI contract and the integration guide. The bank puts the MyID and TAF SDKs in the mobile bank. What the app keeps, and what it never keeps. |

### Module 3. Registration (level 1)

| # | Folder | Concept |
|---|---|---|
| 8 | `h-10-registration` | Register and Log in, two entries. The code through TAF, accepted only from the phone that started; a second registration ends the open one; the app continues after a restart. A password, two times. "Registration complete" by SMS and push. |
| 9 | `h-11-codes-and-limits` | One-time codes, counters and cool-downs in Valkey. |
| 10 | `h-12-taf-verdict` | Green, Yellow and Red. The waiting time, the SMS fallback (not scored), the trusted-bank stop, the face confirmation, phone ownership. |
| 11 | `h-13-password` | The Argon2id digest and the wrong-password lock. |

### Module 4. Proofing (level 2)

| # | Folder | Concept |
|---|---|---|
| 12 | `h-14-consent` | Each app has a required level; money needs level 2 (takes in `h-22`). The consent gate before each MyID call; versioned consent screens. |
| 13 | `h-15-myid-proofing` | The root and emulator check, then MyID. The backend opens the session. The one-use result code. Limits and counters for the MyID check. |
| 14 | `h-17-verified-identity` | The protected class: the keys of the bank (one line; lesson 6 teaches them), one closed door, masked reads, the short list of full reads, each read audited. |
| 15 | `h-18-phone-check` | The number from MyID first; TAF only when MyID has no number or a different one; "not owner" closes; a phone review by an operator. |

### Module 5. The money phone

| # | Folder | Concept |
|---|---|---|
| 16 | `h-20-trusted-device` | The device record, the one trusted phone that moves money, the binding check, the app PIN. |
| 17 | `h-21-access-grants` | Tokens through the gateway; each token names its app (takes in `h-05`); the session level; renewal. |
| 18 | `h-23-known-device-login` | Login again on the same phone: the password, then the one-time code. |

### Module 6. Operations and trail

| # | Folder | Concept |
|---|---|---|
| 19 | `h-34-blocking` | Staff identity. A lost phone: one operator blocks. The unblock and the approval of a phone review need a second operator (takes in `h-37`). |
| 20 | `h-35-notifications` | The outbox on Kafka, SMS and push, no personal data in a push. |
| 21 | `h-36-audit-and-retention` | The audit chain with HMAC, the events for the bank, and the retention job. |
| 22 | `h-39-installing` | One installation for each zone with OpenTofu and Docker Compose on one host, MyID test identities in the stage zone (takes in `h-38`), Compose on a laptop, the definition of done. |

## Merged folders

`h-02`, `h-05`, `h-22`, `h-37` and `h-38` go into the lessons named above. They are not registered in `Root.tsx` and are excluded from the type check; the folders stay until the owner decides after the merged lesson is accepted.

## Later modules

Outside MVP 1. The folders stay as they are, not registered in `Root.tsx` and excluded from the type check. Each one needs a re-cut against the documents of its own module before it returns; its earlier review findings are in the review notes of 11.11.2026.

| Folder | Subject | Later part |
|---|---|---|
| `h-16-prove-once` | The MyID re-check while the reusable identifier is valid | MyID re-check |
| `h-19-linking` | The link to the bank customer | Link to the bank customer |
| `h-24-new-device` | Login on a new phone, the approval on the old phone | New phone (the first module after MVP 1) |
| `h-25-remote-access` | The remote-access event | Remote-access event |
| `h-26-side-app-login` | Side apps and the web, the approval in the master app | Side apps and the web profile |
| `h-27-account-link` | "Is this marketplace account yours?" | Side apps |
| `h-28-address-sharing` | Sharing the verified address with a side app | Side apps |
| `h-29-sessions-and-rank` | The rank of a session, the list of sessions | Second phone, approval request |
| `h-30-password-reset` | The password reset | Password reset |
| `h-31-this-was-not-me` | "This was not me" on an approval request | Approval request, number change |
| `h-32-number-changes` | Re-registration, number reassignment, dormant account | Number change, reassigned number, dormant accounts |
| `h-33-refresh` | The identity refresh and document expiry | Identity refresh |

## Decisions

- **Hero:** Aziz (2026-11-09); one phone, one journey (2026-11-12).
- **MVP 1 cut (2026-11-12):** 22 lessons in 6 modules; the link to the bank customer and 11 other lessons are later modules.
- **Configuration (lesson 4):** deploy values and policy defaults come only from the OpenTofu configuration; the code has no default, and a missing value stops startup.
- **Code:** `Documents/heeyid/` holds two repos: `heeyid-infra` and `heeyid` (the Java build).
