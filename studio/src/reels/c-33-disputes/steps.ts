import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 33: disputes. The claim and its deadline (cues 4–7), the court (8–11), a dispute's two ways in and its
// steps (12–18), the evidence date (19–24), the result and two admins (25–29), refund, record, alert (30–33),
// the product (34–54), what it protects (55–60).
const CLAIM = { buyer: [0, 0.4], issuer: [1.5, 0.4], network: [3, 0.4], acquirer: [3, 1.9] } as const;
const CLAIM_EDGES = [
  { from: "buyer", to: "issuer" },
  { from: "issuer", to: "network" },
  { from: "network", to: "acquirer" },
] as const;
const COURT = { m78CaseFile: [0, 1], m78EvidenceDate: [1.5, 1], m78Ruling: [3, 1] } as const;
const COURT_EDGES = [{ from: "m78CaseFile", to: "m78EvidenceDate" }, { from: "m78EvidenceDate", to: "m78Ruling" }] as const;
const STEPS = { m78StRegistered: [0, 1], m78StEvidence: [1, 1], m78StSent: [2, 1], m78StResult: [3, 1] } as const;
const STEP_EDGES = [
  { from: "m78StRegistered", to: "m78StEvidence" },
  { from: "m78StEvidence", to: "m78StSent" },
  { from: "m78StSent", to: "m78StResult" },
] as const;
const ASK = { admin: [0, 1], m78Calendar: [1.5, 1], shop: [3, 1] } as const;
const ASK_EDGES = [{ from: "admin", to: "m78Calendar" }, { from: "m78Calendar", to: "shop" }] as const;
const RESULT = { admin: [0, 0.4], checker: [1.5, 0.4], record: [3, 0.4], buyer: [3, 1.9] } as const;
const RESULT_EDGES = [
  { from: "admin", to: "checker", label: "lost" },
  { from: "checker", to: "record", label: "approves" },
  { from: "record", to: "buyer", label: "chargeback" },
] as const;
const GUARDS = { acquirer: [0, 1], shop: [1.5, 1], record: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 6, current: ["payment", "admin", "merchant"] },
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 6, current: ["payment"] },
  { cue: 2, part: 6, current: ["procsvc"] },
  { cue: 3, part: 6, current: ["admin", "payment"] },
  { cue: 61, part: 6, current: ["reconciliation"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The claim and its deadline.
  { cue: 4, layout: CLAIM, edges: [{ from: "buyer", to: "issuer" }], packets: [{ from: "buyer", to: "issuer", label: "never bought it" }] },
  { cue: 5, layout: CLAIM, edges: [...CLAIM_EDGES], packets: [{ from: "issuer", to: "network", label: "claim" }, { from: "network", to: "acquirer", label: "claim", delay: 50 }], badges: { acquirer: "deadline" } },
  { cue: 6, layout: CLAIM, edges: [...CLAIM_EDGES], badges: { acquirer: "missed: money gone" }, danger: ["acquirer"] },
  { cue: 7, layout: { shop: [0.4, 1], m78Inbox: [2.6, 1] }, edges: [{ from: "shop", to: "m78Inbox", label: "evidence" }], packets: [{ from: "shop", to: "m78Inbox", label: "files" }], badges: { m78Inbox: "unread" }, danger: ["m78Inbox"] },
  // The small-claims court.
  { cue: 8, layout: COURT, edges: [...COURT_EDGES] },
  { cue: 9, layout: COURT, edges: [...COURT_EDGES], badges: { m78CaseFile: "one per case" }, accent: ["m78CaseFile"] },
  { cue: 10, layout: COURT, edges: [...COURT_EDGES], badges: { m78CaseFile: "one per case", m78EvidenceDate: "skips holidays" }, accent: ["m78EvidenceDate"] },
  { cue: 11, layout: COURT, edges: [...COURT_EDGES], badges: { m78CaseFile: "one per case", m78EvidenceDate: "skips holidays", m78Ruling: "in the file" }, accent: ["m78Ruling"] },
  // A dispute.
  { cue: 12, layout: { m78Dispute: [1.5, 1] }, accent: ["m78Dispute"] },
  { cue: 13, layout: { m78Dispute: [1.5, 1] }, badges: { m78Dispute: "on a paid payment" }, accent: ["m78Dispute"] },
  { cue: 14, layout: CLAIM, edges: [...CLAIM_EDGES], badges: { acquirer: "two ways in" } },
  {
    cue: 15,
    layout: CLAIM,
    edges: [...CLAIM_EDGES, { from: "buyer", to: "acquirer", label: "complaint" }],
    packets: [{ from: "buyer", to: "acquirer", label: "complaint" }, { from: "network", to: "acquirer", label: "claim", delay: 60 }],
  },
  { cue: 16, layout: { admin: [0.4, 1], record: [2.6, 1] }, edges: [{ from: "admin", to: "record", label: "register" }], packets: [{ from: "admin", to: "record", label: "dispute" }], badges: { record: "whole amount" } },
  {
    cue: 17,
    layout: { admin: [0, 1], record: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "admin", to: "record" }, { from: "record", to: "shop", label: "told at once" }],
    packets: [{ from: "record", to: "shop", label: "disputed" }],
    badges: { record: "disputed" },
    danger: ["record"],
  },
  { cue: 18, layout: STEPS, edges: [...STEP_EDGES], packets: STEP_EDGES.map((e, k) => ({ ...e, label: "next", delay: 10 + k * 35 })) },
  // The evidence date.
  { cue: 19, layout: ASK, edges: [...ASK_EDGES], accent: ["m78Calendar"] },
  { cue: 20, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "m78Calendar", to: "shop", label: "send evidence by" }], badges: { m78Calendar: "banking days" } },
  { cue: 21, layout: ASK, edges: [...ASK_EDGES], badges: { m78Calendar: "no weekends · holidays" }, accent: ["m78Calendar"] },
  {
    cue: 22,
    layout: { m78EvidenceDate: [0.4, 1], network: [2.6, 1] },
    edges: [{ from: "m78EvidenceDate", to: "network", label: "a margin" }],
    badges: { m78EvidenceDate: "before", network: "network's deadline" },
  },
  { cue: 23, layout: { shop: [0.4, 1], m78Dispute: [2.6, 1] }, edges: [{ from: "shop", to: "m78Dispute", label: "upload" }], packets: [{ from: "shop", to: "m78Dispute", label: "files" }] },
  { cue: 24, layout: { shop: [0.4, 1], m78Dispute: [2.6, 1] }, edges: [{ from: "shop", to: "m78Dispute", label: "upload" }], badges: { m78Dispute: "can't be taken back" } },
  // The result: two admins for a loss.
  { cue: 25, layout: STEPS, edges: [...STEP_EDGES], accent: ["m78StResult"] },
  { cue: 26, layout: { m78StResult: [0.4, 1], record: [2.6, 1] }, edges: [{ from: "m78StResult", to: "record", label: "won" }], badges: { record: "paid again" }, accent: ["record"] },
  { cue: 27, layout: RESULT, edges: [RESULT_EDGES[0]], packets: [{ from: "admin", to: "checker", label: "lost" }], badges: { admin: "records", checker: "must approve" } },
  { cue: 28, layout: RESULT, edges: [...RESULT_EDGES], packets: [{ from: "record", to: "buyer", label: "money back" }], badges: { record: "charged back" }, danger: ["record"] },
  { cue: 29, layout: RESULT, edges: [...RESULT_EDGES], badges: { admin: "one", checker: "two" }, accent: ["admin", "checker"] },
  // The refund shortcut; every step written down; the alert.
  { cue: 30, layout: { shop: [0.4, 1], record: [2.6, 1] }, edges: [{ from: "shop", to: "record" }] },
  { cue: 31, layout: { shop: [0.4, 1], record: [2.6, 1] }, edges: [{ from: "shop", to: "record", label: "full refund" }], packets: [{ from: "shop", to: "record", label: "refund" }], badges: { record: "dispute settled" }, accent: ["record"] },
  { cue: 32, layout: { m78Dispute: [1.5, 1] }, badges: { m78Dispute: "who · when · why" }, accent: ["m78Dispute"] },
  { cue: 33, layout: { m78Dispute: [0.4, 1], m78Email: [2.6, 1] }, edges: [{ from: "m78Dispute", to: "m78Email", label: "deadline close" }], packets: [{ from: "m78Dispute", to: "m78Email", label: "alert" }], accent: ["m78Email"] },
  // The same admin can't approve: the server refuses.
  {
    cue: 52,
    layout: { admin: [0.4, 1], m78Dispute: [2.6, 1] },
    edges: [{ from: "admin", to: "m78Dispute", label: "approve?" }],
    packets: [{ from: "admin", to: "m78Dispute", label: "same admin", stopAt: 0.6 }],
    badges: { admin: "recorded the loss", m78Dispute: "refused" },
    danger: ["m78Dispute"],
  },
  // What it protects.
  { cue: 55, layout: GUARDS },
  { cue: 56, layout: GUARDS, badges: { acquirer: "no loss by silence" }, accent: ["acquirer"] },
  { cue: 57, layout: GUARDS, badges: { acquirer: "no loss by silence", shop: "always told" }, accent: ["shop"] },
  { cue: 58, layout: GUARDS, badges: { acquirer: "no loss by silence", shop: "always told", record: "never one person" }, accent: ["record"] },
  { cue: 59, layout: COURT, edges: [...COURT_EDGES] },
  { cue: 60, layout: COURT, edges: [...COURT_EDGES], badges: { m78CaseFile: "one per case", m78EvidenceDate: "skips holidays", m78Ruling: "two before a loss" }, accent: ["m78Ruling"] },
];

