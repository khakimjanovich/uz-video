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
  vault: { label: "Token Vault", sublabel: "PCI-DSS" },
  ofd: { label: "Soliq OFD", sublabel: "Fiscal receipt" },
  munis: { label: "MUNIS", sublabel: "9998" },
  uzqr: { label: "UzQR", sublabel: "In-store QR" },
  attacker: { label: "Attacker", sublabel: "Data breach", art: "attacker" },
  admin: { label: "Admin", sublabel: "Bank · maker", art: "admin" },
  checker: { label: "Admin 2", sublabel: "Checker", art: "admin" },
  salespoint: { label: "Sales point", sublabel: "API key", art: "salespoint" },
  // Ledger accounts (BRD §10, settlement — planned)
  transit: { label: "Clearing transit", sublabel: "10511", art: "transit" },
  terminalacc: { label: "Terminal account", sublabel: "23508", art: "tray" },
  feeacc: { label: "Bank fee", sublabel: "45265", art: "fee" },
  storeacc: { label: "Store account", sublabel: "20208", art: "wallet" },
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
