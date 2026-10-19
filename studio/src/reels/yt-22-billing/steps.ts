import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 22: daily reports, built each night per website and business day.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant"], built: [...B] },
  { cue: 10, part: 4, current: ["payment", "admin"], built: [...B] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { payment: [0, 1], postgres: [1.5, 1], merchant: [3, 1] },
    edges: [{ from: "payment", to: "postgres", label: "00:30 · yesterday" }, { from: "postgres", to: "merchant", label: "daily_report" }],
    packets: [{ from: "payment", to: "postgres", label: "add up", delay: 8 }, { from: "postgres", to: "merchant", label: "payout", delay: 36 }],
    badges: { merchant: "how much do I get?" },
  },
  {
    cue: 9,
    layout: { merchant: [0.5, 1], payment: [2.5, 1] },
    edges: [{ from: "payment", to: "merchant", label: "reports · CSV" }],
    packets: [{ from: "payment", to: "merchant", label: "payments-2026-01-15.csv", delay: 10 }],
    badges: { merchant: "payout −" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "modules/payment/…/service/impl/PaymentReportServiceImpl.java",
    lines: [
      "/** A business day runs from midnight to midnight in the",
      " *  settlement time zone, the same day that decides",
      " *  reversal or refund. */",
      "public int build(LocalDate day) {",
      "  return reports.build(day, start(day),",
      "      start(day.plusDays(1)));",
      "}",
      "",
      "private Instant start(LocalDate day) {",
      "  return day.atStartOfDay(",
      "      properties.settlementZone()).toInstant();",
      "}",
    ],
    highlight: [5, 10, 11],
  },
  {
    cue: 3,
    file: "modules/payment/…/repository/DailyReportRepository.java",
    lines: [
      "WITH moved AS (",
      "  SELECT sales_point_id, partner_id, amount, fee, net,",
      "    (paid_at >= :from AND paid_at < :to",
      "       AND status <> 'REVERSED') AS paid,",
      "    (status = 'REFUNDED'",
      "       AND returned_at >= :from AND returned_at < :to)",
      "       AS refunded",
      "  FROM payment.payment",
      "  WHERE (paid_at >= :from AND paid_at < :to)",
      "     OR (returned_at >= :from AND returned_at < :to))",
    ],
    highlight: [4, 5, 6],
  },
  {
    cue: 4,
    file: "modules/payment/…/repository/DailyReportRepository.java",
    lines: [
      "SELECT :day, sales_point_id, partner_id,",
      "  count(*) FILTER (WHERE paid),",
      "  coalesce(sum(amount) FILTER (WHERE paid), 0),",
      "  coalesce(sum(fee) FILTER (WHERE paid), 0),",
      "  coalesce(sum(net) FILTER (WHERE paid), 0),",
      "  count(*) FILTER (WHERE refunded),",
      "  coalesce(sum(amount) FILTER (WHERE refunded), 0),",
      "  coalesce(sum(net) FILTER (WHERE paid), 0)",
      "    - coalesce(sum(amount) FILTER (WHERE refunded), 0),",
      "  now()",
      "FROM moved WHERE paid OR refunded",
      "GROUP BY sales_point_id, partner_id",
    ],
    highlight: [8, 9],
  },
  {
    cue: 5,
    file: "modules/payment/…/repository/DailyReportRepository.java",
    lines: [
      "INSERT INTO payment.daily_report AS r (…)",
      "SELECT …",
      "ON CONFLICT (business_day, sales_point_id) DO UPDATE SET",
      "  paid_count = excluded.paid_count,",
      "  paid_amount = excluded.paid_amount,",
      "  …",
      "  payout = excluded.payout,",
      "  built_at = excluded.built_at",
      "",
      "-- 010: PRIMARY KEY (business_day, sales_point_id)",
    ],
    highlight: [3, 10],
  },
  {
    cue: 6,
    file: "modules/payment/…/service/impl/PaymentReportJob.java",
    lines: [
      "@Scheduled(cron = REPORT_CRON, zone = SETTLEMENT_ZONE)",
      "void buildYesterday() {",
      "  var yesterday = LocalDate.now(zone).minusDays(1);",
      "  for (var back = properties.reportDays() - 1;",
      "      back >= 0; back--) {",
      "    reports.build(yesterday.minusDays(back));",
      "  }",
      "}",
      "",
      "# application.yaml · ecom.payment",
      "report-cron: \"0 30 0 * * *\"",
      "report-days: 3",
    ],
    highlight: [1, 6, 12],
  },
  {
    cue: 7,
    file: "modules/payment/…/service/impl/PaymentReportServiceImpl.java",
    lines: [
      "/** A payment paid that day, or a refund made that day:",
      " *  a refund takes the whole amount back. */",
      "return Stream.of(",
      "    paid ? \"PAYMENT\" : \"REFUND\",",
      "    payment.getId(), payment.getOrderId(), website,",
      "    paid ? payment.getAmount() : -payment.getAmount(),",
      "    paid ? payment.getFee() : 0,",
      "    paid ? payment.getNet() : -payment.getAmount(),",
      "    payment.getCardMask(), payment.getRrn(),",
      "    paid ? payment.getPaidAt() : payment.getReturnedAt())",
      "  …",
    ],
    highlight: [4, 6, 8],
  },
  {
    cue: 8,
    file: "modules/payment/…/service/impl/PaymentReportServiceImpl.java",
    lines: [
      "/** Every cell quoted, quotes doubled: a website's",
      " *  name may hold commas or quotes. */",
      "private static String cell(Object value) {",
      "  return value == null ? \"\"",
      "      : \"\\\"\" + value.toString().replace(\"\\\"\", \"\\\"\\\"\") + \"\\\"\";",
      "}",
      "",
      "kind,payment_id,order_id,website,amount,fee,net,card,rrn,at",
      "\"REFUND\",\"7f3a…\",\"o-1\",\"Aziza, Shoes\",\"-100000\",\"0\",…",
    ],
    highlight: [5, 9],
  },
];
