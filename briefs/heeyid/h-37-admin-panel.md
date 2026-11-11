# h-37-admin-panel: brief

**Lesson 37 of heeyID, Module 9 (Operations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** name the four staff roles and what each may do, say how staff sign in, and walk through one maker-checker change.

## The question that opens the lesson
"Who may sit at the screen that blocks a customer, and who watches that person?"

## Bridge
In lesson 36, every staff action became an audit event in a chain. This lesson opens the panel itself.

## Story
1. **The power.** The Friday operator: one search, one button, one reason, every session ended.
2. **The door.** The bank's staff identity with multi-factor authentication; no staff passwords in the platform; configured inactivity limit and session lifetime. The admin gateway uses the same domain code: no second copy of the rules.
3. **Four roles.** Viewer (sees only), Operator (acts on customers, decides reviews and cases, cancels or approves a waiting reset, reopens a closed app account), Security administrator (policies, provider settings, staff-role table), Compliance (texts, exports). Exactly one each; the server checks at each operation.
4. **The screen.** Search by exact verified phone or exact personal identification number; one view; masked values; no full document numbers, addresses or images. Each action: a written reason, starts at once, audit event, notification to the customer. Cases and phone reviews in two lists.
5. **Maker-checker.** Monday: a security administrator proposes a shorter code lifetime; a second one with the same role approves; a new version with proposer, approver, times and reason; rejected proposals kept; earlier versions can be proposed again. Same rule for provider settings, texts, templates, the staff-role table.

## How it works (diagram)
- Staff → staff identity (MFA) → admin gateway → same domain as the customer gateway.
- Four role boxes with badges.
- Proposal: maker → proposal (current vs proposed) → checker → new version; the maker's own approval crossed.
- Map beats: staff, admin gateway, Keycloak (staff identity), records.

## Ending
Recap: bank identity, one role each, a reason and an event for each action, two people for each rule change. Open question: where does the team try all of this without a real person's identity? Next: test identities.

## Terms (on screen)
role, maker-checker, proposal. Glossary additions: none (`MFA` exists, not used in the script).

## Do not
- No policy numbers (staff limits, reason length). No code on screen. No bank names.

## Sources
SRS v3.7 SRS-ADM-01…07, SRS-REV-02, SRS-APP-06, SRS-APP-12 · SAD §3.2 (admin gateway), §3.3, §10.3.
