# h-33-refresh: brief

**Lesson 33 of heeyID, Module 8 (Lifecycle and trail).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** name the three document statuses and what each one does, and say why only a new live face check may change the verified identity.

## The question that opens the lesson
"His face, phone and password have not changed. So why does the bank care about the expiry date of his passport?"

## Bridge
In lesson 15, MyID proved Aziz with a full proofing; in lesson 17 the result became a versioned verified identity. This lesson adds time: documents expire, and the record follows without a silent edit.

## Story
1. **Sunday.** The mobile bank shows a line at each start: the passport expires soon, refresh your identity (status expiring, from the configured lead time; one audit event "document expiring").
2. **He waits.** The date passes: expired. The grant stays valid, no block, no MyID at login. The identity summary gets the restricted flag and the configured allowed actions; SMS + push "document expired"; audit event. In MVP 1 the app applies the restriction.
3. **The refresh.** Started by the customer, by the app (status expiring or expired) or by an operator with a reason. Needs a trusted device and a valid grant. Consent gate → MyID session with the personal identification number preset → result → confirmation. No phone check.
4. **The result.** Same number: new current version, old version kept, new reusable identifier and expiry; status valid; flag removed; "identity refreshed" notification and audit event.
5. **The rule.** No field of the verified identity changes without a live face check in a session the platform opened. An operator can ask, never type.
6. **Limits.** The attempt limits of lesson 11 apply; a refresh that an operator starts is not counted.

## How it works (diagram)
- Passport with its date → workers (daily job) → status chip valid / expiring / expired.
- Aziz's phone with the restricted flag; the access grant stays green.
- Refresh path: consent → MyID → platform; two identity versions side by side (v1 kept, v2 current).
- Operator asks; a crossed "edit" from the operator to the record.
- Map beats: the workers and the records box; MyID.

## Ending
Recap: expiring asks, expired restricts, neither blocks; only a live face check writes a new version. Open question: a refresh that returns a different personal identification number ends in a block. What does a block do, and who lifts it? Next: blocks.

## Terms (on screen)
document status, restricted flag, identity refresh. Glossary additions: none.

## Do not
- No policy numbers (lead time, list of allowed actions: "configured").
- No code on screen. No bank names. No prices.

## Sources
SRS v3.7 SRS-RFR-01…04, SRS-NTF-02, SRS-BLK-01, SRS-PRF-01, SRS-PRF-06 · SAD §4.6, §3.2 (workers), §5.1 (person.doc_status, verified_identity versions).
