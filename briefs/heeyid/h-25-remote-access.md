# h-25-remote-access: brief

**Lesson 25 of heeyID, Module 5 (Devices and login).** 4–5 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say who detects remote access (the master app only), what the remote-access event carries, what the platform does with it (records and forwards) and what it does not do (no block, no change to device or grant).

## The question that opens the lesson
"Aziz's phone is trusted, his session is valid, his face is his own. What can go wrong when a friendly voice on the phone asks him to install one small app?"

## Bridge
In lesson 24, the new phone proved the SIM card, the old phone approved, and MyID proved the face. This lesson covers the danger that all those checks cannot see: someone who drives Aziz's own, trusted phone.

## Story
1. **The call.** A caller says he is from the bank's security team and asks Aziz to install a screen-sharing app "to protect his account".
2. **Why the checks do not help.** The phone is Trusted, the grant is valid, the binding check passes. Every request comes from the real device.
3. **The master app watches.** Only the master app looks for remote-access software and for an active phone call (app self-protection). It moves money, so only it carries this guard. Side apps do not detect remote access.
4. **The screen goes dark.** When it finds one, the master app blocks its own screen.
5. **The event.** The master app sends a remote-access event: the device, the time and the type (remote-access software or phone call).
6. **What the platform does.** It writes an audit event and sends an event to the bank's antifraud system. It does not block the customer and does not change the customer, the device or the grant.
7. **Why not block.** Narrator's view: a phone call is not a crime, and a block would punish Aziz for the caller's act; the platform records, the bank's antifraud system sees the pattern. In MVP 1 the antifraud system only receives events.
8. **Module close.** The device, the grant, the level, the two logins, and now the guard for the hands.

## How it works (the diagram)
- Caller → Aziz (phone call); Aziz → trusted phone; a "screen-sharing" badge.
- Trusted phone badges: "Trusted ✓", "grant ✓", "binding ✓" (all green, the problem is elsewhere).
- Master app (mobile bank) badge "screen blocked"; packet "remote-access event" → heeyID.
- heeyID → antifraud: packet "event"; heeyID badge "no block".
- Marketplace badge "no detection".
- Map: mobile bank, customer gateway, Kafka (events), Postgres (audit).

## Ending
Recap: only the master app detects it, the master app blocks its own screen, the platform records and forwards, and Aziz stays a customer. Module 5 closes. Open question for Module 6: the marketplace has no MyID and no TAF. How does Aziz log in there on the web, and how does the master app vouch for him? Next: side-app login.

## Terms (on screen)
remote-access event, app self-protection, bank antifraud system. Glossary: none new.

## Do not
- No vendor names of protection kits. No regulator clause numbers. No claim about when the screen unblocks (the docs do not say).
- No code on screen. No bank names.

## Sources
SRS v3.7 SRS-DEV-12, SRS-APP-09, AC-DEV-19, §1 scope (the app detects, the system records) · SAD v3.8 §4.12, §3.2 (bank apps), §3.3 (module 16, RiskEventPort) · BRD v2.3 FR-24, FR-91.
