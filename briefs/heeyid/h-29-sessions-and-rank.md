# h-29-sessions-and-rank: brief

**Lesson 29 of heeyID, Module 7 (Sessions and recovery).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** give the rank of any session, apply the end-a-session rule (lower rank, or same rank and younger), say what a password change ends, and say who blocks actions in the probation period.

## The question that opens the lesson
"Two sessions of one person, and one wants the other gone. Which one should win?"

## Bridge
In lesson 21, each session got its tokens and its level. This lesson adds two more facts to every session: when it started, and its rank.

## Story
1. **The copy shop.** Three months ago Aziz logged in to the marketplace website at a copy shop and never logged out. Last week: new phone, mobile bank, green TAF. Today a stranger at the shop taps End on Aziz's mobile-bank session.
2. **Rules that fail.** Any session ends any: the thief ends the owner. Older wins: the copy-shop session is older.
3. **Rank.** Rank 2: master app with Green, or Yellow and a passed MyID. Not scored (TAF down): rank 1 until a later Green. All others (web, side apps): rank 1.
4. **The rule.** End only a lower rank, or a younger session of the same rank. The stranger is refused (audit + antifraud event). Aziz ends the copy-shop session from the list. Narrator: owners have the strongest check, thieves the oldest forgotten door; rank first, age breaks a tie.
5. **Password change or reset.** Ends every other session of the same or a lower rank, whatever its age (used in lesson 30).
6. **Notifications.** A new session: push to every other session and SMS.
7. **Probation.** After a new session, a new phone or a reset, even after TAF and MyID. The bank sets the actions and the period for each app in the platform's policies. The token carries the session start, the probation end, the rank and the level; each app backend blocks its own actions; the platform does not.

## Ending
Recap. Open question: a stranger with a new SIM card carrying Aziz's number asks for a password reset while Aziz has active sessions. Should it happen at once? Next: the password reset.

## Diagram
- `trusted` (rank 2), `marketWeb` (copy shop, rank 1), `someone`; badges "rank 1", "rank 2", "started 3 months ago".
- Refused packet ("End", stopAt), then Aziz's "End" succeeds (marketWeb crossed).
- Probation: `keycloak` token badge "start · probation end · rank · level", `mobileBank` and `marketplace` each "blocks its own actions".

## Terms (on screen)
rank, seniority, probation period. Glossary additions: none.

## Do not
- No bank names, prices, policy numbers ("for a while", "the bank decides").
- No code on screen; claim names stay out of the voice.

## Sources
BRD v2.3 FR-92, FR-93 · SRS v3.7 SRS-APP-10, SRS-APP-11, SRS-DEV-17, NTF "new session" · SAD v3.8 §4.18, ADR-34.
