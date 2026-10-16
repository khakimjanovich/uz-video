import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { Ep01GatewayComposition } from "./reels/ep01-gateway";
import { Ep01GatewayUzComposition } from "./reels/ep01-gateway-uz";
import { Ep02OnboardingComposition } from "./reels/ep02-onboarding";
import { Ep02OnboardingUzComposition } from "./reels/ep02-onboarding-uz";
import { Ep03S2sComposition } from "./reels/ep03-s2s";
import { Ep03S2sUzComposition } from "./reels/ep03-s2s-uz";
import { Ep04DebitComposition } from "./reels/ep04-debit";
import { Ep04DebitUzComposition } from "./reels/ep04-debit-uz";
import { Ep05StatusComposition } from "./reels/ep05-status";
import { Ep05StatusUzComposition } from "./reels/ep05-status-uz";
import { Ep06LinksComposition } from "./reels/ep06-links";
import { Ep06LinksUzComposition } from "./reels/ep06-links-uz";
import { Ep07SettlementComposition } from "./reels/ep07-settlement";
import { Ep07SettlementUzComposition } from "./reels/ep07-settlement-uz";
import { T201FourEyesComposition } from "./reels/t2-01-four-eyes";
import { T201FourEyesUzComposition } from "./reels/t2-01-four-eyes-uz";
import { T202CommissionComposition } from "./reels/t2-02-commission";
import { T202CommissionUzComposition } from "./reels/t2-02-commission-uz";
import { T203SafeRequestsComposition } from "./reels/t2-03-safe-requests";
import { T203SafeRequestsUzComposition } from "./reels/t2-03-safe-requests-uz";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <Ep01GatewayComposition />
      <Ep01GatewayUzComposition />
      <Ep02OnboardingComposition />
      <Ep02OnboardingUzComposition />
      <Ep03S2sComposition />
      <Ep03S2sUzComposition />
      <Ep04DebitComposition />
      <Ep04DebitUzComposition />
      <Ep05StatusComposition />
      <Ep05StatusUzComposition />
      <Ep06LinksComposition />
      <Ep06LinksUzComposition />
      <Ep07SettlementComposition />
      <Ep07SettlementUzComposition />
      <T201FourEyesComposition />
      <T201FourEyesUzComposition />
      <T202CommissionComposition />
      <T202CommissionUzComposition />
      <T203SafeRequestsComposition />
      <T203SafeRequestsUzComposition />
    </>
  );
};
