import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 15: domain, contract, database. One story carries it: designing a board game.
// Table first (cues 0–3), the game's order (4–8), the state machine (9–12), the contract (13–14),
// the database and changesets (15–18), play and the problem detail (19–22), the rules in code (23–26), the close (27–28).
const GAME = { gRules: [0, 1], gRulebook: [1, 1], gBoard: [2, 1], gPlay: [3, 1] } as const;
const GAME_EDGES = [{ from: "gRules", to: "gRulebook" }, { from: "gRulebook", to: "gBoard" }, { from: "gBoard", to: "gPlay" }] as const;
const LAYERS = { gRules: "domain", gRulebook: "contract", gBoard: "database", gPlay: "code" };
const STATES = {
  stPending: [0, 0.2], stVerified: [1, 0.2], stContract: [2, 0.2], stApproved: [3, 0.2],
  stRejected: [1, 1.2], stSuspended: [2, 1.2], stActive: [3, 1.2], stTerminated: [3, 2.2],
} as const;
const MOVES = [
  { from: "stPending", to: "stVerified" },
  { from: "stVerified", to: "stContract" },
  { from: "stContract", to: "stApproved" },
  { from: "stApproved", to: "stActive" },
  { from: "stVerified", to: "stRejected" },
  { from: "stActive", to: "stSuspended" },
  { from: "stActive", to: "stTerminated" },
] as const;
const ASK = { request: [0.3, 1], partner: [1.5, 1], problem: [2.8, 1] } as const;
const ASK_EDGES = [{ from: "request", to: "partner" }, { from: "partner", to: "problem" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Starting from the table.
  { cue: 0, layout: { partnerTable: [1.5, 1] } },
  { cue: 2, layout: { partnerTable: [1.5, 1] }, badges: { partnerTable: "status: any string" } },
  {
    cue: 3,
    layout: { partnerTable: [0.4, 1], payment: [2.6, 1] },
    edges: [{ from: "partnerTable", to: "payment" }],
    packets: [{ from: "partnerTable", to: "payment", label: "pay" }],
    danger: ["payment"],
    badges: { partnerTable: "SUSPENDED" },
  },
  // A board game: rules, rulebook, board, play.
  { cue: 4, layout: GAME, edges: [...GAME_EDGES] },
  { cue: 5, layout: GAME, edges: [...GAME_EDGES], accent: ["gRules"] },
  { cue: 6, layout: GAME, edges: [...GAME_EDGES], accent: ["gRules", "gRulebook"] },
  { cue: 7, layout: GAME, edges: [...GAME_EDGES], accent: ["gRules", "gRulebook", "gBoard", "gPlay"] },
  { cue: 8, layout: GAME, edges: [...GAME_EDGES], badges: LAYERS },
  // The rules: a state machine.
  { cue: 9, layout: STATES, edges: [...MOVES] },
  { cue: 10, layout: STATES, edges: [...MOVES], danger: ["stTerminated"], badges: { stTerminated: "any move: refused" } },
  { cue: 11, layout: STATES, edges: [...MOVES], accent: ["stPending", "stVerified", "stContract", "stApproved", "stActive"] },
  { cue: 12, layout: STATES, edges: [...MOVES], accent: ["stActive", "stSuspended"], badges: { stTerminated: "stays closed" } },
  // The rulebook: the contract.
  { cue: 13, layout: { spec: [0.4, 1], controller: [2.6, 1] }, edges: [{ from: "spec", to: "controller" }], badges: { spec: "getPartner" } },
  { cue: 14, layout: { spec: [0.4, 1], controller: [2.6, 1] }, edges: [{ from: "spec", to: "controller", label: "implements" }], badges: { controller: "can't drift" } },
  // The board: the database.
  { cue: 15, layout: { partner: [0.4, 1], postgres: [2.6, 1] }, edges: [{ from: "partner", to: "postgres", label: "partner_user" }], badges: { postgres: "schema partner" } },
  { cue: 16, layout: { cs1: [1.5, 1.6] }, badges: { cs1: "runs once" } },
  { cue: 17, layout: { cs1: [1.5, 1.6], cs2: [1.5, 0.3] }, accent: ["cs2"], badges: { cs1: "never edited", cs2: "on top" } },
  { cue: 18, layout: { partner: [0.4, 1], payment: [2.6, 1] }, edges: [{ from: "payment", to: "partner", label: "an id only" }], badges: { payment: "partner id" } },
  // Play, and the error that follows the rulebook.
  { cue: 19, layout: GAME, edges: [...GAME_EDGES], accent: ["gPlay"], badges: LAYERS },
  { cue: 20, layout: ASK, edges: [...ASK_EDGES] },
  { cue: 21, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "request", to: "partner", label: "no such id" }, { from: "partner", to: "problem", label: "404", delay: 45 }], accent: ["problem"] },
  { cue: 22, layout: ASK, edges: [...ASK_EDGES], badges: { problem: "en · ru · uz" } },
  // The close.
  { cue: 27, layout: GAME, edges: [...GAME_EDGES], accent: ["gRules", "gRulebook", "gBoard", "gPlay"], badges: LAYERS },
];

export const map: BuildMapStep[] = [{ cue: 28, part: 4, current: ["partner"], units: { ecom: "merchants next" } }];

// The rules as written: the states and their moves, and the missing partner's one entry.
export const code: CodeStep[] = [
  {
    cue: 23,
    file: "ecom/modules/partner/…/partner/constant/PartnerStatus.java",
    lines: [
      "  PENDING_VERIFICATION,",
      "  VERIFIED,",
      "  WAITING_CONTRACT,",
      "  APPROVED,",
      "  ACTIVE,",
      "  SUSPENDED,",
      "  TERMINATED,",
      "  REJECTED;",
      "",
      "  public boolean canMoveTo(PartnerStatus target) {",
      "    Set<PartnerStatus> next =",
      "        switch (this) {",
      "          case PENDING_VERIFICATION -> EnumSet.of(VERIFIED, REJECTED);",
      "          case VERIFIED -> EnumSet.of(WAITING_CONTRACT, REJECTED);",
      "          case WAITING_CONTRACT -> EnumSet.of(APPROVED, REJECTED);",
      "          case APPROVED -> EnumSet.of(ACTIVE, TERMINATED);",
      "          case ACTIVE -> EnumSet.of(SUSPENDED, TERMINATED);",
      "          case SUSPENDED -> EnumSet.of(ACTIVE, TERMINATED);",
      "          case TERMINATED, REJECTED -> EnumSet.noneOf(PartnerStatus.class);",
      "        };",
      "    return next.contains(target);",
      "  }",
    ],
    at: 12,
    small: true,
    beats: [{ cue: 24, highlight: [10, 21] }, { cue: 25, highlight: [19] }],
  },
  {
    cue: 26,
    file: "ecom/modules/partner/…/properties/partner-exception.yaml",
    lines: [
      "      PARTNER_NOT_FOUND:",
      "        http-code: 404",
      "        title: partner-not-found",
      "        is-loggable: false",
      "        message-en: \"No merchant found for {0}.\"",
      "        message-ru: \"Мерчант «{0}» не найден.\"",
      "        message-uz: \"{0} boʻyicha merchant topilmadi.\"",
    ],
    at: 6,
    highlight: [1, 2, 5, 6, 7],
  },
];
