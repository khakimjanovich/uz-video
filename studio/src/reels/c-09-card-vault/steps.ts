import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 9: sealed bags in the locked room. The worst day (0–8), the sealed bags (9–12), Vault seals (13–20),
// the blind index (21–28), the database refuses plain numbers (29–31), fail closed (32–35), opened only to send,
// written down, removed (36–39), the product (40–52), the leak again (53–57), what it protects (58–61), the close (62–67).
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
  { cue: 5, ...LEAK, danger: ["m2Db"] },
  { cue: 6, ...LEAK, danger: ["m2Db"], badges: { attacker: "every card" } },
  {
    cue: 7,
    layout: { m2Db: [0.8, 0.4], m2Key: [0.8, 1.9], attacker: [3, 1] },
    packets: [{ from: "m2Db", to: "attacker", label: "locked numbers" }, { from: "m2Key", to: "attacker", label: "the key", delay: 40 }],
    badges: { attacker: "still every card" },
  },
  { cue: 8, layout: { m2Db: [0.4, 1], m2Key: [2.6, 1] }, accent: ["m2Key"], badges: { m2Key: "never next to it" } },
  // The sealed bags.
  { cue: 10, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Bag"] },
  { cue: 11, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Machine"], badges: { m2Machine: "seals · opens" } },
  { cue: 12, layout: BAGS, edges: [...BAG_EDGES], badges: { m2Machine: "keeps its key" } },
  // Vault seals.
  { cue: 14, ...S, packets: [{ from: "m2Coat", to: "card", label: "card number" }, { from: "card", to: "m2ZoneVault", label: "card number", delay: 45 }] },
  { cue: 15, ...S, packets: [{ from: "m2ZoneVault", to: "card", label: "sealed" }] },
  { cue: 16, ...S, packets: [{ from: "card", to: "m2Db", label: "sealed" }], badges: { m2Db: "sealed only" } },
  { cue: 17, ...S, accent: ["m2ZoneVault"], badges: { m2ZoneVault: "key stays here" } },
  { cue: 18, layout: { m2Bag: [0.4, 1], m2Coat: [2.6, 1] }, edges: [{ from: "m2Bag", to: "m2Coat", label: "tied to" }], badges: { m2Bag: "its own card" } },
  {
    cue: 19,
    layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2OtherRow", label: "copied seal" }],
    danger: ["m2OtherRow"],
    badges: { m2OtherRow: "will not open" },
  },
  { cue: 20, layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OtherRow" }], crossed: ["m2OtherRow"], badges: { m2Db: "no shuffling" } },
  // The blind index.
  { cue: 21, layout: { card: [0.4, 1], m2Bag: [2.6, 1] }, edges: [{ from: "card", to: "m2Bag", label: "which bag?" }] },
  { cue: 23, layout: { card: [0.4, 1], m2Bag: [2.6, 1] }, edges: [{ from: "card", to: "m2Bag", label: "which bag?" }], badges: { m2Bag: "stays shut" } },
  { cue: 24, ...F, accent: ["m2Fingerprint"] },
  { cue: 25, ...F, badges: { m2Fingerprint: "same every time" } },
  { cue: 26, ...F, packets: [{ from: "m2Fingerprint", to: "m2Coat", label: "back?", stopAt: 0.5 }], badges: { m2Fingerprint: "one way" } },
  { cue: 27, ...F, badges: { m2Fingerprint: "blind index" } },
  {
    cue: 28,
    layout: { card: [0.4, 1], m2Fingerprint: [2.6, 1] },
    edges: [{ from: "card", to: "m2Fingerprint", label: "look up" }],
    badges: { card: "never the number" },
  },
  // The database refuses plain numbers.
  { cue: 29, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, accent: ["m2Db"], badges: { m2Db: "guards the door" } },
  { cue: 30, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "plain number", stopAt: 0.7 }], badges: { m2Db: "sealed only" } },
  { cue: 31, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "a mistake", stopAt: 0.7 }], badges: { m2Db: "refused" } },
  // Fail closed.
  { cue: 32, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"] },
  { cue: 33, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "stops" } },
  { cue: 34, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "never guesses" } },
  { cue: 35, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "fail closed" } },
  // Opened only to send; written down; removed.
  {
    cue: 36,
    layout: { m2ZoneVault: [0, 1], card: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m2ZoneVault", to: "card" }, { from: "card", to: "network" }],
    packets: [{ from: "card", to: "network", label: "card number" }],
    badges: { network: "for a charge" },
  },
  {
    cue: 37,
    layout: { card: [0.4, 1], m2UsageLog: [2.6, 1] },
    edges: [{ from: "card", to: "m2UsageLog" }],
    packets: [{ from: "card", to: "m2UsageLog", label: "what · who · when" }],
  },
  { cue: 38, layout: { m2Db: [0.8, 1], m2OldCard: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OldCard" }], crossed: ["m2OldCard"], badges: { m2OldCard: "unused too long" } },
  { cue: 39, layout: { m2Db: [0.8, 1], m2Note: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2Note" }], accent: ["m2Note"] },
  // Watch the product: nothing on screen inside the room.
  { cue: 40, layout: { buyer: [0, 1], card: [1.5, 1], m2Team: [3, 1] }, frames: [{ label: "Locked room", from: [1.5, 1], to: [1.5, 1], tone: "wall" }], accent: ["buyer", "m2Team"] },
  // Vault stops answering.
  { cue: 47, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"] },
  { cue: 49, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", broken: true }], badges: { m2Db: "nothing saved" } },
  { cue: 50, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m2Alert", to: "m2Team", label: "alert" }], badges: { m2Alert: "unavailable" } },
  { cue: 51, layout: ALERT, edges: [...ALERT_EDGES], danger: ["m2ZoneVault"], badges: { m2Alert: "names the part" } },
  {
    cue: 52,
    layout: S.layout,
    edges: [...SEAL_EDGES],
    packets: [{ from: "card", to: "m2ZoneVault", label: "card number" }, { from: "m2ZoneVault", to: "card", label: "sealed", delay: 50 }],
    badges: { m2ZoneVault: "back" },
  },
  // The leaked copy again.
  { cue: 53, ...LEAK },
  { cue: 54, ...LEAK, badges: { attacker: "opens it" } },
  { cue: 55, ...LEAK, badges: { m2Db: "sealed · stamps · masked" } },
  { cue: 56, ...LEAK, badges: { attacker: "no keys" } },
  { cue: 57, layout: { ...NOISE, m2ZoneVault: [1.3, 1] }, edges: [], packets: [{ from: "backup", to: "attacker", label: "a backup" }], badges: { backup: "kept apart" } },
  // What it protects.
  { cue: 59, layout: { buyer: [0.4, 1], card: [2.6, 1] }, frames: [{ label: "Locked room", from: [2.6, 1], to: [2.6, 1], tone: "wall" }], accent: ["buyer"] },
  {
    cue: 60,
    layout: { m2Db: [0, 0], backup: [0, 1], m2Insider: [0, 2], attacker: [2.6, 1] },
    edges: [{ from: "m2Db", to: "attacker" }, { from: "backup", to: "attacker" }, { from: "m2Insider", to: "attacker" }],
    badges: { attacker: "all noise" },
  },
  { cue: 61, ...LEAK, badges: { attacker: "not a leak of cards" } },
  // The close.
  { cue: 62, layout: BAGS, edges: [...BAG_EDGES] },
  { cue: 63, layout: BAGS, edges: [...BAG_EDGES], accent: ["m2Machine"], badges: { m2Machine: "keeps its key" } },
  { cue: 64, ...F, accent: ["m2Fingerprint"], badges: { m2Fingerprint: "finds, never opens" } },
  { cue: 65, layout: { m2Coat: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Coat", to: "m2Db", label: "unsealed", stopAt: 0.7 }], badges: { m2Db: "refuses" } },
  { cue: 66, ...LEAK, badges: { attacker: "just noise" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 3, current: ["frame", "card"] },
  { cue: 2, part: 3, current: ["cardsinfra"] },
  { cue: 3, part: 3, current: ["card", "cardsinfra"], units: { cards: "sealed" } },
  { cue: 9, part: 3, current: ["card", "frame", "bin", "adapters"], units: { cards: "locked room" } },
  { cue: 13, part: 3, current: ["card", "cardsinfra"], units: { cards: "Vault seals" } },
  { cue: 67, part: 3, current: ["bin"], units: { cards: "first digits" } },
];

// What each side sees: the frame's "Card accepted", the masked line, a refusal while Vault is down.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
export const screens: ScreenStep[] = [
  { cue: 42, src: "screens/c-09-card-vault/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 43, src: "screens/c-09-card-vault/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  {
    cue: 44,
    src: "screens/c-09-card-vault/masked.png",
    title: "Payment page · the masked line",
    region: [...LINE],
    focus: [[700, 293, 150, 28]],
    beats: [
      { cue: 45, region: [...LINE], focus: [[540, 293, 170, 28]] },
      { cue: 46, region: [...LINE], focus: [[540, 293, 310, 28]] },
    ],
  },
  { cue: 48, src: "screens/c-09-card-vault/vault-down.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 554, 340, 52]] },
];
