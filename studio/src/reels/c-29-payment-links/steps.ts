import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 29: a bill with a pay button. The seller without a website (0–1), the link (2–5),
// the same payment page (6), the closed link (7), the close (8).
const BILL = { m6Portal: [0, 1], m6Bill: [1.5, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 0,
    layout: { buyer: [0, 1], m6Seller: [3, 1] },
    edges: [{ from: "buyer", to: "m6Seller" }],
    packets: [{ from: "buyer", to: "m6Seller", label: "card?" }],
  },
  {
    cue: 1,
    layout: { buyer: [0, 1], m6Messenger: [1.5, 1], m6Seller: [3, 1] },
    edges: [{ from: "buyer", to: "m6Messenger" }, { from: "m6Messenger", to: "m6Seller" }],
    packets: [{ from: "buyer", to: "m6Messenger", label: "order" }, { from: "m6Messenger", to: "m6Seller", label: "order", delay: 45 }],
    badges: { m6Seller: "no code" },
  },
  {
    cue: 2,
    layout: { m6Seller: [0, 1], m6Bill: [1.5, 1], buyer: [3, 1] },
    edges: [{ from: "m6Seller", to: "m6Bill" }, { from: "m6Bill", to: "buyer" }],
    packets: [{ from: "m6Bill", to: "buyer", label: "pay here", delay: 30 }],
    accent: ["m6Bill"],
  },
  {
    cue: 3,
    layout: BILL,
    edges: [{ from: "m6Portal", to: "m6Bill", label: "live website" }],
    accent: ["m6Portal"],
    badges: { m6Bill: "amount · purpose · expiry" },
  },
  {
    cue: 4,
    layout: { ...BILL, m6Payment: [3, 1] },
    edges: [{ from: "m6Portal", to: "m6Bill" }, { from: "m6Bill", to: "m6Payment", label: "behind it" }],
    badges: { m6Payment: "website limits" },
  },
  {
    cue: 5,
    layout: { ...BILL, m6Fingerprint: [3, 1] },
    edges: [{ from: "m6Portal", to: "m6Bill" }, { from: "m6Bill", to: "m6Fingerprint", label: "keeps" }],
    packets: [{ from: "m6Bill", to: "m6Portal", label: "shown once" }],
    accent: ["m6Fingerprint"],
  },
  {
    cue: 6,
    layout: { buyer: [0, 1], m6Bill: [1.5, 1], m6Page: [3, 1] },
    edges: [{ from: "buyer", to: "m6Bill" }, { from: "m6Bill", to: "m6Page" }],
    packets: [{ from: "buyer", to: "m6Bill", label: "open" }, { from: "m6Bill", to: "m6Page", label: "pay", delay: 45 }],
    badges: { m6Page: "same page" },
  },
  { cue: 7, layout: { m6Bill: [1.5, 1] }, crossed: ["m6Bill"], badges: { m6Bill: "closed" } },
];

export const map: BuildMapStep[] = [{ cue: 8, part: 6, current: ["merchant", "payment"], units: { ecom: "money back" } }];
