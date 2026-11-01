// Lesson 2: the pay page from the typed card to "Paid", the shop's payment and its give-back rule, the bank's two words, the daily report.
import { join } from "node:path";
import { pick } from "../fixtures/m01";
import { prepare, serve, shoot } from "../harness";

prepare();
await serve();
await shoot(pick("pay-typed", "pay-debiting", "pay-paid", "merchant-payments", "merchant-payment", "merchant-giveback", "admin-payments", "merchant-reports"), join(import.meta.dir, "../../studio/public/screens/c-02-card-payment"));
