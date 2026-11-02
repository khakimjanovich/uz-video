import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 12b: the passport application. Friday's email (0–3), the bridge (4–5), what the email would do (6–9),
// the passport (11–12), the caller's key and form (13–18), the certificate authority signs (19–25), the folder (26–30),
// store, two proofs, expiry (31–34), the operators' Friday (35–45), months later (46–48), what stays separate (49–53), next (57).
const PASSPORT = { m2Applicant: [0, 1], m2Photo: [1.5, 1], m2PassportOffice: [3, 1] } as const;
const PP: Beat = { layout: PASSPORT, edges: [{ from: "m2Applicant", to: "m2Photo" }, { from: "m2Photo", to: "m2PassportOffice" }] };
const WRONG: Beat = {
  layout: { m2Ecom: [0, 1], m2Inbox: [1.5, 1], card: [3, 1] },
  edges: [{ from: "m2Ecom", to: "m2Inbox" }, { from: "m2Inbox", to: "card" }],
};
const KEY = { from: "m2Ecom", to: "m2EcomVault", label: "private key" } as const;
const CALLER = { m2EcomVault: [0, 0.2], m2Ecom: [0, 1.8] } as const;
const ASK: Beat = {
  layout: { ...CALLER, m2Csr: [1.5, 1], m2Office: [3, 1] },
  edges: [KEY, { from: "m2Ecom", to: "m2Csr" }, { from: "m2Csr", to: "m2Office" }],
  frames: [{ label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" }],
};
const BACK: Beat = {
  layout: { ...CALLER, m2Folder: [1.5, 1], m2Office: [3, 1] },
  edges: [KEY, { from: "m2Office", to: "m2Folder" }, { from: "m2Folder", to: "m2Ecom" }],
  frames: [{ label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" }],
};
const FOUR = { m2Folder: [0, 1], m2Cert: [2.4, 0], m2OfficeSeal: [2.4, 0.73], m2LoginSecret: [2.4, 1.47], m2Addresses: [2.4, 2.2] } as const;
const FOUR_EDGES = [
  { from: "m2Folder", to: "m2Cert" },
  { from: "m2Folder", to: "m2OfficeSeal" },
  { from: "m2Folder", to: "m2LoginSecret" },
  { from: "m2Folder", to: "m2Addresses" },
] as const;
const F: Beat = { layout: FOUR, edges: [...FOUR_EDGES] };
const STORE: Beat = {
  layout: { m2Folder: [0, 1], m2Ecom: [1.5, 1], m2EcomVault: [3, 0.2], m2SecretFile: [3, 1.8] },
  edges: [{ from: "m2Folder", to: "m2Ecom" }, { from: "m2Ecom", to: "m2EcomVault" }, { from: "m2Ecom", to: "m2SecretFile" }],
};
const CALL: Beat = {
  layout: { m2Ecom: [0, 1], partnerdoor: [1.5, 1], card: [3, 1] },
  edges: [{ from: "m2Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "card" }],
};
const OPS: Beat = {
  layout: { m2OperatorA: [0, 1], m2Csr: [1.5, 1], m2OperatorB: [3, 1] },
  edges: [{ from: "m2OperatorA", to: "m2Csr" }, { from: "m2Csr", to: "m2OperatorB" }],
  frames: [{ label: "Caller's side", from: [0, 1], to: [0, 1] }, { label: "Card zone's side", from: [3, 1], to: [3, 1], tone: "wall" }],
};
const OPS_BACK: Beat = {
  layout: { m2OperatorA: [0, 1], m2Folder: [1.5, 1], m2OperatorB: [3, 1] },
  edges: [{ from: "m2OperatorB", to: "m2Folder" }, { from: "m2Folder", to: "m2OperatorA" }],
  frames: [{ label: "Caller's side", from: [0, 1], to: [0, 1] }, { label: "Card zone's side", from: [3, 1], to: [3, 1], tone: "wall" }],
};
const EXPIRY: Beat = { layout: { m2Cert: [0.4, 1], m2Expiry: [2.6, 1] }, edges: [{ from: "m2Expiry", to: "m2Cert", label: "watches" }] };
const SIDES: Beat = {
  layout: { m2EcomVault: [0, 0.2], m2Ecom: [0, 1.8], card: [3, 1.8], m2ZoneVault: [3, 0.2] },
  edges: [KEY, { from: "card", to: "m2ZoneVault" }],
  frames: [{ label: "ecom", from: [0, 0.2], to: [0, 1.8] }, { label: "Card zone", from: [3, 0.2], to: [3, 1.8], tone: "wall" }],
};

export const diagram: DiagramStep<BuildId>[] = [
  // Friday: shall I just email the key?
  {
    cue: 0,
    layout: { m2Ecom: [0.4, 1], card: [2.8, 1] },
    frames: [{ label: "Card zone", from: [2.8, 1], to: [2.8, 1], tone: "wall" }],
    badges: { m2Ecom: "Fri afternoon", card: "Timur" },
  },
  { cue: 1, ...WRONG, badges: { m2Ecom: "made a private key" } },
  { cue: 2, ...WRONG, packets: [{ from: "m2Ecom", to: "m2Inbox", label: "private key" }], badges: { m2Inbox: "email it?" } },
  { cue: 3, ...WRONG, crossed: ["m2Inbox"], badges: { card: "Timur: never" } },
  // What the email would do.
  { cue: 6, ...WRONG, packets: [{ from: "m2Ecom", to: "m2Inbox", label: "private key" }] },
  { cue: 7, ...WRONG, danger: ["m2Inbox"], badges: { m2Inbox: "another's inbox" } },
  { cue: 8, ...WRONG, layout: { m2Ecom: [0, 1], m2Inbox: [1.5, 1], attacker: [3, 1] }, edges: [{ from: "m2Inbox", to: "attacker" }], badges: { attacker: "pretends to be ecom" } },
  { cue: 9, ...WRONG, crossed: ["m2Inbox"], badges: { m2Ecom: "no longer yours" } },
  // The passport application.
  { cue: 11, ...PP, packets: [{ from: "m2Photo", to: "m2PassportOffice", label: "application" }] },
  {
    cue: 12,
    ...PP,
    accent: ["m2PassportOffice"],
    packets: [{ from: "m2PassportOffice", to: "m2Photo", label: "stamped" }],
    badges: { m2Photo: "only the photo", m2Applicant: "face stays" },
  },
  // The caller's key and form.
  { cue: 13, layout: CALLER, edges: [KEY], accent: ["m2EcomVault"] },
  { cue: 14, layout: CALLER, edges: [KEY], badges: { m2EcomVault: "key stays here" } },
  { cue: 15, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [] },
  { cue: 16, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [], badges: { m2Csr: "public half · name" } },
  { cue: 17, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [], badges: { m2Csr: "signing request" } },
  { cue: 18, ...ASK, packets: [{ from: "m2Csr", to: "m2Office", label: "only this" }] },
  // The certificate authority.
  { cue: 19, ...ASK, accent: ["m2Office"], badges: { m2Office: "certificate authority" } },
  { cue: 20, ...ASK, badges: { m2Office: "checks the form" } },
  { cue: 21, ...ASK, badges: { m2Office: "well made?" } },
  { cue: 22, ...ASK, badges: { m2Office: "right name?" } },
  { cue: 23, ...ASK, badges: { m2Office: "on the list?" } },
  { cue: 24, ...ASK, packets: [{ from: "m2Office", to: "m2Csr", label: "signed · limited time" }] },
  { cue: 25, ...BACK, badges: { m2Folder: "calling in only" } },
  // The folder.
  { cue: 26, ...BACK, packets: [{ from: "m2Office", to: "m2Folder", label: "folder" }, { from: "m2Folder", to: "m2Ecom", label: "folder", delay: 50 }] },
  { cue: 27, ...F, accent: ["m2Cert"] },
  { cue: 28, ...F, accent: ["m2OfficeSeal"], badges: { m2OfficeSeal: "the real card zone" } },
  { cue: 29, ...F, accent: ["m2LoginSecret"], badges: { m2LoginSecret: "own secure channel" } },
  { cue: 30, ...F, accent: ["m2Addresses"] },
  // Store, two proofs, expiry watched.
  { cue: 31, ...STORE, packets: [{ from: "m2Ecom", to: "m2EcomVault", label: "everything" }] },
  { cue: 32, ...STORE, crossed: ["m2SecretFile"], badges: { m2SecretFile: "deleted" } },
  { cue: 33, ...CALL, packets: [{ from: "m2Ecom", to: "card", label: "certificate + token" }], badges: { m2Ecom: "two proofs" } },
  { cue: 34, ...EXPIRY, badges: { m2Expiry: "warns early" } },
  // The operators' Friday.
  { cue: 36, ...OPS, edges: [{ from: "m2OperatorA", to: "m2Csr" }], badges: { m2OperatorA: "makes the key" } },
  { cue: 37, ...OPS, packets: [{ from: "m2Csr", to: "m2OperatorB", label: "only the form" }], badges: { m2OperatorB: "Timur" } },
  { cue: 38, ...OPS, accent: ["m2OperatorB"], badges: { m2OperatorB: "signs" } },
  { cue: 39, ...OPS, crossed: ["m2Csr"], badges: { m2OperatorB: "not listed: refused" } },
  { cue: 40, ...OPS_BACK, accent: ["m2Folder"], badges: { m2Folder: "named for ecom" } },
  { cue: 41, ...OPS_BACK, packets: [{ from: "m2Folder", to: "m2OperatorA", label: "folder" }] },
  { cue: 42, ...OPS_BACK, packets: [{ from: "m2OperatorB", to: "m2OperatorA", label: "secret, separately" }] },
  { cue: 43, ...STORE, packets: [{ from: "m2Folder", to: "m2Ecom", label: "reads it" }] },
  { cue: 44, ...STORE, packets: [{ from: "m2Ecom", to: "m2EcomVault", label: "all of it" }], crossed: ["m2SecretFile"] },
  { cue: 45, ...CALL, packets: [{ from: "m2Ecom", to: "card", label: "first call" }, { from: "card", to: "m2Ecom", label: "answer", delay: 60 }] },
  // Months later.
  { cue: 46, layout: { m2Cert: [0, 1], m2Expiry: [1.5, 1], m2Team: [3, 1] }, edges: [{ from: "m2Expiry", to: "m2Cert" }, { from: "m2Expiry", to: "m2Team" }], packets: [{ from: "m2Expiry", to: "m2Team", label: "end date near" }] },
  { cue: 47, ...EXPIRY, crossed: ["m2Cert"], badges: { m2Expiry: "retired on time" } },
  { cue: 48, layout: { m2Team: [1.5, 1] }, badges: { m2Team: "nobody woken" } },
  // Each side keeps its own.
  { cue: 49, ...SIDES, badges: { m2EcomVault: "its own key" } },
  { cue: 50, ...SIDES, packets: [{ from: "m2EcomVault", to: "card", label: "a leak", stopAt: 0.4 }], badges: { m2ZoneVault: "never exposed" } },
  { cue: 51, ...ASK, badges: { m2Office: "who · how long" } },
  { cue: 52, ...SIDES, badges: { m2ZoneVault: "never touched" } },
  { cue: 53, layout: { m2Cert: [1.5, 1] }, badges: { m2Cert: "owner · signer · end date" } },
  // Recap, the question (held 2 s), and the answer: only the request leaves.
  { cue: 54, ...ASK, badges: { m2EcomVault: "key stays here" } },
  { cue: 55, ...ASK },
  { cue: 56, ...ASK, accent: ["m2Csr"], packets: [{ from: "m2Csr", to: "m2Office", label: "only the request" }] },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 4, part: 3, current: ["card", "payment"] },
  { cue: 5, part: 3, current: ["procport", "vault", "cardsinfra"], units: { ecom: "caller", cards: "certificate" } },
  { cue: 35, part: 3, current: ["procport", "cardsinfra"], units: { ecom: "engineer", cards: "Timur" } },
  { cue: 57, part: 3, rows: [3], current: ["frame"], units: { cards: "stolen cards" } },
];

// No product screen: the exchange happens between two operators, drawn above.
export const screens: ScreenStep[] = [];
