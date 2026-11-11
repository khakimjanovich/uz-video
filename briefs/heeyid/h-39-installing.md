# h-39-installing: brief

**Lesson 39 of heeyID, Module 9 (Operations). The last lesson.** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** list the steps from an empty cluster to a working installation (OpenTofu configuration, Helm units, realm, go-live check), run the local stack, and read the definition of done line by line.

## The question that opens the lesson
"Between the day a bank signs and the day Aziz types his phone number for the first time, what has to happen?"

## Bridge
In lesson 6, the configuration came from OpenTofu with no default in the code; in lesson 38, stage and production became two installations. This last lesson installs heeyID and looks back at the road.

## Story
1. **Monday.** A new bank signs; its platform team gets two new Kubernetes clusters.
2. **The rule.** One installation for one bank, one for each zone; no second bank inside; no call to the vendor.
3. **Configuration.** The OpenTofu configuration gives deploy values and the defaults of every policy and text (four languages). Setup writes them as version 0, marked as the product default. A missing value stops the setup.
4. **Units.** Images with a Helm chart: gateways, Keycloak, workers, MyID and push adapters; Postgres, Valkey, Kafka, Vault new for each zone. Vault makes the keys; bank security keeps the unseal keys. Keycloak: one realm, one client per app.
5. **The gate.** No service until one active app with a required level; the panel shows what is still the default. Stage first, then production as a Helm values difference approved by a second person.
6. **Local.** Compose: Postgres, Valkey, Kafka, Vault (dev), Keycloak with three clients, a simulator for each outside service, a seed; the acceptance suite with no internet.
7. **Done.** Decisions accepted; API contracts published; a test for each failure path; app separation; audit events on the stream read by a simulator; code review, independent security review, penetration test; integration guide, runbooks, decision log; product sign-off after a demo on real phones in the test zone.
8. **The road.** A recap of the course with Aziz (no open question).

## How it works (diagram)
- OpenTofu → configuration → setup (version 0); Helm → units; two zone frames.
- The go-live gate as a checker with "one app with a level".
- A laptop with Compose and the simulators.
- Map beats: the whole map, then the perimeter, then all of it lit for the recap.

## Ending
The course recap with Aziz: level 1, level 2 once in the master app, the link and the trusted phone, side apps that ask for approval, ranks and "This was not me", refresh, block, messages, the chain, the panel, two zones. "Prove once, then bind. That is heeyID." No open question.

## Terms (on screen)
installation, go-live check, definition of done. Glossary additions: `OpenTofu` → "open tofu", `Valkey` → "val key".

## Do not
- No replica counts, sizes or versions. No code on screen. No bank names.

## Sources
SAD §6, §7.2, §10.1, §10.5, §10.6, §10.7, §11.1, ADR-09, ADR-28 · SRS v3.7 SRS-TEN-01…04, SRS-TST-01.
