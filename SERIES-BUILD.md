# Series B: Build an E-Commerce Acquiring System (for programmers)

**Goal:** after the series, a programmer has built a working bank e-commerce acquiring system, part by part, and understands why each part exists.
**Audience:** a backend developer at the author's level: knows Java and Spring Boot, learns the payment domain and the infrastructure along the way.
**Shape:** one growing system (solo-developer friendly). Every episode ends with a runnable repo state (`git tag ep-NN`) and a demo the viewer can repeat.
**Source of truth:** the real codebase (`asakabank/open_banking`). The teaching repo is a simplified rebuild of it; every episode lists the real classes it mirrors.

---

## How every episode is designed

Each episode follows the same order. It's the order a senior engineer works in, and the viewer learns it by repetition.

| Step | Output | Why this order |
|---|---|---|
| 1. **Problem** | one sentence: what breaks or is missing | a block that solves nothing is noise |
| 2. **Domain** | entities, states, invariants ("only one debit may win") | everything else derives from it |
| 3. **Contract** | OpenAPI spec (`openapi_v1.yaml`) → generated client | the API is a promise to outsiders; hardest to change |
| 4. **Database** | Liquibase changelog | storage is internal; migrations make it cheap to change |
| 5. **Code** | the smallest implementation that keeps the invariant | — |
| 6. **Test + demo** | one test that fails if the invariant breaks; a curl/Postman run | proof, and the "it works" moment |

Video beats per episode (from the owner pitch lessons): **worry → relief**. Show the naive version break first, then the fix. Picture first, short voice lines, one idea per beat.

---

## Architecture (decided 2026-10-18)

**Modular monolith outside, hexagonal at the edges inside.**

- **One app, one deploy, one Postgres with a schema per module:** `partner`, `commission`, `terminal`, `card`, `payment`. The real repo's microservices become our module boundaries.
- **Modules talk only through public interfaces** (a `*Api` Java interface per module), never through each other's tables or internal classes. A module can later be extracted into a service with little change (episode 25).
- **Ports and adapters only at the edges that talk to the outside world:** processing center (Uzcard REST, Humo SOAP), Keycloak, Vault, email. One port, several adapters. Plain layered code (controller → service → repository) for simple CRUD.
- **Why:** a solo viewer runs one app instead of nine; boundaries stay honest; hexagonal pays only where there are real alternative implementations.

---

## Stack (pinned to the real repo)

| Concern | Choice | Real repo |
|---|---|---|
| Language / framework | Java 25 (LTS), Spring Boot 4.1 | ✅ (Boot 4.1) |
| Build | Gradle multi-module: one Spring Boot app + one module per bounded context, version catalog | real repo: one project per service |
| API | contract-first OpenAPI, server interfaces + DTOs generated | ✅ |
| Email | Spring Mail (SMTP) behind the email port; Mailpit locally | real repo: external notification-manager |
| Database | PostgreSQL + Liquibase | ✅ |
| Cache / short-lived state | Redis (OTP, nonces, locks, route access) | ✅ |
| Identity | Keycloak (portal users, M2M clients, JWT claims) | ✅ |
| Secrets | HashiCorp Vault (kv-v2, AppRole) | ✅ |
| Long-running work | Temporal (payment resolution) | ✅ |
| Scheduled jobs | ShedLock | ✅ |
| Module calls | in-process Java interfaces (`*Api`); OpenAPI only for the outside world | real repo: REST between services |

---

## Repositories and scope (decided 2026-10-19)

