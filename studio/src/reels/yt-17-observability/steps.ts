import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 17: observability.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra (main).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["observability"], built: B4 },
  { cue: 13, part: 4, current: ["temporal", "payment"], built: [...B4, "observability"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { buyer: [0, 1], payment: [1, 1], uzcardsvc: [2, 1], uzcard: [3, 1] },
    edges: [{ from: "buyer", to: "payment" }, { from: "payment", to: "uzcardsvc" }, { from: "uzcardsvc", to: "uzcard", label: "?" }],
    packets: [{ from: "payment", to: "uzcardsvc", label: "debit", delay: 10, stopAt: 0.9 }],
    danger: ["uzcard"],
    badges: { payment: "logs", uzcardsvc: "logs" },
  },
  {
    cue: 4,
    layout: { buyer: [0, 1], payment: [1, 1], uzcardsvc: [2, 1], uzcard: [3, 1] },
    edges: [{ from: "buyer", to: "payment", label: "/pay" }, { from: "payment", to: "uzcardsvc", label: "traceparent" }, { from: "uzcardsvc", to: "uzcard" }],
    packets: [
      { from: "buyer", to: "payment", label: "trace 4fdc…", delay: 6, duration: 16 },
      { from: "payment", to: "uzcardsvc", label: "trace 4fdc…", delay: 24, duration: 16 },
      { from: "uzcardsvc", to: "uzcard", label: "trace 4fdc…", delay: 42, duration: 16 },
    ],
    accent: ["payment", "uzcardsvc"],
    badges: { payment: "52 spans" },
  },
  {
    cue: 9,
    layout: { payment: [0, 0], uzcardsvc: [0, 2], otel: [1.5, 1], prometheus: [3, 0], tempo: [3, 1], loki: [3, 2] },
    edges: [
      { from: "payment", to: "otel", label: "OTLP" },
      { from: "uzcardsvc", to: "otel", label: "OTLP" },
      { from: "otel", to: "prometheus" },
      { from: "otel", to: "tempo" },
      { from: "otel", to: "loki" },
    ],
    packets: [
      { from: "payment", to: "otel", label: "metrics", delay: 6 },
      { from: "uzcardsvc", to: "otel", label: "traces", delay: 14 },
      { from: "otel", to: "loki", label: "logs", delay: 34 },
    ],
    accent: ["otel"],
  },
  {
    cue: 11,
    layout: { payment: [0, 1], uzcardsvc: [1.5, 1], uzcard: [3, 1], grafana: [1.5, 2.4] },
    edges: [{ from: "payment", to: "uzcardsvc", label: "504" }, { from: "uzcardsvc", to: "uzcard", broken: true, label: "no answer" }, { from: "payment", to: "grafana" }],
    packets: [{ from: "uzcardsvc", to: "uzcard", label: "debit", delay: 8, stopAt: 0.5 }],
    danger: ["uzcard"],
    badges: { grafana: "1 unknown · 504" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "ecom-infra/observability/agent.env",
    lines: [
      "# Run any ecom service with the OpenTelemetry Java agent:",
      "# traces, metrics and logs go to the observability service.",
      "JAVA_TOOL_OPTIONS=-javaagent:../ecom-infra/observability/",
      "    agent/opentelemetry-javaagent.jar",
      "OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318",
      "OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf",
      "OTEL_TRACES_SAMPLER=parentbased_always_on",
      "OTEL_INSTRUMENTATION_MICROMETER_ENABLED=true",
      "OTEL_METRIC_EXPORT_INTERVAL=10000",
      "",
      "# docker-compose.yml · otel-agent",
      "image: …/autoinstrumentation-java:2.30.0",
      'command: ["cp", "/javaagent.jar",',
      '          "/agent/opentelemetry-javaagent.jar"]',
    ],
    highlight: [3, 12],
  },
  {
    cue: 3,
    file: "Tempo · one payment, as the agent traced it",
    lines: [
      "ecom            POST /api/v1/pay/{token}/card",
      "ecom              SELECT payment.payment",
      "ecom              Session.find partner.SalesPoint",
      "ecom              Redis SET ecom:payment:page-lock:…",
      "ecom              POST  → uzcard-adapter",
      "uzcard-adapter      POST /v1/cards/new-otp",
      "uzcard-adapter        POST → SV-Gate",
      "ecom              INSERT card.card_binding",
      "",
      "// no tracing code in ecom: the agent did all of it",
    ],
    highlight: [4, 6, 7],
  },
  {
    cue: 5,
    file: "Loki · {service_name=\"ecom\"} |= \"has no answer\"",
    lines: [
      "WARN  Debit e76589a0-… has no answer:",
      "      HttpServerErrorException$GatewayTimeout: 504",
      '      "code":"UZCARD_ADAPTER_TIMEOUT"',
      "",
      "trace_id = 99dad7bd13440fe7150eb89a8d459f73   → Tempo",
    ],
    highlight: [5],
  },
  {
    cue: 6,
    file: "Prometheus · exported by the agent",
    lines: [
      "http_server_request_duration_seconds   per service, route, status",
      "http_client_request_duration_seconds   ecom → adapters",
      "db_client_connections_wait_time        per module pool",
      "jvm_cpu_recent_utilization_ratio · jvm_memory_used …",
      "",
      "ecom_payments_debits_total             ← the app's own",
      "ecom_payments_debit_duration_seconds   ← the app's own",
    ],
    highlight: [6, 7],
  },
  {
    cue: 7,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "/** Debits by scheme and outcome: approved, declined,",
      " *  unknown, or failed before any money moved. */",
      "private void count(String scheme, String outcome) {",
      "  Counter.builder(DEBITS_METRIC)      // ecom.payments.debits",
      "      .description(\"Debits by card scheme and outcome\")",
      "      .tag(SCHEME_TAG, scheme)",
      "      .tag(OUTCOME_TAG, outcome)",
      "      .register(meters)",
      "      .increment();",
      "}",
    ],
    highlight: [4, 6, 7],
  },
  {
    cue: 8,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "private static final Duration[] DEBIT_BUCKETS =",
      "    Stream.of(50, 100, 250, 500, 1_000, 2_500, 5_000,",
      "              10_000, 20_000, 40_000, 60_000)",
      "        .map(Duration::ofMillis).toArray(Duration[]::new);",
      "",
      "var call = Timer.start(meters);",
      "var result = cards.debit(…);",
      "call.stop(Timer.builder(DEBIT_DURATION_METRIC)",
      "    .tag(SCHEME_TAG, payment.getCardScheme())",
      "    .tag(OUTCOME_TAG, outcome)",
      "    // Fixed buckets travel to every backend;",
      "    // the scheme's own limit is 40 s.",
      "    .serviceLevelObjectives(DEBIT_BUCKETS)",
      "    .register(meters));",
    ],
    highlight: [3, 13],
  },
  {
    cue: 10,
    file: "ecom-infra/observability/dashboards/payments.json",
    lines: [
      "Debits per minute, by outcome",
      "  sum by (outcome) (rate(ecom_payments_debits_total[1m])) * 60",
      "Unknown debits, last hour            → red from 1",
      "  round(sum(increase(",
      "    ecom_payments_debits_total{outcome=\"unknown\"}[1h])))",
      "Scheme answer time p95, by scheme",
      "  histogram_quantile(0.95, sum by (le, scheme)",
      "    (rate(ecom_payments_debit_duration_seconds_bucket[5m])))",
      "Request time p95 · Server errors · Pool waits",
      "Warnings and errors, each linked to its trace",
    ],
    highlight: [3, 4],
  },
  {
    cue: 12,
    file: "ecom-infra/observability/agent.env · README.md",
    lines: [
      "# Every trace locally; production samples (e.g.",
      "# parentbased_traceidratio with OTEL_TRACES_SAMPLER_ARG=0.1).",
      "OTEL_TRACES_SAMPLER=parentbased_always_on",
      "",
      "The load stack runs without the agent,",
      "so k6 measures the code alone.",
    ],
    highlight: [3, 5],
  },
];
