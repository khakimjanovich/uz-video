# h-11-codes-and-limits: brief

**Lesson 11 of heeyID, Module 3 (Registration, level 1).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say where a one-time code lives and in what form, name the limits on one code and the rate limits on requests, and say why every limit lives on the server and not in the app.

## The question that opens the lesson
"Codes arrive on Aziz's phone at night that he never asked for. Who stops them, and who stops the person who guesses?"

## Bridge
In lesson 10, the platform makes a random code and keeps it as a digest. This lesson shows the rules around that code: how long it lives, how many tries it gets, and how many codes a number, an address or a device can ask for.

## Story (one night)
1. **The night.** Someone runs a script on the marketplace web: Aziz's number, again and again. His phone buzzes with codes.
2. **One code.** Random, with enough entropy (NFR-S-03); stored in the code table in Postgres as a keyed digest with the code **pepper** from Vault (lesson 8); compared in constant time. One active code per owner; a new code makes the old ones void. The code never sits in clear, also not after it goes to TAF, and never in a log.
3. **Limits on one code (policies):** the lifetime, the wrong entries, the resends, the minimum interval. The answers: wrong code with the entries that remain; code expired; "wait, then ask for a new code" (E-REG-04); "no more codes" (E-REG-03). After the last wrong entry the code is void.
4. **TAF's own lock.** TAF blocks a number for a while after a few wrong codes. So the platform's wrong-entry limit can never be looser than TAF's.
5. **Rate limits (Valkey):** code requests per number per day, per network address per hour, registrations per device per day, in the time zone of the installation. Over the limit: E-REG-02 "Too many requests. Try again at the given time", an audit event, and an event to the bank's antifraud system. The script stops.
6. **Why Valkey.** Counters and **cool-downs** expire by themselves and read in under a millisecond; everything in Valkey comes again from Postgres or expires.
7. **Only the server counts.** A limit in the app is only for convenience (NFR-S-06). The script never used the app.
8. **The same idea for MyID (SRS-BLK-01/02).** Failed proofing attempts are counted per phone number, device and personal identification number: a daily cap and two cool-downs. Only failures that the person or the capture caused count; a provider outage does not. An operator can reset counters, with a reason. Test customers never count.

## How it works (the diagram)
Stranger's script → marketplace web → heeyID; code store (digest only) and Valkey (counters) beside heeyID; SMS service → Aziz's phone. Counters fill, then the red stop. Then the TAF lock badge, then the three subjects (number, device, personal identification number) for MyID attempts.

## Ending
Recap: one code, one digest, a short life, few tries; the counters live on the server. Open question: the code was right, but was it typed on the phone that holds the SIM card? Next: the TAF verdict.

## Terms (on screen)
pepper (from lesson 8), rate limit, cool-down. Glossary addition: `Valkey` → "val key".

## Do not
- No policy numbers (code length, lifetime, limits, caps, cool-downs). TAF's own lock is said without its numbers.
- No bank names, no prices.

## Sources
SRS v3.7 SRS-REG-02, SRS-REG-03, SRS-REG-06, SRS-AF-01 (limits), SRS-BLK-01, SRS-BLK-02, NFR-S-03, NFR-S-06, Appendix error table (E-REG-02…07, E-PRF-01) · SAD §5.1 (one_time_code), §5.2 (Valkey, never stored), §10.5 (otc.*, reg.limit.*, prf.*).
