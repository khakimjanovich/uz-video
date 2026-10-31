import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 31: observability. One story carries it: a hospital wristband.
// Guesswork (cues 0–4), the wristband (5–6), the trace and its id (7–10), log masking (11–12),
// Grafana, dashboard and alerts (13–15), the code (16–20), the close (21–22).
const WARDS = { wristband: [0.4, 1], chart1: [2.6, 0], chart2: [2.6, 1], chart3: [2.6, 2] } as const;
const WARD_EDGES = (["chart1", "chart2", "chart3"] as const).map((to) => ({ from: "wristband" as const, to }));
const PATH = { payPage: [0, 1], app: [1, 1], card: [2, 1], network: [3, 1] } as const;
const PATH_EDGES = [{ from: "payPage", to: "app" }, { from: "app", to: "card" }, { from: "card", to: "network" }] as const;
const TRACE = { app: [0, 1], card: [1.5, 1], adapterA: [3, 1] } as const;
const TRACE_EDGES = [{ from: "app", to: "card" }, { from: "card", to: "adapterA" }] as const;
const RESPONSE = { merchant: [0.4, 1], app: [2.6, 1] } as const;
const MASK = { pan: [0.4, 1], masked: [2.6, 1] } as const;
const OWN = { app: [0.4, 0.3], card: [0.4, 1.7], grafana: [2.6, 0.3], grafana2: [2.6, 1.7] } as const;
const OWN_EDGES = [{ from: "app", to: "grafana" }, { from: "card", to: "grafana2" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // Guesswork.
  { cue: 0, layout: { merchant: [1.5, 1] } },
  { cue: 1, layout: { merchant: [1.5, 1] }, badges: { merchant: "spinning for a minute" } },
  { cue: 2, layout: PATH, edges: [...PATH_EDGES], packets: [{ from: "payPage", to: "app", label: "pay" }, { from: "app", to: "card", label: "debit", delay: 30 }, { from: "card", to: "network", label: "debit", delay: 60 }] },
  { cue: 3, layout: { laptop: [1.5, 1] }, danger: ["laptop"], badges: { laptop: "grep × 4" } },
  { cue: 4, layout: { logLine: [1.5, 1] }, danger: ["logLine"], badges: { logLine: "a card number?" } },
  // The wristband.
  { cue: 5, layout: WARDS, edges: WARD_EDGES },
  { cue: 6, layout: WARDS, edges: WARD_EDGES, accent: ["wristband"], badges: { chart1: "same number", chart2: "same number", chart3: "same number" } },
  // One trace, one id.
  { cue: 7, layout: TRACE, edges: [...TRACE_EDGES], packets: [{ from: "app", to: "card", label: "trace id" }, { from: "card", to: "adapterA", label: "trace id", delay: 45 }] },
  { cue: 8, layout: RESPONSE, edges: [{ from: "merchant", to: "app" }], packets: [{ from: "app", to: "merchant", label: "X-Request-Id" }], badges: { app: "even a 401" } },
  { cue: 9, layout: RESPONSE, edges: [{ from: "merchant", to: "app" }], badges: { merchant: "quote it to support" } },
  { cue: 10, layout: { app: [0.4, 1], logLine: [2.6, 1] }, edges: [{ from: "app", to: "logLine" }], badges: { logLine: "trace.id" } },
  // Log masking.
  { cue: 11, layout: MASK, edges: [{ from: "pan", to: "masked", label: "masking" }], accent: ["masked"] },
  { cue: 12, layout: MASK, edges: [{ from: "pan", to: "masked", label: "masking" }], badges: { masked: "tokens …1234 · secrets ***" } },
  // Each unit's own Grafana, a dashboard, alert rules.
  { cue: 13, layout: OWN, edges: [...OWN_EDGES], accent: ["grafana2"] },
  { cue: 14, layout: { grafana: [1.5, 1] }, badges: { grafana: "unknown in red" } },
  { cue: 15, layout: { grafana: [0.4, 1], mail: [2.6, 1] }, edges: [{ from: "grafana", to: "mail" }], packets: [{ from: "grafana", to: "mail", label: "alert" }], badges: { mail: "unknown too long" } },
  // The close.
  { cue: 21, layout: WARDS, edges: WARD_EDGES, accent: ["wristband"], badges: { wristband: "no secrets", chart2: "same number" } },
];

export const map: BuildMapStep[] = [{ cue: 22, part: 7, current: ["observability"], units: { ecom: "daily reports next" } }];

// The request's id, written before security; then the card-number mask.
export const code: CodeStep[] = [
  {
    cue: 16,
    file: "platform/observability/…/observability/RequestIdFilter.java",
    lines: [
      " * Every response names its request: the trace id, the same one on every",
      "     log line the request wrote,",
      " * in this service and in every service it called. A caller quotes it to",
      "     support. It runs right",
      " * after Boot's observation filter opens the span and before Spring",
      "     Security, so a 401 or 403",
      " * carries it too.",
      " */",
      "public class RequestIdFilter extends OncePerRequestFilter implements",
      "    Ordered {",
      "",
      "  public static final String REQUEST_ID_HEADER = \"X-Request-Id\";",
      "  …",
      "    var current = tracer.getIfAvailable();",
      "    var span = current == null ? null : current.currentSpan();",
      "    if (span != null) response.setHeader(REQUEST_ID_HEADER,",
      "        span.context().traceId());",
      "    chain.doFilter(request, response);",
    ],
    at: [14, null, 15, null, 16, null, 17, 18, 19, null, 20, 21, null, 38, 39, 40, null, 41],
    small: true,
    beats: [{ cue: 17, highlight: [5, 6, 7] }, { cue: 18, highlight: [14, 15, 16, 17] }],
  },
  {
    cue: 19,
    file: "platform/masking/…/masking/Masking.java",
    lines: [
      "  private static final Pattern DIGITS =",
      "      Pattern.compile(\"(?<!\\\\d)\\\\d{13,19}(?!\\\\d)\");",
      "  …",
      "  private static String card(String number) {",
      "    var digits = number.strip();",
      "    return digits.length() < 13",
      "        ? HIDDEN",
      "        : digits.substring(0, 6)",
      "            + \"*\".repeat(digits.length() - 10)",
      "            + digits.substring(digits.length() - 4);",
      "  }",
    ],
    at: [29, null, null, 175, 176, 177, 178, 179, 180, 181, 182],
    small: true,
    highlight: [8, 9, 10],
    beats: [{ cue: 20, highlight: [1, 2] }],
  },
];
