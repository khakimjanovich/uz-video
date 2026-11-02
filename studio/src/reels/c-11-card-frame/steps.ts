import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 11: seals on the card reader. Bekzod reads about web skimming (0–6), asks Timur (7–8), the bridge (9–10),
// the frame as the bank's card reader (11–15), seal one (16–18), seal two (19–22), seal three (23–25), the hand-back (26–28),
// reports and the watched page (29–31), Timur and Bekzod try to break it (32–52), the moment in plain view (53–59),
// Bekzod sleeps (60), next (64).
const BEKZOD = { laptop: [0.4, 1], card: [2.6, 1] } as const;
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
  // Bekzod reads about web skimming.
  { cue: 0, layout: { laptop: [0.6, 1], m2Skimmer: [2.8, 1] }, badges: { laptop: "Bekzod · Wed" } },
  { cue: 1, layout: { m2Page: [0.6, 1], m2Skimmer: [2.8, 1] }, edges: [{ from: "m2Skimmer", to: "m2Page", label: "one line" }] },
  {
    cue: 2,
    layout: { m2Analytics: [0, 0.2], m2SharedServer: [0, 1.8], m2Page: [2.6, 1] },
    edges: [{ from: "m2Analytics", to: "m2Page", label: "hacked" }, { from: "m2SharedServer", to: "m2Page", label: "changed file" }],
  },
  { cue: 3, ...SK, packets: [{ from: "buyer", to: "m2Page", label: "card number" }, { from: "m2Page", to: "m2Skimmer", label: "a copy", delay: 50 }] },
  { cue: 4, ...SK, badges: { m2Page: "still works" } },
  { cue: 5, ...SK, badges: { buyer: "still pays" } },
  { cue: 6, ...SK, danger: ["m2Skimmer"], badges: { m2Skimmer: "weeks unseen" } },
  // Bekzod asks Timur.
  { cue: 7, layout: BEKZOD, edges: [{ from: "laptop", to: "card", label: "could this happen?" }], packets: [{ from: "laptop", to: "card", label: "Malika's buyers?" }], badges: { laptop: "Bekzod", card: "Timur" } },
  { cue: 8, layout: BEKZOD, edges: [{ from: "card", to: "laptop" }], packets: [{ from: "card", to: "laptop", label: "come and try" }], accent: ["card"], badges: { laptop: "Bekzod", card: "Timur" } },
  // The bank's card reader.
  { cue: 11, layout: { m2Frame: [1.5, 1] }, accent: ["m2Frame"], badges: { m2Frame: "its own address" } },
  { cue: 12, ...READER },
  { cue: 14, ...READER, badges: { m2Frame: "tamper seals" } },
  { cue: 15, ...READER, badges: { m2Frame: "three seals" } },
  // Seal one: one page.
  { cue: 16, ...ONE_PAGE, badges: { m2Page: "named in the session" } },
  { cue: 17, layout: { buyer: [0, 1], card: [1.5, 1], m2Page: [3, 1] }, edges: [{ from: "buyer", to: "card" }, { from: "card", to: "m2Page", label: "session" }], badges: { m2Page: "one page" } },
  { cue: 18, ...ONE_PAGE, danger: ["m2OtherPage"], badges: { m2OtherPage: "look-alike: refused" } },
  // Seal two: its policy.
  { cue: 19, ...POLICY, accent: ["m2Frame"], badges: { m2Frame: "its policy" } },
  { cue: 20, ...POLICY, packets: [{ from: "m2Frame", to: "m2Files", label: "the rule" }], badges: { m2Frame: "a rule" } },
  { cue: 21, ...POLICY, badges: { m2Files: "own two files", card: "own address" } },
  { cue: 22, ...POLICY, packets: [{ from: "m2Skimmer", to: "m2Frame", label: "script", stopAt: 0.8 }], badges: { m2Skimmer: "refused" } },
  // Seal three: fingerprints.
  { cue: 23, ...HASH },
  { cue: 24, ...HASH, badges: { m2Files: "a fingerprint each" } },
  { cue: 25, ...HASH, crossed: ["m2Changed"], badges: { m2Changed: "will not run" } },
  // Only a token and the masked number go back.
  { cue: 26, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "token" }, { from: "m2Frame", to: "m2Page", label: "masked number", delay: 45 }] },
  { cue: 27, ...BACK, badges: { m2Page: "that one page" } },
  { cue: 28, ...BACK, packets: [{ from: "m2Frame", to: "m2Page", label: "card number", stopAt: 0.4 }], badges: { m2Frame: "number stays" } },
  // Reports, and the page around is watched.
  { cue: 29, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "blocked" }] },
  { cue: 30, ...REPORT, badges: { card: "a trace" } },
  {
    cue: 31,
    layout: { m2Frame: [0, 1], m2Page: [1.5, 1], m2Watch: [3, 1] },
    edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2Watch", to: "m2Page", label: "watches" }],
    badges: { m2Page: "watched too" },
  },
  // Timur and Bekzod try to break it.
  { cue: 32, layout: { laptop: [0.4, 1], m2Frame: [2.6, 1] }, edges: [{ from: "laptop", to: "m2Frame", label: "break it" }], badges: { laptop: "Bekzod · Timur" } },
  // He plays the thief: the console's red line.
  {
    cue: 45,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
    badges: { m2Skimmer: "Bekzod" },
  },
  {
    cue: 46,
    layout: { m2Skimmer: [0, 1], m2Frame: [1.5, 1], m2Browser: [3, 1] },
    edges: [{ from: "m2Skimmer", to: "m2Frame", broken: true }, { from: "m2Frame", to: "m2Browser" }],
    packets: [{ from: "m2Skimmer", to: "m2Frame", label: "load script", stopAt: 0.8 }],
  },
  { cue: 47, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], danger: ["m2Console"], badges: { m2Console: "refused: policy" } },
  { cue: 48, layout: { m2Frame: [0.4, 1], m2Console: [2.6, 1] }, edges: [{ from: "m2Frame", to: "m2Console" }], badges: { m2Frame: "nothing loads" } },
  // Timur's screen: the report in the logs.
  { cue: 49, ...REPORT, accent: ["m2Team"], badges: { m2Team: "Timur" } },
  { cue: 50, ...REPORT, packets: [{ from: "m2Browser", to: "card", label: "report" }] },
  { cue: 51, ...REPORT, packets: [{ from: "card", to: "m2Team", label: "rule · page" }], badges: { m2Team: "in the logs" } },
  { cue: 52, ...REPORT, badges: { m2Team: "no card data" } },
  // The moment in plain view.
  { cue: 53, layout: { buyer: [0.4, 1], m2Frame: [2.6, 1] }, edges: [{ from: "buyer", to: "m2Frame", label: "typing" }], badges: { buyer: "often forgotten" } },
  { cue: 54, layout: { m2Db: [0, 0.2], m2Skimmer: [0, 1.8], buyer: [2.6, 1] }, edges: [{ from: "m2Skimmer", to: "buyer", label: "at the keyboard" }], badges: { m2Db: "locked · sealed" } },
  { cue: 55, layout: { buyer: [0.4, 1], m2Frame: [2.6, 1] }, edges: [{ from: "buyer", to: "m2Frame", label: "typing" }], badges: { buyer: "plain view" } },
  { cue: 56, ...READER, accent: ["m2Frame"], badges: { m2Frame: "guards the moment" } },
  { cue: 57, ...SK, crossed: ["m2Skimmer"], badges: { buyer: "protected" } },
  { cue: 58, ...READER, badges: { m2Frame: "no stolen form" } },
  { cue: 59, ...READER, badges: { m2Page: "never the number" } },
  // Bekzod sleeps.
  { cue: 60, layout: { laptop: [1.5, 1] }, accent: ["laptop"], badges: { laptop: "Bekzod slept" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 9, part: 3, current: ["payment", "frame"] },
  { cue: 10, part: 3, current: ["buyer", "frame"], units: { cards: "seals" } },
  // Recap, the question (held 2 s), and the answer: only the lesson's own boxes stay bright.
  { cue: 61, part: 3 },
  { cue: 63, part: 3, current: ["frame"] },
  { cue: 64, part: 3, rows: [3], current: ["frame", "card"], units: { cards: "two doors" } },
];

