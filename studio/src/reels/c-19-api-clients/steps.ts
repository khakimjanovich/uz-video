import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 19: the cleaner's own key. The owner's password in a server (0–7), house keys (8–10), how it works (11–25),
// the product (26–44), what it protects (45–50).
const HOUSE = { m45Owner: [0, 1], m45House: [1.5, 1], m45Cleaner: [3, 1] } as const;
const CREATE = { shop: [0, 1], m45Client: [1.5, 1], merchant: [3, 1], m45Db: [1.5, 2.2] } as const;
const CREATE_EDGES = [{ from: "shop", to: "m45Client" }, { from: "m45Client", to: "merchant" }, { from: "m45Client", to: "m45Db", broken: true }] as const;
const TOKEN = { merchant: [0, 1], m45Login: [1.5, 0.2], m45PayApi: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "merchant", to: "m45Login" }, { from: "merchant", to: "m45PayApi" }] as const;
const PEOPLE = { ...TOKEN, m45Owner: [1.5, 2.1] } as const;
const SHARED = { m45Owner: [0, 1], merchant: [1.5, 1], m45PayApi: [3, 1] } as const;
const SHARED_EDGES = [{ from: "m45Owner", to: "merchant", label: "password" }, { from: "merchant", to: "m45PayApi" }] as const;
const LEAK = { merchant: [0, 1], m45Client: [1.5, 1], attacker: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { merchant: [1.5, 1] }, badges: { merchant: "log in with?" } },
  { cue: 4, layout: SHARED, edges: [...SHARED_EDGES], packets: [{ from: "m45Owner", to: "merchant", label: "portal password" }], danger: ["m45Owner"] },
  { cue: 5, layout: { merchant: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "merchant", to: "attacker", label: "shared code store" }], packets: [{ from: "merchant", to: "attacker", label: "password" }], danger: ["attacker"] },
  { cue: 6, layout: SHARED, edges: [...SHARED_EDGES], crossed: ["m45Owner"], badges: { m45Owner: "must change" } },
  {
    cue: 7,
    layout: SHARED,
    edges: [...SHARED_EDGES],
    packets: [0, 1, 2].map((k) => ({ from: "merchant" as const, to: "m45PayApi" as const, label: "the owner?", delay: k * 30 })),
    badges: { m45PayApi: "who clicked?" },
  },
  { cue: 8, layout: HOUSE, edges: [{ from: "m45Owner", to: "m45House", label: "own keys" }, { from: "m45Cleaner", to: "m45House", broken: true }], badges: { m45Owner: "never handed" } },
  { cue: 9, layout: HOUSE, edges: [{ from: "m45Owner", to: "m45House", label: "own keys" }, { from: "m45Cleaner", to: "m45House", label: "own key" }], accent: ["m45Cleaner"], badges: { m45Cleaner: "change anytime" } },
  { cue: 10, layout: { merchant: [0.5, 1], m45Client: [2.5, 1] }, edges: [{ from: "merchant", to: "m45Client", label: "own key" }], accent: ["m45Client"] },
  { cue: 12, layout: { shop: CREATE.shop, m45Client: CREATE.m45Client }, edges: [{ from: "shop", to: "m45Client" }], packets: [{ from: "shop", to: "m45Client", label: "create" }], badges: { m45Client: "a machine's login" } },
  { cue: 13, layout: { shop: CREATE.shop, m45Client: CREATE.m45Client }, edges: [{ from: "shop", to: "m45Client" }], badges: { m45Client: "id + secret" } },
  { cue: 14, layout: CREATE, edges: [...CREATE_EDGES], packets: [{ from: "m45Client", to: "merchant", label: "secret" }], badges: { m45Client: "shown once" } },
  { cue: 15, layout: CREATE, edges: [...CREATE_EDGES], badges: { m45Db: "id only" } },
  { cue: 16, layout: { ...CREATE, attacker: [3, 2.2] }, edges: [...CREATE_EDGES, { from: "attacker", to: "m45Db" }], danger: ["attacker"], badges: { m45Db: "nothing to read" } },
  { cue: 17, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "m45Login", label: "id + secret" }] },
  { cue: 18, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "m45Login", to: "merchant", label: "token" }], badges: { merchant: "expires soon" } },
  { cue: 19, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "m45PayApi", label: "token" }], badges: { m45PayApi: "token only" } },
  { cue: 20, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["m45PayApi"], badges: { m45PayApi: "machine + merchant role" } },
  {
    cue: 21,
    layout: PEOPLE,
    edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45PayApi", broken: true }],
    packets: [{ from: "m45Owner", to: "m45PayApi", label: "person", stopAt: 0.6 }],
  },
  { cue: 22, layout: LEAK, edges: [{ from: "merchant", to: "m45Client" }, { from: "m45Client", to: "attacker" }], danger: ["attacker"], badges: { m45Client: "rotate" } },
  {
    cue: 23,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [{ from: "merchant", to: "m45Login", label: "old secret", stopAt: 0.6 }, { from: "merchant", to: "m45Login", label: "new secret", delay: 60 }],
    badges: { m45Login: "rotation" },
  },
  { cue: 24, layout: PEOPLE, edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45Login", label: "own login" }], accent: ["m45Owner"], badges: { m45Owner: "untouched" } },
  { cue: 25, layout: { shop: CREATE.shop, m45Client: CREATE.m45Client }, edges: [{ from: "shop", to: "m45Client" }], badges: { shop: "active only" } },
  {
    cue: 39,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [{ from: "merchant", to: "m45Login", label: "id + secret" }, { from: "m45Login", to: "merchant", label: "token", delay: 45 }, { from: "merchant", to: "m45PayApi", label: "token", delay: 90 }],
    accent: ["m45PayApi"],
  },
  { cue: 44, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "m45Login", label: "old secret", stopAt: 0.6 }], danger: ["merchant"], badges: { m45Login: "refused" } },
  { cue: 45, layout: SHARED, edges: [...SHARED_EDGES], badges: { merchant: "protect what?" } },
  { cue: 46, layout: SHARED, edges: [...SHARED_EDGES], danger: ["m45Owner"], badges: { m45PayApi: "who clicked?" } },
  { cue: 47, layout: PEOPLE, edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45Login", label: "own login" }], accent: ["m45Owner"], badges: { m45Owner: "private" } },
  { cue: 48, layout: LEAK, edges: [{ from: "merchant", to: "m45Client" }, { from: "m45Client", to: "attacker", broken: true }], accent: ["m45Client"], badges: { m45Client: "one click" } },
  { cue: 49, layout: CREATE, edges: [...CREATE_EDGES], accent: ["m45Db"], badges: { m45Db: "nothing to leak" } },
  { cue: 50, layout: HOUSE, edges: [{ from: "m45Owner", to: "m45House" }, { from: "m45Cleaner", to: "m45House" }], accent: ["m45Cleaner"], badges: { m45Owner: "never touched" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["admin", "partner"] },
  { cue: 2, part: 4, current: ["merchant", "payment"] },
  { cue: 3, part: 4, current: ["merchant", "keycloak"] },
  { cue: 11, part: 4, current: ["merchant", "keycloak", "partner", "payment"], units: { ecom: "API clients" } },
  { cue: 51, part: 4, current: ["merchant", "keycloak", "partner"], units: { ecom: "next: the team" } },
];

const DIR = "screens/c-19-api-clients";
const WINDOW: [number, number, number, number] = [380, 30, 680, 425];
const LEFT: [number, number, number, number] = [240, 40, 800, 500];
export const screens: ScreenStep[] = [
  {
    cue: 27,
    src: `${DIR}/locked.png`,
    title: "Merchant portal · API clients",
    region: [0, 0, 1440, 900],
    focus: [[6, 322, 220, 30]],
    beats: [
      { cue: 28, region: [440, 60, 800, 500], focus: [[600, 100, 480, 180]] },
      { cue: 29, region: [440, 60, 800, 500], focus: [[697, 194, 287, 26], [620, 230, 440, 41]] },
    ],
  },
  {
    cue: 30,
    src: `${DIR}/empty.png`,
    title: "Merchant portal · API clients",
    region: [240, 40, 1200, 750],
    beats: [
      { cue: 31, region: LEFT, focus: [[260, 119, 465, 20]] },
      { cue: 32, region: [640, 40, 800, 500], focus: [[1291, 103, 129, 36]] },
    ],
  },
  {
    cue: 33,
    src: `${DIR}/new-client.png`,
    title: "Merchant portal · API clients",
    region: WINDOW,
    focus: [[500, 45, 440, 40]],
    beats: [
      { cue: 34, region: WINDOW, focus: [[516, 190, 408, 150]] },
      { cue: 35, region: WINDOW, focus: [[516, 100, 408, 80]] },
    ],
  },
  { cue: 36, src: `${DIR}/new-client-stored.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 340, 260, 36]] },
  { cue: 37, src: `${DIR}/list.png`, title: "Merchant portal · API clients", region: LEFT, focus: [[263, 200, 400, 40]], beats: [{ cue: 38, region: LEFT, focus: [[261, 160, 780, 101]] }] },
  { cue: 40, src: `${DIR}/list.png`, title: "Merchant portal · API clients", region: [640, 40, 800, 500], focus: [[1270, 219, 129, 30]] },
  { cue: 41, src: `${DIR}/rotate.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 105, 408, 45]], beats: [{ cue: 42, region: WINDOW, focus: [[800, 165, 130, 36]] }] },
  { cue: 43, src: `${DIR}/new-secret.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 100, 408, 260]] },
];
