import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 21: Malika's train-set website. It does not take payments (0–2), the bridge (3), the copycat risk (4–5),
// Add website and the return addresses (6–18), a draft (19–20), Dilnoza checks it and sets the deal (21–32),
// Switch on is not the end (33–35), one question (36–38), every website checked (39), next (43).
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
  { cue: 0, layout: SITES, edges: [...SITES_EDGES], accent: ["m45Site2"], badges: { shop: "April", m45Site2: "train-set site" } },
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
    cue: 15,
    layout: RETURN,
    edges: [{ from: "buyer", to: "salespoint" }, { from: "salespoint", to: "fakesite", broken: true }],
    packets: [{ from: "salespoint", to: "fakesite", label: "buyer", stopAt: 0.5 }],
    crossed: ["fakesite"],
    badges: { fakesite: "fake thank-you page" },
  },
  // A draft takes no money.
  { cue: 19, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft · no money" } },
  { cue: 20, layout: ONE, edges: [{ from: "shop", to: "salespoint" }], badges: { salespoint: "draft only" } },
  // The check and the deal.
  { cue: 26, layout: CHECK, edges: [...CHECK_EDGES], danger: ["m45Check"], badges: { m45Check: "failed: what's wrong" } },
  { cue: 28, layout: DEAL, edges: [{ from: "m45Deal", to: "salespoint" }], accent: ["m45Deal"], badges: { m45Deal: "cards · per payment · per day" } },
  // Switched on, but each card still needs a terminal and a fee.
  { cue: 34, layout: ON, edges: [...ON_EDGES], accent: ["salespoint"], badges: { shop: "active", m45Check: "passed", m45Deal: "1+ card", salespoint: "not the end" } },
  { cue: 35, layout: CARD, edges: [{ from: "salespoint", to: "epos" }, { from: "salespoint", to: "commission" }], badges: { epos: "a terminal", commission: "a fee" } },
  // One question before any money.
  { cue: 36, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "may it pay now?" }] },
  { cue: 37, layout: ASK, edges: [...ASK_EDGES], accent: ["salespoint", "shop"], badges: { salespoint: "active", shop: "active" } },
  { cue: 38, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "salespoint", label: "pay?", stopAt: 0.6 }], danger: ["salespoint"], badges: { salespoint: "suspended" } },
  { cue: 39, layout: SITES, edges: [...SITES_EDGES], badges: { shop: "checked once", salespoint: "checked", m45Site2: "checked" } },
  // The recap's answer.
  { cue: 42, layout: SITES, edges: [...SITES_EDGES], accent: ["m45Site2"], badges: { m45Site2: "checked on its own" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 3, part: 4, current: ["partner", "admin", "merchant"], units: { ecom: "websites" } },
  { cue: 43, part: 4, rows: [4], current: ["commission"], units: { ecom: "next: the fee" } },
];

const DIR = "screens/c-21-sales-points";
const GOLIVE: [number, number, number, number] = [250, 170, 800, 500];
export const screens: ScreenStep[] = [
  { cue: 6, src: `${DIR}/websites.png`, title: "Merchant portal · Websites", region: [0, 0, 880, 550], focus: [[6, 160, 220, 30]], beats: [{ cue: 7, region: [240, 40, 880, 550], focus: [[260, 80, 490, 60]] }, { cue: 8, region: [560, 40, 880, 550], focus: [[1279, 103, 141, 36]] }] },
  { cue: 9, src: `${DIR}/add.png`, title: "Merchant portal · Websites", region: [360, 210, 760, 475], focus: [[516, 482, 408, 140]] },
  { cue: 16, src: `${DIR}/refused.png`, title: "Merchant portal · Websites", region: [340, 200, 800, 500], focus: [[516, 482, 408, 70]], beats: [{ cue: 17, region: [340, 200, 800, 500], focus: [[516, 563, 408, 99]] }] },
  { cue: 18, src: `${DIR}/added.png`, title: "Merchant portal · Websites", region: [240, 60, 1200, 750], focus: [[260, 159, 1160, 325]] },
  {
    cue: 21,
    src: `${DIR}/admin-start.png`,
    title: "Bank console · Website",
    region: [250, 50, 1180, 738],
    focus: [[270, 80, 400, 70]],
    beats: [
      { cue: 22, region: GOLIVE, focus: [[270, 192, 753, 50]] },
      { cue: 23, region: GOLIVE, focus: [[914, 520, 88, 30]] },
      { cue: 24, region: GOLIVE, focus: [[291, 573, 711, 17]] },
    ],
  },
  { cue: 25, src: `${DIR}/admin-check.png`, title: "Bank console · Website", region: [250, 400, 800, 500], focus: [[291, 694, 711, 36], [861, 855, 141, 36]] },
  { cue: 27, src: `${DIR}/admin-deal.png`, title: "Bank console · Website", region: [250, 330, 800, 500], focus: [[291, 367, 300, 26]] },
  {
    cue: 29,
    src: `${DIR}/admin-deal.png`,
    title: "Bank console · Website",
    region: [250, 330, 800, 500],
    focus: [[291, 440, 120, 20]],
    beats: [{ cue: 30, region: [250, 330, 800, 500], focus: [[291, 480, 711, 80]] }],
  },
  { cue: 31, src: `${DIR}/admin-ready.png`, title: "Bank console · Website", region: GOLIVE, focus: [[291, 250, 400, 160], [914, 520, 88, 30]], beats: [{ cue: 32, region: GOLIVE, focus: [[914, 520, 88, 30]] }] },
  { cue: 33, src: `${DIR}/admin-switch-on.png`, title: "Bank console · Website", region: [380, 20, 680, 425], focus: [[516, 90, 408, 60]] },
];
