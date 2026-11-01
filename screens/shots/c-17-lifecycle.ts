// Lesson 17: the merchant's documents, a fake file refused, the bank's checks, the contract, the history.
import { join } from "node:path";
import { ADMIN_SESSION, MERCHANT_SESSION, SHOP } from "../fixtures/common";
import { CHECKER, MAKER, boxes, doc, kyb } from "../fixtures/m45";
import type { Page } from "@playwright/test";
import { prepare, serve, shoot } from "../harness";

const pdf = { name: "Toy Corner charter.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.7\n%sample charter\n") };
const fake = { name: "Director passport.pdf", mimeType: "application/pdf", buffer: Buffer.from("MZ not really a document") };
const charter = (status: string, extra = {}) => doc("d1", "CHARTER", "Toy Corner charter.pdf", status, extra);
const passport = (status: string, extra = {}) => doc("d2", "PASSPORT", "Director passport.pdf", status, extra);
const reviewed = { reviewedBy: CHECKER, reviewedAt: "2026-10-03T09:15:00Z" };
const merchant = { ...MERCHANT_SESSION, "GET /api/v1/partner/me": { ...SHOP, status: "PENDING_VERIFICATION", emailVerified: true } };
const admin = (status: string, emailVerified: boolean, documents: object[], k: object, contractNumber?: string) => ({
  ...ADMIN_SESSION,
  "GET /api/v1/partners/*": { ...SHOP, status, emailVerified, contractNumber },
  "GET /api/v1/admin/partners/*/documents": { kyb: k, documents },
  "GET /api/v1/admin/partners/*/history": HISTORY.slice(0, status === "APPROVED" ? 3 : 0),
  "GET /api/v1/admin/partners/*/sales-points": [],
});
const HISTORY = [
  { fromStatus: "WAITING_CONTRACT", toStatus: "APPROVED", changedBy: MAKER, reason: "Contract C-2026-0042 signed", changedAt: "2026-10-04T11:20:00Z" },
  { fromStatus: "VERIFIED", toStatus: "WAITING_CONTRACT", changedBy: "system", changedAt: "2026-10-03T09:16:00Z" },
  { fromStatus: "PENDING_VERIFICATION", toStatus: "VERIFIED", changedBy: MAKER, reason: "Charter and passport checked", changedAt: "2026-10-03T09:16:00Z" },
];
const PAGE = "/admin/partners/" + SHOP.id;

// The merchant's documents, as uploaded so far in this shot. An upload is multipart, so it is answered on the page:
// the first upload is kept, a second one is refused by its contents.
function merchantDocs(uploaded: object[] = []) {
  const documents = [...uploaded];
  const fixtures = {
    ...merchant,
    "GET /api/v1/partner/documents": () => ({
      body: { kyb: documents.length ? kyb("IN_REVIEW", ["CHARTER"], ["PASSPORT"]) : kyb("ACTION_REQUIRED", [], ["CHARTER", "PASSPORT"]), documents },
    }),
  };
  const uploads = (page: Page) =>
    page.route("**/api/v1/partner/documents", (route) => {
      if (route.request().method() !== "POST") return route.fallback();
      if (documents.length)
        return route.fulfill({ status: 415, contentType: "application/json", body: JSON.stringify(REFUSED) });
      documents.push(charter("UPLOADED"));
      return route.fulfill({ contentType: "application/json", body: JSON.stringify(documents[0]) });
    });
  return { fixtures, uploads };
}
const REFUSED = {
  title: "file-store-type-not-allowed",
  status: 415,
  code: "FILE_STORE_TYPE_NOT_ALLOWED",
  detail: "This kind of file isn't accepted here. Allowed: application/pdf, image/jpeg, image/png.",
};

