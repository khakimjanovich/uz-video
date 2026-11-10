# h-01-map: brief

**Lesson 1 of heeyID, Module 1 (Orientation).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw the heeyID map from memory (who calls whom), and say why the customer meets MyID once and not at every login.

## The question that opens the lesson
"How does a bank know it is really Aziz, in every app, without a face check every time he logs in?"

## Story (one journey across the map)
1. **Level 1.** Aziz installs the bank's mobile app. He enters his phone number and gets an SMS code. The code comes through TAF (Telecom AntiFraud, the state mobile-operator antifraud service), which checks that it arrived on the same phone and SIM card and gives a verdict: green. He sets a password that he types two times. Now he has an account at level 1: the bank knows his phone, not his person.
2. **The need.** In the bank's marketplace he wants to buy a phone on credit. The credit conveyor needs level 2: it must know the real person.
3. **Step-up.** The app asks for his consent. Then MyID opens inside the app: his face and his passport are checked against the state records. The platform checks his phone number against MyID's list. Now he is at level 2.
4. **Link.** The platform finds Aziz in the bank's own customer records by his personal identification number.
5. **Bind.** His phone becomes a trusted device. Keycloak, behind the gateway, gives the app an access grant with level 2.
6. **Reuse.** Next morning, Aziz opens the marketplace and the mobile bank. No face check: the session continues on his trusted phone. One proofing serves all the bank's apps.
7. **Worry, then relief.** A stranger has the operator move Aziz's number to a new SIM card (SIM swap), puts it in a new phone and logs in with a guessed password. The SMS code arrives on the new phone. Three guards: the TAF verdict is not green (red refuses; yellow asks a level-2 customer for MyID again, and the stranger's face fails), and Aziz's trusted phone shows the login request with "Approve" and "This was not me". The push message carries no code.

## How it works (the map, built step by step)
Reveal the nodes in the order of the story, never all at once:
- Aziz → the bank's apps (mobile bank, marketplace, credit conveyor), each calling the heeyID API; only the mobile bank holds the **MyID** and **TAF SDKs** (no heeyID SDK in MVP 1).
- The **edge** → the **customer gateway** (all rules of the bank) → **Keycloak** (tokens only, one realm for each bank).
- Outside the gateway, only through adapters: **TAF** (sends the codes, gives the verdict), the **SMS service** (only when TAF is down), **MyID**, the **customer lookup**, the **push service**.
- The four stores behind the gateway: **Postgres** (the record), **Valkey** (counters, cool-downs), **Kafka** (the outbox for events), **Vault** (keys).
- The bank's staff → the **administrator panel** → the **admin gateway** (same rules, no second copy).
- Last: one dashed frame around everything: **the bank's perimeter**. TAF answers through its agent in the bank's network. Only MyID and the push service are outside it, and the push service gets no personal data.

## Ending
Recap: Aziz proves who he is one time, and his phone carries that proof to every app. "So how many times does Aziz meet MyID? Once, and again only on new risk." Next: the words of identity (authentication, proofing, authorisation, assurance level).

## Terms (on screen)
assurance level, identity proofing, step-up, trusted device, access grant, master app, side app, realm, adapter, outbox. Glossary additions before the script: `MyID` → "my I D", `FCM` → "F C M", `OIDC` → "O I D C", `PKCE` → "pixie", `DPoP` → "D pop", `Valkey` → "val key", `TAF` → "T A F".

## Do not
- No bank names. No prices (5,000 / 15,000 UZS) in this lesson.
- No later phases (partners, antifraud decisions, consent ledger).
- No numbers from policies: say "the configured time", "the configured limit".

## Sources
BRD v2.3 §1, §2.1–2.2, §7.1.5–7.1.6 (FR-77a, FR-84…FR-94) · SAD v3.8 §1, §3.1–3.3, §4.10, §4.14–4.18, §8, §10.1, A6 · SRS v3.7 §1.2, REG, AF, CON, PRF, LNK, DEV, APP.
