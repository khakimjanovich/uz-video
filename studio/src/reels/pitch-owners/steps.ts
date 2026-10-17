import { DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Owner pitch, opening + Pain + Gates 1-2, planned picture-first in coaching.
// Feelings: connection -> regret -> hope; each gate beat is worry (threat appears) -> relief (the gate stops it).
export const acts: ActsMap = { hook: 0 };

const coins = (from: AcquiringNodeId, to: AcquiringNodeId, label = "100 000") =>
  [10, 30, 50].map((delay) => ({ from, to, label, delay, duration: 22 }));

type Layout = Partial<Record<AcquiringNodeId, Slot>>;

const GATE1: Layout = { admin: [0, 1.9], checker: [2, 1.9], bank: [1, 3.8] };
const PAIR: Layout = { merchant: [0, 0.6], bank: [2, 0.6] };

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
  // Gate 1 worry: a shell company heads for the bank's door.
  {
    cue: 4,
    layout: { shellco: [1, 0.3], bank: [1, 3.8] },
    edges: [{ from: "shellco", to: "bank" }],
    packets: [{ from: "shellco", to: "bank", label: "application", delay: 15, duration: 60 }],
    danger: ["shellco"],
    badges: { shellco: "real?" },
  },
  // Gate 1 relief: two admins check documents and sanctions; the door stays shut.
  {
    cue: 5,
    layout: { shellco: [1, 0], ...GATE1 },
    edges: [
      { from: "shellco", to: "admin", label: "documents" },
      { from: "admin", to: "checker" },
      { from: "checker", to: "bank", broken: true },
    ],
    packets: [
      { from: "shellco", to: "admin", label: "documents", delay: 10 },
      { from: "admin", to: "checker", label: "check 1", delay: 40 },
      { from: "checker", to: "bank", label: "check 2", delay: 70, stopAt: 0.5 },
    ],
    crossed: ["shellco"],
    badges: { admin: "documents", checker: "sanctions hit" },
  },
  // Gate 1 worry: a too-good-to-be-true website looks real.
  {
    cue: 6,
    layout: { fakesite: [1, 0.6], bank: [1, 3.6] },
    edges: [{ from: "fakesite", to: "bank" }],
    packets: [{ from: "fakesite", to: "bank", label: "iPhone · 50 000", delay: 15, duration: 60 }],
    badges: { fakesite: "looks real" },
  },
  // Gate 1 relief: the real site connects, the fake one is cut off.
  {
    cue: 7,
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
  // Gate 1 worry: an approved store suddenly sprays payments.
  {
    cue: 8,
    layout: { merchant: [0, 1.2], bank: [2, 1.2] },
    edges: [{ from: "merchant", to: "bank" }],
    packets: [0, 1, 2, 3, 4, 5].map((i) => ({ from: "merchant" as const, to: "bank" as const, label: "payment", delay: 8 + i * 9, duration: 18 })),
    badges: { merchant: "approved", bank: "suspicious" },
  },
  // Gate 1 relief: the stop button cuts the store's line.
  {
    cue: 9,
    layout: { merchant: [0, 1.2], bank: [2, 1.2], admin: [1, 3.6] },
    edges: [
      { from: "merchant", to: "bank", broken: true },
      { from: "admin", to: "merchant", label: "stop" },
    ],
    packets: [{ from: "merchant", to: "bank", label: "payment", delay: 25, stopAt: 0.5 }],
    danger: ["merchant"],
    badges: { merchant: "suspended" },
  },
  // Gate 2 worry: a hacker copies a real request and inflates the amount.
  {
    cue: 10,
    layout: { ...PAIR, attacker: [0, 3.4] },
    edges: [
      { from: "merchant", to: "bank" },
      { from: "attacker", to: "bank" },
    ],
    packets: [
      { from: "merchant", to: "bank", label: "100 000", delay: 10 },
      { from: "attacker", to: "bank", label: "10 000 000", delay: 35, duration: 50 },
    ],
    danger: ["attacker"],
  },
  // Gate 2 relief: the signed request passes, the forged copy bounces off.
  {
    cue: 11,
    layout: { ...PAIR, attacker: [0, 3.4] },
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
  // Gate 2 worry: the same payment is sent twice; the phone buzzes twice.
  {
    cue: 12,
    layout: { ...PAIR, buyer: [2, 3.4] },
    edges: [
      { from: "merchant", to: "bank" },
      { from: "bank", to: "buyer" },
    ],
    packets: [
      { from: "merchant", to: "bank", label: "pay", delay: 8, duration: 20 },
      { from: "merchant", to: "bank", label: "pay again", delay: 22, duration: 20 },
      { from: "bank", to: "buyer", label: "−100 000", delay: 32, duration: 22 },
      { from: "bank", to: "buyer", label: "−100 000", delay: 46, duration: 22 },
    ],
    danger: ["buyer"],
    badges: { buyer: "buzz · buzz" },
  },
  // Gate 2 relief: the retry hits the same-key lock; one charge.
  {
    cue: 13,
    layout: { ...PAIR, buyer: [2, 3.4] },
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
  // Gate 2 worry: the store check goes dark; a suspended store tries to sneak through.
  {
    cue: 14,
    layout: { ...PAIR, statuscheck: [2, 3.4] },
    edges: [
      { from: "merchant", to: "bank" },
      { from: "bank", to: "statuscheck", broken: true },
    ],
    packets: [{ from: "merchant", to: "bank", label: "payment", delay: 15, duration: 60 }],
    danger: ["statuscheck", "merchant"],
    badges: { merchant: "suspended", statuscheck: "down" },
  },
  // Gate 2 relief: fail closed, the payment waits at the gate.
  {
    cue: 15,
    layout: { ...PAIR, statuscheck: [2, 3.4] },
    edges: [
      { from: "merchant", to: "bank", broken: true },
      { from: "bank", to: "statuscheck", broken: true },
    ],
    packets: [{ from: "merchant", to: "bank", label: "payment", delay: 15, stopAt: 0.55 }],
    danger: ["statuscheck"],
    badges: { statuscheck: "down", bank: "says no" },
  },
];
