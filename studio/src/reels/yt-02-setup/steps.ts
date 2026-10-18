import { BuildMapStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 02: the project skeleton and the one-command environment.
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 10, part: 0, current: BUILD_PARTS[0].nodes },
];

const STACK = { java: [0.5, 0], spring: [1.5, 0], gradle: [2.5, 0] } as const;
const MODULES = { partner: [0, 1], commission: [0.75, 1], terminal: [1.5, 1], card: [2.25, 1], payment: [3, 1] } as const;
const INFRA = { docker: [0, 0.5], postgres: [1, 0.5], redis: [2, 0.5], keycloak: [3, 0.5] } as const;
const UP = [
  { from: "docker", to: "postgres" },
  { from: "postgres", to: "redis" },
  { from: "redis", to: "keycloak" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...STACK } },
  { cue: 2, layout: { ...STACK }, accent: ["java", "spring", "gradle"], badges: { java: "25", spring: "4.1", gradle: "multi-module" } },
  {
    cue: 3,
    layout: { gradle: [1.5, 0], ...MODULES, postgres: [1.5, 2] },
    edges: (["partner", "commission", "terminal", "card", "payment"] as const).map((m) => ({ from: m, to: "postgres" as const })),
    badges: { postgres: "schema + user each" },
  },
  {
    cue: 4,
    layout: { gradle: [1.5, 0], partner: [0, 1.6], payment: [3, 1.6] },
    edges: [{ from: "payment", to: "partner", broken: true, label: "reads internals" }],
    danger: ["payment"],
    badges: { gradle: "boundary test: build fails" },
  },
  { cue: 5, layout: { ...STACK }, accent: ["gradle"], badges: { gradle: "libs.versions.toml" } },
  { cue: 6, layout: { ...INFRA }, edges: [...UP], accent: ["docker"] },
  {
    cue: 7,
    layout: { ...INFRA, vault: [1, 2], temporal: [2, 2], kafka: [3, 2] },
    edges: [...UP],
    badges: { vault: "later", temporal: "later", kafka: "later" },
  },
  { cue: 8, layout: { spring: [1.5, 1] }, accent: ["spring"], badges: { spring: "ECS JSON · health UP" } },
  {
    cue: 9,
    layout: { ...INFRA },
    edges: [...UP],
    packets: [
      { from: "docker", to: "postgres", label: "up", delay: 8, duration: 18 },
      { from: "postgres", to: "redis", label: "up", delay: 28, duration: 18 },
      { from: "redis", to: "keycloak", label: "up", delay: 48, duration: 18 },
    ],
    accent: ["postgres", "redis", "keycloak"],
  },
];