- **Backend first, with a matching web app.** Series B videos cover the Java/Spring system; each episode's screens are built in `ecom-front` (merchant portal + bank console, React + Mantine) and tested end to end, without their own video beats.
- **Languages:** English, Russian and Uzbek in the API's error details and emails (`Accept-Language`), the web app, and the Keycloak login pages.
- **Repos (companion code, local in `~/Documents/acquiring/`):**
  - [`ecom`](https://github.com/khakimjanovich/ecom): the Java/Spring modular monolith (Gradle 9.8.1, Java 25, Spring Boot 4.1.1, Spring Modulith 2.1.1 for the boundary test, openapi-generator 7.14.0)
  - [`ecom-infra`](https://github.com/khakimjanovich/ecom-infra): docker-compose (Postgres 17.6, Redis 8.2, Mailpit from episode 04, Keycloak 26.4 from episode 07), later Helm and Kubernetes. The "one command" lives here.
  - [`ecom-k6-testing`](https://github.com/khakimjanovich/ecom-k6-testing): Grafana k6 load tests from day one, one folder per area, thresholds in every script; results join Grafana from episode 17.
  - [`ecom-front`](https://github.com/khakimjanovich/ecom-front): the web app; its API types are generated from the same OpenAPI contract, and Playwright runs the whole journey on the real stack.
- **Tags:** each repo is tagged per episode (`ep-02`, `ep-03`, …) so a viewer can check out exactly what a video shows. `ecom`'s `ep-02` is a side commit holding Episode 02's state, since 02 and 03 were built together.
- **Clean codebase:** no convenience files (no Makefile), no episode mentions in code, generated code only in build output and published jars, only tests that guard a real rule.
- **Database:** one Postgres, a schema per module, and a database user per module that can see only its own schema (isolation enforced by Postgres).
- **Logging:** Spring Boot structured logging, one property (`logging.structured.format.console=ecs`), ECS JSON format.

## Build setup

- **Java 25 + Spring Boot 4.1**, Lombok, Spring Modulith (boundary test).
- **`platform/`** in `ecom`, each its own Gradle build, published to local Maven (`~/.m2`) before the app builds:
  - `versioning`: the one `libs.versions.toml`, published as `uz.heeypay.ecom:versioning`;
  - `openapi`: one project per module contract (`partner-api`, …): the spec in, generated Spring interfaces and models out. Generated code lives only in `build/` and the published jar; the jar also ships the spec for Swagger UI;
  - `error`: one error format for every module, RFC 9457 problem details plus a stable `code`, built on Spring's `ProblemDetail`.
- **Contract-first:** controllers implement the generated `*Api`; Swagger UI shows the spec we wrote, not docs generated from code.
- **House style (from the bank's repo, rewritten clean):** layer packages `controller`, `service` + `impl`, `repository`, `entity`, `mapper`, `constant`, `property`, `config`; literals in Lombok `@UtilityClass` `*Constants`, bean names in `*BeanNames`, error codes in `*ErrorCode`.
- **Per-module persistence:** each module has its own datasource, Liquibase, entity manager and transaction manager, connecting as its own database user.
- **Tests:** unit in `src/test` (`*Test`), integration on real Postgres via Testcontainers in `src/integrationTest` (`*IT`), `./gradlew check` runs both; load and smoke in `ecom-k6-testing`.
- **Rebuild only what changed:** `implementation` dependencies (compile avoidance), build cache and configuration cache in `gradle.properties`.
- **Local ports:** Postgres 5442, Redis 6389, Mailpit 1025/8025, Keycloak 8180 (5432/6379 are often taken on dev machines).

## Email

- **Port:** `EmailSender` in the partner module (send OTP, send notice).
- **Adapter:** Spring Mail over SMTP. In production it points at the bank's SMTP server; a second adapter can call the bank's notification-manager without touching the partner module.
- **Locally: Mailpit**, a real SMTP server with a web inbox (`localhost:8025`) that never delivers to the internet. Every OTP email is visible during demos.
- Arrives in episode 04, with the first OTP.

---

## When each tool arrives

Rule: a tool joins `docker-compose.yml` in the episode whose problem needs it, never earlier.

| Tool | Episode | The problem that brings it |
|---|---|---|
| Postgres, Redis | 02 Setup | the first episodes need them immediately |
| Mailpit + Spring Mail | 04 Registration | the first OTP email |
| Structured JSON logs + Actuator health | 02 Setup | cheap, and nothing is debuggable without them |
| Keycloak (realm `ecom`, roles, service client) | 07 Logins and API clients | an admin named in a header can be faked; logins and roles need a real identity provider |
| Vault, merchant HMAC secrets (`secret/merchants`) | 14 Create payment | the first secret the app must read per request; until then local secrets are configuration with local-only defaults. Not the card vault module |
| Prometheus + Grafana, Tempo, Loki | 17 Observability | a stuck payment is invisible without metrics and traces; Loki instead of ELK (lighter on a laptop) |
| Temporal | 18 Silent processing | unknown outcomes need durable retries |
| Kafka | 19 Outbox + Kafka | events must reach other systems exactly once |
| Kubernetes (+ Helm) | 24 Deploy to Kubernetes | one laptop is not production: replicas, probes, rolling updates |

## Versions

- Policy: the latest stable release on the day an episode is recorded, pinned exactly (no `latest` tags, no ranges).
- Where: `platform/versioning/libs.versions.toml` (published to local Maven, as in the real repo) and image tags in `docker-compose.yml`.
- Each episode's `git tag` freezes its versions, so a viewer can reproduce it later. Upgrades get their own short episode when needed.

## Database design

- **Episode 03, once:** a one-page entity sketch for the whole system: entities per module, their owners and relations, no columns. Cross-module links are IDs only (`payment.sales_point_id` is a UUID, no foreign key across schemas), which keeps modules extractable.
- **Every episode after:** detailed tables just in time, as Liquibase migrations in that module's own schema, designed with the method (domain → contract → database).
- **Episode 02:** empty schemas only (`partner`, `commission`, `terminal`, `card`, `payment`), each owned by its own database user.

## Video notes

- Format: YouTube 16:9 (1920×1080). Every episode opens on the build map (`series/build/map.ts`, `BuildMap`) with its part lit.
- Videos explain the finished design only, as if it was built right the first time: no test, k6, sandbox or "a bug we caught" beats. Code beats quote `main`. When the code changes, re-cut every episode it touches and update the map.
- Infrastructure appears on the map as its official monochrome logo (Simple Icons). Video description must include: "All product names and logos are trademarks of their respective owners."

---

## Episode plan

Columns: **Problem** · **Build** · **Why** · **Tables** · **Endpoints** · **Demo** · **Real code**

### Part 0: Foundations

**00 · The map**
- Problem: 20 moving parts; a viewer can't hold them all.
- Build: nothing. The finished architecture, then the build order and why that order.
- Why: an advance organizer; every later episode has a place on the map.
- Demo: the final system diagram, with each part lighting up in build order.

**01 · Acquiring in 5 minutes**
- Problem: you can't name classes for things you don't understand.
- Build: a glossary + the journey of one payment: merchant, acquirer, issuer, processing center, MID/TID, authorization vs capture, settlement T+1, reversal vs refund.
- Why: shared vocabulary for the whole series (reuses the owner pitch and Tier 1).
- Demo: one 100,000 so'm payment traced end to end.

**02 · Setup**
- Problem: nothing runs yet.
- Build: Gradle multi-module skeleton (`app` + five modules, a schema and database user each), the Spring Modulith boundary test, `platform/` (versioning, openapi, error) published to local Maven, the layer-package house style, `ecom-infra` docker-compose with Postgres and Redis only, ECS JSON logs, Actuator health, the test layout (unit, integration, k6).
- Why: every later demo depends on one command bringing the world up.
- Demo: `docker compose up` → all health checks green; the app answers `/actuator/health`; the k6 smoke test passes.

**03 · Domain → contract → database (the method)**
- Problem: where do you start designing?
- Build: one tiny example end to end: the `Partner` entity, its first two states, its OpenAPI path, its Liquibase table, a generated client.
- Why: teaches the six-step episode method once, slowly, plus the two architecture rules: modules talk through `*Api` interfaces; ports and adapters only at the edges.
- Tables: `partner`. Endpoints: `GET /partners/{id}`.
- Demo: generated client calls the endpoint; the row exists in Postgres.

### Part 1: Merchants (partner-relationship-service)

**04 · Partner registration + email OTP**
- Problem: anyone can type any email; we need proof they own it.
- Build: `POST /api/v1/registrations`, `/email-verification`, `/email-verification/resend`; `platform/otp` (codes stored as SHA-256 hashes in Redis, configured ttl, max-attempts, max-sends per send-window); `NotificationService` over Spring Mail, Mailpit in docker-compose; stable error codes (`PARTNER_EMAIL_TAKEN`, `OTP_INVALID`, `OTP_EXPIRED`, `OTP_ATTEMPTS_EXCEEDED`, `OTP_SEND_LIMIT`).
- Why: the first gate of trust. Introduces the `otp` and `error` starters' ideas in place.
- Tables: `partner`, `contact_person`. Redis: `otp:*`.
- Endpoints: `POST /auth/register`, `POST /auth/otp/verify`, `POST /auth/otp/resend`.
- Demo: register → the OTP email arrives in Mailpit → verified; wrong code ×N → blocked.
- Real code: `PartnerAuthServiceImpl`, `PartnerOtpServiceImpl`, `NotificationServiceImpl`.

**05 · Partner lifecycle + documents**
- Problem: a partner can't jump from "registered" to "taking payments".
- Build: states PENDING_VERIFICATION → VERIFIED → WAITING_CONTRACT → APPROVED → ACTIVE ⇄ SUSPENDED → TERMINATED, plus REJECTED from the early states; the allowed moves as one `EnumMap` in `PartnerStatus`, refused moves → 409 `PARTNER_INVALID_TRANSITION`; verify needs a verified email (`PARTNER_EMAIL_NOT_VERIFIED`); the contract number is unique in the database (`PARTNER_CONTRACT_TAKEN`); activate and restore each only from their own starting state; every change written to `partner_status_history` in the same transaction. KYB documents (charter, passport; required list in `ecom.partner.kyb.required-documents`) go to the separate file service (`services/file-service`, SeaweedFS S3 bucket `partner-documents`: type read from the bytes, size limit, SHA-256); the partner module keeps only file id, type, size and checksum, an older upload of the same type is kept as REPLACED; an admin verifies or rejects each document with a reason; verify needs every required document verified (409 `PARTNER_KYB_INCOMPLETE`).
- Why: the state machine is the backbone; every later check asks "is this partner ACTIVE?".
- Tables: `partner` (status, contract_number), `partner_status_history`, `partner_document`.
- Endpoints: `POST /api/v1/admin/partners/{id}/verify|reject|contract|activate|suspend|restore|terminate`, `GET …/history`.
- Tests: `PartnerStatusTest` (the whole transition table), `PartnerTest`, `PartnerAdminServiceIT` (real Postgres). k6: `lifecycle/partner-lifecycle.js`.
- Code: `ecom@ep-05`.

**06 · Four-eyes (maker-checker)**
- Problem: one admin alone can switch on a fraudulent store.
- Build: no single-admin activate call; an activation request instead: the maker asks, a different checker approves or rejects; a request is decided once, before it expires (409 `ACTIVATION_REQUEST_DECIDED`, 410 `ACTIVATION_REQUEST_EXPIRED`, 409 `SELF_APPROVAL`); opening and approving both require the KYB documents verified; the checker is recorded in the status history with the maker in the reason; configured `ttl` (24h) and `sweep-delay` (1m); a `@Scheduled` sweep with ShedLock (lock table in the module's own schema); one pending request per partner via a partial unique index.
- Why: the single most important control for owners (see the owner pitch); reused later by commission.
- Tables: `activation_request` (partial unique index on PENDING), `shedlock`.
- Endpoints: `POST /api/v1/admin/partners/{id}/activation-requests`, `POST /api/v1/admin/activation-requests/{id}/approve|reject`.
- Tests: `ActivationRequestTest`, `ActivationRequestServiceIT` (approval, index, sweep). k6: the lifecycle scenario activates with four eyes.
- Code: `ecom@ep-06`.

**07 · Logins and API clients (Keycloak)**
- Problem: an admin named in a header can be faked, partners need a login, and their servers need machine credentials.
- Build: Keycloak joins docker-compose with a realm import (realm `ecom`: roles `admin`, `partner`, `merchant` for API clients; admins `aziz`, `malika`; `ecom-backend` service client; `ecom-portal` login client); registration takes a password and creates the Keycloak user (the password never touches our database); email verification marks the email verified and grants the `partner` role; resource-server security from `platform/security`, route rules in `ecom.security` (sign-up and docs public, `/api/v1/admin/**` needs `admin`, `/api/v1/partner/**` needs `partner`, `/api/v1/payments/**` needs `merchant`, everything else refused); the admin's name comes from the token; an active partner creates M2M clients, the secret shown once, rotation kills the old secret. Keycloak's admin API is called with Spring's `RestClient` and an OAuth2 client-credentials interceptor.
- Why: identity is separate from business data; never store passwords yourself.
- Tables: `partner` (+ user_id), `partner_client` (ids only, never a secret).
- Endpoints: `GET /api/v1/partner/me`, `GET|POST /api/v1/partner/clients`, `POST /api/v1/partner/clients/{clientId}/secret`.
- Tests: `KeycloakJwtConverterTest`; `PartnerOnboardingIT` runs the whole onboarding on real Postgres, Redis, Mailpit and Keycloak. k6: every scenario logs in; `partner/api-client.js` creates and rotates secrets.
- Code: `ecom@ep-07`.

**08 · Sales points + site check**
- Problem: a partner may run several websites, and a fake one must not take payments.
- Build: a sales point per website (DRAFT → ACTIVE ⇄ SUSPENDED → CLOSED, guarded by a transition table); return addresses must be https pages on the website's own domain and freeze once live; an admin records site checks (PASSED/FAILED, a failed one must list findings; every check kept); the deal's terms: card schemes (Uzcard, Humo) and a refund window, a longer one needs a reason and stays under a configured maximum (`ecom.partner.refund.max-days`); switching on needs an active partner, a passed latest check and at least one scheme; `SalesPoints.payable(id)` for other modules, failing closed; a logo per sales point in the file service's `sales-point-logos` bucket (PNG/JPEG, 1 MB, a new logo replaces the old file).
- Why: the unit that actually takes payments; the payment module asks about it on every request.
- Tables: `sales_point` (text[] return URLs and schemes), `site_check`.
- Endpoints: merchant `GET|POST /api/v1/partner/sales-points`, `PUT …/{id}/return-urls`; admin `GET /api/v1/admin/partners/{id}/sales-points`, `GET /api/v1/admin/sales-points/{id}`, `GET|POST …/site-checks`, `PUT …/settings`, `POST …/activate|suspend|restore|close`.
- Tests: `SalesPointTest`, `SalesPointServiceIT`, the full-app IT over HTTP; k6 `sales-points/site-check-and-activate.js`.
- Front: merchant "Websites" page; bank website page with the check form, terms and actions.
- Code: `ecom@ep-08`.

**09 · Platform libraries**
- Problem: every module that takes requests needs the same security and the same Keycloak calls; copies mean every fix is made twice.
- Build: `platform/security` (stateless resource server, Keycloak realm roles, route rules from `ecom.security.public-routes` and `ecom.security.roles`, anything unlisted refused, 401/403 as problem details; runs before Boot's default chains and steps aside for an app's own `SecurityFilterChain`) and `platform/keycloak` (`KeycloakAdmin`: users, realm roles, confidential clients, secret rotation; logs in with its own client credentials from `ecom.keycloak.*`). The partner module keeps its `IdentityService` port and delegates; modules take libraries by name from the version catalog.
- Why: shared code lives once, versioned and published, right before the second module (commission) arrives.
- Tests: `SecurityAutoConfigurationTest` (route rules with fake tokens), `KeycloakAdminIT` (real Keycloak).
- Code: `ecom@ep-09`.

### Part 2: Money rules (reference services)

**10 · Commission service**
- Problem: every payment needs a fee, and the fee depends on the website, the merchant, the card scheme and the date.
- Build: fee rules scoped to any mix of sales point, partner and scheme (empty = any); the most specific active rule wins (sales point > partner > scheme > bank), so no priority field is needed; fee = percent rounded half up once to tiyin + fixed, kept between min and max; a fee that would take the whole amount is refused (the bank's code lacks this, ours enforces it); rules are never edited: CREATE and END change requests with four eyes (no self-approval, one pending per rule, database checks too); an exclusion constraint (btree_gist) keeps two active rules for the same scope from overlapping in time; `Commissions.quote(...)` returns the rule id and the fee for the payment to keep; admins filter rules (partner, sales point, scheme, status, active at) a page at a time, each rule shows its level (`RuleLevel`) and its change history. `platform/persistence` (shared module persistence) and the `ecom.contract` build convention arrive here, with the second module.
- Tables: `commission_rule`, `commission_change_request`.
- Endpoints: `GET|POST /api/v1/admin/commissions`, `GET …/{ruleId}`, `GET …/{ruleId}/history`, `POST …/{ruleId}/end`, `POST /api/v1/admin/commissions/quote`, `GET /api/v1/admin/commission-requests`, `POST …/{id}/approve|reject`.
- Tests: `CommissionRuleTest`, `CommissionServiceIT`; k6 `commission/rules-and-quotes.js` (quotes p95 2.75 ms).
- Front: bank "Fees" page (rules, new rule, end, calculator); fee changes in Approvals.
- Code: `ecom@ep-10`.

**11 · Terminals (MID/TID)**
- Problem: the processing center only accepts debits through a registered terminal.
- Build: a terminal per website and card scheme (MID/TID from the processing center); registration fails closed unless the website exists and accepts that scheme (asked through the partner module's public `SalesPoints`); the database keeps MID/TID unique forever and one live terminal per website and scheme; suspend, resume, revoke (final); an audit log of every change with actor and reason; `Terminals.forPayment(...)` returns the live terminal or nothing; admins search every terminal (sales point, scheme, status, part of a MID/TID) a page at a time.
- Tables: `terminal`, `terminal_audit`.
- Endpoints: `GET|POST /api/v1/admin/sales-points/{id}/terminals`, `GET …/terminals/route?scheme=`, `GET /api/v1/admin/terminals`, `GET …/{id}`, `POST /api/v1/admin/terminals/{id}/suspend|resume|revoke`, `GET …/{id}/audit`.
- Tests: `TerminalTest`, `TerminalServiceIT` (partner stubbed at its public interface); k6 `terminals/register-and-route.js`.
- Front: bank "Terminals" page (filters, search, drawer with history and actions); terminals card on the bank's website page.
- Code: `ecom@ep-11`.

### Part 3: Cards (adapters + vault)

**12 · Card adapters**
- Problem: two schemes, two protocols (Uzcard JSON-RPC, Humo SOAP), one interface wanted.
- Build: each scheme gets its own adapter service (`adapters/uzcard-adapter` :8091, `adapters/humo-adapter` :8092), separate Spring Boot builds with their own OpenAPI contracts (`platform/openapi/*-adapter-api`) and published `@HttpExchange` clients, callable by any service or project. Every answer is an envelope `{requestId, status, data}`; 502 scheme error, 504 no answer. Inside, one command per scheme method from a factory (`SvGateMethod`, `HumoOperation`); what the scheme's codes mean lives in a status YAML. Uzcard debits in one step by token with our payment id as `ext` (a duplicate, -207, is looked up with `trans.ext`); Humo holds, and the card module captures right away. The `card` module keeps one port, `CardProcessor`, with a processor per scheme over the clients; every answer becomes APPROVED, DECLINED with our own code, or UNKNOWN; a timeout is UNKNOWN, never a decline.
- Why: the payment module must not care which scheme a card belongs to, and the adapters are reusable outside this project.
- Infra: `processing-sandbox` (WireMock) in docker-compose stands in for both schemes locally (not a video beat).
- Tests: adapter command and status tests, `UzcardProcessorTest`, `HumoProcessorTest` (clients mocked).
- Code: `ecom@ep-12`.

**13 · BIN registry + card vault**
- Problem: we must know a card's scheme, and we must never store a card number in plain text.
- Build: `platform/crypto` (AES-256-GCM, a fresh 12-byte nonce per value, the key id authenticated as AAD, envelope `v1:<key id>:…`, rewrap for rotation, HMAC-SHA256 blind index); the card module's vault: Luhn and a known BIN before any scheme call, number/expiry/scheme token/binding session stored only encrypted (a database check refuses anything else), one row and one token (`ctk_…`) per card via the blind index, every use audited; public `Cards` API (start/confirm binding, find, debit by token); BIN registry synced from both schemes through the adapters at startup and nightly (idempotent, a silent or empty scheme keeps its old list), longest prefix wins.
- Why: tokenization; a database leak exposes no card numbers.
- Tables: `bin_range`, `card`, `card_audit`.
- Endpoints: `GET /api/v1/admin/bins`, `POST …/bins/sync`, `GET …/bins/lookup?digits=`, `POST /api/v1/admin/cards/search`, `GET …/cards/{cardToken}`, `GET …/cards/{cardToken}/audit`.
- Tests: `CryptoTest`, `PanUtilsTest`, `CardVaultIT` (reads the stored row back: no number); k6 `cards/bins-and-vault.js` (BIN lookups p95 3.4 ms).
- Front: bank "Cards" page (BIN registry, live scheme lookup, vault search with the card's audit trail).
- Code: `ecom@ep-13`.

### Part 4: Payments (ecom-acquiring-service)

**14 · Create a payment: HMAC + idempotency**
- Problem: anyone can fake a request, replay it, or a retry can create a second payment.
- Build: `POST /api/v1/payments` for merchants' servers: a Keycloak client-credentials token (API clients now get the `merchant` role) plus an HMAC-SHA256 signature over method, path, timestamp, nonce and body hash; Vault joins docker-compose (`platform/vault`); each API client's signing key is put into Vault under `secret/merchants/<client id>` by the bank directly (never generated by the app or the website); the app only reads it, and if Vault is down nothing passes; `HmacAuthenticationFilter` checks the timestamp window (configured), then the signature, then spends the nonce in Redis (`ecom:hmac:nonce:*`), so forgeries can't burn nonces; `Idempotency-Key` per client with the stored response replayed (`Idempotent-Replayed: true`), a different body refused, concurrent retries meet at unique keys; only the merchant's own live website and its return addresses; one payment per order and website; the payment page link stored only as a hash.
- Tables: `payment`, `idempotency_record`.
- Endpoints: `POST /api/v1/payments`, `GET /api/v1/payments/{id}` (signed), `GET /api/v1/admin/payments`.
- Tests: `SignatureUtilsTest` (vector from Python's hmac), `HmacAuthenticationFilterIT` (real Redis), `PaymentServiceIT` (incl. 6 concurrent retries → one payment), `VaultSecretsIT`, the full-app IT signs a payment over HTTP; k6 `payments/create-payment.js` (28,728 checks at 100%, create p95 6.82 ms).
- Front: the signing key shown once beside the client secret; bank "Payments" page.
- Code: `ecom@ep-14`.

**15 · The payment page**
- Problem: the card must be typed on the bank's page, never the shop's.
- Build: public `/api/v1/pay/{token}` (page, logo, card, code); the link's token is the only credential, stored only as a hash, expiring after `page-ttl`; reading the page changes nothing; the BIN module names the card's scheme and bank before any code is sent, and a scheme the website doesn't accept is refused; the card module sends a code through the scheme's adapter, one binding (and session) per code so two payments with one card never collide; every card and code attempt is counted and committed before the scheme is asked (`card-attempts`, `code-attempts`), and the last failed one closes the page (FAILED); one step at a time per payment with a Redis lock only its holder releases (`page-lock-ttl` above the slowest scheme call). Statuses CREATED → AWAITING_CODE → CARD_CONFIRMED, or FAILED.
- Tables: `payment` (+ attempts, card token/binding/mask/scheme/BIN, failure), `card.card_binding`.
- Endpoints: `GET /api/v1/pay/{token}`, `GET …/logo`, `POST …/card`, `POST …/code`.
- Tests: `PaymentPageIT` (real Postgres + Redis: failed attempts count, page closes, scheme checked first, one step at a time, expiry), `CardVaultIT` (two bindings of one card); k6 `payments/hosted-page.js`; the web journey pays on the page.
- Front: `/pay/:token`, outside the merchant and bank areas, in en/ru/uz.
- Code: `ecom@ep-15`.

**16 · The debit**
- Problem: two concurrent clicks must never charge twice.
- Build: atomic claim SESSION_OPEN → AUTHORIZING (conditional update), terminal resolve, commission snapshot, authorize + capture through the adapter, operation journal, `PaymentStateMachine`.
- Why: the heart of the system; double charge is the owners' biggest fear.
- Tables: `payment_operation`.
- Demo: fire two confirms at once → exactly one debit.
- Real code: `DebitClaim`, `ProcessorPaymentExecutionAdapter`, `statemachine/PaymentStateMachine`.

**17 · Observability: metrics, traces, logs**
- Problem: one payment crosses five modules and a processing center; when it's slow or stuck, nobody can see where.
- Build: Prometheus + Grafana (Micrometer metrics: payments by status, processing latency, timeouts), OpenTelemetry tracing into Tempo, logs into Loki; a starter dashboard.
- Why: the next episode (silent processing) is invisible without it. The real repo has no metrics or tracing yet.
- Demo: run 20 payments, one timeout; follow that payment's trace across modules; see the timeout spike on the dashboard.

**18 · When the processing center goes silent**
- Problem: a timeout leaves the money state unknown.
- Build: Temporal resolution workflow (status polling with backoff), sweep workflow, manual review queue, outbox events.
- Why: never blind-retry a debit; resolve the truth first.
- Tables: `manual_review_item`, `event_outbox`.
- Demo: force a processing timeout → the workflow asks for the status, then resolves to CAPTURED or reversed.
- Real code: `PaymentResolutionWorkflowImpl`, `ResolutionSweepWorkflowImpl`, `AttemptLimitEscalator`.

**19 · Events: transactional outbox + Kafka**
- Problem: other systems (merchant webhooks, notifications, antifraud) must learn about payment events, and a crash between "save" and "publish" must never lose or invent an event.
- Build: transactional outbox (event row written in the same DB transaction), a relay that publishes to Kafka, a merchant webhook consumer with retries.
- Why: the real repo writes `event_outbox` but nothing publishes it. Messaging, not event sourcing: Postgres stays the source of truth.
- Tables: `event_outbox`. Topics: `payments.captured`, `payments.declined`.
- Demo: kill the app between save and publish → the event still arrives exactly once after restart.

**20 · Payment links**
- Problem: merchants selling in chats have no website checkout.
- Build: link creation, claim, expiry sweep.
- Tables: `payment_link`.
- Real code: `PaymentLinkServiceImpl`, `PaymentLinkExpirySweep`.

**21 · Refunds and reversals**
- Problem: money must go back: same day (reversal) or later (refund within the configured window).
- Build: reverse vs refund operations, partial refunds, PARTIALLY_REFUNDED → REFUNDED.
- Demo: refund 30% → PARTIALLY_REFUNDED.

**22 · Billing and reports**
- Problem: partners pay for API usage; merchants need a daily report.
- Build: billing counters flushed by a Spring Batch job; daily report export.
- Real code: `BillingFlushJob`.

**23 · Hardening (exercises from real gaps)**
- Problem: production needs more than happy paths.
- Build, as viewer exercises: the HMAC nonce/timestamp window fix, KYB enforcement at activation, per-sales-point payment limits.
- Why: honest engineering; shows how a real system grows.

### Part 5: Growing up

**24 · Deploy to Kubernetes**
- Problem: production needs more than one process on one laptop: several replicas, health checks, rolling updates, secrets that never touch a file.
- Build: container image, a Helm chart, liveness and readiness probes from Actuator, secrets injected from Vault, three replicas behind a Service, an autoscaler.
- Why: with three replicas every scheduled job would run three times; ShedLock (already in the code) is what keeps it to one. The cluster also makes the next episode's split concrete.
- Demo: scale to three replicas, kill a pod mid-payment → traffic moves, the payment still resolves once; the expiry sweep runs exactly once.

**25 · Extract a module into a service**
- Problem: the card vault needs stricter security and its own deploy (PCI DSS scope).
- Build: move the `card` module into its own Spring Boot service; replace the in-process `CardApi` with a REST adapter behind the same port; give it its own database.
- Why: shows *why* microservices exist: clean boundaries made the move cheap. Mirrors the real card-processor-service.
- Demo: same payment flow, now across two services on the same cluster.

---

## Open decisions

1. **Companion repo:** a new public teaching repo (simplified) vs excerpts from the real one. Recommended: new repo; the real one stays private.
2. **Length:** Part 0 short (3–6 min each); build episodes 8–15 min with code on screen.
3. **Language:** English first; Uzbek copies on request (as with the owner pitch).
4. **Split into repositories (decided 2026-10-19: later).** Finish, clean and test the whole system in today's layout first. Then decide on `ecom-platform` plus one repo per service (each service owning its contract and client). Before any split: one published `build-logic` so OpenAPI generation is identical in every repo, and Keycloak client-credentials in front of the adapters, because other projects will call them and must be identified.
