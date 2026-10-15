import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
    </>
  );
};
