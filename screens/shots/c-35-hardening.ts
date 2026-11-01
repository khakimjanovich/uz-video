// Lesson 35: a website's limits set in the bank's portal, shown in the merchant's, and a payment link above
// the per-payment limit refused.
import { join } from "node:path";
import { ADMIN_SESSION, MERCHANT_SESSION } from "../fixtures/common";
import { ADMIN_LOOKUPS, boxes, PARTNER, SHOP_SITE, SITES, tidy } from "../fixtures/m78";
import { prepare, serve, shoot } from "../harness";

const LIMITED = { ...SHOP_SITE, maxPaymentAmount: 500_000, dailyLimit: 5_000_000 };
const merchant = {
  as: { username: "owner@toycorner.example.com" },
  fixtures: {
    ...MERCHANT_SESSION,
    "GET /api/v1/partner/me": PARTNER,
    "GET /api/v1/partner/sales-points": [LIMITED, SITES[1]],
    "GET /api/v1/partner/sales-points/*/epos": [],
    "GET /api/v1/partner/payment-links": { items: [], page: 0, size: 20, totalItems: 0, totalPages: 0 },
    "POST /api/v1/partner/payment-links": () => ({
      status: 422,
      body: { title: "Not done", status: 422, code: "PAYMENT_AMOUNT_ABOVE_LIMIT", detail: "This website takes at most 5,000.00 in one payment." },
    }),
  } as Record<string, unknown>,
};

prepare();
await serve();
await shoot(
  [
    {
      name: "deal-terms",
      path: `/admin/sales-points/${SHOP_SITE.id}`,
      as: { username: "sara" },
      fixtures: {
        ...ADMIN_SESSION,
        ...ADMIN_LOOKUPS,
        "GET /api/v1/admin/sales-points/*/epos": [],
        "GET /api/v1/admin/sales-points/*/site-checks": [],
        "GET /api/v1/admin/commissions": { items: [], page: 0, size: 20, totalItems: 0, totalPages: 0 },
      },
      act: async (p) => {
        const card = p.locator("#deal-terms");
        await card.evaluate((e) => e.scrollIntoView({ block: "center" }));
        await card.getByLabel("Most per payment").fill("5000");
        await card.getByLabel("Most per day").fill("50000");
        await p.locator("body").click({ position: { x: 5, y: 890 } });
        await p.waitForTimeout(300);
        await tidy(p);
        await boxes(p, "deal-terms", { card: "#deal-terms", fields: "#deal-terms .mantine-Group-root >> nth=1", save: "#deal-terms button[type=submit]" });
      },
    },
    {
      name: "websites",
      path: "/merchant/sales-points",
      ...merchant,
      wait: "text=Limits",
      act: async (p) => {
        await tidy(p);
        await boxes(p, "websites", { limits: "text=a payment ·", label: "text=Limits" });
      },
    },
    {
      name: "link-refused",
      path: "/merchant/payment-links",
      ...merchant,
      act: async (p) => {
        await p.locator("button:has-text('New link')").first().click();
        const modal = p.locator(".mantine-Modal-content");
        await modal.getByLabel("Website").click();
        await p.getByRole("option", { name: "Toy Corner online" }).last().click();
        await modal.getByLabel("Amount").fill("7500");
        await modal.getByLabel("What the buyer pays for").fill("Wooden castle, large");
        await modal.locator("button[type=submit]").click();
        await modal.locator(".mantine-Alert-root").waitFor();
        await p.waitForTimeout(300);
        await tidy(p);
        await boxes(p, "link-refused", { modal: ".mantine-Modal-content", alert: ".mantine-Modal-content .mantine-Alert-root", amount: ".mantine-Modal-content label:has-text('Amount')" });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-35-hardening"),
);
