import { BuildMapStep } from "../../components";
import { BUILD_PARTS, builtBefore } from "../../series/build/map";

// Episode 00: walk the map (users → app → ports → infrastructure), then the six parts in build order.
const part = (n: number, cue: number): BuildMapStep => ({ cue, part: n, current: BUILD_PARTS[n].nodes, built: builtBefore(n) });

export const steps: BuildMapStep[] = [
  { cue: 0 },
  { cue: 1 },
  { cue: 2, current: ["merchant", "buyer", "admin", "partner", "commission", "terminal", "card", "payment"] },
  // One beat per module: what it owns.
  { cue: 3, current: ["partner"] },
  { cue: 4, current: ["commission"] },
  { cue: 5, current: ["terminal"] },
  { cue: 6, current: ["card"] },
  { cue: 7, current: ["payment"] },
  { cue: 8, current: ["emailport", "procport", "emailsvc", "procsvc"] },
  { cue: 9, current: ["postgres", "redis", "keycloak", "vault", "temporal"] },
  part(0, 10),
  part(1, 11),
  part(2, 12),
  part(3, 13),
  part(4, 14),
  part(5, 15),
  { cue: 16, part: 0, current: BUILD_PARTS[0].nodes },
];
