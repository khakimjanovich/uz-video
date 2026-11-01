// Lesson 3: the card form with no code box, the short card line, masked numbers in the bank's list.
import { join } from "node:path";
import { pick } from "../fixtures/m01";
import { prepare, serve, shoot } from "../harness";

prepare();
await serve();
await shoot(pick("pay-card", "pay-typed", "pay-debiting", "admin-payments"), join(import.meta.dir, "../../studio/public/screens/c-03-card-data-words"));
