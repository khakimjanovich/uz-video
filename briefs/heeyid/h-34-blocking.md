# h-34-blocking: brief

**Lesson 34 of heeyID, Module 8 (Lifecycle and trail).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** name the only two ways to block a customer, list what one block does at the next request, and say when an unblock gives back the devices.

## The question that opens the lesson
"Who in this system is allowed to lock Aziz out of his own account?"

## Bridge
In lesson 33, a refresh with a different personal identification number ended in a block. This lesson opens that block: who sets it, what it does at once, who lifts it.

## Story
1. **Friday night.** Aziz's phone is stolen at the bazaar, still signed in. From his sister's phone he calls the bank: lock everything.
2. **Who can block.** Only two: the platform on a different number at a refresh, and an operator with a reason. A number reassignment never blocks. A failed face check never blocks; it counts an attempt (phone number, device, personal identification number), with cool-downs and a daily cap; only failures that the person or the capture caused count.
3. **One block.** Ends every grant, refuses every request (the thief gets an error), refuses registration and login with the number, stops open proofing sessions, keeps devices and identity data, sends "account blocked", opens or updates a case, writes an audit event and an antifraud event.
4. **Why at once.** Three writes together (customer state, Keycloak sessions, outbox); the revocation list in Valkey; the binding check at each renewal. Same writes for the operator and the automatic path.
5. **The case.** Customer, trigger, masked values, notes; other triggers; outcomes (no action, unblocked, link set by the bank, customer contacted). Phone reviews are a separate list.
6. **Saturday.** New phone, same number. Only an operator unblocks, with a reason. An unblock makes the devices Trusted again, so the operator revokes the stolen phone first. The new phone joins with the checks of lesson 24.
7. **The exception.** After a number mismatch, an unblock gives back no device: log in and pass a full proofing first.

## How it works (diagram)
- Stranger with the stolen phone; Aziz on another phone; operator; platform.
- Two "who can block" boxes; a crossed MyID face check with a counter chip.
- The block fan-out: grants ended, request refused at the stolen phone (packet stops red), case, antifraud system.
- Map beats: customer gateway, Keycloak, records, events, counters.
- Unblock: revoke the stolen phone (crossed), then devices back.

## Ending
Recap: two can block; a block ends every session at the next request, keeps the data, opens a case; only an operator unblocks. Open question: "account blocked" also went by push to the phone in the thief's pocket. What can a message on a stolen phone show? Next: notifications.

## Terms (on screen)
block, revocation list, case. Glossary additions: `Valkey` → "val key".

## Do not
- No policy numbers (daily cap, cool-downs: "configured"). No code on screen. No bank names.

## Sources
SRS v3.7 SRS-BLK-01…06, SRS-ADM-05, SRS-ADM-06, SRS-PRF-06, SRS-PRF-15 · SAD §4.7, §3.2 (Valkey revocation list), §5.1 (case).
