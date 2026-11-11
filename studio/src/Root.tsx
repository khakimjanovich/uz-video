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
import { H01MapComposition } from "./reels/h-01-map";
import { H02OneIdentityComposition } from "./reels/h-02-one-identity";
import { H03IdentityWordsComposition } from "./reels/h-03-identity-words";
import { H04PerimeterComposition } from "./reels/h-04-perimeter";
import { H05AppsAndTokensComposition } from "./reels/h-05-apps-and-tokens";
import { H06ConfigurationComposition } from "./reels/h-06-configuration";
import { H07AdaptersComposition } from "./reels/h-07-adapters";
import { H08KeysComposition } from "./reels/h-08-keys";
import { H09ApiContractComposition } from "./reels/h-09-api-contract";
import { H10RegistrationComposition } from "./reels/h-10-registration";
import { H11CodesAndLimitsComposition } from "./reels/h-11-codes-and-limits";
import { H12TafVerdictComposition } from "./reels/h-12-taf-verdict";
import { H13PasswordComposition } from "./reels/h-13-password";
import { H14ConsentComposition } from "./reels/h-14-consent";
import { H15MyIdProofingComposition } from "./reels/h-15-myid-proofing";
import { H16ProveOnceComposition } from "./reels/h-16-prove-once";
import { H17VerifiedIdentityComposition } from "./reels/h-17-verified-identity";
import { H18PhoneCheckComposition } from "./reels/h-18-phone-check";
import { H19LinkingComposition } from "./reels/h-19-linking";
import { H20TrustedDeviceComposition } from "./reels/h-20-trusted-device";
import { H21AccessGrantsComposition } from "./reels/h-21-access-grants";
import { H22StepUpComposition } from "./reels/h-22-step-up";
import { H23KnownDeviceLoginComposition } from "./reels/h-23-known-device-login";
import { H24NewDeviceComposition } from "./reels/h-24-new-device";
import { H25RemoteAccessComposition } from "./reels/h-25-remote-access";
import { H26SideAppLoginComposition } from "./reels/h-26-side-app-login";
import { H27AccountLinkComposition } from "./reels/h-27-account-link";
import { H28AddressSharingComposition } from "./reels/h-28-address-sharing";
import { H29SessionsAndRankComposition } from "./reels/h-29-sessions-and-rank";
import { H30PasswordResetComposition } from "./reels/h-30-password-reset";
import { H31ThisWasNotMeComposition } from "./reels/h-31-this-was-not-me";
import { H32NumberChangesComposition } from "./reels/h-32-number-changes";
import { H33RefreshComposition } from "./reels/h-33-refresh";
import { H34BlockingComposition } from "./reels/h-34-blocking";
import { H35NotificationsComposition } from "./reels/h-35-notifications";

// One Studio folder per product (heeyMerchant, heeyID), inside it one folder per module.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="heeyMerchant">
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
      </Folder>
      <Folder name="heeyID">
        <Folder name="h1-Orientation">
          <H01MapComposition />
          <H02OneIdentityComposition />
          <H03IdentityWordsComposition />
        </Folder>
        <Folder name="h2-Foundations">
          <H04PerimeterComposition />
          <H05AppsAndTokensComposition />
          <H06ConfigurationComposition />
          <H07AdaptersComposition />
          <H08KeysComposition />
          <H09ApiContractComposition />
        </Folder>
        <Folder name="h3-Registration">
          <H10RegistrationComposition />
          <H11CodesAndLimitsComposition />
          <H12TafVerdictComposition />
          <H13PasswordComposition />
        </Folder>
        <Folder name="h4-Proofing">
          <H14ConsentComposition />
          <H15MyIdProofingComposition />
          <H16ProveOnceComposition />
          <H17VerifiedIdentityComposition />
          <H18PhoneCheckComposition />
          <H19LinkingComposition />
        </Folder>
        <Folder name="h5-Devices-and-login">
          <H20TrustedDeviceComposition />
          <H21AccessGrantsComposition />
          <H22StepUpComposition />
          <H23KnownDeviceLoginComposition />
          <H24NewDeviceComposition />
          <H25RemoteAccessComposition />
        </Folder>
        <Folder name="h6-Side-apps">
          <H26SideAppLoginComposition />
          <H27AccountLinkComposition />
          <H28AddressSharingComposition />
        </Folder>
        <Folder name="h7-Sessions-and-recovery">
          <H29SessionsAndRankComposition />
          <H30PasswordResetComposition />
          <H31ThisWasNotMeComposition />
          <H32NumberChangesComposition />
        </Folder>
        <Folder name="h8-Lifecycle-and-trail">
          <H33RefreshComposition />
          <H34BlockingComposition />
          <H35NotificationsComposition />
        </Folder>
      </Folder>
    </>
  );
};
