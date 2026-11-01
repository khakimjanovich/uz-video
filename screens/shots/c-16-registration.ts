// Lesson 16: sign-up, the code check, "Email verified".
import { join } from "node:path";
import { boxes } from "../fixtures/m45";
import { prepare, serve, shoot } from "../harness";

const EMAIL = "owner@toycorner.example.com";

prepare();
await serve();
await shoot(
  [
    {
      name: "signup",
      path: "/signup",
      fixtures: {},
      act: async (page) => {
        await page.getByLabel("Company name").fill("Toy Corner");
        await page.getByLabel("Work email").fill(EMAIL);
        await page.locator("input[autocomplete=new-password]").fill("wooden trains every day");
        await boxes(page, "signup", {
          title: page.getByText("Create a merchant account"),
          form: page.locator("form"),
          submit: page.getByRole("button", { name: "Create account" }),
        });
      },
    },
    {
      name: "verify-wait",
      path: `/verify?email=${encodeURIComponent(EMAIL)}`,
      fixtures: { "POST /api/v1/registrations/email-verification/resend": {} },
      act: async (page) => {
        await page.getByRole("button", { name: "Send a new code" }).click();
        await page.waitForTimeout(3500);
        await boxes(page, "verify", {
          title: page.getByText("Check your email"),
          paper: page.locator(".mantine-Paper-root"),
          code: page.locator(".mantine-PinInput-root"),
          resend: page.getByRole("button", { name: /Send a new code/ }),
          submit: page.getByRole("button", { name: "Verify" }),
        });
      },
    },
    {
      name: "verify-typed",
      path: `/verify?email=${encodeURIComponent(EMAIL)}`,
      fixtures: {},
      act: async (page) => {
        await page.locator(".mantine-PinInput-root input").first().click();
        // five digits, then the sixth below would submit; type all six only in the next shot
        await page.keyboard.type("48210");
        await page.locator(".mantine-PinInput-root input").nth(5).evaluate((el: HTMLInputElement) => el.blur());
      },
    },
    {
      name: "verify-six",
      path: `/verify?email=${encodeURIComponent(EMAIL)}`,
      fixtures: {},
      act: async (page) => {
        // The check never answers here, so the page holds the moment the sixth digit goes in.
        await page.route("**/api/v1/registrations/email-verification", () => {});
        await page.locator(".mantine-PinInput-root input").first().click();
        await page.keyboard.type("482107");
        await page.waitForTimeout(500);
      },
    },
    {
      name: "verified",
      path: `/verify?email=${encodeURIComponent(EMAIL)}`,
      fixtures: { "POST /api/v1/registrations/email-verification": {} },
      act: async (page) => {
        await page.locator(".mantine-PinInput-root input").first().click();
        await page.keyboard.type("482107");
        await page.getByText("Email verified").waitFor();
        await boxes(page, "verified", { paper: page.locator(".mantine-Paper-root"), signIn: page.getByRole("button", { name: "Sign in" }) });
      },
    },
  ],
  join(import.meta.dir, "../../studio/public/screens/c-16-registration"),
);
