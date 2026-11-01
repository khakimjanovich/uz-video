// Lesson 21: websites: added as drafts, a foreign return address refused, the bank's check, the deal, switching on.
import { join } from "node:path";
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "../fixtures/common";
import { CHECKER, MAKER, PARTNER, SITE, boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const as = { username: SHOP.email };
const FOREIGN = "https://thanks.example.net/done";
const merchant = (sites: object[]) => ({
  ...MERCHANT_SESSION,
  "GET /api/v1/partner/me": PARTNER,
  "GET /api/v1/partner/sales-points": sites,
  "GET /api/v1/partner/sales-points/*/epos": [],
  "POST /api/v1/partner/sales-points": ({ body }: { body: { returnUrls: string[] } }) =>
    body.returnUrls.includes(FOREIGN)
      ? {
          status: 400,
          body: {
            title: "sales-point-return-url-foreign",
            status: 400,
            code: "SALES_POINT_RETURN_URL_FOREIGN",
            detail: `'${FOREIGN}' isn't on toycorner.example.com. Return URLs must be on the website's own domain.`,
          },
        }
      : { body: SITE },
});
const CHECK = { id: "c1", result: "PASSED", findings: [], checkedBy: CHECKER, checkedAt: "2026-10-06T14:00:00Z" };
const admin = (site: object, checks: object[] = []) => ({
  ...ADMIN_SESSION,
  "GET /api/v1/admin/sales-points/*": { ...SITE, ...site },
  "GET /api/v1/admin/sales-points/*/site-checks": checks,
  "GET /api/v1/admin/sales-points/*/epos": [],
  "GET /api/v1/admin/sales-points/*/logo": { contentType: "image/png", content: "" },
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/partners/*/sales-points": [{ ...SITE, ...site }],
  "GET /api/v1/admin/commissions": { items: [], page: 0, size: 200, totalItems: 0, totalPages: 0 },
  "POST /api/v1/admin/commissions/quote": () => ({ status: 404, body: { title: "no-rule", status: 404, code: "COMMISSION_NO_RULE", detail: "No fee rule applies." } }),
  "GET /api/v1/admin/refund-window-requests": [],
  "POST /api/v1/admin/sales-points/*/site-checks": CHECK,
  "PUT /api/v1/admin/sales-points/*/settings": { ...SITE, ...site },
});
const SP = "/admin/sales-points/" + SITE.id;
const card = (page: import("@playwright/test").Page, text: string) => page.locator(".mantine-Card-root", { hasText: text }).first();

async function addWebsite(page: import("@playwright/test").Page, returns: string[]) {
  await page.getByRole("button", { name: "Add website" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill("Toy Corner online");
  await dialog.getByLabel("Website").fill("https://toycorner.example.com");
  const tags = dialog.getByLabel("Return addresses");
  for (const url of returns) {
    await tags.fill(url);
    await tags.press("Enter");
  }
}

prepare();
await serve();
await shoot(
  [
    {
      name: "websites",
      path: "/merchant/sales-points",
      as,
      fixtures: merchant([]),
      act: async (page) => {
        await page.getByText("No websites yet").waitFor();
        await boxes(page, "websites", { description: page.getByText("Each website that takes payments"), add: page.getByRole("button", { name: "Add website" }).first() });
      },
    },
    {
      name: "add",
      path: "/merchant/sales-points",
      as,
      fixtures: merchant([]),
      act: async (page) => {
        await addWebsite(page, SITE.returnUrls);
        await boxes(page, "add", { dialog: page.getByRole("dialog"), returns: page.getByRole("dialog").getByText("Return addresses") });
      },
    },
    {
      name: "added",
      path: "/merchant/sales-points",
      as,
      fixtures: merchant([SITE]),
      act: async (page) => {
        await page.getByText("Toy Corner online").first().waitFor();
        await boxes(page, "added", { card: card(page, "Toy Corner online") });
      },
    },
    {
      name: "refused",
      path: "/merchant/sales-points",
      as,
      fixtures: merchant([]),
      act: async (page) => {
        await addWebsite(page, [SITE.returnUrls[0], FOREIGN]);
        await page.getByRole("dialog").getByRole("button", { name: "Add website" }).click();
        await page.getByText("Return URLs must be").first().waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "refused", { dialog: page.getByRole("dialog"), alert: page.locator(".mantine-Alert-root") });
      },
    },
    {
      name: "admin-start",
      path: SP,
      as: { username: MAKER },
      fixtures: admin({}),
      act: async (page) => {
        await page.getByText("Before it takes payments").waitFor();
        await page.waitForTimeout(500);
        await boxes(page, "start", { golive: card(page, "Before it takes payments"), switchOn: page.getByRole("button", { name: "Switch on" }), needs: page.getByText("Switching on needs") });
      },
    },
    {
      name: "admin-check",
      path: SP,
      as: { username: MAKER },
      fixtures: admin({}),
      act: async (page) => {
        const record = page.getByRole("button", { name: "Record a check" }).last();
        await record.scrollIntoViewIfNeeded();
        await page.waitForTimeout(400);
        await boxes(page, "check", { record, result: page.getByLabel("Result"), title: page.getByRole("heading", { name: "Site checks" }) });
      },
    },
    {
      name: "admin-deal",
      path: SP,
      as: { username: MAKER },
      fixtures: admin({ lastSiteCheck: CHECK }, [CHECK]),
      act: async (page) => {
        const box = page.getByLabel("Card A");
        await box.scrollIntoViewIfNeeded();
        await box.check();
        await page.waitForTimeout(300);
        await boxes(page, "deal", { title: page.getByRole("heading", { name: "Deal terms" }), box, max: page.getByLabel("Most per payment"), save: page.getByRole("button", { name: "Save" }).first() });
      },
    },
    {
      name: "admin-ready",
      path: SP,
      as: { username: MAKER },
      fixtures: admin({ lastSiteCheck: CHECK, schemes: ["UZCARD"] }, [CHECK]),
      act: async (page) => {
        await page.getByText("Before it takes payments").waitFor();
        await page.waitForTimeout(500);
        await boxes(page, "ready", { golive: card(page, "Before it takes payments"), switchOn: page.getByRole("button", { name: "Switch on" }) });
      },
    },
    {
      name: "admin-switch-on",
      path: SP,
      as: { username: MAKER },
      fixtures: admin({ lastSiteCheck: CHECK, schemes: ["UZCARD"] }, [CHECK]),
      act: async (page) => {
        await page.getByRole("button", { name: "Switch on" }).first().click();
        await page.getByRole("dialog").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "switchOn", { dialog: page.getByRole("dialog") });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-21-sales-points"),
);
