import { NodeDef } from "../../components/diagram";

// Every actor/service in the Acquiring series. Episodes reference nodes by id
// so names and icons stay identical from Ep 1 to Ep 7. Add new services here.
export const ACQUIRING_NODES = {
  buyer: { icon: "🧑", label: "Buyer" },
  merchant: { icon: "🏪", label: "Store", sublabel: "Merchant" },
  gateway: { icon: "🛡️", label: "Gateway", sublabel: "heeyPay acquiring" },
  bank: { icon: "🏦", label: "Bank", sublabel: "Acquirer" },
  network: { icon: "🔀", label: "Uzcard / Humo", sublabel: "Card network" },
  payorg: { icon: "📲", label: "Payme / Click", sublabel: "Payment org" },
  vault: { icon: "🔐", label: "Token Vault", sublabel: "PCI-DSS" },
  ofd: { icon: "🧾", label: "Soliq OFD", sublabel: "Fiscal receipt" },
  munis: { icon: "🏛️", label: "MUNIS", sublabel: "9998" },
  uzqr: { icon: "📱", label: "UzQR", sublabel: "In-store QR" },
  attacker: { icon: "🕵️", label: "Attacker", sublabel: "Data breach" },
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
