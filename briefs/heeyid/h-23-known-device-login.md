# h-23-known-device-login: brief

**Lesson 23 of heeyID, Module 5 (Devices and login).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** walk through a login on a known device in order (password, code through TAF, verdict, face confirmation, new grant), and say why the password comes before the code.

## The question that opens the lesson
"Aziz logged out last night. This morning, on the same phone, what must he show to get back in, and in which order?"

## Bridge
In lesson 22, Aziz reached level 2 and his phone became Trusted. This lesson starts a new session on that same phone: the password first, then the one-time code, then the verdict.

## Story
1. **When a login is needed.** After a logout, or when a renewal fails. A valid session just continues (renewal, no password).
2. **The password first.** Number, password, device identifier. The gateway compares the password with the kept digest, in constant time. A number with no customer gets a check against a dummy digest: the same answer and the same time as a wrong password.
3. **Wrong password.** The count goes up; audit and antifraud events. At the limit (policy): password login locked for the lock period, notification "password login locked". A lock is not a block: no grant ends.
4. **Why first.** The gateway sends a code only after a correct password. A person who knows only the number cannot make the bank send codes.
5. **The code through TAF.** TAF sends the code by SMS to the verified number, with the message type for a login and the device model. TAF down: the bank SMS service sends it, and the login is marked not scored.
6. **The verdict.** Green: the login continues (a master-app session gets rank 2, lesson 29). Red: refused. Yellow, for a customer who was ever at level 2: consent and a MyID re-check first. If device and SIM do not match, the app advises the mobile network, not Wi-Fi.
7. **The face of the phone.** For a level-2 customer after Green: the phone's own face biometric (not MyID, gives no level); then the platform sends the face confirmation to TAF. Biometric fails: the login stops. TAF fails: the login continues; it is sent again at the next login.
8. **The grant.** A new access grant. Level 2 only on a trusted device of a level-2 customer. No MyID call on a trusted device, except for Yellow. Audit event and antifraud event "login".

## How it works (the diagram)
- Trusted phone → heeyID: packet "number · password · device"; badge "password ✓".
- Stranger (number only) → heeyID: packet stops red, "same answer".
- heeyID → TAF → phone: packet "SMS code"; TAF badge "Green".
- Phone badge "face ✓" (own biometric); heeyID → TAF packet "face confirmation".
- heeyID → Keycloak → phone: "new grant · level 2". MyID crossed.
- Map: customer gateway, Postgres (digest), Valkey (code), TAF, Keycloak.

## Ending
Recap: the password opens the door, the code proves the SIM, TAF scores it, and the grant follows. Open question: what if the phone is not known at all, a brand-new phone with Aziz's number and password? Next: login from a new device.

## Terms (on screen)
known-device login, wrong-password lock, face confirmation. Glossary: none new.

## Do not
- No numbers (code length, lock period, wrong entries). No rank details (lesson 29). No password reset (lesson 30).
- No code on screen. No bank names.

## Sources
SRS v3.7 SRS-DEV-09, SRS-DEV-16, SRS-AF-01, SRS-AF-03…06 · SAD v3.8 §4.9, §4.13, §4.14, ADR-29.
