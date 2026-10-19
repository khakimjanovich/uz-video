import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 24: the system on Kubernetes.
// Code beats quote github.com/khakimjanovich/ecom-infra (main).
export const map: BuildMapStep[] = [
  { cue: 0, part: 5, current: ["kubernetes"], built: builtBefore(5) },
  { cue: 11, part: 5, current: ["card"], built: [...builtBefore(5), "kubernetes"] },
];

export const diagram: DiagramStep<BuildId>[] = [
  {
    cue: 1,
    layout: { kubernetes: [0, 1], app: [1.7, 0.2], uzcardsvc: [1.7, 1.2], humosvc: [3, 1.2], filesvc: [3, 0.2] },
    edges: [{ from: "kubernetes", to: "app" }, { from: "kubernetes", to: "uzcardsvc" }],
    accent: ["kubernetes"],
    badges: { app: "× 3", uzcardsvc: "× 2", humosvc: "× 2", filesvc: "× 2" },
  },
  {
    cue: 7,
    layout: { app: [0, 1], postgres: [1.6, 0.2], temporal: [1.6, 1.8], kafka: [3.2, 1] },
    edges: [{ from: "app", to: "postgres", label: "SKIP LOCKED · ShedLock" }, { from: "app", to: "temporal", label: "one workflow" }, { from: "app", to: "kafka", label: "partitions" }],
    badges: { app: "× 3 replicas" },
  },
  {
    cue: 9,
    layout: { buyer: [0, 1], kubernetes: [1.5, 1], app: [3, 0.3], payment: [3, 1.7] },
    edges: [{ from: "buyer", to: "kubernetes", label: "payments" }, { from: "kubernetes", to: "app" }, { from: "kubernetes", to: "payment", label: "new pod" }],
    packets: [0, 1, 2].map((k) => ({ from: "buyer" as const, to: "kubernetes" as const, label: "pay", delay: 6 + k * 14, duration: 12 })),
    crossed: ["app"],
    badges: { buyer: "0 failed" },
  },
];

export const code: CodeStep[] = [
  {
    cue: 2,
    file: "ecom-infra/k8s/Dockerfile",
    lines: [
      "# One image per deployable: the Gradle-built jar on",
      "# the plain JRE, run as a non-root user. The limits",
      "# and JVM options come from the cluster.",
      "FROM eclipse-temurin:25-jre",
      "ARG JAR",
      "COPY ${JAR} /opt/ecom/service.jar",
      "USER 10001",
      "ENTRYPOINT [\"java\", \"-jar\", \"/opt/ecom/service.jar\"]",
      "",
      "# config.yaml: JAVA_TOOL_OPTIONS=-XX:MaxRAMPercentage=75",
    ],
    highlight: [4, 7, 10],
  },
  {
    cue: 3,
    file: "ecom-infra/k8s/base/app.yaml",
    lines: [
      "startupProbe:",
      "  httpGet: { path: /actuator/health/liveness, port: http }",
      "  periodSeconds: 5",
      "  failureThreshold: 36   # up to three minutes to start",
      "livenessProbe:",
      "  httpGet: { path: /actuator/health/liveness, port: http }",
      "readinessProbe:",
      "  httpGet: { path: /actuator/health/readiness, port: http }",
    ],
    highlight: [6, 8],
  },
  {
    cue: 4,
    file: "ecom-infra/k8s/base/app.yaml",
    lines: [
      "replicas: 3",
      "strategy:",
      "  rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }",
      "…",
      "lifecycle:",
      "  # The Service stops sending new requests before",
      "  # the app starts its graceful shutdown.",
      "  preStop: { sleep: { seconds: 10 } }",
    ],
    highlight: [3, 8],
  },
  {
    cue: 5,
    file: "ecom-infra/k8s/base/app.yaml",
    lines: [
      "spec:",
      "  # longer than the slowest scheme call the app waits for",
      "  terminationGracePeriodSeconds: 60",
      "",
      "# Spring Boot: on SIGTERM the web server takes no new",
      "# requests and waits for the ones in flight",
    ],
    highlight: [3],
  },
  {
    cue: 6,
    file: "ecom-infra/k8s/base/config.yaml",
    lines: [
      "# Secrets are not here: the app reads them from the",
      "# ecom-secrets Secret, which the bank creates in the",
      "# cluster (from Vault) and which never lives in git.",
      "kind: ConfigMap",
      "data:",
      "  DB_URL: jdbc:postgresql://postgres:5432/acquiring",
      "  KAFKA_BOOTSTRAP: kafka:9092",
      "  UZCARD_ADAPTER_URL: http://uzcard-adapter:8091",
      "",
      "envFrom:",
      "  - configMapRef: { name: ecom-config }",
      "  - secretRef: { name: ecom-secrets }",
    ],
    highlight: [2, 12],
  },
  {
    cue: 8,
    file: "ecom-infra/k8s/base/app.yaml",
    lines: [
      "kind: HorizontalPodAutoscaler",
      "spec:",
      "  minReplicas: 3",
      "  maxReplicas: 6",
      "  metrics: [{ resource: { name: cpu,",
      "      target: { averageUtilization: 70 } } }]",
      "---",
      "kind: PodDisruptionBudget",
      "spec:",
      "  minAvailable: 2   # a drain takes one replica at a time",
    ],
    highlight: [6, 10],
  },
  {
    cue: 10,
    file: "ecom-infra/k8s/local/dependencies.sh",
    lines: [
      "# The compose containers the cluster calls, as Services",
      "# with fixed endpoints: inside the cluster \"postgres:5432\"",
      "# means the compose stack's Postgres, as a managed",
      "# database would in production.",
      "for entry in postgres:5432 redis:6379 keycloak:8080 \\",
      "  vault:8200 temporal:7233 kafka:9092 …; do",
      "  ip=$(docker inspect … \"ecom-$name-1\")",
      "  # Service $name + Endpoints $ip:$port",
      "done",
      "",
      "# k8s/local/kustomization.yaml: resources: [../base]",
    ],
    highlight: [2, 11],
  },
];
