import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 4: PCI DSS scope, and why the card zone is separate.
// Why (cues 0–7) and the standard's ideas (8–15) on generic boxes; the real system on the map and diagram (16–34);
// Build it (35–51) on cards-infra's own files. Scheme and centre names are blurred.
const CARD_ZONE = ["frame", "card", "bin", "adapters", "cardsinfra"] as const;
const CENTRES = ["Uzcard", "Humo", "uzcard", "humo"];

const FLAT = { shop: [0, 0], orders: [1, 1], reporting: [2, 0], backup: [2, 2], laptop: [0, 2] } as const;
const FLAT_EDGES = [
  { from: "shop", to: "orders" },
  { from: "orders", to: "reporting" },
  { from: "orders", to: "backup" },
  { from: "laptop", to: "orders" },
] as const;
const CDE = { transmits: [1, 0], processes: [2, 0], stores: [1.5, 1] } as const;
const WALLED = { transmits: [2, 0], processes: [3, 0], stores: [2.5, 1.2], reporting: [0, 0], laptop: [0, 1.6] } as const;
const DOORS = { buyer: [0, 0], app: [0, 2], ingress: [1.6, 0], partnerdoor: [1.6, 2], card: [3, 0.6], cardsPostgres: [3, 2] } as const;
const DOOR_EDGES = [
  { from: "buyer", to: "ingress" },
  { from: "ingress", to: "card" },
  { from: "app", to: "partnerdoor" },
  { from: "partnerdoor", to: "card" },
  { from: "card", to: "cardsPostgres" },
] as const;
const ZONE_WALL = { label: "Card zone", from: [1.6, 0], to: [3, 2], tone: "wall" } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Why: the flat network.
  { cue: 0, layout: { shop: [0.5, 1], orders: [2.5, 1] }, edges: [{ from: "shop", to: "orders", label: "orders" }], packets: [{ from: "shop", to: "orders", label: "card number" }] },
  { cue: 1, layout: { shop: FLAT.shop, orders: FLAT.orders }, edges: [{ from: "shop", to: "orders" }], badges: { orders: "for refunds" } },
  { cue: 2, layout: FLAT, edges: [...FLAT_EDGES], packets: [{ from: "orders", to: "reporting", label: "PAN" }, { from: "orders", to: "backup", label: "PAN", delay: 40 }] },
  { cue: 3, layout: FLAT, edges: [...FLAT_EDGES], frames: [{ label: "Card numbers: everywhere", from: [0, 0], to: [2, 2], tone: "danger" }] },
  {
    cue: 4,
    layout: FLAT,
    edges: [...FLAT_EDGES],
    danger: ["shop", "reporting", "backup", "laptop"],
    badges: { shop: "rules listed", reporting: "logins named", backup: "logs 1 year", laptop: "changes controlled" },
    shake: { shop: 0.25, reporting: 0.45, backup: 0.6, laptop: 0.8 },
    frames: [{ label: "Card numbers: everywhere", from: [0, 0], to: [2, 2], tone: "danger" }],
  },
  {
    cue: 5,
    layout: FLAT,
    edges: [...FLAT_EDGES],
    danger: ["laptop"],
    crossed: ["laptop"],
    packets: [{ from: "orders", to: "laptop", label: "every card", delay: 50 }],
    frames: [{ label: "Card numbers: everywhere", from: [0, 0], to: [2, 2], tone: "danger" }],
  },
  { cue: 6, layout: { shop: [0, 0], reporting: [0, 2], laptop: [1, 2], orders: [2.8, 1] }, frames: [{ label: "Card data: one place", from: [2.8, 1], to: [2.8, 1], tone: "wall" }], accent: ["orders"] },
  {
    cue: 7,
    layout: { shop: [0, 0], reporting: [0, 2], laptop: [1, 2], orders: [2.8, 1] },
    frames: [{ label: "Card data: one place", from: [2.8, 1], to: [2.8, 1], tone: "wall" }],
    badges: { shop: "fewer", reporting: "fewer", orders: "all twelve" },
  },
  // How it works: the standard's ideas.
  { cue: 8, layout: { chd: [1, 1], sad: [2, 1] }, frames: [{ label: "Account data", from: [1, 1], to: [2, 1] }], badges: { chd: "PCI DSS v4.0.1" } },
  { cue: 9, layout: CDE, edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }], frames: [{ label: "CDE", from: [1, 0], to: [2, 1] }] },
  {
    cue: 10,
    layout: { ...CDE, connected: [0, 1] },
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }, { from: "connected", to: "stores", label: "unrestricted" }],
    frames: [{ label: "CDE", from: [0, 0], to: [2, 1] }],
    accent: ["connected"],
  },
  {
    cue: 11,
    layout: { ...CDE, connected: [0, 1], keycloak: [3, 0], vault: [3, 1], loki: [3, 2], dns: [2, 2] },
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }, { from: "connected", to: "stores" }],
    frames: [{ label: "CDE", from: [0, 0], to: [2, 1] }],
    badges: { vault: "security-impacting" },
    shake: { keycloak: 0.45, vault: 0.6, loki: 0.75, dns: 0.9 },
  },
  {
    cue: 12,
    layout: { ...CDE, connected: [0, 1], keycloak: [3, 0], vault: [3, 1], loki: [3, 2], dns: [2, 2], reporting: [0, 2], laptop: [1, 2] },
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }, { from: "connected", to: "stores" }],
    frames: [{ label: "Flat network: all in scope", from: [0, 0], to: [3, 2], tone: "danger" }],
  },
  {
    cue: 13,
    layout: WALLED,
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }, { from: "reporting", to: "transmits", label: "denied", broken: true }],
    frames: [{ label: "Network security control", from: [2, 0], to: [3, 1.2], tone: "wall" }],
  },
  {
    cue: 14,
    layout: WALLED,
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }],
    frames: [{ label: "Network security control", from: [2, 0], to: [3, 1.2], tone: "wall" }],
    badges: { stores: "smaller scope", reporting: "out of scope" },
  },
  {
    cue: 15,
    layout: WALLED,
    edges: [{ from: "transmits", to: "processes" }, { from: "processes", to: "stores" }, { from: "laptop", to: "stores", broken: true }],
    packets: [{ from: "laptop", to: "stores", label: "compromised", delay: 40, stopAt: 0.55 }],
    frames: [{ label: "Network security control", from: [2, 0], to: [3, 1.2], tone: "wall" }],
    danger: ["laptop"],
  },
  // The real system: the card zone shares nothing.
  {
    cue: 18,
    layout: { app: [0, 1], postgres: [0, 0], vault: [0, 2], card: [2, 1], cardsPostgres: [3, 0], cardsVault: [3, 1], cardsKeycloak: [3, 2], cardsObserve: [2, 2] },
    edges: [{ from: "app", to: "postgres" }, { from: "app", to: "vault" }, { from: "card", to: "cardsPostgres" }, { from: "card", to: "cardsVault" }, { from: "card", to: "cardsKeycloak" }],
    frames: [{ label: "Card zone", from: [2, 0], to: [3, 2], tone: "wall" }],
    badges: { app: "ecom" },
  },
  {
    cue: 19,
    layout: { app: [0, 1], postgres: [0, 0], vault: [0, 2], card: [2, 1], cardsPostgres: [3, 0], cardsVault: [3, 1], cardsKeycloak: [3, 2], cardsObserve: [2, 2] },
    edges: [{ from: "app", to: "postgres" }, { from: "app", to: "vault" }, { from: "card", to: "cardsPostgres" }, { from: "card", to: "cardsVault" }, { from: "card", to: "cardsKeycloak" }, { from: "card", to: "vault", label: "shared", broken: true }],
    frames: [{ label: "Card zone", from: [2, 0], to: [3, 2], tone: "wall" }],
    danger: ["vault"],
    badges: { vault: "in scope" },
  },
  // Two doors.
  { cue: 20, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress", "partnerdoor"] },
  { cue: 21, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["ingress"], packets: [{ from: "buyer", to: "ingress", label: "card frame" }, { from: "ingress", to: "card", label: "card frame", delay: 55 }] },
  { cue: 22, layout: DOORS, edges: [...DOOR_EDGES], frames: [ZONE_WALL], accent: ["partnerdoor"], packets: [{ from: "app", to: "partnerdoor", label: "mTLS" }, { from: "partnerdoor", to: "card", label: "mTLS", delay: 55 }] },
  {
    cue: 23,
    layout: { ...DOORS, attacker: [0, 1] },
    edges: [...DOOR_EDGES],
    frames: [ZONE_WALL],
    badges: { cardsPostgres: "no published port" },
    packets: [{ from: "attacker", to: "cardsPostgres", label: "SELECT", delay: 30, stopAt: 0.3 }],
  },
  // Who judges it.
  { cue: 33, layout: { zone: [0.6, 1], assessor: [2.6, 1] }, edges: [{ from: "assessor", to: "zone", label: "judges" }], accent: ["assessor"] },
  { cue: 34, layout: { zone: [0.6, 1], assessor: [2.6, 1] }, edges: [{ from: "assessor", to: "zone" }], badges: { zone: "bank's assessment" } },
];

