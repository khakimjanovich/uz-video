import { siKeycloak, siPostgresql, siRedis } from "simple-icons";
import { NodeDef } from "../../components/diagram";

// Diagram boxes added by this module's lessons (ids prefixed "m45", generic names only).
export const M45_NODES = {
  // people
  m45Person: { label: "New sign-up", art: "buyer" },
  m45BankAdmin: { label: "Bank admin", art: "admin" },
  m45Owner: { label: "Owner", sublabel: "Own login", art: "buyer" },
  m45Accountant: { label: "Accountant", art: "wallet" },
  m45Bookkeeper: { label: "Accountant", art: "wallet" },
  m45Admin: { label: "Admin", sublabel: "Merchant's team", art: "admin" },
  m45Operator: { label: "Operator", art: "tray" },
  m45Observer: { label: "Observer", art: "checker" },
  m45Support: { label: "Support desk", art: "tray" },
  // systems
  m45Shared: { label: "One shared login", art: "request" },
  m45Authenticator: { label: "Authenticator app", sublabel: "On their phone" },
  m45Portal: { label: "Merchant portal", art: "store" },
  m45Bank: { label: "The bank", sublabel: "Sends the code", art: "bank" },
  m45Inbox: { label: "Inbox", sublabel: "That email address", art: "receipt" },
  m45Form: { label: "Sign-up form", art: "request" },
  m45CodeStore: { label: "Code store", sublabel: "Short-lived", logo: siRedis.path },
  m45Login: { label: "Login server", sublabel: "Keeps passwords", logo: siKeycloak.path },
  m45Db: { label: "ecom's database", logo: siPostgresql.path },
  m45History: { label: "History", sublabel: "Every move written down", art: "journal" },
  m45PayApi: { label: "Payments API", art: "receipt" },
  m45Client: { label: "API client", sublabel: "A login for a machine", art: "request" },
  // documents
  m45Papers: { label: "Your papers", art: "receipt" },
  m45Docs: { label: "Company documents", art: "receipt" },
  m45FileStore: { label: "File store", sublabel: "Reads the real type", art: "vault" },
  m45Fingerprint: { label: "Fingerprint", sublabel: "Catches a changed file" },
  m45Contract: { label: "Contract", sublabel: "Unique number", art: "receipt" },
  m45Refund: { label: "Give money back", art: "wallet" },
  // websites
  m45Site2: { label: "Another website", art: "salespoint" },
  m45Check: { label: "Site check", sublabel: "Result recorded", art: "checker" },
  m45Deal: { label: "The deal", sublabel: "Cards · limits", art: "receipt" },
  // fees
  m45Fee: { label: "The bank's fee", art: "fee" },
  m45ScopeSite: { label: "One website", art: "salespoint" },
  m45ScopeMerchant: { label: "One merchant", art: "store" },
  m45ScopeCard: { label: "One card", art: "receipt" },
  m45ScopeBank: { label: "Whole bank", art: "bank" },
  m45Amount: { label: "Amount", art: "receipt" },
  m45Bounds: { label: "Min … max", sublabel: "The fee stays inside" },
  m45Rule: { label: "Fee rule", art: "fee" },
  m45Rule2: { label: "Second rule", sublabel: "Same thing, same time", art: "fee" },
  m45Proposal: { label: "Proposed change", art: "request" },
  // terminals
  m45Taxi: { label: "Taxi", sublabel: "Licence plate", art: "transit" },
  m45Counter: { label: "Card machine", sublabel: "On the counter", art: "salespoint" },
  m45Tid2: { label: "Same pair again", art: "tray" },
} satisfies Record<string, NodeDef>;
