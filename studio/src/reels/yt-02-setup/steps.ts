import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 02: the project, the platform libraries, the separate services and the one-command environment.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 15, part: 0, current: BUILD_PARTS[0].nodes },
];

const INFRA = { docker: [0.5, 0.5], postgres: [1.5, 0.5], redis: [2.5, 0.5] } as const;
const UP = [
  { from: "docker", to: "postgres" },
  { from: "postgres", to: "redis" },
] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { java: [0.5, 1], spring: [1.5, 1], gradle: [2.5, 1] }, accent: ["java", "spring", "gradle"], badges: { java: "25", spring: "4.1", gradle: "9.8 · Groovy" } },
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
    layout: { ...INFRA, keycloak: [0.5, 2], vault: [1.5, 2], kafka: [2.5, 2] },
    edges: [...UP],
    badges: { keycloak: "later", vault: "later", kafka: "later" },
  },
  {
    cue: 13,
    layout: { ...INFRA },
    edges: [...UP],
    packets: [
      { from: "docker", to: "postgres", label: "up", delay: 8, duration: 18 },
      { from: "postgres", to: "redis", label: "up", delay: 28, duration: 18 },
    ],
    accent: ["postgres", "redis"],
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "ecom/settings.gradle",
    lines: [
      "// Shared build conventions.",
      "pluginManagement { includeBuild 'platform/build-logic' }",
      "",
      "rootProject.name = 'ecom'",
      "",
      "// One Spring Boot app, one Gradle module per bounded context.",
      "include('app')",
      "include('modules:partner', 'modules:commission',",
      "        'modules:terminal', 'modules:card', 'modules:payment')",
      "",
      "versionCatalogs { create('libs') {",
      "    from('uz.heeypay.ecom:versioning:0.1.0') } }",
    ],
    highlight: [8, 9],
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
    file: "ecom/modules/partner/…/SalesPoints.java · package-info.java",
    lines: [
      "package uz.heeypay.ecom.partner;",
      "",
      "/** What other modules may ask the partner module",
      "    about sales points. */",
      "public interface SalesPoints {",
      "  Optional<SalesPointView> payable(UUID salesPointId);",
      "  Optional<SalesPointView> find(UUID salesPointId);",
      "}",
      "",
      "// controller, service, repository, entity, …",
      "// are internal: Spring Modulith stops the build",
      "// if another module uses them.",
    ],
    highlight: [5, 11, 12],
  },
  {
    cue: 5,
    file: "ecom/platform · each its own build, published to ~/.m2",
    lines: [
      "platform/",
      "├── versioning/     every version, one libs.versions.toml",
      "├── build-logic/    Groovy convention plugins",
      "├── openapi/        specs → generated API jars",
      "├── error/          GeneralException + YAML definitions",
      "├── otp/  security/  keycloak/  persistence/",
      "├── crypto/  vault/",
      "└── *-client/       how to call each separate service",
    ],
    highlight: [2, 3, 5],
  },
  {
    cue: 6,
    file: "ecom/platform/versioning/libs.versions.toml",
    lines: [
      "# Every version in one place.",
      "# Pinned exactly; upgrades get their own commit.",
      "[versions]",
      'java = "25"',
      'spring-boot = "4.1.1"',
      'spring-modulith = "2.1.1"',
      'openapi-generator = "7.14.0"',
      'aws-sdk = "2.54.0"',
    ],
    highlight: [4, 5],
  },
  {
    cue: 7,
    file: "partner/…/properties/partner-exception.yaml",
    lines: [
      "exception:",
      "  starter:",
      "    error:",
      "      PARTNER_NOT_FOUND:",
      "        http-code: 404",
      "        title: partner-not-found",
      '        message-en: "No merchant found for {0}."',
      '        message-ru: "Мерчант «{0}» не найден."',
      '        message-uz: "{0} boʻyicha merchant topilmadi."',
      "",
      "throw new GeneralException(",
      "    PartnerExceptionStatus.PARTNER_NOT_FOUND, id);",
    ],
    highlight: [4, 5, 11, 12],
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
      "├── constant/        *ConstantUtils, *ExceptionStatus, bean names",
      "├── property/        typed configuration",
      "└── config/          the module's own datasource",
    ],
    highlight: [8],
  },
  {
    cue: 10,
    file: "ecom · services outside the app",
    lines: [
      "adapters/",
      "├── uzcard-adapter/   SV-Gate (JSON-RPC) as REST",
      "└── humo-adapter/     Payment Server (SOAP) as REST",
      "services/",
      "└── file-service/     files in S3 buckets",
      "",
      "platform/openapi/uzcard-adapter-api   the contract",
      "platform/uzcard-adapter-client        how to call it",
    ],
    highlight: [2, 3, 5],
  },
  {
    cue: 11,
    file: "ecom-infra/docker-compose.yml",
    lines: [
      "name: ecom",
      "services:",
      "  postgres:",
      "    image: postgres:17.6-alpine",
      '    ports: ["5442:5432"]',
      "  redis:",
      "    image: redis:8.2-alpine",
      '    ports: ["6389:6379"]',
    ],
    highlight: [4, 7],
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
    file: "github.com/khakimjanovich",
    lines: [
      "ecom              the code: platform, app, adapters, services",
      "ecom-infra        Docker Compose: everything the code runs on",
      "ecom-k6-testing   load tests",
      "ecom-front        the merchant portal and the bank console",
    ],
    highlight: [1, 2],
  },
];
