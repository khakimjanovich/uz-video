import "./index.css";
import React from "react";
import { PlaygroundComposition } from "./reels/_playground";
import { PitchOwnersComposition } from "./reels/pitch-owners";
import { PitchOwnersUzComposition } from "./reels/pitch-owners-uz";
import { Yt00MapComposition } from "./reels/yt-00-map";

import { Yt01AcquiringComposition } from "./reels/yt-01-acquiring";

import { Yt02SetupComposition } from "./reels/yt-02-setup";

import { Yt03MethodComposition } from "./reels/yt-03-method";

import { Yt04RegistrationComposition } from "./reels/yt-04-registration";

import { Yt05LifecycleComposition } from "./reels/yt-05-lifecycle";

import { Yt06FourEyesComposition } from "./reels/yt-06-four-eyes";

import { Yt07KeycloakComposition } from "./reels/yt-07-keycloak";

import { Yt08SalesPointsComposition } from "./reels/yt-08-sales-points";

import { Yt09StartersComposition } from "./reels/yt-09-starters";

import { Yt10CommissionComposition } from "./reels/yt-10-commission";

import { Yt11TerminalsComposition } from "./reels/yt-11-terminals";

import { Yt12AdaptersComposition } from "./reels/yt-12-adapters";

import { Yt13CardVaultComposition } from "./reels/yt-13-card-vault";

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
      <Yt04RegistrationComposition />
      <Yt05LifecycleComposition />
      <Yt06FourEyesComposition />
      <Yt07KeycloakComposition />
      <Yt08SalesPointsComposition />
      <Yt09StartersComposition />
      <Yt10CommissionComposition />
      <Yt11TerminalsComposition />
      <Yt12AdaptersComposition />
      <Yt13CardVaultComposition />
    </>
  );
};

