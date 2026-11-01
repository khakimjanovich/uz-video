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
  // what you may keep about a card
  m01Engineer: { label: "Developer", sublabel: "Connects the shop", art: "admin" },
  m01Token2: { label: "Card token", sublabel: "Another random name", art: "receipt" },
  // settings: three kinds of value, the card zone's own settings, the startup message
  m01KindSystem: { label: "The system's own" },
  m01KindSecret: { label: "Secrets", sublabel: "Made inside Vault" },
  m01KindBank: { label: "The bank's own", sublabel: "Typed once" },
  m01Callers: { label: "Callers and roles" },
  m01Websites: { label: "Card form websites" },
  m01FraudLimits: { label: "Fraud limits" },
  m01CardKeep: { label: "Unused cards kept" },
  m01KeyChange: { label: "Key changes" },
  m01Cleanup: { label: "Nightly clean-up" },
  m01Message: { label: "Startup message", sublabel: "Names what is missing", art: "receipt" },
  // two proofs
  m01Claim: { label: "A request", sublabel: "Says: I am ecom", art: "request" },
  m01HomeBadge: { label: "Home-made badge", art: "receipt" },
  m01Lift: { label: "Lift", sublabel: "Only your floors", art: "transit" },
  m01Caller: { label: "A caller", art: "workflow" },
  m01OtherLogin: { label: "Another login server", art: "workflow" },
  m01RoleBind: { label: "Bind a card" },
  m01RoleRead: { label: "Read a card" },
  m01RoleCharge: { label: "Charge a card" },
  m01RoleAdmin: { label: "Admin operations" },
  m01NoConn: { label: "No connection" },
  m01Unauth: { label: "Unauthorized" },
  m01Forbidden: { label: "Forbidden" },
} satisfies Record<string, NodeDef>;
