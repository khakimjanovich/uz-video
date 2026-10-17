import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";
import { Yt00MapComposition } from "./reels/yt-00-map";

import { Yt01AcquiringComposition } from "./reels/yt-01-acquiring";

import { Yt02SetupComposition } from "./reels/yt-02-setup";

import { Yt03MethodComposition } from "./reels/yt-03-method";

// Register reels here, e.g. <MyReelComposition /> from "./reels/my-reel".
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <PlaygroundComposition />
      <PitchOwnersComposition />
      <PitchOwnersUzComposition />
      <Yt00MapComposition />
      <Yt01AcquiringComposition />
      <Yt02SetupComposition />
      <Yt03MethodComposition />
    </>
  );
};

