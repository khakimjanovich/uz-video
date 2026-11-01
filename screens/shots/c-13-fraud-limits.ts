// Lesson 13: a wrong code, a session out of tries (the page opens a fresh one), and a velocity refusal.
import { join } from "node:path";
import { prepare, serve, shoot } from "../harness";
import { NEXT_SESSION, PAY, REFUSALS, entry, frameApi, payPage, refusal, refusedCard, sendCode, typeCard, typeCode, confirm } from "../fixtures/m2";

const wrongCode = {
  name: "code-wrong",
  path: PAY,
  fixtures: { "GET /api/v1/pay/*": payPage(), ...frameApi({ code: REFUSALS.codeWrong }) },
  act: async (p: Parameters<typeof typeCard>[0]) => {
    await typeCard(p);
    await sendCode(p);
    await typeCode(p, "111111");
    await confirm(p);
    await p.frameLocator("iframe").locator("#message", { hasText: "Attempts left" }).waitFor();
  },
};

// The last wrong code ends the session; the page reads itself again and gets a new one.
let ended = false;
const outOfTries = {
  name: "ended",
  path: PAY,
  fixtures: {
    "GET /api/v1/pay/*": () => ({ body: payPage(ended ? { cardEntry: entry(NEXT_SESSION) } : {}) }),
    ...frameApi({
      code: () => {
        ended = true;
        return refusal(422, "SESSION_ATTEMPTS_EXCEEDED", "Too many attempts. Start again.")();
      },
    }),
  },
  act: async (p: Parameters<typeof typeCard>[0]) => {
    await typeCard(p);
    await sendCode(p);
    await typeCode(p, "111111");
    await confirm(p);
    await p.getByText("That attempt ended").waitFor();
    await p.frameLocator("iframe").locator("#pan").waitFor();
  },
};

prepare();
await serve();
await shoot(
  [wrongCode, outOfTries, refusedCard("velocity", REFUSALS.velocity)],
  join(import.meta.dir, "../../studio/public/screens/c-13-fraud-limits"),
);
