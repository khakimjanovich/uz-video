import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";
import { tableStep } from "../../series/build/tables";

// Episode 14: signed payment requests and idempotency.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant", "vault"], built: B4 },
  { cue: 13, part: 4, current: ["payment", "buyer", "card"], built: B4 },
];

const PAIR = { merchant: [0, 1], payment: [2, 1] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...PAIR }, edges: [{ from: "merchant", to: "payment", label: "POST /api/v1/payments" }], packets: [{ from: "merchant", to: "payment", label: "order · amount · return URL", delay: 15 }] },
  { cue: 2, layout: { ...PAIR, keycloak: [1, 0] }, edges: [{ from: "keycloak", to: "merchant", label: "token" }, { from: "merchant", to: "payment" }], badges: { merchant: "role: merchant" } },
  { cue: 3, layout: { ...PAIR, attacker: [0, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", label: "stolen token" }], danger: ["attacker"] },
  { cue: 6, layout: { ...PAIR, attacker: [0, 2], redis: [3, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", broken: true, label: "replay" }, { from: "payment", to: "redis", label: "nonce" }], packets: [{ from: "attacker", to: "payment", label: "same request", delay: 15, stopAt: 0.55 }], danger: ["attacker"] },
  { cue: 8, layout: { ...PAIR, record: [3.0, 1] }, edges: [{ from: "merchant", to: "payment", label: "Idempotency-Key" }, { from: "payment", to: "record" }], packets: [{ from: "merchant", to: "payment", label: "key A", delay: 8 }, { from: "merchant", to: "payment", label: "key A (retry)", delay: 40 }], badges: { record: "one payment" } },
  { cue: 11, layout: { payment: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "payment", to: "salespoint", label: "payable + yours?" }], packets: [{ from: "payment", to: "salespoint", label: "check", delay: 15 }], badges: { payment: "no → refuse" } },
];

export const code: CodeStep[] = [
  {
    cue: 4,
    file: "modules/payment/…/util/SignatureUtils.java",
    lines: [
      "/** METHOD\\nPATH\\nTIMESTAMP\\nNONCE\\nhex(sha256(body)) */",
      "public static String signedText(String method, String path,",
      "    String timestamp, String nonce, String bodyHash) {",
      '  return String.join("\\n", method, path, timestamp, nonce,',
      "      bodyHash);",
      "}",
      "",
      "/** Constant time: timing can't reveal how much matched. */",
      "public static boolean matches(byte[] key,",
      "    String signedText, String signature) {",
      "  return signature != null && MessageDigest.isEqual(",
      "      sign(key, signedText).getBytes(US_ASCII),",
      "      signature.getBytes(US_ASCII));",
      "}",
    ],
    highlight: [4, 11],
  },
  {
    cue: 5,
    file: "platform/vault/…/SigningKeys.java",
    lines: [
      "/** Each merchant API client's request-signing key, put",
      " *  into Vault by the bank under merchants/<client id>",
      " *  (e.g. vault kv put secret/merchants/<client id>",
      " *  signingKey=<base64>). The app never creates or",
      " *  shows one. */",
      "public Optional<byte[]> find(String clientId) {",
      "  return vault",
      "      .get(SIGNING_KEY_PATH.formatted(clientId))",
      "      .map(secret -> secret.get(SIGNING_KEY))",
      "      .map(Base64.getDecoder()::decode);",
      "}",
      '// SIGNING_KEY_PATH = "merchants/%s"',
    ],
    highlight: [2, 4, 8],
  },
  {
    cue: 7,
    file: "modules/payment/…/filter/HmacAuthenticationFilter.java",
    lines: [
      "if (!fresh(timestamp))",
      "  throw unauthorized(PAYMENT_TIMESTAMP_OUT_OF_WINDOW);",
      "",
      "var signed = signedText(request.getMethod(), path,",
      "    timestamp, nonce, bodyHash);",
      "var key = signingKey(clientId) // signingKeys.find",
      "    .orElseThrow(() ->",
      "        unauthorized(PAYMENT_SIGNATURE_INVALID));",
      "if (!matches(key, signed, signature)) {",
      "  throw unauthorized(PAYMENT_SIGNATURE_INVALID);",
      "}",
      "",
      "// only now: SET NX ecom:hmac:nonce:<client>:<nonce>",
      "if (!spendNonce(clientId, nonce))",
      "  throw unauthorized(PAYMENT_NONCE_REUSED);",
    ],
    highlight: [9, 13, 14],
  },
  {
    cue: 9,
    file: "modules/payment/…/service/impl/PaymentServiceImpl.java",
    lines: [
      "var earlier = idempotency.findById(key); // (client, key)",
      "if (earlier.isPresent()) {",
      "  if (!earlier.get().getRequestHash().equals(requestHash)) {",
      "    throw new GeneralException(",
      "        PAYMENT_IDEMPOTENCY_KEY_REUSED);",
      "  }",
      "  return new Created(",
      "      JSON.readValue(earlier.get().getResponse(),",
      "          PaymentResponse.class),",
      "      true);                    // Idempotent-Replayed: true",
      "}",
    ],
    highlight: [3, 7, 10],
  },
  {
    cue: 10,
    file: "modules/payment/…/service/impl/PaymentServiceImpl.java",
    lines: [
      "try {",
      "  return transaction.execute(",
      "      status -> createOnce(key, requestHash, request));",
      "} catch (DataIntegrityViolationException raced) {",
      "  // A concurrent request won: with the same key the retry",
      "  // replays its answer.",
      "  try {",
      "    return transaction.execute(",
      "        status -> createOnce(key, requestHash, request));",
      "  } catch (DataIntegrityViolationException e) {",
      "    if (!violates(e, ORDER_UNIQUE)) throw e;",
      "    throw new GeneralException(",
      "        PAYMENT_ORDER_EXISTS, request.getOrderId());",
      "  }",
      "}",
    ],
    highlight: [4, 5, 9],
  },
  tableStep(12, "payment.payment", 14),
];
