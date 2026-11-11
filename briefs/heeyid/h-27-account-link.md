# h-27-account-link: brief

**Lesson 27 of heeyID, Module 6 (Side apps and the master app).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say when the account-link question appears (after a correct code and a Green TAF verdict in the master app, for a marketplace account marked not confirmed), and what Yes and No (then Continue) do to the account and its sessions.

## The question that opens the lesson
"Should the mobile bank simply trust that old web account?"

## Bridge
In lesson 26, a new customer on the marketplace website got an app account marked not confirmed. This lesson removes that mark, in the mobile bank, right after the TAF check.

## Story
1. **Two doors.** Last spring Aziz made a marketplace web account (SMS code + password). Today he installs the mobile bank for the first time.
2. **Why the mark.** A web SMS code proves only that someone read a message to the number; no phone, no SIM check (no TAF part in a browser).
3. **Same number, same password.** The number already has a customer: not a new registration; the mobile bank asks for the same password. Then the TAF code and a Green verdict.
4. **The question.** "This number also has a marketplace account. Is it yours? Link it?"
5. **Yes.** The account stays; mark: linked, "verified through the mobile bank"; it uses the level of the person.
6. **No (what-if: someone else made it).** Second question: "This ends all marketplace sessions and closes that account. Continue?" Back changes nothing. Narrator: the second question protects the real owner from one wrong tap. Continue: all marketplace sessions end; the account is closed, not deleted; an operator can open it again with a reason in the retention period; a later login makes a new app account. Password change at once.
7. **The twist.** If someone else made it, Aziz never knew the password. He resets it in the mobile bank: TAF plus the MyID check the reset offers (full check, he was never at level 2) → the reset does not wait (lesson 30). The new master-app session outranks every marketplace session, so the reset ends them (lesson 29).
8. **Trail.** Each answer: an audit event and an antifraud event.

## Ending
Recap. Aziz said Yes; later he is at level 2. Open question: the marketplace needs his address for delivery, and the platform keeps his registered address from MyID. Can the marketplace simply read it? Next: address sharing.

## Diagram
- `marketWeb` (not confirmed) and `mobileBank` beside `platform`; `taf` for the Green verdict.
- Question badge on the mobile bank; Yes → "linked" accent; No → `someone` on the web, Continue → marketWeb crossed, "closed, not deleted"; `operator` can reopen.
- Reset: `passwordReset` with `taf` and `myid`, "does not wait".

## Terms (on screen)
not confirmed, linked, closed (not deleted). Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("the retention period").
- No code on screen.

## Sources
BRD v2.3 FR-88, FR-92, FR-94 · SRS v3.7 SRS-APP-02, SRS-APP-06, SRS-APP-10, SRS-APP-12, SRS-REG-04, SRS-DEV-17, SRS-ADM-05, SRS-AUD-01 · SAD v3.8 §4.16, ADR-33.
