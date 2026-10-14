import React from "react";
import { P2PTransferComposition } from "./reels/p2p-transfer";
import { CardTokenizationComposition } from "./reels/card-tokenization";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <P2PTransferComposition />
      <CardTokenizationComposition />
    </>
  );
};
