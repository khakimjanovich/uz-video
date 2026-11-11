# h-04-perimeter: brief

**Lesson 4 of heeyID, Module 2 (Foundations).** 4–6 minutes, 16:9, English.

## Audience and action
- **Viewer:** a backend developer who is new to identity.
- **After this lesson the viewer can:** draw the perimeter of one installation, list every outside name heeyID may call, and say why stage and production are two installations.

## The question that opens the lesson
"The company that wrote heeyID closes tonight. Tomorrow at eight, does Aziz still log in?" Answer: yes, because nothing calls the vendor.

## Bridge
In lesson 3, the three checks touched passports and phone numbers. This lesson shows where they run and whom heeyID may call.

## Story
1. **The dark office.** The vendor is gone overnight. Aziz logs in at eight.
2. **Inside the perimeter.** The bank installs and operates heeyID on its own infrastructure. One installation, one bank, all its apps; a second bank, a second installation.
3. **No call to the vendor.** No control plane at the vendor, no data that goes home. Narrator position: the most useful promise is that the vendor is not needed at night. Data stays in the bank, in Uzbekistan.
4. **The short list.** The installation configuration names each host. (1) The bank's services: SMS, customer records, antifraud, security monitoring. (2) TAF: its agent already runs in the bank network; heeyID uses only its API; nobody installs anything. (3) MyID, outside: only from the MyID adapter, pinned connection, credential from the bank's key store. (4) The push service, outside: type and reference only; the app fetches the text over its session. An egress proxy lets only these names out.
5. **Zones inside.** One edge → application services (two gateways, Keycloak, workers) → data zone (Postgres, Valkey, Kafka, Vault). The data zone accepts no connection from the edge.
6. **Stage and production.** Same units, two installations, no network route between them. Stage: MyID test environment and test identities. Production: real MyID, own credential. Only configuration moves, with a second person's approval; no database content moves. A production build refuses to start with a test MyID host or with test customers allowed.
7. **Back to eight o'clock.** Edge → customer gateway → data zone; the code through the TAF agent in the bank. Nothing leaves the country, nothing touches the vendor.

## How it works (the map, built step by step)
- Build map: all inside nodes, then the dashed perimeter frame; the vendor box crossed outside it (diagram).
- Diagram: platform in a "perimeter" frame; outside names arrive one by one (bank services, TAF agent inside, MyID outside, push outside with "type + ref").
- Zones: edge → gateways → stores, with a broken edge from edge to stores.
- Stage and production: two bank boxes, a broken edge between, a "config only" packet, MyID test vs MyID.

## Ending
Recap: one installation, one bank, inside its perimeter; no vendor; four outside names; zones; stage and production. Open question: inside one installation, three apps share one Keycloak; if the marketplace leaks a token, what stops it from opening the mobile bank? Next: apps and tokens.

## Terms (on screen)
perimeter, zone, egress proxy (new); installation (known). No new glossary rows (`TAF`, `MyID`, `SMS`, `API`, `Valkey` exist).

## Do not
- No bank names, no prices, no timeouts or other numbers. No Kubernetes or Helm details (lesson 39).

## Sources
SAD v3.8 C-1, C-11, C-16, ADR-09, §3.1, §3.2, §6 (zone separation, network zones), §7.1 TB-4/TB-5, §11.1 I-6 · SRS v3.7 SRS-TEN-01, SRS-TEN-02, NFR-V-01, SRS-TST-01 · BRD v2.3 FR-79.
