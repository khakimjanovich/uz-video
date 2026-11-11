# h-05-apps-and-tokens: brief

**Lesson 5 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say what a realm and a client are, read the two names in a token that name its app (aud, azp), and say where heeyID checks them (the backend of each app, the request guard, every query).

## The question that opens the lesson
"A debug log leaks Aziz's marketplace token. The token is real, signed and fresh. Why does the mobile bank refuse it?"

## Bridge
In lesson 4, one installation inside the perimeter, with one Keycloak for all apps. This lesson: how one Keycloak keeps the apps apart.

## Story
1. **The leak.** A forgotten debug log writes marketplace tokens; someone sends Aziz's token to the mobile bank backend to move money.
2. **Realm and clients.** One realm for the installation (one bank, one realm). Each app is one client: mobile bank, marketplace app, marketplace web profile, credit service.
3. **Two names in the token.** aud (audience: who the token is for) and azp (authorised party: which app asked). Both name the app.
4. **The rule.** Each app backend accepts only its own tokens. Mobile bank backend sees "marketplace", refuses: E-APP-02 "session of a different app, log in again".
5. **heeyID's door.** The request guard checks aud and azp before any module, then the device binding. Never a header: anyone can write a header. Narrator position: a header says what a caller wants to be; a signed token says what it is. With no token (registration or login start), the app comes from the app identifier of the build, checked against the app catalogue.
6. **Deeper than the door.** Sessions and app accounts carry the app; the repository layer adds the app filter to each query; cache keys and events carry the app. Cross-app data only through a request the customer answers (address sharing).
7. **The leak, measured.** The marketplace, for Aziz, for a short time: short access token (configured), refresh token rotation with reuse detection, session bound to the device.
8. **Proof each release.** The acceptance tests send a marketplace token to the mobile bank backend and expect the error; a release that fails stops.
9. **New apps.** A new app = one more client and one more app row, with its own required level.

## How it works (the diagram)
- Leak: marketplace → log → stranger → mobile bank backend; packet stops red.
- Keycloak realm frame with client boxes; a token box with badges "aud: marketplace", "azp: marketplace".
- Request guard between edge and platform; a "header: mobile bank" packet crossed.
- Query: platform → stores with a badge "WHERE app = token app".
- Release gate: tests → mobile bank backend, "E-APP-02 ✓".

## Ending
Recap: one realm, one client per app, two names in each token, checks at each backend, at the door and in each query. Open question: who sets the token lifetime, the required levels and the limits, and where do they live? Next: configuration.

## Terms (on screen)
realm, client (from lesson 2), audience (aud), authorised party (azp). Glossary additions: `aud` → "A U D", `azp` → "A Z P".

## Do not
- No token lifetimes or other numbers. No code on screen. No partner apps.

## Sources
SAD v3.8 A6, C-4, ADR-13, ADR-23, ADR-32, §3.2 (Keycloak), §3.3 (request guard), §6 (app separation, layer by layer), §7.1 TB-2/TB-3 · SRS v3.7 SRS-TEN-02, SRS-TEN-03, SRS-DEV-04, SRS-APP-02, NFR-S-12, NFR-S-13, E-APP-02, AC-TEN-2.
