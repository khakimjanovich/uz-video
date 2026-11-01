// Lesson 20: the merchant's team: one role each, an invitation, the operator's menu, a role change, blocking.
import { join } from "node:path";
import { SHOP } from "../fixtures/common";
import { PARTNER, SITE, boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const ME = `screens-${SHOP.email}`; // the signed-in admin's id, as the faked sign-in names it
const user = (id: string, name: string, email: string, role: string) => ({ id, name, email, role, state: "ACTIVE", createdAt: "2026-10-06T09:00:00Z" });
const TEAM = [
  user(ME, "Malika", SHOP.email, "ADMIN"),
  user("u-2", "Bekzod", "bekzod@toycorner.example.com", "ACCOUNTANT"),
  user("u-3", "Dilnoza", "dilnoza@toycorner.example.com", "OPERATOR"),
  user("u-4", "Timur", "timur@toycorner.example.com", "OBSERVER"),
];
const as = { username: SHOP.email };
const team = (role = "ADMIN") => ({
  "GET /api/v1/session": { admin: false, merchantRole: role },
  "GET /api/v1/partner/me": PARTNER,
  "GET /api/v1/partner/users": TEAM,
  "POST /api/v1/partner/users": TEAM[2],
  "PUT /api/v1/partner/users/*/role": {},
});

prepare();
await serve();
await shoot(
  [
    {
      name: "users",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByText("Dilnoza", { exact: true }).waitFor();
        await boxes(page, "users", {
          title: page.getByRole("heading", { name: "Users" }),
          description: page.getByText("Everyone who works"),
          table: page.locator("table"),
          invite: page.getByRole("button", { name: "Invite a user" }),
        });
      },
    },
    {
      name: "invite",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByRole("button", { name: "Invite a user" }).click();
        const dialog = page.getByRole("dialog");
        await dialog.getByLabel("E-mail").fill("aziz@toycorner.example.com");
        await dialog.getByLabel("Name").fill("Aziz");
        await dialog.getByLabel("Role", { exact: true }).click();
        await page.getByRole("option").first().waitFor();
        await page.waitForTimeout(300);
        await boxes(page, "invite", { dialog: dialog, options: page.getByRole("listbox") });
      },
    },
    {
      name: "invited",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByRole("button", { name: "Invite a user" }).click();
        const dialog = page.getByRole("dialog");
        await dialog.getByLabel("E-mail").fill("aziz@toycorner.example.com");
        await dialog.getByLabel("Name").fill("Aziz");
        await dialog.getByLabel("Role", { exact: true }).click();
        await page.getByRole("option", { name: /^Operator/ }).click();
        await dialog.getByRole("button", { name: "Invite a user" }).click();
        await page.getByText("Invitation sent").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "invited", { toast: page.getByText("Invitation sent") });
      },
    },
    {
      name: "operator",
      path: "/merchant",
      as: { username: "dilnoza@toycorner.example.com" },
      fixtures: { ...team("OPERATOR"), "GET /api/v1/partner/sales-points": [{ ...SITE, status: "ACTIVE", schemes: ["UZCARD"] }], "GET /api/v1/partner/sales-points/*/epos": [] },
      act: async (page) => {
        await page.getByText("Payments").first().waitFor();
        await boxes(page, "operator", { nav: page.locator("nav").first() });
      },
    },
    {
      name: "role",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByLabel("Role", { exact: true }).nth(3).click();
        await page.getByRole("option").first().waitFor();
        await page.waitForTimeout(300);
        await boxes(page, "role", { table: page.locator("table"), select: page.getByLabel("Role", { exact: true }).nth(3), options: page.getByRole("listbox") });
      },
    },
    {
      name: "block",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByRole("button", { name: "Block" }).nth(2).click();
        await page.getByRole("dialog").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "block", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "block-last-admin",
      path: "/merchant/users",
      as,
      fixtures: team(),
      act: async (page) => {
        await page.getByRole("button", { name: "Block" }).first().click();
        await page.getByRole("dialog").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "lastAdmin", { dialog: page.getByRole("dialog"), block: page.getByRole("dialog").getByRole("button", { name: "Block" }) });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-20-merchant-users"),
);
