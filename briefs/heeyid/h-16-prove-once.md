# h-16-prove-once: brief

**Lesson 16 of heeyID, Module 4 (Proofing).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say what the reusable identifier is and where it lives, tell a re-check from a full proofing, pick the kind for each purpose, and state the rule that no one may send a proofed customer to MyID for nothing.

## The question that opens the lesson
"How many times a year should a bank look at your face?"

## Bridge
"In lesson 15, Aziz passed a full proofing …" Then: "This lesson shows what the platform keeps from that day."

## Story
1. **The reusable identifier.** MyID issues it after success; valid until a date in the bank's contract with MyID; kept with the verified identity; never sent to the phone.
2. **The river.** Eight months later Aziz's phone falls into a river. New phone, mobile bank, number and password, new-device code through TAF, green. The old phone cannot approve, so after the configured waiting time the code is enough.
3. **Re-check.** A customer who was at level 2 on a new device: consent gate again, session with the identifier preset, straight to the camera, liveness and face only, a match result and no profile. Identity data does not change. The new phone becomes trusted.
4. **Which kind when.** Step-up and refresh: always full. New device and dormant account: re-check while the identifier is valid; else full with the personal identification number preset (still straight to the face). Yellow TAF verdict for a customer ever at level 2: the same rule.
5. **The rule.** Never send a level-2 customer with a valid document to MyID for another reason; no channel, app or partner can start it. Narrator: this rule matters more than the re-check. Prove once, then bind: no face template, no own face engine.
6. **Side apps.** No MyID at login; the marketplace session starts at level 1 and gets level 2 only after an approval in the mobile bank.
7. **Inside one journey.** A step-up that stopped after the result arrived is completed with the same result within the configured reuse period.

## How it works (diagram and map)
- Diagram: verified identity with a "reusable identifier" badge; a crossed phone path to the phone. Old phone crossed, new phone → heeyID → MyID with "face only" packet and "match ✓ · no profile". A purpose table built as badges on four small boxes. Marketplace on the new phone with "level 1 → approve in mobile bank".
- Map: MyID, customer gateway, records.

## Ending
Recap, then: the platform now holds the most sensitive record in the system. Who can read it, and how would anyone know? Next: the verified identity.

## Terms (on screen)
reusable identifier, re-check, full proofing. Glossary additions: none.

## Do not
- No prices (the SAD gives MyID prices; the script says only "costs the bank money").
- No policy numbers. No dormant-account details beyond one line (lesson 32). No code on screen.

## Sources
SRS v3.7 §2 (Re-check, Reusable identifier, Full proofing), SRS-PRF-07, SRS-PRF-08, SRS-AF-04, SRS-DEV-10, DEV-11, DEV-13, SRS-APP-08, §5.1.1 · SAD v3.8 C-8, ADR-15, §4.3 · BRD v2.3 FR-12, FR-12a, FR-20b, FR-90.
