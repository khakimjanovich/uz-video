import { DiagramStep } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Owner pitch, chapters 1-3 (Pain, Gate 1, Gate 2). One beat per sentence, planned picture-first in coaching:
// show the money moving and where it doesn't go; show the protection in action, not its label.
export const acts: ActsMap = { hook: 0 };

const coins = (from: AcquiringNodeId, to: AcquiringNodeId, label = "100 000") =>
  [10, 30, 50].map((delay) => ({ from, to, label, delay, duration: 22 }));

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // Pain 1: coins fly past the bank into Payme / Click; the bank stays empty.
  {
    cue: 0,
    layout: { buyer: [0, 0.3], payorg: [2, 0.3], bank: [1, 2.8] },
    edges: [{ from: "buyer", to: "payorg" }],
    packets: coins("buyer", "payorg"),
    danger: ["bank"],
    badges: { bank: "0 so'm" },
  },
  // Pain 2: coins now land in the bank.
  {
    cue: 1,
    layout: { buyer: [0, 0.3], bank: [1, 2.8] },
    edges: [{ from: "buyer", to: "bank" }],
    packets: coins("buyer", "bank"),
    accent: ["bank"],
    badges: { bank: "commission" },
  },
  // Pain 3: a small coin to the fee, the big pile to the store account, both inside the bank.
  {
    cue: 2,
    layout: { bank: [1, 0.3], feeacc: [0, 2.8], storeacc: [2, 2.8] },
    edges: [
      { from: "bank", to: "feeacc", label: "fee" },
      { from: "bank", to: "storeacc", label: "rest" },
    ],
    packets: [
      { from: "bank", to: "feeacc", label: "1 500", delay: 15 },
      { from: "bank", to: "storeacc", label: "98 500", delay: 40 },
    ],
    accent: ["storeacc"],
    badges: { storeacc: "deposit" },
  },
  // Gate 1, beat 1: two admin stamps, then the door opens.
  {
    cue: 3,
    layout: { merchant: [1, 0], admin: [0, 1.9], checker: [2, 1.9], bank: [1, 3.8] },
    edges: [
      { from: "merchant", to: "admin", label: "documents" },
      { from: "admin", to: "checker" },
      { from: "checker", to: "bank", label: "go live" },
    ],
    packets: [
      { from: "merchant", to: "admin", label: "documents", delay: 10 },
      { from: "admin", to: "checker", label: "stamp 1", delay: 45 },
      { from: "checker", to: "bank", label: "stamp 2", delay: 80 },
    ],
    accent: ["bank"],
    badges: { admin: "checked", checker: "sanctions ok" },
  },
  // Gate 1, beat 2: the real site connects, the fake one is cut off.
  {
    cue: 4,
    layout: { admin: [1, 0], salespoint: [0, 1.9], fakesite: [2, 1.9], bank: [1, 3.8] },
    edges: [
      { from: "salespoint", to: "bank" },
      { from: "fakesite", to: "bank", broken: true },
    ],
    packets: [
      { from: "salespoint", to: "bank", label: "payment", delay: 20 },
      { from: "fakesite", to: "bank", label: "payment", delay: 20, stopAt: 0.5 },
    ],
    danger: ["fakesite"],
    badges: { salespoint: "site ok", fakesite: "rejected" },
  },
  // Gate 1, beat 3: emergency brake, the store's line is cut.
  {
    cue: 5,
    layout: { merchant: [0, 1.2], bank: [2, 1.2], admin: [1, 3.6] },
    edges: [
      { from: "merchant", to: "bank", broken: true },
      { from: "admin", to: "merchant", label: "stop" },
    ],
    packets: [{ from: "merchant", to: "bank", label: "payment", delay: 25, stopAt: 0.5 }],
    danger: ["merchant"],
    badges: { merchant: "suspended" },
  },
  // Gate 2, beat 1: the signed request passes, the forged copy bounces off.
  {
    cue: 6,
    layout: { merchant: [0, 0.6], bank: [2, 0.6], attacker: [0, 3.4] },
    edges: [
      { from: "merchant", to: "bank", label: "signed" },
      { from: "attacker", to: "bank", broken: true },
    ],
    packets: [
      { from: "merchant", to: "bank", label: "signed", delay: 10 },
      { from: "attacker", to: "bank", label: "forged", delay: 35, stopAt: 0.55 },
    ],
    danger: ["attacker"],
  },
  // Gate 2, beat 2: the retry hits the same-key lock; one charge on the card.
  {
    cue: 7,
    layout: { merchant: [0, 0.6], bank: [2, 0.6], buyer: [2, 3.4] },
    edges: [
      { from: "merchant", to: "bank", label: "pay" },
      { from: "bank", to: "buyer", label: "charge" },
    ],
    packets: [
      { from: "merchant", to: "bank", label: "pay", delay: 10, duration: 25 },
      { from: "bank", to: "buyer", label: "−100 000", delay: 35, duration: 25 },
      { from: "merchant", to: "bank", label: "pay again", delay: 50, duration: 25, stopAt: 0.6 },
    ],
    accent: ["buyer"],
    badges: { bank: "same key", buyer: "charged once" },
  },
  // Gate 2, beat 3: the store check goes dark; the payment waits at the gate.
  {
    cue: 8,
    layout: { merchant: [0, 0.6], bank: [2, 0.6], statuscheck: [2, 3.4] },
    edges: [
      { from: "merchant", to: "bank" },
      { from: "bank", to: "statuscheck", broken: true },
    ],
    packets: [{ from: "merchant", to: "bank", label: "payment", delay: 15, stopAt: 0.55 }],
    danger: ["statuscheck"],
    badges: { statuscheck: "down", bank: "says no" },
  },
];
