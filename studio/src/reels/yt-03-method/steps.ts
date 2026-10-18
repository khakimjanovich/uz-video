import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 03: the six-step method, shown once on the Partner example.
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 10, part: 1, current: ["partner", "emailport", "emailsvc"], built: BUILD_PARTS[0].nodes },
];

const SKETCH = { partner: [0, 0.5], salespoint: [1, 0.5], record: [2, 0.5], card: [3, 0.5], commission: [1, 2] } as const;
const ORDER = { record: [0, 1], spec: [1, 1], postgres: [2, 1], payment: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { partner: [1.5, 1] }, accent: ["partner"], badges: { partner: "PENDING → ACTIVE" } },
  {
    cue: 2,
    layout: { ...SKETCH },
    edges: [
      { from: "partner", to: "salespoint", label: "owns" },
      { from: "salespoint", to: "record", label: "takes" },
      { from: "record", to: "card", label: "uses" },
      { from: "commission", to: "record", label: "prices" },
    ],
  },
  {
    cue: 3,
    layout: { ...SKETCH },
    edges: [
      { from: "partner", to: "salespoint" },
      { from: "record", to: "salespoint", label: "sales_point_id" },
      { from: "record", to: "card" },
      { from: "commission", to: "record" },
    ],
    accent: ["record"],
    badges: { record: "ID only, no FK" },
  },
  {
    cue: 4,
    layout: { merchant: [0, 1], spec: [1.5, 1] },
    edges: [{ from: "merchant", to: "spec", label: "may ask" }],
    accent: ["spec"],
    badges: { spec: "the promise" },
  },
  {
    cue: 5,
    layout: { spec: [0.5, 1], gradle: [1.5, 1], partner: [2.5, 1] },
    edges: [
      { from: "spec", to: "gradle", label: "generate" },
      { from: "gradle", to: "partner", label: "implement" },
    ],
    badges: { partner: "drift = build fails" },
  },
  {
    cue: 6,
    layout: { partner: [0.5, 1], postgres: [2.5, 1] },
    edges: [{ from: "partner", to: "postgres", label: "migration" }],
    packets: [{ from: "partner", to: "postgres", label: "001-partner.yaml", delay: 15 }],
    badges: { postgres: "schema: partner" },
  },
  {
    cue: 7,
    layout: { partner: [1, 1], test: [2.5, 1] },
    edges: [{ from: "test", to: "partner", label: "checks the rule" }],
    accent: ["test"],
    badges: { test: "passes" },
  },
  {
    cue: 8,
    layout: { ...ORDER },
    edges: [
      { from: "record", to: "spec" },
      { from: "spec", to: "postgres" },
      { from: "postgres", to: "payment" },
    ],
    badges: { record: "1 domain", spec: "2 contract", postgres: "3 database", payment: "4 code + test" },
  },
];

// Real files from github.com/khakimjanovich/ecom at tag ep-03, trimmed for the screen.
export const code: CodeStep[] = [
  {
    cue: 1,
    file: "modules/partner/…/internal/Partner.java",
    lines: [
      "@Entity",
      "@Table(schema = \"partner\", name = \"partner\")",
      "public class Partner {",
      "  @Id private UUID id;",
      "  private String companyName;",
      "  @Enumerated(EnumType.STRING)",
      "  private PartnerStatus status;",
      "",
      "  public void verify() {",
      "    if (status != PENDING_VERIFICATION) {",
      "      throw new IllegalStateException(…);",
      "    }",
      "    status = VERIFIED;",
      "  }",
      "}",
    ],
    highlight: [9, 10, 11, 13],
  },
  {
    cue: 4,
    file: "modules/partner/src/main/openapi/partner-v1.yaml",
    lines: [
      "paths:",
      "  /api/v1/partners/{id}:",
      "    get:",
      "      operationId: getPartner",
      "      responses:",
      "        \"200\": { $ref: PartnerResponse }",
      "        \"404\": No such partner",
      "components:",
      "  schemas:",
      "    PartnerResponse:",
      "      required: [id, companyName, status]",
      "      status: [PENDING_VERIFICATION, VERIFIED]",
    ],
    highlight: [2, 4],
  },
  {
    cue: 5,
    file: "modules/partner/…/internal/PartnerController.java",
    lines: [
      "@RestController",
      "class PartnerController implements PartnersApi {",
      "",
      "  @Override",
      "  public ResponseEntity<PartnerResponse> getPartner(UUID id) {",
      "    return partners.findById(id)",
      "        .map(p -> new PartnerResponse(p.id(), …))",
      "        .map(ResponseEntity::ok)",
      "        .orElse(ResponseEntity.notFound().build());",
      "  }",
      "}",
    ],
    highlight: [2, 4],
  },
  {
    cue: 6,
    file: "modules/partner/…/db/changelog/partner.yaml",
    lines: [
      "- changeSet:",
      "    id: 001-create-partner",
      "    changes:",
      "      - createTable:",
      "          schemaName: partner",
      "          tableName: partner",
      "          columns:",
      "            - id: uuid, primary key",
      "            - company_name: varchar(255)",
      "            - email: varchar(320), unique",
      "            - status: varchar(32)",
    ],
    highlight: [5],
  },
  {
    cue: 7,
    file: "modules/partner/…/internal/PartnerTest.java",
    lines: [
      "@Test",
      "void cannotVerifyTwice() {",
      "  var partner = Partner.register(\"Aziza Shoes\", …);",
      "  partner.verify();",
      "  assertThatThrownBy(partner::verify)",
      "      .isInstanceOf(IllegalStateException.class);",
      "}",
      "",
      "// ./gradlew build → 4 tests, 0 failures",
    ],
    highlight: [5, 6],
  },
  {
    cue: 9,
    file: "~/acquiring · three repositories",
    lines: [
      "ecom/                 Java 25 · Spring Boot 4",
      "├── app/              the one Spring Boot app",
      "├── modules/partner/  ← this episode",
      "├── modules/commission, terminal, card, payment",
      "└── gradle/libs.versions.toml",
      "",
      "ecom-infra/           docker-compose: Postgres, Redis, Keycloak",
      "",
      "ecom-k6-testing/      Grafana k6",
      "├── smoke/health.js",
      "└── partner/get-partner.js",
    ],
    highlight: [3, 10, 11],
  },
];
