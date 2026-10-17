import { DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Owner pitch: opening + Pain + 3 gates, planned picture-first in coaching.
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
  // Fake site worry: a too-good iPhone site looks as real as Aziza's shop.
  {
    cue: 4,
    layout: { shoeshop: [0, 1.2], fakesite: [2, 1.2], bank: [1, 3.6] },
    edges: [
      { from: "shoeshop", to: "bank" },
      { from: "fakesite", to: "bank" },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 10, duration: 40 },
      { from: "fakesite", to: "bank", label: "50 000", delay: 20, duration: 40 },
    ],
    badges: { fakesite: "looks real" },
  },
  // Fake site relief: two bank employees check every shop; only Aziza's connects.
  {
    cue: 5,
    layout: { admin: [0, 0.2], checker: [2, 0.2], shoeshop: [0, 2], fakesite: [2, 2], bank: [1, 3.8] },
    edges: [
      { from: "admin", to: "shoeshop" },
      { from: "checker", to: "fakesite" },
      { from: "shoeshop", to: "bank" },
      { from: "fakesite", to: "bank", broken: true },
    ],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 30 },
      { from: "fakesite", to: "bank", label: "50 000", delay: 30, stopAt: 0.5 },
    ],
    danger: ["fakesite"],
    badges: { shoeshop: "checked", fakesite: "rejected" },
  },
  // Forged amount worry: a hacker copies Aziza's payment and inflates it.
  {
    cue: 6,
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
  },
  // Forged amount relief: Aziza's signed payment passes, the forged copy bounces off.
  {
    cue: 7,
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
    cue: 8,
    layout: { ...PAIR, buyer: [2, 3.4] },
    edges: [{ from: "shoeshop", to: "bank" }],
    packets: [
      { from: "shoeshop", to: "bank", label: "100 000", delay: 8, duration: 40 },
      { from: "shoeshop", to: "bank", label: "100 000", delay: 26, duration: 40 },
    ],
    danger: ["buyer"],
    badges: { buyer: "charged twice?" },
  },
  // Double charge relief: the repeat is stopped; one charge, a happy customer.
  {
    cue: 9,
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
];
