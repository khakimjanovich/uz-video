// Sample data for Lessons 16–23 (merchants and money rules): one toy shop, its website, two bank admins.
import type { Page } from "@playwright/test";
import { SHOP } from "./common";

export const PARTNER = { ...SHOP, status: "ACTIVE", emailVerified: true, contractNumber: "C-2026-0042" };
export const MAKER = "nodira"; // the bank admin who asks
export const CHECKER = "jasur"; // the second bank admin, who decides
export const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
export const inMinutes = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();

export const doc = (id: string, type: string, fileName: string, status: string, extra: object = {}) => ({
  id,
  type,
  status,
  fileName,
  contentType: "application/pdf",
  size: 248_000,
  sha256: "9f2c4e1a7b3d5f6081a2c3e4f5061728394a5b6c7d8e9f00112233445566778",
  uploadedBy: SHOP.email,
  uploadedAt: "2026-10-02T08:40:00Z",
  ...extra,
});

export const kyb = (status: string, waiting: string[] = [], missing: string[] = []) => ({
  status,
  required: ["CHARTER", "PASSPORT"],
  missing,
  waiting,
});

export const SITE = {
  id: "0b6f2c1e-8d4a-4c2b-9e1f-3a5d7c9e1b20",
  partnerId: SHOP.id,
  name: "Toy Corner online",
  websiteUrl: "https://toycorner.example.com",
  returnUrls: ["https://toycorner.example.com/thanks", "https://toycorner.example.com/cart"],
  status: "DRAFT",
  schemes: [] as string[],
  refundWindowWorkingDays: 10,
  refundExtensionMaxCalendarDays: 60,
  createdAt: "2026-10-05T10:00:00Z",
};

/** Prints each element's box in page pixels, for a screen step's `region` and `focus`. */
export async function boxes(page: Page, name: string, targets: Record<string, ReturnType<Page["locator"]>>) {
  for (const [label, locator] of Object.entries(targets)) {
    const b = await locator.first().boundingBox({ timeout: 2000 }).catch(() => null);
    console.log(`  ${name} ${label}: ${b ? [b.x, b.y, b.width, b.height].map(Math.round).join(", ") : "not found"}`);
  }
}

/** The four kinds of four-eyes request, as the Approvals tabs ask for them; empty unless given. */
export function approvals(given: { activations?: object[]; fees?: object[]; windows?: object[]; refunds?: object[] } = {}) {
  const fees = given.fees ?? [];
  return {
    "GET /api/v1/admin/activation-requests": given.activations ?? [],
    "GET /api/v1/admin/commission-requests": { items: fees, page: 0, size: 20, totalItems: fees.length, totalPages: 1 },
    "GET /api/v1/admin/refund-window-requests": given.windows ?? [],
    "GET /api/v1/admin/refund-requests": given.refunds ?? [],
  };
}

export const ACTIVATION = {
  id: "5e1d2c3b-4a59-4687-9a0b-1c2d3e4f5a6b",
  partnerId: SHOP.id,
  companyName: SHOP.companyName,
  status: "PENDING",
  requestedBy: MAKER,
  createdAt: ago(4),
  expiresAt: inMinutes(3 * 24 * 60),
};
