import { DiagramEdge, DiagramStep, Slot } from "../../components";
import { ActsMap } from "../../hooks";
import { AcquiringNodeId } from "../../series/acquiring/nodes";

// One step per script sentence. Source: partner onboarding service (KYB, contract, sales point, site check, maker-checker).
export const acts: ActsMap = { hook: 0, v1: 1, break: 4, v2: 5, handoff: 6 };

type Layout = Partial<Record<AcquiringNodeId, Slot>>;
type Edge = DiagramEdge<AcquiringNodeId>;

const REVIEW: Layout = { merchant: [1, 0], admin: [1, 2.3] };
const WITH_SITE: Layout = { ...REVIEW, salespoint: [2, 1.5] };
const TWO_ADMINS: Layout = { merchant: [1, 0], salespoint: [2, 1.5], admin: [0, 3.6], checker: [2, 3.6] };

const DOCS: Edge = { from: "merchant", to: "admin", label: "documents" };
const SITE: Edge = { from: "merchant", to: "salespoint", label: "website" };
const MAKER_CHECKER: Edge[] = [
  { from: "admin", to: "checker", label: "request" },
  { from: "checker", to: "merchant", label: "approve" },
];

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
  // 3 Each website becomes a sales point with its own API key; bank checks the site.
  {
    cue: 3,
    layout: WITH_SITE,
    edges: [{ from: "merchant", to: "admin" }, SITE], // drop "documents" label: it would sit beside "website"
    packets: [{ from: "admin", to: "salespoint", label: "site check", delay: 30 }],
    badges: { salespoint: "site ok" },
  },
  // 4 Break: one admin switching a store on alone — one mistake is enough.
  {
    cue: 4,
    layout: WITH_SITE,
    edges: [SITE, { from: "admin", to: "merchant", label: "activate" }],
    packets: [{ from: "admin", to: "merchant", label: "active", delay: 25 }],
    danger: ["admin"],
    badges: { admin: "alone" },
  },
  // 5 Fix: a second admin approves (maker-checker); no self-approval.
  {
    cue: 5,
    layout: TWO_ADMINS,
    edges: [SITE, ...MAKER_CHECKER],
    packets: [
      { from: "admin", to: "checker", label: "request", delay: 20 },
      { from: "checker", to: "merchant", label: "active", delay: 60 },
    ],
    accent: ["checker"],
    badges: { merchant: "active" },
  },
  // 6 Handoff: the store has an API key — how does its server create a payment safely? -> Part 3 (S2S)
  {
    cue: 6,
    layout: TWO_ADMINS,
    edges: [SITE, ...MAKER_CHECKER],
    accent: ["salespoint"],
    badges: { merchant: "create payment?" },
  },
];
