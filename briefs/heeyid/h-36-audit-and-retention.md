# h-36-audit-and-retention: brief

**Lesson 36 of heeyID, Module 8 (Lifecycle and trail).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** list what an audit event holds and never holds, explain the HMAC chain, name the two streams to the bank, and say how long each record lives.

## The question that opens the lesson
"How does a platform keep a record that even its own administrators cannot rewrite?"

## Bridge
In lesson 35, every message left through the outbox with its template version in an audit event. This lesson follows the audit events.

## Story
1. **Six months later.** Aziz writes: on that Friday, before the block, someone approved a laptop login, and it was not him.
2. **One event.** Type, app, time in ms, actor, device, network address, the registration/session/case, result, reason key, MyID references, reader and purpose for identity reads.
3. **Never inside.** Images, full document numbers, the full personal identification number (first two and last two digits only), addresses, codes, passwords, result codes, reusable identifiers, access grants.
4. **No changes.** Add only; the app role has no UPDATE or DELETE. HMAC chain: each entry = HMAC(key, sequence number, previous, event); the key in Vault; a daily verifier alerts at a break.
5. **Readers.** The bank's security monitoring reads the audit topic in seconds; kept and replayed in order after an outage. Risk events to the bank's antifraud system, references only. Compliance exports by period, customer, type.
6. **The answer.** The export shows the web login, the correct password, the approval from the trusted phone after the theft, the block, the revoke. The chain verifies.
7. **Retention.** Code until void or expired; failed registration after the registration-expiry period (audit stays); old identity versions and the customer after closure: identity retention; audit events: audit retention, deleted by full days; policy and text versions: life of the installation. Deletion also from backups; monthly deletion report.

## How it works (diagram)
- Event cards in a row linked by arrows (the chain), one card crossed → the cards after it turn red.
- Vault (audit key); Kafka → bank monitoring; risk → antifraud system; Compliance export.
- Retention: records with clock badges.
- Map beats: events (Kafka), records, keys, workers.

## Ending
Recap: one event per step with no secret inside, an HMAC chain the bank can check, two streams, a clock per record. Open question: who pressed block, who exported, and who checks them? Next: the administrator panel.

## Terms (on screen)
audit event, HMAC chain, retention. Glossary additions: none (`HMAC` exists).

## Do not
- No retention numbers (say "the audit retention", "the identity retention"). No code on screen. No bank names.

## Sources
SRS v3.7 SRS-AUD-01…04, §6.5 · SAD C-10, ADR-17, ADR-22, §5.1 (audit_event), §7.2 (audit HMAC key), §8 (monitoring), §10.4 (audit and risk topics), §10.3 (export).
