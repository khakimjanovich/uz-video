import { BuildMapStep } from "../../components";
import { BUILD_PARTS, builtBefore } from "../../series/build/map";

// Episode 00: walk the map (users → app → separate services → infrastructure), then the six parts in build order.
const part = (n: number, cue: number): BuildMapStep => ({ cue, part: n, current: BUILD_PARTS[n].nodes, built: builtBefore(n) });

export const steps: BuildMapStep[] = [
  { cue: 0 },
  { cue: 1 },
  { cue: 2, current: ["merchant", "buyer", "admin", "partner", "commission", "epos", "bin", "card", "payment"] },
  // One beat per module: what it owns.
  { cue: 3, current: ["partner"] },
  { cue: 4, current: ["commission"] },
  { cue: 5, current: ["epos"] },
  { cue: 6, current: ["bin"] },
  { cue: 7, current: ["card"] },
  { cue: 8, current: ["payment"] },
  { cue: 9, current: ["emailport", "procport", "emailsvc", "procsvc"] },
  { cue: 10, current: ["postgres", "redis", "keycloak", "vault", "s3", "temporal", "kafka", "observability"] },
  part(0, 11),
  part(1, 12),
  part(2, 13),
  part(3, 14),
  part(4, 15),
  part(5, 16),
  { cue: 17, part: 0, current: BUILD_PARTS[0].nodes },
];
