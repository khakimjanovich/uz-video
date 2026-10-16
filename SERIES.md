# heeyPay Acquiring Series — Episode Plans

Workflow: **plan (this file) → script (`reels/<id>/script.txt`) → video (`steps.ts` + voice + render)**.
Videos are in English. Each episode's handoff question is the next episode's hook.

Sources: **Code** = implemented in the acquiring services; **BRD** = requirement only, not built yet (say "planned", never show as live).

## Template

```
### <N>. <Title>  — id: epNN-<slug>  · status: plan | script | video
Source:   Code | BRD (+ section / FR ids)
Hook:     <question the viewer has>
Naive v1: <simplest design>                      (optional)
Break:    <real edge case that kills v1>
Fix (v2): <what the system actually does>
Handoff:  <open question → next episode>
Nodes:    <ids from series/acquiring/nodes.ts; new ones to add>
```

---

## MVP 1 — Core payment acceptance

### 1. Why an acquirer — id: ep01-gateway (+ -uz) · status: video
Source:   Law ZRU-578; BRD §2
Hook:     What does an online store in Uzbekistan need to accept card payments?
Break:    Only CBU-licensed banks / payment orgs may connect to Uzcard & Humo — not stores.
Fix (v2): A bank acquirer sits in between; card entered on the bank's page; one contract, payout to the store's own account.
Handoff:  Before a store takes its first payment, what does the bank check?
Nodes:    buyer, merchant, bank, network

### 2. Onboarding — id: ep02-onboarding (+ -uz) · status: video
Source:   Code (partner onboarding service)
Hook:     Before a store takes its first payment, what does the bank check?
Naive v1: Store signs up → admin clicks "activate".
Break:    One admin alone can switch on any store — fraud or mistake goes live instantly.
Fix (v2): Email OTP → KYB documents → verification → offline contract → settlement account + chargeback clause → sales point (API key, callback, schemes) → site check → activation needs a second admin (maker-checker, no self-approval, 24h expiry).
Handoff:  The store has an API key — how does its server safely create a payment?
Nodes:    merchant, bank, + admin, checker, salespoint

### 3. Creating a payment (S2S) — id: ep03-s2s · status: plan
Source:   Code (acquiring service)
Hook:     The store has an API key — how does its server safely create a payment?
Naive v1: POST amount + order with the API key.
Break:    A captured request is replayed, or a retry charges the same order twice.
Fix (v2): OAuth token + HMAC signature (timestamp ±5 min, one-time nonce) + Idempotency-Key → returns a one-time payment URL.
Handoff:  What if the item is already gone when the buyer starts paying?
Nodes:    merchant, gateway, + vault? (secret store)

### 4. Pre-check — id: ep04-precheck · status: plan
Source:   Code (off by default) + BRD FR-13..15
Hook:     What if the item is already gone when the buyer starts paying?
Naive v1: Charge first, refund later.
Break:    Buyer charged for an out-of-stock order; refund takes days.
Fix (v2): Before debit the gateway asks the store: approve / decline / allowed amount range. Store unreachable → fail closed.
Handoff:  Approved — now how does the card actually get charged?
Nodes:    merchant, gateway

### 5. Card → OTP → Uzcard/Humo — id: ep05-debit · status: plan
Source:   Code
Hook:     How does the card actually get charged?
Naive v1: Take card number, send debit.
Break:    Anyone with a stolen card number could pay.
Fix (v2): Hosted page → card tokenised → SMS code (from Uzcard/Humo or the bank) → debit via scheme terminal → CAPTURED.
Handoff:  What if Uzcard/Humo never answers?
Nodes:    buyer, gateway, network, + processor

### 6. Unknown outcome — id: ep06-unknown · status: plan
Source:   Code
Hook:     The debit timed out — was the money taken or not?
Naive v1: Retry the debit.
Break:    Retry = buyer charged twice.
Fix (v2): Payment stays AUTHORIZING; a workflow polls the scheme status → capture / cancel / manual review. Never blind-retry money.
Handoff:  No website at all — can a store still get paid?
Nodes:    gateway, network, + workflow, reviewer

### 7. Payment links — id: ep07-links · status: plan
Source:   Code
Hook:     No website at all — can a store still get paid?
Break:    A reusable link gets paid twice or after the deal is off.
Fix (v2): Single-use link with expiry; cancel unused; claim → normal payment session.
Handoff:  The buyer wants the money back — same day or next week, is it the same?
Nodes:    merchant, buyer, gateway

### 8. Reversal vs Refund — id: ep08-refund · status: plan
Source:   BRD §7.1.4 (not built — "planned")
Hook:     Money back — same day or next week, is it the same?
Fix (v2): Before clearing: reversal, full only, never debited. After clearing: refund, full/partial, ≤ original, only to the original card, 10 / 60-day window.
Handoff:  How does the store's server learn about all these status changes?
Nodes:    buyer, merchant, gateway, network

### 9. Webhook & T+1 settlement — id: ep09-settlement · status: plan
Source:   BRD FR-95/96, FR-114..116, §10 (not built — "planned")
Hook:     "Paid" in one second — so why does money arrive tomorrow?
Fix (v2): Signed webhook with retries; clearing → terminal account → fee withheld → store account, T+1.
Handoff:  Can a returning buyer skip typing the card?
Nodes:    gateway, merchant, bank, + ledger accounts

## Later MVPs (BRD only)

### 10. Saved cards & recurring — MVP 2
### 11. Invoicing by phone number — MVP 3
### 12. Mobile SDK — MVP 4
### 13. Split payments — MVP 5
### 14. Hold & Capture + OFD receipt — MVP 6
### 15. UzQR & MUNIS — separate topic
