import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { tableStep } from "../../series/build/tables";
import { BuildId } from "../../series/build/nodes";

// Episode 19: the transactional outbox, Kafka, and merchant webhooks signed the Standard Webhooks way.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B = [...builtBefore(4), "observability", "temporal"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["kafka", "payment"], built: [...B] },
  { cue: 14, part: 4, current: ["payment", "buyer"], built: [...B, "kafka"] },
];

const PIPE = { payment: [0, 1], outbox: [1, 1], kafka: [2, 1], webhook: [3, 1] } as const;
const PIPE_EDGES = [
  { from: "payment", to: "outbox" },
  { from: "outbox", to: "kafka", label: "relay" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { payment: [0.5, 1], kafka: [2.5, 1] },
    edges: [{ from: "payment", to: "kafka", broken: true, label: "crash" }],
    packets: [{ from: "payment", to: "kafka", label: "paid", delay: 12, stopAt: 0.5 }],
    danger: ["kafka"],
  },
  {
    cue: 7,
    layout: { ...PIPE },
    edges: [...PIPE_EDGES, { from: "kafka", to: "webhook" }],
    packets: [
      { from: "kafka", to: "webhook", label: "event 7f3a", delay: 6 },
      { from: "kafka", to: "webhook", label: "event 7f3a", delay: 34 },
    ],
    badges: { webhook: "seen: drop" },
  },
  {
    cue: 9,
    layout: { kafka: [0, 0.4], payment: [1, 0.4], vault: [1, 1.8], hmac: [2, 1.1], webhook: [3, 1.1] },
    edges: [
      { from: "kafka", to: "payment", label: "event" },
      { from: "payment", to: "hmac", label: "body" },
      { from: "vault", to: "hmac", label: "client key" },
      { from: "hmac", to: "webhook", label: "POST" },
    ],
    packets: [{ from: "hmac", to: "webhook", label: "webhook-id · webhook-timestamp · v1,…", delay: 14, duration: 30 }],
    accent: ["hmac"],
    badges: { webhook: "Standard Webhooks" },
  },
  {
    cue: 13,
    layout: { postgres: [0.5, 1], kafka: [2.5, 1] },
    edges: [{ from: "postgres", to: "kafka", label: "outbox" }],
    badges: { postgres: "the truth", kafka: "the news" },
  },
];

export const code: CodeStep[] = [
  tableStep(2, "payment.payment_event", 19),
  {
    cue: 3,
    file: "modules/payment/…/entity/Payment.java",
    lines: [
      "public void paid(String processorRef, String rrn) {",
      "  requireNext(PaymentStatus.PAID);",
      "  status = PaymentStatus.PAID;",
      "  …",
      "  finished();   // also declined, fail, sendToReview",
      "}",
      "",
      "private void finished() {",
      "  events.add(new PaymentFinished(UUID.randomUUID(),",
      "      id, orderId, status, amount, fee, net, rrn, …));",
      "}",
      "",
      "@DomainEvents",
      "List<PaymentFinished> events() { … }",
    ],
    highlight: [5, 9, 13],
  },
  {
    cue: 4,
    file: "modules/payment/…/service/impl/PaymentEventOutbox.java",
    lines: [
      "/** Runs while the payment is saved, inside the same",
      " *  transaction: the status and its event commit",
      " *  together or not at all. */",
      "@EventListener",
      "void on(PaymentFinished finished) {",
      "  events.save(PaymentEvent.of(",
      "      finished.eventId(),",
      "      finished.paymentId(),",
      "      EVENT_TYPE.formatted(status),  // payment.paid …",
      "      JsonMapper.shared()",
      "          .writeValueAsString(finished)));",
      "}",
    ],
    highlight: [2, 4, 6],
  },
  {
    cue: 5,
    file: "modules/payment/…/repository/PaymentEventRepository.java",
    lines: [
      "SELECT * FROM payment.payment_event",
      "WHERE published_at IS NULL",
      "ORDER BY created_at",
      "LIMIT :limit",
      "FOR UPDATE SKIP LOCKED",
      "",
      "# properties/payment.yaml · ecom.payment.events",
      "relay-delay: 1s",
      "relay-batch: 100",
    ],
    highlight: [2, 5, 8],
  },
  {
    cue: 6,
    file: "modules/payment/…/service/impl/PaymentEventRelay.java",
    lines: [
      "var batch = events.lockUnpublished(properties.relayBatch());",
      "for (var event : batch) {",
      "  sends.add(kafka.send(topic,",
      "      event.getPaymentId().toString(),  // the key",
      "      event.getPayload()));",
      "}",
      "allOf(sends).join();          // Kafka has them all",
      "batch.forEach(PaymentEvent::published);",
      "",
      "# spring.kafka.producer: acks: all",
    ],
    highlight: [4, 7, 8],
  },
  {
    cue: 8,
    file: "modules/partner/…/entity/SalesPoint.java",
    lines: [
      "public void replaceWebhook(String url, List<String> testHosts) {",
      "  if (url == null || url.isBlank()) {",
      "    webhookUrl = null;          // no webhooks",
      "    return;",
      "  }",
      "  var host = hostOf(url);",
      "  var site = hostOf(websiteUrl);",
      "  var own = url.startsWith(\"https://\")",
      "      && (host.equals(site) || host.endsWith(\".\" + site));",
      "  if (!own && !testHosts.contains(host)) {",
      "    throw new GeneralException(",
      "        SALES_POINT_WEBHOOK_URL_FOREIGN, url, site);",
      "  }",
      "  webhookUrl = url;",
      "}",
    ],
    highlight: [8, 9, 12],
  },
  {
    cue: 10,
    file: "modules/payment/…/config/PaymentEventsConfig.java",
    lines: [
      "var backOff = new ExponentialBackOffWithMaxRetries(",
      "    properties.retries());                // 5",
      "backOff.setInitialInterval(firstRetry);  // 1s",
      "backOff.setMultiplier(2);",
      "backOff.setMaxInterval(maxRetry);        // 30s",
      "",
      "var deadLetter = new DeadLetterPublishingRecoverer(",
      "    kafka, (record, e) -> new TopicPartition(",
      "        record.topic() + \".DLT\", record.partition()));",
      "return new DefaultErrorHandler(deadLetter, backOff);",
    ],
    highlight: [2, 4, 9],
  },
  {
    cue: 11,
    file: "modules/payment/…/config/PaymentEventsConfig.java",
    lines: [
      "@Bean",
      "NewTopic paymentEventsDeadLetter(EventProperties p) {",
      "  return TopicBuilder",
      "      .name(p.topic() + \".DLT\")   // payments.events.DLT",
      "      .partitions(p.partitions())",
      "      .build();",
      "}",
      "",
      "// what retries couldn't deliver waits here,",
      "// on the same partition, for a person",
    ],
    highlight: [4],
  },
  tableStep(12, "payment.webhook_delivery", 19),
];
