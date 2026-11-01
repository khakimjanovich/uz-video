// Sample data for Lessons 31–38: Toy Corner's two websites, its payments, disputes and reconciliation.
import { SHOP } from "./common";

export const PARTNER = { ...SHOP, status: "ACTIVE", emailVerified: true, contractNumber: "C-2026-0042" };

const site = (id: string, name: string, host: string) => ({
  id,
  partnerId: SHOP.id,
  name,
  websiteUrl: `https://${host}`,
  returnUrls: [`https://${host}/thanks`],
  status: "ACTIVE",
  schemes: ["UZCARD", "HUMO"],
  refundWindowWorkingDays: 10,
  refundExtensionMaxCalendarDays: 60,
  createdAt: "2026-09-20T10:00:00Z",
});
export const SHOP_SITE = site("0b6f2c1e-8d4a-4c2b-9e1f-3a5d7c9e1b20", "Toy Corner online", "toycorner.example.com");
export const GIFT_SITE = site("5e2a9c10-4b7d-4f3e-8a21-6c9d0e1f2a33", "Toy Corner gifts", "gifts.toycorner.example.com");
export const SITES = [SHOP_SITE, GIFT_SITE];

/** Bank staff: what every bank-portal page around a merchant asks for (names of the merchant and its websites). */
export const ADMIN_LOOKUPS = {
  "GET /api/v1/admin/partners": { items: [PARTNER], page: 0, size: 20, totalItems: 1, totalPages: 1 },
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/sales-points/*": SHOP_SITE,
  "GET /api/v1/admin/partners/*/sales-points": SITES,
};

/** A day some calendar days from today, as yyyy-mm-dd (today in UTC, like every shot). */
export const isoDay = (days: number) => new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
/** Some hours before now, as an instant. */
export const ago = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();
export const isoTime = (days: number, hour = 10) => `${isoDay(days)}T${String(hour).padStart(2, "0")}:15:00Z`;

type Page = import("@playwright/test").Page;
/** Prints the page-pixel box of each named element, for the lesson's screen steps. */
export async function boxes(page: Page, shot: string, targets: Record<string, string>) {
  for (const [name, selector] of Object.entries(targets)) {
    const b = await page.locator(selector).first().boundingBox({ timeout: 3000 }).catch(() => null);
    console.log(`  ${shot} ${name}: ${b ? [b.x, b.y, b.width, b.height].map(Math.round).join(", ") : "not found"}`);
  }
}

/**
 * Before a screenshot: the card-network names the front prints straight from its data (not from its strings,
 * so overrides.ts can't reach them) get the same generic names as overrides.ts, amount fields lose their currency
 * suffix, and badges show their whole label.
 */
export async function tidy(page: Page) {
  await page.addStyleTag({ content: ".mantine-Badge-root{max-width:none!important}.mantine-Badge-label{overflow:visible!important}" });
  await page.evaluate(() => {
    const names: [RegExp, string][] = [
      [/\bUZCARD\b/g, "Card A"],
      [/\bHUMO\b/g, "Card B"],
    ];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode())
      for (const [from, to] of names) node.textContent = node.textContent!.replace(from, to);
    // the amount fields' currency suffix
    for (const input of document.querySelectorAll("input")) input.value = input.value.replace(/ UZS$/, "");
  });
}
