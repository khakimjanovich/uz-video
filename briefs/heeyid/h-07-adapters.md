# h-07-adapters: brief

**Lesson 7 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw domain → port → adapter → service, say why each port has a simulator, explain timeout + breaker + probe, and give the fixed behaviour when MyID, TAF, SMS, push, lookup or antifraud is down.

## The question that opens the lesson
"MyID stops answering in the middle of Aziz's check. What happens to him, and to the platform?"

## Bridge
In lesson 6, some configured values were timeouts. This lesson: the walls around every outside call.

## Story
1. **The spinner.** Friday evening; MyID slows, then stops.
2. **Domain, no I/O.** Rules only; it calls ports.
3. **Ports and adapters.** A port in the words of the domain (open a proofing session, send a code, find a customer by personal identification number); an adapter talks to one service. Eight outgoing ports.
4. **Simulators.** Each port: real adapter + simulator with every contract answer (success, each failure, timeout, down). Acceptance suite on simulators without internet; nightly MyID test environment. Narrator position: the simulator is what teams skip and regret.
5. **Walls.** Timeout (policy); breaker opens after the configured number of failures in a row; probe at a configured interval; "dependency down" alert. One fixed behaviour per dependency; a timeout gives a named outcome, never a raw exception.
6. **Fixed behaviours.** MyID: current level kept, attempt not counted, no proofing later. TAF: codes via the bank SMS service, not scored; no fallback after the trusted-bank refusal of the state services portal. SMS: no code, "service not available"; notifications wait in Kafka. Push: approval request waits for the pull; notifications by SMS. Lookup: link pending, worker retries, step-up completes. Antifraud: events wait in Kafka; no journey waits.
7. **Back to Aziz.** Named outcome after the timeout, plain message, level kept, attempt not counted; breaker opens, next customers answered at once; panel shows provider status; probe closes the breaker.
8. **Two more rules.** No request or response body in logs (reference, outcome, time only). Hosts and credentials from configuration and the key store; the MyID and push adapters are their own services, the only holders of those credentials.

## How it works (the diagram)
- Domain → port → adapter → MyID; then the port with a second box: simulator.
- Breaker box between adapter and MyID: packets stop red, the breaker turns danger, the probe packet closes it.
- Six rows of fixed behaviours, one per sentence, each a small two-box picture with a badge.
- Log box with "reference · outcome · time" and a crossed "body".

## Ending
Recap: domain with no I/O; a port per service with an adapter and a simulator; timeout, breaker, one fixed behaviour each. Open question: each adapter holds a secret, and the platform keeps passports encrypted; where do the keys live? Next: keys.

## Terms (on screen)
port, adapter, circuit breaker (new); simulator (plain word). No new glossary rows.

## Do not
- No timeout numbers or failure counts. No code or package paths on screen. No TAF error codes.

## Sources
SAD v3.8 C-15, C-16, §8 (table, rules for each adapter, port shapes), §10.1 (domain without I/O), §10.6 (simulators), ADR-12, ADR-24, ADR-36, §7.1 TB-2 · SRS v3.7 SRS-PRF-10, SRS-AF-04, SRS-LNK-05, NFR-A-03, NFR-A-06, NFR-S-10, SRS-TST-04.
