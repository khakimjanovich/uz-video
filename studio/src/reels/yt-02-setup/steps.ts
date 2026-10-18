import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 02: the project, the platform libraries and the one-command environment.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra at tag ep-02.
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 15, part: 0, current: BUILD_PARTS[0].nodes },
];

const STACK = { java: [0.5, 1], spring: [1.5, 1], gradle: [2.5, 1] } as const;
const INFRA = { docker: [0, 0.5], postgres: [1, 0.5], redis: [2, 0.5], keycloak: [3, 0.5] } as const;
const UP = [
  { from: "docker", to: "postgres" },
  { from: "postgres", to: "redis" },
  { from: "redis", to: "keycloak" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { ...STACK }, accent: ["java", "spring", "gradle"], badges: { java: "25", spring: "4.1", gradle: "9.8" } },
  {
    cue: 8,
    layout: { spec: [0, 1], gradle: [1.5, 1], app: [3, 1] },
    edges: [
      { from: "spec", to: "gradle", label: "generate" },
      { from: "gradle", to: "app", label: "jar" },
    ],
    packets: [{ from: "gradle", to: "app", label: "partner-api.jar", delay: 20 }],
    badges: { app: "no generated code in source" },
  },
  {
    cue: 11,
    layout: { ...INFRA, vault: [1, 2], temporal: [2, 2], kafka: [3, 2] },
    edges: [...UP],
    badges: { vault: "later", temporal: "later", kafka: "later" },
  },
  {
    cue: 13,
    layout: { ...INFRA },
    edges: [...UP],
    packets: [
      { from: "docker", to: "postgres", label: "up", delay: 8, duration: 18 },
      { from: "postgres", to: "redis", label: "up", delay: 28, duration: 18 },
      { from: "redis", to: "keycloak", label: "up", delay: 48, duration: 18 },
    ],
    accent: ["postgres", "redis", "keycloak"],
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "ecom/settings.gradle.kts",
    lines: [
      'rootProject.name = "ecom"',
      "",
      "// One Spring Boot app, one Gradle module per bounded context.",
      'include("app")',
      'include("modules:partner", "modules:commission",',
      '        "modules:terminal", "modules:card", "modules:payment")',
      "",
      "dependencyResolutionManagement {",
      "    repositories { mavenLocal(); mavenCentral() }",
      '    versionCatalogs { create("libs") {',
      '        from("uz.heeypay.ecom:version-catalog:0.1.0") } }',
      "}",
    ],
    highlight: [4, 5, 6],
  },
  {
    cue: 3,
    file: "ecom-infra/postgres/init.sql",
    lines: [
      "-- One database, one schema per module, one user per module.",
      "FOREACH m IN ARRAY ARRAY['partner', 'commission',",
      "                         'terminal', 'card', 'payment'] LOOP",
      "  CREATE USER   {m}_user;",
      "  CREATE SCHEMA {m} AUTHORIZATION {m}_user;",
      "  ALTER ROLE    {m}_user SET search_path = {m};",
      "END LOOP;",
      "REVOKE ALL ON SCHEMA public FROM PUBLIC;",
    ],
    highlight: [4, 5],
  },
  {
    cue: 4,
    file: "ecom/app/src/test/…/ModularityTest.java",
    lines: [
      "/** Fails the build if one module reaches into",
      "    another module's internals. */",
      "class ModularityTest {",
      "",
      "  @Test",
      "  void modulesRespectTheirBoundaries() {",
      "    ApplicationModules.of(EcomApplication.class).verify();",
      "  }",
      "}",
    ],
    highlight: [7],
  },
  {
    cue: 5,
    file: "ecom/platform · published to ~/.m2",
    lines: [
      "platform/",
      "├── version-catalog/   every version, one libs.versions.toml",
      "├── openapi/           specs → generated API jars",
      "└── error-starter/     one error format for every module",
      "",
      "./gradlew -p platform/version-catalog publishToMavenLocal",
      "./gradlew -p platform/openapi publishToMavenLocal",
      "./gradlew -p platform/error-starter publishToMavenLocal",
    ],
    highlight: [2, 3, 4],
  },
  {
    cue: 6,
    file: "ecom/platform/version-catalog/libs.versions.toml",
    lines: [
      "# Every version in one place.",
      "[versions]",
      'java = "25"',
      'spring-boot = "4.1.1"',
      'spring-modulith = "2.1.1"',
      'openapi-generator = "7.14.0"',
      'springdoc = "3.1.1"',
      'lombok = "1.18.48"',
    ],
    highlight: [3, 4],
  },
  {
    cue: 7,
    file: "ecom/platform/error-starter/…/ApiException.java",
    lines: [
      "public class ApiException extends ErrorResponseException {",
      "  public ApiException(HttpStatusCode status,",
      "                      String code, String detail) {",
      "    super(status, problem(status, code, detail), null);",
      "  }",
      "}",
      "",
      "// HTTP 404 · application/problem+json",
      '{ "status": 404, "title": "Not Found",',
      '  "detail": "No partner 0000…",',
      '  "code": "PARTNER_NOT_FOUND" }',
    ],
    highlight: [11],
  },
  {
    cue: 9,
    file: "ecom/modules/<module>/ · the same layers everywhere",
    lines: [
      "uz.heeypay.ecom.<module>",
      "├── controller/      implements the generated *Api",
      "├── service/         interfaces",
      "│   └── impl/        the business logic",
      "├── repository/      Spring Data JPA",
      "├── entity/          tables and their rules",
      "├── mapper/          entity ↔ API models",
      "├── constant/        *ConstantUtils, error codes, bean names",
      "├── property/        typed configuration",
      "└── config/          the module's own datasource",
    ],
    highlight: [8],
  },
  {
    cue: 10,
    file: "ecom-infra/docker-compose.yml",
    lines: [
      "name: ecom",
      "services:",
      "  postgres:",
      "    image: postgres:17.6-alpine",
      '    ports: ["5442:5432"]',
      "  redis:",
      "    image: redis:8.2-alpine",
      "  keycloak:",
      "    image: quay.io/keycloak/keycloak:26.4.0",
    ],
    highlight: [4, 7, 9],
  },
  {
    cue: 12,
    file: "ecom/app/src/main/resources/application.yaml",
    lines: [
      "# Structured JSON logs in the ECS format.",
      "logging:",
      "  structured:",
      "    format:",
      "      console: ecs",
      "",
      "management:",
      "  endpoints.web.exposure.include: health",
    ],
    highlight: [5, 8],
  },
  {
    cue: 14,
    file: "tests · three places, three jobs",
    lines: [
      "ecom/",
      "├── src/test/             unit tests",
      "└── src/integrationTest/  real Postgres",
      "",
      "ecom-k6-testing/          Grafana k6",
      "├── smoke/health.js",
      "└── <area>/…              one folder per area",
      "",
      "./gradlew test             unit only",
      "./gradlew check            unit + integration",
    ],
    highlight: [2, 3, 5],
  },
];
