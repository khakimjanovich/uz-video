import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 37: releases. The printed edition (cues 0–2), version numbers (3), built from the release (4),
// pinned everywhere (5), the upgrade (6), the database forward only (7), the close (8).
const STEPS = { m78BackUp: [0, 1], m78ChangeVersion: [1, 1], m78Deploy: [2, 1], m78Check: [3, 1] } as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 8, current: ["kubernetes"] },
  { cue: 8, part: 8, units: { ecom: "product", cards: "product" } },
];

export const diagram: DiagramStep<BuildId>[] = [
  // The printed edition.
  { cue: 1, layout: { m78Book: [1.5, 1] }, badges: { m78Book: "printed" } },
  { cue: 2, layout: { m78Release: [1.5, 1] }, accent: ["m78Release"] },
  // What the number says.
  { cue: 3, layout: { m78Major: [0, 1], m78Minor: [1.5, 1], m78Patch: [3, 1] }, accent: ["m78Major"] },
  // Built from the release, with a parts list.
  {
    cue: 4,
    layout: { m78Release: [0.4, 1], m78Built: [2.6, 1] },
    edges: [{ from: "m78Release", to: "m78Built", label: "built" }],
    packets: [{ from: "m78Release", to: "m78Built", label: "1.4.0" }],
    badges: { m78Release: "fixed", m78Built: "every component" },
  },
  // Pinned everywhere, the laptop too.
  {
    cue: 5,
    layout: { m78Release: [1.5, 0.3], laptop: [0, 1.9], m78TestServer: [1.5, 1.9], m78Prod: [3, 1.9] },
    edges: [{ from: "m78Release", to: "laptop" }, { from: "m78Release", to: "m78TestServer" }, { from: "m78Release", to: "m78Prod" }],
    badges: { laptop: "pinned 1.4.0", m78TestServer: "pinned 1.4.0", m78Prod: "pinned 1.4.0" },
  },
  // The upgrade.
  {
    cue: 6,
    layout: STEPS,
    edges: [{ from: "m78BackUp", to: "m78ChangeVersion" }, { from: "m78ChangeVersion", to: "m78Deploy" }, { from: "m78Deploy", to: "m78Check" }],
    accent: ["m78BackUp"],
  },
  // The database only moves forward.
  {
    cue: 7,
    layout: { m78Rollback: [0.4, 1], m78Db: [2.6, 1] },
    edges: [{ from: "m78Db", to: "m78Rollback", broken: true }],
    danger: ["m78Rollback"],
    accent: ["m78Db"],
  },
];
