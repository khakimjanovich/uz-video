import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 21: Malika's wedding-flowers website. It does not take payments (0–2), the bridge (3), the copycat risk (4–5),
// Add website and the return addresses (6–17), a draft (18–19), Dilnoza checks it and sets the deal (20–31),
// Switch on is not the end (32–34), one question (35–37), every website checked (38), next (39).
const SITES = { shop: [0, 1], salespoint: [2, 0.3], m45Site2: [2, 1.8] } as const;
const SITES_EDGES = [{ from: "shop", to: "salespoint" }, { from: "shop", to: "m45Site2" }] as const;
const ONE = { shop: [0, 1], salespoint: [1.5, 1] } as const;
const RETURN = { buyer: [0, 1], salespoint: [1.5, 0.3], fakesite: [3, 1.8] } as const;
const RETURN_GOOD = { buyer: [0, 1], salespoint: [1.5, 0.3], shop: [3, 0.3], fakesite: [3, 1.8] } as const;
const RETURN_EDGES = [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "shop", label: "return address" }] as const;
const CHECK = { m45BankAdmin: [0, 1], salespoint: [1.5, 1], m45Check: [3, 1] } as const;
const CHECK_EDGES = [{ from: "m45BankAdmin", to: "salespoint", label: "checks" }, { from: "salespoint", to: "m45Check" }] as const;
const DEAL = { salespoint: [1.5, 1], m45Deal: [3, 1] } as const;
const ON = { shop: [0, 0], m45Check: [0, 1], m45Deal: [0, 2], salespoint: [2.5, 1] } as const;
const ON_EDGES = [{ from: "shop", to: "salespoint" }, { from: "m45Check", to: "salespoint" }, { from: "m45Deal", to: "salespoint" }] as const;
const CARD = { salespoint: [0, 1], epos: [2, 0.3], commission: [2, 1.8] } as const;
const ASK = { payment: [0, 1], salespoint: [2, 0.3], shop: [2, 1.8] } as const;
const ASK_EDGES = [{ from: "payment", to: "salespoint", label: "may it?" }, { from: "payment", to: "shop" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // April: a second website, and it takes nothing.
  { cue: 0, layout: SITES, edges: [...SITES_EDGES], accent: ["m45Site2"], badges: { shop: "April", m45Site2: "wedding site" } },
  { cue: 1, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "approved", m45Site2: "take money?" } },
  { cue: 2, layout: SITES, edges: [...SITES_EDGES], danger: ["m45Site2"], badges: { shop: "approved", m45Site2: "not yet" } },
  // Why: a copycat could ride on an approved company.
  { cue: 4, layout: SITES, edges: [...SITES_EDGES], danger: ["m45Site2"], badges: { m45Site2: "a brand's copy" } },
  { cue: 5, layout: SITES, edges: [...SITES_EDGES], packets: [{ from: "shop", to: "m45Site2", label: "typed in" }], danger: ["m45Site2"], badges: { shop: "checks for nothing" } },
  // A sales point and its return addresses.
  { cue: 10, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], accent: ["salespoint"], badges: { salespoint: "sales point" } },
  { cue: 11, layout: RETURN_GOOD, edges: [...RETURN_EDGES], packets: [{ from: "salespoint", to: "shop", label: "back to shop" }], accent: ["shop"] },
  { cue: 12, layout: RETURN_GOOD, edges: [...RETURN_EDGES], badges: { shop: "secure · own site" } },
  { cue: 13, layout: RETURN_GOOD, edges: [...RETURN_EDGES], accent: ["salespoint"], badges: { salespoint: "underrated field" } },
  {
    cue: 14,
    layout: RETURN,
    edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "fakesite", broken: true }],
    packets: [{ from: "salespoint", to: "fakesite", label: "buyer", stopAt: 0.5 }],
    crossed: ["fakesite"],
    badges: { fakesite: "fake thank-you page" },
  },
  // A draft takes no money.
  { cue: 18, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft · no money" } },
  { cue: 19, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft only" } },
  // The check and the deal.
  { cue: 25, layout: CHECK, edges: [...CHECK_EDGES], danger: ["m45Check"], badges: { m45Check: "failed: what's wrong" } },
  { cue: 27, layout: DEAL, edges: [{ from: "m45Deal", to: "salespoint" }], accent: ["m45Deal"], badges: { m45Deal: "cards · per payment · per day" } },
  // Switched on, but each card still needs a terminal and a fee.
  { cue: 33, layout: ON, edges: [...ON_EDGES], accent: ["salespoint"], badges: { shop: "active", m45Check: "passed", m45Deal: "1+ card", salespoint: "not the end" } },
  { cue: 34, layout: CARD, edges: [{ from: "salespoint", to: "epos" }, { from: "salespoint", to: "commission" }], badges: { epos: "a terminal", commission: "a fee" } },
  // One question before any money.
  { cue: 35, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "may it pay now?" }] },
  { cue: 36, layout: ASK, edges: [...ASK_EDGES], accent: ["salespoint", "shop"], badges: { salespoint: "active", shop: "active" } },
  { cue: 37, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "pay?", stopAt: 0.6 }], danger: ["salespoint"], badges: { salespoint: "suspended" } },
  { cue: 38, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "checked once", salespoint: "checked", m45Site2: "checked" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 3, part: 4, current: ["partner", "admin", "merchant"], units: { ecom: "websites" } },
  { cue: 39, part: 4, current: ["commission"], units: { ecom: "next: the fee" } },
];

