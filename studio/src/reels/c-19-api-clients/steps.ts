import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 19: API clients. One shop carries it: Bekzod connects Malika's website to the bank.
// "Just use my password" (0–1), the bridge from lessons 18 and 1 (2), why not (3–6), the API clients page (7–12),
// a new client, its secret shown once (13–20), never kept by ecom (21–22), id + secret → token (23–27),
// Thursday's leak and rotation (28–36), what a separate key keeps (37–39), next (40).
const CREATE = { shop: [0, 1], m45Client: [1.5, 1], merchant: [3, 1], m45Db: [1.5, 2.2] } as const;
const CREATE_EDGES = [{ from: "shop", to: "m45Client" }, { from: "m45Client", to: "merchant" }, { from: "m45Client", to: "m45Db", broken: true }] as const;
const TOKEN = { merchant: [0, 1], m45Login: [1.5, 0.2], m45PayApi: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "merchant", to: "m45Login" }, { from: "merchant", to: "m45PayApi" }] as const;
const PEOPLE = { ...TOKEN, m45Owner: [1.5, 2.1] } as const;
const SHARED = { m45Owner: [0, 1], merchant: [1.5, 1], m45PayApi: [3, 1] } as const;
const SHARED_EDGES = [{ from: "m45Owner", to: "merchant", label: "password" }, { from: "merchant", to: "m45PayApi" }] as const;
const LEAK = { merchant: [0, 1], m45Client: [1.5, 1], attacker: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Tuesday morning: "just use my password".
  { cue: 0, layout: SHARED, edges: [...SHARED_EDGES], packets: [{ from: "m45Owner", to: "merchant", label: "Malika's password" }], badges: { merchant: "Tue morning" } },
  { cue: 1, layout: SHARED, edges: [...SHARED_EDGES], badges: { m45Owner: "easier", merchant: "for a month" } },
  // Why a server must not log in as a person.
  { cue: 3, layout: { merchant: [0.5, 1], attacker: [2.5, 1] }, edges: [{ from: "merchant", to: "attacker", label: "shared code store" }], packets: [{ from: "merchant", to: "attacker", label: "password" }], danger: ["attacker"] },
  { cue: 4, layout: SHARED, edges: [...SHARED_EDGES], crossed: ["m45Owner"], badges: { m45Owner: "must change" } },
  {
    cue: 5,
    layout: SHARED,
    edges: [...SHARED_EDGES],
    packets: [0, 1, 2].map((k) => ({ from: "merchant" as const, to: "m45PayApi" as const, label: "Malika?", delay: k * 30 })),
    badges: { m45PayApi: "who clicked?" },
  },
  { cue: 6, layout: SHARED, edges: [{ from: "m45Owner", to: "merchant", label: "password", broken: true }, { from: "merchant", to: "m45PayApi" }], badges: { merchant: "never as a person" } },
  // New client: a login for a machine.
  { cue: 13, layout: { shop: CREATE.shop, m45Client: CREATE.m45Client }, edges: [{ from: "shop", to: "m45Client" }], packets: [{ from: "shop", to: "m45Client", label: "create" }], badges: { m45Client: "a machine's login" } },
  // ecom keeps the id, never the secret.
  { cue: 21, layout: CREATE, edges: [...CREATE_EDGES], badges: { m45Db: "id only" } },
  { cue: 22, layout: { ...CREATE, attacker: [3, 2.2] }, edges: [...CREATE_EDGES, { from: "attacker", to: "m45Db" }], danger: ["attacker"], badges: { m45Db: "nothing to read" } },
  // id + secret → a short-lived token → the payments API.
  { cue: 23, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "m45Login", label: "id + secret" }] },
  { cue: 24, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "m45Login", to: "merchant", label: "token" }], badges: { merchant: "expires soon" } },
  { cue: 25, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "m45PayApi", label: "token" }], badges: { m45PayApi: "token only" } },
  { cue: 26, layout: TOKEN, edges: [...TOKEN_EDGES], accent: ["m45PayApi"], badges: { m45PayApi: "machine + merchant role" } },
  {
    cue: 27,
    layout: PEOPLE,
    edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45PayApi", broken: true }],
    packets: [{ from: "m45Owner", to: "m45PayApi", label: "person", stopAt: 0.6 }],
    badges: { m45Owner: "not even Malika" },
  },
  // Thursday: the secret lands in a group chat.
  { cue: 28, layout: LEAK, edges: [{ from: "merchant", to: "m45Client" }, { from: "m45Client", to: "attacker" }], danger: ["attacker"], badges: { m45Client: "Thu", attacker: "group chat" } },
  { cue: 29, layout: LEAK, edges: [{ from: "merchant", to: "m45Client" }, { from: "m45Client", to: "attacker" }], danger: ["attacker"], badges: { m45Client: "rotate", attacker: "group chat" } },
  {
    cue: 34,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [{ from: "merchant", to: "m45Login", label: "old secret", stopAt: 0.6 }, { from: "merchant", to: "m45Login", label: "new secret", delay: 60 }],
    badges: { m45Login: "rotation" },
  },
  {
    cue: 35,
    layout: { attacker: [0, 1], m45Login: [2, 1] },
    edges: [{ from: "attacker", to: "m45Login" }],
    packets: [{ from: "attacker", to: "m45Login", label: "old secret", stopAt: 0.6 }],
    danger: ["attacker"],
    badges: { attacker: "from the chat", m45Login: "refused" },
  },
  { cue: 36, layout: PEOPLE, edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45Login", label: "own login" }], accent: ["m45Owner"], badges: { m45Owner: "untouched" } },
  // What a separate key keeps.
  { cue: 37, layout: PEOPLE, edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45Login", label: "own login" }], accent: ["m45Owner"], badges: { m45Owner: "private" } },
  { cue: 38, layout: LEAK, edges: [{ from: "merchant", to: "m45Client" }, { from: "m45Client", to: "attacker", broken: true }], accent: ["m45Client"], badges: { m45Client: "one click" } },
  { cue: 39, layout: CREATE, edges: [...CREATE_EDGES], accent: ["m45Db"], badges: { m45Db: "nothing to leak" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 2, part: 4, current: ["merchant", "payment", "keycloak"] },
  { cue: 40, part: 4, current: ["merchant", "keycloak", "partner"], units: { ecom: "next: the team" } },
];

// The portal: locked yesterday, open today; a new client, the list, Thursday's rotation.
const DIR = "screens/c-19-api-clients";
const WINDOW: [number, number, number, number] = [380, 30, 680, 425];
const LEFT: [number, number, number, number] = [240, 40, 800, 500];
export const screens: ScreenStep[] = [
  {
    cue: 7,
    src: `${DIR}/locked.png`,
    title: "Merchant portal · API clients",
    region: [0, 0, 1440, 900],
    focus: [[6, 322, 220, 30]],
    beats: [
      { cue: 8, region: [440, 60, 800, 500], focus: [[600, 100, 480, 180]] },
      { cue: 9, region: [440, 60, 800, 500], focus: [[697, 194, 287, 26], [620, 230, 440, 41]] },
    ],
  },
  {
    cue: 10,
    src: `${DIR}/empty.png`,
    title: "Merchant portal · API clients",
    region: [240, 40, 1200, 750],
    beats: [
      { cue: 11, region: LEFT, focus: [[260, 119, 465, 20]] },
      { cue: 12, region: [640, 40, 800, 500], focus: [[1291, 103, 129, 36]] },
    ],
  },
  {
    cue: 14,
    src: `${DIR}/new-client.png`,
    title: "Merchant portal · API clients",
    region: WINDOW,
    focus: [[500, 45, 440, 40]],
    beats: [
      { cue: 15, region: WINDOW, focus: [[516, 190, 408, 150]] },
      { cue: 16, region: WINDOW, focus: [[516, 100, 408, 80]] },
    ],
  },
  { cue: 17, src: `${DIR}/new-client-stored.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 340, 260, 36]] },
  { cue: 19, src: `${DIR}/list.png`, title: "Merchant portal · API clients", region: LEFT, focus: [[263, 200, 400, 40]], beats: [{ cue: 20, region: LEFT, focus: [[261, 160, 780, 101]] }] },
  { cue: 30, src: `${DIR}/list.png`, title: "Merchant portal · API clients", region: [640, 40, 800, 500], focus: [[1270, 219, 129, 30]] },
  { cue: 31, src: `${DIR}/rotate.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 105, 408, 45]], beats: [{ cue: 32, region: WINDOW, focus: [[800, 165, 130, 36]] }] },
  { cue: 33, src: `${DIR}/new-secret.png`, title: "Merchant portal · API clients", region: WINDOW, focus: [[516, 100, 408, 260]] },
];
