import { NodeDef } from "../../components/diagram";

// Diagram boxes added by this module's lessons (ids prefixed "m01", generic names only).
export const M01_NODES = {
  // the two products
  m01Ecom: { label: "ecom", sublabel: "The shop's side", art: "workflow" },
  m01CardZone: { label: "Card zone", sublabel: "The locked room", art: "vault" },
  m01Token: { label: "Card token", sublabel: "A random name", art: "receipt" },
  m01OwnDb: { label: "Own database", art: "journal" },
  m01OwnKeys: { label: "Own keys", art: "vault" },
  m01OwnLogins: { label: "Own logins", art: "checker" },
  // the bank's card reader on the shop's counter
  m01Reader: { label: "Card reader", sublabel: "The bank's", art: "tray" },
  m01Page: { label: "Payment page", sublabel: "Shown by ecom", art: "salespoint" },
  m01Frame: { label: "Card frame", sublabel: "The bank's reader", art: "tray" },
  m01Contract: { label: "Contract", sublabel: "Written down once", art: "journal" },
  // settings
  m01Cook: { label: "A good cook", sublabel: "Never guesses", art: "reviewer" },
  m01Service: { label: "A service", sublabel: "About to start", art: "workflow" },
  m01Default: { label: "Default value", sublabel: "A quiet guess", art: "receipt" },
  m01Prod: { label: "Production", sublabel: "Real money", art: "bank" },
  m01Operator: { label: "Operator", sublabel: "This environment", art: "admin" },
  m01File: { label: "A settings file", art: "receipt" },
  // two proofs
  m01Visitor: { label: "Visitor", art: "buyer" },
  m01PassOffice: { label: "Pass office", sublabel: "Signs certificates", art: "checker" },
  m01Reception: { label: "Reception", sublabel: "Day passes", art: "admin" },
  m01Login: { label: "Login server", sublabel: "Access tokens", art: "workflow" },
  m01AccessToken: { label: "Access token", sublabel: "Roles inside", art: "request" },
} satisfies Record<string, NodeDef>;
