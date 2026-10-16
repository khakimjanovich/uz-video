// The series map: one source of truth for the route strip, deep-dive tags and parent links.
export const TIER1 = [
  { n: 1, short: "Acquirer" },
  { n: 2, short: "Onboarding" },
  { n: 3, short: "Payment" },
  { n: 4, short: "Card + debit" },
  { n: 5, short: "Status" },
  { n: 6, short: "Links" },
  { n: 7, short: "Settlement" },
] as const;

export const TIER2 = [
  { n: 1, title: "Four-eyes", parent: 2 },
  { n: 2, title: "Commission", parent: 2 },
  { n: 3, title: "HMAC + idempotency", parent: 3 },
  { n: 4, title: "Tokenization", parent: 4 },
  { n: 5, title: "Auth + capture", parent: 4 },
  { n: 6, title: "Timeouts", parent: 4 },
  { n: 7, title: "Declines", parent: 4 },
  { n: 8, title: "Reversal + refund", parent: 7 },
] as const;

export type SeriesPosition = { part: number } | { deepDive: number };

export const deepDive = (n: number) => TIER2.find((d) => d.n === n)!;
export const pad2 = (n: number) => String(n).padStart(2, "0");
