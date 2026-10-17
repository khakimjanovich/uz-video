import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 13: BIN lookup and tokenization (bin-reference-service, card-processor-service, encryption-starter).
export const map: BuildMapStep[] = [
  { cue: 0, part: 3, current: ["card"], built: [...builtBefore(3), "procport", "procsvc"] },
  { cue: 8, part: 4, current: ["payment", "merchant"], built: builtBefore(4) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { buyer: [0.5, 1], bin: [2.5, 1] }, edges: [{ from: "buyer", to: "bin", label: "lookup" }], packets: [{ from: "buyer", to: "bin", label: "8600 12…", delay: 15 }], badges: { bin: "Uzcard" } },
  { cue: 2, layout: { sweep: [0, 1], bin: [1.5, 1], uzcard: [3, 0], humo: [3, 2] }, edges: [{ from: "sweep", to: "bin", label: "sync" }, { from: "uzcard", to: "bin" }, { from: "humo", to: "bin" }] },
  { cue: 3, layout: { card: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "card", to: "postgres" }], danger: ["postgres"], badges: { postgres: "8600 1234 5678 9012" } },
  {
    cue: 4,
    layout: { buyer: [0, 1], card: [1.5, 1], payment: [3, 1] },
    edges: [{ from: "buyer", to: "card" }, { from: "card", to: "payment" }],
    packets: [{ from: "buyer", to: "card", label: "8600 1234…", delay: 8 }, { from: "card", to: "payment", label: "tok_7Hq2", delay: 42 }],
    accent: ["card"],
    badges: { card: "AES-GCM" },
  },
  { cue: 5, layout: { payment: [0, 1], card: [1.5, 1], processing: [3, 1] }, edges: [{ from: "payment", to: "card", label: "token" }, { from: "card", to: "processing", label: "reveal" }], packets: [{ from: "card", to: "processing", label: "card number", delay: 25 }] },
  { cue: 6, layout: { card: [0.5, 1], journal: [2.5, 1] }, edges: [{ from: "card", to: "journal", label: "every reveal" }], accent: ["journal"] },
  { cue: 7, layout: { attacker: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "attacker", to: "postgres", label: "breach" }], danger: ["attacker"], badges: { postgres: "ciphertext + tokens" } },
];
