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
  // Lesson 24: the wax seal
  m6Letter: { label: "Sealed request", sublabel: "Seal · date · serial", art: "request" },
  m6Key: { label: "Signing key", sublabel: "Bank and merchant only", art: "vault" },
  m6Spent: { label: "Spent serials", sublabel: "Each used once", art: "journal" },
  m6Log: { label: "Log file", sublabel: "A token inside", art: "journal" },
  m6Wax: { label: "Wax-sealed letter", sublabel: "Seal · date · serial", art: "receipt" },
  m6KeySafe: { label: "Key safe", sublabel: "The bank writes", art: "vault" },
  // Lesson 24b: the lift button
  m6Page2: { label: "Second page", sublabel: "Same payment", art: "salespoint" },
  m6Lift: { label: "Lift button", sublabel: "Press it ten times" },
  m6IdemKey: { label: "Idempotency key", sublabel: "The merchant's name for it", art: "receipt" },
  m6Answer: { label: "First answer", sublabel: "Kept with the key", art: "journal" },
  // Lesson 25: the hotel key card
  m6HotelKey: { label: "Hotel key card", sublabel: "Until checkout", art: "receipt" },
  m6Room: { label: "One room" },
  m6Link: { label: "Link", sublabel: "With a one-time key", art: "request" },
  m6Frame: { label: "Card frame", sublabel: "From the card zone", art: "request" },
  m6Lock: { label: "One lock", sublabel: "One step at a time", art: "vault" },
  // Lesson 26: the cash desk
  m6Cashier: { label: "Cashier", sublabel: "Holds the slip", art: "admin" },
  m6Drawer: { label: "Drawer", sublabel: "Opened last", art: "wallet" },
  m6Terminal: { label: "Live terminal", art: "tray" },
  m6Fee: { label: "Fee", art: "fee" },
  // Lesson 27: the silent parcel
  m6Parcel: { label: "Parcel", sublabel: "Already left", art: "transit" },
  m6Parcel2: { label: "Second parcel", art: "transit" },
  m6Tracking: { label: "Tracking", sublabel: "Says nothing", art: "journal" },
  m6PostOffice: { label: "Post office", sublabel: "Ask in person", art: "bank" },
  m6Unknown: { label: "Unknown charge", sublabel: "Money may have moved", art: "receipt" },
  m6Workflow: { label: "Durable workflow", sublabel: "Survives restarts", art: "workflow" },
  // Lesson 28: the outbox tray
  m6App: { label: "App", art: "workflow" },
  m6Saved: { label: "Saved state", art: "journal" },
  m6Clerk: { label: "Clerk", sublabel: "Closes the file", art: "admin" },
  m6Outbox: { label: "Outbox tray", sublabel: "News waits here", art: "tray" },
  m6Postman: { label: "Postman", art: "transit" },
  m6Relay: { label: "Relay", sublabel: "The postman", art: "transit" },
  m6Final: { label: "Payment", sublabel: "Final state", art: "receipt" },
  m6Stream: { label: "Message stream", sublabel: "The bank's", art: "transit" },
  m6Relay2: { label: "Another copy", sublabel: "Of the app", art: "transit" },
  // Lesson 28b: the registered letter
  m6Registered: { label: "Registered letter", sublabel: "Sealed", art: "request" },
  m6Street: { label: "Real street address", art: "store" },
  m6Hook: { label: "Webhook address", sublabel: "The website's", art: "salespoint" },
  m6Inside: { label: "Bank's own network", sublabel: "Never a target", art: "bank" },
  // Lesson 29: the bill with a pay button
  m6Seller: { label: "Seller", sublabel: "No website", art: "store" },
  m6Messenger: { label: "Messenger", sublabel: "Orders come here", art: "request" },
  m6Bill: { label: "Payment link", sublabel: "A bill with a pay button", art: "receipt" },
  m6Portal: { label: "Portal", sublabel: "Admin or operator", art: "admin" },
  m6Payment: { label: "Payment", sublabel: "An ordinary one", art: "receipt" },
  m6PaperBill: { label: "Paper bill", sublabel: "A pay-here button", art: "receipt" },
  // Lesson 30: crossing out, or handing back
  m6Reversal: { label: "Reversal", sublabel: "Cross the line out" },
  m6Refund: { label: "Refund", sublabel: "Hand the money back" },
  m6Clock: { label: "Bank's time zone", sublabel: "The day decides" },
  m6Paid: { label: "Paid payment", art: "receipt" },
  m6OldCard: { label: "Old card", sublabel: "No longer exists", art: "receipt" },
  m6Cap: { label: "Refund cap", sublabel: "The bank's chosen most", art: "fee" },
  m6Window: { label: "Refund window", sublabel: "Working days", art: "journal" },
  m6Request: { label: "Refund by application", sublabel: "Beyond cap or window", art: "request" },
} satisfies Record<string, NodeDef>;
