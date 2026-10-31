import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PlaygroundCodeComposition } from "./reels/_playground/code";
import { C01MapComposition } from "./reels/c-01-map";
import { C04PciDssComposition } from "./reels/c-04-pci-dss";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <PlaygroundCodeComposition />
      <C01MapComposition />
      <C04PciDssComposition />
      <PitchOwnersComposition />
      <PitchOwnersUzComposition />
    </>
  );
};

