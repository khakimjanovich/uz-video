import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 12b: the passport office. The wrong way (0–8), the passport (9–12), the caller's key and form (13–19),
// the certificate authority signs (20–27), the folder (28–36), two proofs, no key crosses, expiry (37–39),
// the operators' steps (40–54), what it protects (55–62), the passport again (63–65), next (66).
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
  // Without handing over the secret key.
  {
    cue: 0,
    layout: { m2Ecom: [0.4, 1], card: [2.8, 1] },
    frames: [{ label: "Card zone", from: [2.8, 1], to: [2.8, 1], tone: "wall" }],
    packets: [{ from: "m2Ecom", to: "card", label: "secret key", stopAt: 0.45 }],
    badges: { m2Ecom: "needs a certificate" },
  },
  // The wrong way.
  { cue: 5, ...WRONG, packets: [{ from: "m2Ecom", to: "m2Inbox", label: "private key" }] },
  { cue: 6, ...WRONG, danger: ["m2Inbox"], badges: { m2Inbox: "a secret inside" } },
  { cue: 7, ...WRONG, layout: { m2Ecom: [0, 1], m2Inbox: [1.5, 1], attacker: [3, 1] }, edges: [{ from: "m2Inbox", to: "attacker" }], badges: { attacker: "pretends to be ecom" } },
  { cue: 8, ...WRONG, crossed: ["m2Inbox"], badges: { m2Ecom: "key never crosses" } },
  // The passport office.
  { cue: 9, layout: { m2PassportOffice: [1.5, 1] } },
  { cue: 10, ...PP, packets: [{ from: "m2Photo", to: "m2PassportOffice", label: "application" }] },
  { cue: 11, ...PP, accent: ["m2PassportOffice"], packets: [{ from: "m2PassportOffice", to: "m2Photo", label: "stamped" }], badges: { m2PassportOffice: "checks · stamps" } },
  { cue: 12, ...PP, badges: { m2Photo: "only the photo", m2Applicant: "face stays" } },
  // The caller's key and form.
  { cue: 14, layout: CALLER, edges: [KEY], accent: ["m2EcomVault"] },
  { cue: 15, layout: CALLER, edges: [KEY], badges: { m2EcomVault: "key stays here" } },
  { cue: 16, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [] },
  { cue: 17, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [], badges: { m2Csr: "public half · name" } },
  { cue: 18, ...ASK, layout: { ...CALLER, m2Csr: [1.5, 1] }, edges: [KEY, { from: "m2Ecom", to: "m2Csr" }], frames: [], badges: { m2Csr: "signing request" } },
  { cue: 19, ...ASK, packets: [{ from: "m2Csr", to: "m2Office", label: "only this" }] },
  // The certificate authority.
  { cue: 20, ...ASK, accent: ["m2Office"] },
  { cue: 21, ...ASK, badges: { m2Office: "certificate authority" } },
  { cue: 22, ...ASK, badges: { m2Office: "checks the form" } },
  { cue: 23, ...ASK, badges: { m2Office: "well made?" } },
  { cue: 24, ...ASK, badges: { m2Office: "right name?" } },
  { cue: 25, ...ASK, badges: { m2Office: "on the list?" } },
  { cue: 26, ...ASK, packets: [{ from: "m2Office", to: "m2Csr", label: "signed · limited time" }] },
  { cue: 27, ...BACK, badges: { m2Folder: "calling in only" } },
  // The folder.
  { cue: 28, ...BACK, packets: [{ from: "m2Office", to: "m2Folder", label: "folder" }, { from: "m2Folder", to: "m2Ecom", label: "folder", delay: 50 }] },
  { cue: 29, ...F },
  { cue: 30, ...F, accent: ["m2Cert"] },
  { cue: 31, ...F, accent: ["m2OfficeSeal"], badges: { m2OfficeSeal: "the real card zone" } },
  { cue: 32, ...F, accent: ["m2LoginSecret"], badges: { m2LoginSecret: "own secure channel" } },
  { cue: 33, ...F, accent: ["m2Addresses"] },
  { cue: 34, ...STORE, packets: [{ from: "m2Folder", to: "m2Ecom", label: "folder" }], badges: { m2Ecom: "checks it" } },
  { cue: 35, ...STORE, packets: [{ from: "m2Ecom", to: "m2EcomVault", label: "everything" }] },
  { cue: 36, ...STORE, crossed: ["m2SecretFile"], badges: { m2SecretFile: "deleted" } },
  // Two proofs; no key crosses; expiry watched.
  { cue: 37, ...CALL, packets: [{ from: "m2Ecom", to: "card", label: "certificate + token" }], badges: { m2Ecom: "two proofs" } },
  { cue: 38, ...SIDES, packets: [{ from: "m2EcomVault", to: "card", label: "private key", stopAt: 0.4 }], badges: { m2EcomVault: "never crosses" } },
  { cue: 39, ...EXPIRY, badges: { m2Expiry: "warns early" } },
  // The steps the two operators see.
  { cue: 41, ...OPS, layout: { m2OperatorA: [0, 1], m2OperatorB: [3, 1] }, edges: [], accent: ["m2OperatorA", "m2OperatorB"] },
  { cue: 42, ...OPS, edges: [{ from: "m2OperatorA", to: "m2Csr" }], badges: { m2OperatorA: "makes the key" } },
  { cue: 43, ...OPS, packets: [{ from: "m2Csr", to: "m2OperatorB", label: "only the form" }] },
  { cue: 44, ...OPS, accent: ["m2OperatorB"], badges: { m2OperatorB: "signs" } },
  { cue: 45, ...OPS, crossed: ["m2Csr"], badges: { m2OperatorB: "not listed: refused" } },
  { cue: 46, ...OPS_BACK, accent: ["m2Folder"], badges: { m2Folder: "named for the caller" } },
  { cue: 47, ...OPS_BACK, packets: [{ from: "m2Folder", to: "m2OperatorA", label: "folder" }] },
  { cue: 48, ...OPS_BACK, packets: [{ from: "m2OperatorB", to: "m2OperatorA", label: "secret, separately" }] },
  { cue: 49, ...STORE, packets: [{ from: "m2Folder", to: "m2Ecom", label: "reads it" }] },
  { cue: 50, ...STORE, packets: [{ from: "m2Ecom", to: "m2EcomVault", label: "all of it" }], crossed: ["m2SecretFile"] },
  { cue: 51, ...CALL, packets: [{ from: "m2Ecom", to: "card", label: "first call" }, { from: "card", to: "m2Ecom", label: "answer", delay: 60 }] },
  { cue: 52, layout: { m2Cert: [0, 1], m2Expiry: [1.5, 1], m2Team: [3, 1] }, edges: [{ from: "m2Expiry", to: "m2Cert" }, { from: "m2Expiry", to: "m2Team" }], packets: [{ from: "m2Expiry", to: "m2Team", label: "end date near" }] },
  { cue: 53, ...EXPIRY, crossed: ["m2Cert"], badges: { m2Expiry: "retired on time" } },
  { cue: 54, layout: { m2Team: [1.5, 1] }, badges: { m2Team: "nobody woken" } },
  // What it protects.
  { cue: 56, ...WRONG, danger: ["m2Inbox"], badges: { m2Inbox: "another's secret" } },
  { cue: 57, ...WRONG, danger: ["m2Ecom", "card"], badges: { m2Inbox: "both exposed" } },
  { cue: 58, ...SIDES, badges: { m2EcomVault: "its own key" } },
  { cue: 59, ...ASK, badges: { m2Office: "who · how long" } },
  { cue: 60, ...SIDES, badges: { m2ZoneVault: "never touched" } },
  { cue: 61, ...SIDES, badges: { m2Ecom: "sharing nothing" } },
  { cue: 62, layout: { m2Cert: [1.5, 1] }, badges: { m2Cert: "owner · signer · end date" } },
  // The passport again.
  { cue: 63, ...PP },
  { cue: 64, ...PP, packets: [{ from: "m2Photo", to: "m2PassportOffice", label: "stamped photo" }] },
  { cue: 65, ...PP, badges: { m2Applicant: "the face stays" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 3, current: ["payment", "cardsinfra"] },
  { cue: 2, part: 3, current: ["card", "payment"] },
  { cue: 3, part: 3, current: ["vault", "cardsinfra"] },
  { cue: 13, part: 3, current: ["procport", "vault", "cardsinfra"], units: { ecom: "caller", cards: "passport office" } },
  { cue: 40, part: 3, current: ["procport", "cardsinfra"], units: { ecom: "operator", cards: "operator" } },
  { cue: 55, part: 3, current: ["procport", "vault", "cardsinfra"], units: { ecom: "own key", cards: "own key" } },
  { cue: 66, part: 3, current: ["frame"], units: { cards: "stolen cards" } },
];

// No product screen: the exchange happens between two operators, drawn above.
export const screens: ScreenStep[] = [];
