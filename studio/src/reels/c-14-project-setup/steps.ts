import { BuildMapStep, CodeStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 14: ecom's project setup. One story carries it: an apartment building.
// The tangle (cues 0–4), the building (5–6), the modular monolith and its walls (7–9), the door (10–13),
// contracts and the platform (14–16), the wall in the build (17–21), breaking it (22–25), the close (26–27).
const FLATS = { partner: [0.3, 0.3], commission: [1.5, 0.3], epos: [2.7, 0.3], payment: [0.9, 1.7], reconciliation: [2.1, 1.7] } as const;
const ONE_APP = { label: "One Spring Boot app", from: [0.3, 0.3], to: [2.7, 1.7], tone: "wall" } as const;
const SHORTCUT = { payment: [0.4, 1], partnerTable: [2.6, 1] } as const;
const SPLIT = { payment: [0.4, 1], partner: [2.6, 0.3], commission: [2.6, 1.7] } as const;
const SPLIT_EDGES = [{ from: "payment", to: "partner", label: "network" }, { from: "payment", to: "commission", label: "network" }] as const;
const DOOR = { payment: [0.3, 1], door: [1.5, 1], partner: [2.7, 1] } as const;
const DOOR_EDGES = [{ from: "payment", to: "door" }, { from: "door", to: "partner" }] as const;
const PIPES = { partner: [0.4, 0.3], payment: [1.5, 0.3], commission: [2.6, 0.3], platform: [1.5, 1.8] } as const;
const PIPE_EDGES = (["partner", "payment", "commission"] as const).map((to) => ({ from: "platform" as const, to }));
const BUILDING = { partner: [0.3, 0], commission: [1.5, 0], epos: [2.7, 0], payment: [0.9, 1], reconciliation: [2.1, 1], platform: [1.5, 2.1] } as const;
const BUILDING_EDGES = (["payment", "reconciliation"] as const).map((to) => ({ from: "platform" as const, to }));

export const diagram: DiagramStep<BuildId>[] = [
  // Without walls, one shortcut breaks a neighbour.
  { cue: 0, layout: { app: [1.5, 1] } },
  { cue: 2, layout: SHORTCUT, edges: [{ from: "payment", to: "partnerTable", label: "shortcut" }], packets: [{ from: "payment", to: "partnerTable", label: "read" }] },
  { cue: 3, layout: SHORTCUT, edges: [{ from: "payment", to: "partnerTable", label: "shortcut" }], danger: ["payment"], badges: { payment: "refunds broken" } },
  { cue: 4, layout: SPLIT, edges: [...SPLIT_EDGES], badges: { partner: "own deploy · own DB", commission: "own deploy · own DB" } },
  // The building.
  { cue: 5, layout: { app: [1.5, 1] }, badges: { app: "apartment building" } },
  { cue: 6, layout: { app: [1.5, 1] }, badges: { app: "walls · doors · pipes" } },
  // The modular monolith and its walls.
  { cue: 7, layout: FLATS, frames: [ONE_APP], accent: ["partner", "commission", "epos", "payment", "reconciliation"] },
  { cue: 8, layout: FLATS, frames: [ONE_APP], badges: { payment: "walls" } },
  {
    cue: 9,
    layout: { payment: [0.4, 1], partner: [2.6, 1] },
    edges: [{ from: "payment", to: "partner", label: "import", broken: true }],
    danger: ["payment"],
    badges: { payment: "build failed" },
  },
  // The door: an internal contract.
  { cue: 10, layout: DOOR, edges: [...DOOR_EDGES], packets: [{ from: "payment", to: "door", label: "knock" }] },
  { cue: 11, layout: DOOR, edges: [...DOOR_EDGES], accent: ["door"], packets: [{ from: "payment", to: "door", label: "ask" }, { from: "door", to: "partner", label: "ask", delay: 40 }] },
  { cue: 12, layout: DOOR, edges: [...DOOR_EDGES], frames: [{ label: "One app", from: [0.3, 1], to: [2.7, 1] }], badges: { door: "in-process" } },
  {
    cue: 13,
    layout: { payment: [0.3, 1], door: [1.4, 1], partner: [3, 1] },
    edges: [{ from: "payment", to: "door" }, { from: "door", to: "partner", label: "HTTP" }],
    frames: [{ label: "One app", from: [0.3, 1], to: [1.4, 1] }],
    badges: { payment: "unchanged", partner: "moved out" },
  },
  // Contracts first; the shared plumbing.
  { cue: 14, layout: { contracts: [0.4, 1], generated: [2.6, 1] }, edges: [{ from: "contracts", to: "generated", label: "generates" }], badges: { contracts: "by hand" } },
  { cue: 15, layout: PIPES, edges: PIPE_EDGES, accent: ["platform"] },
  { cue: 16, layout: PIPES, edges: PIPE_EDGES, badges: { platform: "one version line" } },
  // The close.
  { cue: 26, layout: BUILDING, edges: BUILDING_EDGES, frames: [{ label: "One building", from: [0.3, 0], to: [2.7, 1], tone: "wall" }], badges: { platform: "shared pipes" } },
];

export const map: BuildMapStep[] = [{ cue: 27, part: 3, current: ["partner", "commission", "epos", "payment", "reconciliation"], units: { ecom: "modular monolith" } }];

// The wall as written: payment's build sees contracts only; two architecture rules; then the wall broken on purpose.

export const code: CodeStep[] = [
  {
    cue: 18,
    file: "ecom/modules/payment/build.gradle",
    lines: [
      "// Payment module: merchants' servers create payments over signed requests;",
      "   retries are idempotent.",
      "dependencies {",
      "    // Other modules' contracts: their internal operations, never their code.",
      "    implementation contracts.partner.api",
      "    …",
      "    implementation contracts.epos.api",
      "    implementation contracts.commission.api",
      "    …",
    ],
    at: [1, null, 2, 3, 4, null, 7, 8, null],
    small: true,
    highlight: [4, 5, 7, 8],
  },
  {
    cue: 19,
    file: "ecom/app/src/test/java/uz/heeypay/ecom/ModularityTest.java",
    lines: [
      "  @Test",
      "  void modulesRespectTheirBoundaries() {",
      "    ApplicationModules.of(",
      "            EcomApplication.class,",
      "            resideOutsideOfPackages(MODULES)",
      "                .or(resideInAPackage(\"uz.heeypay.ecom.*.api..\")))",
      "        .verify();",
      "  }",
    ],
    at: [26, 27, 28, 29, 30, null, 31, 32],
    small: true,
    beats: [{ cue: 20, highlight: [2, 3, 7] }],
  },
  {
    cue: 21,
    file: "ecom/app/src/test/java/uz/heeypay/ecom/LayeringTest.java",
    lines: [
      "  @Test",
      "  void controllersCallOnlyServices() {",
      "    noClasses()",
      "        .that()",
      "        .resideInAPackage(\"..controller..\")",
      "        .should()",
      "        .dependOnClassesThat()",
      "        .resideInAnyPackage(",
      "            \"..repository..\",",
      "            \"..service.impl..\",",
      "            \"..entity..\",",
      "            \"..mapper..\",",
      "            \"..workflow..\",",
      "            \"..config..\")",
      "        .check(CLASSES);",
      "  }",
    ],
    at: 26,
    small: true,
    highlight: [2, 5, 9],
  },
  {
    cue: 22,
    file: "terminal · ecom",
    lines: [
      "$ export GH_PACKAGES_ACTOR=<user> GH_PACKAGES_TOKEN=<token>",
      "$ F=$(find modules -name PaymentAccess.java)",
      "$ sed -i '' '/^import lombok.RequiredArgsConstructor;/a\\",
      "import uz.heeypay.ecom.partner.repository.PartnerRepository;",
      "' $F",
      "$ ./gradlew check",
      "> Task :modules:payment:compileJava FAILED",
      "PaymentAccess.java:8: error: package uz.heeypay.ecom.partner.repository does not exist",
      "$ git checkout -- $F",
    ],
    small: true,
    upTo: 2,
    beats: [{ cue: 23, upTo: 5, highlight: [4] }, { cue: 24, upTo: 8, highlight: [7, 8] }, { cue: 25, highlight: [9] }],
  },
];
