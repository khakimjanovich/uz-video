// Lesson 23: e-POS terminals: one live pair per website and card, registering it, revoking warned, ready to take payments.
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { ADMIN_SESSION } from "../fixtures/common";
import { CHECKER, MAKER, PARTNER, SITE, boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const CHECK = { id: "c1", result: "PASSED", findings: [], checkedBy: CHECKER, checkedAt: "2026-10-06T14:00:00Z" };
const EPOS = {
  id: "e9d1c2b3-0000-4000-8000-0000000000e1",
  salesPointId: SITE.id,
  scheme: "UZCARD",
  merchantId: "90510001234",
  terminalId: "T0042871",
  status: "ACTIVE",
  registeredBy: MAKER,
  createdAt: "2026-10-07T09:30:00Z",
};
const RULE_ID = "7a1e0c55-0000-4000-8000-000000000001";
const site = (extra: object, epos: object[]) => ({
  ...ADMIN_SESSION,
  "GET /api/v1/admin/sales-points/*": { ...SITE, lastSiteCheck: CHECK, ...extra },
  "GET /api/v1/admin/sales-points/*/site-checks": [CHECK],
  "GET /api/v1/admin/sales-points/*/epos": epos,
  "GET /api/v1/admin/sales-points/*/logo": { contentType: "image/png", content: "" },
  "GET /api/v1/admin/epos/*/audit": [],
  "GET /api/v1/partners/*": PARTNER,
  "GET /api/v1/admin/partners/*/sales-points": [{ ...SITE, ...extra }],
  "GET /api/v1/admin/commissions": { items: [], page: 0, size: 200, totalItems: 0, totalPages: 0 },
  "POST /api/v1/admin/commissions/quote": { ruleId: RULE_ID, amount: 10000000, fee: 120000, net: 9880000 },
  "GET /api/v1/admin/refund-window-requests": [],
  "POST /api/v1/admin/sales-points/*/epos": EPOS,
});
const SP = "/admin/sales-points/" + SITE.id;
const section = (page: Page) => page.getByRole("heading", { name: "e-POS terminals" }).last();

prepare();
await serve();
await shoot(
  [
    {
      name: "no-cards",
      path: SP,
      as: { username: MAKER },
      fixtures: site({}, []),
      act: async (page) => {
        await section(page).scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await boxes(page, "noCards", { title: section(page), hint: page.getByText("Each card needs one live"), register: page.getByRole("button", { name: "Register e-POS terminal" }) });
      },
    },
    {
      name: "form",
      path: SP,
      as: { username: MAKER },
      fixtures: site({ schemes: ["UZCARD"] }, []),
      act: async (page) => {
        await section(page).scrollIntoViewIfNeeded();
        await page.getByLabel("MID", { exact: true }).fill(EPOS.merchantId);
        await page.getByLabel("TID", { exact: true }).fill(EPOS.terminalId);
        await page.locator("input.mantine-Select-input").last().click();
        await page.getByRole("option", { name: "Card A" }).first().click();
        await page.waitForTimeout(300);
        await boxes(page, "form", { title: section(page), register: page.getByRole("button", { name: "Register e-POS terminal" }), mid: page.getByLabel("MID", { exact: true }) });
      },
    },
    {
      name: "registered",
      path: SP,
      as: { username: MAKER },
      fixtures: site({ schemes: ["UZCARD"], status: "ACTIVE" }, [EPOS]),
      act: async (page) => {
        await section(page).scrollIntoViewIfNeeded();
        await page.getByText(EPOS.terminalId).first().waitFor();
        await page.waitForTimeout(300);
        await boxes(page, "registered", {
          title: section(page),
          live: page.getByText("Live", { exact: true }).last(),
          suspend: page.getByRole("button", { name: "Suspend" }).last(),
          revoke: page.getByRole("button", { name: "Revoke" }).last(),
        });
      },
    },
    {
      name: "revoke",
      path: SP,
      as: { username: MAKER },
      fixtures: site({ schemes: ["UZCARD"], status: "ACTIVE" }, [EPOS]),
      act: async (page) => {
        await section(page).scrollIntoViewIfNeeded();
        await page.getByRole("button", { name: "Revoke" }).last().click();
        await page.getByRole("dialog").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "revoke", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "ready",
      path: SP,
      as: { username: MAKER },
      fixtures: site({ schemes: ["UZCARD"], status: "ACTIVE" }, [EPOS]),
      act: async (page) => {
        await page.getByText("Ready: taking payments").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "ready", { golive: page.locator(".mantine-Card-root", { hasText: "Before it takes payments" }).first(), epos: page.getByText("Every card has a live e-POS terminal") });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-23-epos"),
);
