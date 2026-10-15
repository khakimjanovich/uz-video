import { NodeDef } from "../../components/diagram";

// Every actor/service in the Acquiring series. Episodes reference nodes by id
// so names and icons stay identical from Ep 1 to Ep 7. Add new services here.
export const ACQUIRING_NODES = {
  buyer: { icon: "🧑", label: "Xaridor", sublabel: "Buyer" },
  merchant: { icon: "🏪", label: "Do'kon", sublabel: "Merchant" },
  gateway: { icon: "🛡️", label: "Gateway", sublabel: "heeyPay acquiring" },
  bank: { icon: "🏦", label: "Bank", sublabel: "Uzcard / Humo" },
  vault: { icon: "🔐", label: "Token Vault", sublabel: "PCI-DSS" },
  ofd: { icon: "🧾", label: "Soliq OFD", sublabel: "Fiskal chek" },
  munis: { icon: "🏛️", label: "MUNIS", sublabel: "9998" },
  uzqr: { icon: "📱", label: "UzQR", sublabel: "In-store QR" },
} satisfies Record<string, NodeDef>;

export type AcquiringNodeId = keyof typeof ACQUIRING_NODES;
