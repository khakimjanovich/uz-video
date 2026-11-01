// Lesson 29: payment links: the page, the form, the link shown once, the list by role, the buyer paying.
import { join } from "node:path";
import { CARD_DONE, OWNER, PARTNER, WEBSITE, at, boxes, payPage, problem } from "../fixtures/m6";
import { MERCHANT_SESSION } from "../fixtures/common";
import { APP, prepare, serve, shoot, type Fixtures } from "../harness";

type Page = Parameters<typeof boxes>[0];
const link = (over: Record<string, unknown>) => ({
  id: "c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e01",
  salesPointId: WEBSITE.id,
  orderId: "LINK-0007",
  amount: 18000000,
  description: "Hand-knitted scarf, blue",
  state: "CREATED",
  status: "CREATED",
  expiresAt: at(24 * 60),
  createdAt: at(-1),
  testMode: false,
  ...over,
});
const older = [
  link({ id: "c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e02", orderId: "LINK-0006", description: "Wooden puzzle box", amount: 9500000, state: "PAID", status: "PAID", paidAt: at(-26 * 60) }),
  link({ id: "c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e03", orderId: "LINK-0005", description: "Knitted bear", amount: 12000000, state: "EXPIRED", status: "EXPIRED", expiresAt: at(-50 * 60) }),
];
const links = (list: unknown[], role = "ADMIN", websites = [WEBSITE]): Fixtures => ({
  ...MERCHANT_SESSION,
  "GET /api/v1/session": { admin: false, merchantRole: role },
  "GET /api/v1/partner/me": PARTNER,
  "GET /api/v1/partner/sales-points": websites,
  "GET /api/v1/partner/payment-links": list,
});
const URL_ONCE = "https://pay.example.com/p/pt_Hk7Qm2Zr9VxL4bNw8TcY3sDf";
/** The amount field's currency suffix is in the page's code, not its strings: drop it for the screenshot. */
async function noCurrency(page: Page) {
  await page.route(`${APP}/src/pages/merchant/PaymentLinksPage.tsx*`, async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).split('" UZS"').join('""') });
  });
  await page.reload({ waitUntil: "networkidle" });
}
async function fill(page: Page, hours = "24 hours") {
  await noCurrency(page);
  await page.getByRole("button", { name: "New link" }).click();
  await page.getByRole("dialog").getByLabel("Website").click();
  await page.getByRole("option", { name: "Toy Corner online" }).click();
  await page.getByRole("dialog").getByLabel("Amount").fill("180000");
  await page.getByRole("dialog").getByLabel("What the buyer pays for").fill("Hand-knitted scarf, blue");
  if (hours !== "24 hours") {
    await page.getByRole("dialog").getByLabel("Works for").click();
    await page.getByRole("option", { name: hours }).click();
  }
  await page.waitForTimeout(300);
}
const modal = async (page: Page, name: string) => {
  const m = await page.locator(".mantine-Modal-content").boundingBox();
  console.log(`  ${name} · modal:`, m && [m.x, m.y, m.width, m.height].map(Math.round).join(", "));
};

prepare();
await serve();
await shoot(
  [
    { name: "page", path: "/merchant/payment-links", as: OWNER, fixtures: links(older), act: (p) => boxes(p, "page", ["Sell in a chat", "New link"]) },
    {
      name: "no-live",
      path: "/merchant/payment-links",
      as: OWNER,
      fixtures: links(older, "ADMIN", [{ ...WEBSITE, status: "DRAFT" }]),
      act: async (page) => {
        await page.getByRole("button", { name: "New link" }).click();
        await page.getByText("None of your websites").waitFor();
        await modal(page, "no-live");
        await boxes(page, "no-live", ["None of your websites"]);
      },
    },
    {
      name: "form",
      path: "/merchant/payment-links",
      as: OWNER,
      fixtures: links(older),
      act: async (page) => {
        await fill(page);
        await modal(page, "form");
        await boxes(page, "form", ["Works for", "Amount"]);
      },
    },
    {
      name: "too-long",
      path: "/merchant/payment-links",
      as: OWNER,
      fixtures: { ...links(older), "POST /api/v1/partner/payment-links": problem(422, "PAYMENT_LINK_TOO_LONG", "A payment link may work for at most 72 hours.") },
      act: async (page) => {
        await fill(page, "168 hours");
        await page.getByRole("dialog").getByRole("button", { name: "New link" }).click();
        await page.getByText("at most 72 hours").waitFor();
        await modal(page, "too-long");
        await boxes(page, "too-long", ["at most 72 hours"]);
      },
    },
    ...(["ready", "copied"] as const).map((name) => ({
      name,
      path: "/merchant/payment-links",
      as: OWNER,
      fixtures: { ...links(older), "POST /api/v1/partner/payment-links": () => ({ body: { ...link({}), url: URL_ONCE } }) },
      act: async (page: Page) => {
        await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: APP });
        await fill(page);
        await page.getByRole("dialog").getByRole("button", { name: "New link" }).click();
        await page.getByText("Your link is ready").waitFor();
        await page.waitForTimeout(400);
        if (name === "copied") {
          await page.getByRole("button", { name: "Copy link" }).click();
          await page.getByText("Copied").waitFor();
        }
        await modal(page, name);
        await boxes(page, name, ["shown only once", "Copy link", "Copied"]);
      },
    })),
    { name: "list-new", path: "/merchant/payment-links", as: OWNER, fixtures: links([link({}), ...older]), act: (p) => boxes(p, "list-new", ["Hand-knitted scarf", "Waiting for the buyer"]) },
    { name: "viewer", path: "/merchant/payment-links", as: OWNER, fixtures: links([link({}), ...older], "OBSERVER"), wait: "text=Hand-knitted scarf" },
    {
      name: "buyer-open",
      path: "/pay/pt_Hk7Qm2Zr9VxL4bNw8TcY3sDf",
      fixtures: payPage({ orderId: "LINK-0007", amount: 18000000, description: "Hand-knitted scarf, blue", returnUrl: undefined, expiresAt: at(24 * 60) }),
      act: async (page) => {
        await page.frameLocator("iframe").locator("input").first().waitFor();
        await page.waitForTimeout(800);
      },
    },
    {
      name: "buyer-paid",
      path: "/pay/pt_Hk7Qm2Zr9VxL4bNw8TcY3sDf",
      fixtures: payPage({ status: "PAID", ...CARD_DONE, rrn: "604512873355", orderId: "LINK-0007", amount: 18000000, description: "Hand-knitted scarf, blue", returnUrl: undefined }),
      wait: "text=Reference number",
    },
    {
      name: "list-paid",
      path: "/merchant/payment-links",
      as: OWNER,
      fixtures: links([link({ state: "PAID", status: "PAID", paidAt: at(-1) }), link({ id: "c1d2e3f4-0a1b-4c2d-8e3f-5a6b7c8d9e04", orderId: "LINK-0008", description: "Felt slippers", amount: 7000000, state: "EXPIRED", status: "EXPIRED", expiresAt: at(-30) }), ...older]),
      act: (p) => boxes(p, "list-paid", ["Hand-knitted scarf", "Felt slippers"]),
    },
    {
      name: "buyer-expired",
      path: "/pay/pt_Lm3Pq8Xw2ZrT6vBn1KcJ5hGd",
      fixtures: { "GET /api/v1/pay/*": problem(410, "PAYMENT_PAGE_EXPIRED", "This payment link has expired. Ask the shop for a new one.") },
      wait: "text=This link has expired",
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-29-payment-links"),
);