// The frame on the pay page: typing, the code, "Card accepted", the masked line; alone; in a look-alike site.
const FORM = [460, 268, 520, 360] as const;
export const screens: ScreenStep[] = [
  {
    cue: 33,
    src: "screens/c-11-card-frame/typed.png",
    title: "Payment page · card frame",
    region: [440, 20, 560, 350],
    beats: [
      { cue: 34, region: [...FORM], focus: [[555, 345, 340, 140]] },
      { cue: 35, region: [...FORM], focus: [[555, 375, 340, 40]] },
      { cue: 36, region: [...FORM], focus: [[555, 452, 340, 40]] },
    ],
  },
  { cue: 37, src: "screens/c-11-card-frame/code.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 428, 340, 38]] },
  { cue: 38, src: "screens/c-11-card-frame/accepted.png", title: "Payment page · card frame", region: [...FORM], focus: [[555, 352, 340, 34]] },
  { cue: 39, src: "screens/c-11-card-frame/masked.png", title: "Payment page · the masked line", region: [480, 270, 480, 300], focus: [[540, 293, 310, 28]] },
  { cue: 40, src: "screens/c-11-card-frame/alone.png", title: "The card frame, opened alone", region: [0, 0, 480, 300], beats: [{ cue: 41, region: [0, 0, 480, 300], focus: [[10, 26, 400, 34]] }] },
  { cue: 43, src: "screens/c-11-card-frame/lookalike.png", title: "A look-alike site", region: [400, 30, 640, 400], beats: [{ cue: 44, region: [400, 30, 640, 400], focus: [[490, 80, 462, 342]] }] },
];
