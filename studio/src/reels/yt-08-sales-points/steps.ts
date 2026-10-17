import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 08: sales points and site checks (SalesPointInternalServiceImpl, SiteCheckServiceImpl).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["partner"], built: builtBefore(1) },
  { cue: 8, part: 1, current: ["partner", "commission"], built: builtBefore(1) },
];

const CHECK = { admin: [0, 0], checker: [3, 0], salespoint: [0.75, 1.5], fakesite: [2.25, 1.5] } as const;
export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { partner: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "partner", to: "salespoint", label: "owns" }], badges: { salespoint: "schemes · return URLs" } },
  { cue: 2, layout: { partner: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "partner", to: "salespoint" }], badges: { salespoint: "DRAFT" } },
  {
    cue: 3,
    layout: { ...CHECK },
    edges: [{ from: "admin", to: "salespoint" }, { from: "checker", to: "salespoint" }, { from: "admin", to: "fakesite" }, { from: "checker", to: "fakesite" }],
    packets: [{ from: "admin", to: "salespoint", label: "check 1", delay: 10 }, { from: "checker", to: "salespoint", label: "check 2", delay: 40 }],
  },
  { cue: 4, layout: { ...CHECK }, edges: [{ from: "admin", to: "fakesite" }, { from: "checker", to: "fakesite" }], danger: ["fakesite"], badges: { fakesite: "FAILED · findings" } },
  { cue: 5, layout: { ...CHECK }, edges: [{ from: "admin", to: "salespoint" }, { from: "checker", to: "salespoint" }], accent: ["salespoint"], badges: { salespoint: "ACTIVE" } },
  { cue: 6, layout: { shop: [0, 1], salespoint: [2, 1] }, edges: [{ from: "shop", to: "salespoint", broken: true, label: "new URL" }], packets: [{ from: "shop", to: "salespoint", label: "change URL", delay: 15, stopAt: 0.5 }], badges: { salespoint: "URL locked" } },
  { cue: 7, layout: { payment: [0.5, 1], salespoint: [2.5, 1] }, edges: [{ from: "payment", to: "salespoint", label: "is active?" }], packets: [{ from: "payment", to: "salespoint", label: "check", delay: 15 }], accent: ["salespoint"] },
];
