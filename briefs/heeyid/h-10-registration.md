# h-10-registration: brief

**Lesson 10 of heeyID, Module 3 (Registration, level 1).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** walk a registration from the phone number to level 1, say which channel sends the code in the master app and in a side app, and say what happens when the number already belongs to a customer.

## The question that opens the lesson
"What happens between a phone number on a web page and a customer who can use every app of the bank?"

## Bridge
In lesson 9, the apps call the heeyID API through its contract, and only the master app holds the MyID and TAF parts. This lesson follows the first call of that contract: the registration.

## Story (one weekend, two apps)
1. **Sunday, laptop, marketplace web.** Aziz types his number. The app sends the app, the number, the language and a device description; the request carries the network address. The platform checks: a valid Uzbek mobile number, an active app, no limit reached (lesson 11). A **registration record** opens in state Started; every message follows the chosen language.
2. **The code.** A random **one-time code**, never made from the number, the time or the device, kept only as a digest. The app gets the lifetime and the resends that remain, never the code.
3. **The channel.** Side apps (phone or web) have no TAF part, and the TAF check works only when TAF sends the code to the phone that enters it, so the bank SMS service sends it.
4. **Verify.** Same code → Number verified, code void. No verdict on the web; the audit source is "web". Nothing (consent, device record, session) exists for an unverified number (E-REG-06).
5. **New number → password two times.** Two different entries are refused. Rules: length between the configured minimum and maximum, not on the common and breached list, no phone number inside, no forced symbols. Storage → lesson 13.
6. **Level 1.** Customer at level 1, marketplace app account, browser device record (never trusted), a session. Record: Onboarded. The app needs level 1 only, so Aziz uses it at once.
7. **Monday, phone, mobile bank.** Same number. Master app → code through TAF; if TAF does not answer, the bank SMS service (lesson 12). The number belongs to an active customer → not a registration: the same password, then the login from a new device, and a mobile-bank app account. The platform never shows the existing customer.
8. **Edges.** A person who does not know the password resets it (lesson 30), never a second account. A blocked customer's number: "Please contact the bank". A record that does not reach level 1 in the configured time expires; data deleted, audit events kept.

## How it works (the diagram)
Laptop (marketplace web) → heeyID → registration record chip (Started → Code sent → Number verified → Onboarded); SMS service of the bank sends the code to Aziz's phone. Then the four new things fan out. Monday: mobile bank → heeyID → TAF → Aziz's phone; the record chip shows "not a registration" and the password box.

## Ending
Recap: one record, one random code kept as a digest, two channels, then a new customer or a login. Open question: a code goes to any number anyone types. What stops a stranger from asking for codes all night, or guessing one? Next: codes and limits.

## Terms (on screen)
registration record, one-time code, (digest is reused from lesson 8). No new glossary rows.

## Do not
- No bank names, no prices, no policy numbers (code length, lifetime, limits, expiry).
- No TAF colours here (lesson 12), no Argon2id (lesson 13), no reset details (lesson 30).

## Sources
SRS v3.7 SRS-REG-01…10, SRS-APP-02, SRS-APP-03, SRS-AF-01, SRS-AF-02, SRS-AF-05 · SAD §4.1, §4.15, §5.1 (registration) · BRD FR-20a, FR-86.