const DIR = "screens/c-21-sales-points";
const GOLIVE: [number, number, number, number] = [250, 170, 800, 500];
export const screens: ScreenStep[] = [
  { cue: 6, src: `${DIR}/websites.png`, title: "Merchant portal · Websites", region: [0, 0, 880, 550], focus: [[6, 160, 220, 30]], beats: [{ cue: 7, region: [240, 40, 880, 550], focus: [[260, 80, 490, 60]] }, { cue: 8, region: [560, 40, 880, 550], focus: [[1279, 103, 141, 36]] }] },
  { cue: 9, src: `${DIR}/add.png`, title: "Merchant portal · Websites", region: [360, 210, 760, 475], focus: [[516, 482, 408, 140]] },
  { cue: 15, src: `${DIR}/refused.png`, title: "Merchant portal · Websites", region: [340, 200, 800, 500], focus: [[516, 482, 408, 70]], beats: [{ cue: 16, region: [340, 200, 800, 500], focus: [[516, 563, 408, 99]] }] },
  { cue: 17, src: `${DIR}/added.png`, title: "Merchant portal · Websites", region: [240, 60, 1200, 750], focus: [[260, 159, 1160, 325]] },
  {
    cue: 20,
    src: `${DIR}/admin-start.png`,
    title: "Bank console · Website",
    region: [250, 50, 1180, 738],
    focus: [[270, 80, 400, 70]],
    beats: [
      { cue: 21, region: GOLIVE, focus: [[270, 192, 753, 50]] },
      { cue: 22, region: GOLIVE, focus: [[914, 520, 88, 30]] },
      { cue: 23, region: GOLIVE, focus: [[291, 573, 711, 17]] },
    ],
  },
  { cue: 24, src: `${DIR}/admin-check.png`, title: "Bank console · Website", region: [250, 400, 800, 500], focus: [[291, 694, 711, 36], [861, 855, 141, 36]] },
  { cue: 26, src: `${DIR}/admin-deal.png`, title: "Bank console · Website", region: [250, 330, 800, 500], focus: [[291, 367, 300, 26]] },
  {
    cue: 28,
    src: `${DIR}/admin-deal.png`,
    title: "Bank console · Website",
    region: [250, 330, 800, 500],
    focus: [[291, 440, 120, 20]],
    beats: [{ cue: 29, region: [250, 330, 800, 500], focus: [[291, 480, 711, 80]] }],
  },
  { cue: 30, src: `${DIR}/admin-ready.png`, title: "Bank console · Website", region: GOLIVE, focus: [[291, 250, 400, 160], [914, 520, 88, 30]], beats: [{ cue: 31, region: GOLIVE, focus: [[914, 520, 88, 30]] }] },
  { cue: 32, src: `${DIR}/admin-switch-on.png`, title: "Bank console · Website", region: [380, 20, 680, 425], focus: [[516, 90, 408, 60]] },
];
