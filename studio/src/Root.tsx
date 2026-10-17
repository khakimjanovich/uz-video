import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";
import { Ep01GatewayComposition } from "./reels/ep01-gateway";
import { Ep02OnboardingComposition } from "./reels/ep02-onboarding";
import { Ep03S2sComposition } from "./reels/ep03-s2s";
import { Ep04DebitComposition } from "./reels/ep04-debit";
import { Ep05StatusComposition } from "./reels/ep05-status";
import { Ep06LinksComposition } from "./reels/ep06-links";
import { Ep07SettlementComposition } from "./reels/ep07-settlement";
import { T200DeepDivesComposition } from "./reels/t2-00-deep-dives";
import { T201FourEyesComposition } from "./reels/t2-01-four-eyes";
import { T202CommissionComposition } from "./reels/t2-02-commission";
import { T203SafeRequestsComposition } from "./reels/t2-03-safe-requests";
import { T204CardSafetyComposition } from "./reels/t2-04-card-safety";
import { T205DebitComposition } from "./reels/t2-05-debit";
import { T206UnknownComposition } from "./reels/t2-06-unknown";
import { T207DeclinesComposition } from "./reels/t2-07-declines";
import { T208RefundComposition } from "./reels/t2-08-refund";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <PitchOwnersComposition />
      <PitchOwnersUzComposition />
      <Ep01GatewayComposition />
      <Ep02OnboardingComposition />
      <Ep03S2sComposition />
      <Ep04DebitComposition />
      <Ep05StatusComposition />
      <Ep06LinksComposition />
      <Ep07SettlementComposition />
      <T200DeepDivesComposition />
      <T201FourEyesComposition />
      <T202CommissionComposition />
      <T203SafeRequestsComposition />
      <T204CardSafetyComposition />
      <T205DebitComposition />
      <T206UnknownComposition />
      <T207DeclinesComposition />
      <T208RefundComposition />
    </>
  );
};

