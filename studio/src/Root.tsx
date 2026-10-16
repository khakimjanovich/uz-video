import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { Ep01GatewayComposition } from "./reels/ep01-gateway";
import { Ep01GatewayUzComposition } from "./reels/ep01-gateway-uz";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <Ep01GatewayComposition />
      <Ep01GatewayUzComposition />
    </>
  );
};
