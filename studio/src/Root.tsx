import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PlaygroundCodeComposition } from "./reels/_playground/code";
import { C01MapComposition } from "./reels/c-01-map";
import { C02CardPaymentComposition } from "./reels/c-02-card-payment";
import { C03CardDataWordsComposition } from "./reels/c-03-card-data-words";
import { C04PciDssComposition } from "./reels/c-04-pci-dss";
import { ModuleM01 } from "./reels/module-m01";
import { ModuleM2 } from "./reels/module-m2";
import { ModuleM45 } from "./reels/module-m45";
import { ModuleM6 } from "./reels/module-m6";
import { ModuleM78 } from "./reels/module-m78";

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
      <ModuleM01 />
      <ModuleM2 />
      <ModuleM45 />
      <ModuleM6 />
      <ModuleM78 />
    </>
  );
};

