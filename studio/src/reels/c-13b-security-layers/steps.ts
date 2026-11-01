import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 13b: the layers together. The bank vault (0–9), one card number through seven layers (10–47),
// one buyer's payment (48–57), the team's logs (58–60), Vault restarts locked (61–64), what it protects (65–71),
// the vault again (72–75), next (76).
const VAULT: Beat = {
  layout: { m2Gate: [0, 0.2], m2Guard: [1, 0.2], m2InnerDoor: [2, 0.2], m2Safe: [3, 0.2], keyholders: [3, 1.8], m2Cameras: [1, 1.8] },
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
const KEYS: Beat = { layout: { keyholders: [0.4, 1], m2ZoneVault: [2.6, 1] }, edges: [{ from: "keyholders", to: "m2ZoneVault" }] };

export const diagram: DiagramStep<BuildId>[] = [
  // How deep does it go?
  { cue: 0, ...LAYERS },
  // The bank vault.
  { cue: 1, ...VAULT },
  { cue: 2, ...VAULT, accent: ["m2Gate"] },
  { cue: 3, ...VAULT, accent: ["m2Guard"] },
  { cue: 4, ...VAULT, accent: ["m2InnerDoor"], badges: { m2InnerDoor: "the right pass" } },
  { cue: 5, ...VAULT, accent: ["m2Safe", "keyholders"], badges: { m2Safe: "no single holder" } },
  { cue: 6, ...VAULT, accent: ["m2Cameras"], badges: { m2Cameras: "everywhere" } },
  { cue: 7, ...VAULT, badges: { m2Gate: "not trusted alone" } },
  { cue: 8, ...VAULT, danger: ["m2Gate"], badges: { m2Guard: "still holds" } },
  { cue: 9, ...VAULT, badges: { m2Safe: "defence in depth" } },
  // The card zone, layer by layer.
  { cue: 10, ...LAYERS },
  { cue: 11, ...LAYERS, accent: ["ingress", "m2Frame", "m2Counter", "m2ZoneVault", "partnerdoor", "m2UsageLog", "keyholders"] },
  // 1: the gate.
  { cue: 12, ...layer("ingress", "1 · the gate") },
  { cue: 13, ...GATE, packets: [{ from: "buyer", to: "ingress", label: "card form" }], badges: { ingress: "the only way in" } },
  { cue: 14, ...GATE, layout: { ...GATE.layout, attacker: [0, 2.2] }, packets: [{ from: "attacker", to: "ingress", label: "anything else", stopAt: 0.85 }], badges: { ingress: "not found" } },
  { cue: 15, ...GATE, packets: [0, 20, 40].map((delay, i) => ({ from: "buyer" as const, to: "ingress" as const, label: "card", delay, stopAt: i === 2 ? 0.85 : undefined })), badges: { ingress: "too fast: slowed" } },
  // 2: the glass at the counter.
  { cue: 16, ...layer("m2Frame", "2 · the glass") },
  { cue: 17, ...SEALS, badges: { m2Files: "its own two files" } },
  { cue: 18, ...SEALS, layout: { m2Changed: [0, 0.2], m2Skimmer: [0, 1.8], m2Frame: [1.5, 1], m2Page: [3, 1] }, edges: [{ from: "m2Changed", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Page" }], crossed: ["m2Changed"] },
  { cue: 19, ...SEALS, packets: [{ from: "m2Skimmer", to: "m2Frame", label: "script", stopAt: 0.8 }], badges: { m2Skimmer: "refused" } },
  { cue: 20, ...SEALS, badges: { m2Page: "named in the session" } },
  { cue: 21, ...SEALS, crossed: ["m2Skimmer"], badges: { m2Frame: "no skimming" } },
  // 3: the guard.
  { cue: 22, ...layer("m2Counter", "3 · the guard") },
  { cue: 23, ...GUARD },
  { cue: 24, ...GUARD, danger: ["m2CountCard"], badges: { m2Counter: "refused" } },
  { cue: 25, ...GUARD, badges: { m2Counter: "no card testing" } },
  // 4: the safe.
  { cue: 26, ...layer("m2ZoneVault", "4 · the safe") },
  { cue: 27, ...SAFE, packets: [{ from: "card", to: "m2ZoneVault", label: "number" }, { from: "card", to: "m2Db", label: "sealed", delay: 50 }] },
  { cue: 28, ...SAFE, badges: { m2Db: "sealed only" } },
  { cue: 29, ...SAFE, packets: [{ from: "card", to: "network", label: "for the charge" }] },
  { cue: 30, ...SAFE, layout: { ...SAFE.layout, attacker: [3, 2.2] }, edges: [...(SAFE.edges ?? []), { from: "m2Db", to: "attacker" }], badges: { attacker: "nothing to leak" } },
  // 5: the inner doors.
  { cue: 31, ...layer("partnerdoor", "5 · inner doors") },
  { cue: 32, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "charge" }], badges: { m2Ecom: "never sees it" } },
  { cue: 33, ...PROOFS, badges: { m2Ecom: "only the token" } },
  { cue: 34, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "certificate + token" }], badges: { m2Ecom: "two proofs" } },
  { cue: 35, ...PROOFS, badges: { card: "only what it needs" } },
  { cue: 36, ...PROOFS, layout: { ...PROOFS.layout, attacker: [0, 2.2] }, packets: [{ from: "attacker", to: "partnerdoor", label: "stranger", stopAt: 0.8 }], badges: { partnerdoor: "refused" } },
  // 6: the cameras.
  { cue: 37, ...layer("m2UsageLog", "6 · the cameras") },
  { cue: 38, ...CAMERAS, packets: [{ from: "card", to: "m2UsageLog", label: "every use" }] },
  { cue: 39, ...CAMERAS, badges: { m2UsageLog: "123456******7890" } },
  { cue: 40, ...CAMERAS, badges: { m2UsageLog: "secrets: ****" } },
  { cue: 41, ...CAMERAS, packets: [{ from: "m2UsageLog", to: "m2Team", label: "alert" }], badges: { m2Team: "no card data" } },
  { cue: 42, ...CAMERAS, badges: { m2UsageLog: "no leak" } },
  // 7: the keyholders.
  { cue: 43, ...layer("keyholders", "7 · keyholders") },
  { cue: 44, ...KEYS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "starts locked" } },
  { cue: 45, ...KEYS, packets: [0, 20, 40].map((delay) => ({ from: "keyholders" as const, to: "m2ZoneVault" as const, label: "a share", delay })), badges: { keyholders: "three of five" } },
  { cue: 46, ...KEYS, badges: { m2ZoneVault: "never one person" } },
  { cue: 47, ...KEYS, layout: { ...KEYS.layout, m2Insider: [0.4, 2.2] }, crossed: ["m2Insider"], badges: { m2Insider: "alone: no" } },
  // ecom asks for the charge by token.
  { cue: 55, ...PROOFS, packets: [{ from: "m2Ecom", to: "card", label: "charge · token" }] },
  { cue: 57, ...LAYERS, accent: ["ingress", "m2Frame", "m2Counter", "m2ZoneVault", "partnerdoor", "m2UsageLog", "keyholders"], badges: { m2Frame: "two fields, a button" } },
  // The team's logs.
  { cue: 58, ...CAMERAS, packets: [{ from: "m2UsageLog", to: "m2Team", label: "that payment" }] },
  { cue: 59, ...CAMERAS, badges: { m2UsageLog: "masked, never whole" } },
  { cue: 60, ...CAMERAS, badges: { m2Team: "who · what · when" } },
  // Vault restarts locked.
  { cue: 61, ...KEYS, packets: [{ from: "m2ZoneVault", to: "keyholders", label: "restart" }] },
  { cue: 62, ...KEYS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "locked" } },
  {
    cue: 64,
    ...KEYS,
    packets: [0, 20, 40].map((delay) => ({ from: "keyholders" as const, to: "m2ZoneVault" as const, label: "a share", delay })),
    badges: { keyholders: "they meet" },
  },
  // What it protects.
  { cue: 66, ...LAYERS, danger: ["m2Frame"] },
  { cue: 67, ...LAYERS, danger: ["m2Frame"], badges: { m2Frame: "a script slips" } },
  { cue: 68, ...LAYERS, danger: ["partnerdoor"], badges: { partnerdoor: "a password leaks" } },
  { cue: 69, ...LAYERS, danger: ["m2ZoneVault"], badges: { m2ZoneVault: "a copy escapes" } },
  { cue: 70, ...LAYERS, danger: ["m2Frame"], accent: ["m2Counter", "m2ZoneVault"], badges: { m2Counter: "next one holds" } },
  { cue: 71, layout: { buyer: [0, 1], shop: [1.5, 1], acquirer: [3, 1] }, accent: ["buyer", "shop", "acquirer"] },
  // The vault again.
  { cue: 72, ...VAULT },
  { cue: 73, ...VAULT, accent: ["m2Gate", "m2Guard", "m2InnerDoor", "m2Safe", "keyholders", "m2Cameras"] },
  { cue: 74, ...VAULT, layout: { ...VAULT.layout, attacker: [0, 1.8] }, badges: { attacker: "must beat all" } },
  { cue: 75, ...VAULT, badges: { m2Safe: "only has to hold" } },
];

export const map: BuildMapStep[] = [
  { cue: 76, part: 2, current: ["partner", "merchant"], units: { ecom: "merchants" } },
];

// One buyer's payment, every layer at work; then the card form while Vault waits for its keyholders.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
export const screens: ScreenStep[] = [
  {
    cue: 49,
    src: "screens/c-13b-security-layers/typed.png",
    title: "Payment page",
    region: [440, 20, 560, 350],
    beats: [
      { cue: 50, region: [440, 20, 560, 350], focus: [[520, 36, 230, 30]] },
      { cue: 51, region: [...FORM], focus: [[555, 375, 340, 40]] },
    ],
  },
  { cue: 52, src: "screens/c-13b-security-layers/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 53, src: "screens/c-13b-security-layers/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  { cue: 54, src: "screens/c-13b-security-layers/masked.png", title: "Payment page · the masked line", region: [...LINE], focus: [[540, 293, 310, 28]] },
  { cue: 56, src: "screens/c-13b-security-layers/paid.png", title: "Payment page · paid", region: [480, 260, 480, 300], focus: [[560, 398, 320, 34]] },
  { cue: 63, src: "screens/c-13b-security-layers/vault-down.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 554, 340, 52]] },
];
