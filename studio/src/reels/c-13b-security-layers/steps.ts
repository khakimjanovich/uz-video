import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 13b: the layers together. One buyer's minute on Monday (0–3), the bridge (4–5), the bank vault (6–16),
// one card number through seven layers (17–51), the buyer's minute as they saw it (52–60), Timur's logs (61–63),
// Vault restarts locked (64–68), trust no single layer (69–73), next (74).
const VAULT: Beat = {
  layout: { m2Gate: [0, 0.2], m2Guard: [1, 0.2], m2InnerDoor: [2, 0.2], m2Safe: [3, 0.2], keyholders: [3, 1.8], m2Cameras: [1, 1.8], m2BankCounter: [0, 1.8] },
};
const LAYERS: Beat = {
  layout: { ingress: [0, 0.2], m2Frame: [1, 0.2], m2Counter: [2, 0.2], m2ZoneVault: [3, 0.2], partnerdoor: [3, 1.8], m2UsageLog: [2, 1.8], keyholders: [1, 1.8] },
  frames: [{ label: "Card zone", from: [0, 0.2], to: [3, 1.8], tone: "wall" }],
};
const layer = (id: BuildId, badge: string): Beat => ({ ...LAYERS, accent: [id], badges: { [id]: badge } });

const GATE: Beat = { layout: { buyer: [0, 1], ingress: [1.5, 1], card: [3, 1] }, edges: [{ from: "buyer", to: "ingress" }, { from: "ingress", to: "card" }] };
const SEALS: Beat = {
  layout: { m2Files: [0, 0.2], m2Skimmer: [0, 1.8], m2Frame: [1.5, 1], m2Page: [3, 1] },
  edges: [{ from: "m2Files", to: "m2Frame" }, { from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Page" }],
};
const GUARD: Beat = {
  layout: { m2Counter: [0, 1.1], m2CountCard: [2.4, 0], m2CountBin: [2.4, 0.73], m2CountAddress: [2.4, 1.47], m2CountShop: [2.4, 2.2] },
  edges: [
    { from: "m2Counter", to: "m2CountCard" },
    { from: "m2Counter", to: "m2CountBin" },
    { from: "m2Counter", to: "m2CountAddress" },
    { from: "m2Counter", to: "m2CountShop" },
  ],
};
const SAFE: Beat = {
  layout: { card: [0, 1], m2ZoneVault: [1.5, 0.2], m2Db: [1.5, 1.8], network: [3, 1] },
  edges: [{ from: "card", to: "m2ZoneVault" }, { from: "card", to: "m2Db" }, { from: "card", to: "network" }],
};
const PROOFS: Beat = {
  layout: { m2Ecom: [0, 1], partnerdoor: [1.5, 1], card: [3, 1] },
  edges: [{ from: "m2Ecom", to: "partnerdoor" }, { from: "partnerdoor", to: "card" }],
};
const CAMERAS: Beat = { layout: { card: [0, 1], m2UsageLog: [1.5, 1], m2Team: [3, 1] }, edges: [{ from: "card", to: "m2UsageLog" }, { from: "m2UsageLog", to: "m2Team" }] };
const MINUTE = { buyer: [0.4, 1], shop: [2.6, 1] } as const;
const M: Beat = { layout: MINUTE, edges: [{ from: "buyer", to: "shop" }] };
const KEYS: Beat = { layout: { keyholders: [0.4, 1], m2ZoneVault: [2.6, 1] }, edges: [{ from: "keyholders", to: "m2ZoneVault" }] };

export const diagram: DiagramStep<BuildId>[] = [
  // Monday, one buyer's minute.
  { cue: 0, ...M, badges: { shop: "Mon 10:14" } },
  { cue: 1, ...M, packets: [{ from: "buyer", to: "shop", label: "peonies" }], badges: { shop: "Malika's shop" } },
  { cue: 2, ...M, accent: ["buyer"], badges: { buyer: "under a minute" } },
  { cue: 3, ...LAYERS, accent: ["ingress", "m2Frame", "m2Counter", "m2ZoneVault", "partnerdoor", "m2UsageLog", "keyholders"], badges: { m2Frame: "none noticed" } },
  // The bank vault.
  { cue: 6, ...VAULT },
  { cue: 7, ...VAULT, accent: ["m2Gate"] },
  { cue: 8, ...VAULT, accent: ["m2BankCounter"], badges: { m2BankCounter: "glass" } },
  { cue: 9, ...VAULT, accent: ["m2Guard"] },
  { cue: 10, ...VAULT, accent: ["m2Safe"] },
  { cue: 11, ...VAULT, accent: ["m2InnerDoor"], badges: { m2InnerDoor: "the right pass" } },
  { cue: 12, ...VAULT, accent: ["m2Cameras"], badges: { m2Cameras: "everywhere" } },
  { cue: 13, ...VAULT, accent: ["keyholders"], badges: { keyholders: "no single holder" } },
  { cue: 14, ...VAULT, badges: { m2Gate: "not trusted alone" } },
  { cue: 15, ...VAULT, danger: ["m2Gate"], badges: { m2Guard: "still holds" } },
  { cue: 16, ...VAULT, badges: { m2Safe: "defence in depth" } },
  // 1: the gate.
  { cue: 17, ...layer("ingress", "1 · the gate") },
  { cue: 18, ...GATE, packets: [{ from: "buyer", to: "ingress", label: "card form" }], badges: { ingress: "the only way in" } },
  { cue: 19, ...GATE, layout: { ...GATE.layout, attacker: [0, 2.2] }, packets: [{ from: "attacker", to: "ingress", label: "anything else", stopAt: 0.85 }], badges: { ingress: "not found" } },
  { cue: 20, ...GATE, packets: [0, 20, 40].map((delay, i) => ({ from: "buyer" as const, to: "ingress" as const, label: "card", delay, stopAt: i === 2 ? 0.85 : undefined })), badges: { ingress: "too fast: slowed" } },
  // 2: the glass at the counter.
  { cue: 21, ...layer("m2Frame", "2 · the glass") },
  { cue: 22, ...SEALS, badges: { m2Files: "its own two files" } },
  { cue: 23, ...SEALS, layout: { m2Changed: [0, 0.2], m2Skimmer: [0, 1.8], m2Frame: [1.5, 1], m2Page: [3, 1] }, edges: [{ from: "m2Changed", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Page" }], crossed: ["m2Changed"] },
  { cue: 24, ...SEALS, packets: [{ from: "m2Skimmer", to: "m2Frame", label: "script", stopAt: 0.8 }], badges: { m2Skimmer: "refused" } },
  { cue: 25, ...SEALS, badges: { m2Page: "named in the session" } },
  { cue: 26, ...SEALS, crossed: ["m2Skimmer"], badges: { m2Frame: "no skimming" } },
  // 3: the guard.
  { cue: 27, ...layer("m2Counter", "3 · the guard") },
  { cue: 28, ...GUARD },
  { cue: 29, ...GUARD, danger: ["m2CountCard"], badges: { m2Counter: "refused" } },
  { cue: 30, ...GUARD, badges: { m2Counter: "no card testing" } },
  // 4: the safe.
  { cue: 31, ...layer("m2ZoneVault", "4 · the safe") },
  { cue: 32, ...SAFE, packets: [{ from: "card", to: "m2ZoneVault", label: "number" }, { from: "card", to: "m2Db", label: "sealed", delay: 50 }] },
  { cue: 33, ...SAFE, badges: { m2Db: "sealed only" } },
  { cue: 34, ...SAFE, packets: [{ from: "card", to: "network", label: "for the charge" }] },
  { cue: 35, ...SAFE, layout: { ...SAFE.layout, attacker: [3, 2.2] }, edges: [...(SAFE.edges ?? []), { from: "m2Db", to: "attacker" }], badges: { attacker: "nothing to leak" } },
  // 5: the inner doors.
  { cue: 36, ...layer("partnerdoor", "5 · inner doors") },
  { cue: 37, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "charge" }], badges: { m2Ecom: "never sees it" } },
  { cue: 38, ...PROOFS, badges: { m2Ecom: "only the token" } },
  { cue: 39, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "certificate + token" }], badges: { m2Ecom: "two proofs" } },
  { cue: 40, ...PROOFS, badges: { card: "only what it needs" } },
  { cue: 41, ...PROOFS, layout: { ...PROOFS.layout, attacker: [0, 2.2] }, packets: [{ from: "attacker", to: "partnerdoor", label: "stranger", stopAt: 0.8 }], badges: { partnerdoor: "refused" } },
  // 6: the cameras.
  { cue: 42, ...layer("m2UsageLog", "6 · the cameras") },
  { cue: 43, ...CAMERAS, packets: [{ from: "card", to: "m2UsageLog", label: "every use" }] },
  { cue: 44, ...CAMERAS, badges: { m2UsageLog: "123456******7890" } },
  { cue: 45, ...CAMERAS, badges: { m2UsageLog: "secrets: ****" } },
  { cue: 46, ...CAMERAS, packets: [{ from: "m2UsageLog", to: "m2Team", label: "alert" }], badges: { m2Team: "no card data" } },
  { cue: 47, ...CAMERAS, badges: { m2UsageLog: "no leak" } },
  // 7: the keyholders.
  { cue: 48, ...layer("keyholders", "7 · keyholders") },
  { cue: 49, ...KEYS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "starts locked" } },
  { cue: 50, ...KEYS, packets: [0, 20, 40].map((delay) => ({ from: "keyholders" as const, to: "m2ZoneVault" as const, label: "a share", delay })), badges: { keyholders: "three of five" } },
  { cue: 51, ...KEYS, layout: { ...KEYS.layout, m2Insider: [0.4, 2.2] }, crossed: ["m2Insider"], badges: { m2Insider: "alone: no" } },
  // The buyer's minute, as they saw it.
  { cue: 52, ...M, accent: ["buyer"], badges: { buyer: "the buyer's minute" } },
  // ecom asks for the charge by token.
  { cue: 58, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "charge · token" }] },
  { cue: 60, ...LAYERS, accent: ["ingress", "m2Frame", "m2Counter", "m2ZoneVault", "partnerdoor", "m2UsageLog", "keyholders"], badges: { m2Frame: "two fields, a button" } },
  // Timur reads the logs.
  { cue: 61, ...CAMERAS, packets: [{ from: "m2UsageLog", to: "m2Team", label: "that payment" }], badges: { m2Team: "Timur" } },
  { cue: 62, ...CAMERAS, badges: { m2Team: "Timur", m2UsageLog: "masked only" } },
  { cue: 63, ...CAMERAS, badges: { m2Team: "who · what · when" } },
  // Vault restarts locked.
  { cue: 64, ...KEYS, packets: [{ from: "m2ZoneVault", to: "keyholders", label: "restart" }], badges: { m2ZoneVault: "that night" } },
  { cue: 65, ...KEYS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "locked" } },
  {
    cue: 67,
    ...KEYS,
    packets: [0, 20, 40].map((delay) => ({ from: "keyholders" as const, to: "m2ZoneVault" as const, label: "a share", delay })),
    badges: { keyholders: "they meet" },
  },
  { cue: 68, ...KEYS, layout: { ...KEYS.layout, m2Team: [0.4, 2.2] }, crossed: ["m2Team"], badges: { m2Team: "Timur alone: no" } },
  // Trust no single layer.
  { cue: 69, ...LAYERS, badges: { m2ZoneVault: "none trusted alone" } },
  { cue: 70, ...LAYERS, danger: ["m2Frame"], badges: { m2Frame: "a script slips" } },
  { cue: 71, ...LAYERS, danger: ["partnerdoor"], badges: { partnerdoor: "a password leaks" } },
  { cue: 72, ...LAYERS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "a copy escapes" } },
  { cue: 73, ...LAYERS, danger: ["m2Frame"], accent: ["m2Counter", "m2ZoneVault"], badges: { m2Counter: "next one holds" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 4, part: 3, current: ["frame", "card", "bin", "adapters", "cardsinfra"], units: { cards: "locked room" } },
  { cue: 5, part: 3, current: ["frame", "card", "bin", "adapters", "cardsinfra"], units: { cards: "every layer" } },
  { cue: 74, part: 3, current: ["partner", "merchant"], units: { ecom: "merchants" } },
];

// One buyer's payment, every layer at work; then the card form while Vault waits for its keyholders.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
export const screens: ScreenStep[] = [
  {
    cue: 53,
    src: "screens/c-13b-security-layers/typed.png",
    title: "Payment page",
    region: [440, 20, 560, 350],
    focus: [[505, 36, 250, 30]],
    beats: [{ cue: 54, region: [...FORM], focus: [[555, 375, 340, 40]] }],
  },
  { cue: 55, src: "screens/c-13b-security-layers/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 56, src: "screens/c-13b-security-layers/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  { cue: 57, src: "screens/c-13b-security-layers/masked.png", title: "Payment page · the masked line", region: [...LINE], focus: [[540, 293, 310, 28]] },
  { cue: 59, src: "screens/c-13b-security-layers/paid.png", title: "Payment page · paid", region: [480, 260, 480, 300], focus: [[560, 398, 320, 34]] },
  { cue: 66, src: "screens/c-13b-security-layers/vault-down.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 554, 340, 52]] },
];
