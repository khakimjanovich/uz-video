import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";
import { tableStep } from "../../series/build/tables";

// Episode 16: the debit.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "terminal", "commission", "card"], built: B4 },
  { cue: 14, part: 4, current: ["observability"], built: B4 },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { buyer: [0, 1], payment: [2.5, 1] },
    edges: [{ from: "buyer", to: "payment", label: "confirm ×2" }],
    packets: [
      { from: "buyer", to: "payment", label: "confirm", delay: 8, duration: 18 },
      { from: "buyer", to: "payment", label: "confirm", delay: 12, duration: 18 },
    ],
    danger: ["payment"],
    badges: { payment: "debit twice?" },
  },
  {
    cue: 8,
    layout: { payment: [0, 1], card: [1, 1], uzcardsvc: [2, 1], uzcard: [3, 1] },
    edges: [{ from: "payment", to: "card", label: "debit" }, { from: "card", to: "uzcardsvc" }, { from: "uzcardsvc", to: "uzcard", label: "pay.purpose" }],
    packets: [
      { from: "payment", to: "card", label: "payment id", delay: 6, duration: 16 },
      { from: "card", to: "uzcardsvc", label: "token", delay: 24, duration: 16 },
      { from: "uzcardsvc", to: "uzcard", label: "ext = id", delay: 42, duration: 16 },
    ],
  },
  {
    cue: 11,
    layout: { payment: [0.5, 1], uzcard: [2.5, 1] },
    edges: [{ from: "payment", to: "uzcard", broken: true, label: "no answer" }],
    packets: [{ from: "payment", to: "uzcard", label: "debit", delay: 10, stopAt: 0.5 }],
    badges: { payment: "UNKNOWN" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "modules/payment/…/repository/PaymentRepository.java",
    lines: [
      "/** The debit's claim: of any number of callers,",
      " *  exactly one moves the payment and gets 1. */",
      "@Modifying",
      "@Query(\"\"\"",
      "    UPDATE Payment p SET p.status = DEBITING",
      "     WHERE p.id = :id AND p.status = CARD_CONFIRMED\"\"\")",
      "int claimDebit(UUID id);",
    ],
    highlight: [5, 6],
  },
  {
    cue: 3,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "public Payment debit(UUID paymentId) {",
      "  if (transaction.execute(status ->",
      "      payments.claimDebit(paymentId)) != 1) {",
      "    // someone else won the claim",
      "    return payment(paymentId);",
      "  }",
      "  var payment = payment(paymentId);",
      "  var operation = start(payment);",
      "  if (operation == null) return payment(paymentId);",
      "  …",
    ],
    highlight: [4, 5],
  },
  {
    cue: 4,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "var terminal = terminals",
      "    .forPayment(payment.getSalesPointId(),",
      "        payment.getCardScheme())",
      "    .orElseThrow(() -> new GeneralException(",
      "        PAYMENT_NO_ROUTE, payment.getCardScheme()));",
      "",
      "// the terminal module's public API",
      "Optional<TerminalView> forPayment(UUID salesPointId,",
      "    String scheme);",
      "record TerminalView(UUID id, String merchantId,",
      "    String terminalId) {}",
    ],
    highlight: [2, 10],
  },
  {
    cue: 5,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "var fee = commissions.quote(payment.getPartnerId(),",
      "    payment.getSalesPointId(), payment.getCardScheme(),",
      "    payment.getAmount(), Instant.now());",
      "…",
      "started.startDebit(terminal.merchantId(),",
      "    terminal.terminalId(), fee.ruleId(),",
      "    fee.fee(), fee.net());",
      "",
      "# payment.yaml · 005-add-debit",
      "CHECK (fee IS NULL OR (fee >= 0 AND fee + net = amount))",
    ],
    highlight: [1, 5, 10],
  },
  {
    cue: 6,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "/** Without a terminal, a fee rule or room in the daily",
      " *  limit the payment fails here, and no money moves. */",
      "private PaymentOperation start(Payment payment) {",
      "  try {",
      "    … terminal, fee, journal …",
      "  } catch (GeneralException e) {",
      "    change(payment.getId(),",
      "        failed -> failed.fail(e.getStatus().getType()));",
      "    return null;",
      "  }",
      "}",
    ],
    highlight: [1, 8],
  },
  {
    cue: 9,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "var result = cards.debit(payment.getCardToken(),",
      "    paymentId.toString(), // makes the call idempotent",
      "    operation.getAmount(),",
      "    operation.getMerchantId(),",
      "    operation.getTerminalId());",
      "",
      "operation.finish(result);",
      "switch (result.outcome()) {",
      "  case APPROVED -> settled.paid(",
      "      result.processorRef(), result.rrn());",
      "  case DECLINED -> { settled.declined(result.declineCode()); … }",
      "  case UNKNOWN -> settled.unknown();",
      "}",
    ],
    highlight: [9, 10],
  },
  {
    cue: 10,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "switch (result.outcome()) {",
      "  case APPROVED -> settled.paid(",
      "      result.processorRef(), result.rrn());",
      "  case DECLINED -> { settled.declined(result.declineCode()); … }",
      "  case UNKNOWN -> settled.unknown();",
      "}",
      "",
      "// e.g. CARD_INSUFFICIENT_FUNDS, CARD_EXPIRED,",
      "//      CARD_LIMIT_EXCEEDED",
    ],
    highlight: [4],
  },
  {
    cue: 12,
    file: "modules/payment/…/constant/PaymentStatus.java",
    lines: [
      "NEXT.put(CARD_CONFIRMED, EnumSet.of(DEBITING));",
      "NEXT.put(DEBITING, EnumSet.of(PAID, DECLINED, UNKNOWN,",
      "    FAILED, MANUAL_REVIEW));            // review → 18",
      "NEXT.put(UNKNOWN, EnumSet.of(PAID, DECLINED, MANUAL_REVIEW));",
      "NEXT.put(PAID, EnumSet.of(RETURNING));  // money back → 21",
      "NEXT.put(DECLINED, EnumSet.noneOf(PaymentStatus.class));",
      "NEXT.put(FAILED, EnumSet.noneOf(PaymentStatus.class));",
    ],
    highlight: [5, 6],
  },
  tableStep(7, "payment.payment_operation", 16),
  tableStep(13, "payment.payment", 16),
];
