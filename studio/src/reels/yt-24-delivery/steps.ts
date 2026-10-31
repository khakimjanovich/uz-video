import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 24: delivery, two Compose installs set up from Vault and OpenTofu.
// Code beats quote github.com/khakimjanovich/ecom-infra, cards-infra and ecom (main, v1.0.0).
export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["kubernetes"], built: builtBefore(5) },
  { cue: 14, part: 5, current: ["card"], built: [...builtBefore(5), "kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { card: [0.6, 1], app: [2.8, 1] },
    edges: [{ from: "app", to: "card", label: "calls" }],
    accent: ["card"],
    badges: { card: "1st", app: "2nd" },
  },
  {
    cue: 2,
    layout: { card: [0.3, 0.3], cardsVault: [0.3, 1.7], docker: [1.6, 1], app: [2.9, 0.3], vault: [2.9, 1.7] },
    edges: [
      { from: "docker", to: "card", label: "cards unit" },
      { from: "docker", to: "app", label: "ecom" },
    ],
    accent: ["docker"],
    badges: { docker: "× 2" },
  },
  {
    cue: 3,
    layout: { vault: [0.3, 1], app: [2.8, 0.2], keycloak: [2.8, 1], postgres: [2.8, 1.8] },
    edges: [
      { from: "vault", to: "app", label: "env vars" },
      { from: "vault", to: "keycloak" },
      { from: "vault", to: "postgres" },
    ],
    accent: ["vault"],
    badges: { vault: "secret/env" },
  },
  {
    cue: 5,
    layout: { keyholders: [0.3, 1], vault: [2.6, 1] },
    edges: [{ from: "keyholders", to: "vault", label: "unseal" }],
    packets: [0, 1, 2].map((k) => ({ from: "keyholders" as const, to: "vault" as const, label: `share ${k + 1}`, delay: 8 + k * 16, duration: 14 })),
    accent: ["keyholders"],
    badges: { vault: "3 of 5" },
  },
  {
    cue: 6,
    layout: { keyholders: [0, 1], vault: [1.6, 1], tofu: [3.2, 1] },
    edges: [
      { from: "keyholders", to: "vault", label: "unseal" },
      { from: "tofu", to: "vault", label: "root token" },
    ],
    accent: ["tofu"],
    badges: { tofu: "setup only", vault: "then revoked" },
  },
  {
    cue: 9,
    layout: { keycloak: [0.3, 1], admin: [2.8, 0.3], checker: [2.8, 1.7] },
    edges: [
      { from: "keycloak", to: "admin", label: "invite email" },
      { from: "keycloak", to: "checker", label: "invite email" },
    ],
    badges: { keycloak: "≥ 2 admins", admin: "own password", checker: "authenticator" },
  },
  {
    cue: 11,
    layout: { bankteam: [0.3, 1], card: [2.8, 0.3], app: [2.8, 1.7] },
    edges: [
      { from: "bankteam", to: "card", label: "v1.0.0" },
      { from: "bankteam", to: "app", label: "v1.0.0" },
    ],
    accent: ["bankteam"],
    badges: { bankteam: "owns the state" },
  },
  {
    cue: 12,
    layout: { zone: [0.4, 1], card: [2.6, 1] },
    edges: [{ from: "card", to: "zone", label: "delivered into" }],
    accent: ["card"],
    badges: { zone: "walls · guards · cameras", card: "the safe" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 4,
    file: "ecom-infra/docker-compose.yml",
    lines: [
      "app:",
      "  image: …/ecom-app:${ECOM_VERSION:?ECOM_VERSION is required}",
      "  # Every setting, its AppRole login to Vault included.",
      "  env_file: [{ path: .env.vault/app.env, required: true }]",
      "",
      "# stack.sh: secret/env/<service> → .env.vault/<service>.env",
      "secret/env/$path can't be read: not written yet, or the token",
      "  may not read it (README, \"Settings\")",
    ],
    highlight: [2, 4, 7],
  },
  {
    cue: 7,
    file: "ecom-infra/vault/tofu/main.tf · settings.tf",
    lines: [
      "encryption {",
      "  key_provider \"pbkdf2\" \"passphrase\" {",
      "    passphrase = var.state_passphrase",
      "  }",
      "  state {",
      "    method   = method.aes_gcm.state",
      "    enforced = true # never written unencrypted",
      "  }",
      "}",
      "resource \"random_password\" \"this\" {",
      "  for_each = toset([\"postgres\", \"keycloak-admin\", …])",
      "  length   = 32",
      "}",
      "resource \"tls_private_key\" \"cards\" { algorithm = \"RSA\" }",
    ],
    highlight: [3, 7, 10, 14],
  },
  {
    cue: 8,
    file: "ecom-infra/vault/tofu/settings.tf",
    lines: [
      "# Only what the environment alone knows, typed in once:",
      "# v kv put secret/input/ecom SMTP_HOST=… ADMIN_EMAILS=…",
      "",
      "precondition {",
      "  condition = alltrue([for k in [\"PULL_ATTEMPTS\",",
      "    \"PULL_RETRY_SECONDS\"] : can(regex(\"^[1-9][0-9]*$\", …))])",
      "  error_message = \"PULL_ATTEMPTS, PULL_RETRY_SECONDS: …\"",
      "}",
      "precondition {",
      "  condition = length(toset(local.admin_emails)) >= 2 && …",
      "  error_message = \"ADMIN_EMAILS: at least two different …\"",
      "}",
    ],
    highlight: [2, 7, 11],
  },
  {
    cue: 10,
    file: "ecom/.github/workflows/images.yml",
    lines: [
      "# every release tag vX.Y.Z as `X.Y.Z` (what production pins)",
      "- uses: docker/build-push-action@v7",
      "  with:",
      "    platforms: linux/amd64,linux/arm64",
      "    tags: ${{ steps.meta.outputs.tags }}",
      "    sbom: true",
      "    provenance: mode=max",
      "",
      "# ecom-infra/.env.local",
      "ECOM_VERSION=1.0.0",
      "FRONT_VERSION=1.0.0",
    ],
    highlight: [1, 4, 6, 7, 10],
  },
  {
    cue: 13,
    file: "cards-infra/docs/install-server.md",
    lines: [
      "# The cards unit: implementation guide",
      "",
      "## 2. What the zone must provide",
      "## 4. Install",
      "## 11. PCI DSS v4.0.1: who does what",
      "",
      "| Req. | Product (where)           | The bank            |",
      "| 3    | Card numbers sealed with  | Keyholder selection |",
      "|      | Vault Transit keys; Vault | and their           |",
      "|      | opens with three of five  | acknowledgement …   |",
      "|      | shares held by different… |                     |",
      "",
      "## 12. Known product gaps",
    ],
    highlight: [3, 4, 5],
  },
];
