import React from "react";
import { C08AdaptersComposition } from "./c-08-adapters";
import { C09CardVaultComposition } from "./c-09-card-vault";
import { C10BinDirectoryComposition } from "./c-10-bin-directory";
import { C11CardFrameComposition } from "./c-11-card-frame";
import { C12TwoDoorsComposition } from "./c-12-two-doors";
import { C12bCertificateExchangeComposition } from "./c-12b-certificate-exchange";
import { C13FraudLimitsComposition } from "./c-13-fraud-limits";
import { C13bSecurityLayersComposition } from "./c-13b-security-layers";

// This module's lesson compositions, registered in Root.tsx in course order.
export const ModuleM2: React.FC = () => (
  <>
    <C08AdaptersComposition />
    <C09CardVaultComposition />
    <C10BinDirectoryComposition />
    <C11CardFrameComposition />
    <C12TwoDoorsComposition />
    <C12bCertificateExchangeComposition />
    <C13FraudLimitsComposition />
    <C13bSecurityLayersComposition />
  </>
);
