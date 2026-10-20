import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";
import { tableStep } from "../../series/build/tables";

// Episode 23: hardening, per-website limits that racing debits can't cross.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "partner"], built: [...B] },
  { cue: 11, part: 5, current: ["kubernetes"], built: [...B] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 4,
    layout: { buyer: [0, 1], payment: [2, 1], postgres: [3.2, 1] },
    edges: [{ from: "buyer", to: "payment", label: "5 × 20 000" }, { from: "payment", to: "postgres", label: "today: 60 000" }],
    packets: [0, 1, 2, 3, 4].map((k) => ({ from: "buyer" as const, to: "payment" as const, label: "pay", delay: 6 + k * 3, duration: 18 })),
    badges: { postgres: "limit 100 000" },
  },
  {
    cue: 10,
    layout: { admin: [0, 1], salespoint: [1.5, 1], merchant: [3, 1] },
    edges: [{ from: "admin", to: "salespoint", label: "edits" }, { from: "salespoint", to: "merchant", label: "sees" }],
    badges: { salespoint: "limits" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "modules/partner/…/entity/SalesPoint.java",
    lines: [
      "if (maxPaymentAmount != null && dailyLimit != null",
      "    && dailyLimit < maxPaymentAmount) {",
      "  throw new GeneralException(SALES_POINT_LIMITS_INVALID);",
      "}",
      "this.maxPaymentAmount = maxPaymentAmount;",
      "this.dailyLimit = dailyLimit;",
      "",
      "-- 014: CHECK (max_payment_amount IS NULL",
      "--   OR daily_limit IS NULL",
      "--   OR daily_limit >= max_payment_amount)",
    ],
    highlight: [2, 8, 10],
  },
  {
    cue: 3,
    file: "modules/payment/…/util/SalesPointUtils.java",
    lines: [
      "/** Whether one payment of this amount is within",
      " *  the website's limit. */",
      "public static boolean allowsAmount(",
      "    SalesPointResponse salesPoint, long amount) {",
      "  return salesPoint.getMaxPaymentAmount() == null",
      "      || amount <= salesPoint.getMaxPaymentAmount();",
      "}",
      "",
      "// PaymentServiceImpl · PaymentLinkServiceImpl",
      "if (!SalesPointUtils.allowsAmount(salesPoint,",
      "    request.getAmount())) {",
      "  throw new GeneralException(PAYMENT_AMOUNT_OVER_LIMIT,",
      "      salesPoint.getMaxPaymentAmount());",
      "}",
    ],
    highlight: [6, 10, 12],
  },
  {
    cue: 5,
    file: "modules/payment/…/repository/DailyVolumeRepository.java",
    lines: [
      "INSERT INTO payment.daily_volume AS v",
      "       (sales_point_id, business_day, amount)",
      "VALUES (:salesPointId, :day, :amount)",
      "ON CONFLICT (sales_point_id, business_day) DO UPDATE",
      "   SET amount = v.amount + excluded.amount",
      " WHERE v.amount + excluded.amount <= :limit",
      "",
      "-- 1: reserved · 0: the limit would be crossed",
    ],
    highlight: [5, 6],
  },
  {
    cue: 6,
    file: "modules/payment/…/service/impl/DailyLimits.java",
    lines: [
      "public void reserve(Payment payment,",
      "    SalesPointResponse salesPoint, Instant at) {",
      "  var limit = salesPoint.getDailyLimit();",
      "  if (limit == null) return;",
      "  if (payment.getAmount() > limit",
      "      || volumes.reserve(salesPoint.getId(), day(at),",
      "          payment.getAmount(), limit) != 1) {",
      "    throw new GeneralException(PAYMENT_DAILY_LIMIT_REACHED);",
      "  }",
      "}",
    ],
    highlight: [6, 7, 8],
  },
  {
    cue: 7,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "return transaction.execute(status -> {",
      "  var started = payments.findById(…).orElseThrow();",
      "  // Within the same transaction as the journal:",
      "  // both commit, or neither.",
      "  limits.reserve(started, salesPoint, Instant.now());",
      "  started.startDebit(live.getMerchantId(), …,",
      "      fee.getRuleId(), fee.getFee(), fee.getNet());",
      "  payments.save(started);",
      "  return operations.save(PaymentOperation.debit(started));",
      "});",
      "// a GeneralException here: FAILED, no scheme call",
    ],
    highlight: [5, 9, 11],
  },
  {
    cue: 8,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "switch (result.getOutcome()) {",
      "  case APPROVED -> settled.paid(",
      "      result.getProcessorRef(), result.getRrn());",
      "  case DECLINED -> {",
      "    settled.declined(result.getDeclineCode());",
      "    limits.release(settled, operation.getStartedAt());",
      "  }",
      "  case UNKNOWN -> settled.unknown(); // keeps its share",
      "}",
      "",
      "// PaymentReturnServiceImpl: a REVERSED payment",
      "// releases the debit's day too",
    ],
    highlight: [6, 8, 11],
  },
  {
    cue: 9,
    file: "modules/payment/…/service/impl/DailyLimits.java",
    lines: [
      "/** A website's daily limit, counted per business day",
      " *  in the settlement time zone. … */",
      "",
      "private LocalDate day(Instant at) {",
      "  return LocalDate.ofInstant(at,",
      "      properties.settlementZone());",
      "}",
      "",
      "# application.yaml · ecom.payment",
      "settlement-zone: Asia/Tashkent",
    ],
    highlight: [6, 10],
  },
  tableStep(1, "partner.sales_point", 23),
];
