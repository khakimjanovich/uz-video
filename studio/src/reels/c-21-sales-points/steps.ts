import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 21: stalls at a licensed market. A copycat website (0–5), every stall inspected (6–7), how it works (8–24),
// the product (25–44), what it protects (45–50).
const SITES = { shop: [0, 1], salespoint: [2, 0.3], m45Site2: [2, 1.8] } as const;
const SITES_EDGES = [{ from: "shop", to: "salespoint" }, { from: "shop", to: "m45Site2" }] as const;
const MARKET = { m45Market: [0, 1], m45Stall1: [2.2, 0.3], m45Stall2: [2.2, 1.8] } as const;
const MARKET_EDGES = [{ from: "m45Market", to: "m45Stall1" }, { from: "m45Market", to: "m45Stall2" }] as const;
const ONE = { shop: [0, 1], salespoint: [1.5, 1] } as const;
const RETURN = { buyer: [0, 1], salespoint: [1.5, 0.3], fakesite: [3, 1.8] } as const;
const RETURN_GOOD = { buyer: [0, 1], salespoint: [1.5, 0.3], shop: [3, 0.3], fakesite: [3, 1.8] } as const;
const CHECK = { m45BankAdmin: [0, 1], salespoint: [1.5, 1], m45Check: [3, 1] } as const;
const CHECK_EDGES = [{ from: "m45BankAdmin", to: "salespoint", label: "checks" }, { from: "salespoint", to: "m45Check" }] as const;
const DEAL = { salespoint: [1.5, 1], m45Deal: [3, 1] } as const;
const ON = { shop: [0, 0], m45Check: [0, 1], m45Deal: [0, 2], salespoint: [2.5, 1] } as const;
const ON_EDGES = [{ from: "shop", to: "salespoint" }, { from: "m45Check", to: "salespoint" }, { from: "m45Deal", to: "salespoint" }] as const;
const CARD = { salespoint: [0, 1], epos: [2, 0.3], commission: [2, 1.8] } as const;
const ASK = { payment: [0, 1], salespoint: [2, 0.3], shop: [2, 1.8] } as const;
const ASK_EDGES = [{ from: "payment", to: "salespoint", label: "may it?" }, { from: "payment", to: "shop" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "approved", salespoint: "take money?", m45Site2: "take money?" } },
  { cue: 4, layout: SITES, edges: [...SITES_EDGES], danger: ["m45Site2"], badges: { m45Site2: "a brand's copy" } },
  { cue: 5, layout: SITES, edges: [...SITES_EDGES], packets: [{ from: "shop", to: "m45Site2", label: "typed in" }], danger: ["m45Site2"], badges: { shop: "checks for nothing" } },
  { cue: 6, layout: MARKET, edges: [...MARKET_EDGES], badges: { m45Market: "licensed", m45Stall1: "inspected", m45Stall2: "inspected" } },
  { cue: 7, layout: SITES, edges: [...SITES_EDGES], badges: { salespoint: "inspected", m45Site2: "inspected" } },
  { cue: 9, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], accent: ["salespoint"], badges: { salespoint: "sales point" } },
  { cue: 10, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft · no money" } },
  { cue: 11, layout: RETURN_GOOD, edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "shop" }], packets: [{ from: "salespoint", to: "shop", label: "back to shop" }] },
  { cue: 12, layout: RETURN_GOOD, edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "shop", label: "return address" }], accent: ["shop"] },
  { cue: 13, layout: RETURN_GOOD, edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "shop" }], badges: { shop: "secure · own site" } },
  {
    cue: 14,
    layout: RETURN,
    edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "fakesite", broken: true }],
    packets: [{ from: "salespoint", to: "fakesite", label: "buyer", stopAt: 0.5 }],
    crossed: ["fakesite"],
    badges: { fakesite: "fake thank-you page" },
  },
  { cue: 15, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft only" } },
  { cue: 16, layout: CHECK, edges: [...CHECK_EDGES], packets: [{ from: "salespoint", to: "m45Check", label: "passed", delay: 40 }], accent: ["m45Check"] },
  { cue: 17, layout: CHECK, edges: [...CHECK_EDGES], danger: ["m45Check"], badges: { m45Check: "failed: what's wrong" } },
  { cue: 18, layout: DEAL, edges: [{ from: "m45Deal", to: "salespoint" }], accent: ["m45Deal"] },
  { cue: 19, layout: DEAL, edges: [{ from: "m45Deal", to: "salespoint" }], badges: { m45Deal: "which cards" } },
  { cue: 20, layout: DEAL, edges: [{ from: "m45Deal", to: "salespoint" }], badges: { m45Deal: "per payment · per day" } },
  { cue: 21, layout: ON, edges: [...ON_EDGES], accent: ["salespoint"], badges: { shop: "active", m45Check: "passed", m45Deal: "1+ card", salespoint: "switched on" } },
  { cue: 22, layout: CARD, edges: [{ from: "salespoint", to: "epos" }, { from: "salespoint", to: "commission" }], badges: { epos: "a terminal", commission: "a fee" } },
  { cue: 23, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "may it pay now?" }] },
  { cue: 24, layout: ASK, edges: [...ASK_EDGES], accent: ["salespoint", "shop"], badges: { salespoint: "active", shop: "active" } },
  { cue: 45, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "protect what?" } },
  { cue: 46, layout: SITES, edges: [...SITES_EDGES], danger: ["m45Site2"], badges: { m45Site2: "copycat" } },
  {
    cue: 47,
    layout: RETURN,
    edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "fakesite", broken: true }],
    packets: [{ from: "salespoint", to: "fakesite", label: "buyer", stopAt: 0.5 }],
    crossed: ["fakesite"],
  },
  { cue: 48, layout: CHECK, edges: [...CHECK_EDGES], accent: ["m45Check"], badges: { m45Check: "buyers · the bank's name" } },
  { cue: 49, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "pay?", stopAt: 0.6 }], danger: ["salespoint"], badges: { salespoint: "suspended" } },
  { cue: 50, layout: MARKET, edges: [...MARKET_EDGES], badges: { m45Market: "licensed", m45Stall1: "inspected", m45Stall2: "inspected" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 1, part: 4, current: ["partner"] },
  { cue: 2, part: 4, current: ["merchant"] },
  { cue: 3, part: 4, current: ["partner", "admin"] },
  { cue: 8, part: 4, current: ["partner", "admin", "merchant"], units: { ecom: "websites" } },
  { cue: 51, part: 4, current: ["commission"], units: { ecom: "next: the fee" } },
];

