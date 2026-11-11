# h-18-phone-check: brief

**Lesson 18 of heeyID, Module 4 (Proofing).** 4–5 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say why a face is not enough for level 2, draw the three steps of the phone check (face confirmation to TAF, MyID number comparison, TAF ownership), say what Confirmed and Processing do, and describe the phone review and the check log.

## The question that opens the lesson
Aziz's old university number is still on his government record: "So when his face passes MyID today, whose phone number is on the record?"

## Bridge
"In lesson 17, the verified identity went into the protected class, with the phone number from MyID inside it." Then: "This lesson uses that number for one job: the phone check."

## Story
1. **Why.** Level 2 = MyID proved the person and the number belongs to that person. A man with a SIM of a stranger's number passes MyID with his own face: without a phone check, level 2 on someone else's number.
2. **Step 1.** After confirmation (step-up only, not refresh), the platform sends TAF a face confirmation with the personal identification number and the verified number. The app never sees the number.
3. **Step 2.** Compare full international numbers. Same → Confirmed. Aziz's differ.
4. **Step 3.** TAF ownership: owner → Confirmed; not owner, not found, no answer → Processing. Today: owner.
5. **Confirmed.** Level 2 in every app, trusted device, new access grant at level 2, linking starts.
6. **What if not owner.** Processing, level 1, the app shows Processing; a phone review and an antifraud event. The review shows the masked values, time, device and app. No timer. Narrator: Processing is the bravest state — the platform admits it does not know. Operator approves or rejects with a reason; approval = Confirmed path; rejection = Rejected; both notify and audit. The review list is the only alert.
7. **The check log.** Each check of the number with provider, app and time: SMS in the marketplace, TAF at registration, MyID today.

## How it works (diagram and map)
- Diagram: Aziz, heeyID, MyID with "old number" badge; stranger with a SIM; heeyID → TAF "face confirmation"; number compare badge "≠"; heeyID → TAF "owner?" → "owner ✓". Confirmed: three badges. Processing branch: operator (phone review) with approve / reject. Check log box with three lines as badges.
- Map: customer gateway, adapters, TAF, admin gateway, staff.

## Ending
Recap, then: is Aziz already a customer of the bank, and how does the platform find him there without trusting a phone number? Next: linking.

## Terms (on screen)
phone check, verification status (Confirmed, Processing, Rejected), phone review. Glossary additions: none.

## Do not
- No bank names, no policy numbers. No number reassignment or re-registration (lesson 32). No code on screen.

## Sources
SRS v3.7 §2 (Check, Verification status, Phone review), SRS-PRF-12, SRS-AF-06, SRS-AF-07, SRS-REV-01, SRS-REV-02 · SAD v3.8 §4.8 (flow 8, steps 6–8), §5.1 phone_check and phone_review · BRD v2.3 FR-85.
