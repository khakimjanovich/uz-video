# h-20-trusted-device: brief

**Lesson 20 of heeyID, Module 5 (Devices and login).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** list what a device record keeps, say when a device is Known, Trusted or Revoked, name the three questions of the binding check, and say why the app PIN is never proof to the server.

## The question that opens the lesson
"A phone is glass, a chip and a SIM card. How does the platform know that this phone is Aziz's?"

## Bridge
In lesson 19, the platform linked Aziz to the bank's customer records. This lesson looks at the thing in his hand: the device record, its states, the binding check at each request, and the app PIN.

## Story
1. **Registration day.** Aziz registers in the mobile bank (lesson 10). The platform makes a device record with a random identifier. The app keeps the identifier and sends it with each request. Aziz is at level 1, so the device is **Known**, not Trusted.
2. **The record.** Random identifier (never made from hardware identifiers); customer reference; bound personal identification number, in a form that cannot be reversed; platform, model, OS version, app version; time recorded; time last seen; state. One identifier belongs to one customer for its full life.
3. **MyID day.** Aziz passes MyID on this phone and the status is Confirmed (lessons 15–18). The device becomes **Trusted**.
4. **The app PIN.** After the first login on a device, the app asks for an app PIN before it is usable. The length is a policy; the app refuses simple sequences and repeated digits. The platform records only that a PIN was set, the time and the device. Only the phone checks the PIN. The platform never accepts a PIN as proof. It is not the password.
5. **The copy.** A stranger copies the app's tokens out of Aziz's phone onto his own phone. His app sends its own device identifier.
6. **The binding check.** At each request the gateway asks: is the device Trusted or Known? Does it belong to the customer of this request? Is its bound personal identification number the same as the customer's? One "no": the access grant ends, the device becomes **Revoked** ("binding mismatch"), a security event is written, and the app must start a login.
7. **Revoked is final.** A revoked device never becomes trusted again. A new login on the same phone makes a new record. An operator can revoke one device or all devices, with a reason; the grant ends at the next request.

## How it works (the diagram)
- Aziz → his phone (Known badge) → heeyID. A record card grows field by field (badges).
- MyID check: phone badge changes to Trusted.
- PIN: the PIN stays on the phone; a packet "PIN set · time" goes to heeyID, never the PIN.
- Stranger + his own phone with copied tokens → heeyID: three checks; the third ✕; phone crossed, "Revoked".
- Map: the Devices module lives in the customer gateway; dot on the gateway and Postgres.

## Ending
Recap: a random identifier, three states, one check at each request, and a PIN that never leaves the phone. Open question: the phone is trusted, but what does the app actually show the gateway at each request? Next: access grants.

## Terms (on screen)
device record, Known / Trusted / Revoked, binding check, app PIN. New terms: device record, binding check, Revoked. Glossary: none new (`PIN`, `MyID` exist).

## Do not
- No numbers from policies (PIN length, limits). No device attestation (next phase).
- No code on screen. No bank names.

## Sources
SRS v3.7 SRS-DEV-01…03, SRS-DEV-06, NFR-S-13 · SAD §3.3 (modules 8, request guard), §4.5, C-11.
