import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// Tier 1 (high road): one step per sentence, no naive/break. Source: partner onboarding service.
// Maker-checker activation is left for a Tier 2 deep dive.
export const acts: ActsMap = { hook: 0 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const REVIEW: Layout = { merchant: [1, 0], admin: [1, 2.3] };
const WITH_SITE: Layout = { ...REVIEW, salespoint: [2, 1.5] };

const DOCS: Edge = { from: "merchant", to: "admin", label: "documents" };
const SITE: Edge = { from: "merchant", to: "salespoint", label: "website" };

export const steps: DiagramStep<AcquiringNodeId>[] = [
  // 0 Hook: Part 1's last diagram — before the first payment, what does the bank check?
  {
    cue: 0,
    layout: { buyer: [0, 0], merchant: [2, 0], bank: [1, 2.3], network: [1, 4] },
    edges: [
      { from: "buyer", to: "merchant", label: "order" },
      { from: "buyer", to: "bank", label: "card" },
      { from: "bank", to: "merchant", label: "own account" },
      { from: "bank", to: "network" },
    ],
    badges: { merchant: "checked?" },
  },
  // 1 Store registers, confirms email (OTP), uploads company documents (KYB).
  {
    cue: 1,
    layout: REVIEW,
    edges: [DOCS],
    packets: [
      { from: "merchant", to: "admin", label: "email code", delay: 15 },
      { from: "merchant", to: "admin", label: "documents", delay: 60 },
    ],
    badges: { merchant: "registered" },
  },
  // 2 Bank reviews, signs a contract, records the settlement account.
  {
    cue: 2,
    layout: REVIEW,
    edges: [DOCS],
    packets: [{ from: "admin", to: "merchant", label: "contract", delay: 30 }],
    badges: { admin: "verified", merchant: "contract" },
  },
  // 3 Teaser: the commission deep dive unpacks how every fee is calculated.
  {
    cue: 3,
    layout: { ...REVIEW, dd2: [2, 1.15] },
    edges: [DOCS],
    accent: ["dd2"],
    badges: { admin: "verified", merchant: "contract" },
  },
  // 4 Each website becomes a sales point with its own API key; bank checks the site.
  {
    cue: 4,
    layout: WITH_SITE,
    edges: [{ from: "merchant", to: "admin" }, SITE], // drop "documents" label: it would sit beside "website"
    packets: [{ from: "admin", to: "salespoint", label: "site check", delay: 30 }],
    badges: { salespoint: "site ok" },
  },
  // 5 The bank switches the store on; it can start taking payments.
  {
    cue: 5,
    layout: { ...WITH_SITE, dd1: [0, 2.3] },
    edges: [SITE, { from: "admin", to: "merchant", label: "activate" }],
    packets: [{ from: "admin", to: "merchant", label: "active", delay: 20 }],
    accent: ["dd1"],
    badges: { merchant: "active" },
  },
];
