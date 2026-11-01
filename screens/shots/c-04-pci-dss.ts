// Lesson 4: the card form as the room's first door, masked numbers in the bank's list.
import { join } from "node:path";
import { pick } from "../fixtures/m01";
import { prepare, serve, shoot } from "../harness";

prepare();
await serve();
await shoot(pick("pay-card", "pay-typed", "admin-payments"), join(import.meta.dir, "../../studio/public/screens/c-04-pci-dss"));
