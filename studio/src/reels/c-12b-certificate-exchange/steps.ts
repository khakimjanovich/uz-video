import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 12b: the passport office. The question (0), the passport (1–3), the caller does the same (4–9),
// no private key crosses (10), expiry watched (11), the close (12).
const PASSPORT = { m2Applicant: [0, 1], m2Photo: [1.5, 1], m2PassportOffice: [3, 1] } as const;
const PASSPORT_EDGES = [{ from: "m2Applicant", to: "m2Photo" }, { from: "m2Photo", to: "m2PassportOffice" }] as const;

const CALLER = { m2EcomVault: [0, 0.2], m2Ecom: [0, 1.8], m2Office: [3, 1] } as const;
const KEY_EDGE = { from: "m2Ecom", to: "m2EcomVault", label: "private key" } as const;
const ASK = { ...CALLER, m2Csr: [1.5, 1] } as const;
const ASK_EDGES = [KEY_EDGE, { from: "m2Ecom", to: "m2Csr" }, { from: "m2Csr", to: "m2Office" }] as const;
const BACK = { ...CALLER, m2Folder: [1.5, 1] } as const;
const BACK_EDGES = [KEY_EDGE, { from: "m2Office", to: "m2Folder" }, { from: "m2Folder", to: "m2EcomVault" }] as const;
const SIDES = [
  { label: "ecom", from: [0, 0.2], to: [0, 1.8] },
  { label: "Card zone", from: [3, 1], to: [3, 1], tone: "wall" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Without handing over the secret key.
  {
    cue: 0,
    layout: { m2Ecom: [0.4, 1], card: [2.8, 1] },
    frames: [{ label: "Card zone", from: [2.8, 1], to: [2.8, 1], tone: "wall" }],
    packets: [{ from: "m2Ecom", to: "card", label: "secret key", stopAt: 0.45 }],
    badges: { m2Ecom: "needs a certificate" },
  },
  // The passport.
  { cue: 1, layout: PASSPORT, edges: [...PASSPORT_EDGES], packets: [{ from: "m2Photo", to: "m2PassportOffice", label: "application" }] },
  {
    cue: 2,
    layout: PASSPORT,
    edges: [...PASSPORT_EDGES],
    accent: ["m2PassportOffice"],
    packets: [{ from: "m2PassportOffice", to: "m2Photo", label: "stamped" }],
    badges: { m2PassportOffice: "checks · stamps" },
  },
  { cue: 3, layout: PASSPORT, edges: [...PASSPORT_EDGES], badges: { m2Photo: "only the photo", m2Applicant: "face stays" } },
  // The caller does the same.
  { cue: 5, layout: CALLER, edges: [KEY_EDGE], accent: ["m2EcomVault"], badges: { m2EcomVault: "key stays" } },
  { cue: 6, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "m2Csr", to: "m2Office", label: "application" }] },
  { cue: 7, layout: ASK, edges: [...ASK_EDGES], accent: ["m2Office"], badges: { m2Office: "on the list · signs" } },
  {
    cue: 8,
    layout: BACK,
    edges: [...BACK_EDGES],
    packets: [{ from: "m2Office", to: "m2Folder", label: "signed" }],
    badges: { m2Folder: "four things" },
  },
  { cue: 9, layout: BACK, edges: [...BACK_EDGES], packets: [{ from: "m2Folder", to: "m2EcomVault", label: "folder" }], badges: { m2EcomVault: "stored" } },
  // No private key crosses.
  {
    cue: 10,
    layout: CALLER,
    edges: [KEY_EDGE],
    frames: [...SIDES],
    packets: [{ from: "m2EcomVault", to: "m2Office", label: "private key", stopAt: 0.4 }],
    badges: { m2EcomVault: "never leaves" },
  },
  // Every certificate watched.
  {
    cue: 11,
    layout: { m2Folder: [0.4, 1], m2Expiry: [2.6, 1] },
    edges: [{ from: "m2Expiry", to: "m2Folder", label: "watches" }],
    badges: { m2Expiry: "warns early" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 4, part: 2, current: ["procport", "vault", "cardsinfra"], units: { ecom: "caller", cards: "passport office" } },
  { cue: 12, part: 2, current: ["frame"], units: { cards: "stolen cards" } },
];
