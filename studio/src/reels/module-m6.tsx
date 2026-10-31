import React from "react";
import { C24SignedRequestsComposition } from "./c-24-signed-requests";
import { C24bIdempotencyComposition } from "./c-24b-idempotency";
import { C25PaymentPageComposition } from "./c-25-payment-page";
import { C26DebitComposition } from "./c-26-debit";
import { C27SilenceComposition } from "./c-27-silence";
import { C28OutboxWebhooksComposition } from "./c-28-outbox-webhooks";
import { C28bWebhooksComposition } from "./c-28b-webhooks";
import { C29PaymentLinksComposition } from "./c-29-payment-links";
import { C30RefundsComposition } from "./c-30-refunds";

// This module's lesson compositions, registered in Root.tsx in course order.
export const ModuleM6: React.FC = () => (
  <>
    <C24SignedRequestsComposition />
    <C24bIdempotencyComposition />
    <C25PaymentPageComposition />
    <C26DebitComposition />
    <C27SilenceComposition />
    <C28OutboxWebhooksComposition />
    <C28bWebhooksComposition />
    <C29PaymentLinksComposition />
    <C30RefundsComposition />
  </>
);
