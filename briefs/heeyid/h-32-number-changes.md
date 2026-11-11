# h-32-number-changes: brief

**Lesson 32 of heeyID, Module 7 (Sessions and recovery).** 5–7 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** tell number reassignment, re-registration and a dormant account apart, say what MyID decides in each, and say why the old owner is never blocked.

## The question that opens the lesson
"How does the platform tell a new owner of a number from a thief of one?"

## Bridge
In lesson 31, the number left Aziz's account after the SIM question. This lesson covers three ways that a number and a person drift apart: number reassignment, re-registration, and a dormant account.

## Story
1. **A recycled number.** Aziz's new SIM card carries a number that an old owner (still a customer) used for years. On a new phone he looks like a thief: known number, strange phone, no password.
2. **Reassignment.** Not a registration; the password of the old owner is asked; Aziz resets it: new-phone checks, TAF code (his SIM), the old owner was at level 2 → MyID; Aziz's face passes, the personal identification number is a different person. The number leaves the old owner, no block; their sessions end; push "number removed"; they verify a new number at the next login; audit "number reassigned"; antifraud event. Narrator: never a block — a number changing hands is normal life.
3. **The new holder.** No account and MyID lists the number → new customer at level 2; not listed → level 1 with a phone review; already a customer (Aziz) → re-registration.
4. **Re-registration.** Usual shape: a level-1 customer steps up and MyID finds an existing customer. Number on MyID's list → moved to the existing customer; new phone trusted; earlier devices revoked ("replaced by re-registration"); the level-1 record closed; SMS "new phone registered" to the old number. Not listed → step-up stops, a case for an operator. Limited per day.
5. **Dormant account.** No device used for longer than the configured dormancy period. Never opens from a new phone with a code alone. Was at level 2: MyID re-check (or full proofing when the reusable identifier expired); side app: level 1 until the master-app approval. Never at level 2: the old record is locked, a new level-1 customer, audit "dormant account reset". A different person → reassignment.
6. **Safety.** Each case in one database transaction with its events: no number on two customers.

## Ending
Recap. Aziz is settled: one number, one trusted phone, level 2. Open question: his passport expires next year. What happens to level 2? Next: the identity refresh.

## Diagram
- `newHolder`-style flow with `aziz` + `newPhone` → `platform` → `taf`, `myid`; `someone` as the old owner ("old owner" badge); `records` for the two customer records.
- Re-registration: `newPhone` trusted, `trusted` (old phone) crossed "revoked", `smsService` to the old number, `operator` for the case.
- Dormant: `platform` badge "dormant", `myid` re-check, `marketplace` "level 1 until approval".

## Terms (on screen)
number reassignment, re-registration, dormant account. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("the configured dormancy period", "limited per day").
- No code on screen.

## Sources
SRS v3.7 SRS-PRF-14, SRS-PRF-15, SRS-PRF-16, SRS-DEV-05, SRS-DEV-11, SRS-DEV-13, SRS-DEV-17, SRS-REG-04, SRS-BLK-03 · SAD v3.8 §4.11, §4.10 step 8.
