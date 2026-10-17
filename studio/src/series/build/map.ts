// The Series B build map: one source of truth for the presentation diagram and the progress panel.
// Coordinates are in a 680×500 design space; BuildMap scales them to fit.
export type BuildNodeId =
  | "merchant" | "buyer" | "admin"
  | "partner" | "commission" | "terminal" | "card" | "payment"
  | "emailport" | "procport"
  | "postgres" | "redis" | "keycloak" | "vault" | "temporal"
  | "emailsvc" | "procsvc";

type Box = { label: string; sub?: string; x: number; y: number; w: number; h: number };

export const BUILD_NODES: Record<BuildNodeId, Box> = {
  merchant: { label: "Merchant server", x: 60, y: 30, w: 160, h: 44 },
  buyer: { label: "Buyer", x: 260, y: 30, w: 160, h: 44 },
  admin: { label: "Bank admin", x: 460, y: 30, w: 160, h: 44 },
  partner: { label: "Partner", sub: "Merchants", x: 56, y: 140, w: 104, h: 56 },
  commission: { label: "Commission", sub: "Fees", x: 172, y: 140, w: 104, h: 56 },
  terminal: { label: "Terminal", sub: "MID / TID", x: 288, y: 140, w: 104, h: 56 },
  card: { label: "Card vault", sub: "Tokens", x: 404, y: 140, w: 104, h: 56 },
  payment: { label: "Payment", sub: "Debits", x: 520, y: 140, w: 104, h: 56 },
  emailport: { label: "Email port", x: 56, y: 230, w: 220, h: 44 },
  procport: { label: "Processing port", x: 404, y: 230, w: 220, h: 44 },
  postgres: { label: "Postgres", x: 56, y: 320, w: 104, h: 44 },
  redis: { label: "Redis", x: 172, y: 320, w: 104, h: 44 },
  keycloak: { label: "Keycloak", x: 288, y: 320, w: 104, h: 44 },
  vault: { label: "Vault", x: 404, y: 320, w: 104, h: 44 },
  temporal: { label: "Temporal", x: 520, y: 320, w: 104, h: 44 },
  emailsvc: { label: "Email service", sub: "OTP codes", x: 56, y: 420, w: 220, h: 56 },
  procsvc: { label: "Processing center", sub: "Uzcard, Humo, simulator", x: 404, y: 420, w: 220, h: 56 },
};

// Vertical arrows: [x, fromY, toY].
export const BUILD_ARROWS: [number, number, number][] = [
  [108, 196, 230],
  [456, 196, 230],
  [572, 196, 230],
  [166, 274, 420],
  [514, 274, 420],
];

// The app boundary (modular monolith).
export const APP_BOX = { x: 40, y: 100, w: 600, h: 190, label: "Acquiring app · modular monolith" };

export const BUILD_PARTS: { n: number; title: string; episodes: string[]; nodes: BuildNodeId[] }[] = [
  { n: 0, title: "Foundations", episodes: ["The map", "Acquiring in 5 minutes", "Setup", "Domain → contract → database"], nodes: ["postgres", "redis", "keycloak", "vault", "temporal"] },
  { n: 1, title: "Merchants", episodes: ["Registration + email OTP", "Lifecycle", "Four-eyes", "Keycloak clients", "Sales points", "Extract the starters"], nodes: ["partner", "emailport", "emailsvc", "admin"] },
  { n: 2, title: "Money rules", episodes: ["Commission", "Terminals"], nodes: ["commission", "terminal"] },
  { n: 3, title: "Cards", episodes: ["Fake processing center", "Card adapters", "BIN + card vault"], nodes: ["card", "procport", "procsvc"] },
  { n: 4, title: "Payments", episodes: ["HMAC + idempotency", "Hosted page", "The debit", "Silent processing", "Links", "Refunds", "Billing", "Hardening"], nodes: ["payment", "merchant", "buyer"] },
  { n: 5, title: "Growing up", episodes: ["Extract the card vault"], nodes: ["card"] },
];

/** Every node built by the parts before `part`. */
export const builtBefore = (part: number): BuildNodeId[] => BUILD_PARTS.filter((p) => p.n < part).flatMap((p) => p.nodes);
