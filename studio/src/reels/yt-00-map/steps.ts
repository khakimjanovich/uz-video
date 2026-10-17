import { BuildMapStep } from "../../components";
import { BUILD_PARTS, builtBefore } from "../../series/build/map";

// Episode 00: walk the map (users → app → ports → infrastructure), then the six parts in build order.
const part = (n: number, cue: number): BuildMapStep => ({ cue, part: n, current: BUILD_PARTS[n].nodes, built: builtBefore(n) });

export const steps: BuildMapStep[] = [
  { cue: 0 },
  { cue: 1 },
  { cue: 2, current: ["merchant", "buyer", "admin", "partner", "commission", "terminal", "card", "payment"] },
  { cue: 3, current: ["emailport", "procport", "emailsvc", "procsvc"] },
  { cue: 4, current: ["postgres", "redis", "keycloak", "vault", "temporal"] },
  part(0, 5),
  part(1, 6),
  part(2, 7),
  part(3, 8),
  part(4, 9),
  part(5, 10),
  { cue: 11, part: 0, current: BUILD_PARTS[0].nodes },
];
