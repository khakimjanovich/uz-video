import "./index.css";
import React from "react";
import { Folder } from "remotion";
import { C01MapComposition } from "./reels/c-01-map";
import { C02CardPaymentComposition } from "./reels/c-02-card-payment";
import { C03CardDataWordsComposition } from "./reels/c-03-card-data-words";
import { C04PciDssComposition } from "./reels/c-04-pci-dss";
import { C05TwoUnitsComposition } from "./reels/c-05-two-units";
import { C06ConfigurationComposition } from "./reels/c-06-configuration";
import { C07IdentityComposition } from "./reels/c-07-identity";
import { C08AdaptersComposition } from "./reels/c-08-adapters";
import { C09CardVaultComposition } from "./reels/c-09-card-vault";
import { C10BinDirectoryComposition } from "./reels/c-10-bin-directory";
import { C11CardFrameComposition } from "./reels/c-11-card-frame";
import { C12TwoDoorsComposition } from "./reels/c-12-two-doors";
import { C12bCertificateExchangeComposition } from "./reels/c-12b-certificate-exchange";
import { C13FraudLimitsComposition } from "./reels/c-13-fraud-limits";
import { C13bSecurityLayersComposition } from "./reels/c-13b-security-layers";
import { C16RegistrationComposition } from "./reels/c-16-registration";
import { C17LifecycleComposition } from "./reels/c-17-lifecycle";
import { C18FourEyesComposition } from "./reels/c-18-four-eyes";
import { C19ApiClientsComposition } from "./reels/c-19-api-clients";
import { C20MerchantUsersComposition } from "./reels/c-20-merchant-users";
import { C21SalesPointsComposition } from "./reels/c-21-sales-points";
import { C22CommissionComposition } from "./reels/c-22-commission";
import { C23EposComposition } from "./reels/c-23-epos";
import { C24SignedRequestsComposition } from "./reels/c-24-signed-requests";
import { C24bIdempotencyComposition } from "./reels/c-24b-idempotency";
import { C25PaymentPageComposition } from "./reels/c-25-payment-page";
import { C26DebitComposition } from "./reels/c-26-debit";
import { C27SilenceComposition } from "./reels/c-27-silence";
import { C28OutboxWebhooksComposition } from "./reels/c-28-outbox-webhooks";
import { C28bWebhooksComposition } from "./reels/c-28b-webhooks";
import { C29PaymentLinksComposition } from "./reels/c-29-payment-links";
import { C30RefundsComposition } from "./reels/c-30-refunds";
import { C31ObservabilityComposition } from "./reels/c-31-observability";
import { C32DailyReportsComposition } from "./reels/c-32-daily-reports";
import { C33DisputesComposition } from "./reels/c-33-disputes";
import { C34ReconciliationComposition } from "./reels/c-34-reconciliation";
import { C35HardeningComposition } from "./reels/c-35-hardening";
import { C36InstallingComposition } from "./reels/c-36-installing";
import { C36bOneInstallComposition } from "./reels/c-36b-one-install";
import { C37ReleasesComposition } from "./reels/c-37-releases";
import { C38ResponsibilityComposition } from "./reels/c-38-responsibility";

// The course in order: one Studio folder per module, lessons numbered 1–41 straight through.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="1-Orientation">
        <C01MapComposition />
        <C02CardPaymentComposition />
        <C03CardDataWordsComposition />
      </Folder>
      <Folder name="2-Security-and-configuration">
        <C04PciDssComposition />
        <C05TwoUnitsComposition />
        <C06ConfigurationComposition />
        <C07IdentityComposition />
      </Folder>
      <Folder name="3-The-card-zone">
        <C08AdaptersComposition />
        <C09CardVaultComposition />
        <C10BinDirectoryComposition />
        <C11CardFrameComposition />
        <C12TwoDoorsComposition />
        <C12bCertificateExchangeComposition />
        <C13FraudLimitsComposition />
        <C13bSecurityLayersComposition />
      </Folder>
      <Folder name="4-Merchants-and-money-rules">
        <C16RegistrationComposition />
        <C17LifecycleComposition />
        <C18FourEyesComposition />
        <C19ApiClientsComposition />
        <C20MerchantUsersComposition />
        <C21SalesPointsComposition />
        <C22CommissionComposition />
        <C23EposComposition />
      </Folder>
      <Folder name="5-Payments">
        <C24SignedRequestsComposition />
        <C24bIdempotencyComposition />
        <C25PaymentPageComposition />
        <C26DebitComposition />
        <C27SilenceComposition />
        <C28OutboxWebhooksComposition />
        <C28bWebhooksComposition />
        <C29PaymentLinksComposition />
        <C30RefundsComposition />
      </Folder>
      <Folder name="6-Operations">
        <C31ObservabilityComposition />
        <C32DailyReportsComposition />
        <C33DisputesComposition />
        <C34ReconciliationComposition />
        <C35HardeningComposition />
      </Folder>
      <Folder name="7-Delivery">
        <C36InstallingComposition />
        <C36bOneInstallComposition />
        <C37ReleasesComposition />
        <C38ResponsibilityComposition />
      </Folder>
    </>
  );
};
