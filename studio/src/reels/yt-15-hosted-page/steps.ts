import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 15: the hosted session (PaymentSessionServiceImpl, CardVerificationServiceImpl, OtpChallengeServiceImpl).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "buyer", "card"], built: B4 },
  { cue: 8, part: 4, current: ["payment", "procport", "terminal"], built: B4 },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { buyer: [0, 1], shop: [2, 1] }, edges: [{ from: "buyer", to: "shop", label: "card number" }], danger: ["shop"], badges: { shop: "PCI DSS · breach" } },
  { cue: 2, layout: { buyer: [0, 1], payment: [2, 1] }, edges: [{ from: "buyer", to: "payment", label: "bank page" }], packets: [{ from: "buyer", to: "payment", label: "session link", delay: 15 }], accent: ["payment"] },
  { cue: 3, layout: { payment: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "payment", to: "postgres", label: "hash only" }], badges: { postgres: "configured TTL" } },
  { cue: 4, layout: { buyer: [0, 1], card: [1.5, 1], payment: [3, 1] }, edges: [{ from: "buyer", to: "card" }, { from: "card", to: "payment" }], packets: [{ from: "buyer", to: "card", label: "8600 1234…", delay: 8 }, { from: "card", to: "payment", label: "tok_7Hq2", delay: 40 }] },
  { cue: 5, layout: { payment: [0, 1], port: [1.5, 1], buyer: [3, 1] }, edges: [{ from: "payment", to: "port" }, { from: "port", to: "buyer", label: "scheme or SMS" }], packets: [{ from: "port", to: "buyer", label: "one-time code", delay: 20 }] },
  { cue: 6, layout: { buyer: [0, 0], payment: [1.5, 1], redis: [3, 1] }, edges: [{ from: "buyer", to: "payment" }, { from: "payment", to: "redis", label: "lock" }], packets: [{ from: "buyer", to: "payment", label: "submit", delay: 8 }, { from: "buyer", to: "payment", label: "submit", delay: 24, stopAt: 0.7 }], badges: { redis: "one at a time" } },
  { cue: 7, layout: { buyer: [0, 1], payment: [2, 1] }, edges: [{ from: "buyer", to: "payment", broken: true }], packets: [0, 1, 2].map((k) => ({ from: "buyer" as const, to: "payment" as const, label: "wrong", delay: 8 + k * 16, duration: 18, stopAt: 0.85 })), danger: ["payment"], badges: { payment: "session closed" } },
];
