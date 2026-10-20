import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 11: the e-POS terminal registry.
// Code beats quote github.com/khakimjanovich/ecom (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 2, current: ["epos"], built: [...builtBefore(2), "commission"] },
  { cue: 10, part: 3, current: ["procport", "procsvc"], built: builtBefore(3) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { payment: [0.5, 1], processing: [2.5, 1] }, edges: [{ from: "payment", to: "processing", broken: true, label: "unknown MID/TID" }], packets: [{ from: "payment", to: "processing", label: "debit", delay: 15, stopAt: 0.5 }] },
  { cue: 2, layout: { salespoint: [0.5, 1], epos: [2.5, 1] }, edges: [{ from: "salespoint", to: "epos", label: "registered" }], accent: ["epos"], badges: { epos: "MID · TID" } },
  { cue: 3, layout: { salespoint: [0, 1], uzcard: [2.5, 0], humo: [2.5, 2] }, edges: [{ from: "salespoint", to: "uzcard", label: "TID 1" }, { from: "salespoint", to: "humo", label: "TID 2" }] },
  { cue: 8, layout: { payment: [0.5, 1], epos: [2.5, 1] }, edges: [{ from: "payment", to: "epos", label: "forPayment" }, { from: "epos", to: "payment" }], packets: [{ from: "payment", to: "epos", label: "website + Uzcard", delay: 10 }, { from: "epos", to: "payment", label: "MID · TID or none", delay: 45 }] },
];

export const code: CodeStep[] = [
  {
    cue: 4,
    file: "modules/epos/…/service/impl/EposServiceImpl.java",
    lines: [
      "/** Fails closed: an unknown website, or one that",
      " *  doesn't take this card scheme, gets no e-POS terminal. */",
      "var salesPoint =",
      "    partner.findSalesPoint(salesPointId).stream()",
      "        .findFirst()",
      "        .orElseThrow(() -> new GeneralException(",
      "            EPOS_SALES_POINT_NOT_FOUND, salesPointId));",
      "if (salesPoint.getSchemes().stream()",
      "    .noneMatch(allowed ->",
      "        allowed.getValue().equals(scheme))) {",
      "  throw new GeneralException(",
      "      EPOS_SCHEME_NOT_ALLOWED, scheme);",
      "}",
      "",
      "// partner: PartnerInternalApi, generated from the",
      "// partner module's contract",
    ],
    highlight: [4, 8, 9],
  },
  {
    cue: 5,
    file: "modules/epos/…/db/changelog/epos.yaml",
    lines: [
      "# A MID/TID pair is issued once, even if the e-POS",
      "# terminal is revoked later.",
      "- addUniqueConstraint:",
      "    columnNames: scheme, merchant_id, terminal_id",
      "    constraintName: uq_epos_credentials",
      "",
      "# At most one live e-POS terminal per website and card,",
      "# so a payment's route is never ambiguous.",
      "- sql: CREATE UNIQUE INDEX uq_epos_active_route",
      "       ON epos.epos (sales_point_id, scheme)",
      "       WHERE status = 'ACTIVE'",
    ],
    highlight: [4, 9, 11],
  },
  {
    cue: 6,
    file: "modules/epos/…/entity/Epos.java",
    lines: [
      "public void suspend() {",
      "  move(EposStatus.ACTIVE, EposStatus.SUSPENDED);",
      "}",
      "",
      "public void resume() {",
      "  move(EposStatus.SUSPENDED, EposStatus.ACTIVE);",
      "}",
      "",
      "/** Revoked is final: a revoked MID/TID never comes back. */",
      "public void revoke() {",
      "  if (status == EposStatus.REVOKED) {",
      "    throw invalid(EposStatus.REVOKED);",
      "  }",
      "  status = EposStatus.REVOKED;",
      "}",
    ],
    highlight: [9, 11],
  },
  {
    cue: 7,
    file: "GET /api/v1/admin/epos/{eposId}/audit",
    lines: [
      "[",
      '  { "action": "REGISTERED", "actor": "aziz" },',
      '  { "action": "SUSPENDED",  "actor": "malika",',
      '    "reason": "Processing center maintenance" },',
      '  { "action": "RESUMED",    "actor": "malika" },',
      '  { "action": "REVOKED",    "actor": "aziz",',
      '    "reason": "Replaced" }',
      "]",
    ],
    highlight: [3, 4, 7],
  },
  {
    cue: 9,
    file: "platform/openapi/epos-api/…/epos-v1.yaml",
    lines: [
      "/api/v1/admin/epos:",
      "  get: searchEpos",
      "    parameters:",
      "      - salesPointId",
      "      - scheme",
      "      - status",
      "      - q      # Part of a MID or TID",
      "      - page, size",
      "",
      "/api/v1/admin/epos/{eposId}:        get",
      "/api/v1/admin/epos/{eposId}/audit:  get",
    ],
    highlight: [7, 10],
  },
];
