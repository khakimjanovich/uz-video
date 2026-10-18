import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 12: one port, two adapters.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra at tag ep-12.
export const map: BuildMapStep[] = [
  { cue: 0, part: 3, current: ["procport", "procsvc"], built: builtBefore(3) },
  { cue: 12, part: 3, current: ["card"], built: [...builtBefore(3), "procport", "procsvc"] },
];

const PORT = { payment: [0, 1], port: [1.5, 1], uzcard: [3, 0], humo: [3, 2] } as const;
const PORT_EDGES = [
  { from: "payment", to: "port" },
  { from: "port", to: "uzcard" },
  { from: "port", to: "humo" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { uzcard: [0.5, 1], humo: [2.5, 1] }, badges: { uzcard: "JSON-RPC", humo: "SOAP" } },
  { cue: 2, layout: { payment: [0.5, 1], uzcard: [2.5, 0], humo: [2.5, 2] }, edges: [{ from: "payment", to: "uzcard" }, { from: "payment", to: "humo" }], danger: ["payment"], badges: { payment: "knows both" } },
  {
    cue: 4,
    layout: { ...PORT },
    edges: [...PORT_EDGES],
    packets: [
      { from: "payment", to: "port", label: "debit", delay: 8, duration: 22 },
      { from: "port", to: "uzcard", label: "JSON-RPC", delay: 32, duration: 22 },
      { from: "port", to: "humo", label: "SOAP", delay: 32, duration: 22 },
    ],
    badges: { uzcard: "adapter", humo: "adapter" },
  },
  { cue: 8, layout: { port: [0.5, 1], humo: [2.5, 1] }, edges: [{ from: "port", to: "humo", broken: true, label: "no answer" }], packets: [{ from: "port", to: "humo", label: "debit", delay: 10, stopAt: 0.5 }], badges: { port: "UNKNOWN, not declined" } },
];

export const code: CodeStep[] = [
  {
    cue: 3,
    file: "modules/card/…/service/CardProcessor.java",
    lines: [
      "/** One port for every card scheme. */",
      "public interface CardProcessor {",
      "  CardScheme scheme();",
      "  String sendBindingCode(String pan, String expiry);",
      "  String confirmBinding(String session, String pan,",
      "      String code);",
      "  Result debit(Debit debit);",
      "  Result reverse(String paymentRef, String processorRef);",
      "  Result status(String paymentRef);",
      "}",
    ],
    highlight: [4, 7, 8, 9],
  },
  {
    cue: 5,
    file: "modules/card/…/service/impl/UzcardProcessor.java",
    lines: [
      "var tran = Map.<String, Object>of(",
      '    "purpose", PAYMENT_PURPOSE,',
      '    "cardId", debit.processorToken(),',
      '    "amount", debit.amount(),        // tiyin',
      '    "ext", debit.paymentRef(),       // our payment id',
      '    "merchantId", debit.merchantId(),',
      '    "terminalId", debit.terminalId());',
      "return transaction(svgate.call(TRANS_PAY_PURPOSE,",
      '    Map.of("tran", tran)));',
    ],
    highlight: [3, 5],
  },
  {
    cue: 6,
    file: "modules/card/…/service/impl/HumoProcessor.java",
    lines: [
      "var hold = paymentServer.send(holdXml(debit));",
      "var code = hold.detail(HUMO_CODE_ITEM);",
      "if (!HUMO_HOLD_ACTION.equals(hold.field(\"action\"))",
      "    || !HUMO_APPROVED.contains(code)) {",
      "  return Result.declined(",
      "      HUMO_DECLINES.getOrDefault(code, DECLINED));",
      "}",
      "var capture = paymentServer.send(",
      "    captureXml(hold.field(\"paymentID\")));",
      "return HUMO_APPROVED.contains(capture.detail(HUMO_CODE_ITEM))",
      "    ? Result.approved(hold.field(\"paymentID\"), rrn(hold))",
      "    : Result.unknown(); // held but not captured",
    ],
    highlight: [1, 8, 12],
  },
  {
    cue: 7,
    file: "modules/card/…/constant/CardConstantUtils.java",
    lines: [
      "public static final Map<String, String> UZCARD_DECLINES =",
      "    Map.of(\"51\", CARD_INSUFFICIENT_FUNDS,",
      "           \"54\", CARD_EXPIRED,",
      "           \"61\", CARD_LIMIT_EXCEEDED);",
      "",
      "public static final Map<String, String> HUMO_DECLINES =",
      "    Map.of(\"116\", CARD_INSUFFICIENT_FUNDS,",
      "           \"101\", CARD_EXPIRED,",
      "           \"121\", CARD_LIMIT_EXCEEDED);",
      "",
      "enum Outcome { APPROVED, DECLINED, UNKNOWN }",
    ],
    highlight: [2, 7, 11],
  },
  {
    cue: 9,
    file: "modules/card/…/service/impl/UzcardProcessor.java",
    lines: [
      "} catch (SchemeErrorException e) {",
      "  // We sent this payment before (a retry after a",
      "  // timeout): ask what happened instead of paying twice.",
      "  return e.getCode() == UZCARD_DUPLICATE   // -207",
      "      ? status(debit.paymentRef())          // trans.ext",
      "      : Result.unknown();",
      "} catch (ProcessorUnavailableException e) {",
      "  return Result.unknown();",
      "}",
    ],
    highlight: [4, 5],
  },
  {
    cue: 10,
    file: "ecom-infra/processing-sandbox/README.md",
    lines: [
      "| Card                | Code   | Outcome                |",
      "|---------------------|--------|------------------------|",
      "| 8600 1402 3456 7890 | 111111 | approved               |",
      "| 8600 1402 0000 0002 | 111111 | insufficient funds     |",
      "| 8600 1402 0000 0003 | 111111 | expired card           |",
      "| 8600 1402 0000 0009 | 111111 | no answer (timeout)    |",
      "| 9860 0901 0119 1238 | 660130 | approved               |",
      "| 9860 0901 0119 0002 | 660130 | insufficient funds     |",
      "| 9860 0901 0119 0009 | 660130 | no answer (timeout)    |",
      "",
      "# WireMock: /uzcard/api/jsonrpc · /humo/PaymentServer",
    ],
    highlight: [6, 9],
  },
  {
    cue: 11,
    file: "modules/card/src/integrationTest · real HTTP to the sandbox",
    lines: [
      "// UzcardProcessorIT",
      "@Test void aCardIsBoundWithTheCodeFromItsPhone()",
      "@Test void declinesReadTheSameWhateverTheScheme()",
      "@Test void noAnswerIsUnknownNeverADecline()",
      "@Test void aRetriedPaymentIsLookedUpNotPaidTwice()",
      "",
      "// HumoProcessorIT",
      "@Test void aDebitIsAHoldThenItsCapture()",
      "@Test void aHoldThatCantBeCapturedIsUnknown()",
      "@Test void statusFindsAFinishedPaymentByOurReference()",
      "",
      "// 14 tests · read timeout 1s in tests, 30s in config",
    ],
    highlight: [4, 5, 9],
  },
];