const DIR = "screens/c-21-sales-points";
const GOLIVE: [number, number, number, number] = [250, 170, 800, 500];
export const screens: ScreenStep[] = [
  { cue: 26, src: `${DIR}/websites.png`, title: "Merchant portal · Websites", region: [0, 0, 880, 550], focus: [[6, 160, 220, 30]], beats: [{ cue: 27, region: [240, 40, 880, 550], focus: [[260, 80, 490, 60]] }, { cue: 28, region: [560, 40, 880, 550], focus: [[1279, 103, 141, 36]] }] },
  { cue: 29, src: `${DIR}/add.png`, title: "Merchant portal · Websites", region: [360, 210, 760, 475], focus: [[516, 482, 408, 140]] },
  { cue: 30, src: `${DIR}/added.png`, title: "Merchant portal · Websites", region: [240, 60, 1200, 750], focus: [[260, 159, 1160, 325]] },
  { cue: 31, src: `${DIR}/refused.png`, title: "Merchant portal · Websites", region: [340, 200, 800, 500], focus: [[516, 482, 408, 70]], beats: [{ cue: 32, region: [340, 200, 800, 500], focus: [[516, 563, 408, 99]] }] },
  { cue: 33, src: `${DIR}/admin-start.png`, title: "Bank console · Website", region: [250, 50, 1180, 738] },
  { cue: 34, src: `${DIR}/admin-start.png`, title: "Bank console · Website", region: [250, 50, 1180, 738], focus: [[270, 80, 400, 70]] },
  {
    cue: 35,
    src: `${DIR}/admin-start.png`,
    title: "Bank console · Website",
    region: GOLIVE,
    focus: [[270, 192, 753, 50]],
    beats: [
      { cue: 36, region: GOLIVE, focus: [[914, 520, 88, 30]] },
      { cue: 37, region: GOLIVE, focus: [[291, 573, 711, 17]] },
    ],
  },
  { cue: 38, src: `${DIR}/admin-check.png`, title: "Bank console · Website", region: [250, 400, 800, 500], focus: [[291, 694, 711, 36], [861, 855, 141, 36]] },
  {
    cue: 39,
    src: `${DIR}/admin-deal.png`,
    title: "Bank console · Website",
    region: [250, 330, 800, 500],
    focus: [[291, 367, 300, 26]],
    beats: [
      { cue: 40, region: [250, 330, 800, 500], focus: [[291, 440, 120, 20]] },
      { cue: 41, region: [250, 330, 800, 500], focus: [[291, 480, 711, 80]] },
    ],
  },
  { cue: 42, src: `${DIR}/admin-ready.png`, title: "Bank console · Website", region: GOLIVE, focus: [[291, 250, 400, 160], [914, 520, 88, 30]], beats: [{ cue: 43, region: GOLIVE, focus: [[914, 520, 88, 30]] }] },
  { cue: 44, src: `${DIR}/admin-switch-on.png`, title: "Bank console · Website", region: [380, 20, 680, 425], focus: [[516, 90, 408, 60]] },
];
