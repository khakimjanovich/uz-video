// Lesson 8: what the pay page says while the adapter talks to its centre, and for each of the three outcomes.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { PAY_SHOTS } from "../fixtures/m2";

prepare();
await serve();
await shoot(
  [PAY_SHOTS.debiting, PAY_SHOTS.paid, PAY_SHOTS.declined, PAY_SHOTS.unknown],
  join(import.meta.dir, "../../studio/public/screens/c-08-adapters"),
);
