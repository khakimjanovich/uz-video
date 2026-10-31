import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 26: the debit. One story carries it: one slip, one logbook.
// Charged twice, or nobody knows (cues 0–3), the cash desk (4–7), the claim (8–9), terminal and fee (10–11),
// the journal (12–13), by token, once (14–15), the capture (16–17), the three answers (18–20), the code (21–25), the close (26–27).
const DESK = { slip: [0, 1], logbook: [1.5, 1], drawer: [3, 1] } as const;
const DESK_EDGES = [{ from: "slip", to: "logbook" }, { from: "logbook", to: "drawer" }] as const;
const CLAIM = { retry1: [0.4, 0.3], retry2: [0.4, 1.7], payment: [2.6, 1] } as const;
const CLAIM_EDGES = [{ from: "retry1", to: "payment" }, { from: "retry2", to: "payment" }] as const;
const ROUTE = { payment: [0.4, 1], epos: [2.6, 0.3], commission: [2.6, 1.7] } as const;
const ROUTE_EDGES = [{ from: "payment", to: "epos" }, { from: "payment", to: "commission" }] as const;
const ASK = { payment: [0, 1], card: [1.5, 1], network: [3, 1] } as const;
const ASK_EDGES = [{ from: "payment", to: "card" }, { from: "card", to: "network" }] as const;
const ANSWER = { network: [0.4, 1], payment: [2.6, 1] } as const;
const ANSWER_EDGE = [{ from: "network", to: "payment" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Charged twice, or nobody knows.
  { cue: 0, layout: { buyer: [1.5, 1] } },
  { cue: 1, layout: { buyer: [0.4, 1], payment: [2.6, 1] }, edges: [{ from: "buyer", to: "payment" }], packets: [0, 1].map((k) => ({ from: "buyer", to: "payment", label: "pay", delay: k * 25 })) },
  { cue: 2, layout: ASK, edges: [...ASK_EDGES], packets: [0, 1].map((k) => ({ from: "card", to: "network", label: "debit", delay: k * 25 })), danger: ["network"], badges: { network: "charged twice" } },
  { cue: 3, layout: { payment: [0.4, 1], network: [2.6, 1] }, edges: [{ from: "payment", to: "network" }], packets: [{ from: "payment", to: "network", label: "debit" }], danger: ["payment"], badges: { payment: "crash: paid?" } },
  // The cash desk.
  { cue: 4, layout: DESK, edges: [...DESK_EDGES] },
  { cue: 5, layout: DESK, edges: [...DESK_EDGES], accent: ["slip"], badges: { slip: "one cashier" } },
  { cue: 6, layout: DESK, edges: [...DESK_EDGES], accent: ["logbook"], badges: { slip: "one cashier", logbook: "first" } },
  // The claim.
  { cue: 8, layout: CLAIM, edges: [...CLAIM_EDGES], packets: [{ from: "retry1", to: "payment", label: "claim" }, { from: "retry2", to: "payment", label: "claim" }], badges: { payment: "debiting" } },
  { cue: 9, layout: CLAIM, edges: [...CLAIM_EDGES], accent: ["retry1"], badges: { retry1: "wins", retry2: "0 rows", payment: "debiting" } },
  // Terminal and fee first.
  { cue: 10, layout: ROUTE, edges: [...ROUTE_EDGES], badges: { epos: "live terminal", commission: "fee" } },
  { cue: 11, layout: ROUTE, edges: [...ROUTE_EDGES], crossed: ["epos"], danger: ["payment"], badges: { payment: "failed: nothing charged" } },
  // The journal, before the network.
  { cue: 12, layout: { payment: [0.4, 1], journal: [2.6, 1] }, edges: [{ from: "payment", to: "journal" }], packets: [{ from: "payment", to: "journal", label: "DEBIT · REQUESTED" }], accent: ["journal"] },
  { cue: 13, layout: { payment: [0.4, 1], journal: [2.6, 1] }, edges: [{ from: "payment", to: "journal" }], badges: { journal: "one debit" } },
  // By token, once.
  { cue: 14, layout: ASK, edges: [...ASK_EDGES], packets: [{ from: "payment", to: "card", label: "debit ctk_…" }, { from: "card", to: "network", label: "debit", delay: 50 }] },
  { cue: 15, layout: ASK, edges: [...ASK_EDGES], badges: { payment: "call id: once" } },
  // The capture.
  { cue: 16, layout: { card: [0.4, 1], network: [2.6, 1] }, edges: [{ from: "card", to: "network" }], badges: { network: "holds first" } },
  { cue: 17, layout: { card: [0.4, 1], network: [2.6, 1] }, edges: [{ from: "card", to: "network" }], packets: [{ from: "card", to: "network", label: "capture" }], accent: ["card"], badges: { card: "take it now" } },
  // The three answers.
  { cue: 18, layout: ANSWER, edges: [...ANSWER_EDGE], packets: [{ from: "network", to: "payment", label: "APPROVED" }], accent: ["payment"], badges: { payment: "paid · reference no." } },
  { cue: 19, layout: ANSWER, edges: [...ANSWER_EDGE], packets: [{ from: "network", to: "payment", label: "DECLINED" }], badges: { payment: "declined: final" } },
  { cue: 20, layout: ANSWER, edges: [...ANSWER_EDGE], packets: [{ from: "network", to: "payment", label: "…", stopAt: 0.5 }], danger: ["payment"], badges: { payment: "unknown" } },
  // The close.
  { cue: 26, layout: DESK, edges: [...DESK_EDGES], accent: ["slip", "logbook"], badges: { slip: "one", logbook: "first", drawer: "one charge" } },
];

export const map: BuildMapStep[] = [{ cue: 27, part: 6, current: ["payment", "procport", "card", "adapters"], units: { ecom: "silence next" } }];

// The claim as written, then the journal table and its one-debit rule.
export const code: CodeStep[] = [
  {
    cue: 21,
    file: "ecom/modules/payment/…/payment/repository/PaymentRepository.java",
    lines: [
      "  /** The debit's claim: of any number of callers, exactly one moves the payment",
      "      and gets 1. */",
      "  @Modifying",
      "  @Query(",
      "      \"UPDATE Payment p SET p.status =",
      "         uz.heeypay.ecom.payment.constant.PaymentStatus.DEBITING\"",
      "          + \" WHERE p.id = :id AND p.status =",
      "             uz.heeypay.ecom.payment.constant.PaymentStatus.CARD_CONFIRMED\")",
      "  int claimDebit(UUID id);",
    ],
    at: [34, null, 35, 36, 37, null, 38, null, 39],
    small: true,
    beats: [{ cue: 22, highlight: [5, 6, 7, 8] }, { cue: 23, highlight: [1, 2, 9] }],
  },
  {
    cue: 24,
    file: "ecom/modules/payment/…/db/changelog/payment.yaml",
    lines: [
      "        # Every call to a scheme, written before it is made.",
      "        - createTable:",
      "            schemaName: payment",
      "            tableName: payment_operation",
      "            …",
      "              - column: { name: kind, type: varchar(16), … }",
      "              - column: { name: status, type: varchar(16), … }",
      "              …",
      "              - column: { name: started_at, type: timestamptz, … }",
      "              - column: { name: finished_at, type: timestamptz }",
      "        # One debit per payment, enforced by the database.",
      "        - addUniqueConstraint:",
      "            schemaName: payment",
      "            tableName: payment_operation",
      "            columnNames: payment_id, kind",
      "            constraintName: uq_payment_operation_kind",
    ],
    at: [107, 108, 109, 110, null, 117, 118, null, 127, 128, 129, 130, 131, 132, 133, 134],
    small: true,
    highlight: [1, 9, 10],
    beats: [{ cue: 25, highlight: [11, 12, 15] }],
  },
];
