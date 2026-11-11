# h-09-api-contract: brief

**Lesson 9 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say what heeyID gives an app team (REST API, OpenAPI contract, integration guide, no SDK), describe the one error shape, and list what an app may keep and never keeps.

## The question that opens the lesson
"There is no heeyID SDK. How does an app team build against heeyID?"

## Bridge
In lesson 8, every key stayed in the bank's Vault, none on a phone. This lesson: what reaches the apps instead.

## Story
1. **Jasur's task.** An iOS developer of the mobile bank team looks for the heeyID SDK; there is none.
2. **Why no SDK.** The bank's teams build the apps; an SDK would add work before the first release and a second release train. Narrator position: no SDK is the honest choice; the contract is the product.
3. **Three things.** The REST API, the OpenAPI contract, the integration guide.
4. **The contract.** Every call (path, request, answer, errors); one call per step; correlation identifier on each request, device identifier after registration; one error shape (code, reason key, message, retry allowed and after how long); codes = SRS error outcomes one to one.
5. **The SDKs that exist.** The bank adds the MyID and TAF SDKs to the master app only; MyID native in-app check, backend opens the session, no web view or web frame; the credential never on the phone. The bank's push SDK in each app.
6. **May keep.** Device identifier (Keychain/Keystore storage); refresh token (Keychain, or Android Keystore-protected storage); access token and identity summary (memory only); approval request (memory and screen); push token; app PIN as a slow, salted hash; language.
7. **Never keeps.** Password, MyID credential, result code after its one upload, personal identification number, document data, addresses, images, a one-time code after entry, a limit the gateway uses, biometric data.
8. **Limits.** The server applies every limit; a limit in the app is only a convenience.
9. **The honest edge.** heeyID cannot enforce these rules inside an app; the guide and the API tests keep apps correct.
10. **Jasur on Wednesday.** Contract calls, device id in the Keychain, access token in memory, errors by code; MyID and TAF SDKs, nothing from heeyID.

## How it works (the diagram)
- App team → heeyID SDK (crossed) → contract + guide → platform.
- An error card: badges "code · reason key · message · retry".
- Master app box with MyID and TAF beside it ("SDK"), side app box without them.
- Two columns: keychain/memory boxes with "may keep" badges one by one; a "never kept" box with crossed items one by one.

## Ending
Recap: no SDK; API, contract, guide; MyID and TAF SDKs only in the master app; keep and never-keep lists; the server applies every limit. Open question: Aziz types his phone number for the first time; what happens between the number and level 1? Next: registration.

## Terms (on screen)
API contract, OpenAPI, integration guide (new); SDK. Glossary additions: `SDK` → "S D K", `SDKs` → "S D Ks", `OpenAPI` → "open A P I".

## Do not
- No paths, headers or field names on screen as code. No timings. No bank names.

## Sources
SAD v3.8 A7, C-7, ADR-14, ADR-24, ADR-25, §3.2 (Bank apps row), §7.3, §10.2 (common rules), §10.7 · SRS v3.7 §1.3, §5.8, NFR-S-05, NFR-S-06, NFR-V-03.
