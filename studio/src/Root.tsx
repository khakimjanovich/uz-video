import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PlaygroundCodeComposition } from "./reels/_playground/code";
import { C01MapComposition } from "./reels/c-01-map";
import { C02CardPaymentComposition } from "./reels/c-02-card-payment";
import { C03CardDataWordsComposition } from "./reels/c-03-card-data-words";
import { C04PciDssComposition } from "./reels/c-04-pci-dss";
import { C12TwoDoorsComposition } from "./reels/c-12-two-doors";
import { C13FraudLimitsComposition } from "./reels/c-13-fraud-limits";
import { C14ProjectSetupComposition } from "./reels/c-14-project-setup";
import { C15DomainContractDatabaseComposition } from "./reels/c-15-domain-contract-database";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <PlaygroundCodeComposition />
      <C01MapComposition />
      <C02CardPaymentComposition />
      <C03CardDataWordsComposition />
      <C04PciDssComposition />
      <C12TwoDoorsComposition />
      <C13FraudLimitsComposition />
      <C14ProjectSetupComposition />
      <C15DomainContractDatabaseComposition />
      <PitchOwnersComposition />
      <PitchOwnersUzComposition />
    </>
  );
};

