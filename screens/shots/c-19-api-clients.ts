// Lesson 19: API clients: locked before activation, a new client and its one-time secret, rotation.
import { join } from "node:path";
import { MERCHANT_SESSION, SHOP } from "../fixtures/common";
import { PARTNER, boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const CLIENT = { clientId: "toycorner-shop-7f3a2c", createdAt: "2026-10-06T10:12:00Z", signingKeyConfigured: true };
const SECRET = { clientId: CLIENT.clientId, clientSecret: "q8Zr2LwX5tN0vKc3Hy7Jm1PbS6fDg4Ae" };
const NEW_SECRET = { clientId: CLIENT.clientId, clientSecret: "Vn4Ke9Tx2Qa7Lw0Rb5Yc8Mh3Ps6Fj1Gd" };
const as = { username: SHOP.email };
const live = (clients: object[]) => ({
  ...MERCHANT_SESSION,
  "GET /api/v1/partner/me": PARTNER,
  "GET /api/v1/partner/clients": clients,
  "POST /api/v1/partner/clients": SECRET,
  "POST /api/v1/partner/clients/*/secret": NEW_SECRET,
});

prepare();
await serve();
await shoot(
  [
    {
      name: "locked",
      path: "/merchant/api-clients",
      as,
      fixtures: { ...MERCHANT_SESSION, "GET /api/v1/partner/me": { ...PARTNER, status: "APPROVED" } },
      act: async (page) => {
        await page.getByText("API clients open when you are live").waitFor();
        await boxes(page, "locked", { title: page.getByText("API clients open when you are live"), text: page.getByText("Once two bank admins") });
      },
    },
    {
      name: "empty",
      path: "/merchant/api-clients",
      as,
      fixtures: live([]),
      act: async (page) => {
        await page.getByText("No API clients yet").waitFor();
        await boxes(page, "empty", { title: page.getByRole("heading", { name: "API clients" }), description: page.getByText("Your servers use these"), new: page.getByRole("button", { name: "New client" }) });
      },
    },
    {
      name: "new-client",
      path: "/merchant/api-clients",
      as,
      fixtures: live([]),
      act: async (page) => {
        await page.getByRole("button", { name: "New client" }).click();
        await page.getByText("Your new API client").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "new", { dialog: page.getByRole("dialog"), warning: page.getByText("This is the only time"), stored: page.getByText("I have stored the secret safely") });
      },
    },
    {
      name: "new-client-stored",
      path: "/merchant/api-clients",
      as,
      fixtures: live([]),
      act: async (page) => {
        await page.getByRole("button", { name: "New client" }).click();
        await page.getByText("I have stored the secret safely").click();
        await page.waitForTimeout(300);
        await boxes(page, "stored", { dialog: page.getByRole("dialog"), done: page.getByRole("dialog").getByRole("button").last() });
      },
    },
    {
      name: "list",
      path: "/merchant/api-clients",
      as,
      fixtures: live([CLIENT]),
      act: async (page) => {
        await page.getByText(CLIENT.clientId).waitFor();
        await boxes(page, "list", { table: page.locator("table"), rotate: page.getByRole("button", { name: "Rotate secret" }) });
      },
    },
    {
      name: "rotate",
      path: "/merchant/api-clients",
      as,
      fixtures: live([CLIENT]),
      act: async (page) => {
        await page.getByRole("button", { name: "Rotate secret" }).click();
        await page.getByText("Rotate the secret?").waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "rotate", { dialog: page.getByRole("dialog") });
      },
    },
    {
      name: "new-secret",
      path: "/merchant/api-clients",
      as,
      fixtures: live([CLIENT]),
      act: async (page) => {
        await page.getByRole("button", { name: "Rotate secret" }).click();
        await page.getByRole("dialog").getByRole("button", { name: "Rotate secret" }).click();
        await page.getByText("New secret").first().waitFor();
        await page.waitForTimeout(400);
        await boxes(page, "secret", { dialog: page.getByRole("dialog") });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-19-api-clients"),
);
