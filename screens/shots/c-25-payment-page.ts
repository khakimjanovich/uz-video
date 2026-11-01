// Lesson 25: the bank's payment page, from opening to a closed or expired link.
import { join } from "node:path";
import { CARD_DONE, CARD_MESSAGE, PAID, boxes, fromFrame, payPage, problem } from "../fixtures/m6";
import { CARDS, prepare, serve, shoot } from "../harness";

const PAGE = "/pay/pt_9QmXv2LkT7rYw4Hn";
const frameUp = async (page: Parameters<typeof fromFrame>[0]) => {
  await page.frameLocator("iframe").locator("input").first().waitFor();
  await page.waitForTimeout(800);
};
let session = 0; // the page read again after a session ended brings a new one
const newSession = () => {
  session += 1;
  const id = `4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5${session}`;
  return { body: payPage({ cardEntry: { frameUrl: `${CARDS}/entry/${id}`, sessionId: id, expiresAt: new Date(Date.now() + 600_000).toISOString() } })["GET /api/v1/pay/*"] };
};

prepare();
await serve();
await shoot(
  [
    {
      name: "open",
      path: PAGE,
      fixtures: payPage(),
      act: async (page) => {
        await frameUp(page);
        await boxes(page, "open", ["Secure payment page", "Toy Corner", "Order ORDER-1042", "To pay", "Card A", "Valid until"]);
        const f = await page.locator("iframe").boundingBox();
        console.log("  open · frame:", f && [f.x, f.y, f.width, f.height].map(Math.round).join(", "));
      },
    },
    {
      name: "busy",
      path: PAGE,
      fixtures: { ...payPage(), "POST /api/v1/pay/*/card": problem(409, "PAYMENT_PAGE_BUSY", "The previous step is still running. Wait a moment and try again.") },
      act: async (page) => {
        await frameUp(page);
        await fromFrame(page, CARD_MESSAGE);
        await page.getByText("The previous step").waitFor();
        await frameUp(page);
        await boxes(page, "busy", ["The previous step"]);
      },
    },
    {
      name: "ended",
      path: PAGE,
      fixtures: { "GET /api/v1/pay/*": newSession },
      act: async (page) => {
        await frameUp(page);
        await fromFrame(page, { v: 1, ended: true });
        await page.getByText("That attempt ended").waitFor();
        await frameUp(page);
        await boxes(page, "ended", ["That attempt ended"]);
      },
    },
    { name: "closed", path: PAGE, fixtures: payPage({ status: "FAILED", ...CARD_DONE }), wait: "text=Payment page closed" },
    {
      name: "expired",
      path: PAGE,
      fixtures: { "GET /api/v1/pay/*": problem(410, "PAYMENT_PAGE_EXPIRED", "This payment link has expired. Ask the shop for a new one.") },
      wait: "text=This link has expired",
    },
    {
      name: "paid",
      path: PAGE,
      fixtures: payPage({ status: "PAID", ...CARD_DONE, rrn: PAID.rrn }),
      act: async (page) => boxes(page, "paid", ["Back to the shop"]),
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-25-payment-page"),
);
