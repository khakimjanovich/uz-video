import { NodeDef } from "../../components/diagram";

// Every actor/service in the Acquiring series. Episodes reference nodes by id
// so names and icons stay identical from Ep 1 to Ep 7. Add new services here.
export const ACQUIRING_NODES = {
  buyer: { label: "Buyer" },
  merchant: { label: "Store", sublabel: "Merchant" },
  gateway: { label: "Gateway", sublabel: "heeyPay acquiring" },
  bank: { label: "Bank", sublabel: "Acquirer" },
  network: { label: "Processing center", sublabel: "Uzcard·Humo·Visa·MC" },
  payorg: { label: "Payme / Click", sublabel: "Payment org" },
  vault: { label: "Token Vault", sublabel: "PCI-DSS" },
  ofd: { label: "Soliq OFD", sublabel: "Fiscal receipt" },
  munis: { label: "MUNIS", sublabel: "9998" },
  uzqr: { label: "UzQR", sublabel: "In-store QR" },
  attacker: { label: "Attacker", sublabel: "Data breach" },
  admin: { label: "Admin", sublabel: "Bank · maker" },
  checker: { label: "Admin 2", sublabel: "Checker" },
  salespoint: { label: "Sales point", sublabel: "API key" },
  // Ledger accounts (BRD §10, settlement — planned)
  transit: { label: "Clearing transit", sublabel: "10511" },
  terminalacc: { label: "Terminal account", sublabel: "23508" },
  feeacc: { label: "Bank fee", sublabel: "45265" },
  storeacc: { label: "Store account", sublabel: "20208" },
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
