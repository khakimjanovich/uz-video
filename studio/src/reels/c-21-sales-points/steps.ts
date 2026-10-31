import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 21: stalls at a licensed market. Every stall inspected (cue 1), a website starts as a draft (2),
// return addresses (3), the site check (4), the deal (5), three conditions to switch on (6), one question (7).
const SITES = { shop: [0, 1], salespoint: [2, 0.3], m45Site2: [2, 1.8] } as const;
const SITES_EDGES = [{ from: "shop", to: "salespoint" }, { from: "shop", to: "m45Site2" }] as const;
const ONE = { shop: [0, 1], salespoint: [1.5, 1] } as const;
const ON = { shop: [0, 0], m45Check: [0, 1], m45Deal: [0, 2], salespoint: [2.5, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "approved", salespoint: "take money?", m45Site2: "take money?" } },
  {
    cue: 1,
    layout: { m45Market: [0, 1], m45Stall1: [2.2, 0.3], m45Stall2: [2.2, 1.8] },
    edges: [{ from: "m45Market", to: "m45Stall1" }, { from: "m45Market", to: "m45Stall2" }],
    badges: { m45Market: "licensed", m45Stall1: "inspected", m45Stall2: "inspected" },
  },
  { cue: 2, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft · no money" } },
  {
    cue: 3,
    layout: { buyer: [0, 1], salespoint: [1.5, 0.3], fakesite: [3, 1.8] },
    edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "fakesite", broken: true }],
    packets: [{ from: "salespoint", to: "fakesite", label: "buyer", stopAt: 0.5 }],
    crossed: ["fakesite"],
    badges: { salespoint: "secure · own site" },
  },
  {
    cue: 4,
    layout: { m45BankAdmin: [0, 1], salespoint: [1.5, 1], m45Check: [3, 1] },
    edges: [{ from: "m45BankAdmin", to: "salespoint", label: "checks" }, { from: "salespoint", to: "m45Check" }],
    packets: [{ from: "salespoint", to: "m45Check", label: "passed", delay: 40 }],
  },
  {
    cue: 5,
    layout: { salespoint: [1.5, 1], m45Deal: [3, 1] },
    edges: [{ from: "m45Deal", to: "salespoint" }],
    badges: { m45Deal: "cards · per day" },
  },
  {
    cue: 6,
    layout: ON,
    edges: [{ from: "shop", to: "salespoint" }, { from: "m45Check", to: "salespoint" }, { from: "m45Deal", to: "salespoint" }],
    accent: ["salespoint"],
    badges: { shop: "active", m45Check: "passed", m45Deal: "1+ card", salespoint: "switched on" },
  },
];

export const map: BuildMapStep[] = [
  { cue: 7, part: 4, current: ["partner", "commission", "epos", "payment"], units: { ecom: "may it pay now?" } },
  { cue: 8, part: 4, current: ["commission"], units: { ecom: "next: the fee" } },
];
