import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 06: four eyes on activation.
// Code beats quote github.com/khakimjanovich/ecom and ecom-k6-testing at tag ep-06.
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["admin", "partner"], built: builtBefore(1) },
  { cue: 13, part: 1, current: ["partner", "keycloak"], built: builtBefore(1) },
];

const FLOW = { admin: [0, 0], checker: [3, 0], request: [1.5, 1], partner: [1.5, 2] } as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { admin: [0, 1], partner: [2.5, 1] }, edges: [{ from: "admin", to: "partner", label: "activate" }], danger: ["admin"], badges: { admin: "alone" } },
  { cue: 2, layout: { admin: [0, 0], request: [1.5, 1], partner: [1.5, 2] }, edges: [{ from: "admin", to: "request", label: "request" }], packets: [{ from: "admin", to: "request", label: "activate?", delay: 15 }], badges: { request: "PENDING", partner: "unchanged" } },
  {
    cue: 4,
    layout: { ...FLOW },
    edges: [{ from: "admin", to: "request" }, { from: "checker", to: "request", label: "approve" }, { from: "request", to: "partner" }],
    packets: [{ from: "checker", to: "request", label: "approve", delay: 10 }, { from: "request", to: "partner", label: "ACTIVE", delay: 45 }],
    accent: ["partner"],
  },
  { cue: 6, layout: { admin: [0, 0], request: [1.5, 1] }, edges: [{ from: "admin", to: "request", broken: true, label: "self-approve" }], packets: [{ from: "admin", to: "request", label: "approve", delay: 15, stopAt: 0.5 }], danger: ["admin"], badges: { request: "409 SELF_APPROVAL" } },
];

export const code: CodeStep[] = [
  {
    cue: 3,
    file: "platform/openapi/partner-api/…/partner-v1.yaml",
    lines: [
      "/api/v1/admin/partners/{id}/activation-requests:",
      "  post: requestActivation         # 201 · 404 · 409",
      "",
      "/api/v1/admin/activation-requests/{requestId}/approve:",
      "  post: approveActivation         # 200 · 404 · 409 · 410",
      "",
      "/api/v1/admin/activation-requests/{requestId}/reject:",
      "  post: rejectActivation          # 200 · 404 · 409 · 410",
      "",
      "ActivationRequestResponse:",
      "  status: [PENDING, APPROVED, REJECTED, EXPIRED]",
    ],
    highlight: [2, 5],
  },
  {
    cue: 5,
    file: "modules/partner/…/entity/ActivationRequest.java",
    lines: [
      "private void decide(ActivationRequestStatus outcome,",
      "    String checker, String reason, Instant now) {",
      "  if (status != ActivationRequestStatus.PENDING) {",
      "    throw new ApiException(HttpStatus.CONFLICT, …);",
      "  }",
      "  if (!now.isBefore(expiresAt)) {",
      "    throw new ApiException(HttpStatus.GONE, …);",
      "  }",
      "  if (checker.equals(requestedBy)) {",
      "    throw new ApiException(HttpStatus.CONFLICT,",
      "        PartnerErrorCode.SELF_APPROVAL, …);",
      "  }",
      "  status = outcome;",
      "  decidedBy = checker;",
    ],
    highlight: [3, 6, 9],
  },
  {
    cue: 7,
    file: "modules/partner/…/service/impl/ActivationRequestServiceImpl.java",
    lines: [
      "public ActivationRequestResponse approve(UUID requestId,",
      "    String checker) {",
      "  var request = find(requestId);",
      "  request.approve(checker, Instant.now());",
      "  partnerAdminService.activate(",
      "      request.getPartnerId(), checker,",
      "      ACTIVATION_REASON.formatted(request.getRequestedBy()));",
      "  return partnerMapper.toResponse(request);",
      "}",
      "",
      '// history: APPROVED → ACTIVE · malika · "Requested by aziz"',
    ],
    highlight: [6, 7],
  },
  {
    cue: 8,
    file: "app/src/main/resources/application.yaml",
    lines: [
      "ecom:",
      "  # Four eyes: how long the second admin has,",
      "  # and how often overdue requests are expired.",
      "  partner:",
      "    activation:",
      "      ttl: 24h",
      "      sweep-delay: 1m",
    ],
    highlight: [6, 7],
  },
  {
    cue: 9,
    file: "modules/partner/…/service/impl/ActivationRequestSweeper.java",
    lines: [
      "/** Marks requests nobody decided in time as expired.",
      " *  The lock keeps it to one instance at a time. */",
      "@Scheduled(fixedDelayString = ACTIVATION_SWEEP_DELAY)",
      "@SchedulerLock(name = ACTIVATION_SWEEP_LOCK)",
      "@Transactional(transactionManager = TRANSACTION_MANAGER)",
      "public void expireOverdue() {",
      "  var expired = requestRepository.expireOverdue(Instant.now());",
      "  …",
      "}",
      "",
      "// the lock lives in the module's own schema: partner.shedlock",
    ],
    highlight: [4, 11],
  },
  {
    cue: 10,
    file: "modules/partner/…/db/changelog/partner.yaml",
    lines: [
      "- changeSet:",
      "    id: 005-create-activation-request",
      "    changes:",
      "      - createTable:",
      "          tableName: activation_request",
      "      # One waiting request per partner,",
      "      # enforced by the database.",
      "      - sql:",
      "          sql: CREATE UNIQUE INDEX",
      "            uq_activation_request_pending",
      "            ON partner.activation_request (partner_id)",
      "            WHERE status = 'PENDING'",
    ],
    highlight: [9, 12],
  },
  {
    cue: 11,
    file: "modules/partner/src/test · src/integrationTest",
    lines: [
      "// unit · ActivationRequestTest",
      "@Test void anotherAdminApproves()",
      "@Test void makerCannotApproveOwnRequest()",
      "@Test void expiredRequestIsGone()           // 410",
      "@Test void decidedOnce()",
      "",
      "// integration · ActivationRequestServiceIT · real Postgres",
      "@Test void theCheckerActivatesThePartner()",
      "@Test void oneWaitingRequestPerPartner()",
      "@Test void theSweepExpiresOverdueRequestsAndFreesThePartner()",
    ],
    highlight: [8, 9, 10],
  },
  {
    cue: 12,
    file: "k6 · lifecycle/partner-lifecycle.js",
    lines: [
      "✓ activation requested (201)",
      "✓ one waiting request (409)",
      "✓ no self-approval (409)",
      "✓ second admin approves",
      "✓ active",
      "",
      "http_req_duration{name:admin} ... p(95)=4.06ms",
      "iterations ...................... 2 838   94/s",
      "checks .......................... 100.00%  39 732",
    ],
    highlight: [3, 8],
  },
];
