import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 19: API clients. One story carries it: the cleaner's own key.
// A password in a server's settings (cues 0–4), the cleaner's key (5–6), the API client and its secret (7–12),
// rotation (13–14), what ecom keeps and what the portal says (15–18), the check (19–22), the close (23–24).
const KEYS = { ownerKey: [0.6, 1], cleanerKey: [2.4, 1] } as const;
const CLIENT = { merchant: [0, 1], apiClient: [1.5, 1], keycloak: [3, 1] } as const;
const CLIENT_EDGES = [{ from: "merchant", to: "apiClient", label: "create" }, { from: "apiClient", to: "keycloak" }] as const;
const TOKEN = { merchant: [0.2, 1.7], keycloak: [1.5, 0.3], payment: [2.8, 1.7] } as const;
const TOKEN_EDGES = [{ from: "merchant", to: "keycloak" }, { from: "merchant", to: "payment" }] as const;
const ROTATE = { apiClient: [0.4, 1], secret: [2.6, 0.3], secret2: [2.6, 1.7] } as const;
const ROTATE_EDGES = [{ from: "apiClient", to: "secret" }, { from: "apiClient", to: "secret2", label: "rotate" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // A person's password in a server's settings.
  { cue: 0, layout: { merchant: [1.5, 1] } },
  { cue: 1, layout: { laptop: [0.4, 1], config: [2.6, 1] }, edges: [{ from: "laptop", to: "config" }], packets: [{ from: "laptop", to: "config", label: "portal password" }] },
  { cue: 2, layout: { config: [0.4, 1], repo: [2.6, 1] }, edges: [{ from: "config", to: "repo", label: "git push" }], danger: ["repo"], badges: { repo: "password inside" } },
  { cue: 3, layout: { config: [0.4, 1], admin: [2.6, 1] }, edges: [{ from: "config", to: "admin" }], danger: ["admin"], badges: { admin: "owner: change login" } },
  { cue: 4, layout: { merchant: [0.4, 1], payment: [2.6, 1] }, edges: [{ from: "merchant", to: "payment" }], packets: [{ from: "merchant", to: "payment", label: "request" }], badges: { payment: "looks like the owner" } },
  // The cleaner's own key.
  { cue: 5, layout: KEYS, danger: ["ownerKey"] },
  { cue: 6, layout: KEYS, accent: ["cleanerKey"], badges: { cleanerKey: "changed alone" } },
  // The API client and its secret.
  { cue: 7, layout: CLIENT, edges: [...CLIENT_EDGES], accent: ["apiClient"], badges: { keycloak: "role: merchant" } },
  { cue: 8, layout: CLIENT, edges: [...CLIENT_EDGES], badges: { merchant: "active only", keycloak: "role: merchant" } },
  { cue: 9, layout: { apiClient: [0.4, 1], secret: [2.6, 1] }, edges: [{ from: "apiClient", to: "secret" }], accent: ["secret"], badges: { secret: "shown once" } },
  {
    cue: 10,
    layout: { apiClient: [0.4, 0.3], secret: [0.4, 1.7], postgres: [2.6, 1] },
    edges: [{ from: "apiClient", to: "postgres", label: "client id" }],
    crossed: ["secret"],
    badges: { postgres: "id only" },
  },
  {
    cue: 11,
    layout: TOKEN,
    edges: [...TOKEN_EDGES],
    packets: [{ from: "merchant", to: "keycloak", label: "id + secret" }, { from: "keycloak", to: "merchant", label: "token", delay: 45 }],
  },
  { cue: 12, layout: TOKEN, edges: [...TOKEN_EDGES], packets: [{ from: "merchant", to: "payment", label: "token" }], badges: { payment: "merchant role only" } },
  // Rotation.
  { cue: 13, layout: ROTATE, edges: [...ROTATE_EDGES], danger: ["secret"], badges: { secret: "leaked?" } },
  { cue: 14, layout: ROTATE, edges: [...ROTATE_EDGES], crossed: ["secret"], accent: ["secret2"], badges: { secret: "stops at once" } },
  // The close.
  { cue: 23, layout: KEYS, accent: ["cleanerKey"], badges: { cleanerKey: "changed", ownerKey: "untouched" } },
];

export const map: BuildMapStep[] = [{ cue: 24, part: 4, current: ["partner", "merchant"], units: { ecom: "merchant users next" } }];

// What ecom keeps, what the portal says, then the check (the token URL is the laptop's, from the ecom README).
export const code: CodeStep[] = [
  {
    cue: 15,
    file: "ecom/modules/partner/…/db/changelog/partner.yaml",
    lines: [
      "            tableName: partner_client",
      "            columns:",
      "              - column: { name: id, type: uuid, constraints: { primaryKey: true } }",
      "              - column:",
      "                  name: partner_id",
      "                  …",
      "              - column: { name: client_id, type: varchar(64),",
      "                   constraints: { nullable: false, unique: true, … } }",
      "              - column: { name: keycloak_id, type: varchar(64),",
      "                   constraints: { nullable: false } }",
      "              - column: { name: created_at, type: timestamptz,",
      "                   constraints: { nullable: false } }",
      "              - column: { name: secret_rotated_at, type: timestamptz }",
    ],
    at: [84, 85, 86, 87, 88, null, 91, null, 92, null, 93, null, 94],
    small: true,
    beats: [{ cue: 16, highlight: [7, 9, 13] }],
  },
  {
    cue: 17,
    file: "ecom-front/src/i18n/en.json",
    lines: [
      "    \"rotate\": \"Rotate secret\",",
      "    \"rotateTitle\": \"Rotate the secret?\",",
      "    \"rotateText\": \"The current secret stops working immediately.",
      "       Update your servers right after.\",",
      "    …",
      "    \"onceWarning\": \"This is the only time you will see this secret.",
      "       Store it in your server's secret manager now.\",",
    ],
    at: [152, 153, 154, null, null, 157, null],
    small: true,
    highlight: [6, 7],
    beats: [{ cue: 18, highlight: [3, 4] }],
  },
  {
    cue: 19,
    file: "terminal · laptop",
    lines: [
      "$ TOKEN_URL=http://localhost:8180/realms/ecom/protocol/openid-connect/token",
      "$ curl -s -d grant_type=client_credentials -d client_id=$CID \\",
      "    --data-urlencode client_secret=$SECRET $TOKEN_URL | jq -r .token_type",
      "Bearer",
      "# the portal: Rotate secret",
      "$ curl -s -d grant_type=client_credentials -d client_id=$CID \\",
      "    --data-urlencode client_secret=$SECRET $TOKEN_URL",
      "{\"error\":\"unauthorized_client\",",
      " \"error_description\":\"Invalid client or Invalid client credentials\"}",
    ],
    small: true,
    upTo: 1,
    beats: [{ cue: 20, upTo: 4, highlight: [4] }, { cue: 21, upTo: 7, highlight: [5] }, { cue: 22, highlight: [8, 9] }],
  },
];
