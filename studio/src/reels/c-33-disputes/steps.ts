import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 33: disputes. The court (cues 0–2), where a dispute comes from (3), registered and evidence asked (4–5),
// won or lost (6–7), every step written (8), the close (9).
const COURT = { m78CaseFile: [0, 1], m78EvidenceDate: [1.5, 1], m78Ruling: [3, 1] } as const;
const ASK = { bankStaff: [0, 1.7], shop: [3, 1.7], m78Calendar: [1.5, 0.3] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 7, current: ["payment", "admin"] },
  { cue: 9, part: 7, current: ["reconciliation", "procsvc"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The court.
  { cue: 1, layout: COURT, edges: [{ from: "m78CaseFile", to: "m78EvidenceDate" }, { from: "m78EvidenceDate", to: "m78Ruling" }] },
  { cue: 2, layout: { m78Dispute: [1.5, 1] }, accent: ["m78Dispute"] },
  // Where it comes from.
  {
    cue: 3,
    layout: { buyer: [0, 0.2], issuer: [0, 1.9], network: [1.4, 1.9], m78Dispute: [3, 1] },
    edges: [{ from: "buyer", to: "m78Dispute", label: "own customer" }, { from: "issuer", to: "network" }, { from: "network", to: "m78Dispute", label: "claim" }],
    packets: [{ from: "issuer", to: "network", label: "claim" }, { from: "network", to: "m78Dispute", label: "claim", delay: 55 }],
  },
  // Registered on the paid payment; evidence by a deadline.
  {
    cue: 4,
    layout: { bankStaff: [0, 1], record: [1.5, 1], shop: [3, 1] },
    edges: [{ from: "bankStaff", to: "record", label: "register" }, { from: "record", to: "shop", label: "told" }],
    packets: [{ from: "record", to: "shop", label: "dispute", delay: 40 }],
    badges: { record: "paid" },
  },
  {
    cue: 5,
    layout: ASK,
    edges: [{ from: "bankStaff", to: "shop", label: "evidence, please" }],
    packets: [{ from: "shop", to: "bankStaff", label: "evidence", delay: 60 }],
    badges: { shop: "deadline" },
    accent: ["m78Calendar"],
  },
  // Won or lost.
  {
    cue: 6,
    layout: { m78Dispute: [0.4, 1], record: [2.6, 1] },
    edges: [{ from: "m78Dispute", to: "record" }],
    badges: { m78Dispute: "won", record: "paid again" },
    accent: ["record"],
  },
  {
    cue: 7,
    layout: { m78Dispute: [0, 1.7], checker: [1.5, 0.3], buyer: [3, 1.7] },
    edges: [{ from: "m78Dispute", to: "buyer", label: "chargeback" }, { from: "checker", to: "m78Dispute", label: "approves" }],
    packets: [{ from: "m78Dispute", to: "buyer", label: "money back", delay: 60 }],
    badges: { m78Dispute: "lost", checker: "second admin" },
    danger: ["m78Dispute"],
  },
  // Every step written down.
  { cue: 8, layout: { journal: [1.5, 1] }, badges: { journal: "every step" }, accent: ["journal"] },
];
