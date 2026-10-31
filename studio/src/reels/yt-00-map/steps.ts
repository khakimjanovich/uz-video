import { BuildMapStep } from "../../components";
import { BUILD_PARTS, builtBefore } from "../../series/build/map";

// Episode 00: walk the map (users → app → separate services → infrastructure), then the six parts in build order.
const part = (n: number, cue: number): BuildMapStep => ({ cue, part: n, current: BUILD_PARTS[n].nodes, built: builtBefore(n) });

export const steps: BuildMapStep[] = [
  { cue: 0 },
  { cue: 1 },
  { cue: 2, current: ["merchant", "buyer", "admin"] },
  // ecom: one beat per module, what it owns.
  { cue: 3, current: ["partner", "commission", "epos", "payment", "reconciliation"] },
  { cue: 4, current: ["partner"] },
  { cue: 5, current: ["commission"] },
  { cue: 6, current: ["epos"] },
  { cue: 7, current: ["payment"] },
  { cue: 8, current: ["reconciliation"] },
  // The cards unit: everything that touches a card number.
  { cue: 9, current: ["frame", "card", "bin", "adapters", "cardsinfra"] },
  { cue: 10, current: ["frame"] },
  { cue: 11, current: ["card"] },
  { cue: 12, current: ["bin"] },
  { cue: 13, current: ["adapters", "procport", "procsvc"] },
  { cue: 14, current: ["postgres", "redis", "keycloak", "vault", "s3", "temporal", "kafka", "observability", "cardsinfra"] },
  part(0, 15),
  part(1, 16),
  part(2, 17),
  part(3, 18),
  part(4, 19),
  part(5, 20),
  { cue: 21, part: 0, current: BUILD_PARTS[0].nodes },
];
