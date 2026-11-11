# h-19-linking: brief

**Lesson 19 of heeyID, Module 4 (Proofing).** 4–5 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say what goes to the bank's customer lookup (the personal identification number only) and what comes back (the bank customer identifier only), give the link state for each lookup answer, and say why nothing links by phone number.

## The question that opens the lesson
"The bank has known Aziz for six years. heeyID has known him for one week. Are they talking about the same man?"

## Bridge
"In lesson 18, the phone check gave Aziz the status Confirmed …" Then: "This lesson takes the last step of the step-up: linking."

## Story
1. **Two records.** The heeyID person (identity) and the bank's customer record (money). One thin thread.
2. **One value out.** On Confirmed, only the personal identification number goes to the lookup.
3. **Five answers.** Found and active → Linked (Aziz). Not found → Not linked + an event so the bank can start its own account opening. Closed or blocked → Refused + case. More than one → Refused + case. No answer in the configured timeout → Pending.
4. **Reference, never a copy.** Only the bank customer identifier is kept; accounts, products, balances are deleted before any other step.
5. **Comparison note.** The bank's spelling of Aziz's family name differs: a note on the customer and the link event; no stop, no state change.
6. **Never by phone.** No operation, no panel action, no operator links by phone. Operators give old numbers to new persons; a link by phone would one day attach a stranger to Aziz's deposit. Narrator: the rule a tired developer most wants to break.
7. **Pending.** The bank's system is in maintenance. Retries at the configured interval during the configured period; then Refused "lookup not available" + case. Aziz keeps his access grant; the mobile bank reads the link state from the identity summary.
8. **Operator link.** After the bank checks it, an operator enters the identifier: Linked, "set by operator", with operator, time and reason.

## How it works (diagram and map)
- Diagram: Aziz's person record (heeyID) and customer records (bank); one packet "personal identification number" out, one "bank customer identifier" back. Five answers as a badge sequence. A crossed "phone number" packet; a stranger with Aziz's old number. Pending: packet stops mid-edge, retries. Operator → records.
- Map: customer gateway, adapters, customer lookup; workers for the retries; admin gateway for the operator link.

## Ending
Recap; Module 4 ends. Open question: what makes a phone trusted, and what does the app keep on it? Next: the trusted device.

## Terms (on screen)
customer lookup, bank customer identifier, link state. Glossary additions: none.

## Do not
- No bank names, no policy numbers. No account opening flow (it is the bank's process). No code on screen.

## Sources
SRS v3.7 §2 (Linking, Bank customer identifier), SRS-LNK-01…07, SRS-DEV-08 · SAD v3.8 C-9, ADR-16, §4.4 (flow 4), §5.1 person.link_state · BRD v2.3 FR-14, FR-15.
