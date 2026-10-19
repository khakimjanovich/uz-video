import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

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
  { cue: 12, layout: { ...PAIR }, edges: [{ from: "payment", to: "merchant" }], packets: [{ from: "payment", to: "merchant", label: "paymentUrl", delay: 15 }], accent: ["payment"], badges: { payment: "hash only" } },
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
      "public static boolean matches(byte[] key, String text,",
      "    String signature) {",
      "  return signature != null && MessageDigest.isEqual(",
      "      sign(key, text).getBytes(US_ASCII),",
      "      signature.getBytes(US_ASCII));",
      "}",
    ],
    highlight: [4, 11],
  },
  {
    cue: 5,
    file: "modules/partner/…/service/impl/VaultSigningKeyService.java",
    lines: [
      "/** Signing keys in Vault under merchants/<client id>, put",
      " *  there by the bank (e.g. vault kv put",
      " *  secret/merchants/<client id> signingKey=<base64>).",
      " *  If Vault is down, nothing passes. */",
      "public Optional<byte[]> find(String clientId) {",
      "  try {",
      "    return vault.get(path(clientId))",
      "        .map(secret -> secret.get(SIGNING_KEY))",
      "        .map(Base64.getDecoder()::decode);",
      "  } catch (VaultUnavailableException e) {",
      "    throw unavailable();",
      "  }",
      "}",
    ],
    highlight: [2, 3, 7, 11],
  },
  {
    cue: 7,
    file: "modules/payment/…/filter/HmacAuthenticationFilter.java",
    lines: [
      "if (!fresh(timestamp))",
      "  throw unauthorized(PAYMENT_TIMESTAMP_OUT_OF_WINDOW);",
      "",
      "var signed = signedText(method, path, timestamp, nonce,",
      "    sha256Hex(request.body()));",
      "var key = apiClients.signingKey(clientId)",
      "    .orElseThrow(() ->",
      "        unauthorized(PAYMENT_SIGNATURE_INVALID));",
      "if (!matches(key, signed, signature))",
      "  throw unauthorized(PAYMENT_SIGNATURE_INVALID);",
      "",
      "// only now: SET NX ecom:hmac:nonce:<client>:<nonce>",
      "if (!spendNonce(clientId, nonce))",
      "  throw unauthorized(PAYMENT_NONCE_REUSED);",
    ],
    highlight: [9, 12, 13],
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
      "  return transaction.execute(s -> createOnce(key, hash, req));",
      "} catch (DataIntegrityViolationException raced) {",
      "  // A concurrent request won: with the same key the retry",
      "  // replays its answer.",
      "  try {",
      "    return transaction.execute(s -> createOnce(key, hash, req));",
      "  } catch (DataIntegrityViolationException e) {",
      "    if (!violates(e, ORDER_UNIQUE)) throw e;",
      "    throw new GeneralException(",
      "        PAYMENT_ORDER_EXISTS, request.getOrderId());",
      "  }",
      "}",
    ],
    highlight: [3, 4, 7],
  },
];
