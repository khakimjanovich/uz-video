# h-35-notifications: brief

**Lesson 35 of heeyID, Module 8 (Lifecycle and trail).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say which road each message takes (codes, SMS, push), why the outbox stops lost messages, and what a push may carry.

## The question that opens the lesson
"Why does a message from the bank carry so little, on purpose?"

## Bridge
In lesson 12, TAF sent the codes in the master app; in lesson 26, the bank SMS service sent them in side apps. This lesson collects every message: its road, its address, its content.

## Story
1. **Saturday, 1 a.m.** The stolen phone shows a push from the bank. The thief finds nothing worth reading.
2. **Roads.** No messaging contract of its own: SMS through the bank's SMS service, push through the push service in the bank's Firebase project. Codes follow the app: TAF in the master app (bank SMS only while TAF is down), the bank SMS service in side apps. Only the code message carries a code.
3. **Addresses.** SMS only to the registration number or the verified number; push only to the customer's devices.
4. **Outbox.** Password change: digest + outbox row in one transaction → relay → Kafka → worker → SMS or push. Crash-safe; no message for a change that never happened. Delivery reports; configured retries, then failed.
5. **Security notifications.** The customer cannot stop them. New session: push to the other sessions + SMS, with app, device model, address, time.
6. **On hold.** After "This was not me" (lesson 31): push only, no SMS to the number on hold.
7. **Content.** No document data, no personal identification number, first name only, no action links. A push carries only the type and a reference; the app pulls the text, only on a device of the customer, from the published template version. Push service down → SMS only.
8. **Templates.** Four languages, Compliance with maker-checker, versions kept, the audit event names the version.

## How it works (diagram)
- Platform → outbox → Kafka → workers → SMS service / push service → phone.
- Codes: master app ← TAF; side app ← bank SMS.
- A push packet labelled "type + ref"; the app pulls "text" back from the platform.
- Number on hold: SMS edge broken, push only.
- Map beats: events (Kafka), workers, adapters, SMS, push.

## Ending
Recap: two roads, codes by app, the outbox, security notifications, no SMS on hold, push = type + reference. Open question: each message is also an audit event; how does the bank prove what happened, and that nobody changed the proof? Next: the audit trail.

## Terms (on screen)
outbox, security notification, push by pull. Glossary additions: none.

## Do not
- No retry numbers. No code on screen. No bank names.

## Sources
BRD v2.3 FR-75, FR-75a · SRS v3.7 SRS-NTF-01…05, SRS-AF-05, SRS-APP-03 · SAD §3.2 (Kafka, workers), §5.1 (outbox), §7.1 TB-4, §8 (SMS and push adapters), §10.4 (notify topic), ADR-21, ADR-31, ADR-36.
