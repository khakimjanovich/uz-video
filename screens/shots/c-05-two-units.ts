// Lesson 5: the bank's card reader on the pay page, from card to "Paid", an ended attempt, the bank's row.
import { join } from "node:path";
import { pick } from "../fixtures/m01";
import { prepare, serve, shoot } from "../harness";

prepare();
await serve();
await shoot(pick("pay-card", "pay-typed", "pay-debiting", "pay-paid", "pay-ended", "admin-payments"), join(import.meta.dir, "../../studio/public/screens/c-05-two-units"));
