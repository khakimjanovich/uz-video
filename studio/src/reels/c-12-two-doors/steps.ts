import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 12: the two doors. One story carries it: a bank counter and a mail slot.
// Two kinds of visitor and the big proxy (cues 0–6), the counter and the slot (7–9), the payers' door (10–15),
// the callers' door and pass-through (16–22), no clear-text box (23), the slot's rules (24–26), the check (27–30), the close (31–32).
const ZONE = { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" } as const;
const VISITORS = { buyer: [0, 0.3], caller: [0, 1.7], card: [3, 1] } as const;
const PROXY = { ...VISITORS, bigProxy: [1.5, 1] } as const;
const PROXY_EDGES = [{ from: "buyer", to: "bigProxy" }, { from: "caller", to: "bigProxy" }, { from: "bigProxy", to: "card" }] as const;
const DOORS = { ...VISITORS, payerDoor: [1.5, 0.3], callerDoor: [1.5, 1.7] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "payerDoor" },
  { from: "payerDoor", to: "card" },
  { from: "caller", to: "callerDoor" },
  { from: "callerDoor", to: "card" },
] as const;
const DOOR_WALL = { label: "Card zone", from: [1.5, 0.3], to: [3, 1.7], tone: "wall" } as const;
const ROLES = { payerDoor: "counter", callerDoor: "mail slot" };
const FOUR = { caller: [0, 1], callerDoor: [1.1, 1], card: [2.2, 0.3], adapterA: [3.1, 0.3], adapterB: [2.2, 1.7], cardsKeycloak: [3.1, 1.7] } as const;
const FOUR_EDGES = (["card", "adapterA", "adapterB", "cardsKeycloak"] as const).map((to) => ({ from: "callerDoor" as const, to }));
const FOUR_WALL = { label: "Card zone", from: [1.1, 0.3], to: [3.1, 1.7], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Two kinds of visitor; one big proxy would see everything.
  { cue: 0, layout: { card: [3, 1] }, frames: [ZONE] },
  { cue: 1, layout: VISITORS, frames: [ZONE] },
  { cue: 2, layout: VISITORS, frames: [ZONE], badges: { buyer: "internet" } },
  { cue: 3, layout: VISITORS, frames: [ZONE], badges: { buyer: "internet", caller: "other unit" } },
  {
    cue: 4,
    layout: PROXY,
    edges: [...PROXY_EDGES],
    frames: [ZONE],
    danger: ["bigProxy"],
    packets: [{ from: "buyer", to: "bigProxy", label: "card" }, { from: "caller", to: "bigProxy", label: "token", delay: 20 }],
    badges: { bigProxy: "clear text" },
  },
  { cue: 5, layout: PROXY, edges: [...PROXY_EDGES], frames: [ZONE], danger: ["bigProxy"], badges: { bigProxy: "most valuable" } },
  // Two narrow doors: a counter and a mail slot.
  { cue: 6, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], accent: ["payerDoor", "callerDoor"] },
  { cue: 8, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: { payerDoor: "counter" } },
  { cue: 9, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: ROLES },
  // The payers' door.
  { cue: 10, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], accent: ["payerDoor"], badges: { payerDoor: "counter" } },
  { cue: 11, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], packets: [{ from: "buyer", to: "payerDoor", label: "encrypted" }], badges: { payerDoor: "opens it" } },
  { cue: 12, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], packets: [{ from: "payerDoor", to: "card", label: "frame" }] },
  {
    cue: 13,
    layout: DOORS,
    edges: [...DOOR_EDGES],
    frames: [DOOR_WALL],
    packets: [{ from: "payerDoor", to: "card", label: "other path", delay: 10, stopAt: 0.3 }],
    badges: { payerDoor: "404" },
  },
  { cue: 14, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: { payerDoor: "submits: limited", buyer: "pages: free" } },
  // The callers' door: pass-through.
  { cue: 16, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], accent: ["callerDoor"], badges: { callerDoor: "mail slot" } },
  { cue: 17, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], packets: [{ from: "caller", to: "callerDoor", label: "sealed · card-vault" }] },
  {
    cue: 18,
    layout: DOORS,
    edges: [...DOOR_EDGES],
    frames: [DOOR_WALL],
    packets: [{ from: "caller", to: "callerDoor", label: "sealed" }, { from: "callerDoor", to: "card", label: "still sealed", delay: 50 }],
  },
  { cue: 19, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: { callerDoor: "pass-through" } },
  { cue: 20, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: { callerDoor: "pass-through", card: "checks cert + token" } },
  { cue: 21, layout: FOUR, edges: [{ from: "caller", to: "callerDoor" }, ...FOUR_EDGES], frames: [FOUR_WALL], accent: ["card", "adapterA", "adapterB", "cardsKeycloak"] },
  {
    cue: 22,
    layout: FOUR,
    edges: [{ from: "caller", to: "callerDoor" }, ...FOUR_EDGES],
    frames: [FOUR_WALL],
    packets: [{ from: "caller", to: "callerDoor", label: "other name", stopAt: 0.8 }],
    badges: { callerDoor: "refused" },
  },
  // No door holds everything.
  { cue: 23, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], badges: ROLES },
  { cue: 31, layout: DOORS, edges: [...DOOR_EDGES], frames: [DOOR_WALL], accent: ["payerDoor", "callerDoor"], badges: ROLES },
];

export const map: BuildMapStep[] = [{ cue: 32, part: 2, current: ["frame", "card", "adapters", "cardsinfra"], units: { cards: "two doors" } }];

// The mail slot's rules, lines 23–37 (the adapters' lines elided: their names name processing centres), then the one check.
export const code: CodeStep[] = [
  {
    cue: 24,
    file: "cards-infra/partner/nginx.conf",
    lines: [
      "  map $ssl_preread_server_name $service {",
      "    card-vault.cards.internal card-vault:8093;",
      "    …",
      "    cards-keycloak.cards.internal cards-keycloak:8443;",
      "    default 127.0.0.1:1; # nothing listens: refused",
      "  }",
      "",
      "  server {",
      "    listen 8443;",
      "    ssl_preread on;",
      "    preread_timeout 5s;",
      "    proxy_connect_timeout 5s;",
      "    proxy_pass $service;",
      "  }",
    ],
    at: [23, 24, null, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
    small: true,
    beats: [{ cue: 25, highlight: [1, 10] }, { cue: 26, highlight: [2, 4, 5] }],
  },
  {
    cue: 27,
    file: "terminal · cards-infra",
    lines: [
      "$ CA=\"$(mkcert -CAROOT)/rootCA.pem\"; DOOR=https://cards.localhost:8443",
      "$ curl -s --cacert \"$CA\" -o /dev/null -w '%{http_code}\\n' $DOOR/frame/frame.js",
      "200",
      "$ curl -s --cacert \"$CA\" -o /dev/null -w '%{http_code}\\n' $DOOR/internal/v1/cards/x",
      "404",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 28, upTo: 3, highlight: [3] }, { cue: 29, highlight: [5] }, { cue: 30, highlight: [1] }],
  },
];
