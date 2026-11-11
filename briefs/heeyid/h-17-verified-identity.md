# h-17-verified-identity: brief

**Lesson 17 of heeyID, Module 4 (Proofing).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** list what is in the protected class, explain the key for each record wrapped by the installation key in the bank's Vault, explain the blind index, name the release list and the never-release list, and say why every release is an audit event.

## The question that opens the lesson
A copy of the database leaves the bank on a stolen disk: "What can he read?" Answer in the middle: only ciphertext.

## Bridge
"In lesson 16, the platform kept Aziz's verified identity …" Then: "This lesson shows how that record is protected."

## Story
1. **What is protected.** The verified identity in all versions, the MyID phone number, the reusable identifier with its expiry, images only when the bank turns image storage on. Nothing else. Phone numbers, devices and network addresses are personal data under other rules.
2. **Keys.** A data key for each record; stored wrapped by the installation key, which never leaves the bank's Vault; unwrapped for one request only; no decrypted copy longer than the request; never in logs. The thief reads ciphertext.
3. **Blind index.** A keyed digest of the personal identification number with the index key; fast lookup; one active customer for each number; useless without the key.
4. **One door.** Only the identity module reads and writes the table; others get masked values unless the purpose is on the release list: keeping a result, the confirmation screen on the session's device, the phone check, the customer lookup (number only), a case or phone review (masked), a compliance export for a data-subject request, the deletion job, an approved address share.
5. **Never released to:** the apps (only the identity summary: level and display name, no number, document number, address or image), the antifraud system, notifications, the audit trail, a different app (except a shared address).
6. **The trace.** Every release is an audit event with reader and purpose. An operator opens a case about Aziz and sees only masked values; the trail keeps her, the purpose and the time. Narrator: the audit line matters more than encryption — it stops the insider. A later phase can show Aziz who read what.
7. **History.** Only a refresh changes identity data; new version, old version kept for the configured retention; the personal identification number is the same in every version.

## How it works (diagram and map)
- Diagram: stolen disk (attacker) → verified identity (vault art) with "ciphertext" badge. Bank's keys (Vault) wraps the record key. Blind index badge. Identity module door: release list as packets to the confirmation screen, phone check, customer records, operator; never-list as crossed boxes (apps, antifraud, audit). Operator → audit trail.
- Map: Postgres, Vault, customer gateway, admin gateway.

## Ending
Recap, then: one field still needs a check, the phone number from MyID, which may be old. Does Aziz's number belong to Aziz? Next: the phone check.

## Terms (on screen)
protected class, blind index, masked read. Glossary additions: none.

## Do not
- No key sizes, rotation times or retention numbers (all are policies or installation facts).
- No separate identity store service (later phase; the port is reserved). No code on screen.

## Sources
SRS v3.7 §6.2, §6.3, §6.4, §6.5, SRS-PRF-04, PRF-13, SRS-DEV-08 · SAD v3.8 §3.3 (module 6 Identity), §5 data view and §5.1 verified_identity, §5.2 Vault, §7.2 key custody, ADR-19 · BRD v2.3 FR-33.
