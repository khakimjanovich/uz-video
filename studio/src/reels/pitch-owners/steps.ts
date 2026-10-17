import { DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Owner pitch: opening, Pain, alert, 4 threats, money flow; planned picture-first in coaching.
// Feelings: connection -> regret -> hope; each gate is worry -> relief, and every gate protects Aziza or her money.
export const acts: ActsMap = { hook: 0 };

const coins = (from: AcquiringNodeId, to: AcquiringNodeId, label = "100 000") =>
  [10, 30, 50].map((delay) => ({ from, to, label, delay, duration: 22 }));

type Layout = Partial<Record<AcquiringNodeId, Slot>>;

const PAIR: Layout = { shoeshop: [0, 0.6], bank: [2, 0.6] };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // Opening 1 (connection): Aziza is your bank's client; her shop sits beside her.
  {
    cue: 0,
    layout: { bank: [1, 0.3], aziza: [0, 2.8], shoeshop: [2, 2.8] },
    edges: [
      { from: "bank", to: "aziza", label: "account" },
      { from: "aziza", to: "shoeshop" },
    ],
    accent: ["aziza"],
  },
  // Opening 2 (regret): customers pay, the money skips the bank into Payme / Click.
  {
    cue: 1,
    layout: { shoeshop: [0, 0.3], payorg: [2, 0.3], bank: [1, 2.8] },
    edges: [{ from: "shoeshop", to: "payorg" }],
    packets: coins("shoeshop", "payorg"),
    danger: ["bank"],
    badges: { bank: "0 so'm" },
  },
  // Hope 1: with own acquiring the coins land in the bank.
  {
    cue: 2,
    layout: { shoeshop: [0, 0.3], bank: [1, 2.8] },
    edges: [{ from: "shoeshop", to: "bank" }],
    packets: coins("shoeshop", "bank"),
    accent: ["bank"],
    badges: { bank: "commission" },
  },
  // Hope 2: the fee to the bank, the rest stays as Aziza's deposit.
  {
    cue: 3,
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
  // Alert: running payments means facing fraudsters; threats close in on the bank.
  {
    cue: 4,
    layout: { attacker: [0, 0.3], fakesite: [2, 0.3], bank: [1, 2.8] },
    edges: [
      { from: "attacker", to: "bank" },
      { from: "fakesite", to: "bank" },
    ],
    danger: ["attacker", "fakesite", "bank"],
    badges: { bank: "at risk?" },
  },
  // Alert: the four threats every bank fears close in from all sides.
  {
    cue: 5,
    layout: { attacker: [0, 0.2], fakesite: [2, 0.2], bank: [1, 1.95], payment: [0, 3.7], buyer: [2, 3.7] },
    edges: [
      { from: "fakesite", to: "bank" },
      { from: "attacker", to: "bank" },
      { from: "payment", to: "bank" },
      { from: "buyer", to: "bank" },
    ],
    danger: ["fakesite", "attacker", "payment", "buyer"],
    badges: { fakesite: "fake shop", attacker: "forged payment", payment: "double charge", buyer: "stolen card" },
    shake: { fakesite: 0.42, attacker: 0.53, payment: 0.7, buyer: 0.88 }, // in the order the voice names them
  },
  // Fake site worry: a too-good iPhone site looks as real as Aziza's shop.
  {
    cue: 6,
    layout: { shoeshop: [0, 1.2], fakesite: [2, 1.2], bank: [1, 3.6] },
    edges: [
      { from: "shoeshop", to: "bank" },
      { from: "fakesite", to: "bank" },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 10, duration: 40 },
      { from: "fakesite", to: "bank", label: "50 000", delay: 20, duration: 40 },
    ],
    danger: ["fakesite"],
    badges: { fakesite: "fake shop" },
  },
  // Fake site relief: two bank employees check every shop; only Aziza's connects.
  {
    cue: 7,
    layout: { admin: [0, 0.2], checker: [2, 0.2], shoeshop: [0, 2], fakesite: [2, 2], bank: [1, 3.8] },
    // Maker-checker: both admins check both shops before either can take payments.
    edges: [
      { from: "admin", to: "shoeshop" },
      { from: "admin", to: "fakesite" },
      { from: "checker", to: "shoeshop" },
      { from: "checker", to: "fakesite" },
      { from: "shoeshop", to: "bank" },
      { from: "fakesite", to: "bank" },
    ],
    // One shop at a time: both admins approve Aziza's shop and it connects; then both reject the fake one.
    packets: [
      { from: "admin", to: "shoeshop", label: "approve", delay: 6, duration: 20 },
      { from: "checker", to: "shoeshop", label: "approve", delay: 28, duration: 20 },
      { from: "shoeshop", to: "bank", label: "100 000", delay: 50, duration: 22 },
      { from: "admin", to: "fakesite", label: "reject", delay: 80, duration: 20 },
      { from: "checker", to: "fakesite", label: "reject", delay: 102, duration: 20 },
      { from: "fakesite", to: "bank", label: "50 000", delay: 124, duration: 22, stopAt: 0.5 },
    ],
    danger: ["fakesite"],
    shake: { fakesite: 0.72 },
  },
  // Forged amount worry: a hacker copies Aziza's payment and inflates it.
  {
    cue: 8,
    layout: { ...PAIR, attacker: [0, 3.4] },
    edges: [
      { from: "shoeshop", to: "bank" },
      { from: "attacker", to: "bank" },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 10 },
      { from: "attacker", to: "bank", label: "10 000 000", delay: 35, duration: 50 },
    ],
    danger: ["attacker"],
    badges: { attacker: "forged payment" },
  },
  // Forged amount relief: Aziza's signed payment passes, the forged copy bounces off.
  {
    cue: 9,
    layout: { ...PAIR, attacker: [0, 3.4] },
    edges: [
      { from: "shoeshop", to: "bank", label: "signed" },
      { from: "attacker", to: "bank", broken: true },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 10 },
      { from: "attacker", to: "bank", label: "10 000 000", delay: 35, stopAt: 0.55 },
    ],
    danger: ["attacker"],
    badges: { shoeshop: "signed" },
  },
  // Double charge worry: the same payment heads to the bank twice; the customer could be charged twice.
  {
    cue: 10,
    layout: { ...PAIR, buyer: [2, 3.4] },
    edges: [{ from: "shoeshop", to: "bank" }],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 8, duration: 40 },
      { from: "shoeshop", to: "bank", label: "100 000", delay: 26, duration: 40 },
    ],
    danger: ["buyer"],
    badges: { buyer: "double charge" },
  },
  // Double charge relief: the repeat is stopped; one charge, a happy customer.
  {
    cue: 11,
    layout: { ...PAIR, buyer: [2, 3.4] },
    edges: [
      { from: "shoeshop", to: "bank" },
      { from: "bank", to: "buyer" },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 10, duration: 25 },
      { from: "bank", to: "buyer", label: "−100 000", delay: 35, duration: 25 },
      { from: "shoeshop", to: "bank", label: "100 000", delay: 50, duration: 25, stopAt: 0.6 },
    ],
    accent: ["buyer"],
    badges: { buyer: "charged once" },
  },
  // Card worry: hackers go after Aziza's shop for card numbers.
  {
    cue: 12,
    layout: { attacker: [0, 0.6], shoeshop: [2, 0.6], bank: [1, 3.4] },
    edges: [{ from: "attacker", to: "shoeshop" }],
    packets: [{ from: "attacker", to: "shoeshop", label: "card numbers?", delay: 15, duration: 50 }],
    danger: ["attacker"],
    badges: { attacker: "stolen card" },
  },
  // Card relief: the card goes to the bank's own page, the shop keeps only a code; nothing to steal.
  {
    cue: 13,
    layout: { attacker: [0, 0.6], shoeshop: [2, 0.6], buyer: [0, 3.4], bank: [2, 3.4] },
    edges: [
      { from: "buyer", to: "bank", label: "card" },
      { from: "bank", to: "shoeshop", label: "code" },
      { from: "attacker", to: "shoeshop", broken: true },
    ],
    packets: [
      { from: "buyer", to: "bank", label: "8600 1234 5678 9012", delay: 10 },
      { from: "bank", to: "shoeshop", label: "x7Q2k…", delay: 40 },
      { from: "attacker", to: "shoeshop", label: "card numbers?", delay: 60, stopAt: 0.5 },
    ],
    danger: ["attacker"],
    badges: { shoeshop: "nothing to steal" },
  },
  // Money flow: hundreds of shops pay into the bank every day.
  {
    cue: 14,
    layout: { shoeshop: [0, 0.3], store2: [1, 0.3], store3: [2, 0.3], bank: [1, 2.8] },
    edges: [
      { from: "shoeshop", to: "bank" },
      { from: "store2", to: "bank" },
      { from: "store3", to: "bank" },
    ],
    packets: (["shoeshop", "store2", "store3"] as const).flatMap((from, i) =>
      [0, 1].map((k) => ({ from, to: "bank" as const, label: "100 000", delay: 8 + i * 8 + k * 26, duration: 22 })),
    ),
    accent: ["bank"],
    badges: { bank: "every day" },
  },
  // Money flow: the bank keeps its fee, each store's money stays in its account at the bank.
  {
    cue: 15,
    layout: { bank: [1, 0.3], feeacc: [0, 2.8], storeacc: [2, 2.8] },
    edges: [
      { from: "bank", to: "feeacc", label: "fee" },
      { from: "bank", to: "storeacc", label: "rest" },
    ],
    packets: [
      { from: "bank", to: "feeacc", label: "commission", delay: 15 },
      { from: "bank", to: "storeacc", label: "next day", delay: 40 },
    ],
    accent: ["feeacc", "storeacc"],
    badges: { storeacc: "at your bank" },
  },
];
