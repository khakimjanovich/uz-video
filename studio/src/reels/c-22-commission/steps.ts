import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 22: the bank's fee. One story carries it: supermarket price tags.
// A fee in code (cues 0–4), the tags (5–7), fee rules (8–10), the formula and minor units (11–13),
// never edited, never overlapping, always explained (14–18), the price in code (19–21), the check (22–26), the close (27–28).
const TAGS = { tagItem: [0.4, 1], tagAisle: [1.5, 1], tagStore: [2.6, 1] } as const;
const RULES = { ruleSite: [0, 1], ruleMerchant: [1, 1], ruleCard: [2, 1], ruleBank: [3, 1] } as const;
const SCORES = { ruleSite: "4", ruleMerchant: "2", ruleCard: "1", ruleBank: "0" };
const FEE = { payment: [0.4, 1], feeacc: [2.6, 0.3], wallet: [2.6, 1.7] } as const;
const FEE_EDGES = [{ from: "payment", to: "feeacc", label: "fee" }, { from: "payment", to: "wallet", label: "the rest" }] as const;
const PERIODS = { ruleA: [0.6, 0.4], ruleB: [2.4, 0.4], ruleC: [1.5, 1.8] } as const;
const KEPT = { payment: [0.4, 1], commission: [2.6, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A fee in code.
  { cue: 0, layout: { payment: [1.5, 1] } },
  { cue: 1, layout: { payment: [1.5, 1] }, badges: { payment: "fee = 1.5%" } },
  { cue: 2, layout: { payment: [1.5, 1] }, badges: { payment: "if merchant… if site… if card…" } },
  { cue: 3, layout: { payment: [1.5, 1] }, danger: ["payment"], shake: { payment: 0.3 }, badges: { payment: "a tangle" } },
  { cue: 4, layout: { record: [1.5, 1] }, danger: ["record"], badges: { record: "last month: ?" } },
  // Price tags.
  { cue: 5, layout: TAGS },
  { cue: 6, layout: TAGS, accent: ["tagItem"] },
  { cue: 7, layout: TAGS, accent: ["tagItem"], badges: { tagItem: "wins" } },
  // Fee rules.
  { cue: 8, layout: RULES },
  { cue: 9, layout: RULES, accent: ["ruleSite", "ruleMerchant", "ruleCard", "ruleBank"] },
  { cue: 10, layout: RULES, accent: ["ruleSite"], badges: SCORES },
  // The formula, in minor units.
  { cue: 11, layout: FEE, edges: [...FEE_EDGES], badges: { feeacc: "% + fixed, min…max" } },
  { cue: 12, layout: FEE, edges: [...FEE_EDGES], badges: { feeacc: "whole tiyin", wallet: "whole tiyin" } },
  { cue: 13, layout: FEE, edges: [...FEE_EDGES], badges: { feeacc: "rounded once" } },
  // Never edited, never overlapping, always explained.
  { cue: 14, layout: { ruleA: [1.5, 1] }, badges: { ruleA: "never edited" } },
  {
    cue: 15,
    layout: { admin: [0.4, 1], checker: [2.6, 1] },
    edges: [{ from: "admin", to: "checker", label: "propose" }],
    packets: [{ from: "admin", to: "checker", label: "change" }],
    badges: { checker: "approves" },
  },
  { cue: 16, layout: PERIODS, crossed: ["ruleC"], badges: { ruleC: "refused" } },
  {
    cue: 17,
    layout: KEPT,
    edges: [{ from: "payment", to: "commission" }],
    packets: [{ from: "payment", to: "commission", label: "fee?" }, { from: "commission", to: "payment", label: "rule · fee · net", delay: 45 }],
  },
  { cue: 18, layout: { record: [1.5, 1] }, accent: ["record"], badges: { record: "rule · fee · net" } },
  // The close.
  { cue: 27, layout: TAGS, accent: ["tagItem"], badges: { tagItem: "wins", tagStore: "never repainted" } },
];

export const map: BuildMapStep[] = [{ cue: 28, part: 5, current: ["commission", "epos"], units: { ecom: "e-POS next" } }];

// The price as written, then the same formula run by hand on a made-up rule.
export const code: CodeStep[] = [
  {
    cue: 19,
    file: "ecom/modules/commission/…/commission/entity/CommissionRule.java",
    lines: [
      "  /**",
      "   * percent of the amount, rounded half up to whole tiyin once, plus the fixed fee,",
      "       then kept",
      "   * between the minimum and the maximum.",
      "   */",
      "  public long feeFor(long amount) {",
      "    var fee =",
      "        BigDecimal.valueOf(amount)",
      "                .multiply(percent)",
      "                .divide(HUNDRED, 0, RoundingMode.HALF_UP)",
      "                .longValueExact()",
      "            + fixedFee;",
      "    if (minFee != null) fee = Math.max(fee, minFee);",
      "    if (maxFee != null) fee = Math.min(fee, maxFee);",
      "    return fee;",
      "  }",
      "",
      "  /** How specific the scope is: a sales point beats a partner beats a card scheme",
      "      beats \"any\". */",
      "  public int specificity() {",
      "    return (salesPointId != null ? 4 : 0) + (partnerId != null ? 2 : 0)",
      "        + (scheme != null ? 1 : 0);",
      "  }",
    ],
    at: [101, 102, null, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, null, 118, 119, null, 120],
    small: true,
    upTo: 16,
    beats: [{ cue: 20, upTo: 16, highlight: [10, 12, 13, 14] }, { cue: 21, highlight: [21, 22] }],
  },
  {
    cue: 22,
    file: "terminal · jshell",
    lines: [
      "$ jshell -q",
      "jshell> import java.math.*;",
      "jshell> long amount = 1_234_567;",
      "jshell> var percent = new BigDecimal(\"1.5\");",
      "jshell> long fixedFee = 500, minFee = 1_000, maxFee = 50_000;",
      "jshell> long rounded = BigDecimal.valueOf(amount).multiply(percent)",
      "   ...>     .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP).longValueExact();",
      "jshell> rounded",
      "rounded ==> 18519",
      "jshell> long fee = Math.min(Math.max(rounded + fixedFee, minFee), maxFee);",
      "jshell> fee",
      "fee ==> 19019",
      "jshell> amount - fee",
      "$11 ==> 1215548",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 23, upTo: 5, highlight: [3, 4, 5] }, { cue: 24, upTo: 9, highlight: [9] }, { cue: 25, upTo: 12, highlight: [12] }, { cue: 26, highlight: [14] }],
  },
];
