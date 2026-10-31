import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 11: seals on the card reader. Web skimming (0–2), the frame as a sealed card reader (3),
// its seals: one page, two files, fingerprints, hand-back (4–7), reports and the page watch (8–9), the close (10).
const SKIM = { buyer: [0, 1], m2Page: [1.5, 1], m2Skimmer: [3, 1] } as const;
const SKIM_EDGES = [{ from: "buyer", to: "m2Page" }, { from: "m2Page", to: "m2Skimmer" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Stolen without a break-in.
  { cue: 0, layout: { m2Page: [0.6, 1], attacker: [2.8, 1] }, packets: [{ from: "m2Page", to: "attacker", label: "card number" }] },
  {
    cue: 1,
    layout: SKIM,
    edges: [...SKIM_EDGES],
    packets: [{ from: "buyer", to: "m2Page", label: "card number" }, { from: "m2Page", to: "m2Skimmer", label: "a copy", delay: 50 }],
  },
  { cue: 2, layout: SKIM, edges: [...SKIM_EDGES], danger: ["m2Skimmer"], badges: { m2Skimmer: "web skimming" } },
  // The bank's card reader, with seals.
  {
    cue: 3,
    layout: { m2Page: [0.4, 1], m2Frame: [2.4, 1] },
    edges: [{ from: "m2Page", to: "m2Frame", label: "holds" }],
    frames: [{ label: "The shop's counter", from: [0.4, 1], to: [2.4, 1] }],
    badges: { m2Frame: "sealed" },
  },
  {
    cue: 4,
    layout: { m2Page: [0, 0.2], m2OtherPage: [0, 1.8], m2Frame: [2.6, 1] },
    edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2OtherPage", to: "m2Frame", broken: true }],
    badges: { m2Page: "named in the session" },
  },
  {
    cue: 5,
    layout: { m2Files: [0, 1], m2Frame: [1.5, 1], m2Skimmer: [3, 1] },
    edges: [{ from: "m2Files", to: "m2Frame" }, { from: "m2Skimmer", to: "m2Frame", broken: true }],
    badges: { m2Frame: "only its own" },
  },
  {
    cue: 6,
    layout: { m2Files: [0, 0.2], m2Changed: [0, 1.8], m2Frame: [2.4, 1] },
    edges: [{ from: "m2Files", to: "m2Frame" }, { from: "m2Changed", to: "m2Frame", broken: true }],
    crossed: ["m2Changed"],
    badges: { m2Changed: "does not run" },
  },
  {
    cue: 7,
    layout: { m2Frame: [0.4, 1], m2Page: [2.6, 1] },
    edges: [{ from: "m2Frame", to: "m2Page" }],
    packets: [{ from: "m2Frame", to: "m2Page", label: "token" }, { from: "m2Frame", to: "m2Page", label: "masked number", delay: 45 }],
    badges: { m2Page: "that one page" },
  },
  // Blocks are reported; the page around is watched.
  {
    cue: 8,
    layout: { m2Browser: [0.4, 1], m2Report: [2.6, 1] },
    edges: [{ from: "m2Browser", to: "m2Report" }],
    packets: [{ from: "m2Browser", to: "m2Report", label: "blocked" }],
    badges: { m2Report: "tampering seen" },
  },
  {
    cue: 9,
    layout: { m2Frame: [0, 1], m2Page: [1.5, 1], m2Watch: [3, 1] },
    edges: [{ from: "m2Page", to: "m2Frame" }, { from: "m2Watch", to: "m2Page", label: "watches" }],
    badges: { m2Page: "watched too" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 10, part: 2, current: ["frame", "card"], units: { cards: "two doors" } },
];
