# h-21-access-grants: brief

**Lesson 21 of heeyID, Module 5 (Devices and login).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say who decides and who issues an access grant, what the token carries (its app, the session level), how a renewal works and why it needs no password, and when a grant ends.

## The question that opens the lesson
"Aziz opens the mobile bank at breakfast, at lunch and at night, and he never types his password. What lets him in?"

## Bridge
In lesson 20, the phone got a record and a state, and the gateway checks the binding at each request. This lesson shows what the app holds: the access grant, its tokens, its level and its renewal.

## Story
1. **One grant per app and device.** The access grant is a session: one app account, one device, one customer. It starts at level 1 (registration) and after each login.
2. **Who decides, who issues.** The customer gateway decides: password, code, verdict, binding. Then it gives Keycloak a short-lived, one-use signed note with the device identifier, the customer reference and the session level. Keycloak only issues: an access token and a refresh token. All rules of the bank stay in the gateway.
3. **What the token says.** Its own app (lesson 5) and the session level, 1 or 2. Level 2 only when the customer is at level 2 and the device is Trusted. When the level changes (MyID passes), the gateway issues a new token at once.
4. **Breakfast to night.** The access token is short. When it runs out, the app renews with the refresh token: same device, same app only. The renewal first passes the binding check and the revocation list. A renewal needs no password. Each renewal gives a new refresh token, and an old one used again is detected.
5. **Inactivity.** After the inactivity limit (policy), the app asks for the app PIN. The grant continues.
6. **The old tablet.** Aziz reports an old tablet lost; an operator revokes it. The tablet's next request is refused, and its renewal too. The grant ends on revocation, block, binding mismatch, replacement, number removal, a password reset or change on a different device, or expiry.
7. **The end.** A request with an ended grant is refused. The app tries a renewal. When the renewal fails too, the customer must log in.

## How it works (the diagram)
- Phone → heeyID (gateway) → Keycloak; packet "signed note" gateway → Keycloak, packet "tokens" back to the phone.
- Badges on the phone: "mobile bank only", "level 1" → "level 2" after MyID.
- Renewal loop: packet "renew" phone → heeyID → Keycloak; badge "no password".
- Old tablet crossed after revocation; packet stops red.
- Map: dot on the customer gateway, Keycloak, Valkey (revocation list).

## Ending
Recap: the gateway decides, Keycloak issues, the token names its app and its level, renewal keeps the session alive without a password, and one revocation stops it at the next request. Open question: Aziz's token says level 1 in the marketplace, but the page he wants needs level 2. What does an app do with a level that is too low? Next: step-up.

## Terms (on screen)
access grant, refresh token (renewal), revocation list. New terms: access grant, renewal, revocation list. Glossary: none new.

## Do not
- No token lifetimes in numbers (access-token time, grant lifetime, inactivity limit). No probation or rank details (lesson 29).
- No code on screen. No bank names.

## Sources
SAD v3.8 C-3, C-6, ADR-11, ADR-13, ADR-27, §4.5, §4.7, §10.2 (/v1/grants/renew) · SRS v3.7 SRS-DEV-04, SRS-DEV-06, SRS-DEV-08, SRS-DEV-16 (renewal needs no password).
