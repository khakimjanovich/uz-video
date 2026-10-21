import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BUILD_PARTS } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";
import { tableStep } from "../../series/build/tables";

// Episode 03: the method (domain → contract → database → code), shown once on reading a partner.
// Code beats quote github.com/khakimjanovich/ecom (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 0, current: BUILD_PARTS[0].nodes },
  { cue: 12, part: 1, current: ["partner", "emailport", "emailsvc"], built: BUILD_PARTS[0].nodes },
];

const SKETCH = { partner: [0, 0.5], salespoint: [1, 0.5], record: [2, 0.5], card: [3, 0.5], commission: [1, 2] } as const;
const ORDER = { record: [0, 1], spec: [1, 1], postgres: [2, 1], payment: [3, 1] } as const;

export const diagram: DiagramStep<BuildId>[] = [
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
    cue: 10,
    layout: { spec: [0.5, 1], app: [2.5, 1] },
    edges: [{ from: "spec", to: "app", label: "in the jar" }],
    accent: ["app"],
    badges: { app: "/swagger-ui" },
  },
  {
    cue: 11,
    layout: { ...ORDER },
    edges: [
      { from: "record", to: "spec" },
      { from: "spec", to: "postgres" },
      { from: "postgres", to: "payment" },
    ],
    badges: { record: "1 domain", spec: "2 contract", postgres: "3 database", payment: "4 code" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 1,
    file: "modules/partner/…/entity/Partner.java",
    lines: [
      "@Entity",
      "@Table(schema = PartnerConstants.SCHEMA,",
      "       name = PartnerConstants.TABLE)",
      "public class Partner {",
      "  @Id private UUID id;",
      "  @Enumerated(EnumType.STRING)",
      "  private PartnerStatus status;",
      "",
      "  /** Only the moves PartnerStatus allows. */",
      "  public PartnerStatus moveTo(PartnerStatus target) {",
      "    if (!status.canMoveTo(target)) {",
      "      throw new GeneralException(",
      "          PARTNER_INVALID_TRANSITION, status, target);",
      "    }",
      "    …",
    ],
    highlight: [10, 11, 12],
  },
  {
    cue: 4,
    file: "platform/openapi/partner-api/src/main/openapi/partner-v1.yaml",
    lines: [
      "paths:",
      "  /api/v1/partners/{id}:",
      "    get:",
      "      tags: [Partners]",
      "      operationId: getPartner",
      "      responses:",
      '        "200": PartnerResponse',
      '        "404": { $ref: "…/problem-v1.yaml#…/Problem" }',
      "components:",
      "  schemas:",
      "    PartnerResponse:",
      "      required: [id, companyName, email, status, …]",
    ],
    highlight: [4, 5, 8],
  },
  {
    cue: 5,
    file: "modules/partner/…/controller/PartnerController.java",
    lines: [
      "@RestController",
      "@RequiredArgsConstructor",
      "public class PartnerController implements PartnersApi {",
      "",
      "  private final PartnerService partnerService;",
      "",
      "  @Override",
      "  public ResponseEntity<PartnerResponse> getPartner(UUID id) {",
      "    return ResponseEntity.ok(partnerService.getPartner(id));",
      "  }",
      "}",
    ],
    highlight: [3, 7],
  },
  {
    cue: 7,
    file: "modules/partner/…/config/PartnerPersistenceConfig.java",
    lines: [
      "@Bean",
      "@ConfigurationProperties(DB_PROPERTIES_PREFIX)",
      "DataSourceProperties partnerDataSourceProperties() {",
      "  return new DataSourceProperties();",
      "}",
      "",
      "/** Every Hikari setting, e.g. its pool size. */",
      "@Bean(PartnerBeanNames.DATA_SOURCE)",
      "@ConfigurationProperties(",
      "    DB_PROPERTIES_PREFIX + HIKARI_SUFFIX)",
      "HikariDataSource partnerDataSource(…) {",
      "  return ModulePersistence.dataSource(SCHEMA, …);",
      "}",
      "",
      "// ecom.db.partner: url, partner_user; password: Vault",
      "// env: ECOM_DB_PARTNER_HIKARI_MAXIMUM_POOL_SIZE",
    ],
    highlight: [2, 9, 10, 12],
  },
  {
    cue: 8,
    file: "modules/partner/…/service/impl/PartnerServiceImpl.java",
    lines: [
      "@Service",
      "@RequiredArgsConstructor",
      "@Transactional(readOnly = true,",
      "    transactionManager = PartnerBeanNames.TRANSACTION_MANAGER)",
      "public class PartnerServiceImpl implements PartnerService {",
      "",
      "  public PartnerResponse getPartner(UUID id) {",
      "    return partnerRepository.findById(id)",
      "        .map(partnerMapper::toResponse)",
      "        .orElseThrow(() -> new GeneralException(",
      "            PartnerExceptionStatus.PARTNER_NOT_FOUND, id));",
      "  }",
      "}",
    ],
    highlight: [8, 10, 11],
  },
  {
    cue: 9,
    file: "GET /api/v1/partners/0000… · 404 application/problem+json",
    lines: [
      "{",
      '  "detail": "No merchant found for 00000000-0000-….",',
      '  "instance": "/api/v1/partners/00000000-0000-…",',
      '  "status": 404,',
      '  "title": "partner-not-found",',
      '  "code": "PARTNER_NOT_FOUND",',
      '  "requestId": "4bf92f3577b34da6a3ce929d0e0e4736"',
      "}",
    ],
    highlight: [2, 6, 7],
  },
  tableStep(6, "partner.partner", 3),
];
