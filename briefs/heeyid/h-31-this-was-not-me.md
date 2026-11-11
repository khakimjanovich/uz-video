# h-31-this-was-not-me: brief

**Lesson 31 of heeyID, Module 7 (Sessions and recovery).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** list the four steps after "This was not me" (refuse, hold, password change, SIM question), say what a hold blocks and what it keeps, and say why the number is not removed at once.

## The question that opens the lesson
"One tap. What must the platform do now, and what must it not do?"

## Bridge
In lesson 30, the stranger with Aziz's SIM card tried a reset, and MyID stopped him. This lesson follows his other try, a normal login with a guessed password, and the button that answers it.

## Story
1. **The buzz.** 11 p.m., a login request on Aziz's phone: unknown phone, unknown address, a minute ago; Approve / This was not me. He taps This was not me.
2. **How it got there.** Correct password first, then a new-device request; TAF code to the number (lands on the stranger's SIM); Aziz's rank-2 session gets the approval request (push without a code). The new phone needs both.
3. **Step 1: refuse.** Login refused, attempt ends, antifraud event.
4. **Step 2: hold.** The password is known and the SIM may be held: no login that needs a code to this number, on any phone or browser; no SMS; push only; the web login that needs a code is refused; Aziz's own sessions continue.
5. **Step 3: password change at once** on the refusing phone; other sessions of the same or a lower rank end (rank 2 → all others).
6. **Step 4: "Does your SIM card still work?"** Yes → the hold ends. No → MyID re-check on that phone (he was at level 2), then the number is removed as in a number reassignment, no block; he adds a new number.
7. **Trail.** Audit + antifraud event each step; notification "number on hold".
8. **Why a hold.** Narrator: people tap the wrong button; removal at once would take away the only login; the hold is easy to undo. Price: no SMS alerts during the hold; a customer with no session cannot end it alone; an operator ends it with a reason.
9. **Only rank 2 refuses.** Rank-1 sessions get a notification without buttons.

## Ending
Recap. Aziz said no; his old number goes back to the operator and one day to someone else. When that person registers with it, what does the platform see? Next: when numbers change.

## Diagram
- `stranger` → `newPhone` → `platform`; `trusted` with "Approve · This was not me"; `aziz`.
- Hold: badge "number on hold", `smsService` crossed, `marketWeb` login stopped, `trusted` "still works".
- SIM question: two branches; `myid` re-check; `operator` ends the hold.

## Terms (on screen)
number on hold, SIM question. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers.
- No code on screen.

## Sources
BRD v2.3 FR-77a, FR-92 · SRS v3.7 SRS-DEV-10, SRS-DEV-15, SRS-DEV-17, SRS-APP-04, SRS-APP-05, SRS-PRF-15, SRS-NTF-02 · SAD v3.8 §4.10 step 7, ADR-31.
