import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 11: seals on the card reader. Web skimming (0–7), the frame as the bank's card reader (8–13), seal one (14–16),
// seal two (17–20), seal three (21–23), the hand-back (24–26), reports and the watched page (27–29), the product (30–50),
// what it protects (51–56), the card reader again (57–60), next (61).
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
  { cue: 1, layout: { m2Page: [0.6, 1], m2Skimmer: [2.8, 1] }, edges: [{ from: "m2Skimmer", to: "m2Page", label: "one line" }] },
  {
    cue: 2,
    layout: { m2Analytics: [0, 0.2], m2SharedServer: [0, 1.8], m2Page: [2.6, 1] },
    edges: [{ from: "m2Analytics", to: "m2Page", label: "hacked" }, { from: "m2SharedServer", to: "m2Page", label: "changed file" }],
  },
  { cue: 3, ...SK, packets: [{ from: "buyer", to: "m2Page", label: "card number" }, { from: "m2Page", to: "m2Skimmer", label: "a copy", delay: 50 }] },
  { cue: 4, ...SK, badges: { m2Page: "still works" } },
  { cue: 5, ...SK, badges: { buyer: "still pays" } },
  { cue: 6, ...SK, badges: { m2Skimmer: "weeks unseen" } },
  { cue: 7, ...SK, danger: ["m2Skimmer"], badges: { m2Skimmer: "web skimming" } },
  // The bank's card reader.
  { cue: 8, layout: { m2Frame: [1.5, 1] }, accent: ["m2Frame"] },
  { cue: 9, layout: { m2Frame: [1.5, 1] }, badges: { m2Frame: "its own address" } },
  { cue: 10, ...READER },
  { cue: 11, ...READER, badges: { m2Frame: "the bank's reader" } },
  { cue: 12, ...READER, badges: { m2Frame: "tamper seals" } },
  // Seal one: one page.
  { cue: 14, ...ONE_PAGE, badges: { m2Page: "named in the session" } },
  { cue: 15, layout: { buyer: [0, 1], card: [1.5, 1], m2Page: [3, 1] }, edges: [{ from: "buyer", to: "card" }, { from: "card", to: "m2Page", label: "session" }], badges: { m2Page: "one page" } },
  { cue: 16, ...ONE_PAGE, danger: ["m2OtherPage"], badges: { m2OtherPage: "look-alike: refused" } },
  // Seal two: its policy.
  { cue: 17, ...POLICY, accent: ["m2Frame"], badges: { m2Frame: "its policy" } },
  { cue: 18, ...POLICY, packets: [{ from: "m2Frame", to: "m2Files", label: "the rule" }], badges: { m2Frame: "a rule" } },
  { cue: 19, ...POLICY, badges: { m2Files: "own two files", card: "own address" } },
  { cue: 20, ...POLICY, packets: [{ from: "m2Skimmer", to: "m2Frame", label: "script", stopAt: 0.8 }], badges: { m2Skimmer: "refused" } },
  // Seal three: fingerprints.
  { cue: 21, ...HASH },
  { cue: 22, ...HASH, badges: { m2Files: "a fingerprint each" } },
  { cue: 23, ...HASH, crossed: ["m2Changed"], badges: { m2Changed: "will not run" } },
  // Only a token and the masked number go back.
  { cue: 24, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "token" }, { from: "m2Frame", to: "m2Page", label: "masked number", delay: 45 }] },
  { cue: 25, ...BACK, badges: { m2Page: "that one page" } },
  { cue: 26, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "card number", stopAt: 0.4 }], badges: { m2Frame: "number stays" } },
  // Reports, and the page around is watched.
  { cue: 27, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "blocked" }] },
  { cue: 28, ...REPORT, badges: { card: "a trace" } },
  {
    cue: 29,
    layout: { m2Frame: [0, 1], m2Page: [1.5, 1], m2Watch: [3, 1] },
    edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2Watch", to: "m2Page", label: "watches" }],
    badges: { m2Page: "watched too" },
  },
  // Act as a skimmer: the console's red line.
  {
    cue: 44,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
  },
  {
    cue: 45,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
    packets: [{ from: "m2Skimmer", to: "m2Frame", label: "load script", stopAt: 0.8 }],
  },
  { cue: 46, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], danger: ["m2Console"], badges: { m2Console: "refused: policy" } },
  { cue: 47, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], badges: { m2Frame: "nothing loads" } },
  { cue: 48, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "report" }] },
  { cue: 49, ...REPORT, packets: [{ from: "card", to: "m2Team", label: "rule · page" }], badges: { m2Team: "in the logs" } },
  { cue: 50, ...REPORT, badges: { m2Team: "no card data" } },
  // What it protects.
  { cue: 52, layout: { buyer: [0.4, 1], m2Frame: [2.6, 1] }, edges: [{ from: "buyer", to: "m2Frame", label: "typing" }], badges: { buyer: "plain view" } },
  { cue: 53, layout: { m2Db: [0, 0.2], m2Skimmer: [0, 1.8], buyer: [2.6, 1] }, edges: [{ from: "m2Skimmer", to: "buyer", label: "at the keyboard" }], badges: { m2Db: "locked · sealed" } },
  { cue: 54, ...SK, crossed: ["m2Skimmer"], badges: { buyer: "protected" } },
  { cue: 55, ...READER, badges: { m2Frame: "no stolen form" } },
  { cue: 56, ...READER, badges: { m2Page: "never the number" } },
  // The card reader again.
  { cue: 57, ...READER },
  { cue: 58, ...POLICY, badges: { m2Files: "bank's software only" } },
  { cue: 59, ...ONE_PAGE, badges: { m2Page: "one counter" } },
  { cue: 60, ...HASH, crossed: ["m2Changed"], badges: { m2Changed: "a broken seal shows" } },
];

export const map: BuildMapStep[] = [
  { cue: 61, part: 3, current: ["frame", "card"], units: { cards: "two doors" } },
];

// The frame on the pay page: typing, the code, "Card accepted", the masked line; alone; in a look-alike site.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 31,
    src: "screens/c-11-card-frame/typed.png",
    title: "Payment page · card frame",
    region: [440, 20, 560, 350],
    beats: [
      { cue: 32, region: [...FORM], focus: [[555, 345, 340, 140]] },
      { cue: 33, region: [...FORM], focus: [[555, 375, 340, 40]] },
      { cue: 34, region: [...FORM], focus: [[555, 452, 340, 40]] },
    ],
  },
  { cue: 35, src: "screens/c-11-card-frame/code.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 428, 340, 38]] },
  { cue: 36, src: "screens/c-11-card-frame/accepted.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 352, 340, 34]] },
  { cue: 37, src: "screens/c-11-card-frame/masked.png", title: "Payment page · the masked line", region: [480, 270, 480, 300], focus: [[540, 293, 310, 28]] },
  { cue: 39, src: "screens/c-11-card-frame/alone.png", title: "The card frame, opened alone", region: [0, 0, 480, 300], beats: [{ cue: 40, region: [0, 0, 480, 300], focus: [[10, 26, 400, 34]] }] },
  { cue: 42, src: "screens/c-11-card-frame/lookalike.png", title: "A look-alike site", region: [400, 30, 640, 400], beats: [{ cue: 43, region: [400, 30, 640, 400], focus: [[490, 80, 462, 342]] }] },
];
