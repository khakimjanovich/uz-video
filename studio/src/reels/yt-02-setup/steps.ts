import { BuildMapStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 02: the setup, as choices and their reasons; every beat is a diagram, no code.
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 17, part: 0, current: BUILD_PARTS[0].nodes },
];

const INFRA = {
  docker: [0, 1],
  postgres: [1, 0], redis: [2, 0], mail: [3, 0],
  bucket: [1, 0.67], keycloak: [2, 0.67], processing: [3, 0.67],
  vault: [1, 1.33], otel: [2, 1.33], temporal: [3, 1.33],
  kafka: [2, 2],
} as const;
const INFRA_EDGES = [
  { from: "docker", to: "postgres" },
  { from: "docker", to: "bucket" },
  { from: "docker", to: "vault" },
  { from: "docker", to: "kafka" },
] as const;
const MODULES = { partner: [0, 0], commission: [1, 0], epos: [2, 0], bin: [0, 2], card: [1, 2], payment: [2, 2] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 2,
    layout: { java: [0.7, 1], spring: [2.3, 1] },
    edges: [{ from: "java", to: "spring", label: "runs" }],
    accent: ["java", "spring"],
    badges: { java: "LTS", spring: "4.1" },
  },
  {
    cue: 3,
    layout: { spec: [0, 1], gradle: [1, 1], app: [2, 1], maven: [3, 1] },
    edges: [{ from: "spec", to: "gradle" }, { from: "gradle", to: "app" }, { from: "app", to: "maven" }],
    packets: [
      { from: "spec", to: "gradle", label: "generate", delay: 6, duration: 16 },
      { from: "gradle", to: "app", label: "style · test", delay: 24, duration: 16 },
      { from: "app", to: "maven", label: "publish", delay: 42, duration: 16 },
    ],
    accent: ["gradle"],
    badges: { gradle: "the pipeline" },
  },
  {
    cue: 4,
    layout: { app: [0, 1], partner: [1.2, 0], commission: [2.2, 0], epos: [3.2, 0], bin: [1.2, 2], card: [2.2, 2], payment: [3.2, 2] },
    edges: [{ from: "app", to: "partner" }, { from: "app", to: "bin" }],
    accent: ["partner", "commission", "epos", "bin", "card", "payment"],
    badges: { app: "one deploy" },
  },
  {
    cue: 5,
    layout: { ...MODULES, postgres: [3.2, 1] },
    edges: (Object.keys(MODULES) as (keyof typeof MODULES)[]).map((m) => ({ from: m, to: "postgres" as const })),
    badges: {
      partner: "partner_user", commission: "commission_user", epos: "epos_user",
      bin: "bin_user", card: "card_user", payment: "payment_user", postgres: "a schema each",
    },
  },
  {
    cue: 6,
    layout: { payment: [0.3, 1], epos: [2.6, 0.3], partner: [2.6, 1.7] },
    edges: [
      { from: "payment", to: "epos", label: "its contract" },
      { from: "payment", to: "partner", broken: true, label: "its code" },
    ],
    badges: { partner: "build fails" },
  },
  {
    cue: 7,
    layout: { controller: [0, 1], service: [1, 1], repository: [2, 1], entity: [3, 1] },
    edges: [{ from: "controller", to: "service" }, { from: "service", to: "repository" }, { from: "repository", to: "entity" }],
    packets: [{ from: "controller", to: "service", label: "request", delay: 8, duration: 16 }],
    badges: { controller: "layered" },
  },
  {
    cue: 8,
    layout: { spec: [0, 1], gradle: [1.5, 1], app: [3, 1] },
    edges: [{ from: "spec", to: "gradle", label: "first" }, { from: "gradle", to: "app", label: "implements" }],
    packets: [{ from: "gradle", to: "app", label: "interfaces · models", delay: 12, duration: 22 }],
    accent: ["spec"],
  },
  {
    cue: 9,
    layout: { spec: [0, 1], client: [2, 0.2], app: [2, 1.8] },
    edges: [{ from: "spec", to: "client" }, { from: "spec", to: "app" }, { from: "client", to: "app", label: "in-process · HTTP later" }],
    accent: ["client"],
    badges: { client: "same interface" },
  },
  {
    cue: 10,
    layout: { platform: [0.6, 1], app: [2.6, 1] },
    edges: [{ from: "platform", to: "app", label: "libraries" }],
    accent: ["platform"],
    badges: { platform: "own builds" },
  },
  {
    cue: 11,
    layout: { platform: [0, 1], gradle: [1, 1], maven: [2, 1], app: [3, 1] },
    edges: [{ from: "platform", to: "gradle" }, { from: "gradle", to: "maven", label: "publish" }, { from: "maven", to: "app", label: "import" }],
    packets: [
      { from: "gradle", to: "maven", label: "error 0.1.0", delay: 8, duration: 18 },
      { from: "maven", to: "app", label: "error 0.1.0", delay: 32, duration: 18 },
    ],
    accent: ["maven"],
  },
  {
    cue: 12,
    layout: { versions: [0, 1], maven: [1.5, 1], app: [3, 0.3], uzcardsvc: [3, 1.7] },
    edges: [{ from: "versions", to: "maven", label: "publish" }, { from: "maven", to: "app" }, { from: "maven", to: "uzcardsvc" }],
    badges: { app: "same versions", uzcardsvc: "same versions" },
  },
  {
    cue: 13,
    layout: { merchant: [0.5, 1], app: [2.5, 1] },
    edges: [{ from: "merchant", to: "app" }, { from: "app", to: "merchant", label: "problem + code" }],
    packets: [{ from: "app", to: "merchant", label: "404 PARTNER_NOT_FOUND", delay: 12, duration: 24 }],
    badges: { app: "en · ru · uz" },
  },
  {
    cue: 14,
    layout: { app: [0.3, 1], uzcardsvc: [2.3, 0.4], humosvc: [2.3, 1.6] },
    edges: [{ from: "app", to: "uzcardsvc" }, { from: "app", to: "humosvc" }],
    badges: { uzcardsvc: "own contract", humosvc: "own contract" },
  },
  {
    cue: 15,
    layout: { ...INFRA },
    edges: [...INFRA_EDGES],
    badges: {
      postgres: "→ 03", redis: "→ 04", mail: "→ 04", bucket: "→ 05", keycloak: "→ 07",
      processing: "→ 12", vault: "→ 14", otel: "→ 17", temporal: "→ 18", kafka: "→ 19",
    },
  },
  {
    cue: 16,
    layout: { ...INFRA },
    edges: [...INFRA_EDGES],
    packets: INFRA_EDGES.map((e, k) => ({ ...e, label: "up", delay: 6 + k * 6, duration: 16 })),
    accent: ["postgres", "redis", "mail", "bucket", "keycloak", "processing", "vault", "otel", "temporal", "kafka"],
    badges: { docker: "one command" },
  },
];
