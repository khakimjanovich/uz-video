// Lesson 11: the card frame on the pay page: typing, the code, "Card accepted", the masked line; the frame
// opened on its own; the frame held by a look-alike site, refused by the browser.
import { join } from "node:path";
import { CARDS, prepare, serve, shoot } from "../harness";
import { PAY, SESSION, box, confirm, frameApi, frameMessage, holdAnswer, payPage, sendCode, typeCard, typeCode, withCard } from "../fixtures/m2";

const page = { "GET /api/v1/pay/*": payPage() };
const LOOKALIKE = "http://toycorner-pay.screens.test";

prepare();
await serve();
await shoot(
  [
    {
      name: "typed",
      path: PAY,
      fixtures: { ...page, ...frameApi() },
      act: async (p) => {
        await typeCard(p);
        await box(p, "frame", p.locator("iframe"));
        await box(p, "secure", p.getByText("Secure payment page of the bank"));
        await box(p, "badges", p.getByText("Card A").first());
      },
    },
    {
      name: "code",
      path: PAY,
      fixtures: { ...page, ...frameApi() },
      act: async (p) => {
        await typeCard(p);
        await sendCode(p);
        await typeCode(p);
      },
    },
    {
      name: "accepted",
      path: PAY,
      fixtures: { ...page, ...frameApi() },
      act: async (p) => {
        await holdAnswer(p);
        await typeCard(p);
        await sendCode(p);
        await typeCode(p);
        await confirm(p);
        await frameMessage(p, "Card accepted");
      },
    },
    {
      name: "masked",
      path: PAY,
      fixtures: { "GET /api/v1/pay/*": withCard("CARD_CONFIRMED") },
      act: async (p) => box(p, "card line", p.getByText("Example Bank")),
    },
    {
      name: "alone",
      path: PAY,
      fixtures: page,
      act: async (p) => {
        await p.goto(`${CARDS}/entry/${SESSION}?lang=en`);
        await box(p, "message", p.locator("#message"));
      },
    },
    {
      name: "lookalike",
      path: PAY,
      fixtures: page,
      act: async (p) => {
        // The frame as the card zone serves it: its policy names the one page that may hold it.
        // The browser refuses on that header alone, before the page's body counts.
        await p.route(`${CARDS}/entry/**`, (route) =>
          route.fulfill({ contentType: "text/html", body: "", headers: { "content-security-policy": "frame-ancestors http://localhost:5181" } }),
        );
        await p.route(`${LOOKALIKE}/**`, (route) =>
          route.fulfill({
            contentType: "text/html",
            body: `<!doctype html><meta charset="utf-8"><body style="font-family:sans-serif;max-width:460px;margin:40px auto"><h3>Toy Corner · Pay</h3><iframe src="${CARDS}/entry/${SESSION}?lang=en" style="width:100%;height:340px;border:1px solid #ccc"></iframe></body>`,
          }),
        );
        await p.goto(LOOKALIKE, { waitUntil: "domcontentloaded" });
        await p.waitForTimeout(1000);
        await p.evaluate(() => window.stop()); // the refused frame never counts as loaded
        await box(p, "lookalike frame", p.locator("iframe"));
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-11-card-frame"),
);
