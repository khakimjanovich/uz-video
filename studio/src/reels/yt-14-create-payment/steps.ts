import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";
import { tableStep } from "../../series/build/tables";

// Episode 14: signed payment requests and idempotency.
// Code beats quote github.com/khakimjanovich/ecom (main).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["payment", "merchant", "vault"], built: B4 },
  { cue: 15, part: 4, current: ["payment", "buyer", "card"], built: B4 },
];

const PAIR = { merchant: [0, 1], payment: [2, 1] } as const;
// The setup chain a payment needs, in order; terminal and commission rule come in either order.
const CHAIN: DiagramStep<BuildId> = {
  cue: 1,
  layout: { mail: [0, 1], shop: [0, 0], checker: [1, 0], salespoint: [2, 0], tid: [3, 0], commission: [2, 1], keycloak: [3, 1], vault: [3, 2], merchant: [2, 2], payment: [1, 2] },
  edges: [
    { from: "mail", to: "shop", label: "email code" },
    { from: "shop", to: "checker" },
    { from: "checker", to: "salespoint" },
    { from: "salespoint", to: "tid" },
    { from: "salespoint", to: "commission" },
    { from: "tid", to: "keycloak" },
    { from: "commission", to: "keycloak" },
    { from: "keycloak", to: "vault" },
    { from: "vault", to: "merchant" },
    { from: "merchant", to: "payment" },
  ],
  packets: [
    { from: "mail", to: "shop", label: "1", delay: 81, duration: 25 },
    { from: "shop", to: "checker", label: "2", delay: 104, duration: 25 },
    { from: "checker", to: "salespoint", label: "3", delay: 180, duration: 25 },
    { from: "salespoint", to: "tid", label: "4", delay: 223, duration: 25 },
    { from: "salespoint", to: "commission", label: "4", delay: 258, duration: 25 },
    { from: "tid", to: "keycloak", label: "5", delay: 296, duration: 25 },
    { from: "commission", to: "keycloak", label: "5", delay: 296, duration: 25 },
    { from: "keycloak", to: "vault", label: "6", delay: 331, duration: 25 },
  ],
  badges: { shop: "1 · sign up", checker: "2 · two admins", salespoint: "3 · switched on", tid: "4 · either order", commission: "4 · either order", keycloak: "5 · API client", vault: "6 · signing key", merchant: "7 · creates payment" },
};
export const diagram: DiagramStep<BuildId>[] = [
  CHAIN,
  { cue: 2, layout: { ...PAIR }, edges: [{ from: "merchant", to: "payment", label: "POST /api/v1/payments" }], packets: [{ from: "merchant", to: "payment", label: "order · amount · return URL", delay: 15 }] },
  { cue: 3, layout: { ...PAIR, keycloak: [1, 0] }, edges: [{ from: "keycloak", to: "merchant", label: "token" }, { from: "merchant", to: "payment" }], badges: { merchant: "role: merchant" } },
  { cue: 4, layout: { ...PAIR, attacker: [0, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", label: "stolen token" }], danger: ["attacker"] },
  {
    cue: 5,
    layout: { merchant: [0, 0], toSign: [0, 2], hmac: [1.5, 2], signed: [3, 2], payment: [3, 0] },
    edges: [{ from: "merchant", to: "toSign", label: "builds" }, { from: "toSign", to: "hmac" }, { from: "hmac", to: "signed" }, { from: "signed", to: "payment" }],
    packets: [
      { from: "merchant", to: "toSign", label: "@method", delay: 35, duration: 20 },
      { from: "merchant", to: "toSign", label: "@target-uri", delay: 58, duration: 20 },
      { from: "merchant", to: "toSign", label: "authorization", delay: 80, duration: 20 },
      { from: "merchant", to: "toSign", label: "created · nonce", delay: 102, duration: 20 },
      { from: "merchant", to: "toSign", label: "content-digest", delay: 125, duration: 20 },
      { from: "toSign", to: "hmac", label: "+ secret key", delay: 160, duration: 20 },
      { from: "hmac", to: "signed", label: "Signature", delay: 185, duration: 20 },
    ],
  },
  {
    cue: 6,
    layout: { acquirer: [0, 0], vault: [2, 0], merchant: [0, 2], payment: [2, 2] },
    edges: [{ from: "acquirer", to: "vault", label: "puts the key" }, { from: "vault", to: "payment", label: "reads only" }, { from: "merchant", to: "payment", label: "signed request" }],
    packets: [{ from: "acquirer", to: "vault", label: "key", delay: 80, duration: 25 }, { from: "vault", to: "payment", label: "key", delay: 190, duration: 25 }],
    badges: { vault: "one key per API client", merchant: "same key" },
  },
  { cue: 8, layout: { ...PAIR, attacker: [0, 2], redis: [3, 2] }, edges: [{ from: "merchant", to: "payment" }, { from: "attacker", to: "payment", broken: true, label: "replay" }, { from: "payment", to: "redis", label: "nonce" }], packets: [{ from: "attacker", to: "payment", label: "same request", delay: 15, stopAt: 0.55 }], danger: ["attacker"] },
  {
    cue: 9,
    layout: { vault: [1.5, 0], merchant: [0, 1], attacker: [0, 2], payment: [1.5, 1], redis: [3, 1] },
    edges: [{ from: "vault", to: "payment", label: "key" }, { from: "merchant", to: "payment" }, { from: "attacker", to: "payment", broken: true }, { from: "payment", to: "redis", label: "spend nonce" }],
    packets: [
      { from: "merchant", to: "payment", label: "valid", delay: 10, duration: 25 },
      { from: "payment", to: "redis", label: "nonce", delay: 40, duration: 25 },
      { from: "attacker", to: "payment", label: "bad signature", delay: 95, stopAt: 0.55 },
    ],
    danger: ["attacker"],
    badges: { payment: "same HMAC?", redis: "only after a match" },
  },
  { cue: 10, layout: { ...PAIR, record: [3.0, 1] }, edges: [{ from: "merchant", to: "payment", label: "Idempotency-Key" }, { from: "payment", to: "record" }], packets: [{ from: "merchant", to: "payment", label: "key A", delay: 8 }, { from: "merchant", to: "payment", label: "key A (retry)", delay: 40 }], badges: { record: "one payment" } },
  { cue: 13, layout: { payment: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "payment", to: "salespoint", label: "payable + yours?" }], packets: [{ from: "payment", to: "salespoint", label: "check", delay: 15 }], badges: { payment: "no → refuse" } },
];

export const code: CodeStep[] = [
  {
    cue: 7,
    file: "platform/vault/…/SigningKeys.java · HmacAuthenticationFilter",
    lines: [
      "public Optional<byte[]> find(String clientId) {",
      "  …",
      "  var cached = cache.get(clientId);",
      "  if (cached != null && now.isBefore(cached.until()))",
      "    return Optional.of(cached.key().clone());",
      "  cache.remove(clientId);",
      "  var key = vault.get(path.formatted(clientId))",
      "      .map(secret -> secret.get(SIGNING_KEY))",
      "      .map(Base64.getDecoder()::decode);",
      "  key.ifPresent(bytes -> cache.put(clientId,",
      "      new Cached(bytes.clone(), now.plus(ttl))));",
      "  return key;",
      "}",
      "} catch (VaultUnavailableException e) {   // 503",
      "  throw new GeneralException(",
      "      PAYMENT_SIGNING_KEYS_UNAVAILABLE);",
    ],
    highlight: [4, 11, 14],
  },
  {
    cue: 11,
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
    cue: 12,
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
  tableStep(14, "payment.payment", 14),
];
