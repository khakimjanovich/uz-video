import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 9: sealed bags in the locked room. The stolen database (0), the sealed bags (1), Vault (2–3),
// tied seals, blind index, sealed-only database (4–6), fails closed (7), opened only to send (8), removed (9), noise (10), the close (11).
const SEAL = { m2Coat: [0, 1], card: [1.4, 1], m2ZoneVault: [3, 0.2], m2Db: [3, 1.8] } as const;
const SEAL_EDGES = [
  { from: "m2Coat", to: "card" },
  { from: "card", to: "m2ZoneVault" },
  { from: "card", to: "m2Db" },
] as const;
const STOLEN = { m2Db: [0.8, 1], attacker: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A stolen database.
  { cue: 0, layout: STOLEN, packets: [{ from: "m2Db", to: "attacker", label: "a copy" }], badges: { m2Db: "card numbers?" } },
  // The sealed bags.
  {
    cue: 1,
    layout: { m2Coat: [0, 1], m2Bag: [1.5, 1], m2Machine: [3, 1] },
    edges: [{ from: "m2Coat", to: "m2Bag", label: "sealed" }, { from: "m2Machine", to: "m2Bag", label: "the only opener" }],
  },
  // The card vault keeps only the sealed value.
  {
    cue: 3,
    layout: SEAL,
    edges: [...SEAL_EDGES],
    packets: [
      { from: "card", to: "m2ZoneVault", label: "card number" },
      { from: "m2ZoneVault", to: "card", label: "sealed", delay: 55 },
      { from: "card", to: "m2Db", label: "sealed", delay: 90 },
    ],
    badges: { m2ZoneVault: "key stays here" },
  },
  {
    cue: 4,
    layout: { m2Db: [0.5, 1], m2OtherRow: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2OtherRow", label: "copied seal" }],
    danger: ["m2OtherRow"],
    badges: { m2OtherRow: "will not open" },
  },
  {
    cue: 5,
    layout: { m2Coat: [0, 1], m2ZoneVault: [1.5, 1], m2Fingerprint: [3, 1] },
    edges: [{ from: "m2Coat", to: "m2ZoneVault" }, { from: "m2ZoneVault", to: "m2Fingerprint", label: "stamp" }],
    accent: ["m2Fingerprint"],
    badges: { m2Fingerprint: "find, never open" },
  },
  {
    cue: 6,
    layout: { m2Coat: [0, 1], m2Db: [2.6, 1] },
    packets: [{ from: "m2Coat", to: "m2Db", label: "plain number", stopAt: 0.7 }],
    badges: { m2Db: "sealed only" },
  },
  // Vault down: stop, don't guess.
  {
    cue: 7,
    layout: { card: [0.6, 1], m2ZoneVault: [2.6, 1] },
    edges: [{ from: "card", to: "m2ZoneVault", broken: true }],
    danger: ["m2ZoneVault"],
    badges: { card: "stops" },
  },
  // Opened only for the network, and written down.
  {
    cue: 8,
    layout: { m2ZoneVault: [0, 0.2], card: [1.5, 1], network: [3, 1], m2UsageLog: [0, 1.8] },
    edges: [{ from: "m2ZoneVault", to: "card" }, { from: "card", to: "network" }, { from: "card", to: "m2UsageLog" }],
    packets: [{ from: "card", to: "network", label: "card number" }, { from: "card", to: "m2UsageLog", label: "used", delay: 50 }],
  },
  {
    cue: 9,
    layout: { m2Db: [0.8, 1], m2OldCard: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2OldCard" }],
    crossed: ["m2OldCard"],
    badges: { m2OldCard: "not used for long" },
  },
  // A stolen copy is noise.
  { cue: 10, layout: STOLEN, packets: [{ from: "m2Db", to: "attacker", label: "a copy" }], badges: { attacker: "just noise" } },
];

export const map: BuildMapStep[] = [
  { cue: 2, part: 2, current: ["card", "cardsinfra"], units: { cards: "Vault seals" } },
  { cue: 11, part: 2, current: ["bin"], units: { cards: "first digits" } },
];
