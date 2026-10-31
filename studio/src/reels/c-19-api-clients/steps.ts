import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 19: the cleaner's own key. House keys (cues 1–2), an API client for the server (3–5),
// secret for a token (6), rotation (7), the owner's login untouched (8).
const HOUSE = { m45Owner: [0, 1], m45House: [1.5, 1], m45Cleaner: [3, 1] } as const;
const CREATE = { shop: [0, 1], m45Client: [1.5, 1], merchant: [3, 1], m45Db: [1.5, 2.2] } as const;
const TOKEN = { merchant: [0, 1], m45Login: [1.5, 0.2], m45PayApi: [3, 1] } as const;
const TOKEN_EDGES = [{ from: "merchant", to: "m45Login" }, { from: "merchant", to: "m45PayApi" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { merchant: [1.5, 1] }, badges: { merchant: "log in with?" } },
  {
    cue: 1,
    layout: HOUSE,
    edges: [{ from: "m45Owner", to: "m45House", label: "own keys" }, { from: "m45Cleaner", to: "m45House", broken: true }],
    badges: { m45Owner: "never handed" },
  },
  {
    cue: 2,
    layout: HOUSE,
    edges: [{ from: "m45Owner", to: "m45House", label: "own keys" }, { from: "m45Cleaner", to: "m45House", label: "own key" }],
    accent: ["m45Cleaner"],
    badges: { m45Cleaner: "change anytime" },
  },
  { cue: 3, layout: { merchant: [0.5, 1], m45Client: [2.5, 1] }, edges: [{ from: "merchant", to: "m45Client", label: "logs in as" }], accent: ["m45Client"] },
  {
    cue: 4,
    layout: { shop: CREATE.shop, m45Client: CREATE.m45Client },
    edges: [{ from: "shop", to: "m45Client" }],
    packets: [{ from: "shop", to: "m45Client", label: "create" }],
    badges: { shop: "active only" },
  },
  {
    cue: 5,
    layout: CREATE,
    edges: [{ from: "shop", to: "m45Client" }, { from: "m45Client", to: "merchant" }, { from: "m45Client", to: "m45Db", broken: true }],
    packets: [{ from: "m45Client", to: "merchant", label: "secret" }],
    badges: { m45Client: "shown once" },
  },
  {
    cue: 6,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [
      { from: "merchant", to: "m45Login", label: "id + secret" },
      { from: "m45Login", to: "merchant", label: "token", delay: 45 },
      { from: "merchant", to: "m45PayApi", label: "token", delay: 90 },
    ],
    badges: { m45PayApi: "token only" },
  },
  {
    cue: 7,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [{ from: "merchant", to: "m45Login", label: "old secret", stopAt: 0.6 }, { from: "merchant", to: "m45Login", label: "new secret", delay: 60 }],
    badges: { m45Login: "rotated" },
  },
  {
    cue: 8,
    layout: { ...TOKEN, m45Owner: [1.5, 2.1] },
    edges: [...TOKEN_EDGES, { from: "m45Owner", to: "m45Login", label: "own login" }],
    accent: ["m45Owner"],
    badges: { m45Owner: "untouched" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 9, part: 4, current: ["merchant", "keycloak", "partner"], units: { ecom: "next: the team" } },
];
