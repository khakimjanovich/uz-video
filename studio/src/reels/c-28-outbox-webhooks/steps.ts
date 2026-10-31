import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 28: the outbox. One story carries it: the office outbox tray.
// Lost or invented news (cues 0–3), the tray (4–5), the outbox (6–8), the relay (9–11),
// at-least-once (12–14), truth and news (15), the code (16–20), the close (21–22).
const TELL = { payment: [0.2, 1], postgres: [1.6, 0.3], shop: [2.9, 1.7] } as const;
const TELL_EDGES = [{ from: "payment", to: "postgres", label: "save" }, { from: "payment", to: "shop", label: "tell" }] as const;
const DESK = { deskFile: [0, 1], tray: [1.5, 1], postman: [3, 1] } as const;
const DESK_EDGES = [{ from: "deskFile", to: "tray" }, { from: "tray", to: "postman" }] as const;
const OUT = { payment: [0.4, 1], outbox: [2.6, 1] } as const;
const ONE_TX = { label: "One transaction", from: [0.4, 1], to: [2.6, 1], tone: "wall" } as const;
const RELAY = { outbox: [0.2, 1], relay: [1.5, 0.3], relay2: [1.5, 1.7], kafka: [2.8, 1] } as const;
const RELAY_EDGES = [
  { from: "outbox", to: "relay" },
  { from: "outbox", to: "relay2" },
  { from: "relay", to: "kafka" },
  { from: "relay2", to: "kafka" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Saving and telling separately.
  { cue: 0, layout: { shop: [1.5, 1] } },
  { cue: 1, layout: TELL, edges: [...TELL_EDGES], packets: [{ from: "payment", to: "postgres", label: "PAID" }, { from: "payment", to: "shop", label: "paid", delay: 50 }] },
  { cue: 2, layout: TELL, edges: [...TELL_EDGES], packets: [{ from: "payment", to: "postgres", label: "PAID" }], danger: ["payment"], badges: { payment: "crash", shop: "never told" } },
  {
    cue: 3,
    layout: TELL,
    edges: [...TELL_EDGES],
    packets: [{ from: "payment", to: "shop", label: "paid" }],
    danger: ["shop"],
    crossed: ["postgres"],
    badges: { postgres: "never saved", shop: "ships for free" },
  },
  // The tray.
  { cue: 4, layout: DESK, edges: [...DESK_EDGES] },
  { cue: 5, layout: DESK, edges: [...DESK_EDGES], packets: [{ from: "deskFile", to: "tray", label: "letter" }, { from: "tray", to: "postman", label: "letter", delay: 50 }], badges: { deskFile: "one motion" } },
  // The outbox.
  { cue: 6, layout: OUT, edges: [{ from: "payment", to: "outbox" }], accent: ["outbox"] },
  { cue: 7, layout: OUT, edges: [{ from: "payment", to: "outbox" }], frames: [ONE_TX], packets: [{ from: "payment", to: "outbox", label: "PAID + event" }] },
  { cue: 8, layout: OUT, edges: [{ from: "payment", to: "outbox" }], frames: [ONE_TX], badges: { outbox: "both or neither" } },
  // The relay.
  { cue: 9, layout: RELAY, edges: [...RELAY_EDGES], accent: ["relay"], packets: [{ from: "outbox", to: "relay", label: "row 1" }] },
  { cue: 10, layout: RELAY, edges: [...RELAY_EDGES], packets: [{ from: "outbox", to: "relay", label: "row 1" }, { from: "outbox", to: "relay2", label: "row 2" }], badges: { relay: "row 1", relay2: "row 2" } },
  { cue: 11, layout: RELAY, edges: [...RELAY_EDGES], packets: [{ from: "relay", to: "kafka", label: "event" }], badges: { kafka: "key = payment id" } },
  // At least once.
  { cue: 12, layout: RELAY, edges: [...RELAY_EDGES], badges: { relay: "mark after Kafka" } },
  { cue: 13, layout: RELAY, edges: [...RELAY_EDGES], packets: [0, 1].map((k) => ({ from: "relay", to: "kafka", label: "event", delay: k * 35 })), badges: { kafka: "twice" } },
  { cue: 14, layout: RELAY, edges: [...RELAY_EDGES], badges: { kafka: "same id: dropped" } },
  { cue: 15, layout: { postgres: [0.4, 1], kafka: [2.6, 1] }, edges: [{ from: "postgres", to: "kafka" }], badges: { postgres: "the truth", kafka: "the news" } },
  // The close.
  { cue: 21, layout: DESK, edges: [...DESK_EDGES], accent: ["tray"], badges: { deskFile: "one motion", postman: "twice, never zero" } },
];

export const map: BuildMapStep[] = [{ cue: 22, part: 6, current: ["payment", "kafka"], units: { ecom: "webhooks next" } }];

// Written in the same transaction; then the relay's two queries.
export const code: CodeStep[] = [
  {
    cue: 16,
    file: "ecom/modules/payment/…/service/impl/PaymentEventOutbox.java",
    lines: [
      "/**",
      " * Writes each finished payment to the outbox. It runs while the payment is saved,",
      "     inside the same",
      " * transaction: the status and its event commit together or not at all.",
      " */",
      "@Component",
      "class PaymentEventOutbox {",
      "  …",
      "  @EventListener",
      "  void on(PaymentFinished finished) {",
      "    events.save(",
      "        PaymentEvent.of(",
      "            finished.eventId(),",
      "            finished.paymentId(),",
      "            finished.type(),",
      "            JsonMapper.shared().writeValueAsString(finished),",
      "            traceparent()));",
      "  }",
    ],
    at: [16, 17, null, 18, 19, 20, 21, null, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    small: true,
    beats: [{ cue: 17, highlight: [2, 3, 4] }, { cue: 18, highlight: [11, 12, 13] }],
  },
  {
    cue: 19,
    file: "ecom/modules/payment/…/repository/PaymentEventRepository.java",
    lines: [
      "          SELECT * FROM payment.payment_event",
      "          WHERE published_at IS NULL",
      "          ORDER BY seq",
      "          LIMIT :limit",
      "          FOR UPDATE SKIP LOCKED",
      "  …",
      "  @Query(",
      "      value = \"UPDATE payment.payment_event SET published_at = now()",
      "         WHERE id IN (:ids)\",",
      "      nativeQuery = true)",
      "  void markPublished(Collection<UUID> ids);",
    ],
    at: [20, 21, 22, 23, 24, null, 35, 36, null, 37, 38],
    small: true,
    highlight: [2, 3, 5],
    beats: [{ cue: 20, highlight: [8, 9, 11] }],
  },
];
