import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 20: payment links, and closing pages nobody paid in time.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B = [...builtBefore(4), "observability", "temporal", "kafka"] as const;
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant"], built: [...B] },
  { cue: 12, part: 4, current: ["payment", "buyer"], built: [...B] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { merchant: [0, 1], payment: [1.5, 0.3], buyer: [3, 1] },
    edges: [{ from: "merchant", to: "payment", label: "new link" }, { from: "merchant", to: "buyer", label: "any chat" }],
    packets: [
      { from: "merchant", to: "payment", label: "250 000 · shoes", delay: 6 },
      { from: "merchant", to: "buyer", label: "pay/7Qx…", delay: 36 },
    ],
    accent: ["payment"],
  },
  {
    cue: 2,
    layout: { buyer: [0, 1], payment: [1.5, 1], uzcard: [3, 1] },
    edges: [{ from: "buyer", to: "payment", label: "same page" }, { from: "payment", to: "uzcard", label: "same debit" }],
    packets: [
      { from: "buyer", to: "payment", label: "card · code", delay: 8 },
      { from: "payment", to: "uzcard", label: "debit", delay: 34 },
    ],
  },
  {
    cue: 7,
    layout: { buyer: [0.5, 1], payment: [2.5, 1] },
    edges: [{ from: "buyer", to: "payment", label: "card · code" }],
    packets: [{ from: "buyer", to: "payment", label: "111111", delay: 10 }],
    badges: { payment: "PAID", buyer: "no shop to return to" },
  },
  {
    cue: 11,
    layout: { merchant: [0.5, 1], payment: [2.5, 1] },
    edges: [{ from: "payment", to: "merchant", label: "my links" }],
    badges: { merchant: "waiting · paid · expired" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 3,
    file: "modules/payment/…/entity/Payment.java",
    lines: [
      "/** A payment link: no API client and no return address;",
      " *  the order number is made up for it, and its page works",
      " *  for as long as the merchant chose. */",
      "public static Payment link(UUID partnerId, UUID salesPointId,",
      "    String orderId, long amount, String description,",
      "    String pageTokenHash, Instant pageExpiresAt) {",
      "  var payment = create(partnerId, salesPointId,",
      "      null, orderId, amount, description,",
      "      null, pageTokenHash, pageExpiresAt);",
      "  payment.source = PaymentSource.LINK;",
      "  return payment;",
      "}",
    ],
    highlight: [8, 9, 10],
  },
  {
    cue: 4,
    file: "modules/payment/…/service/impl/PaymentLinkServiceImpl.java",
    lines: [
      "// Someone else's website, or one that is off:",
      "// the same answer, and nothing is saved.",
      "var salesPoint = partner.listSalesPointsOwnedBy(email)",
      "    .stream()",
      "    .filter(view -> view.getId().equals(",
      "        request.getSalesPointId()))",
      "    .findFirst()",
      "    .flatMap(view -> partner",
      "        .findPayableSalesPoint(view.getId())",
      "        .stream().findFirst())",
      "    .orElseThrow(() -> new GeneralException(",
      "        PAYMENT_SALES_POINT_NOT_PAYABLE));",
    ],
    highlight: [3, 7, 10],
  },
  {
    cue: 5,
    file: "modules/payment/…/service/impl/PaymentLinkServiceImpl.java",
    lines: [
      "var validFor = Duration.ofHours(",
      "    request.getValidForHours());",
      "if (validFor.compareTo(properties.linkMaxTtl()) > 0) {",
      "  throw new GeneralException(PAYMENT_LINK_TOO_LONG,",
      "      properties.linkMaxTtl().toHours());",
      "}",
      "",
      "# application.yaml · ecom.payment",
      "link-max-ttl: 7d",
    ],
    highlight: [3, 9],
  },
  {
    cue: 6,
    file: "modules/payment/…/util/PageTokenUtils.java",
    lines: [
      "/** The payment page's one-time token: random,",
      " *  sent once, stored only as its hash. */",
      "public static String newToken() {",
      "  return random(PAGE_TOKEN_BYTES);   // 32 bytes",
      "}",
      "",
      "public static String hash(String token) {",
      "  return SignatureUtils.sha256Hex(",
      "      token.getBytes(US_ASCII));",
      "}",
      "",
      "// PaymentLinkServiceImpl",
      "return mapper.toLinkResponse(payment)",
      "    .url(properties.pageUrl() + token);  // only here",
    ],
    highlight: [4, 8, 14],
  },
  {
    cue: 8,
    file: "modules/payment/…/service/impl/PaymentExpirySweeper.java",
    lines: [
      "@Scheduled(fixedDelayString = EXPIRY_SWEEP_DELAY)",
      "void sweep() {",
      "  Integer closed;",
      "  do {",
      "    closed = transaction.execute(status -> closeBatch());",
      "  } while (closed != null && closed == EXPIRY_BATCH);",
      "}",
      "",
      "# application.yaml · ecom.payment",
      "expiry-sweep-delay: 1m",
    ],
    highlight: [1, 10],
  },
  {
    cue: 9,
    file: "modules/payment/…/repository/PaymentRepository.java",
    lines: [
      "SELECT * FROM payment.payment",
      "WHERE status IN ('CREATED', 'AWAITING_CODE')",
      "  AND page_expires_at <= :now",
      "ORDER BY page_expires_at",
      "LIMIT :limit",
      "FOR UPDATE SKIP LOCKED",
      "",
      "-- 008: CREATE INDEX ix_payment_open_expiry",
      "--   ON payment.payment (page_expires_at)",
      "--   WHERE status IN ('CREATED', 'AWAITING_CODE')",
    ],
    highlight: [2, 6, 8],
  },
  {
    cue: 10,
    file: "modules/payment/…/entity/Payment.java",
    lines: [
      "/** Nobody paid in time: the page is closed for good. */",
      "public void expire() {",
      "  requireNext(PaymentStatus.EXPIRED);",
      "  status = PaymentStatus.EXPIRED;",
      "  finished();          // the event, into the outbox",
      "}",
      "",
      "// PaymentStatus",
      "NEXT.put(CREATED, EnumSet.of(AWAITING_CODE, FAILED, EXPIRED));",
      "NEXT.put(EXPIRED, EnumSet.noneOf(PaymentStatus.class));",
    ],
    highlight: [5, 10],
  },
];
