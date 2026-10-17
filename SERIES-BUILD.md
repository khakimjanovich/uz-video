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
- **Ports and adapters only at the edges that change or get faked:** processing center (Uzcard REST, Humo SOAP, simulator), Keycloak, Vault, email. One port, several adapters. Plain layered code (controller → service → repository) for simple CRUD.
- **Why:** a solo viewer runs one app instead of nine; boundaries stay honest; hexagonal pays only where there are real alternative implementations.

---

## Stack (pinned to the real repo)

| Concern | Choice | Real repo |
|---|---|---|
| Language / framework | Java 21+, Spring Boot 4.1 | ✅ |
| Build | Gradle multi-module: one Spring Boot app + one module per bounded context | real repo: one project per service |
| Database | PostgreSQL + Liquibase | ✅ |
| Cache / short-lived state | Redis (OTP, nonces, locks, route access) | ✅ |
| Identity | Keycloak (portal users, M2M clients, JWT claims) | ✅ |
| Secrets | HashiCorp Vault (kv-v2, AppRole) | ✅ |
| Long-running work | Temporal (payment resolution) | ✅ |
| Scheduled jobs | ShedLock | ✅ |
| Module calls | in-process Java interfaces (`*Api`); OpenAPI only for the outside world | real repo: REST between services |

---

## When each tool arrives

Rule: a tool joins `docker-compose.yml` in the episode whose problem needs it, never earlier.

| Tool | Episode | The problem that brings it |
|---|---|---|
| Postgres, Redis, Keycloak | 02 Setup | the first episodes need them immediately |
| Structured JSON logs + Actuator health | 02 Setup | cheap, and nothing is debuggable without them |
| Vault, app config (`secret/app`) | 07 Keycloak clients | the first real secret appears; `.env` until then |
| Vault, merchant HMAC secrets (`secret/merchants`) | 15 Create payment | same Vault, second path. Not the card vault module |
| Prometheus + Grafana, Tempo, Loki | 18 Observability | a stuck payment is invisible without metrics and traces; Loki instead of ELK (lighter on a laptop) |
| Temporal | 19 Silent processing | unknown outcomes need durable retries |
| Kafka | 20 Outbox + Kafka | events must reach other systems exactly once |

## Versions

- Policy: the latest stable release on the day an episode is recorded, pinned exactly (no `latest` tags, no ranges).
- Where: one Gradle version catalog (`gradle/libs.versions.toml`, as in the real repo) and image tags in `docker-compose.yml`.
- Each episode's `git tag` freezes its versions, so a viewer can reproduce it later. Upgrades get their own short episode when needed.

## Database design

- **Episode 03, once:** a one-page entity sketch for the whole system: entities per module, their owners and relations, no columns. Cross-module links are IDs only (`payment.sales_point_id` is a UUID, no foreign key across schemas), which keeps modules extractable.
- **Every episode after:** detailed tables just in time, as Liquibase migrations in that module's own schema, designed with the method (domain → contract → database).
- **Episode 02:** empty schemas only (`partner`, `commission`, `terminal`, `card`, `payment`).

## Video notes

- Format: YouTube 16:9 (1920×1080). Every episode opens on the build map (`series/build/map.ts`, `BuildMap`) with its part lit.
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
- Build: Gradle multi-module skeleton (`app` + `partner`, `commission`, `terminal`, `card`, `payment` modules, a schema each), a module-boundary test that fails if one module touches another's internals, `docker-compose.yml` with Postgres, Redis and Keycloak only (the rest arrives with its episode), structured JSON logs, Actuator health, the version catalog, a `make up` / `make down`.
- Why: every later demo depends on one command bringing the world up.
- Demo: `docker compose up` → all health checks green; an empty Spring app answers `/actuator/health`.

**03 · Domain → contract → database (the method)**
- Problem: where do you start designing?
- Build: one tiny example end to end: the `Partner` entity, its first two states, its OpenAPI path, its Liquibase table, a generated client.
- Why: teaches the six-step episode method once, slowly, plus the two architecture rules: modules talk through `*Api` interfaces; ports and adapters only at the edges.
- Tables: `partner`. Endpoints: `GET /partners/{id}`.
- Demo: generated client calls the endpoint; the row exists in Postgres.

