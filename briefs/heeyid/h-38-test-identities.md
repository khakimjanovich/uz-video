# h-38-test-identities: brief

**Lesson 38 of heeyID, Module 9 (Operations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** say why stage and production are two installations, what a MyID test identity is, what the test flag does, and which guards keep a test value out of production.

## The question that opens the lesson
"How does the team run Aziz's journeys through MyID without a real person's data, and without one test record reaching production?"

## Bridge
In lesson 7, simulators stood in for each outside service; in lesson 37, the panel kept every configuration change under maker-checker. This lesson puts them into two zones and gives Aziz a test identity.

## Story
1. **Aziz is not real.** The test team needs him every day; MyID proves real people from state records.
2. **Two zones.** Stage in the test zone, production in the production zone: own MyID credentials, connections and data. Stage reaches only the MyID test environment, production only the production one; no network route between zones. Only configuration moves; customers, devices, sessions and audit events never move.
3. **Test identities.** Registered at MyID, listed in the stage configuration, each with a personal identification number or document series and number and an expected result (success or a named failure reason). Same journeys, same results.
4. **Test flag.** Every stage customer has it; limits and reports ignore test customers. In production every customer is a real, MyID-proved person, including the people the bank uses for its own checks.
5. **Guards.** A production build does not start with a test MyID host or with test customers allowed; the production database refuses a test-flag row; promotion is a Helm values difference approved by a second person.
6. **Simulators.** Each acceptance test can run without MyID, SMS, push, lookup and the antifraud system; each reason code and answer; no internet. A nightly run against the MyID test environment adds to it.

## How it works (diagram)
- Two frames: test zone (stage + MyID test) and production zone (production + MyID production); a broken edge between them; "configuration only" packet.
- Test identity cards with expected-result badges.
- Aziz in three places: test identity in stage, simulator on a laptop, crossed in production.
- Map beats: the perimeter, MyID, adapters.

## Ending
Recap: two zones, two installations, two MyID environments, no route; test identities with expected results; a test flag; guards. Open question: who builds these installations in a new bank, and when is the build done? Next: installing heeyID.

## Terms (on screen)
stage zone, test identity, test flag. Glossary additions: none.

## Do not
- No code on screen. No bank names. No names of real test persons.

## Sources
SRS v3.7 SRS-TST-01…04, SRS-BLK-01 · SAD §6 (zone separation), §10.6, C-11, ADR-18.
