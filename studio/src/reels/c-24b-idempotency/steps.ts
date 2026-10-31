import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 24b: idempotency. One story carries it: a lift button.
// The lost answer and the retry (cues 0–3), the lift button (4–5), the key and the replay (6–9),
// the race (10–11), the code (12–17), the close (18–19).
const CALL = { merchant: [0.4, 1], payment: [2.6, 1] } as const;
const CALL_EDGE = [{ from: "merchant", to: "payment" }] as const;
const TWICE = { merchant: [0.2, 1], payment: [1.5, 1], payPage: [2.8, 0.3], payPage2: [2.8, 1.7] } as const;
const TWICE_EDGES = [{ from: "merchant", to: "payment" }, { from: "payment", to: "payPage" }, { from: "payment", to: "payPage2" }] as const;
const LIFT = { liftButton: [0.4, 1], lift: [2.6, 1] } as const;
const PRESSES = [0, 1, 2].map((k) => ({ from: "liftButton" as const, to: "lift" as const, label: "press", delay: k * 20 }));
const RACE = { retry1: [0.4, 0.3], retry2: [0.4, 1.7], postgres: [2.6, 1] } as const;
const RACE_EDGES = [{ from: "retry1", to: "postgres" }, { from: "retry2", to: "postgres" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A retry without care.
  { cue: 0, layout: { merchant: [1.5, 1] } },
  {
    cue: 1,
    layout: CALL,
    edges: [...CALL_EDGE],
    packets: [{ from: "merchant", to: "payment", label: "create" }, { from: "payment", to: "merchant", label: "answer", delay: 45, stopAt: 0.5 }],
    badges: { merchant: "no answer" },
  },
  { cue: 2, layout: CALL, edges: [...CALL_EDGE], packets: [{ from: "merchant", to: "payment", label: "create again" }] },
  { cue: 3, layout: TWICE, edges: [...TWICE_EDGES], danger: ["payPage2"], badges: { payPage2: "pays twice?" } },
  // The lift button.
  { cue: 4, layout: LIFT, edges: [{ from: "liftButton", to: "lift" }] },
  { cue: 5, layout: LIFT, edges: [{ from: "liftButton", to: "lift" }], packets: PRESSES, accent: ["lift"], badges: { lift: "just one" } },
  // The key, and the replay.
  { cue: 6, layout: CALL, edges: [...CALL_EDGE], packets: [{ from: "merchant", to: "payment", label: "Idempotency-Key" }] },
  {
    cue: 7,
    layout: CALL,
    edges: [...CALL_EDGE],
    packets: [{ from: "merchant", to: "payment", label: "same key + body" }, { from: "payment", to: "merchant", label: "first answer", delay: 50 }],
  },
  { cue: 8, layout: CALL, edges: [...CALL_EDGE], accent: ["merchant"], badges: { merchant: "Idempotent-Replayed: true" } },
  {
    cue: 9,
    layout: CALL,
    edges: [...CALL_EDGE],
    packets: [{ from: "merchant", to: "payment", label: "same key, new body", stopAt: 0.85 }],
    badges: { payment: "422" },
  },
  // Two retries at the same moment.
  { cue: 10, layout: RACE, edges: [...RACE_EDGES], packets: [{ from: "retry1", to: "postgres", label: "insert" }, { from: "retry2", to: "postgres", label: "insert" }] },
  { cue: 11, layout: RACE, edges: [...RACE_EDGES], accent: ["retry1"], badges: { postgres: "unique key", retry1: "wins", retry2: "winner's answer" } },
  // The close.
  { cue: 18, layout: LIFT, edges: [{ from: "liftButton", to: "lift" }], packets: PRESSES, accent: ["lift"], badges: { lift: "one payment" } },
];

export const map: BuildMapStep[] = [{ cue: 19, part: 6, current: ["payment", "buyer"], units: { ecom: "the payment page next" } }];

// The record and its key, then the service that reads it first.
export const code: CodeStep[] = [
  {
    cue: 12,
    file: "ecom/modules/payment/…/db/changelog/payment.yaml",
    lines: [
      "            tableName: idempotency_record",
      "            columns:",
      "              - column: { name: client_id, type: varchar(64), … }",
      "              - column: { name: idempotency_key, type: varchar(64), … }",
      "              - column: { name: request_hash, type: varchar(64), … }",
      "              - column:",
      "                  name: payment_id",
      "                  …",
      "              - column: { name: response, type: text, … }",
      "              - column: { name: created_at, type: timestamptz, … }",
      "        - addPrimaryKey:",
      "            schemaName: payment",
      "            tableName: idempotency_record",
      "            columnNames: client_id, idempotency_key",
      "            constraintName: pk_idempotency_record",
    ],
    at: [87, 88, 89, 90, 91, 92, 93, null, 96, 97, 98, 99, 100, 101, 102],
    small: true,
    beats: [{ cue: 13, highlight: [3, 4, 5, 9] }, { cue: 14, highlight: [11, 14] }],
  },
  {
    cue: 15,
    file: "ecom/modules/payment/…/service/impl/PaymentServiceImpl.java",
    lines: [
      "    var key = new IdempotencyRecord.Key(clientId, idempotencyKey);",
      "    try {",
      "      return transaction.execute(",
      "          status -> createOnce(key, requestHash, request));",
      "    } catch (DataIntegrityViolationException raced) {",
      "      // A concurrent request won: with the same key the retry replays its answer.",
      "      try {",
      "        return transaction.execute(",
      "            status -> createOnce(key, requestHash, request));",
      "      } …",
      "    }",
      "  …",
      "    var earlier = idempotency.findById(key);",
      "    if (earlier.isPresent()) {",
      "      if (!earlier.get().getRequestHash().equals(requestHash)) {",
      "        throw new GeneralException(",
      "            PaymentExceptionStatus.PAYMENT_IDEMPOTENCY_KEY_REUSED);",
      "      }",
      "      return new Created(JSON.readValue(earlier.get().getResponse(),",
      "          PaymentResponse.class), true);",
      "    }",
    ],
    at: [76, 77, 78, null, 79, 80, 81, 82, null, null, 88, null, 93, 94, 95, 96, null, 97, 98, null, 99],
    small: true,
    highlight: [13, 14],
    beats: [{ cue: 16, highlight: [15, 16, 17, 19, 20] }, { cue: 17, highlight: [5, 6, 8, 9] }],
  },
];