### Part 1: Merchants (partner-relationship-service)

**04 · Partner registration + email OTP**
- Problem: anyone can type any email; we need proof they own it.
- Build: register, send OTP, verify; Redis-backed OTP with lifespan, attempt and resend limits (configured). First clean error responses.
- Why: the first gate of trust. Introduces the `otp` and `error` starters' ideas in place.
- Tables: `partner`, `contact_person`. Redis: `otp:*`.
- Endpoints: `POST /auth/register`, `POST /auth/otp/verify`, `POST /auth/otp/resend`.
- Demo: register → code (dev mode prints it) → verified; wrong code ×N → blocked.
- Real code: `PartnerAuthServiceImpl`, `PartnerOtpServiceImpl`, `NotificationServiceImpl`.

**05 · Partner lifecycle (state machine)**
- Problem: a partner can't jump from "registered" to "taking payments".
- Build: states PENDING_VERIFICATION → VERIFIED → WAITING_CONTRACT → APPROVED → ACTIVE ⇄ SUSPENDED → TERMINATED; a guard that rejects illegal transitions; KYB status, documents, contract.
- Why: the state machine is the backbone; every later check asks "is this partner ACTIVE?".
- Tables: `partner` (status), `partner_document`, `contract`, `partner_status_history`.
- Endpoints: admin `POST /partners/{id}/verify`, `/contract`, `/suspend`, `/terminate`, `/restore`.
- Demo: try an illegal jump → 409 with a clear error; legal path → APPROVED.
- Real code: `PartnerLifecycleServiceImpl`, `PartnerStateGuard`.

**06 · Four-eyes (maker-checker)**
- Problem: one admin alone can switch on a fraudulent store.
- Build: dual-control requests: maker initiates, a different checker approves; no self-approval; configured expiry; a ShedLock sweep that expires stale requests.
- Why: the single most important control for owners (see the owner pitch); reused later by commission.
- Tables: `dual_control_request` (unique index: one PENDING per subject).
- Endpoints: `POST /dual-control`, `POST /dual-control/{id}/approve|reject`.
- Demo: maker approves own request → rejected; second admin approves → partner ACTIVE.
- Real code: `DualControlServiceImpl`, `DualControlExpirySweepJob`.

**07 · Logins and API clients (Keycloak)**
- Problem: partners need a portal login and their servers need machine credentials.
- Build: Vault joins docker-compose (app config secrets under `secret/app`, replacing `.env`); Keycloak realm; portal user on registration; M2M client per sales point with `partner_id` claim; secret shown once; rotation. Resource-server security on every endpoint.
- Why: identity is separate from business data; never store passwords yourself.
- Tables: `partner_client`, `keycloak_audit_log`.
- Endpoints: `POST /portal/clients`, `POST /portal/clients/{id}/rotate`.
- Demo: get a client-credentials token; call a protected endpoint with and without it.
- Real code: `KeycloakAdminServiceImpl`, `PartnerClientServiceImpl`.

**08 · Sales points + site check**
- Problem: a partner may run several websites, and a fake one must not take payments.
- Build: sales point with acquiring settings (DRAFT → ACTIVE → SUSPENDED → CLOSED), return-URL allowlist, allowed schemes, refund window; site check (PASSED/FAILED with findings); internal "is this sales point active?" API.
- Why: the unit that actually takes payments; the payment service will ask about it on every request.
- Tables: `client_acquiring_settings`, `site_check`, `sales_point_change_request`.
- Endpoints: admin `POST /partners/{id}/sales-points`, `POST /site-checks`; internal `GET /internal/sales-points/{id}`.
- Demo: create → site check FAILED → cannot activate; PASSED → ACTIVE.
- Real code: `SalesPointInternalServiceImpl`, `SiteCheckServiceImpl`.

**09 · Extract the starters**
- Problem: the second service is about to copy error handling, security and Redis config.
- Build: `error-starter`, `security-starter`, `redis-starter`, `otp-starter` as Spring Boot auto-configurations; the partner service now depends on them.
- Why: refactoring with a reason. Duplication appears now, not in episode 02.
- Demo: same behaviour, half the code; a new empty service gets errors and security for free.
- Real code: `*-starter/*-autoconfigure`.

