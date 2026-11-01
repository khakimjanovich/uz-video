import React from "react";
import { C31ObservabilityComposition } from "./c-31-observability";
import { C32DailyReportsComposition } from "./c-32-daily-reports";
import { C33DisputesComposition } from "./c-33-disputes";
import { C34ReconciliationComposition } from "./c-34-reconciliation";
import { C35HardeningComposition } from "./c-35-hardening";
import { C36InstallingComposition } from "./c-36-installing";
import { C36bOneInstallComposition } from "./c-36b-one-install";
import { C37ReleasesComposition } from "./c-37-releases";
import { C38ResponsibilityComposition } from "./c-38-responsibility";

// This module's lesson compositions, registered in Root.tsx in course order.
export const ModuleM78: React.FC = () => (
  <>
    <C31ObservabilityComposition />
    <C32DailyReportsComposition />
    <C33DisputesComposition />
    <C34ReconciliationComposition />
    <C35HardeningComposition />
    <C36InstallingComposition />
    <C36bOneInstallComposition />
    <C37ReleasesComposition />
    <C38ResponsibilityComposition />
  </>
);
