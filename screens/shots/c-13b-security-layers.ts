// Lesson 13b: one buyer's payment with every layer at work, and the card form while Vault waits for its keyholders.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { PAY_SHOTS } from "../fixtures/m2";

prepare();
await serve();
await shoot(
  [PAY_SHOTS.typed, PAY_SHOTS.code, PAY_SHOTS.accepted, PAY_SHOTS.masked, PAY_SHOTS.paid, PAY_SHOTS.vaultDown],
  join(import.meta.dir, "../../studio/public/screens/c-13b-security-layers"),
);
