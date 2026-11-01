import React from "react";
import { C05TwoUnitsComposition } from "./c-05-two-units";
import { C06ConfigurationComposition } from "./c-06-configuration";
import { C07IdentityComposition } from "./c-07-identity";

// This module's lesson compositions, registered in Root.tsx in course order.
export const ModuleM01: React.FC = () => (
  <>
    <C05TwoUnitsComposition />
    <C06ConfigurationComposition />
    <C07IdentityComposition />
  </>
);
