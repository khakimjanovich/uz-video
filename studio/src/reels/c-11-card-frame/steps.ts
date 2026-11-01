import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 11: seals on the card reader. Web skimming (0–10), the frame as the bank's card reader (11–16), seal one (17–19),
// seal two (20–23), seal three (24–26), the hand-back (27–29), reports and the watched page (30–32), the product (33–53),
// what it protects (54–59), the card reader again (60–63), next (64).
const SKIM = { buyer: [0, 1], m2Page: [1.5, 1], m2Skimmer: [3, 1] } as const;
const SK: Beat = { layout: SKIM, edges: [{ from: "buyer", to: "m2Page" }, { from: "m2Page", to: "m2Skimmer" }] };
const COUNTER = { label: "The shop's counter", from: [0.4, 1], to: [2.4, 1] } as const;
const READER: Beat = { layout: { m2Page: [0.4, 1], m2Frame: [2.4, 1] }, edges: [{ from: "m2Page", to: "m2Frame", label: "holds" }], frames: [COUNTER] };
const ONE_PAGE: Beat = {
  layout: { m2Page: [0, 0.2], m2OtherPage: [0, 1.8], m2Frame: [2.6, 1] },
  edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2OtherPage", to: "m2Frame", broken: true }],
};
const POLICY: Beat = {
  layout: { m2Files: [0, 0.2], m2Skimmer: [0, 1.8], m2Frame: [1.5, 1], card: [3, 1] },
  edges: [{ from: "m2Files", to: "m2Frame" }, { from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "card" }],
};
const HASH: Beat = {
  layout: { m2Files: [0, 0.2], m2Changed: [0, 1.8], m2Frame: [2.4, 1] },
  edges: [{ from: "m2Files", to: "m2Frame", label: "fingerprints match" }, { from: "m2Changed", to: "m2Frame", broken: true }],
};
const BACK: Beat = { layout: { m2Frame: [0.4, 1], m2Page: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Page" }] };
const REPORT: Beat = { layout: { m2Browser: [0, 1], card: [1.5, 1], m2Team: [3, 1] }, edges: [{ from: "m2Browser", to: "card" }, { from: "card", to: "m2Team" }] };

export const diagram: DiagramStep<BuildId>[] = [
  // Stolen without a break-in.
  { cue: 0, layout: { m2Page: [0.6, 1], attacker: [2.8, 1] }, packets: [{ from: "m2Page", to: "attacker", label: "card numbers" }], badges: { m2Page: "no break-in" } },
  { cue: 4, layout: { m2Page: [0.6, 1], m2Skimmer: [2.8, 1] }, edges: [{ from: "m2Skimmer", to: "m2Page", label: "one line" }] },
  {
    cue: 5,
    layout: { m2Analytics: [0, 0.2], m2SharedServer: [0, 1.8], m2Page: [2.6, 1] },
    edges: [{ from: "m2Analytics", to: "m2Page", label: "hacked" }, { from: "m2SharedServer", to: "m2Page", label: "changed file" }],
  },
  { cue: 6, ...SK, packets: [{ from: "buyer", to: "m2Page", label: "card number" }, { from: "m2Page", to: "m2Skimmer", label: "a copy", delay: 50 }] },
  { cue: 7, ...SK, badges: { m2Page: "still works" } },
  { cue: 8, ...SK, badges: { buyer: "still pays" } },
  { cue: 9, ...SK, badges: { m2Skimmer: "weeks unseen" } },
  { cue: 10, ...SK, danger: ["m2Skimmer"], badges: { m2Skimmer: "web skimming" } },
  // The bank's card reader.
  { cue: 11, layout: { m2Frame: [1.5, 1] }, accent: ["m2Frame"] },
  { cue: 12, layout: { m2Frame: [1.5, 1] }, badges: { m2Frame: "its own address" } },
  { cue: 13, ...READER },
  { cue: 14, ...READER, badges: { m2Frame: "the bank's reader" } },
  { cue: 15, ...READER, badges: { m2Frame: "tamper seals" } },
  // Seal one: one page.
  { cue: 17, ...ONE_PAGE, badges: { m2Page: "named in the session" } },
  { cue: 18, layout: { buyer: [0, 1], card: [1.5, 1], m2Page: [3, 1] }, edges: [{ from: "buyer", to: "card" }, { from: "card", to: "m2Page", label: "session" }], badges: { m2Page: "one page" } },
  { cue: 19, ...ONE_PAGE, danger: ["m2OtherPage"], badges: { m2OtherPage: "look-alike: refused" } },
  // Seal two: its policy.
  { cue: 20, ...POLICY, accent: ["m2Frame"], badges: { m2Frame: "its policy" } },
  { cue: 21, ...POLICY, packets: [{ from: "m2Frame", to: "m2Files", label: "the rule" }], badges: { m2Frame: "a rule" } },
  { cue: 22, ...POLICY, badges: { m2Files: "own two files", card: "own address" } },
  { cue: 23, ...POLICY, packets: [{ from: "m2Skimmer", to: "m2Frame", label: "script", stopAt: 0.8 }], badges: { m2Skimmer: "refused" } },
  // Seal three: fingerprints.
  { cue: 24, ...HASH },
  { cue: 25, ...HASH, badges: { m2Files: "a fingerprint each" } },
  { cue: 26, ...HASH, crossed: ["m2Changed"], badges: { m2Changed: "will not run" } },
  // Only a token and the masked number go back.
  { cue: 27, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "token" }, { from: "m2Frame", to: "m2Page", label: "masked number", delay: 45 }] },
  { cue: 28, ...BACK, badges: { m2Page: "that one page" } },
  { cue: 29, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "card number", stopAt: 0.4 }], badges: { m2Frame: "number stays" } },
  // Reports, and the page around is watched.
  { cue: 30, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "blocked" }] },
  { cue: 31, ...REPORT, badges: { card: "a trace" } },
  {
    cue: 32,
    layout: { m2Frame: [0, 1], m2Page: [1.5, 1], m2Watch: [3, 1] },
    edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2Watch", to: "m2Page", label: "watches" }],
    badges: { m2Page: "watched too" },
  },
  // Act as a skimmer: the console's red line.
  {
    cue: 47,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
  },
  {
    cue: 48,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
    packets: [{ from: "m2Skimmer", to: "m2Frame", label: "load script", stopAt: 0.8 }],
  },
  { cue: 49, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], danger: ["m2Console"], badges: { m2Console: "refused: policy" } },
  { cue: 50, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], badges: { m2Frame: "nothing loads" } },
  { cue: 51, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "report" }] },
  { cue: 52, ...REPORT, packets: [{ from: "card", to: "m2Team", label: "rule · page" }], badges: { m2Team: "in the logs" } },
  { cue: 53, ...REPORT, badges: { m2Team: "no card data" } },
  // What it protects.
  { cue: 55, layout: { buyer: [0.4, 1], m2Frame: [2.6, 1] }, edges: [{ from: "buyer", to: "m2Frame", label: "typing" }], badges: { buyer: "plain view" } },
  { cue: 56, layout: { m2Db: [0, 0.2], m2Skimmer: [0, 1.8], buyer: [2.6, 1] }, edges: [{ from: "m2Skimmer", to: "buyer", label: "at the keyboard" }], badges: { m2Db: "locked · sealed" } },
  { cue: 57, ...SK, crossed: ["m2Skimmer"], badges: { buyer: "protected" } },
  { cue: 58, ...READER, badges: { m2Frame: "no stolen form" } },
  { cue: 59, ...READER, badges: { m2Page: "never the number" } },
  // The card reader again.
  { cue: 60, ...READER },
  { cue: 61, ...POLICY, badges: { m2Files: "bank's software only" } },
  { cue: 62, ...ONE_PAGE, badges: { m2Page: "one counter" } },
  { cue: 63, ...HASH, crossed: ["m2Changed"], badges: { m2Changed: "a broken seal shows" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 3, current: ["payment", "frame"] },
  { cue: 2, part: 3, current: ["bin"] },
  { cue: 3, part: 3, current: ["buyer", "frame"] },
  { cue: 64, part: 3, current: ["frame", "card"], units: { cards: "two doors" } },
];