const S = "screens/c-33-disputes";
type Box = [number, number, number, number];
const LIST: Box = [170, 40, 900, 562];
const ACTIONS: Box = [640, 150, 800, 500];
const MODAL: Box = [320, 170, 800, 500];
const DRAWER: Box = [820, 240, 620, 388];
export const screens: ScreenStep[] = [
  {
    cue: 34,
    src: `${S}/payments.png`,
    title: "Bank console · Payments",
    region: LIST,
    beats: [
      { cue: 35, region: LIST, focus: [[261, 428, 640, 85]] },
      { cue: 36, region: ACTIONS, focus: [[1277, 456, 111, 28]] },
    ],
  },
  {
    cue: 37,
    src: `${S}/register.png`,
    title: "Bank console · Register complaint",
    region: MODAL,
    focus: [[516, 331, 408, 36]],
    beats: [
      { cue: 38, region: MODAL, focus: [[516, 384, 408, 60]] },
      { cue: 39, region: MODAL, focus: [[516, 452, 408, 154]] },
    ],
  },
  { cue: 40, src: `${S}/payments-disputed.png`, title: "Bank console · Payments", region: ACTIONS, focus: [[940, 436, 100, 32]] },
  {
    cue: 41,
    src: `${S}/disputes.png`,
    title: "Bank console · Disputes",
    region: [170, 150, 1000, 625],
    focus: [[261, 264, 260, 294]],
    beats: [{ cue: 42, region: [170, 150, 1000, 625], focus: [[261, 311, 1158, 62], [261, 373, 1158, 62]] }],
  },
  {
    cue: 43,
    src: `${S}/ask-evidence.png`,
    title: "Bank console · Ask for evidence",
    region: MODAL,
    focus: [[500, 248, 440, 50]],
    beats: [
      { cue: 44, region: MODAL, focus: [[516, 409, 408, 36], [516, 470, 408, 120]] },
      { cue: 45, region: MODAL, focus: [[516, 308, 408, 61]] },
    ],
  },
  {
    cue: 46,
    src: `${S}/merchant-upload.png`,
    title: "Merchant portal · Payments",
    region: [820, 330, 620, 388],
    focus: [[849, 470, 562, 124], [849, 658, 562, 30]],
  },
  { cue: 47, src: `${S}/files.png`, title: "Bank console · Dispute", region: [820, 150, 620, 388], focus: [[836, 383, 588, 50]] },
  {
    cue: 48,
    src: `${S}/record-lost.png`,
    title: "Bank console · Record result",
    region: MODAL,
    focus: [[516, 349, 408, 36]],
  },
  {
    cue: 49,
    src: `${S}/pending.png`,
    title: "Bank console · Dispute",
    region: [820, 0, 620, 388],
    focus: [[1310, 70, 118, 26]],
    beats: [
      { cue: 50, region: DRAWER, focus: [[836, 468, 588, 30]] },
      { cue: 51, region: DRAWER, focus: [[836, 498, 588, 46]] },
    ],
  },
  { cue: 53, src: `${S}/approve.png`, title: "Bank console · Dispute · second admin", region: DRAWER, focus: [[853, 569, 125, 36]] },
  { cue: 54, src: `${S}/charged-back.png`, title: "Bank console · Payments", region: ACTIONS, focus: [[940, 436, 121, 32]] },
];
