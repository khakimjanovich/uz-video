# h-08-keys: brief

**Lesson 8 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** name the six kinds of keys of an installation and what each protects, explain envelope encryption and a blind index, and say why password hashes need no key.

## The question that opens the lesson
"A backup disk of the heeyID database leaves the bank. What can the person with the disk read?" Answer: nothing useful; every key stays in the bank's Vault.

## Bridge
In lesson 7, each adapter held a secret and the platform kept passports encrypted. This lesson: where every key lives.

## Story
1. **The disk.** A database copy leaves the bank; Aziz is on it.
2. **Vault in the bank.** One new Vault per zone; bank security keeps the unseal keys; the vendor never sees a key. Narrator position: the line that matters most is "the bank keeps the keys".
3. **Six kinds, walked across the disk.**
   1. Verified identity: a data key per record, wrapped by the installation key-encryption key in Vault; unwrapped for one request; each unwrap recorded (envelope encryption).
   2. Search: a blind index (keyed hash with the installation index key) for exact search by personal identification number; the same key makes the device-binding digest.
   3. One-time codes: digests with a secret pepper from Vault.
   4. Audit trail: HMAC chain with the audit key; a daily verifier alerts on each break.
   5. Token signatures: Keycloak realm keys, in the Keycloak database, encrypted with a secret from Vault.
   6. Outside credentials: MyID credential, TAF client secret, adapter client certificates, push credential; each only to its adapter (push: a file for the push adapter only); never in code, on a phone or in a log.
4. **Passwords.** Not encrypted on purpose: a slow, salted hash; nothing to decrypt.
5. **Rotation.** The bank sets each period. Old key-encryption key versions stay for unwrap, background re-wrap; old audit keys stay so old chains verify; each key has an approving owner (bank security or the platform team).
6. **The disk again.** Encrypted records, wrapped keys, indexes, digests, hashes, a signed chain; no key. A loss of hardware, not of identities.

## How it works (the diagram)
- Thief ← disk; Vault inside a "the bank" frame, the vendor crossed outside.
- Envelope: identity ← data key ← key-encryption key (in Vault); packet "wrapped" to Vault, "unwrapped, one request" back.
- Six numbered boxes appear one by one, each with its badge; the thief's arrow to each stops red.

## Ending
Recap: one Vault per zone in the bank; six kinds of keys; envelope encryption, blind index, digests. Open question: apps still keep something on the phone and call heeyID; what may an app keep, and how does it talk to heeyID? Next: the API contract.

## Terms (on screen)
envelope encryption, blind index, pepper (new); HMAC (glossary row exists).

## Do not
- No rotation periods, algorithms with numbers, or sizes. No bank names. No code.

## Sources
SAD v3.8 §3.2 (Vault row), §7.1 TB-3/TB-5, §7.2 (key custody), ADR-19, ADR-22, ADR-29, ADR-36, §11.1 I-2, §11.2 A-4 · SRS v3.7 NFR-S-02, NFR-S-03, NFR-S-05, NFR-S-10, NFR-S-14, SRS-AUD-02.
