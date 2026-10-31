import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 1: the map. One story carries it: a shop with a locked room next door.
// The fee ticket in one big service (cues 0–3), the two units (4–7), users, modules, the cards unit (8–15),
// share nothing and one line (16–20), back to the ticket (21–23), both units running (24–31), the close (32–33).
const MODULES = ["partner", "commission", "epos", "payment", "reconciliation"] as const;
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const INFRA = ["postgres", "redis", "keycloak", "vault", "s3", "temporal", "kafka", "observability", "cardsinfra"] as const;
const UNITS = { ecom: "the shop", cards: "locked room" };

const TICKET = { ticket: [0.4, 1], monolith: [2.4, 1] } as const;
const FEE = { ticket: [0, 1], commission: [1.5, 1], card: [3.2, 1] } as const;
const ROOM = { label: "Locked room", from: [3.2, 1], to: [3.2, 1], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The ticket in one big service.
  { cue: 0, layout: { ticket: [1.5, 1] } },
  { cue: 2, layout: TICKET, edges: [{ from: "ticket", to: "monolith" }] },
  { cue: 3, layout: TICKET, edges: [{ from: "ticket", to: "monolith" }], danger: ["monolith"], badges: { monolith: "card review" } },
  // Back to the ticket: the fee change stays in the shop.
  { cue: 21, layout: FEE, frames: [ROOM] },
  { cue: 22, layout: FEE, frames: [ROOM], edges: [{ from: "ticket", to: "commission" }], accent: ["commission"], badges: { card: "untouched" } },
];

export const map: BuildMapStep[] = [
  { cue: 4, part: 0 },
  { cue: 5, part: 0, units: { ecom: "unit", cards: "unit" } },
  { cue: 6, part: 0, units: { ecom: "the shop" } },
  { cue: 7, part: 0, units: UNITS },
  { cue: 8, part: 0, current: ["merchant", "buyer", "admin"] },
  { cue: 9, part: 0, current: ["merchant"] },
  { cue: 10, part: 0, current: ["buyer"] },
  { cue: 11, part: 0, current: ["admin"] },
  { cue: 12, part: 0, current: [...MODULES], units: { ecom: "5 modules" } },
  { cue: 14, part: 0, current: [...CARD_ZONE], units: { cards: "card numbers" } },
  { cue: 15, part: 0, current: [...CARD_ZONE, "procsvc"], units: { cards: "card numbers" } },
  { cue: 16, part: 0, current: [...INFRA] },
  { cue: 17, part: 0, current: [...INFRA], units: UNITS },
  { cue: 18, part: 0, current: ["procport", "card"] },
  { cue: 20, part: 0, current: [...CARD_ZONE], units: { cards: "installed first" } },
  { cue: 23, part: 0, current: [...CARD_ZONE], units: { cards: "first", ecom: "then" } },
  { cue: 32, part: 0, units: UNITS },
  { cue: 33, part: 0 },
];

// The one hands-on check: two stacks, each with its own database and logins. The adapters' names are blurred (generic names).
const ADAPTERS = ["humo-adapter", "uzcard-adapter"];

export const code: CodeStep[] = [
  {
    cue: 25,
    file: "terminal · ~/Documents/acquiring",
    lines: [
      "$ for r in platform contracts cards cards-infra ecom ecom-infra ecom-front; do",
      "    git clone git@github.com:khakimjanovich/$r.git",
      "  done",
      "$ cd cards-infra && scripts/install.sh    # the locked room first",
      "$ cd ../ecom-infra && scripts/install.sh  # then the shop",
    ],
    small: true,
    upTo: 3,
    beats: [{ cue: 26, highlight: [4, 5] }],
  },
  {
    cue: 28,
    file: "terminal · cards-infra",
    lines: [
      "$ docker compose -p cards ps --format 'table {{.Service}}\\t{{.State}}'",
      "SERVICE          STATE",
      "card-vault       running",
      "cards-ingress    running",
      "cards-keycloak   running",
      "cards-partner    running",
      "humo-adapter     running",
      "mailpit          running",
      "observability    running",
      "postgres         running",
      "uzcard-adapter   running",
    ],
    small: true,
    blur: ADAPTERS,
    upTo: 1,
    beats: [{ cue: 29, highlight: [5, 10] }],
  },
  {
    cue: 30,
    file: "terminal · ecom-infra",
    lines: [
      "$ docker compose -p ecom ps --format 'table {{.Service}}\\t{{.State}}'",
      "SERVICE          STATE",
      "app              running",
      "edge             running",
      "file-store       running",
      "front            running",
      "kafka            running",
      "keycloak         running",
      "mailpit          running",
      "observability    running",
      "postgres         running",
      "redis            running",
      "temporal         running",
    ],
    small: true,
    highlight: [3, 8, 11],
  },
];
