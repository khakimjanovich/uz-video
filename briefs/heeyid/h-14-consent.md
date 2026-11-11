# h-14-consent: brief

**Lesson 14 of heeyID, Module 4 (Proofing).** 4–5 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** name the four fixed parts of the consent screen, say what a refusal does (nothing at MyID, no counted attempt), say what the acceptance record holds, and say why an answer to an old text version is refused.

## The question that opens the lesson
"Why does a screen come first, and not the face check?"

## Bridge
"In lesson 13, Aziz's password became a digest … Everything so far proves his phone, not his person." Then: "This lesson adds the first step towards level 2: the consent gate."

## Story
1. **Sunday evening.** Aziz taps a credit offer in the mobile bank. The credit needs level 2. A screen stops him before any camera opens.
2. **Four fixed parts.** The data that is read from state records; the provider (MyID); the purpose (identify the customer for this bank); who can read the data later (the bank's channels and operators). The bank writes the words, in the language of the journey, and cannot remove a part. The screen shows only after the phone number is verified.
3. **Refuse.** No session at MyID, no attempt counted, level 1 stays, one "refused" event. Narrator: saying no costs the customer nothing.
4. **Accept.** Nothing pre-selected, nothing copied from the first answer. The acceptance record (text ids and versions, language, time, device, customer) is written before any other step. One acceptance permits one session; the record points to that session.
5. **Every call.** The gate stands before step-up, new device, dormant account and refresh.
6. **Versions.** Consent and terms texts in four languages; each version has a publication date, a proposer and a different approver. The product ships a default text; compliance changes it; all versions are kept.
7. **The race.** Compliance publishes a new version while Aziz reads. His Accept on the old text is refused and the new text is shown, because the record must name the exact version he saw.

## How it works (diagram and map)
- Diagram: Aziz → mobile bank → consent screen → MyID. Badges walk the four parts. Refuse: MyID crossed, "no session · no attempt". Accept: the acceptance record appears and one packet "open session" goes to MyID. Versions: bank staff (maker + checker) → consent screen; the race with "v1" / "v2" packets and a refused answer.
- Map: the consent step in the customer gateway, the records in Postgres, the mobile bank only shows and sends.

## Ending
Recap, then the open question: who opens the session at MyID, the mobile bank or the platform, and what happens when the marketplace asks? Next: proofing with MyID.

## Terms (on screen)
consent gate, acceptance record, text version. Glossary additions: none (MyID, TAF exist).

## Do not
- No bank names, no prices, no policy numbers.
- No consent ledger, no partner consent, no revocation (later phases).
- No code on screen.

## Sources
SRS v3.7 §2 (Consent gate), SRS-CON-01…03, SRS-REG-09 · SAD v3.8 §4.2 (flow 2), §5.1 consent_record (one session for each acceptance), C-12, ADR-28 · BRD v2.3 FR-04.