export const map: BuildMapStep[] = [
  { cue: 16, part: 1, current: [...CARD_ZONE], units: { cards: "CDE" } },
  { cue: 17, part: 1, current: [...CARD_ZONE], units: { cards: "card zone" } },
  { cue: 24, part: 1, current: [...CARD_ZONE], units: { cards: "CDE", ecom: "not in CDE" } },
  { cue: 25, part: 1, current: ["frame", "payment", "procport"], units: { cards: "CDE", ecom: "connected-to · security-impacting" } },
  { cue: 35, part: 1, current: [...CARD_ZONE], units: { cards: "card zone" } },
];

export const code: CodeStep[] = [
  {
    cue: 27,
    file: "PCI DSS v4.0.1 · Table 1",
    table: {
      columns: ["Goal", "Requirements"],
      rows: [
        ["Build and maintain a secure network and systems", "1 Network security controls · 2 Secure configurations"],
        ["Protect account data", "3 Protect stored account data · 4 Strong cryptography in transmission"],
        ["Maintain a vulnerability management program", "5 Malicious software · 6 Secure systems and software"],
        ["Implement strong access control measures", "7 Need to know · 8 Identify and authenticate · 9 Physical access"],
        ["Regularly monitor and test networks", "10 Log and monitor · 11 Test security regularly"],
        ["Maintain an information security policy", "12 Policies and programs"],
      ],
    },
  },
  {
    cue: 29,
    file: "Who does what · PCI DSS v4.0.1",
    table: {
      columns: ["Product", "The bank", "Shared"],
      rows: [
        [
          "Card numbers sealed by Vault Transit before they reach Postgres (Req 3)",
          "Physical security of the host and its media (Req 9)",
          "Vault opens with 3 of 5 unseal shares; the bank makes sure no one holds two (3.7.6)",
        ],
      ],
    },
    upTo: 0,
    beats: [{ cue: 30 }],
  },
  {
    cue: 36,
    file: "cards-infra/docs/install-server.md",
    at: [78, null, 80, 82, 83, 84, 85, 86, 87, 88, 89],
    lines: [
      "Every flow the unit needs. Anything else, in or out, the",
      "unit doesn't use; the bank's firewalls may refuse it.",
      "| Direction | Port | From / to | Purpose |",
      "| in  | <public-port> | payers' browsers | cards-ingress",
      "| in  | <door-port> | each caller's host only | cards-partner",
      "| in  | remote admin | the bank's jump host only | …",
      "| out | the scheme's port | Uzcard, over the VPN | …",
      "| out | the scheme's ports | Humo's addresses | …",
      "| out | 443/tcp | ghcr.io, registry-1.docker.io, … | images",
      "| out | the relay's port | the bank's SMTP relay | alerts",
      "| out | 443/tcp or 22/tcp | github.com | release checkout",
    ],
    highlight: [1, 2],
    blur: CENTRES,
    beats: [
      { cue: 37, highlight: [4, 5, 6] },
      { cue: 38, highlight: [7, 8, 9, 10, 11] },
    ],
  },
  {
    cue: 39,
    file: "cards-infra/docker-compose.yml",
    at: [157, 166, 182, 188, null, 68, 90, 117, 121, 126, 130, null, 32, 42],
    lines: [
      "cards-ingress:",
      "  ports: [\"${CARDS_INGRESS_PUBLISH:?…}:8443\"]",
      "cards-partner:",
      "  ports: [\"${CARDS_PARTNER_PUBLISH:?…}:8443\"]",
      "…",
      "cards-keycloak:",
      "  ports: [\"127.0.0.1:8181:8443\"] # the console, from this host only",
      "mailpit:",
      "  ports: [\"127.0.0.1:8026:8025\"] # from this host only",
      "observability:",
      "  ports: [\"127.0.0.1:3031:3000\"] # from this host only; …",
      "…",
      "postgres:",
      "  # No published port: card data is read through card-vault only.",
    ],
    small: true,
    upTo: 4,
    highlight: [2, 4],
    beats: [
      { cue: 40, upTo: 11, highlight: [7, 9, 11] },
      { cue: 41, upTo: 14, highlight: [14] },
    ],
  },
  {
    cue: 42,
    file: "cards-infra/ingress/default.conf.template",
    at: [61, 65, 69, 73, 78, null, 89, 90, 91],
    lines: [
      "location ~ \"^/entry/[0-9a-f-]{36}$\" {",
      "location = /frame/frame.js {",
      "location = /frame/frame.css {",
      "location = /entry/csp-report {",
      "location ~ \"^/entry/v1/sessions/[0-9a-f-]{36}/(card|code)$\" {",
      "…",
      "location / {",
      "  return 404;",
      "}",
    ],
    small: true,
    highlight: [7, 8],
    beats: [{ cue: 43, highlight: [1, 2, 3, 4, 5] }],
  },
  {
    cue: 44,
    file: "terminal · cards-infra",
    lines: [
      "$ docker compose -p cards ps --format 'table {{.Service}}\\t{{.Ports}}'",
      "SERVICE          PORTS",
      "cards-ingress    127.0.0.1:8443->8443/tcp",
      "cards-partner    127.0.0.1:9443->8443/tcp",
      "cards-keycloak   127.0.0.1:8181->8443/tcp",
      "observability    127.0.0.1:3031->3000/tcp",
      "postgres         5432/tcp",
      "…",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 45, highlight: [3, 4, 5, 6, 7] }],
  },
  {
    cue: 46,
    file: "terminal · cards-infra",
    lines: [
      "$ CA=\"$(mkcert -CAROOT)/rootCA.pem\"",
      "$ curl -s --cacert \"$CA\" -o /dev/null -w '%{http_code}\\n' \\",
      "    https://cards.localhost:8443/frame/frame.js",
      "200",
      "$ curl -s --cacert \"$CA\" -o /dev/null -w '%{http_code}\\n' \\",
      "    https://cards.localhost:8443/actuator/health",
      "404",
      "$ scripts/install.sh check",
    ],
    small: true,
    upTo: 6,
    beats: [
      { cue: 47, upTo: 7, highlight: [4, 7] },
      { cue: 48, upTo: 8, highlight: [8] },
    ],
  },
  {
    cue: 49,
    file: "cards-infra/docs/install-server.md",
    at: [368, 372, 378],
    table: {
      columns: ["Req.", "Product", "The bank", "Shared"],
      rows: [
        [
          "3 Protect stored account data",
          "Card numbers sealed with Vault Transit keys … before they reach Postgres (3.5.1)",
          "Keyholder selection …; the key-management procedures and cryptoperiods (3.6.1, 3.7.4)",
          "Dual control and split knowledge (3.7.6): the product enforces three of five shares; the bank makes sure no person holds two",
        ],
        ["9 Physical security", "Nothing", "All of it, including backup media (9.4.1)", "—"],
      ],
    },
  },
];
