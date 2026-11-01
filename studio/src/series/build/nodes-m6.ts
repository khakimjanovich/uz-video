import { NodeDef } from "../../components/diagram";

// Diagram boxes added by this module's lessons (ids prefixed "m6", generic names only).
export const M6_NODES = {
  // shared across the payment lessons
  m6Ecom: { label: "ecom", sublabel: "The bank's payments", art: "bank" },
  m6Zone: { label: "Card zone", sublabel: "The locked room", art: "vault" },
  m6Page: { label: "Payment page", sublabel: "The bank's own", art: "salespoint" },
  m6Fingerprint: { label: "Fingerprint", sublabel: "Never the key itself", art: "journal" },
  m6Claim: { label: "One claim", sublabel: "One caller wins", art: "checker" },
  m6Logbook: { label: "Logbook", sublabel: "Written first", art: "journal" },
  // Lesson 24: signed requests
  m6Letter: { label: "Sealed request", sublabel: "Seal · time · nonce", art: "request" },
  m6Key: { label: "Signing key", sublabel: "Bank and merchant only", art: "vault" },
  m6Spent: { label: "Spent nonces", sublabel: "Each used once", art: "journal" },
  m6Log: { label: "Log file", sublabel: "A token inside", art: "journal" },
  m6KeySafe: { label: "Key safe", sublabel: "The bank writes", art: "vault" },
  // Lesson 24b: one payment however often
  m6Page2: { label: "Second page", sublabel: "Same payment", art: "salespoint" },
  m6IdemKey: { label: "Idempotency key", sublabel: "The merchant's name for it", art: "receipt" },
  m6Answer: { label: "First answer", sublabel: "Kept with the key", art: "journal" },
  // Lesson 25: the payment page
  m6Link: { label: "Link", sublabel: "With a one-time key", art: "request" },
  m6Frame: { label: "Card frame", sublabel: "From the card zone", art: "request" },
  m6Lock: { label: "One lock", sublabel: "One step at a time", art: "vault" },
  // Lesson 26: the charge
  m6Terminal: { label: "Live terminal", art: "tray" },
  m6Fee: { label: "Fee", art: "fee" },
  // Lesson 27: the silent charge
  m6Unknown: { label: "Unknown charge", sublabel: "Money may have moved", art: "receipt" },
  m6Workflow: { label: "Durable workflow", sublabel: "Survives restarts", art: "workflow" },
  // Lesson 28: the outbox
  m6App: { label: "App", art: "workflow" },
  m6Saved: { label: "Saved state", art: "journal" },
  m6Outbox: { label: "Outbox tray", sublabel: "News waits here", art: "tray" },
  m6Relay: { label: "Relay", sublabel: "Passes the news on", art: "transit" },
  m6Final: { label: "Payment", sublabel: "Final state", art: "receipt" },
  m6Stream: { label: "Message stream", sublabel: "The bank's", art: "request" },
  m6Relay2: { label: "Another copy", sublabel: "Of the app", art: "transit" },
  // Lesson 28b: webhooks
  m6Hook: { label: "Webhook address", sublabel: "The website's", art: "salespoint" },
  m6Inside: { label: "Bank's own network", sublabel: "Never a target", art: "bank" },
  // Lesson 29: payment links
  m6Seller: { label: "Seller", sublabel: "No website", art: "store" },
  m6Messenger: { label: "Messenger", sublabel: "Orders come here", art: "request" },
  m6Bill: { label: "Payment link", sublabel: "Sent in a chat", art: "receipt" },
  m6Portal: { label: "Portal", sublabel: "Admin or operator", art: "admin" },
  m6Payment: { label: "Payment", sublabel: "An ordinary one", art: "receipt" },
  // Lesson 30: refunds
  m6Reversal: { label: "Reversal", sublabel: "Same day, costs nothing" },
  m6Refund: { label: "Refund", sublabel: "After the day closes" },
  m6Clock: { label: "Bank's time zone", sublabel: "The day decides" },
  m6Paid: { label: "Paid payment", art: "receipt" },
  m6OldCard: { label: "Old card", sublabel: "No longer exists", art: "receipt" },
  m6Cap: { label: "Refund cap", sublabel: "The bank's chosen most", art: "fee" },
  m6Window: { label: "Refund window", sublabel: "Working days", art: "journal" },
  m6Request: { label: "Refund by application", sublabel: "Beyond cap or window", art: "request" },
} satisfies Record<string, NodeDef>;
