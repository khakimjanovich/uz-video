import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

type Beat = Omit<DiagramStep<BuildId>, "cue">;

// Lesson 10: what the first digits tell you. 11:10 pm, a card the shop doesn't take (0–4), the bridge (5–6), the BIN (7–10),
// the lists copied in and kept (11–15), the lookup (16–24), checked before any code (25–29), the request never sent (30–33),
// tonight's buyer on the page (34–46), nobody woken (47–49), never the person (50), next (51).
const BIN = { m2Card: [0, 1], network: [2.8, 0.2], issuer: [2.8, 1.8] } as const;
const B: Beat = { layout: BIN, edges: [{ from: "m2Card", to: "network", label: "BIN" }, { from: "m2Card", to: "issuer", label: "BIN" }] };
const LISTS = { m2NetworkA: [0, 0.2], m2NetworkB: [0, 1.8], m2AdapterA: [1.5, 0.2], m2AdapterB: [1.5, 1.8], m2Bin: [3, 1] } as const;
const LIST_EDGES = [
  { from: "m2NetworkA", to: "m2AdapterA" },
  { from: "m2NetworkB", to: "m2AdapterB" },
  { from: "m2AdapterA", to: "m2Bin" },
  { from: "m2AdapterB", to: "m2Bin" },
] as const;
const SILENT_B = [LIST_EDGES[0], { from: "m2NetworkB", to: "m2AdapterB", broken: true }, LIST_EDGES[2], LIST_EDGES[3]] as const;
const L: Beat = { layout: LISTS, edges: [...LIST_EDGES] };
const TRY = { m2First8: [0, 1], m2Try8: [2.6, 0], m2Try7: [2.6, 1], m2Try6: [2.6, 2] } as const;
const TRY_EDGES = [{ from: "m2First8", to: "m2Try8" }, { from: "m2First8", to: "m2Try7" }, { from: "m2First8", to: "m2Try6" }] as const;
const CHECK = { m2Card: [0, 1], m2Bin: [1.5, 1], network: [3, 0.2], m2Person: [3, 1.8] } as const;
const CHECK_EDGES = [{ from: "m2Card", to: "m2Bin" }, { from: "m2Bin", to: "network", broken: true }, { from: "network", to: "m2Person", broken: true }] as const;
const C: Beat = { layout: CHECK, edges: [...CHECK_EDGES] };
const QUIET = { m2NetworkA: [0, 1], m2Bin: [1.5, 1], m2Team: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // 11:10 pm: a card from a network Malika's shop doesn't take.
  {
    cue: 0,
    layout: CHECK,
    edges: [{ from: "m2Card", to: "m2Bin" }, { from: "m2Bin", to: "network" }, { from: "network", to: "m2Person" }],
    packets: [{ from: "m2Card", to: "m2Bin", label: "send code" }],
    badges: { m2Card: "23:10" },
  },
  {
    cue: 1,
    layout: { shop: [0.4, 1], m2NetworkA: [2.6, 0.2], m2NetworkB: [2.6, 1.8] },
    edges: [{ from: "shop", to: "m2NetworkA", label: "accepts" }, { from: "shop", to: "m2NetworkB", broken: true }],
    badges: { shop: "Malika's shop", m2NetworkB: "this card" },
  },
  { cue: 2, ...C, badges: { m2Person: "stays dark" } },
  { cue: 3, ...C, packets: [{ from: "m2Bin", to: "m2Card", label: "refused" }], badges: { m2Bin: "answers at once", network: "not asked" } },
  {
    cue: 4,
    layout: { m2Card: [0, 1], m2NetworkA: [3, 0.2], m2NetworkB: [3, 1.8] },
    edges: [{ from: "m2Card", to: "m2NetworkA", label: "?" }, { from: "m2Card", to: "m2NetworkB", label: "?" }],
  },
  // The BIN.
  { cue: 7, ...B },
  { cue: 8, ...B, badges: { m2Card: "BIN" } },
  { cue: 9, layout: { m2NetworkA: [0.5, 1], m2NetworkB: [2.6, 1] }, badges: { m2NetworkA: "its own list", m2NetworkB: "its own list" } },
  { cue: 10, layout: { m2NetworkA: [0.5, 1], m2NetworkB: [2.6, 1] }, badges: { m2NetworkA: "BIN list", m2NetworkB: "BIN list" } },
  // Copied in through the adapters, and kept.
  { cue: 11, ...L, packets: [{ from: "m2AdapterA", to: "m2Bin", label: "list" }, { from: "m2AdapterB", to: "m2Bin", label: "list", delay: 30 }] },
  { cue: 12, ...L, accent: ["m2Bin"], badges: { m2Bin: "at start · on schedule" } },
  { cue: 13, layout: LISTS, edges: [...SILENT_B], danger: ["m2NetworkB"], badges: { m2NetworkB: "silent or empty" } },
  { cue: 14, layout: LISTS, edges: [...SILENT_B], badges: { m2Bin: "keeps the old list" } },
  { cue: 15, ...L, badges: { m2Bin: "old beats none" } },
  // The lookup, like a phone's country code.
  { cue: 16, layout: { m2Phone: [0, 1], m2Short: [2.6, 0.2], m2Long: [2.6, 1.8] }, edges: [{ from: "m2Phone", to: "m2Short" }, { from: "m2Phone", to: "m2Long" }], accent: ["m2Long"], badges: { m2Long: "more exact" } },
  { cue: 17, layout: { m2Card: [0, 1], m2First8: [2.6, 1] }, edges: [{ from: "m2Card", to: "m2First8", label: "first eight" }] },
  { cue: 18, layout: TRY, edges: [...TRY_EDGES] },
  { cue: 19, layout: TRY, edges: [...TRY_EDGES], accent: ["m2Try8"], badges: { m2Try8: "longest wins" } },
  { cue: 20, layout: { m2Bin: [0.4, 1], m2Db: [2.6, 1] }, edges: [{ from: "m2Bin", to: "m2Db", broken: true }], badges: { m2Bin: "in memory · fast" } },
  { cue: 21, layout: { m2First8: [0.4, 1], m2Bin: [2.6, 1] }, edges: [{ from: "m2First8", to: "m2Bin" }], packets: [{ from: "m2First8", to: "m2Bin", label: "12345678" }] },
  { cue: 22, layout: { m2First8: [0.4, 1], m2Bin: [2.6, 1] }, edges: [{ from: "m2First8", to: "m2Bin" }], badges: { m2Bin: "never the whole" } },
  { cue: 23, layout: { m2First8: [0.4, 1], m2Bin: [2.6, 1] }, edges: [{ from: "m2First8", to: "m2Bin" }], packets: [{ from: "m2Bin", to: "m2First8", label: "[ ]" }], badges: { m2Bin: "not an error" } },
  { cue: 24, layout: { m2First8: [0.4, 1], m2Bin: [2.6, 1] }, edges: [{ from: "m2First8", to: "m2Bin" }], badges: { m2First8: "an empty list" } },
  // Checked before any code is sent.
  {
    cue: 26,
    layout: CHECK,
    edges: [{ from: "m2Card", to: "m2Bin" }, { from: "m2Bin", to: "network" }, { from: "network", to: "m2Person" }],
    packets: [{ from: "m2Card", to: "m2Bin", label: "check first" }],
    accent: ["m2Bin"],
  },
  { cue: 27, ...C, packets: [{ from: "m2Card", to: "m2Bin", label: "other network" }], badges: { m2Bin: "refused here" } },
  { cue: 28, ...C, badges: { network: "not bothered" } },
  { cue: 29, ...C, badges: { m2Person: "no buzz" } },
  // The request you never send.
  { cue: 30, ...C, accent: ["m2Bin"], badges: { m2Bin: "never sent" } },
  {
    cue: 31,
    layout: { m2Card: [0, 1], network: [1.5, 1], m2Person: [3, 1] },
    edges: [{ from: "m2Card", to: "network" }, { from: "network", to: "m2Person" }],
    packets: [{ from: "m2Card", to: "network", label: "send a code" }],
    badges: { m2Card: "without the check" },
  },
  {
    cue: 32,
    layout: { m2Card: [0, 1], network: [1.5, 1], m2Person: [3, 1] },
    edges: [{ from: "m2Card", to: "network" }, { from: "network", to: "m2Person" }],
    packets: [{ from: "network", to: "m2Person", label: "a code" }],
    danger: ["m2Person"],
    badges: { m2Person: "can never work" },
  },
  { cue: 33, layout: { m2Card: [0, 1], network: [1.5, 1], m2Person: [3, 1] }, edges: [{ from: "m2Card", to: "network" }, { from: "network", to: "m2Person" }], danger: ["network"], badges: { network: "should never see it" } },
  // Nobody woken at the bank.
  { cue: 47, layout: QUIET, edges: [{ from: "m2NetworkA", to: "m2Bin" }, { from: "m2Bin", to: "m2Team" }], badges: { m2Team: "all quiet" } },
  { cue: 48, layout: QUIET, edges: [{ from: "m2NetworkA", to: "m2Bin" }, { from: "m2Bin", to: "m2Team" }], badges: { m2Bin: "normal refusal" } },
  {
    cue: 49,
    layout: QUIET,
    edges: [{ from: "m2NetworkA", to: "m2Bin", broken: true }, { from: "m2Bin", to: "m2Team" }],
    packets: [{ from: "m2Bin", to: "m2Team", label: "lists stopped" }],
    badges: { m2Team: "Timur's team" },
  },
  // Never the person.
  { cue: 50, ...B, badges: { m2Card: "never the person" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the one before.
  { cue: 5, part: 3, current: ["card"] },
  { cue: 6, part: 3, current: ["bin"], units: { cards: "first digits" } },
  { cue: 25, part: 3, current: ["frame", "bin"], units: { cards: "check first" } },
  { cue: 51, part: 3, current: ["frame"], units: { cards: "card form" } },
];

// The pay page: the networks above the card form, the refusals, the code, the masked line with its bank.
const FORM = [460, 268, 520, 360] as const;
const LINE = [480, 270, 480, 300] as const;
const PAN = [555, 375, 340, 40] as const;
const MESSAGE = [555, 554, 340, 52] as const;
export const screens: ScreenStep[] = [
  {
    cue: 34,
    src: "screens/c-10-bin-directory/networks.png",
    title: "Payment page",
    region: [440, 20, 560, 350],
    beats: [{ cue: 35, region: [...FORM], focus: [[545, 285, 125, 26]] }],
  },
  {
    cue: 36,
    src: "screens/c-10-bin-directory/not-accepted.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[...PAN]],
    beats: [{ cue: 37, region: [...FORM], focus: [[...MESSAGE]] }],
  },
  {
    cue: 39,
    src: "screens/c-10-bin-directory/unknown-digits.png",
    title: "Payment page · card form",
    region: [...FORM],
    focus: [[...PAN]],
    beats: [{ cue: 40, region: [...FORM], focus: [[...MESSAGE]] }],
  },
  { cue: 42, src: "screens/c-10-bin-directory/typed.png", title: "Payment page · card form", region: [...FORM], focus: [[...PAN]] },
  { cue: 43, src: "screens/c-10-bin-directory/code.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 375, 340, 40]] },
  { cue: 44, src: "screens/c-10-bin-directory/accepted.png", title: "Payment page · card form", region: [...FORM], focus: [[555, 352, 340, 34]] },
  {
    cue: 45,
    src: "screens/c-10-bin-directory/masked.png",
    title: "Payment page · the masked line",
    region: [...LINE],
    focus: [[540, 293, 310, 28]],
    beats: [{ cue: 46, region: [...LINE], focus: [[540, 293, 122, 28]] }],
  },
];
