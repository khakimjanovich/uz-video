import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 11: the terminal registry.
// Code beats quote github.com/khakimjanovich/ecom (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 2, current: ["terminal"], built: [...builtBefore(2), "commission"] },
  { cue: 10, part: 3, current: ["procport", "procsvc"], built: builtBefore(3) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { payment: [0.5, 1], processing: [2.5, 1] }, edges: [{ from: "payment", to: "processing", broken: true, label: "unknown terminal" }], packets: [{ from: "payment", to: "processing", label: "debit", delay: 15, stopAt: 0.5 }] },
  { cue: 2, layout: { salespoint: [0.5, 1], terminal: [2.5, 1] }, edges: [{ from: "salespoint", to: "terminal", label: "registered" }], accent: ["terminal"], badges: { terminal: "MID · TID" } },
  { cue: 3, layout: { salespoint: [0, 1], uzcard: [2.5, 0], humo: [2.5, 2] }, edges: [{ from: "salespoint", to: "uzcard", label: "TID 1" }, { from: "salespoint", to: "humo", label: "TID 2" }] },
  { cue: 8, layout: { payment: [0.5, 1], terminal: [2.5, 1] }, edges: [{ from: "payment", to: "terminal", label: "forPayment" }, { from: "terminal", to: "payment" }], packets: [{ from: "payment", to: "terminal", label: "website + Uzcard", delay: 10 }, { from: "terminal", to: "payment", label: "MID · TID or none", delay: 45 }] },
];

export const code: CodeStep[] = [
  {
    cue: 4,
    file: "modules/terminal/…/service/impl/TerminalServiceImpl.java",
    lines: [
      "/** Fails closed: an unknown website, or one that",
      " *  doesn't take this card scheme, gets no terminal. */",
      "var salesPoint = salesPoints.find(salesPointId)",
      "    .orElseThrow(() -> new GeneralException(",
      "        TERMINAL_SALES_POINT_NOT_FOUND, salesPointId));",
      "if (!salesPoint.schemes().contains(scheme)) {",
      "  throw new GeneralException(",
      "      TERMINAL_SCHEME_NOT_ALLOWED, scheme);",
      "}",
      "",
      "// salesPoints: the partner module's public API,",
      "// the only part of it this module may use",
    ],
    highlight: [3, 6],
  },
  {
    cue: 5,
    file: "modules/terminal/…/db/changelog/terminal.yaml",
    lines: [
      "# A MID/TID pair is issued once, even if the",
      "# terminal is revoked later.",
      "- addUniqueConstraint:",
      "    columnNames: scheme, merchant_id, terminal_id",
      "    constraintName: uq_terminal_credentials",
      "",
      "# At most one live terminal per website and card,",
      "# so a payment's route is never ambiguous.",
      "- sql: CREATE UNIQUE INDEX uq_terminal_active_route",
      "       ON terminal.terminal (sales_point_id, scheme)",
      "       WHERE status = 'ACTIVE'",
    ],
    highlight: [4, 9, 11],
  },
  {
    cue: 6,
    file: "modules/terminal/…/entity/Terminal.java",
    lines: [
      "public void suspend() {",
      "  move(TerminalStatus.ACTIVE, TerminalStatus.SUSPENDED);",
      "}",
      "",
      "public void resume() {",
      "  move(TerminalStatus.SUSPENDED, TerminalStatus.ACTIVE);",
      "}",
      "",
      "/** Revoked is final: a revoked MID/TID never comes back. */",
      "public void revoke() {",
      "  if (status == TerminalStatus.REVOKED) {",
      "    throw invalid(TerminalStatus.REVOKED);",
      "  }",
      "  status = TerminalStatus.REVOKED;",
      "}",
    ],
    highlight: [9, 11],
  },
  {
    cue: 7,
    file: "GET /api/v1/admin/terminals/{id}/audit",
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
    file: "platform/openapi/terminal-api/…/terminal-v1.yaml",
    lines: [
      "/api/v1/admin/terminals:",
      "  get: searchTerminals",
      "    parameters:",
      "      - salesPointId",
      "      - scheme",
      "      - status",
      "      - q      # Part of a MID or TID",
      "      - page, size",
      "",
      "/api/v1/admin/terminals/{terminalId}:        get",
      "/api/v1/admin/terminals/{terminalId}/audit:  get",
    ],
    highlight: [7, 15],
  },
];