// The frame on the pay page: typing, the code, "Card accepted", the masked line; alone; in a look-alike site.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 34,
    src: "screens/c-11-card-frame/typed.png",
    title: "Payment page · card frame",
    region: [440, 20, 560, 350],
    beats: [
      { cue: 35, region: [...FORM], focus: [[555, 345, 340, 140]] },
      { cue: 36, region: [...FORM], focus: [[555, 375, 340, 40]] },
      { cue: 37, region: [...FORM], focus: [[555, 452, 340, 40]] },
    ],
  },
  { cue: 38, src: "screens/c-11-card-frame/code.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 428, 340, 38]] },
  { cue: 39, src: "screens/c-11-card-frame/accepted.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 352, 340, 34]] },
  { cue: 40, src: "screens/c-11-card-frame/masked.png", title: "Payment page · the masked line", region: [480, 270, 480, 300], focus: [[540, 293, 310, 28]] },
  { cue: 42, src: "screens/c-11-card-frame/alone.png", title: "The card frame, opened alone", region: [0, 0, 480, 300], beats: [{ cue: 43, region: [0, 0, 480, 300], focus: [[10, 26, 400, 34]] }] },
  { cue: 45, src: "screens/c-11-card-frame/lookalike.png", title: "A look-alike site", region: [400, 30, 640, 400], beats: [{ cue: 46, region: [400, 30, 640, 400], focus: [[490, 80, 462, 342]] }] },
];
