// The Series B build map (two units: ecom and the cards unit): one source of truth for the presentation diagram and the progress panel.
// Coordinates are in a 680×500 design space; BuildMap scales them to fit.
// Infrastructure boxes show the product's official monochrome logo (Simple Icons) above its name.
import { siApachekafka, siGrafana, siDocker, siKeycloak, siPostgresql, siPrometheus, siRedis, siTemporal, siVault } from "simple-icons";

export type BuildNodeId =
  | "merchant" | "buyer" | "admin"
  | "partner" | "commission" | "epos" | "payment" | "reconciliation"
  | "emailport" | "procport"
  | "postgres" | "redis" | "keycloak" | "vault" | "s3" | "temporal" | "kafka" | "observability"
  | "frame" | "card" | "adapters" | "cardsinfra"
  | "emailsvc" | "procsvc"
  | "kubernetes";

type Box = { label: string; sub?: string; x: number; y: number; w: number; h: number; logos?: string[] };

export const BUILD_NODES: Record<BuildNodeId, Box> = {
  merchant: { label: "Merchant server", x: 60, y: 16, w: 160, h: 40 },
  buyer: { label: "Buyer", x: 260, y: 16, w: 160, h: 40 },
  admin: { label: "Bank admin", x: 460, y: 16, w: 160, h: 40 },
  // ecom: five modules, 114px apart.
  partner: { label: "Partner", sub: "Merchants", x: 52, y: 108, w: 104, h: 52 },
  commission: { label: "Commission", sub: "Fees", x: 166, y: 108, w: 104, h: 52 },
  epos: { label: "e-POS", sub: "MID / TID", x: 280, y: 108, w: 104, h: 52 },
  payment: { label: "Payment", sub: "Debits", x: 394, y: 108, w: 104, h: 52 },
  reconciliation: { label: "Reconcile", sub: "Vs scheme", x: 508, y: 108, w: 104, h: 52 },
  emailport: { label: "Email + file store", x: 52, y: 172, w: 218, h: 36 },
  procport: { label: "Cards client", sub: "mTLS + token", x: 280, y: 172, w: 332, h: 36 },
  // ecom's own infrastructure; the arrows run down the gaps at x=194 and x=389.
  postgres: { label: "Postgres", x: 52, y: 220, w: 58, h: 52, logos: [siPostgresql.path] },
  redis: { label: "Redis", x: 114, y: 220, w: 58, h: 52, logos: [siRedis.path] },
  keycloak: { label: "Keycloak", x: 204, y: 220, w: 58, h: 52, logos: [siKeycloak.path] },
  vault: { label: "Vault", x: 266, y: 220, w: 58, h: 52, logos: [siVault.path] },
  s3: { label: "S3", x: 328, y: 220, w: 58, h: 52 },
  temporal: { label: "Temporal", x: 394, y: 220, w: 58, h: 52, logos: [siTemporal.path] },
  kafka: { label: "Kafka", x: 456, y: 220, w: 58, h: 52, logos: [siApachekafka.path] },
  observability: { label: "Observe", x: 518, y: 220, w: 58, h: 52, logos: [siPrometheus.path, siGrafana.path] },
  // The cards unit: the card zone, with its own infrastructure.
  frame: { label: "Card frame", sub: "Payer door", x: 246, y: 344, w: 90, h: 56 },
  card: { label: "Card vault", sub: "Tokens", x: 344, y: 344, w: 90, h: 56 },
  adapters: { label: "Adapters", sub: "Uzcard, Humo", x: 442, y: 344, w: 90, h: 56 },
  cardsinfra: { label: "Own infra", x: 540, y: 344, w: 90, h: 56, logos: [siPostgresql.path, siVault.path, siKeycloak.path] },
  // Outside both units.
  emailsvc: { label: "SMTP", sub: "Mailpit locally", x: 52, y: 440, w: 160, h: 48 },
  procsvc: { label: "Uzcard + Humo", sub: "SV-Gate · Payment Server", x: 400, y: 440, w: 230, h: 48 },
  // Not a box: the delivery frame around both units, each a Docker Compose install (drawn by BuildMap as a dashed frame).
  // The id stays "kubernetes" so earlier episodes' steps keep pointing at part 5.
  kubernetes: { label: "Compose × 2", x: 28, y: 66, w: 624, h: 354, logos: [siDocker.path] },
};

// Vertical arrows: [x, fromY, toY].
export const BUILD_ARROWS: [number, number, number][] = [
  [104, 160, 172],
  [332, 160, 172],
  [446, 160, 172],
  [560, 160, 172],
  [194, 208, 440],
  [389, 208, 344],
  [487, 400, 440],
];

// The unit boundaries: ecom (modular monolith) and the cards unit (the card zone).
export const UNIT_BOXES = [
  { x: 40, y: 78, w: 600, h: 204, label: "ecom · modular monolith" },
  { x: 236, y: 312, w: 404, h: 100, label: "cards unit" },
];

export const BUILD_PARTS: { n: number; title: string; episodes: string[]; nodes: BuildNodeId[] }[] = [
  { n: 0, title: "Foundations", episodes: ["The map", "Acquiring in 5 minutes", "Setup", "Domain → contract → database"], nodes: ["postgres", "redis", "emailsvc", "s3", "keycloak", "vault", "observability", "temporal", "kafka"] },
  { n: 1, title: "Merchants", episodes: ["Registration + email OTP", "Lifecycle + documents", "Four-eyes", "Keycloak clients", "Merchant users", "Sales points", "Platform libraries"], nodes: ["partner", "emailport", "admin"] },
  { n: 2, title: "Money rules", episodes: ["Commission", "e-POS terminals"], nodes: ["commission", "epos"] },
  { n: 3, title: "Cards", episodes: ["Uzcard + Humo adapters", "Card vault + BIN"], nodes: ["card", "adapters", "cardsinfra", "procport", "procsvc"] },
  { n: 4, title: "Payments", episodes: ["HMAC + idempotency", "Payment page", "The debit", "Observability", "When processing goes silent", "Outbox + Kafka", "Links", "Refunds", "Daily reports", "Hardening", "Disputes", "Reconciliation"], nodes: ["payment", "frame", "reconciliation", "merchant", "buyer"] },
  { n: 5, title: "Growing up", episodes: ["Delivery", "The cards unit"], nodes: ["kubernetes"] },
];

/** Every node built by the parts before `part`. */
export const builtBefore = (part: number): BuildNodeId[] => BUILD_PARTS.filter((p) => p.n < part).flatMap((p) => p.nodes);
