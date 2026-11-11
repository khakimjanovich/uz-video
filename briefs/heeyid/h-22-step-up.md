# h-22-step-up: brief

**Lesson 22 of heeyID, Module 5 (Devices and login).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say where the required level of an app lives, why the platform never refuses a customer whose level is too low, what the step-up answer contains, and why only the master app can run it.

## The question that opens the lesson
"Aziz is at level 1 and taps 'My orders' in the marketplace. The page needs level 2. Should the marketplace say no?"

## Bridge
In lesson 21, the token carried the session level. This lesson shows what an app does when that level is too low: the required level of each app, the step-up, and the trip to the master app.

## Story
1. **Required level.** Each app in the installation has a name, a kind and a required level. The installation does not start until at least one app has a required level. An app with required level 1 is usable at once after registration.
2. **The rule for personal data.** Each app must ask for level 2 before it shows personal data: orders, addresses, cards. The app reads the session level from the identity summary (or the token).
3. **The answer is never "no".** The marketplace calls the step-up. The answer: current level 1, required level 2, and the checks that give it: consent, full proofing with MyID, phone check.
4. **Side app → master app.** The marketplace is a side app. The answer tells it to continue in the mobile bank. A proofing request from a side app is refused. MyID runs only in the master app.
5. **In the mobile bank.** Consent (lesson 14), MyID (15), confirm the data, phone check (18). Confirmed: level 2, the phone becomes Trusted, a new token at level 2.
6. **Only the check gives the level.** No app, no approval and no operator gives level 2 without a MyID proofing. The person's level is the same in all apps.
7. **Person level and session level.** In the master app, a session has level 2 only on a trusted device; on a different device it has level 1. A side-app session gets level 2 only after an approval in the master app (lesson 26).

## How it works (the diagram)
- Aziz → marketplace → heeyID; badge "level 1", "My orders: needs level 2".
- Packet "step-up" → answer badge "level 1 → 2: consent · MyID · phone".
- Marketplace → mobile bank packet "continue in the mobile bank"; a crossed MyID edge from the marketplace.
- Mobile bank → MyID; badge "level 2", phone "Trusted".
- Last: the person badge "level 2" with two sessions: mobile bank (level 2), marketplace (level 1 until approval).
- Map: dot on the customer gateway, then the master app and MyID.

## Ending
Recap: each app has a required level; the platform never refuses, it gives the way up; the way up runs only in the master app. Open question: Aziz logs out of the mobile bank tonight. Tomorrow, on the same trusted phone, how does he get back in? Next: login on a known device.

## Terms (on screen)
required level, step-up, session level. Glossary: none new.

## Do not
- No approval flow details (lesson 26), no rank (lesson 29).
- No code on screen, no error codes spoken. No bank names.

## Sources
SRS v3.7 SRS-REG-08, SRS-REG-09, SRS-DEV-08, SRS-APP-08, SRS-APP-09, SRS-TEN-02, SRS-TEN-04 · SAD v3.8 §3.3 (module 2), §4.8, ADR-27, ADR-28 (go-live check), §10.2 (/v1/step-ups).
