# heeyPay Acquiring Series — Episode Plans

Workflow: **plan (this file) → script (`reels/<id>/script.txt`) → video (`steps.ts` + voice + render)**.
Each episode ships in English (TTS voice) and Uzbek (self-voiced). Videos open with the episode's question and end on the last step of the flow — no closing question.

**Tier 1 — the high road:** walk the whole flow first, one stage per episode: *what happens and who does it*. No naive version, no break/fix.
**Tier 2 — deep dives:** only after Tier 1 is complete. Naive → break → fix, one mechanism per episode.

Sources: the story comes from the **BRD** (what the system should do); precision comes from the **code** (real names, steps, order). Videos never mention build status ("planned", "not live") — not in voice, not on screen. Values that are settings in the code (timeouts, expiry, roles, limits) are described as "the configured time / role / limit", never as their default number.

## Template

```
### <N>. <Title>  — id: epNN-<slug>  · status: plan | script | video
Source:   Code | BRD (+ section / FR ids)
Hook:     <question the viewer has>
Flow:     <Tier 1: what happens, step by step>
Naive v1 / Break / Fix:  <Tier 2 only>
```

---

## Tier 1 — MVP 1 high road

### 1. Why an acquirer — id: ep01-gateway (+ -uz) · status: video
Source:   Law ZRU-578; BRD §2
Hook:     What does an online store in Uzbekistan need to accept card payments?
Flow:     Only CBU-licensed banks / payment orgs connect to processing centers → an acquirer sits between store and processing → card on the bank's page → one contract, payout to the store's own account.

### 2. Onboarding — id: ep02-onboarding (+ -uz) · status: video
Source:   Code (partner onboarding service)
Hook:     Before a store takes its first payment, what does the bank check?
Flow:     Register + email code + company documents → review, contract, settlement account → sales point with API key + site check → bank switches the store on.

### 3. Creating a payment — id: ep03-s2s (+ -uz) · status: video
Source:   Code (acquiring service)
Hook:     How does the store's server create a payment?
Flow:     Signed request (amount + order) → bank checks the signature, creates the payment → one-time payment link → store sends it to the buyer.

### 4. Card → debit — id: ep04-debit (+ -uz) · status: video
Source:   Code
Hook:     What happens to the buyer's card?
Flow:     Card on the bank's page → token → SMS code → bank debits through the processing center → approved → captured.

### 5. Payment status — id: ep05-status (+ -uz) · status: video
Source:   Code (GET payment is the authoritative state); BRD FR-95/96 for webhooks
Hook:     The money is captured — how does the store find out?

### 6. Payment links — id: ep06-links (+ -uz) · status: video
Source:   Code
Hook:     No website at all — can a store still get paid?
Flow:     Single-use link with expiry → buyer claims it → normal payment session.

### 7. T+1 settlement — id: ep07-settlement (+ -uz) · status: video
Source:   BRD FR-114..116, §10
Hook:     "Paid" in one second — so when does the money reach the store?
Flow:     Clearing → terminal account → fee withheld → store account, T+1.

## Tier 2 — MVP 1 deep dives (after Tier 1)

Each zooms into its parent Tier 1 part and uses naive → break → fix. Ordered by dependency, then by flow.

### T2-1. Four-eyes (maker-checker) — parent: Part 2 · id: t2-01-four-eyes (+ -uz) · status: video
Source:   BRD FR-93; code (PRS dual control; commission-reference-service change requests)
Hook:     Who is allowed to switch a store on, or change its fee?
Naive v1: One admin changes it and it takes effect at once.
Break:    One mistake or one bad actor goes live instantly.
Fix (v2): The change becomes a pending request; a second admin approves or rejects it; nobody approves their own request; unanswered requests expire after the configured time.

### T2-2. Commission: agreement and usage — parent: Parts 2 + 7 · id: t2-02-commission (+ -uz) · status: video
Source:   BRD FR-88, FR-93, FR-73, FR-115; code (commission-reference-service rules; ecom resolves at card submit)
Hook:     How much does the bank earn from each payment, and who decides it?
Naive v1: One fixed fee for every store.
Break:    Stores need their own rates per store, sales point and card network.
Fix (v2): Rules with percent + fixed, min/max, validity window and priority, set per store / sales point / card network, approved with four-eyes. At card submit the most specific rule wins, the fee is saved with the payment, then withheld at settlement.

### Later deep dives
- **T2-3 Safe requests** (parent Part 3): replayed copy, retry creates a second payment → HMAC signature with timestamp + one-time nonce, idempotency key.
- **T2-4 Card safety** (parent Part 4): store takes the card number, stolen card pays → bank page, token, SMS code.
- **T2-5 Inside the debit** (parent Part 4): one recorded debit per payment, terminal with MID/TID, hold + capture.
- **T2-6 Unknown outcome** (parent Part 4): processing center never answers → payment waits, status is polled → capture / cancel / manual review; never blind-retry money.
- **T2-7 Declines & released holds** (parent Part 4): decline → another card while attempts remain; capture fails → cancel the hold, confirm the money is released.
- **T2-8 Reversal vs refund** (separate flow, BRD §7.1.4): before clearing reversal, full only; after clearing refund, full/partial, ≤ original, original card only, 10 / 60-day window.

Dropped: merchant pre-check (stock/price validation is the store's side, not acquiring).

## Later MVPs (BRD only)

### 8. Saved cards & recurring — MVP 2
### 9. Invoicing by phone number — MVP 3
### 10. Mobile SDK — MVP 4
### 11. Split payments — MVP 5
### 12. Hold & Capture + OFD receipt — MVP 6
### 13. UzQR & MUNIS — separate topic
