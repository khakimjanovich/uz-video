import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 9: Timur's worst-day drill. The drill (0–5), the bridge (6–7), Vault seals (8–14), the blind index (15–22),
// the database refuses plain numbers (23–25), fail closed (26–29), opened only to send, written down, removed (30–33),
// what the buyer sees (34–39), Vault stopped on purpose (40–45), the colleague's report (46–53), next (54).
const DRILL = { m2Db: [0.4, 1], m2Insider: [2.6, 1] } as const;
const DR = { layout: DRILL, edges: [{ from: "m2Db" as const, to: "m2Insider" as const }] };
const SEAL = { m2Card: [0, 1], card: [1.4, 1], m2ZoneVault: [3, 0.2], m2Db: [3, 1.8] } as const;
const SEAL_EDGES = [{ from: "m2Card", to: "card" }, { from: "card", to: "m2ZoneVault" }, { from: "card", to: "m2Db" }] as const;
const S = { layout: SEAL, edges: [...SEAL_EDGES] };
const STAMP = { m2Card: [0, 1], m2ZoneVault: [1.5, 1], m2Fingerprint: [3, 1] } as const;
const STAMP_EDGES = [{ from: "m2Card", to: "m2ZoneVault" }, { from: "m2ZoneVault", to: "m2Fingerprint", label: "stamp" }] as const;
const F = { layout: STAMP, edges: [...STAMP_EDGES] };
const DOWN = { card: [0.6, 1], m2ZoneVault: [2.6, 1] } as const;
const ALERT = { card: [0, 0.4], m2ZoneVault: [2.4, 0.4], m2Alert: [0, 1.9], m2Team: [2.4, 1.9] } as const;
const ALERT_EDGES = [{ from: "card", to: "m2ZoneVault", broken: true }, { from: "m2Alert", to: "m2Team" }] as const;
const NOISE = { m2Db: [0, 0], backup: [0, 1], m2Insider: [0, 2], attacker: [2.6, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The worst-day drill.
  { cue: 0, layout: { m2Db: [1.5, 1] }, badges: { m2Db: "the drill" } },
  { cue: 1, ...DR, packets: [{ from: "m2Db", to: "m2Insider", label: "a full copy" }], badges: { m2Insider: "one card number?" } },
  { cue: 2, ...DR, danger: ["m2Db"], badges: { m2Db: "plain numbers", m2Insider: "1 second" } },
  {
    cue: 3,
    layout: { m2Db: [0.4, 0.4], m2Key: [0.4, 1.9], m2Insider: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2Insider" }, { from: "m2Key", to: "m2Insider" }],
    packets: [{ from: "m2Db", to: "m2Insider", label: "locked numbers" }, { from: "m2Key", to: "m2Insider", label: "the key", delay: 40 }],
    badges: { m2Key: "right next to it", m2Insider: "2 seconds" },
  },
  {
    cue: 4,
    layout: { m2Db: [0.4, 0.4], m2Key: [0.4, 1.9], m2Insider: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2Insider" }, { from: "m2Key", to: "m2Insider" }],
    danger: ["m2Key"],
    badges: { m2Key: "looks finished" },
  },
  { cue: 5, layout: { m2Db: [0.4, 1], m2Key: [2.6, 1] }, accent: ["m2Key"], badges: { m2Key: "never next to it" } },
  // Vault seals.
  { cue: 8, ...S, packets: [{ from: "m2Card", to: "card", label: "card number" }, { from: "card", to: "m2ZoneVault", label: "card number", delay: 45 }] },
  { cue: 9, ...S, packets: [{ from: "m2ZoneVault", to: "card", label: "sealed" }] },
  { cue: 10, ...S, packets: [{ from: "card", to: "m2Db", label: "sealed" }], badges: { m2Db: "sealed only" } },
  { cue: 11, ...S, accent: ["m2ZoneVault"], badges: { m2ZoneVault: "key stays here" } },
  { cue: 12, layout: { m2Db: [0.4, 1], m2Card: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2Card", label: "tied to" }], badges: { m2Db: "its own card" } },
  {
    cue: 13,
    layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] },
    edges: [{ from: "m2Db", to: "m2OtherRow", label: "copied seal" }],
    danger: ["m2OtherRow"],
    badges: { m2OtherRow: "will not open" },
  },
  { cue: 14, layout: { m2Db: [0.4, 1], m2OtherRow: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OtherRow" }], crossed: ["m2OtherRow"], badges: { m2Db: "no shuffling" } },
  // The blind index.
  { cue: 15, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", label: "a puzzle" }] },
  { cue: 16, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", label: "which card?" }] },
  { cue: 17, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", label: "which card?" }], badges: { m2Db: "seals stay shut" } },
  { cue: 18, ...F, accent: ["m2Fingerprint"] },
  { cue: 19, ...F, badges: { m2Fingerprint: "same every time" } },
  { cue: 20, ...F, packets: [{ from: "m2Fingerprint", to: "m2Card", label: "back?", stopAt: 0.5 }], badges: { m2Fingerprint: "one way" } },
  { cue: 21, ...F, badges: { m2Fingerprint: "blind index" } },
  {
    cue: 22,
    layout: { card: [0.4, 1], m2Fingerprint: [2.6, 1] },
    edges: [{ from: "card", to: "m2Fingerprint", label: "look up" }],
    badges: { card: "never the number" },
  },
  // The database refuses plain numbers.
  { cue: 23, layout: { m2Card: [0, 1], m2Db: [2.6, 1] }, accent: ["m2Db"], badges: { m2Db: "guards the door" } },
  { cue: 24, layout: { m2Card: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Card", to: "m2Db", label: "plain number", stopAt: 0.7 }], badges: { m2Db: "sealed only" } },
  { cue: 25, layout: { m2Card: [0, 1], m2Db: [2.6, 1] }, packets: [{ from: "m2Card", to: "m2Db", label: "a mistake", stopAt: 0.7 }], badges: { m2Db: "refused" } },
  // Fail closed.
  { cue: 26, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"] },
  { cue: 27, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "stops" } },
  { cue: 28, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "never guesses" } },
  { cue: 29, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { card: "fail closed" } },
  // Opened only to send; written down; removed.
  {
    cue: 30,
    layout: { m2ZoneVault: [0, 1], card: [1.5, 1], network: [3, 1] },
    edges: [{ from: "m2ZoneVault", to: "card" }, { from: "card", to: "network" }],
    packets: [{ from: "card", to: "network", label: "card number" }],
    badges: { network: "for a charge" },
  },
  {
    cue: 31,
    layout: { card: [0.4, 1], m2UsageLog: [2.6, 1] },
    edges: [{ from: "card", to: "m2UsageLog" }],
    packets: [{ from: "card", to: "m2UsageLog", label: "what · who · when" }],
  },
  { cue: 32, layout: { m2Db: [0.8, 1], m2OldCard: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2OldCard" }], crossed: ["m2OldCard"], badges: { m2OldCard: "unused too long" } },
  { cue: 33, layout: { m2Db: [0.8, 1], m2Note: [2.6, 1] }, edges: [{ from: "m2Db", to: "m2Note" }], accent: ["m2Note"] },
  // The buyer sees none of it.
  { cue: 34, layout: { buyer: [0.4, 1], card: [2.6, 1] }, frames: [{ label: "Card zone", from: [2.6, 1], to: [2.6, 1], tone: "wall" }], badges: { buyer: "sees none of it" } },
  // Timur stops Vault on purpose.
  { cue: 40, layout: DOWN, edges: [{ from: "card", to: "m2ZoneVault", broken: true }], danger: ["m2ZoneVault"], badges: { m2ZoneVault: "stopped on purpose" } },
  { cue: 42, layout: { card: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "card", to: "m2Db", broken: true }], badges: { m2Db: "nothing saved" } },
  { cue: 43, layout: ALERT, edges: [...ALERT_EDGES], packets: [{ from: "m2Alert", to: "m2Team", label: "alert" }], badges: { m2Alert: "unavailable" } },
  { cue: 44, layout: ALERT, edges: [...ALERT_EDGES], danger: ["m2ZoneVault"], badges: { m2Alert: "names the part" } },
  {
    cue: 45,
    ...S,
    packets: [{ from: "card", to: "m2ZoneVault", label: "card number" }, { from: "m2ZoneVault", to: "card", label: "sealed", delay: 50 }],
    badges: { m2ZoneVault: "back" },
  },
  // The colleague's report.
  { cue: 46, ...DR, packets: [{ from: "m2Insider", to: "m2Db", label: "the report" }] },
  { cue: 47, ...DR, badges: { m2Db: "sealed values" } },
  { cue: 48, ...DR, badges: { m2Db: "fingerprints" } },
  { cue: 49, ...DR, badges: { m2Db: "masked numbers" } },
  { cue: 50, ...DR, accent: ["m2Db"], badges: { m2Db: "no keys" } },
  {
    cue: 51,
    layout: { backup: [0, 1], m2ZoneVault: [2.6, 1] },
    edges: [{ from: "backup", to: "m2ZoneVault", broken: true }],
    badges: { backup: "useless alone", m2ZoneVault: "kept apart" },
  },
  {
    cue: 52,
    layout: NOISE,
    edges: [{ from: "m2Db", to: "attacker" }, { from: "backup", to: "attacker" }, { from: "m2Insider", to: "attacker" }],
    badges: { attacker: "all noise" },
  },
  { cue: 53, ...DR, accent: ["m2Insider"], badges: { m2Insider: "never a card number" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 6, part: 3, current: ["cardsinfra"] },
  { cue: 7, part: 3, current: ["card", "cardsinfra"], units: { cards: "Vault seals" } },
  { cue: 54, part: 3, current: ["bin"], units: { cards: "first digits" } },
];

// What each side sees: the frame's "Card accepted", the masked line, a refusal while Vault is down.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
export const screens: ScreenStep[] = [
  { cue: 35, src: "screens/c-09-card-vault/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 36, src: "screens/c-09-card-vault/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  {
    cue: 37,
    src: "screens/c-09-card-vault/masked.png",
    title: "Payment page · the masked line",
    region: [...LINE],
    focus: [[700, 293, 150, 28]],
    beats: [
      { cue: 38, region: [...LINE], focus: [[540, 293, 170, 28]] },
      { cue: 39, region: [...LINE], focus: [[540, 293, 310, 28]] },
    ],
  },
  { cue: 41, src: "screens/c-09-card-vault/vault-down.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 554, 340, 52]] },
];
