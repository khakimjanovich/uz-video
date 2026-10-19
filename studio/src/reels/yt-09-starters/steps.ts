import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 09: security and the Keycloak admin client become platform libraries.
// Code beats quote github.com/khakimjanovich/ecom (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner", "keycloak"], built: builtBefore(1) },
  { cue: 10, part: 2, current: ["commission"], built: builtBefore(2) },
];

const TWO = { app: [0.5, 1], partner: [2.5, 1] } as const;
const HUB = { partner: [0, 0], commission: [0, 2], spring: [1.5, 1], keycloak: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...TWO, keycloak: [2.5, 2.2] }, edges: [{ from: "partner", to: "keycloak", label: "admin calls" }], badges: { app: "security rules", partner: "Keycloak calls" } },
  { cue: 2, layout: { partner: [0.5, 1], commission: [2.5, 1] }, badges: { partner: "security · Keycloak", commission: "a copy" }, danger: ["commission"] },
  {
    cue: 3,
    layout: { ...HUB },
    edges: [{ from: "partner", to: "spring" }, { from: "commission", to: "spring" }, { from: "spring", to: "keycloak" }],
    accent: ["spring"],
    badges: { spring: "platform/security · keycloak" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 4,
    file: "platform/security/…/SecurityAutoConfiguration.java",
    lines: [
      "return http.csrf(AbstractHttpConfigurer::disable)",
      "    .sessionManagement(… STATELESS)",
      "    .authorizeHttpRequests(routes -> {",
      "      properties.publicRoutes()",
      "          .forEach(r -> matcher(routes, r).permitAll());",
      "      properties.roles()",
      "          .forEach((route, role) -> matcher(routes, route)",
      "              .hasRole(role));",
      "      routes.anyRequest().denyAll();",
      "    })",
      "    .exceptionHandling(errors -> errors",
      "        .authenticationEntryPoint(problems)",
      "        .accessDeniedHandler(problems))",
      "    .oauth2ResourceServer(… KeycloakJwtConverter …)",
    ],
    highlight: [9, 12, 13],
  },
  {
    cue: 5,
    file: "app/src/main/resources/application.yaml",
    lines: [
      "ecom:",
      "  security:",
      "    public-routes:",
      "      - POST /api/v1/registrations/**",
      "      - /actuator/health/**",
      "      - /swagger-ui/**",
      "      - /openapi/**",
      "    roles:",
      '      "[/api/v1/admin/**]": ADMIN',
      '      "[/api/v1/partners/**]": ADMIN',
      '      "[/api/v1/partner/**]": PARTNER',
    ],
    highlight: [4, 9, 11],
  },
  {
    cue: 6,
    file: "platform/security/…/SecurityAutoConfiguration.java",
    lines: [
      "@AutoConfiguration(beforeName = {",
      "    BOOT_WEB_SECURITY,",
      "    BOOT_MANAGEMENT_SECURITY,",
      "    BOOT_RESOURCE_SERVER_SECURITY})",
      "@ConditionalOnWebApplication(type = SERVLET)",
      "@EnableConfigurationProperties(SecurityProperties.class)",
      "public class SecurityAutoConfiguration {",
      "",
      "  @Bean",
      "  @ConditionalOnMissingBean(SecurityFilterChain.class)",
      "  SecurityFilterChain apiSecurity(…) { … }",
      "}",
    ],
    highlight: [1, 10],
  },
  {
    cue: 7,
    file: "platform/keycloak/…/KeycloakAutoConfiguration.java",
    lines: [
      "var registration = ClientRegistration",
      "    .withRegistrationId(REGISTRATION_ID)",
      "    .clientId(keycloak.clientId())",
      "    .clientSecret(keycloak.clientSecret())",
      "    .authorizationGrantType(CLIENT_CREDENTIALS)",
      "    .tokenUri(keycloak.url() + TOKEN_PATH …)",
      "    .build();",
      "var login = new OAuth2ClientHttpRequestInterceptor(",
      "    new AuthorizedClientServiceOAuth2AuthorizedClientManager(",
      "        …));",
      "return new KeycloakAdmin(RestClient.builder()",
      "    .baseUrl(keycloak.url() + ADMIN_PATH …)",
      "    .requestInterceptor(login)",
      "    .build());",
    ],
    highlight: [5, 13],
  },
  {
    cue: 8,
    file: "modules/partner/…/service/impl/KeycloakIdentityService.java",
    lines: [
      "private final KeycloakAdmin keycloak;",
      "",
      "public String createUser(String email, String password) {",
      "  try {",
      "    return keycloak.createUser(email, email, password, false);",
      "  } catch (KeycloakConflictException e) {",
      "    throw new GeneralException(PARTNER_EMAIL_TAKEN, email);",
      "  }",
      "}",
      "",
      "public void confirmEmail(String userId) {",
      "  keycloak.markEmailVerified(userId);",
      "  keycloak.grantRealmRole(userId, PARTNER_ROLE);",
      "}",
    ],
    highlight: [5, 12, 13],
  },
  {
    cue: 9,
    file: "platform/versioning/libs.versions.toml",
    lines: [
      "[versions]",
      'ecom-platform = "0.1.0"',
      "",
      "[libraries]",
      'ecom-error = { module = "uz.heeypay.ecom:error", … }',
      'ecom-otp = { module = "uz.heeypay.ecom:otp", … }',
      'ecom-security = { module = "uz.heeypay.ecom:security", … }',
      'ecom-keycloak = { module = "uz.heeypay.ecom:keycloak", … }',
      "",
      "// modules/partner/build.gradle",
      "implementation libs.ecom.security",
      "implementation libs.ecom.keycloak",
    ],
    highlight: [2, 15, 16],
  },
];
