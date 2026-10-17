import { siApachekafka, siGrafana, siKeycloak, siKubernetes, siOpenapiinitiative, siPostgresql, siPrometheus, siRedis, siTemporal, siVault, siDocker, siGradle, siSpringboot, siOpenjdk } from "simple-icons";
import { NodeDef } from "../../components/diagram";

// Boxes for the Series B story diagrams. Our own actors and modules use ink drawings;
// third-party tools use their official monochrome logo (Simple Icons).
export const BUILD_CATALOG = {
  // people and outside systems
  test: { label: "Test", art: "checker" },
  merchant: { label: "Merchant server", art: "store" },
  shop: { label: "Shop", sublabel: "Merchant", art: "store" },
  buyer: { label: "Buyer", art: "buyer" },
  admin: { label: "Admin", sublabel: "Maker", art: "admin" },
  checker: { label: "Admin 2", sublabel: "Checker", art: "checker" },
  attacker: { label: "Attacker", art: "attacker" },
  issuer: { label: "Issuer bank", sublabel: "Buyer's bank", art: "bank" },
  acquirer: { label: "Acquirer bank", sublabel: "Our bank", art: "bank" },
  processing: { label: "Processing center", sublabel: "Uzcard · Humo", art: "processing" },
  mail: { label: "SMTP", sublabel: "Mailpit locally", art: "request" },
  tid: { label: "Terminal", sublabel: "MID · TID", art: "tray" },
  // our modules
  app: { label: "Acquiring app", sublabel: "Modular monolith", art: "salespoint" },
  partner: { label: "Partner module", sublabel: "Merchant registry", art: "journal" },
  commission: { label: "Commission module", art: "fee" },
  terminal: { label: "Terminal module", sublabel: "MID / TID", art: "tray" },
  card: { label: "Card vault", sublabel: "Tokens", art: "vault" },
  payment: { label: "Payment module", art: "receipt" },
  salespoint: { label: "Sales point", sublabel: "Website", art: "salespoint" },
  fakesite: { label: "Fake site", art: "salespoint" },
  request: { label: "Request", sublabel: "Pending", art: "request" },
  journal: { label: "Operation journal", art: "journal" },
  review: { label: "Manual review", art: "reviewer" },
  record: { label: "Payment", sublabel: "Record", art: "receipt" },
  outbox: { label: "Outbox table", art: "request" },
  webhook: { label: "Merchant webhook", art: "store" },
  wallet: { label: "Store account", art: "wallet" },
  feeacc: { label: "Bank fee", art: "fee" },
  spec: { label: "OpenAPI spec", logo: siOpenapiinitiative.path },
  // lifecycle states (label-only boxes)
  stPending: { label: "Pending" },
  stVerified: { label: "Verified" },
  stContract: { label: "Waiting contract" },
  stApproved: { label: "Approved" },
  stActive: { label: "Active" },
  stSuspended: { label: "Suspended" },
  stTerminated: { label: "Terminated" },
  sweep: { label: "Sweep job", sublabel: "Scheduled", art: "workflow" },
  // tools
  postgres: { label: "Postgres", logo: siPostgresql.path },
  redis: { label: "Redis", logo: siRedis.path },
  keycloak: { label: "Keycloak", logo: siKeycloak.path },
  vault: { label: "Vault", logo: siVault.path },
  temporal: { label: "Temporal", logo: siTemporal.path },
  kafka: { label: "Kafka", logo: siApachekafka.path },
  prometheus: { label: "Prometheus", logo: siPrometheus.path },
  grafana: { label: "Grafana", logo: siGrafana.path },
  kubernetes: { label: "Kubernetes", logo: siKubernetes.path },
  docker: { label: "Docker Compose", logo: siDocker.path },
  gradle: { label: "Gradle", logo: siGradle.path },
  spring: { label: "Spring Boot", logo: siSpringboot.path },
  java: { label: "Java 25", logo: siOpenjdk.path },
} satisfies Record<string, NodeDef>;

export type BuildId = keyof typeof BUILD_CATALOG;
