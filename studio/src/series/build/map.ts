// The Series B build map: one source of truth for the presentation diagram and the progress panel.
// Coordinates are in a 680×500 design space; BuildMap scales them to fit.
// Infrastructure boxes show the product's official monochrome logo (Simple Icons) above its name.
import { siApachekafka, siGrafana, siKeycloak, siKubernetes, siPostgresql, siPrometheus, siRedis, siTemporal, siVault } from "simple-icons";

export type BuildNodeId =
  | "merchant" | "buyer" | "admin"
  | "partner" | "commission" | "terminal" | "bin" | "card" | "payment"
  | "emailport" | "procport"
  | "postgres" | "redis" | "keycloak" | "vault" | "s3" | "temporal" | "kafka" | "observability"
  | "emailsvc" | "filesvc" | "procsvc"
  | "kubernetes";

type Box = { label: string; sub?: string; x: number; y: number; w: number; h: number; logos?: string[] };

export const BUILD_NODES: Record<BuildNodeId, Box> = {
  merchant: { label: "Merchant server", x: 60, y: 30, w: 160, h: 44 },
  buyer: { label: "Buyer", x: 260, y: 30, w: 160, h: 44 },
  admin: { label: "Bank admin", x: 460, y: 30, w: 160, h: 44 },
  // Six modules, 96px apart.
  partner: { label: "Partner", sub: "Merchants", x: 56, y: 140, w: 88, h: 56 },
  commission: { label: "Commission", sub: "Fees", x: 152, y: 140, w: 88, h: 56 },
  terminal: { label: "Terminal", sub: "MID / TID", x: 248, y: 140, w: 88, h: 56 },
  bin: { label: "BIN", sub: "Banks", x: 344, y: 140, w: 88, h: 56 },
  card: { label: "Card vault", sub: "Tokens", x: 440, y: 140, w: 88, h: 56 },
  payment: { label: "Payment", sub: "Debits", x: 536, y: 140, w: 88, h: 56 },
  emailport: { label: "Email + file clients", x: 56, y: 230, w: 220, h: 44 },
  procport: { label: "Adapter clients", x: 344, y: 230, w: 280, h: 44 },
  // One row of eight, 76px apart; the client arrows run down the gaps at x=113, x=189 and x=493.
  postgres: { label: "Postgres", x: 40, y: 310, w: 70, h: 64, logos: [siPostgresql.path] },
  redis: { label: "Redis", x: 116, y: 310, w: 70, h: 64, logos: [siRedis.path] },
  keycloak: { label: "Keycloak", x: 192, y: 310, w: 70, h: 64, logos: [siKeycloak.path] },
  vault: { label: "Vault", x: 268, y: 310, w: 70, h: 64, logos: [siVault.path] },
  s3: { label: "S3", sub: "SeaweedFS", x: 344, y: 310, w: 70, h: 64 },
  temporal: { label: "Temporal", x: 420, y: 310, w: 70, h: 64, logos: [siTemporal.path] },
  kafka: { label: "Kafka", x: 496, y: 310, w: 70, h: 64, logos: [siApachekafka.path] },
  observability: { label: "Observe", x: 572, y: 310, w: 70, h: 64, logos: [siPrometheus.path, siGrafana.path] },
  // Separate services, outside the app: each its own deployment, contract and client.
  emailsvc: { label: "SMTP", sub: "Mailpit locally", x: 56, y: 420, w: 104, h: 56 },
  filesvc: { label: "File service", sub: "→ S3", x: 172, y: 420, w: 104, h: 56 },
  procsvc: { label: "Uzcard + Humo adapters", sub: "→ SV-Gate · Payment Server", x: 404, y: 420, w: 220, h: 56 },
  // Not a box: the cluster boundary around the app and its infrastructure (drawn by BuildMap as a dashed frame).
  kubernetes: { label: "Kubernetes", x: 28, y: 90, w: 624, h: 306, logos: [siKubernetes.path] },
};

// Vertical arrows: [x, fromY, toY].
export const BUILD_ARROWS: [number, number, number][] = [
  [100, 196, 230],
  [388, 196, 230],
  [484, 196, 230],
  [580, 196, 230],
  [113, 274, 420],
  [189, 274, 420],
  [493, 274, 420],
];

// The app boundary (modular monolith).
export const APP_BOX = { x: 40, y: 100, w: 600, h: 190, label: "Acquiring app · modular monolith" };

export const BUILD_PARTS: { n: number; title: string; episodes: string[]; nodes: BuildNodeId[] }[] = [
  { n: 0, title: "Foundations", episodes: ["The map", "Acquiring in 5 minutes", "Setup", "Domain → contract → database"], nodes: ["postgres", "redis", "emailsvc", "s3", "keycloak", "vault", "observability", "temporal", "kafka"] },
  { n: 1, title: "Merchants", episodes: ["Registration + email OTP", "Lifecycle + documents", "Four-eyes", "Keycloak clients", "Sales points", "Platform libraries"], nodes: ["partner", "emailport", "filesvc", "admin"] },
  { n: 2, title: "Money rules", episodes: ["Commission", "Terminals"], nodes: ["commission", "terminal"] },
  { n: 3, title: "Cards", episodes: ["Uzcard + Humo adapters", "BIN + card vault"], nodes: ["bin", "card", "procport", "procsvc"] },
  { n: 4, title: "Payments", episodes: ["HMAC + idempotency", "Payment page", "The debit", "Observability", "When processing goes silent", "Outbox + Kafka", "Links", "Refunds", "Daily reports", "Hardening"], nodes: ["payment", "merchant", "buyer"] },
  { n: 5, title: "Growing up", episodes: ["Deploy to Kubernetes", "Extract the card vault"], nodes: ["kubernetes", "card"] },
];

/** Every node built by the parts before `part`. */
export const builtBefore = (part: number): BuildNodeId[] => BUILD_PARTS.filter((p) => p.n < part).flatMap((p) => p.nodes);
