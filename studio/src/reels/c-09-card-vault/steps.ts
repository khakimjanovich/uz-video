import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 9: sealed bags in the locked room. The worst day (0–5), the sealed bags (6–9), Vault seals (10–17),
// the blind index (18–25), the database refuses plain numbers (26–28), fail closed (29–32), opened only to send,
// written down, removed (33–36), the product (37–49), the leak again (50–54), what it protects (55–58), the close (59–64).
const STOLEN = { m2Db: [0.8, 1], attacker: [3, 1] } as const;
const LEAK = { layout: STOLEN, packets: [{ from: "m2Db" as const, to: "attacker" as const, label: "a copy" }] };
const BAGS = { m2Coat: [0, 1], m2Bag: [1.5, 1], m2Machine: [3, 1] } as const;
const BAG_EDGES = [{ from: "m2Coat", to: "m2Bag", label: "sealed" }, { from: "m2Machine", to: "m2Bag" }] as const;
const SEAL = { m2Coat: [0, 1], card: [1.4, 1], m2ZoneVault: [3, 0.2], m2Db: [3, 1.8] } as const;
const SEAL_EDGES = [{ from: "m2Coat", to: "card" }, { from: "card", to: "m2ZoneVault" }, { from: "card", to: "m2Db" }] as const;
const S = { layout: SEAL, edges: [...SEAL_EDGES] };
const STAMP = { m2Coat: [0, 1], m2ZoneVault: [1.5, 1], m2Fingerprint: [3, 1] } as const;
const STAMP_EDGES = [{ from: "m2Coat", to: "m2ZoneVault" }, { from: "m2ZoneVault", to: "m2Fingerprint", label: "stamp" }] as const;
const F = { layout: STAMP, edges: [...STAMP_EDGES] };
const DOWN = { card: [0.6, 1], m2ZoneVault: [2.6, 1] } as const;
const ALERT = { card: [0, 0.4], m2ZoneVault: [2.4, 0.4], m2Alert: [0, 1.9], m2Team: [2.4, 1.9] } as const;
const ALERT_EDGES = [{ from: "card", to: "m2ZoneVault", broken: true }, { from: "m2Alert", to: "m2Team" }] as const;
const NOISE = { m2Db: [0, 0.2], backup: [0, 1.8], attacker: [2.6, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The worst day.
  { cue: 0, ...LEAK, badges: { m2Db: "card numbers?" } },
  { cue: 2, ...LEAK, danger: ["m2Db"] },
  { cue: 3, ...LEAK, danger: ["m2Db"], badges: { attacker: "every card" } },
  {
    cue: 4,
    layout: { m2Db: [0.8, 0.4], m2Key: [0.8, 1.9], attacker: [3, 1] },
    packets: [{ from: "m2Db", to: "attacker", label: "locked numbers" }, { from: "m2Key", to: "attacker", label: "the key", delay: 40 }],
    badges: { attacker: "still every card" },
  },
  { cue: 5, layout: { m2Db: [0.4, 1], m2Key: [2.6, 1] }, accent: ["m2Key"], badges: { m2Key: "never next to it" } },
  // The sealed bags.
  { cue: 7, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Bag"] },
  { cue: 8, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Machine"], badges: { m2Machine: "seals · opens" } },
  { cue: 9, layout: BAGS, edges: [...BAG_EDGES], badges: { m2Machine: "keeps its key" } },
  // Vault seals.
  { cue: 11, ...S, packets: [{ from: "m2Coat", to: "card", label: "card number" }, { from: "card", to: "m2ZoneVault", label: "card number", delay: 45 }] },
  { cue: 12, ...S, packets: [{ from: "m2ZoneVault", to: "card", label: "sealed" }] },
  { cue: 13, ...S, packets: [{ from: "card", to: "m2Db", label: "sealed" }], badges: { m2Db: "sealed only" } },
  { cue: 14, ...S, accent: ["m2ZoneVault"], badges: { m2ZoneVault: "key stays here" } },
  { cue: 15, layout: { m2Bag: [0.4, 1], m2Coat: [2.6, 1] }, edges: [{ from: "m2Bag", to: "m2Coat", label: "tied to" }], badges: { m2Bag: "its own card" } },
  {
    cue: 16,
    layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2OtherRow", label: "copied seal" }],
    danger: ["m2OtherRow"],
    badges: { m2OtherRow: "will not open" },
  },
  { cue: 17, layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OtherRow" }], crossed: ["m2OtherRow"], badges: { m2Db: "no shuffling" } },
  // The blind index.
  { cue: 18, layout: { card: [0.4, 1], m2Bag: [2.6, 1] }, edges: [{ from: "card", to: "m2Bag", label: "which bag?" }] },
  { cue: 20, layout: { card: [0.4, 1], m2Bag: [2.6, 1] }, edges: [{ from: "card", to: "m2Bag", label: "which bag?" }], badges: { m2Bag: "stays shut" } },
  { cue: 21, ...F, accent: ["m2Fingerprint"] },
  { cue: 22, ...F, badges: { m2Fingerprint: "same every time" } },
  { cue: 23, ...F, packets: [{ from: "m2Fingerprint", to: "m2Coat", label: "back?", stopAt: 0.5 }], badges: { m2Fingerprint: "one way" } },
  { cue: 24, ...F, badges: { m2Fingerprint: "blind index" } },
  {
    cue: 25,
    layout: { card: [0.4, 1], m2Fingerprint: [2.6, 1] },
    edges: [{ from: "card", to: "m2Fingerprint", label: "look up" }],
    badges: { card: "never the number" },
  },
  // The database refuses plain numbers.
  { cue: 26, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, accent: ["m2Db"], badges: { m2Db: "guards the door" } },
  { cue: 27, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "plain number", stopAt: 0.7 }], badges: { m2Db: "sealed only" } },
  { cue: 28, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "a mistake", stopAt: 0.7 }], badges: { m2Db: "refused" } },
  // Fail closed.
  { cue: 29, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"] },
  { cue: 30, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "stops" } },
  { cue: 31, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "never guesses" } },
  { cue: 32, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "fail closed" } },
  // Opened only to send; written down; removed.
  {
    cue: 33,
    layout: { m2ZoneVault: [0, 1], card: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m2ZoneVault", to: "card" }, { from: "card", to: "network" }],
    packets: [{ from: "card", to: "network", label: "card number" }],
    badges: { network: "for a charge" },
  },
  {
    cue: 34,
    layout: { card: [0.4, 1], m2UsageLog: [2.6, 1] },
    edges: [{ from: "card", to: "m2UsageLog" }],
    packets: [{ from: "card", to: "m2UsageLog", label: "what · who · when" }],
  },
  { cue: 35, layout: { m2Db: [0.8, 1], m2OldCard: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OldCard" }], crossed: ["m2OldCard"], badges: { m2OldCard: "unused too long" } },
  { cue: 36, layout: { m2Db: [0.8, 1], m2Note: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2Note" }], accent: ["m2Note"] },
  // Watch the product: nothing on screen inside the room.
  { cue: 37, layout: { buyer: [0, 1], card: [1.5, 1], m2Team: [3, 1] }, frames: [{ label: "Locked room", from: [1.5, 1], to: [1.5, 1], tone: "wall" }], accent: ["buyer", "m2Team"] },
  // Vault stops answering.
  { cue: 44, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"] },
  { cue: 46, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", broken: true }], badges: { m2Db: "nothing saved" } },
  { cue: 47, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m2Alert", to: "m2Team", label: "alert" }], badges: { m2Alert: "unavailable" } },
  { cue: 48, layout: ALERT, edges: [...ALERT_EDGES], danger: ["m2ZoneVault"], badges: { m2Alert: "names the part" } },
  {
    cue: 49,
    layout: S.layout,
    edges: [...SEAL_EDGES],
    packets: [{ from: "card", to: "m2ZoneVault", label: "card number" }, { from: "m2ZoneVault", to: "card", label: "sealed", delay: 50 }],
    badges: { m2ZoneVault: "back" },
  },
  // The leaked copy again.
  { cue: 50, ...LEAK },
  { cue: 51, ...LEAK, badges: { attacker: "opens it" } },
  { cue: 52, ...LEAK, badges: { m2Db: "sealed · stamps · masked" } },
  { cue: 53, ...LEAK, badges: { attacker: "no keys" } },
  { cue: 54, layout: { ...NOISE, m2ZoneVault: [1.3, 1] }, edges: [], packets: [{ from: "backup", to: "attacker", label: "a backup" }], badges: { backup: "kept apart" } },
  // What it protects.
  { cue: 56, layout: { buyer: [0.4, 1], card: [2.6, 1] }, frames: [{ label: "Locked room", from: [2.6, 1], to: [2.6, 1], tone: "wall" }], accent: ["buyer"] },
  {
    cue: 57,
    layout: { m2Db: [0, 0], backup: [0, 1], m2Insider: [0, 2], attacker: [2.6, 1] },
    edges: [{ from: "m2Db", to: "attacker" }, { from: "backup", to: "attacker" }, { from: "m2Insider", to: "attacker" }],
    badges: { attacker: "all noise" },
  },
  { cue: 58, ...LEAK, badges: { attacker: "not a leak of cards" } },
  // The close.
  { cue: 59, layout: BAGS, edges: [...BAG_EDGES] },
  { cue: 60, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Machine"], badges: { m2Machine: "keeps its key" } },
  { cue: 61, ...F, accent: ["m2Fingerprint"], badges: { m2Fingerprint: "finds, never opens" } },
  { cue: 62, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "unsealed", stopAt: 0.7 }], badges: { m2Db: "refuses" } },
  { cue: 63, ...LEAK, badges: { attacker: "just noise" } },
];

export const map: BuildMapStep[] = [
  { cue: 6, part: 3, current: ["card", "frame", "bin", "adapters"], units: { cards: "locked room" } },
  { cue: 10, part: 3, current: ["card", "cardsinfra"], units: { cards: "Vault seals" } },
  { cue: 64, part: 3, current: ["bin"], units: { cards: "first digits" } },
];

// What each side sees: the frame's "Card accepted", the masked line, a refusal while Vault is down.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
export const screens: ScreenStep[] = [
  { cue: 39, src: "screens/c-09-card-vault/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 40, src: "screens/c-09-card-vault/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  {
    cue: 41,
    src: "screens/c-09-card-vault/masked.png",
    title: "Payment page · the masked line",
    region: [...LINE],
    focus: [[700, 293, 150, 28]],
    beats: [
      { cue: 42, region: [...LINE], focus: [[540, 293, 170, 28]] },
      { cue: 43, region: [...LINE], focus: [[540, 293, 310, 28]] },
    ],
  },
  { cue: 45, src: "screens/c-09-card-vault/vault-down.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 554, 340, 52]] },
];
