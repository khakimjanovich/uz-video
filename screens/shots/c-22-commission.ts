// Lesson 22: fee rules: the list, a new rule and its scope, four eyes on fee changes, the fee calculator.
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { ADMIN_SESSION, SHOP } from "../fixtures/common";
import { CHECKER, MAKER, PARTNER, SITE, ago, approvals, boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const rule = (id: string, level: string, extra: object) => ({
  id,
  level,
  fixedFee: 0,
  validFrom: "2026-09-01T00:00:00Z",
  status: "ACTIVE",
  proposedBy: MAKER,
  approvedBy: CHECKER,
  createdAt: "2026-08-30T10:00:00Z",
  ...extra,
});
const RULES = [
  rule("7a1e0c55-0000-4000-8000-000000000001", "SALES_POINT", { partnerId: SHOP.id, salesPointId: SITE.id, scheme: "UZCARD", percent: 1.2 }),
  rule("7a1e0c55-0000-4000-8000-000000000002", "PARTNER", { partnerId: SHOP.id, scheme: "UZCARD", percent: 1.6, minFee: 50000 }),
  rule("7a1e0c55-0000-4000-8000-000000000003", "SCHEME", { scheme: "HUMO", percent: 1.8 }),
];
const NEW = rule("7a1e0c55-0000-4000-8000-000000000004", "BANK", { percent: 2, fixedFee: 10000, minFee: 50000, validFrom: ago(10), status: "PROPOSED", approvedBy: undefined, createdAt: ago(10) });
const CHANGE = { id: "f1", kind: "CREATE", status: "PENDING", rule: NEW, requestedBy: MAKER, createdAt: ago(10) };
const page = (items: object[]) => ({ items, page: 0, size: 20, totalItems: items.length, totalPages: 1 });
const fees = (items: object[]) => ({
  ...ADMIN_SESSION,
  "GET /api/v1/admin/commissions": page(items),
  "GET /api/v1/admin/commissions/*/history": [{ ...CHANGE, status: "APPROVED", decidedBy: CHECKER, decidedAt: ago(2) }],
  "GET /api/v1/admin/partners": page([PARTNER]),
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/partners/*/sales-points": [{ ...SITE, status: "ACTIVE", schemes: ["UZCARD"] }],
  "GET /api/v1/admin/sales-points/*": { ...SITE, status: "ACTIVE", schemes: ["UZCARD"] },
  "POST /api/v1/admin/commissions": NEW,
  "POST /api/v1/admin/commissions/quote": { ruleId: RULES[0].id, amount: 10000000, fee: 120000, net: 9880000 },
});

async function newRule(page: Page) {
  await page.getByRole("button", { name: "New rule" }).click();
  await page.getByRole("dialog").waitFor();
  await page.waitForTimeout(300);
}
async function pick(page: Page, scope: ReturnType<Page["locator"]>, label: string, option: string | RegExp) {
  await scope.getByLabel(label, { exact: true }).click();
  await page.getByRole("option", { name: option }).first().click();
}

prepare();
await serve();
await shoot(
  [
    {
      name: "fees",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        await p.getByText("Toy Corner online").first().waitFor();
        await boxes(p, "fees", {
          description: p.getByText("Fee rules: the most specific"),
          filters: p.locator(".mantine-SegmentedControl-root").first(),
          table: p.locator("table").first(),
          new: p.getByRole("button", { name: "New rule" }),
          calculator: p.locator(".mantine-Card-root", { hasText: "Fee calculator" }).last(),
        });
      },
    },
    {
      name: "new-rule",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        await newRule(p);
        await boxes(p, "new", { dialog: p.getByRole("dialog"), hint: p.getByText("Leave everything empty") });
      },
    },
    {
      name: "needs-card",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        await newRule(p);
        const dialog = p.getByRole("dialog");
        await pick(p, dialog, "Merchant", "Toy Corner");
        await dialog.getByRole("button", { name: "Send for approval" }).click();
        await p.getByText("Choose a card, or all cards").waitFor();
        await boxes(p, "needsCard", { dialog, error: p.getByText("Choose a card, or all cards") });
      },
    },
    {
      name: "bank-default",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        await newRule(p);
        const dialog = p.getByRole("dialog");
        await dialog.getByLabel("Percent").fill("2");
        await dialog.getByLabel("Fixed fee").fill("100");
        await dialog.getByLabel("Minimum").fill("500");
        await boxes(p, "bank", { dialog, send: dialog.getByRole("button", { name: "Send for approval" }) });
      },
    },
    {
      name: "proposed",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        await newRule(p);
        const dialog = p.getByRole("dialog");
        await dialog.getByLabel("Percent").fill("2");
        await dialog.getByRole("button", { name: "Send for approval" }).click();
        await p.getByText("Sent for approval").waitFor();
        await p.waitForTimeout(400);
        await boxes(p, "proposed", { toast: p.getByText("Sent for approval") });
      },
    },
    {
      name: "approvals-maker",
      path: "/admin/approvals",
      as: { username: MAKER },
      fixtures: { ...fees([]), ...approvals({ fees: [CHANGE] }) },
      act: async (p) => {
        await p.getByRole("tab", { name: /Fee changes/ }).click();
        await p.getByRole("button", { name: "Approve" }).hover({ force: true });
        await p.getByText("You made this request").waitFor();
        await boxes(p, "maker", { card: p.locator(".mantine-Card-root").first(), approve: p.getByRole("button", { name: "Approve" }), tab: p.getByRole("tab", { name: /Fee changes/ }) });
      },
    },
    {
      name: "approvals-checker",
      path: "/admin/approvals",
      as: { username: CHECKER },
      fixtures: { ...fees([]), ...approvals({ fees: [CHANGE] }), "POST /api/v1/admin/commission-requests/*/approve": {} },
      act: async (p) => {
        await p.getByRole("tab", { name: /Fee changes/ }).click();
        await p.getByRole("button", { name: "Approve" }).waitFor();
        await boxes(p, "checker", { card: p.locator(".mantine-Card-root").first(), approve: p.getByRole("button", { name: "Approve" }) });
      },
    },
    {
      name: "in-force",
      path: "/admin/fees",
      as: { username: CHECKER },
      fixtures: fees([...RULES, { ...NEW, status: "ACTIVE", approvedBy: CHECKER }]),
      act: async (p) => {
        await p.getByText("Bank default").first().waitFor();
        await boxes(p, "inForce", { table: p.locator("table").first(), row: p.locator("tr", { hasText: "Bank default" }).first() });
      },
    },
    {
      name: "rule-details",
      path: "/admin/fees",
      as: { username: CHECKER },
      fixtures: fees([...RULES, { ...NEW, status: "ACTIVE", approvedBy: CHECKER }]),
      act: async (p) => {
        await p.locator("tr", { hasText: "Bank default" }).first().click();
        await p.waitForTimeout(500);
        await boxes(p, "details", { dialog: p.getByRole("dialog"), proposed: p.getByText(`Proposed by ${MAKER}`) });
      },
    },
    {
      name: "calculator",
      path: "/admin/fees",
      as: { username: MAKER },
      fixtures: fees([...RULES]),
      act: async (p) => {
        const calc = p.locator(".mantine-Card-root", { hasText: "Fee calculator" }).last();
        await calc.scrollIntoViewIfNeeded();
        await pick(p, calc, "Merchant", "Toy Corner");
        await pick(p, calc, "Website", "Toy Corner online");
        await calc.getByRole("button", { name: "Calculate" }).click();
        await p.getByText("Merchant receives").waitFor();
        await boxes(p, "calc", { calc, result: p.getByText("Merchant receives") });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-22-commission"),
);
