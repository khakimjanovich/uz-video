// Lesson 10: the networks a shop accepts, a card from another network, unknown first digits, then a card that fits.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { PAY_SHOTS, REFUSALS, refusedCard } from "../fixtures/m2";

prepare();
await serve();
await shoot(
  [
    { ...PAY_SHOTS.typed, name: "networks", act: undefined },
    refusedCard("not-accepted", REFUSALS.notAccepted, "5500123456781234"),
    refusedCard("unknown-digits", REFUSALS.unknownDigits, "7700123456781234"),
    PAY_SHOTS.typed,
    PAY_SHOTS.code,
    PAY_SHOTS.accepted,
    PAY_SHOTS.masked,
  ],
  join(import.meta.dir, "../../studio/public/screens/c-10-bin-directory"),
);