prepare();
await serve();
await shoot(
  [
    {
      name: "docs",
      path: "/merchant/documents",
      as: { username: SHOP.email },
      fixtures: merchantDocs().fixtures,
      act: async (page) => {
        await page.getByText("Company charter").first().waitFor();
        await boxes(page, "docs", {
          title: page.getByText("Company documents").first(),
          charter: page.locator(".mantine-Card-root").nth(0),
          passport: page.locator(".mantine-Card-root").nth(1),
          licence: page.locator(".mantine-Card-root").nth(2),
          attorney: page.locator(".mantine-Card-root").nth(3),
          choose: page.getByRole("button", { name: "Choose file" }),
        });
      },
    },
    {
      name: "docs-chosen",
      path: "/merchant/documents",
      as: { username: SHOP.email },
      fixtures: merchantDocs().fixtures,
      act: async (page) => {
        await page.locator("input[type=file]").first().setInputFiles(pdf);
        await boxes(page, "chosen", { upload: page.getByRole("button", { name: "Upload", exact: true }) });
      },
    },
    {
      name: "docs-uploaded",
      path: "/merchant/documents",
      as: { username: SHOP.email },
      ...(() => {
        const d = merchantDocs();
        return {
          fixtures: d.fixtures,
          act: async (page: Page) => {
            await d.uploads(page);
            await page.locator("input[type=file]").first().setInputFiles(pdf);
            await page.getByRole("button", { name: "Upload", exact: true }).click();
            await page.getByText("Waiting for review").waitFor();
            await boxes(page, "uploaded", { status: page.getByText("Waiting for review"), toast: page.getByText("Uploaded. The bank will review it.") });
          },
        };
      })(),
    },
    {
      name: "docs-refused",
      path: "/merchant/documents",
      as: { username: SHOP.email },
      ...(() => {
        const d = merchantDocs([charter("UPLOADED")]);
        return {
          fixtures: d.fixtures,
          act: async (page: Page) => {
            await d.uploads(page);
            await page.locator("input[type=file]").nth(1).setInputFiles(fake);
            await page.getByRole("button", { name: "Upload", exact: true }).click();
            await page.getByText("This kind of file").waitFor();
            await boxes(page, "refused", { passport: page.locator(".mantine-Card-root").nth(1), toast: page.getByText("This kind of file") });
          },
        };
      })(),
    },
    {
      name: "admin-review",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("PENDING_VERIFICATION", false, [charter("UPLOADED"), passport("UPLOADED")], kyb("IN_REVIEW", ["CHARTER", "PASSPORT"])),
      act: async (page) => {
        await page.getByText("Company charter").first().waitFor();
        await boxes(page, "review", {
          documents: page.locator(".mantine-Card-root", { hasText: "Company documents" }).first(),
          verify: page.getByRole("button", { name: "Verify" }),
          reject: page.getByRole("button", { name: "Reject" }).first(),
          actions: page.locator(".mantine-Card-root", { hasText: "Actions" }).first(),
          approve: page.getByRole("button", { name: "Approve documents" }),
        });
      },
    },
    {
      name: "admin-reject",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("PENDING_VERIFICATION", false, [charter("UPLOADED"), passport("UPLOADED")], kyb("IN_REVIEW", ["CHARTER", "PASSPORT"])),
      act: async (page) => {
        await page.getByText("Company charter").first().waitFor();
        await page.getByRole("button", { name: "Reject" }).nth(1).click();
        await page.getByRole("dialog").getByRole("textbox").fill("The passport page is cut off at the bottom.");
        await boxes(page, "rejectModal", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "admin-unverified",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("PENDING_VERIFICATION", false, [charter("VERIFIED", reviewed), passport("VERIFIED", reviewed)], kyb("APPROVED")),
      act: async (page) => {
        await page.getByText("Company charter").first().waitFor();
        await page.getByRole("button", { name: "Approve documents" }).hover({ force: true });
        await page.waitForTimeout(600);
        await boxes(page, "unverified", { approve: page.getByRole("button", { name: "Approve documents" }), tip: page.getByText("hasn't verified their email") });
      },
    },
    {
      name: "admin-approve",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("PENDING_VERIFICATION", true, [charter("VERIFIED", reviewed), passport("VERIFIED", reviewed)], kyb("APPROVED")),
      act: async (page) => {
        await page.getByText("Company charter").first().waitFor();
        await boxes(page, "approve", { approve: page.getByRole("button", { name: "Approve documents" }), kyb: page.getByText("Every required document is verified") });
      },
    },
    {
      name: "admin-contract",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("WAITING_CONTRACT", true, [charter("VERIFIED", reviewed), passport("VERIFIED", reviewed)], kyb("APPROVED")),
      act: async (page) => {
        await page.getByRole("button", { name: "Sign contract" }).click();
        await page.getByRole("dialog").getByRole("textbox").fill("C-2026-0042");
        await boxes(page, "contract", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "admin-history",
      path: PAGE,
      as: { username: MAKER },
      fixtures: admin("APPROVED", true, [charter("VERIFIED", reviewed), passport("VERIFIED", reviewed)], kyb("APPROVED"), "C-2026-0042"),
      act: async (page) => {
        await page.getByText("Contract C-2026-0042 signed").waitFor();
        await page.locator(".mantine-Card-root", { hasText: "History" }).last().scrollIntoViewIfNeeded();
        await boxes(page, "history", { history: page.locator(".mantine-Card-root", { hasText: "History" }).last() });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-17-lifecycle"),
);
