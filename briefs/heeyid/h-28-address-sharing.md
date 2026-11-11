# h-28-address-sharing: brief

**Lesson 28 of heeyID, Module 6 (Side apps and the master app).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw the address-sharing request (marketplace backend → platform checks → push signal → master-app question → one-time read, audited), and say why there is no standing consent.

## The question that opens the lesson
"Why should anyone ask Aziz before the marketplace gets that address?"

## Bridge
In lesson 27, Aziz linked his marketplace account in the mobile bank. This lesson is the first time that the marketplace wants something from his verified identity.

## Story
1. **The bookshelf.** Aziz orders a bookshelf in the marketplace app and taps Add address. The platform knows his registered address from MyID.
2. **The wall.** Each app accepts only its own tokens (lesson 5). The identity summary gives the level, the verified number, a display name; never an address. The address is in the protected record, encrypted with the bank's keys, each read audited. One way out: a sharing request that the customer approves.
3. **The request.** The marketplace backend asks with its own token. The platform checks level 2 and a linked account; else "continue in the mobile bank". The request waits the configured time; push signal with the request identifier only; the mobile bank pulls it: "Share your verified address with the marketplace?"
4. **Share.** One read with the purpose "address sharing", an audit event with the reader (marketplace) and the purpose; the marketplace collects it one time and saves it.
5. **Refuse or no answer.** Nothing saved; the marketplace gets a refusal; audited.
6. **No standing consent.** Next month, on the website, the mobile bank asks again. Narrator: a box ticked once would let the marketplace read the address forever.
7. **Deletion.** The customer deletes a saved address in the marketplace; the platform takes no part.
8. **What the design does not do.** No key to the record, no passport data, no request at level 1, no way to skip the question.

## Ending
Recap. Open question: Aziz has many sessions; a stranger with a session in another browser tries to end Aziz's mobile-bank session. Which session wins? Next: sessions and their rank.

## Diagram
- `marketplace` → `platform` → `address`; `mobileBank` for the question; checks as badges ("level 2?", "linked?").
- Share: packet "address, one time"; audit badge "reader: marketplace · purpose". Refuse: address crossed.
- Second request from `marketWeb`.

## Terms (on screen)
sharing request, standing consent, protected record. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("the configured waiting time").
- No code on screen.

## Sources
BRD v2.3 FR-89 · SRS v3.7 SRS-APP-07, SRS-APP-08, SRS-TEN-03, SRS-DEV-08, §6.3, SRS-AUD-01 · SAD v3.8 §4.17, ADR-33.
