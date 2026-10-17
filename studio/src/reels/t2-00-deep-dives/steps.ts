import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Entrance to Tier 2: the eight deep-dive icons, already met in Tier 1, line up as the stops ahead.
export const acts: ActsMap = { hook: 0 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const STOPS: Layout = {
  dd1: [0, 0], dd2: [1, 0], dd3: [2, 0],
  dd4: [0, 1.9], dd5: [1, 1.9], dd6: [2, 1.9],
  dd7: [0, 3.8], dd8: [1, 3.8],
};
const ORDER = ["dd1", "dd2", "dd3", "dd4", "dd5", "dd6", "dd7", "dd8"] as const;
const ROUTE: Edge[] = ORDER.slice(1).map((to, i) => ({ from: ORDER[i], to }));

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 "Now, let's talk about the deep dives": the eight icons appear.
  { cue: 0, layout: STOPS },
  // 1 Each key term gets the full story: the route runs through them in order.
  { cue: 1, layout: STOPS, edges: ROUTE },
];
