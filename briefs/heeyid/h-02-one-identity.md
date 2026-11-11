# h-02-one-identity: brief

**Lesson 2 of heeyID, Module 1 (Orientation).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw the identity model (person → phone number and password → one app account in each app → many sessions), say which app is the master app and why, and say why a second bank gets a second installation.

## The question that opens the lesson
"Aziz uses three apps of the bank on two devices. How many identities does he have?" Answer at the end: one.

## Story (one person, many doors)
1. **Three apps, two devices.** Aziz has the mobile bank and the marketplace app on his phone. At work, he opens the marketplace web profile in a browser on his laptop.
2. **The naive model (v1).** Each app keeps its own customer with its own password. Aziz now has three passwords and three levels. He proves who he is with MyID in the mobile bank, but the marketplace still says level 1. A bank operator wants to end only his marketplace sessions, and cannot.
3. **The break.** Two identities for one person: two passwords to steal, two levels that disagree, and no way to end the sessions of one app.
4. **The fix (v2).** One **person** record: the personal identification number, the level, the verified identity. One **phone number** is the login for all apps, with **one password**. The apps have no passwords of their own. A password change applies in all apps.
5. **App accounts.** One **app account** for each app, made at the first registration or login in that app. Aziz has three: the mobile bank, the marketplace and (later) the credit conveyor.
6. **Sessions.** Each app account has many **sessions**, one for each phone or browser. Aziz has one session in the mobile bank and two in the marketplace (phone and laptop). Each session records its app and its device. Its tokens are for its own app only, and each app's backend accepts only its own tokens (details in lesson 5).
7. **The operator.** A bank operator can end one session, all sessions of one app, or all sessions of the person. The level belongs to the person, so it is the same in all apps.
8. **The checks of the number.** Each check of the phone number is kept with the provider, the app and the time: an SMS code from the bank's SMS service, a TAF check, or MyID.
9. **Master app and side apps.** The mobile bank is the **master app**: it gives remote access to money movement, so only it runs MyID, TAF and app self-protection. All other apps are **side apps** (the marketplace app and web profile, the ordering, delivery and service apps). In a side app, the customer enters the password, then approves in the master app, or enters an SMS code from the bank's SMS service. A customer can use side apps with no master-app account.
10. **One installation, one bank.** Everything above lives in one installation of one bank: one Keycloak realm, each app one client. No tenant column. A second bank gets its own installation, so a read across banks is not possible.

## How it works (the diagram, built step by step)
- **v1:** three app boxes, each with its own small "customer + password" box. Three level chips that disagree (one green "level 2", two grey "level 1"). Then the break: the level chips flash red, a crossed key on two password boxes.
- **v2:** one **person** box in the centre (PINFL, level). Under it, one **phone number + password** box. Then three **app account** boxes fan out (mobile bank marked "master app", marketplace, credit conveyor). Under each, session chips with a device icon: 1 under the mobile bank, 2 under the marketplace (phone, laptop).
- Small **check log** beside the phone number: "SMS · marketplace · time", "TAF · mobile bank · time", "MyID · mobile bank · time".
- **Operator** box: three scissors cuts in turn: one session chip, all marketplace chips, all chips.
- Last: a dashed frame around everything, labelled "one installation = one bank". A second, empty frame beside it: "second bank = second installation".

## Ending
Recap: one person, one phone number, one password. One account in each app, one session on each device. Only the master app proves who he is. "So how many identities does Aziz have? One."
Open question for the next lesson: Aziz is at level 2, but his new laptop session is at level 1. What does "level" really mean? Next: the words of identity.

## Terms (on screen)
person, app account, session (access grant), master app, side app, installation, realm, client. Glossary additions before the script: none new (`MyID`, `TAF`, `SMS` exist).

## Do not
- No bank names. No prices.
- No partner apps (later phase). No code on screen.
- No probation period, no session rank, no account-link question, no address sharing (later lessons 26–32).
- No numbers from policies.

## Sources
BRD v2.3 §7.1.6 (FR-84, FR-85, FR-91) · SRS v3.7 §4.14 (SRS-APP-01…04), SRS-TEN-01…03, SRS-DEV-04 · SAD v3.8 A6, C-4, ADR-32, ADR-33.
