import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 18: when the processing center goes silent.
// Code beats quote github.com/khakimjanovich/ecom and ecom-infra (main).
const B4 = builtBefore(4);
export const map: BuildMapStep[] = [
  { cue: 0, part: 4, current: ["temporal", "payment"], built: [...B4, "observability"] },
  { cue: 13, part: 4, current: ["kafka", "merchant"], built: [...B4, "observability", "temporal"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { payment: [0.5, 1], uzcard: [2.5, 1] },
    edges: [{ from: "payment", to: "uzcard", broken: true, label: "no answer" }],
    packets: [{ from: "payment", to: "uzcard", label: "debit", delay: 8, stopAt: 0.5 }],
    badges: { payment: "UNKNOWN" },
  },
  {
    cue: 2,
    layout: { payment: [0.5, 1], uzcard: [2.5, 1] },
    edges: [{ from: "payment", to: "uzcard", label: "what happened?" }],
    packets: [0, 1, 2].map((k) => ({ from: "payment" as const, to: "uzcard" as const, label: "ask", delay: 6 + k * 18, duration: 14 })),
    badges: { payment: "app restarts?" },
  },
  {
    cue: 11,
    layout: { buyer: [0, 1], payment: [1.5, 1], temporal: [3, 1] },
    edges: [{ from: "buyer", to: "payment", label: "every 5 s" }, { from: "temporal", to: "payment", label: "PAID" }],
    packets: [
      { from: "buyer", to: "payment", label: "status?", delay: 6 },
      { from: "temporal", to: "payment", label: "approved", delay: 26 },
      { from: "buyer", to: "payment", label: "status?", delay: 46 },
    ],
    accent: ["payment"],
    badges: { buyer: "UNKNOWN → PAID" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 3,
    file: "modules/payment/…/workflow/PaymentResolutionWorkflow.java",
    lines: [
      "/** Settles a debit the scheme didn't answer: asks the scheme",
      " *  again and again, waiting longer each time, until it says",
      " *  approved or declined, or until it is time to hand the",
      " *  payment to a person. Temporal keeps the waits durable:",
      " *  a restart of the app loses nothing. */",
      "@WorkflowInterface",
      "public interface PaymentResolutionWorkflow {",
      "  @WorkflowMethod",
      "  String resolve(ResolutionPlan plan);",
      "}",
    ],
    highlight: [4, 5],
  },
  {
    cue: 4,
    file: "modules/payment/…/workflow/PaymentResolutionWorkflowImpl.java",
    lines: [
      "var started = Workflow.currentTimeMillis();",
      "var wait = plan.firstWaitMs();",
      "while (true) {",
      "  Workflow.sleep(Duration.ofMillis(wait));",
      "  var status = activities.askScheme(plan.paymentId());",
      "  if (!\"UNKNOWN\".equals(status) && !\"DEBITING\".equals(status))",
      "    return status;",
      "  if (Workflow.currentTimeMillis() - started",
      "      >= plan.giveUpAfterMs()) {",
      "    return activities.sendToReview(plan.paymentId());",
      "  }",
      "  wait = Math.min(wait * 2, plan.maxWaitMs());",
      "}",
    ],
    highlight: [4, 12],
  },
  {
    cue: 5,
    file: "modules/payment/…/workflow/PaymentResolutionActivitiesImpl.java",
    lines: [
      "/** Asks the scheme by our payment id, the same reference",
      " *  the debit carried, so the answer is about this debit",
      " *  and nothing else. */",
      "var result = cards.status(payment.getCardToken(), paymentId);",
      "",
      "// card module → adapter: Uzcard trans.ext, Humo GetPayment",
    ],
    highlight: [4],
  },
  {
    cue: 6,
    file: "modules/payment/…/workflow/PaymentResolutionActivitiesImpl.java",
    lines: [
      "switch (result.outcome()) {",
      "  case APPROVED -> settled.paid(result.processorRef(),",
      "      result.rrn());",
      "  case DECLINED -> { settled.declined(result.declineCode()); … }",
      "  case UNKNOWN -> {",
      "    return settled.getStatus().name(); // ask again later",
      "  }",
      "}",
      "operation.finish(result);",
      "operations.save(operation);",
    ],
    highlight: [2, 4, 9],
  },
  {
    cue: 7,
    file: "app/src/main/resources/application.yaml",
    lines: [
      "ecom.payment.resolution:",
      "  temporal-target: ${TEMPORAL_TARGET:localhost:7233}",
      "  task-queue: payment-resolution",
      "  first-wait: 30s",
      "  max-wait: 10m",
      "  give-up-after: 24h",
      "  stuck-after: 2m",
      "  sweep-delay: 1m",
      "",
      "// Payment.sendToReview(): UNKNOWN → MANUAL_REVIEW",
    ],
    highlight: [6, 10],
  },
  {
    cue: 8,
    file: "modules/payment/…/service/impl/TemporalPaymentResolutionService.java",
    lines: [
      "/** One workflow per payment: its id is the payment's,",
      " *  so starting it twice keeps the first. */",
      "WorkflowOptions.newBuilder()",
      "    // payment-resolution-<payment id>",
      "    .setWorkflowId(RESOLUTION_WORKFLOW_ID.formatted(paymentId))",
      "    .setTaskQueue(properties.taskQueue())",
      "    .setWorkflowIdConflictPolicy(",
      "        WORKFLOW_ID_CONFLICT_POLICY_USE_EXISTING)",
      "    .build();",
    ],
    highlight: [5, 8],
  },
  {
    cue: 9,
    file: "modules/payment/…/repository/PaymentRepository.java",
    lines: [
      "SELECT p.id FROM Payment p",
      " WHERE p.status = UNKNOWN",
      "    OR (p.status = DEBITING",
      "        AND EXISTS (SELECT o FROM PaymentOperation o",
      "                     WHERE o.paymentId = p.id",
      "                       AND o.startedAt < :stuckBefore))",
      "",
      "// PaymentResolutionSweeper: every sweep-delay,",
      "// resolution.start(id) for each",
    ],
    highlight: [2, 3],
  },
  {
    cue: 10,
    file: "modules/payment/…/service/impl/PaymentDebitServiceImpl.java",
    lines: [
      "/** The scheme didn't answer: a workflow asks it again later.",
      " *  If it can't start, the sweep will. */",
      "private void resolve(UUID paymentId) {",
      "  resolution.ifAvailable(starter -> {",
      "    try {",
      "      starter.start(paymentId);",
      "    } catch (RuntimeException e) {",
      "      log.warn(\"Resolving {} starts with the next sweep: {}\", …);",
      "    }",
      "  });",
      "}",
    ],
    highlight: [2, 8],
  },
  {
    cue: 12,
    file: "ecom-infra/observability/dashboards/payments.json",
    lines: [
      "Unknown debits resolved, by how they ended",
      "  sum by (outcome) (increase(ecom_payments_resolutions_total[5m]))",
      "",
      "  approved · declined · manual_review",
    ],
    highlight: [2],
  },
];