### Part 2: Money rules (reference services)

**10 · Commission service**
- Problem: every payment needs a fee, and the fee depends on store, scheme and date.
- Build: rules with scope priority (SALES_POINT > MERCHANT > CARD_SCHEME), validity window, history; resolve endpoint; changes through maker-checker (reuses episode 06's idea).
- Why: money logic lives in one place; payments only ask "what's the fee?".
- Tables: `commission_rule`, `commission_rule_history`, `commission_change_request`.
- Endpoints: internal `POST /internal/commissions/resolve`.
- Demo: three overlapping rules → the most specific one wins.
- Real code: `CommissionResolutionUtils`, `CommissionChangeRequestServiceImpl`.

**11 · Terminals (MID/TID)**
- Problem: the processing center only accepts debits through a registered terminal.
- Build: EPOS registry per sales point and scheme; resolve endpoint; audit log.
- Tables: `epos_terminal`, `epos_audit_log`.
- Endpoints: internal `GET /internal/epos/resolve?salesPointId&scheme`.
- Demo: no ACTIVE terminal → resolve fails closed.
- Real code: epos-reference-service, `TerminalResolver`.

### Part 3: Cards (adapters + vault)

**12 · A fake processing center**
- Problem: viewers have no SVGate or Humo access, so nothing past this point could be tested.
- Build: a small simulator service with Uzcard-like REST and Humo-like SOAP endpoints; configurable responses: approve, decline, timeout, "no answer".
- Why: the series stays buildable outside the bank; failure cases become easy to trigger.
- Demo: call "authorize" → approved; flip a switch → timeout.

**13 · Card adapters**
- Problem: two schemes, two protocols (REST and SOAP), one interface wanted.
- Build: `uzcard-adapter` and `humo-adapter` behind one command interface: card OTP, authorize, capture, reverse, status.
- Why: the payment service must not care which scheme a card belongs to.
- Demo: same command, two schemes, both against the simulator.
- Real code: uzcard-adapter (SVGate), humo-adapter (spring-ws), `command/impl/{humo,uzcard}`.

**14 · BIN registry + card vault**
- Problem: we must know a card's scheme, and we must never store a card number in plain text.
- Build: BIN lookup with scheduled sync; card-processor: AES-256-GCM encrypted PAN, a token returned instead; resolve/reveal/binding endpoints; `encryption-starter`.
- Why: tokenization; a database leak exposes no card numbers (owner pitch, threat 4).
- Tables: `bin_range`, `card_token`, `card_audit`.
- Endpoints: internal `POST /internal/cards/binding/confirm`, `/resolve`, `/reveal`.
- Demo: store a card → the table holds only ciphertext + token.
- Real code: card-processor-service (`CardTokenCodec`, `CardDataProtectionService`), bin-reference-service (`BinRegistrySync`).

### Part 4: Payments (ecom-acquiring-service)

**15 · Create a payment: HMAC + idempotency**
- Problem: anyone can fake a request, replay it, or a retry can create a second payment.
- Build: `POST /payments` with JWT + HMAC-SHA256 (method, path, timestamp, nonce, body hash), configured timestamp window, Redis nonces, merchant secret from Vault (second path: `secret/merchants`); `Idempotency-Key` with stored response replay; sales-point guard that fails closed.
- Why: the three request threats from the owner pitch, in code.
- Tables: `payment`, `idempotency_key`. Redis: `ecom:hmac:nonce:*`.
- Demo: valid request → 201; replayed → rejected; same key twice → same response, one payment.
- Real code: `HmacAuthenticationFilter`, `IdempotencyService`, `SalesPointGuard`, `PaymentRegistrar`.

**16 · Hosted page: card → OTP**
- Problem: the card must be typed on the bank's page, never the store's.
- Build: session token (hashed, configured TTL), submit card, OTP challenge (scheme OTP or SMS), one operation at a time per payment (Redis lock), attempt limit.
- Tables: `payment_session`.
- Endpoints: `GET /sessions/{token}`, `POST /sessions/{token}/card`, `POST /sessions/{token}/otp`.
- Demo: open the page → card → OTP → ready to debit.
- Real code: `PaymentSessionServiceImpl`, `CardVerificationServiceImpl`, `OtpChallengeServiceImpl`.

**17 · The debit**
- Problem: two concurrent clicks must never charge twice.
- Build: atomic claim SESSION_OPEN → AUTHORIZING (conditional update), terminal resolve, commission snapshot, authorize + capture through the adapter, operation journal, `PaymentStateMachine`.
- Why: the heart of the system; double charge is the owners' biggest fear.
- Tables: `payment_operation`.
- Demo: fire two confirms at once → exactly one debit.
- Real code: `DebitClaim`, `ProcessorPaymentExecutionAdapter`, `statemachine/PaymentStateMachine`.

**18 · Observability: metrics, traces, logs**
- Problem: one payment crosses five modules and a processing center; when it's slow or stuck, nobody can see where.
- Build: Prometheus + Grafana (Micrometer metrics: payments by status, processing latency, timeouts), OpenTelemetry tracing into Tempo, logs into Loki; a starter dashboard.
- Why: the next episode (silent processing) is invisible without it. The real repo has no metrics or tracing yet.
- Demo: run 20 payments, one timeout; follow that payment's trace across modules; see the timeout spike on the dashboard.

**19 · When the processing center goes silent**
- Problem: a timeout leaves the money state unknown.
- Build: Temporal resolution workflow (status polling with backoff), sweep workflow, manual review queue, outbox events.
- Why: never blind-retry a debit; resolve the truth first.
- Tables: `manual_review_item`, `event_outbox`.
- Demo: simulator in "no answer" mode → workflow resolves → CAPTURED or reversed.
- Real code: `PaymentResolutionWorkflowImpl`, `ResolutionSweepWorkflowImpl`, `AttemptLimitEscalator`.

**20 · Events: transactional outbox + Kafka**
- Problem: other systems (merchant webhooks, notifications, antifraud) must learn about payment events, and a crash between "save" and "publish" must never lose or invent an event.
- Build: transactional outbox (event row written in the same DB transaction), a relay that publishes to Kafka, a merchant webhook consumer with retries.
- Why: the real repo writes `event_outbox` but nothing publishes it. Messaging, not event sourcing: Postgres stays the source of truth.
- Tables: `event_outbox`. Topics: `payments.captured`, `payments.declined`.
- Demo: kill the app between save and publish → the event still arrives exactly once after restart.

**21 · Payment links**
- Problem: merchants selling in chats have no website checkout.
- Build: link creation, claim, expiry sweep.
- Tables: `payment_link`.
- Real code: `PaymentLinkServiceImpl`, `PaymentLinkExpirySweep`.

**22 · Refunds and reversals**
- Problem: money must go back: same day (reversal) or later (refund within the configured window).
- Build: reverse vs refund operations, partial refunds, PARTIALLY_REFUNDED → REFUNDED.
- Demo: refund 30% → PARTIALLY_REFUNDED.

**23 · Billing and reports**
- Problem: partners pay for API usage; merchants need a daily report.
- Build: billing counters flushed by a Spring Batch job; daily report export.
- Real code: `BillingFlushJob`.

**24 · Hardening (exercises from real gaps)**
- Problem: production needs more than happy paths.
- Build, as viewer exercises: the HMAC nonce/timestamp window fix, KYB enforcement at activation, per-sales-point payment limits.
- Why: honest engineering; shows how a real system grows.

### Part 5: Growing up

**25 · Extract a module into a service**
- Problem: the card vault needs stricter security and its own deploy (PCI DSS scope).
- Build: move the `card` module into its own Spring Boot service; replace the in-process `CardApi` with a REST adapter behind the same port; give it its own database.
- Why: shows *why* microservices exist: clean boundaries made the move cheap. Mirrors the real card-processor-service.
- Demo: same payment flow, now across two services.

---

## Open decisions

1. **Companion repo:** a new public teaching repo (simplified) vs excerpts from the real one. Recommended: new repo; the real one stays private.
2. **Length:** Part 0 short (3–6 min each); build episodes 8–15 min with code on screen.
3. **Language:** English first; Uzbek copies on request (as with the owner pitch).
