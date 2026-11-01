// Lesson 24b: one payment for the order after a retry with the same idempotency key.
import { join } from "node:path";
import { OWNER, merchantPayments, payment } from "../fixtures/m6";
import { prepare, serve, shoot } from "../harness";

prepare();
await serve();
await shoot(
  [{ name: "payments-one", path: "/merchant/payments", as: OWNER, fixtures: merchantPayments(payment()), wait: "text=ORDER-1042" }],
  join(import.meta.dir, "../../studio/public/screens/c-24b-idempotency"),
);
