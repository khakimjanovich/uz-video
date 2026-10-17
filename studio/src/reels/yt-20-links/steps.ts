import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 20: payment links (PaymentLinkServiceImpl, link claim, PaymentLinkExpirySweep).
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant"], built: [...B] },
  { cue: 5, part: 4, current: ["payment", "buyer"], built: [...B] },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { shop: [0.5, 1], payment: [2.5, 1] }, edges: [{ from: "shop", to: "payment", label: "create link" }], packets: [{ from: "shop", to: "payment", label: "250 000 · shoes", delay: 15 }] },
  { cue: 2, layout: { shop: [0, 1], buyer: [1.5, 1], payment: [3, 1] }, edges: [{ from: "shop", to: "buyer", label: "chat" }, { from: "buyer", to: "payment", label: "bank page" }], packets: [{ from: "shop", to: "buyer", label: "pay.link/7Q", delay: 8 }, { from: "buyer", to: "payment", label: "open", delay: 40 }] },
  { cue: 3, layout: { buyer: [0, 0], attacker: [0, 2], payment: [2, 1] }, edges: [{ from: "buyer", to: "payment", label: "claim" }, { from: "attacker", to: "payment", broken: true, label: "already claimed" }], packets: [{ from: "buyer", to: "payment", label: "claim", delay: 8 }, { from: "attacker", to: "payment", label: "claim", delay: 30, stopAt: 0.55 }] },
  { cue: 4, layout: { sweep: [0.5, 1], payment: [2.5, 1] }, edges: [{ from: "sweep", to: "payment", label: "expire" }], packets: [{ from: "sweep", to: "payment", label: "old links", delay: 15 }], badges: { payment: "configured TTL" } },
];
