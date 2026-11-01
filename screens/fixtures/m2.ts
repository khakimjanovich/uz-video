// Module 2 (the card zone): the pay page and the card zone's frame, in every state the lessons show.
import { CARDS, type Fixtures, type Shot } from "../harness";

type Page = Parameters<NonNullable<Shot["act"]>>[0];

const PAY = "/pay/pt_screens0002";
const SESSION = "4b8f9a1e-2c3d-4e5f-8a9b-0c1d2e3f4a5b";
const NEXT_SESSION = "9c2d7e4f-1a3b-4c5d-8e6f-7a8b9c0d1e2f";
export const MASKED = "990012******4417";
const CARD = { v: 1, cardToken: "ctk_" + "3f".repeat(16), maskedPan: MASKED, expiry: "2812", scheme: "UZCARD", issuingBank: "Example Bank" };

const entry = (sessionId = SESSION) => ({
  frameUrl: `${CARDS}/entry/${sessionId}`,
  sessionId,
  expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
});

/** The pay page's answer: a toy order, card entry open (CREATED) unless a later status is given. */
export const payPage = (extra: Record<string, unknown> = {}) => ({
  status: "CREATED",
  amount: 249900,
  orderId: "ORDER-1042",
  description: "Wooden train set",
  merchantName: "Toy Corner",
  hasLogo: false,
  schemes: ["UZCARD", "HUMO"],
  expiresAt: new Date(Date.now() + 15 * 60_000).toISOString(),
  cardEntry: entry(),
  ...extra,
});

/** A card already in use: the masked line on the page. */
export const withCard = (status: string, extra: Record<string, unknown> = {}) =>
  payPage({ status, cardEntry: undefined, maskedCard: MASKED, cardScheme: "UZCARD", cardBank: "Example Bank", ...extra });

const refuse = (status: number, code: string, detail?: string) => () => ({ status, body: { code, detail } });

/** The frame's API: the card is taken (or refused), then the code (or refused). */
export function frameApi({ card, code }: { card?: ReturnType<typeof refuse>; code?: ReturnType<typeof refuse> } = {}): Fixtures {
  return {
    "POST /entry/v1/sessions/*/card": card ?? (() => ({ body: { status: "CODE_SENT" } })),
    "POST /entry/v1/sessions/*/code": code ?? (() => ({ body: CARD })),
  };
}
export const refusal = refuse;

const frame = (page: Page) => page.frameLocator("iframe");

/** Types the card the way a buyer does, key by key, so the frame groups the number and puts in the slash. */
export async function typeCard(page: Page, pan = "9900123456784417", expiry = "1228") {
  await frame(page).locator("#pan").waitFor();
  await frame(page).locator("#pan").pressSequentially(pan, { delay: 10 });
  await frame(page).locator("#expiry").pressSequentially(expiry, { delay: 10 });
}

export async function sendCode(page: Page) {
  await frame(page).getByRole("button", { name: "Send code" }).click();
}

export async function typeCode(page: Page, code = "482915") {
  await frame(page).locator("#otp").waitFor();
  await frame(page).locator("#otp").pressSequentially(code, { delay: 10 });
}

export async function confirm(page: Page) {
  await frame(page).getByRole("button", { name: "Confirm" }).click();
}

/** Keeps the frame's answer from the page, so the frame's own "Card accepted" stays on screen. */
export async function holdAnswer(page: Page) {
  await frame(page).locator("#pan").waitFor();
  const inside = page.frames().find((f) => f.url().startsWith(CARDS))!;
  // "parent" is a replaceable property: the frame's answer goes nowhere, the page keeps the frame.
  await inside.evaluate(() => Object.assign(window, { parent: { postMessage: () => {} } }));
}

export async function frameMessage(page: Page, text: string) {
  await frame(page).locator("#message", { hasText: text }).waitFor();
}

/** Prints an element's box in page pixels, for a screen step's region and focus. */
export async function box(page: Page, label: string, locator: ReturnType<Page["locator"]>) {
  const b = await locator.boundingBox();
  console.log(`  ${label}: ${b ? [b.x, b.y, b.width, b.height].map(Math.round).join(", ") : "none"}`);
}

export { PAY, SESSION, NEXT_SESSION, entry };

/** The card zone's refusals as the frame shows them (its problem details, in English). */
export const REFUSALS = {
  unavailable: refuse(503, "CARD_PROCESSOR_UNAVAILABLE", "The card scheme isn't answering. Try again in a minute."),
  notAccepted: refuse(422, "SCHEME_NOT_ACCEPTED", "This shop doesn't accept this card. Use another card."),
  unknownDigits: refuse(422, "CARD_SCHEME_UNKNOWN", "No card scheme issues cards starting with 77001234."),
  rateLimited: refuse(429, "RATE_LIMITED", "Too Many Requests"),
  codeWrong: refuse(422, "CODE_WRONG", "The code is wrong. Attempts left: 2."),
  velocity: refuse(429, "VELOCITY_LIMITED", "Too many unsuccessful attempts. Try again later."),
};

const PAGE = { "GET /api/v1/pay/*": payPage() };

/** The pay page shots several lessons share, by name. */
export const PAY_SHOTS = {
  typed: { name: "typed", path: PAY, fixtures: { ...PAGE, ...frameApi() }, act: (p: Page) => typeCard(p) },
  code: {
    name: "code",
    path: PAY,
    fixtures: { ...PAGE, ...frameApi() },
    act: async (p: Page) => {
      await typeCard(p);
      await sendCode(p);
      await typeCode(p);
    },
  },
  accepted: {
    name: "accepted",
    path: PAY,
    fixtures: { ...PAGE, ...frameApi() },
    act: async (p: Page) => {
      await holdAnswer(p);
      await typeCard(p);
      await sendCode(p);
      await typeCode(p);
      await confirm(p);
      await frameMessage(p, "Card accepted");
    },
  },
  masked: { name: "masked", path: PAY, fixtures: { "GET /api/v1/pay/*": withCard("CARD_CONFIRMED") } },
  debiting: { name: "debiting", path: PAY, fixtures: { "GET /api/v1/pay/*": withCard("DEBITING") } },
  paid: { name: "paid", path: PAY, fixtures: { "GET /api/v1/pay/*": withCard("PAID", { rrn: "612345678901" }) } },
  declined: {
    name: "declined",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": withCard("DECLINED", { declineCode: "CARD_INSUFFICIENT_FUNDS" }) },
  },
  unknown: {
    name: "unknown",
    path: PAY,
    fixtures: { "GET /api/v1/pay/*": withCard("UNKNOWN", { resultWindowSeconds: 1 }) },
    act: (p: Page) => p.getByRole("heading", { name: "We're confirming your payment" }).waitFor(),
  },
  vaultDown: refusedCard("vault-down", REFUSALS.unavailable),
} satisfies Record<string, Shot>;

/** A card typed and sent, refused by the card zone; the frame shows why. */
export function refusedCard(name: string, refusal: ReturnType<typeof refuse>, pan?: string): Shot {
  return {
    name,
    path: PAY,
    fixtures: { ...PAGE, ...frameApi({ card: refusal }) },
    act: async (p) => {
      await typeCard(p, pan);
      await sendCode(p);
      await p.frameLocator("iframe").locator("#message").filter({ hasText: /\S/ }).waitFor();
    },
  };
}
