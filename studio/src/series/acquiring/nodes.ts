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
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
