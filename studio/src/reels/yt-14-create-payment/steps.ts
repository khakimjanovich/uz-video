import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 14: POST /payments (HmacAuthenticationFilter, VaultMerchantSecretProvider, IdempotencyService, SalesPointGuard).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant", "vault"], built: B4 },
  { cue: 10, part: 4, current: ["payment", "buyer", "card"], built: B4 },
];

const PAIR = { merchant: [0, 1], payment: [2, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...PAIR }, edges: [{ from: "merchant", to: "payment", label: "POST /payments" }], packets: [{ from: "merchant", to: "payment", label: "amount · order · return URL", delay: 15 }] },
  { cue: 2, layout: { ...PAIR, attacker: [0, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", label: "stolen token" }], danger: ["attacker"] },
  { cue: 3, layout: { ...PAIR }, edges: [{ from: "merchant", to: "payment", label: "signed" }], packets: [{ from: "merchant", to: "payment", label: "X-Signature", delay: 15 }], badges: { merchant: "HMAC-SHA256" } },
  { cue: 4, layout: { ...PAIR, vault: [2, 0] }, edges: [{ from: "merchant", to: "payment" }, { from: "vault", to: "payment", label: "secret/merchants" }], accent: ["vault"] },
  {
    cue: 5,
    layout: { ...PAIR, attacker: [0, 2], redis: [3, 2] },
    edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", broken: true, label: "replay" }, { from: "payment", to: "redis", label: "nonce" }],
    packets: [{ from: "attacker", to: "payment", label: "same request", delay: 15, stopAt: 0.55 }],
    danger: ["attacker"],
  },
  {
    cue: 6,
    layout: { ...PAIR, record: [3.0, 1] },
    edges: [{ from: "merchant", to: "payment", label: "Idempotency-Key" }, { from: "payment", to: "record" }],
    packets: [{ from: "merchant", to: "payment", label: "key A", delay: 8 }, { from: "merchant", to: "payment", label: "key A (retry)", delay: 40 }],
    badges: { record: "one payment" },
  },
  { cue: 7, layout: { ...PAIR, postgres: [2, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "payment", to: "postgres", label: "stored response" }], badges: { payment: "same body → replay · new body → refuse" } },
  { cue: 8, layout: { payment: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "payment", to: "salespoint", label: "active?" }], packets: [{ from: "payment", to: "salespoint", label: "check", delay: 15 }], badges: { payment: "can't tell → refuse" } },
  { cue: 9, layout: { ...PAIR }, edges: [{ from: "payment", to: "merchant" }], packets: [{ from: "payment", to: "merchant", label: "payment link", delay: 15 }], accent: ["payment"] },
];
