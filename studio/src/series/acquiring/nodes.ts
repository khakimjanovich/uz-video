import { NodeDef } from "../../components/diagram";

// Every actor/service in the Acquiring series. Episodes reference nodes by id
// so names and icons stay identical from Ep 1 to Ep 7. Add new services here.
export const ACQUIRING_NODES = {
  buyer: { label: "Buyer", art: "buyer" },
  merchant: { label: "Store", sublabel: "Merchant", art: "store" },
  gateway: { label: "Gateway", sublabel: "heeyPay acquiring" },
  bank: { label: "Bank", sublabel: "Acquirer", art: "bank" },
  network: { label: "Processing center", sublabel: "Uzcard·Humo·Visa·MC", art: "processing" },
  payorg: { label: "Payme / Click", sublabel: "Payment org", art: "buyer" },
  vault: { label: "Token Vault", sublabel: "PCI DSS", art: "vault" },
  ofd: { label: "Soliq OFD", sublabel: "Fiscal receipt" },
  munis: { label: "MUNIS", sublabel: "9998" },
  uzqr: { label: "UzQR", sublabel: "In-store QR" },
  attacker: { label: "Attacker", sublabel: "Data breach", art: "attacker" },
  admin: { label: "Admin", sublabel: "Bank · maker", art: "admin" },
  checker: { label: "Admin 2", sublabel: "Checker", art: "checker" },
  salespoint: { label: "Sales point", sublabel: "API key", art: "salespoint" },
  request: { label: "Request", sublabel: "Pending", art: "request" },
  feerule: { label: "Fee rule", sublabel: "Commission", art: "fee" },
  store2: { label: "Store B", art: "store" },
  store3: { label: "Store C", art: "store" },
  payment: { label: "Payment", sublabel: "Record", art: "receipt" },
  journal: { label: "Operation journal", sublabel: "Audit trail", art: "journal" },
  workflow: { label: "Workflow", sublabel: "Temporal", art: "workflow" },
  reviewer: { label: "Manual review", sublabel: "Queue", art: "reviewer" },
  // Series route (Episode 1 roadmap): one stop per later Tier 1 part.
  stage2: { label: "Onboarding", sublabel: "Part 2", art: "admin" },
  stage3: { label: "Create payment", sublabel: "Part 3", art: "salespoint" },
  stage4: { label: "Card + debit", sublabel: "Part 4", art: "vault" },
  stage5: { label: "Status", sublabel: "Part 5", art: "receipt" },
  stage6: { label: "Payment links", sublabel: "Part 6", art: "link" },
  stage7: { label: "Settlement", sublabel: "Part 7", art: "wallet" },
  // Deep-dive icons: first met in Tier 1 at the teaser, then the clue that opens each deep dive.
  dd1: { label: "Four-eyes", sublabel: "Deep dive 01", art: "foureyes" },
  dd2: { label: "Commission", sublabel: "Deep dive 02", art: "commission" },
  dd3: { label: "HMAC + idempotency", sublabel: "Deep dive 03", art: "seal" },
  dd4: { label: "Tokenization", sublabel: "Deep dive 04", art: "token" },
  dd5: { label: "Auth + capture", sublabel: "Deep dive 05", art: "authcap" },
  dd6: { label: "Timeouts", sublabel: "Deep dive 06", art: "hourglass" },
  dd7: { label: "Declines", sublabel: "Deep dive 07", art: "declined" },
  dd8: { label: "Reversal + refund", sublabel: "Deep dive 08", art: "uturn" },
  // Ledger accounts (BRD §10, settlement — planned)
  transit: { label: "Clearing transit", sublabel: "10511", art: "transit" },
  terminalacc: { label: "Terminal account", sublabel: "23508", art: "tray" },
  feeacc: { label: "Bank fee", sublabel: "45265", art: "fee" },
  storeacc: { label: "Store account", sublabel: "20208", art: "wallet" },
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
