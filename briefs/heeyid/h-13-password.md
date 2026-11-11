# h-13-password: brief

**Lesson 13 of heeyID, Module 3 (Registration, level 1).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say where the one password lives and in what form, why it is checked before any code, how the wrong-password lock works and why it is not a block, and what a password change ends.

## The question that opens the lesson
"How does a platform keep a password that it must check, but can never read?"

## Bridge
In lesson 10, Aziz types his password two times and the platform makes him a customer. Lessons 11 and 12 guard the code that comes after it. This lesson opens the box that holds the password itself.

## Story (one Thursday)
1. **The attack.** Someone with a list of leaked passwords tries Aziz's number on the marketplace web, one password after another.
2. **One row.** The password is a record of the customer gateway, not of Keycloak (ADR-29): one row for each customer in Postgres. Keycloak never sees the password, and the gateway can check it before it sends any code.
3. **Argon2id.** A **memory-hard** hashing function with a random **salt** for each password; the row holds one string with the algorithm, its settings, the salt and the digest. The settings come from the installation configuration. Older digests are not kept. Only the login module reads the row. bcrypt and PBKDF2 are not memory-hard, so they were not chosen.
4. **Password first.** Every login checks the password before a code, a new-device request or a web approval. Compare in constant time. An unknown number is checked against a fixed dummy digest: the same answer ("wrong number or password") and the same time, so the answer never shows that a customer exists.
5. **The lock.** Each wrong password adds one to a counter in the same transaction as the audit event and the antifraud event. At the configured limit: password login locked for the configured time, "password login locked" by SMS and push, the answer "Too many wrong passwords. Try again at the given time, or reset the password".
6. **A lock is not a block.** Aziz's phone keeps working: a renewal needs no password. The lock ends after the lock time, or after a reset (lesson 30).
7. **The change.** In the mobile bank: current password, new password, new password again (same rules as lesson 10). A wrong current password counts as a wrong entry. One transaction: new digest, old one gone, counter zero, lock cleared, outbox events. Every other session of the same or a lower rank ends, so the laptop session ends. "password changed" goes out.
8. **Never.** The password is never shown, returned, logged or sent; the app masks it and does not keep it. It is not the app PIN.

## How it works (the diagram)
Stranger → marketplace web → heeyID → password row (Argon2id · salt) in Postgres; Keycloak beside it, crossed for "password". Counter badge climbing, lock badge; Aziz's phone keeps a green session. Change: phone → heeyID → new digest; the laptop session crossed.

## Ending
Recap: one row, a slow salted digest, checked first, a lock that blocks nothing, a change that ends the weaker sessions. Open question for Module 4: Aziz is still at level 1; before the platform may call MyID, what must he agree to? Next: consent.

## Terms (on screen)
Argon2id, salt, memory-hard. Glossary addition: `Argon2id` → "argon two I D".

## Do not
- No policy numbers (length, wrong entries, lock time) and no Argon2id parameter values.
- Reset only named (lesson 30); rank only named (lesson 29).
- No bank names, no prices.

## Sources
SRS v3.7 SRS-REG-10, SRS-DEV-16, SRS-DEV-17 (change), SRS-APP-01, NFR-S-14, error table (E-DEV-06, E-DEV-07) · SAD v3.8 C-3, ADR-29, §4.13 (flow 13), §5.1 (password_credential), §10.5 (pwd.*).
