# h-24-new-device: brief

**Lesson 24 of heeyID, Module 5 (Devices and login).** 5–7 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** walk through a new-device login in the master app (password, TAF code, approval on the old phone, verdict, account check, new record), and say when the code alone is enough.

## The question that opens the lesson
"Aziz buys a new phone. It has his number and he knows his password. Why is that not enough?"

## Bridge
In lesson 23, Aziz logged in on a phone the platform already knew. This lesson starts on a phone it has never seen: the new-device code, the approval on the old phone, and the account check.

## Story
1. **The new phone.** Aziz moves his SIM card to a new phone, installs the mobile bank, types his number and password. The password is correct (no new-device request before a correct password). The device is not known: a new-device request starts.
2. **The code.** In the master app, TAF sends the new-device code by SMS to the verified number at once, with the type for a login and the device model.
3. **The old phone.** Aziz's old phone still has a master-app session of rank 2 (Green verdict, lesson 29). The platform sends a push signal to it, with no code, only the request identifier. The app pulls the request: the device model, the network address, the time, a warning never to give a code to anyone, and "Approve" / "This was not me".
4. **Code and approval.** With a rank-2 session on a different device, the login continues only after a correct code and the approval. No answer in the approval waiting period (policy): a correct code is enough. No rank-2 session anywhere: a correct code is enough. Rank-1 sessions get only the notice, without the choices.
5. **The verdict.** TAF scores the attempt (lesson 12).
6. **The account check.** Dormant account: lesson 32. Ever at level 2 (Aziz): consent and a MyID re-check on the new phone, or a full proofing when the reusable identifier has expired. Never at level 2: the login completes at level 1; a step-up later.
7. **Completion.** A device record: Trusted after MyID, else Known. A new grant. Notice "new device login" by push to the other devices and by SMS to the number, with the model, the address and the time. Audit and antifraud events.
8. **The other button.** "This was not me" refuses the login and puts the number on hold (lesson 31).
9. **Side apps, one line.** On a new phone in a side app: with a rank-2 master-app session, the approval replaces the code; else the bank SMS code and session level 1 (lesson 26).

## How it works (the diagram)
- Aziz → new phone → heeyID; badge "password ✓", "new device".
- heeyID → TAF → new phone: "new-device code".
- heeyID → old (trusted) phone: packet "request id" (no code); badge "Approve · This was not me".
- Old phone → heeyID: "Approve". TAF "Green".
- New phone → MyID: "re-check"; new phone badge "Trusted".
- Notice packets to the old phone and by SMS.
- Map: customer gateway, Valkey (request), TAF, push, MyID.

## Ending
Recap: on a new phone the password is not enough. The code proves the SIM, the old phone approves, MyID proves the face. Open question: a trusted phone is safe from a stranger's hands. But what if Aziz himself is guided by a stranger, on a phone call, to install a screen-sharing app? Next: remote access.

## Terms (on screen)
new-device request, approval request, account check. Glossary: none new.

## Do not
- No numbers (waiting period, code lifetime). No hold details (lesson 31), no dormant details (lesson 32), no rank rules (lesson 29).
- No code on screen. No bank names.

## Sources
SRS v3.7 SRS-DEV-10, SRS-DEV-13, SRS-DEV-14, SRS-DEV-15 (one line), SRS-DEV-16, SRS-APP-05, SRS-APP-10 · SAD v3.8 §4.10, ADR-26, ADR-30, TB-1.
