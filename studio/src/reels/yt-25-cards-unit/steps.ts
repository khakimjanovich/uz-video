import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 25: the cards unit, the card zone that shares nothing with ecom.
// Code beats quote cards, cards-infra and ecom (main).
const CARD_ZONE = ["frame", "card", "adapters", "cardsinfra"] as const;

export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: [...CARD_ZONE], built: builtBefore(5) },
  { cue: 18, part: 5, current: [...CARD_ZONE, "procport"], built: builtBefore(5) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { card: [1.5, 1] }, accent: ["card"], badges: { card: "PCI DSS scope" } },
  {
    cue: 2,
    layout: { frame: [0.5, 0.3], card: [1.5, 1], uzcardsvc: [2.5, 0.3], humosvc: [2.5, 1.7] },
    edges: [{ from: "frame", to: "card" }, { from: "card", to: "uzcardsvc" }, { from: "card", to: "humosvc" }],
    accent: ["frame", "uzcardsvc", "humosvc"],
    badges: { card: "cards unit" },
  },
  {
    cue: 3,
    layout: { app: [0, 1], card: [2.5, 1] },
    edges: [{ from: "app", to: "card", label: "token only" }],
    packets: [{ from: "card", to: "app", label: "ctk_… · 860031******1234", delay: 10, duration: 40 }],
    badges: { app: "out of scope", card: "PCI DSS scope" },
  },
  {
    cue: 4,
    layout: { app: [0, 1], vault: [0, 0], keycloak: [0, 2], card: [3, 1], cardsVault: [3, 0], cardsKeycloak: [3, 2], cardsPostgres: [2, 1], postgres: [1, 1] },
    edges: [{ from: "app", to: "postgres" }, { from: "card", to: "cardsPostgres" }],
    badges: { app: "ecom", card: "cards" },
  },
  {
    cue: 6,
    layout: { app: [0, 0.4], mobile: [0, 1.6], card: [2.5, 1] },
    edges: [{ from: "app", to: "card", label: "mTLS" }, { from: "mobile", to: "card", label: "mTLS" }],
    accent: ["mobile"],
    badges: { mobile: "inputs only" },
  },
  {
    cue: 9,
    layout: { buyer: [0, 0.3], app: [0, 1.7], ingress: [1.4, 0.3], partnerdoor: [1.4, 1.7], card: [3, 1] },
    edges: [{ from: "buyer", to: "ingress" }, { from: "ingress", to: "card" }, { from: "app", to: "partnerdoor" }, { from: "partnerdoor", to: "card" }],
    accent: ["ingress", "partnerdoor"],
  },
  {
    cue: 10,
    layout: { buyer: [0, 1], ingress: [1.5, 1], frame: [3, 0.3], card: [3, 1.7] },
    edges: [{ from: "buyer", to: "ingress" }, { from: "ingress", to: "frame", label: "frame + two files" }, { from: "ingress", to: "card", label: "card · code" }],
    packets: [{ from: "buyer", to: "ingress", label: "GET /admin", delay: 30, stopAt: 0.8 }],
    badges: { ingress: "else 404" },
  },
  {
    cue: 11,
    layout: { app: [0, 1], partnerdoor: [1.5, 1], card: [3, 1] },
    edges: [{ from: "app", to: "partnerdoor", label: "sealed" }, { from: "partnerdoor", to: "card" }],
    packets: [{ from: "app", to: "partnerdoor", label: "SNI card-vault.cards.internal", delay: 20, duration: 120 }],
  },
  {
    cue: 12,
    layout: { app: [0, 1], partnerdoor: [1.4, 1], card: [3, 0.2], uzcardsvc: [3, 1], cardsKeycloak: [3, 1.8] },
    edges: [{ from: "app", to: "partnerdoor" }, { from: "partnerdoor", to: "card", label: "unopened" }, { from: "partnerdoor", to: "uzcardsvc" }, { from: "partnerdoor", to: "cardsKeycloak" }],
    packets: [{ from: "partnerdoor", to: "card", label: "sealed", delay: 15, duration: 30 }],
    accent: ["partnerdoor"],
  },
  {
    cue: 13,
    layout: { app: [0, 1], cardsVault: [3, 1] },
    edges: [{ from: "app", to: "cardsVault", label: "passport office" }],
    badges: { cardsVault: "cards CA" },
  },
  {
    cue: 14,
    layout: { app: [0, 1], cardsVault: [3, 1] },
    edges: [{ from: "app", to: "cardsVault" }],
    packets: [{ from: "app", to: "cardsVault", label: "CSR", delay: 40, duration: 60 }],
    badges: { app: "private key stays", cardsVault: "cards CA" },
  },
  {
    cue: 15,
    layout: { app: [0, 1], cardsVault: [3, 1] },
    edges: [{ from: "app", to: "cardsVault" }],
    packets: [
      { from: "cardsVault", to: "app", label: "certificate", delay: 40, duration: 50 },
      { from: "cardsVault", to: "app", label: "cards CA", delay: 110, duration: 50 },
      { from: "cardsVault", to: "app", label: "one secret", delay: 180, duration: 50 },
    ],
    accent: ["app"],
    badges: { cardsVault: "signed" },
  },
  {
    cue: 17,
    layout: { buyer: [0, 1], ingress: [1.4, 1], card: [3, 1] },
    edges: [{ from: "buyer", to: "ingress" }, { from: "ingress", to: "card" }],
    packets: [0, 1, 2].map((k) => ({ from: "ingress" as const, to: "card" as const, label: "wrong code", delay: 8 + k * 22, duration: 18, stopAt: k === 2 ? 0.8 : 1 })),
    danger: ["buyer"],
    badges: { card: "VELOCITY_LIMITED · 429" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 5,
    file: "cards-infra/vault/tofu/settings.tf",
    lines: [
      "# Who may call this unit, per environment: CARD_VAULT_CALLERS",
      "# the card API, SCHEME_CALLERS the adapters' operations",
      "# without a card number. Each listed caller gets a client in",
      "# realm services and may have its certificate request signed.",
      "card_vault_callers = toset([for c in split(\",\",",
      "  local.input[\"CARD_VAULT_CALLERS\"]) : trimspace(c)])",
      "scheme_callers     = toset([for c in split(\",\",",
      "  local.input[\"SCHEME_CALLERS\"]) : trimspace(c)])",
      "callers = setunion(local.card_vault_callers,",
      "  local.scheme_callers)",
    ],
    highlight: [5, 7, 9],
  },
  {
    cue: 7,
    file: "ecom/app/src/main/resources/properties/cards.yaml",
    lines: [
      "card:",
      "  base-url: ${CARDS_URL}",
      "  ssl: { bundle: cards-client }",
      "…",
      "# ecom's client certificate (signed by the cards unit's CA),",
      "# and the CA the cards unit's certificates come from.",
      "cards-client:",
      "  keystore:",
      "    certificate: ${CARDS_CLIENT_CERTIFICATE}",
      "    private-key: ${CARDS_CLIENT_PRIVATE_KEY}",
      "  truststore:",
      "    certificate: ${CARDS_TRUSTED_CAS}",
      "…",
      "client-secret: ${CARDS_CLIENT_SECRET}",
    ],
    highlight: [2, 9, 12, 14],
  },
  {
    cue: 8,
    file: "cards/card-vault/.../properties/platform/security.yaml",
    lines: [
      "# application.yaml: server.ssl.client-auth: need",
      "platform:",
      "  security:",
      "    issuers:",
      "      # The cards unit's own Keycloak. No other is trusted.",
      "      - uri: ${CARDS_ISSUER_URI}",
      "        clients: ${CARDS_CALLER_CLIENTS}",
      "    roles:",
      "      \"[/internal/v1/card-entry-sessions]\": CARDS.BIND",
      "      \"[GET /internal/v1/cards/*]\": CARDS.READ",
      "      \"[/internal/v1/cards/*/debit]\": CARDS.DEBIT",
      "      \"[/internal/v1/bins/resolve]\": BINS.RESOLVE",
    ],
    highlight: [1, 6, 7],
  },
  {
    cue: 12,
    file: "cards-infra/partner/nginx.conf",
    lines: [
      "# It never opens a connection: it reads only the name",
      "# the caller asks for (TLS SNI) and passes the",
      "# still-encrypted connection to that service.",
      "map $ssl_preread_server_name $service {",
      "  card-vault.cards.internal     card-vault:8093;",
      "  uzcard-adapter.cards.internal uzcard-adapter:8091;",
      "  humo-adapter.cards.internal   humo-adapter:8092;",
      "  cards-keycloak.cards.internal cards-keycloak:8443;",
      "  default 127.0.0.1:1; # nothing listens: refused",
      "}",
      "server { listen 8443; ssl_preread on; proxy_pass $service; }",
    ],
    highlight: [4, 9, 11],
  },
  {
    cue: 16,
    file: "cards/card-vault/.../properties/card.yaml",
    lines: [
      "# Each calling client's settings come from the",
      "# environment as a list, with no default:",
      "#   CARDS_CALLERS_<n>_CLIENT_ID",
      "#   CARDS_CALLERS_<n>_ORIGINS",
      "#   CARDS_CALLERS_<n>_SESSION_TTL",
      "#   CARDS_CALLERS_<n>_CARD_ATTEMPTS",
      "#   CARDS_CALLERS_<n>_CODE_ATTEMPTS",
      "#   CARDS_CALLERS_<n>_VELOCITY_{CARD,BIN,ADDRESS,REFERENCE}",
      "#                            _{LIMIT,WINDOW}",
      "payer-address-header: ${CARDS_PAYER_ADDRESS_HEADER}",
      "velocity-card-codes: ${CARDS_VELOCITY_CARD_CODES}",
    ],
    highlight: [4, 5, 8],
  },
];
