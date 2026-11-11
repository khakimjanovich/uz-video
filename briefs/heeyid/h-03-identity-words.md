# h-03-identity-words: brief

**Lesson 3 of heeyID, Module 1 (Orientation).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say which of three questions a check answers (authentication, identity proofing, authorisation), say the three levels, and explain why a person at level 2 can have a session at level 1.

## The question that opens the lesson
"The password is right. Why does the marketplace still not show Aziz his order?" Answer at the end: a right password authenticates the account; it does not prove the person, and it does not decide what the session may do.

## Bridge
In lesson 2, Aziz became one person with one phone number, one password and one session on each device. This lesson gives the three words for what happens at a login, and says what a level really is.

## Story (one evening, one laptop)
1. **The login.** Aziz logs in to the marketplace web profile on his laptop: phone number, password. Then the page waits: an approval request appears in the mobile bank on his phone.
2. **Authentication.** Question: is this the account owner? Something he knows (the password) and something he has (the phone that approves, or that gets the SMS code). It says nothing about the state records: a stranger with his own phone and password authenticates perfectly every day.
3. **Identity proofing.** Question: is this the real person in the state records? Only MyID, only in the master app: face and document against the state records. Rare and slow; authentication is at every login. Narrator position: the most common mistake is to treat a strong login as proof of a person.
4. **Authorisation.** Question: what may this session do now? The app must see level 2 before it shows personal data (orders, addresses, cards).
5. **Levels.** Level 0: nothing verified. Level 1: a one-time code verified the phone number. Level 2: MyID proofed the person and the phone number is confirmed. Only the check for a level gives that level; no operation gives level 2 without MyID.
6. **Person level vs session level.** Aziz the person is at level 2. A session is at level 2 only on a trusted device of a level-2 person. A browser is never a trusted device: the laptop session gets level 2 only when Aziz approves it in the master app on his trusted phone.
7. **Approve.** The request shows the browser, the network address and the time, with "Approve" and "This was not me". He approves: the laptop session gets level 2, the order opens.
8. **Contrast.** With no session in the mobile bank, the bank SMS service sends a code instead: Aziz is in, but the laptop session stays at level 1, and the order stays closed. The step-up is never refused; it names the level and the check.
9. **Standards.** OAuth 2.1 is the open standard for authorisation (how an app gets a token and what the token allows). OpenID Connect adds authentication on top (who logged in, and how). heeyID has no own token format: Keycloak issues standard tokens, and each token carries the level of its session.

## How it works (the diagram, built step by step)
- Laptop (marketplace web) → heeyID → Aziz's phone (mobile bank, trusted). Packets: password, approval request, Approve.
- Three stamps, one per word, each with its question: "same owner?", "real person?", "may do what?".
- A level ladder: 0, 1, 2 with the check beside each (nothing, code, MyID + phone).
- Two badges side by side: "Aziz: level 2" (person) and "laptop: level 1" (session); then the session badge turns to "level 2" after Approve.
- Contrast: the SMS path, the laptop with "level 1", the order box crossed.
- Last: a token box with "app" and "level" and the two standard names.

## Ending
Recap: three questions, three words; a level for the person and a level for each session. "So why did the right password not show the order? Because a password answers only the first question." Open question: these checks touch passports and phone numbers; where does heeyID run, and whom may it call? Next: the perimeter.

## Terms (on screen)
authentication, identity proofing, authorisation (new); assurance level, trusted device, step-up (known). Glossary additions: `OAuth` → "oh auth", `OIDC` → "O I D C".

## Do not
- No bank names, no prices, no policy numbers (the approval waiting time is "the configured time").
- No token claim names (acr, aud, azp come in lesson 5). No code on screen.

## Sources
SRS v3.7 §2 (Assurance level, Login, Access grant, Device, Trusted device, Step-up, App PIN), SRS-REG-09, SRS-APP-04, SRS-DEV-08, AC-CON-7, AC-DEV-3 · SAD v3.8 C-2, C-3, ADR-10, ADR-27, §4.15.
