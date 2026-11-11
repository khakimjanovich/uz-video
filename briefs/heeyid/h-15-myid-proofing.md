# h-15-myid-proofing: brief

**Lesson 15 of heeyID, Module 4 (Proofing).** 5–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say why only the master app runs MyID, draw who opens the proofing session and what travels back (a one-use result code, not the result), list the checks on the result code and on the result, and say which failures count.

## The question that opens the lesson
Aziz loses the network in a lift one second after MyID checks his face: "So did the check pass, or did it vanish?" Answered near the end (lost result code).

## Bridge
"In lesson 14, Aziz accepted the consent screen …" Then: "This lesson follows that one session."

## Story
1. **Side app first.** The marketplace needs level 2 for instalments. The step-up answer to a side app is "continue in the mobile bank"; a proofing request from a side app gets an error (E-APP-01) and no session. Narrator: one more tap, one door to defend.
2. **The backend opens the session.** Installation credentials (never on the phone), the bank's threshold, a session identifier, a handle to the master app on the same device. Session Open: one customer, one device, one purpose, kind full proofing. Lifetime set by MyID. No second open session.
3. **Capture.** MyID captures the document and the face, checks liveness, compares with state records, and gives the app a one-time result code.
4. **The code is a ticket.** Exchanged only by the platform, in MyID's five minutes, once, only from the device and customer of the Open session. A copied code from another phone is refused with a security event. The code is never stored.
5. **Checks on the result.** 14-digit personal identification number; an expired document is a failure even on MyID success; below the bank's minimum is "face not matched". Then the verified identity is kept and the confirmation screen shows masked data.
6. **Plain failures.** Glare → reason key "poor image" → "try again now". No code or provider name shown. Person or capture failures count (lesson 11 limits); service failures do not. MyID down: "temporarily not available", level unchanged, no deferred proofing.
7. **The lift.** The app reports completion, no code arrived. The platform waits until MyID closes the session, asks for the status, finds the code and continues. No code: not counted, try again.

## How it works (diagram and map)
- Diagram: marketplace → heeyID with "continue in the mobile bank"; E-APP-01 badge. Then mobile bank, heeyID, MyID: "open session" packet, handle packet, capture, "result code" packet, exchange. A second phone (unknown device) sends a copied code: stopped, red. Failure badges. Lift: the result-code packet stops mid-edge, then the status call recovers it.
- Map: mobile bank, customer gateway, adapters, MyID; side apps dimmed.

## Ending
Recap, then: next year Aziz buys a new phone. Must he show his passport to MyID again? Next: prove once.

## Terms (on screen)
proofing session, result code, reason key. Glossary additions: none.

## Do not
- No bank names, no prices, no policy numbers. MyID's own values (10-minute session, 5-minute code) are provider facts, not policies.
- No re-check details (next lesson). No code on screen.

## Sources
SRS v3.7 SRS-PRF-01…05, PRF-09…11, SRS-APP-08, SRS-BLK-01…02, §5.1.1–5.1.6 · SAD v3.8 C-7, ADR-14, §4.3 (flow 3), §4.8 steps 1–3 · BRD v2.3 FR-05, FR-13, FR-90.
