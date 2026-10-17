import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";
import { Yt00MapComposition } from "./reels/yt-00-map";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <PitchOwnersComposition />
      <PitchOwnersUzComposition />
      <Yt00MapComposition />
    </>
  );
};

