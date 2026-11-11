# h-30-password-reset: brief

**Lesson 30 of heeyID, Module 7 (Sessions and recovery).** 5–7 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say which checks a master-app reset runs, when a reset waits and who can cancel it, what makes it immediate, and who may use the SMS reset in a side app.

## The question that opens the lesson
"Every SMS to Aziz's number now arrives on the stranger's phone. Is that enough to take the account?"

## Bridge
In lesson 29, a password change ended every session of the same or a lower rank. This lesson opens the other door to a new password: the reset, when the person has no session at all.

## Story
1. **SIM swap.** A stranger with Aziz's number on a new SIM card taps Forgot password in the mobile bank.
2. **The checks.** The checks of a login from that phone without the password: known phone → TAF code; new phone → new-device code through TAF and the account check.
3. **MyID stops him.** The verdict can be green (the SIM is real), but Aziz was at level 2: MyID on the new phone; the face fails.
4. **Time as the second guard.** For a customer never at level 2: an active session makes the reset wait the configured period; the answer gives the end time; "password reset requested" by push to every session and by SMS.
5. **Who cancels.** Only a rank-2 session or a bank operator with a reason; rank-1 sessions get no cancel button. Cancel: the old password stays, "reset cancelled". End of the wait: new password, a session, every other session of the same or a lower rank ends, probation starts, "password changed". Narrator: an SMS code alone must never take an account from a person who is still using it.
6. **The honest case.** Aziz forgets his password on his trusted phone: TAF green, MyID offered in the reset, re-check passes → no wait. A never-level-2 customer: full MyID with consent. Without MyID → waits. No active session → no wait.
7. **Side apps.** SMS reset only for a customer with no master-app account, never at level 2; else the mobile bank. Limited per day, then a cool-down; the wait still applies. The side-app-only SIM-swap risk is accepted and recorded.
8. **Trail.** Audit + antifraud event and a notification for each step; resets counted; an operator can cancel or approve.

## Ending
Recap. Open question: the stranger guessed the password and logs in; Aziz's phone shows "Approve" or "This was not me". What happens after "This was not me"? Next: this was not me.

## Diagram
- `stranger` → `newPhone` → `platform`; `taf`, `myid` (face ✕).
- `passwordReset` (waits) with `trusted` (rank 2, Cancel) and `marketWeb` (rank 1, no button), `operator`.
- Honest case: `trusted` → `passwordReset` with `taf` green and `myid` ✓ → "no wait". Side app: `marketplace` → `smsService`.

## Terms (on screen)
waiting reset, cancel, SMS reset. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("the configured waiting period", "limited per day").
- No code on screen.

## Sources
BRD v2.3 FR-22a, FR-92, FR-94, R-15 · SRS v3.7 SRS-DEV-13, SRS-DEV-17, SRS-APP-10, SRS-APP-11, SRS-APP-12, SRS-ADM-05 · SAD v3.8 §4.13, ADR-35.
