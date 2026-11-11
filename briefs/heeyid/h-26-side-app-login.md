# h-26-side-app-login: brief

**Lesson 26 of heeyID, Module 6 (Side apps and the master app).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw the side-app login (password first, then the master-app approval or the bank SMS code), and say why only the approval can give a side-app session level 2.

## The question that opens the lesson
"How does a website that knows nothing about this laptop trust that it is really Aziz?"

## Bridge
In lesson 24, Aziz logged in on a new phone in the mobile bank: the TAF code, then an approval on his trusted phone. This lesson takes the same idea to the side apps, where there is no TAF and no MyID.

## Story
1. **The laptop.** Aziz orders a washing machine, paid in parts, for his mother on her old laptop (marketplace website).
2. **What a side app cannot do.** No TAF part (no verdict, no face confirmation), no MyID, no remote-access detection. It has the password, the bank SMS service and the master app.
3. **New customer on the web.** Number, a code from the bank SMS service, a password two times. Result: level 1, a browser device record (never trusted), a marketplace app account marked **not confirmed** until a TAF check in the mobile bank, one session.
4. **Aziz's login.** Password first; nothing goes out before it is correct. He has a master-app session, so no code: an **approval request**, a push signal with only the request identifier, the mobile bank pulls it and shows app, browser, network address, time, a warning, "Approve" and "This was not me".
5. **Approve.** The new session gets the level of the approving session: level 2. The only way a side-app session reaches level 2. Narrator: the approval travels over a trusted session and carries no code, so no one can talk Aziz into reading it out.
6. **Other paths.** No answer in the configured time → bank SMS code, level 1. No master-app session → SMS code, level 1. "This was not me" → number on hold (lesson 31).
7. **Marketplace app on a new phone.** Same approval when a master-app session passed TAF; else an SMS code and level 1. A side app never asks for MyID at login; a new phone or a long pause gives level 1 until the approval.
8. **Notification.** "New web login" by push and SMS.
9. **Back to the credit.** At level 1 the marketplace would send Aziz to the mobile bank, where MyID runs.

## Ending
Recap: password first; approval or SMS code; only the approval gives level 2. Open question: a web account made before the mobile bank is "not confirmed". Was it really made by this person? Next: the account link.

## Diagram
- Laptop (`marketWeb`) → heeyID → Aziz's phone (mobile bank); SMS service box for the SMS path.
- Approval packet ("approval request", "Approve"), level badges ("level 2", "level 1"), "not confirmed" badge on the web account.
- Map moment: side apps, SMS, custgw at the "what a side app has" beat.

## Terms (on screen)
approval request, not confirmed, side app. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("the configured time").
- No rank words yet (lesson 29): say "a master-app session that passed the TAF check".
- No code on screen.

## Sources
BRD v2.3 FR-86, FR-87, FR-90, FR-91 · SRS v3.7 SRS-APP-03, SRS-APP-04, SRS-APP-05, SRS-APP-08, SRS-APP-09, SRS-DEV-10, SRS-DEV-16 · SAD v3.8 §4.15, ADR-33.
