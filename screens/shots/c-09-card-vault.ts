// Lesson 9: what each side of the locked room sees: "Card accepted", the masked line, a refusal while Vault is down.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { PAY_SHOTS } from "../fixtures/m2";

prepare();
await serve();
await shoot(
  [PAY_SHOTS.code, PAY_SHOTS.accepted, PAY_SHOTS.masked, PAY_SHOTS.vaultDown],
  join(import.meta.dir, "../../studio/public/screens/c-09-card-vault"),
);
