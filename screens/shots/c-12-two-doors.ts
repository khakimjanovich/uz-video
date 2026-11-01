// Lesson 12: what a buyer meets at the payers' door: the frame, and its answer to sending too fast.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { PAY_SHOTS, REFUSALS, refusedCard } from "../fixtures/m2";

prepare();
await serve();
await shoot(
  [PAY_SHOTS.typed, refusedCard("too-fast", REFUSALS.rateLimited)],
  join(import.meta.dir, "../../studio/public/screens/c-12-two-doors"),
);
