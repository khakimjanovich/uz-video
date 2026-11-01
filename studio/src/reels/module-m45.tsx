import React from "react";
import { C16RegistrationComposition } from "./c-16-registration";
import { C17LifecycleComposition } from "./c-17-lifecycle";
import { C18FourEyesComposition } from "./c-18-four-eyes";
import { C19ApiClientsComposition } from "./c-19-api-clients";
import { C20MerchantUsersComposition } from "./c-20-merchant-users";
import { C21SalesPointsComposition } from "./c-21-sales-points";
import { C22CommissionComposition } from "./c-22-commission";
import { C23EposComposition } from "./c-23-epos";

// This module's lesson compositions, registered in Root.tsx in course order.
export const ModuleM45: React.FC = () => (
  <>
    <C16RegistrationComposition />
    <C17LifecycleComposition />
    <C18FourEyesComposition />
    <C19ApiClientsComposition />
    <C20MerchantUsersComposition />
    <C21SalesPointsComposition />
    <C22CommissionComposition />
    <C23EposComposition />
  </>
);
