import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 6: every setting, and no guessing. One story carries it: Timur's install stops on one missing fraud limit.
// The stopped install (cues 0–3), the bridge from lesson 5 (4–5), what a guessed default costs (6–14),
// one locked store and three kinds of value (15–21), handed its own settings or refuse to start (22–26),
// the bank's decisions and the card zone's own settings (27–34), the install runs (35–37), one service with nothing set (38–44),
// what it protects (45–47), one minute against years (48–49), next (50).
const KINDS = { vault: [0.4, 1], m01KindSystem: [2.6, 0], m01KindSecret: [2.6, 1], m01KindBank: [2.6, 2] } as const;
const KIND_EDGES = (["m01KindSystem", "m01KindSecret", "m01KindBank"] as const).map((from) => ({ from, to: "vault" as const }));
const STORE = { m01Operator: [0.3, 1], vault: [2.7, 1] } as const;
const HAND = { vault: [0.3, 1], m01Service: [2.7, 1] } as const;
const HAND_EDGE = [{ from: "vault", to: "m01Service" }] as const;
const BANK = { bank: [0, 1], vault: [1.5, 1], m01Service: [3, 1] } as const;
const BANK_EDGES = [{ from: "bank", to: "vault" }, { from: "vault", to: "m01Service" }] as const;
const ZONE = {
  m01CardZone: [0.2, 1],
  m01Callers: [1.8, 0],
  m01Websites: [1.8, 1],
  m01FraudLimits: [1.8, 2],
  m01CardKeep: [3.1, 0],
  m01KeyChange: [3.1, 1],
  m01Cleanup: [3.1, 2],
} as const;
const CHOOSES = { label: "The bank chooses", from: [1.8, 0], to: [3.1, 2] } as const;
const INSTALL = { m01Operator: [0, 1], vault: [1.5, 1], m01CardZone: [3, 1] } as const;
const INSTALL_EDGES = [{ from: "m01Operator", to: "vault" }, { from: "vault", to: "m01CardZone" }] as const;
const MESSAGE = { m01Service: [0.4, 1], m01Message: [2.6, 1] } as const;
const MESSAGE_EDGE = [{ from: "m01Service", to: "m01Message" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Thursday night: the install stops on one missing value.
  { cue: 0, layout: INSTALL, edges: [...INSTALL_EDGES], packets: [{ from: "m01Operator", to: "vault", label: "install" }], badges: { m01Operator: "Timur · Thu night" } },
  {
    cue: 1,
    layout: INSTALL,
    edges: [...INSTALL_EDGES],
    packets: [{ from: "vault", to: "m01CardZone", label: "install", stopAt: 0.6 }],
    danger: ["m01CardZone"],
    badges: { m01CardZone: "stops before running" },
  },
  { cue: 2, layout: INSTALL, edges: [...INSTALL_EDGES], danger: ["m01CardZone"], badges: { vault: "one fraud limit missing" } },
  {
    cue: 3,
    layout: { m01CardZone: [0.4, 1], m01Message: [2.6, 1] },
    edges: [{ from: "m01CardZone", to: "m01Message" }],
    danger: ["m01CardZone"],
    badges: { m01Message: "fraud limit · which caller" },
  },
  // What a guessed default costs.
  { cue: 6, layout: { m01Operator: [0.5, 1], m01Default: [2.5, 1] }, badges: { m01Operator: "Timur", m01Default: "a default?" } },
  { cue: 7, layout: { m01Default: [1.5, 1] }, badges: { m01Default: "what it costs" } },
  { cue: 8, layout: { m01Service: [0.4, 1], m01File: [2.6, 1] }, edges: [{ from: "m01File", to: "m01Service" }], badges: { m01File: "timeout: 30 seconds" } },
  { cue: 9, layout: { m01File: [0.4, 1], m01Prod: [2.6, 1] }, edges: [{ from: "m01File", to: "m01Prod" }], packets: [{ from: "m01File", to: "m01Prod", label: "30 seconds" }], badges: { m01Prod: "nobody set it" } },
  { cue: 10, layout: { m01Service: [0.4, 1], network: [2.6, 1] }, edges: [{ from: "m01Service", to: "network" }], badges: { network: "40 seconds" } },
  {
    cue: 11,
    layout: { shop: [0, 1], m01Service: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m01Service", to: "shop" }, { from: "m01Service", to: "network" }],
    packets: [{ from: "m01Service", to: "shop", label: "failed" }],
    danger: ["m01Service"],
    badges: { m01Service: "gave up at 30", shop: "Malika's site" },
  },
  {
    cue: 12,
    layout: { network: [0.4, 1], buyer: [2.6, 1] },
    edges: [{ from: "network", to: "buyer" }],
    packets: [{ from: "network", to: "buyer", label: "yes" }],
    danger: ["buyer"],
    badges: { buyer: "money gone" },
  },
  { cue: 13, layout: { m01Default: [0.5, 1], m01Prod: [2.5, 1] }, edges: [{ from: "m01Default", to: "m01Prod" }], danger: ["m01Default"], badges: { m01Default: "looked safe" } },
  // No defaults; one locked store.
  { cue: 14, layout: { m01Service: [0.5, 1], m01Default: [2.5, 1] }, crossed: ["m01Default"], badges: { m01Default: "none, ever" } },
  { cue: 15, layout: { vault: [1.5, 1] }, accent: ["vault"], badges: { vault: "settings and secrets" } },
  { cue: 16, layout: KINDS, edges: KIND_EDGES },
  { cue: 17, layout: KINDS, edges: KIND_EDGES, accent: ["m01KindSystem"], badges: { m01KindSystem: "who listens where" } },
  { cue: 18, layout: KINDS, edges: KIND_EDGES, accent: ["m01KindSecret"], badges: { m01KindSecret: "passwords · keys" } },
  { cue: 19, layout: { m01File: [0.5, 1], vault: [2.5, 1] }, crossed: ["m01File"], badges: { m01File: "no password here", vault: "ships none" } },
  { cue: 20, layout: KINDS, edges: KIND_EDGES, accent: ["m01KindBank"], badges: { m01KindBank: "network address · login" } },
  { cue: 21, layout: STORE, edges: [{ from: "m01Operator", to: "vault" }], packets: [{ from: "m01Operator", to: "vault", label: "typed once" }], badges: { m01Operator: "Timur" } },
  // Handed its own settings, or refuse to start.
  { cue: 22, layout: HAND, edges: [...HAND_EDGE], packets: [{ from: "vault", to: "m01Service", label: "private file" }], badges: { m01Service: "only it can read" } },
  { cue: 23, layout: HAND, edges: [...HAND_EDGE], badges: { m01Service: "names, never values" } },
  { cue: 24, layout: HAND, edges: [...HAND_EDGE], packets: [{ from: "vault", to: "m01Service", label: "settings", stopAt: 0.7 }], danger: ["m01Service"], badges: { m01Service: "refuses to start" } },
  { cue: 25, layout: HAND, edges: [...HAND_EDGE], danger: ["m01Service"], badges: { m01Service: "every missing one" } },
  {
    cue: 26,
    layout: { ...HAND, m01Prod: [2.7, 2.2] },
    edges: [...HAND_EDGE, { from: "m01Service", to: "m01Prod", broken: true }],
    danger: ["m01Service"],
    badges: { m01Service: "fail fast" },
  },
  // The bank's decisions are settings the bank chooses.
  { cue: 27, layout: BANK, edges: [...BANK_EDGES], badges: { bank: "business decisions" } },
  {
    cue: 28,
    layout: BANK,
    edges: [...BANK_EDGES],
    packets: [{ from: "bank", to: "vault", label: "rates · limits" }, { from: "vault", to: "m01Service", label: "waiting times", delay: 45 }],
    badges: { bank: "the bank chooses" },
  },
  // The card zone's own settings.
  { cue: 30, layout: ZONE, frames: [CHOOSES], accent: ["m01Callers"], badges: { m01Callers: "who may call" } },
  { cue: 31, layout: ZONE, frames: [CHOOSES], accent: ["m01Websites"], badges: { m01Websites: "session life · tries" } },
  { cue: 32, layout: ZONE, frames: [CHOOSES], accent: ["m01FraudLimits"], badges: { m01FraudLimits: "card · address · shop" } },
  { cue: 33, layout: ZONE, frames: [CHOOSES], accent: ["m01CardKeep", "m01KeyChange"], badges: { m01CardKeep: "then deleted", m01KeyChange: "how often" } },
  { cue: 34, layout: ZONE, frames: [CHOOSES], accent: ["m01Cleanup"], badges: { m01Cleanup: "when it runs" } },
  // Back to Thursday: the missing limit is typed in, and the install runs.
  { cue: 35, layout: ZONE, frames: [CHOOSES], accent: ["m01FraudLimits"], badges: { m01FraudLimits: "a real decision" } },
  {
    cue: 36,
    layout: INSTALL,
    edges: [...INSTALL_EDGES],
    packets: [{ from: "m01Operator", to: "vault", label: "fraud limit" }, { from: "vault", to: "m01CardZone", label: "install", delay: 60 }],
    badges: { m01Operator: "Timur" },
  },
  { cue: 37, layout: INSTALL, edges: [...INSTALL_EDGES], accent: ["m01CardZone"], badges: { m01CardZone: "runs" } },
  // One service started with nothing set.
  { cue: 38, layout: HAND, edges: [{ from: "vault", to: "m01Service", broken: true }], badges: { m01Service: "nothing set" } },
  { cue: 39, layout: HAND, edges: [{ from: "vault", to: "m01Service", broken: true }], danger: ["m01Service"], badges: { m01Service: "does not start" } },
  { cue: 40, layout: MESSAGE, edges: [...MESSAGE_EDGE], danger: ["m01Service"], badges: { m01Message: "settings are missing" } },
  { cue: 41, layout: MESSAGE, edges: [...MESSAGE_EDGE], danger: ["m01Service"], badges: { m01Message: "one line each, by name" } },
  { cue: 42, layout: { m01Service: [1.5, 1] }, danger: ["m01Service"], badges: { m01Service: "nothing half works" } },
  { cue: 43, layout: { m01Service: [0.5, 1], m01Default: [2.5, 1] }, crossed: ["m01Default"], badges: { m01Default: "no guessed values" } },
  { cue: 44, layout: HAND, edges: [...HAND_EDGE], packets: [{ from: "vault", to: "m01Service", label: "its settings" }], accent: ["m01Service"], badges: { m01Service: "starts" } },
  // What it protects.
  { cue: 45, layout: { m01Default: [0.5, 1], m01Prod: [2.5, 1] }, edges: [{ from: "m01Default", to: "m01Prod", broken: true }], crossed: ["m01Default"], badges: { m01Prod: "no unchosen timeout" } },
  { cue: 46, layout: { vault: [0.5, 1], m01Prod: [2.5, 1] }, edges: [{ from: "vault", to: "m01Prod" }], accent: ["vault"], badges: { m01Prod: "no test password" } },
  { cue: 47, layout: BANK, edges: [...BANK_EDGES], accent: ["bank"], badges: { bank: "chose it · sees it" } },
  // One minute now, against a quiet wrong value later.
  { cue: 48, layout: INSTALL, edges: [...INSTALL_EDGES], accent: ["m01CardZone"], badges: { m01CardZone: "stopped one minute" } },
  { cue: 49, layout: { m01Default: [0.5, 1], m01Prod: [2.5, 1] }, edges: [{ from: "m01Default", to: "m01Prod" }], danger: ["m01Prod"], badges: { m01Default: "a guessed limit", m01Prod: "wrong, quietly" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 4, part: 2, current: ["payment", "card"] },
  { cue: 5, part: 2, current: ["vault", "cardsinfra"] },
  { cue: 29, part: 2, current: ["vault", "cardsinfra"], units: { cards: "the bank's settings" } },
  { cue: 50, part: 2, current: ["keycloak", "cardsinfra"], units: { ecom: "caller", cards: "two proofs" } },
];
