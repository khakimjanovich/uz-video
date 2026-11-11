# h-06-configuration: brief

**Lesson 6 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say where each default value lives (the OpenTofu configuration, never the code), what happens when a value is missing, how a policy changes (maker-checker), and which values the panel can never change (installation keys).

## The question that opens the lesson
"A value is missing at setup. Should the platform guess a number, or stop?"

## Bridge
In lesson 5, each app got its own required level, and each token a lifetime. This lesson: who sets such values, where they live, how they change.

## Story
1. **The missing line.** The platform team of the bank sets up heeyID; the one-time-code lifetime is missing.
2. **No default in the code.** Narrator position: a default hidden in code is a decision nobody signed.
3. **OpenTofu.** The catalogue in the installation's OpenTofu configuration: a value for each SRS policy and the default texts (consent, terms, notifications) in four languages. Setup writes it as version 0, proposer "product", marked as default. A missing value stops setup with a clear error.
4. **Go-live gate.** No service until at least one active app has a required level; until then each journey answers "service not available" (E-TEN-01).
5. **Two kinds of values.** Policies (settings of the bank: code lifetimes, attempt limits, waiting times) change in the panel. Installation keys (MyID host, zone, test customers allowed, breaker values, access token lifetime) belong to one zone; the panel cannot change them.
6. **Maker-checker.** Malika (security administrator) proposes a shorter code lifetime: current value, new value, reason. A second security administrator approves; she cannot approve her own. New version with proposer, approver, times, reason. Rejections are kept; an earlier version can be proposed again. Texts: same path, Compliance role.
7. **Validation.** The platform refuses zero, negative values, wrong units, a minimum confidence below the threshold, and a too-long dormancy period.
8. **The default mark.** The panel shows which values are still the product default.
9. **Close.** Each value has a source, a version and an owner; that is why the course says "the configured time".

## How it works (the diagram)
- Platform team → setup → platform, with the code box crossed "no defaults"; OpenTofu → setup; a missing row stops setup (danger).
- Version ladder: policies box with badges "v0 · product · default" → "v1 · Malika + checker".
- Maker → panel → checker, a packet "proposal", a crossed self-approval.
- Two boxes: policies (panel ✓) and installation keys (panel ✕).

## Ending
Recap: no default in the code; defaults and texts from OpenTofu as version 0; a missing value stops setup; policies change with maker-checker, installation keys do not. Open question: some values are timeouts for MyID, TAF and SMS; what happens when one of them is slow or down? Next: adapters.

## Terms (on screen)
policy, maker-checker, installation key (new); OpenTofu (tool name). Glossary: `OpenTofu` → "open tofu".

## Do not
- No default numbers (not even as an example). No bank names. No code on screen.

## Sources
SAD v3.8 C-12, ADR-28, §10.5 · SRS v3.7 §1.4 (policy values), SRS-ADM-02, SRS-ADM-03, SRS-ADM-07, SRS-TEN-04, E-TEN-01, AC-TEN-3 · BRD v2.3 FR-67, FR-82.
