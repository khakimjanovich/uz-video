# h-12-taf-verdict: brief

**Lesson 12 of heeyID, Module 3 (Registration, level 1).** 5–7 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say what TAF checks and who decides, map Green, Yellow and Red to the platform's actions, and name the four cases where TAF gives no verdict or no code: the waiting time, the outage (not scored), the trusted-bank stop, and the face confirmation path.

## The question that opens the lesson
"The code was right. But was it typed on the phone that holds the SIM card?"

## Bridge
In lesson 11, the counters guard the code. This lesson adds the check that the counters cannot do: TAF, in the master app only, looks at where the code arrived.

## Story (one Monday in a café, then later days)
1. **The café.** Aziz logs in to the mobile bank on the café Wi-Fi and types a correct code.
2. **What TAF is.** A state service; its **verdict** is a recommendation, the platform decides with the policy. Only the master app holds its part; the app starts it, sends its id with each code request, gives it each typed code, and tells it at logout. If the app skips a step, the verdict is negative.
3. **Two verdicts.** The basic verdict: seven yes/no values (account active, code usable, SMS sent, status valid, verified, device and SIM match, no clone). The risk verdict: Green, Yellow or Red, with a main reason. The platform polls until the configured waiting time; not ready → the basic verdict decides: all true → Green, one false → Red.
4. **Café result.** Risk verdict not ready; device and SIM do not match on Wi-Fi → Red → "We cannot complete this now" (E-AF-01). The app advises the mobile network. The refusal blocks nothing and changes no counter. Mobile data → Green → the login continues, and the master-app session gets the stronger rank (lesson 29).
5. **Yellow.** For a customer who was ever at level 2: consent and a MyID re-check on this device; pass → trusted device, stronger rank; fail → E-AF-01. For anyone else, including every new registration: refused with the reason text in the journey language (E-AF-02).
6. **Face confirmation.** A level-2 customer after Green: the phone's own face biometric (not MyID, no level). On success, the platform, not the app, sends the personal identification number and the number to TAF. If TAF fails, the login continues and the confirmation waits for the next login. Level 1: none.
7. **TAF down.** Health check, timeout or server error → the bank SMS service sends the code; the attempt is **not scored**: no verdict, no face confirmation, no ownership check; audit, antifraud event, alert to operations; the session keeps the weaker rank until a later Green.
8. **The trusted-bank stop.** If the customer chose a different trusted bank on the state services portal, TAF refuses; the platform stops and sends no code by any other channel (E-AF-03).
9. **What TAF gets.** Only the number, the request id, the code, the message type, the device model, the language; the personal identification number only for the face confirmation and the ownership check (lesson 18). Never names, documents, addresses or images.

## How it works (the diagram)
Aziz's phone (master app) → heeyID → TAF; verdict chip with three colours; the basic list of seven; then branches: Green → continue, Yellow → MyID, Red → stop. Then TAF crossed → SMS service, "not scored". Then TAF → stop sign "trusted bank", SMS crossed.

## Ending
Recap: TAF sends the code and recommends; the platform decides; four exits. Open question: every login starts with the password, before any code. How does the platform keep a password that it must check but can never read? Next: the password.

## Terms (on screen)
verdict, not scored, face confirmation. Glossary: none new (`TAF`, `MyID`, `SMS`, `SIM` read fine).

## Do not
- No policy numbers (waiting time, polling interval, health check, timeout, TAF lock).
- No bank names; say "the state services portal", not its address.
- Session rank only by name (lesson 29); phone ownership only by name (lesson 18).

## Sources
SAD v3.8 C-16, ADR-30, §4.14 (flow 14) · SRS v3.7 SRS-AF-01…08, SRS-APP-10, error table (E-AF-01…04) · BRD FR-20a…FR-20e.
