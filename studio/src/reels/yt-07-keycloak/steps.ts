import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 07: Keycloak logins, roles and partner API clients.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["keycloak"], built: builtBefore(1) },
  { cue: 11, part: 1, current: ["partner"], built: builtBefore(1) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { attacker: [0, 1], partner: [2.5, 1] }, edges: [{ from: "attacker", to: "partner", label: "X-Admin-Id: aziz" }], danger: ["attacker"], badges: { partner: "believes it" } },
  {
    cue: 2,
    layout: { admin: [0, 0], shop: [0, 1], merchant: [0, 2], keycloak: [2.2, 1] },
    edges: [
      { from: "admin", to: "keycloak", label: "admin login" },
      { from: "shop", to: "keycloak", label: "partner login" },
      { from: "merchant", to: "keycloak", label: "API client" },
    ],
    accent: ["keycloak"],
  },
  {
    cue: 6,
    layout: { merchant: [0, 0], attacker: [0, 2], partner: [2.5, 1] },
    edges: [{ from: "merchant", to: "partner", label: "Bearer token" }, { from: "attacker", to: "partner", broken: true, label: "401" }],
    packets: [{ from: "merchant", to: "partner", label: "request", delay: 10 }, { from: "attacker", to: "partner", label: "request", delay: 30, stopAt: 0.5 }],
    danger: ["attacker"],
  },
  {
    cue: 9,
    layout: { merchant: [0, 1], keycloak: [1.5, 1], partner: [3, 1] },
    edges: [{ from: "partner", to: "keycloak", label: "create client" }, { from: "keycloak", to: "merchant" }],
    packets: [{ from: "keycloak", to: "merchant", label: "secret", delay: 20 }],
    badges: { keycloak: "shown once" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 3,
    file: "ecom-infra/keycloak/ecom-realm.json",
    lines: [
      '"realm": "ecom",',
      '"roles": { "realm": [',
      '  { "name": "admin", "description": "Bank staff" },',
      '  { "name": "partner",',
      '    "description": "A merchant with a verified email" },',
      '  { "name": "merchant", "description":',
      '    "A merchant\'s server (API client): creates payments" } ] },',
      '"clients": [',
      '  { "clientId": "ecom-backend", "publicClient": false },',
      '  { "clientId": "ecom-portal", "publicClient": true } ],',
      '"users": [',
      '  { "username": "aziz", "realmRoles": ["admin"] },',
      '  { "username": "malika", "realmRoles": ["admin"] } ]',
    ],
    highlight: [3, 4, 6],
  },
  {
    cue: 4,
    file: "modules/partner/…/service/impl/KeycloakIdentityService.java",
    lines: [
      "public String createUser(String email, String password) {",
      "  try {",
      "    return keycloak.createUser(email, email, password, false);",
      "  } catch (KeycloakConflictException e) {",
      "    throw new GeneralException(PARTNER_EMAIL_TAKEN, email);",
      "  }",
      "}",
      "",
      "// platform/keycloak · KeycloakAdmin.createUser",
      "var user = Map.of(USERNAME, username, EMAIL, email,",
      "    ENABLED, true, EMAIL_VERIFIED, emailVerified,",
      "    CREDENTIALS, List.of(Map.of(TYPE, PASSWORD,",
      "        VALUE, password, TEMPORARY, false)));",
      "keycloak.post().uri(USERS).body(user).retrieve() …;",
    ],
    highlight: [3, 12],
  },
  {
    cue: 5,
    file: "modules/partner/…/service/impl/KeycloakIdentityService.java",
    lines: [
      "public void confirmEmail(String userId) {",
      "  keycloak.markEmailVerified(userId);",
      "  keycloak.grantRealmRole(userId, PARTNER_ROLE);",
      "}",
    ],
    highlight: [2, 3],
  },
  {
    cue: 7,
    file: "app/src/main/resources/application.yaml",
    lines: [
      "ecom.security:",
      "  public-routes:",
      "    - POST /api/v1/registrations/**",
      "    - /actuator/health/**",
      "  roles:",
      '    "[/api/v1/admin/**]": ADMIN',
      '    "[/api/v1/partners/**]": ADMIN',
      '    "[/api/v1/partner/**]": PARTNER',
      '    "[/api/v1/payments/**]": MERCHANT',
      "",
      "// platform/security · SecurityAutoConfiguration",
      "properties.roles().forEach((route, role) ->",
      "    matcher(routes, route).hasRole(role));",
      "routes.anyRequest().denyAll();",
    ],
    highlight: [6, 9, 14],
  },
  {
    cue: 8,
    file: "platform/security/…/CurrentUser.java",
    lines: [
      "public static String name() {",
      "  return SecurityContextHolder.getContext()",
      "      .getAuthentication().getName();",
      "}",
      "",
      "// KeycloakJwtConverter: realm_access.roles → ROLE_*,",
      "// and the name is the token's preferred_username",
      "",
      "// GET /api/v1/admin/partners/{id}/history",
      '"VERIFIED by aziz"',
      '"ACTIVE by malika"',
    ],
    highlight: [3, 11],
  },
  {
    cue: 10,
    file: "modules/partner/…/service/impl/PartnerSelfServiceImpl.java",
    lines: [
      "public ApiClientSecretResponse rotateSecret(String email,",
      "    String clientId) {",
      "  var partner = active(email);",
      "  var client = clientRepository",
      "      .findByPartnerIdAndClientId(partner.getId(), clientId)",
      "      .orElseThrow(() -> new GeneralException(",
      "          API_CLIENT_NOT_FOUND, clientId));",
      "  var secret = identityService",
      "      .rotateSecret(client.getKeycloakId());",
      "  client.secretRotated();",
      "  return new ApiClientSecretResponse(clientId, secret);",
      "}",
    ],
    highlight: [9, 11],
  },
];
