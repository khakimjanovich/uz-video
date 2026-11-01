// Real ecom-front screens for the course: the app runs from a private clone on port 5181 (never 5180),
// every /api call is answered from fixtures, sign-in is faked, and the card frame is the cards repo's own
// page, script and style served on a stand-in origin. Run with Bun; see screens/README.md.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { NEUTRAL_AMOUNTS, OVERRIDES } from "./overrides";

const ACQUIRING = join(homedir(), "Documents/acquiring");
const CACHE = join(homedir(), "Library/Caches/uz-video-screens");
const FRONT = join(CACHE, "ecom-front");
const CONTRACTS = join(CACHE, "contracts");
const PORT = 5181; // 5180 is the developer's own dev server: never used here
export const APP = `http://localhost:${PORT}`;
const AUTH = "http://auth.screens.test";
export const CARDS = "http://cards.screens.test";
const AUTHORITY = `${AUTH}/realms/ecom`;
const CLIENT = "ecom-portal";

const { chromium } = createRequire(join(FRONT, "package.json"))("@playwright/test") as typeof import("@playwright/test");
type Page = import("@playwright/test").Page;
type Route = import("@playwright/test").Route;

function sh(cmd: string, cwd?: string) {
  const r = Bun.spawnSync(["bash", "-c", cmd], { cwd, stdout: "pipe", stderr: "pipe" });
  if (r.exitCode !== 0) throw new Error(`${cmd}\n${r.stderr.toString()}`);
  return r.stdout.toString().trim();
}

/** The front and the contracts at their origin/main, the front's dependencies linked, the API types generated. */
export function prepare() {
  mkdirSync(CACHE, { recursive: true });
  const front = sh("git rev-parse origin/main", join(ACQUIRING, "ecom-front"));
  if (!existsSync(FRONT)) sh(`git clone -q ${join(ACQUIRING, "ecom-front")} ${FRONT}`);
  sh(`git fetch -q ${join(ACQUIRING, "ecom-front")} ${front} && git checkout -q ${front}`, FRONT);
  sh(`ln -sfn ${join(ACQUIRING, "ecom-front/node_modules")} node_modules`, FRONT);
  sh(`rm -rf ${CONTRACTS} && mkdir -p ${CONTRACTS} && git -C ${join(ACQUIRING, "contracts")} archive origin/main | tar -x -C ${CONTRACTS}`);
  sh(`ECOM_SPEC_BASE=${CONTRACTS} bun run api`, FRONT);
  return front;
}

/** The front's dev server on 5181, started if it isn't already answering. */
export async function serve() {
  const up = async () => (await fetch(`${APP}/config.js`).catch(() => null))?.ok ?? false;
  if (await up()) return;
  const env = {
    ...process.env,
    FRONT_PORT: String(PORT),
    KEYCLOAK_URL: AUTH,
    KEYCLOAK_REALM: "ecom",
    KEYCLOAK_CLIENT: CLIENT,
    CARD_FRAME_ORIGIN: CARDS,
    API_URL: "http://127.0.0.1:9", // never reached: every /api call is answered in the browser
  };
  spawn("bunx", ["--bun", "vite"], { cwd: FRONT, env, detached: true, stdio: "ignore" }).unref();
  for (let i = 0; i < 60 && !(await up()); i++) await Bun.sleep(500);
  if (!(await up())) throw new Error(`the front didn't start on ${PORT}`);
}

/** One answer: a JSON body (status 200 by default), or a function of the request. */
export type Answer = unknown | ((request: { url: URL; body: unknown }) => { status?: number; body?: unknown });
/** "GET /api/v1/partner/me" → answer; a path may hold "*" for one segment. */
export type Fixtures = Record<string, Answer>;

function match(fixtures: Fixtures, method: string, path: string): Answer | undefined {
  for (const [key, answer] of Object.entries(fixtures)) {
    const [m, p] = key.split(" ");
    const pattern = new RegExp(`^${p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]+")}$`);
    if (m === method && pattern.test(path)) return answer;
  }
}

async function answer(route: Route, fixtures: Fixtures, missing: Set<string>) {
  const request = route.request();
  const url = new URL(request.url());
  const found = match(fixtures, request.method(), url.pathname);
  if (found === undefined) {
    missing.add(`${request.method()} ${url.pathname}`);
    return route.fulfill({ status: 404, contentType: "application/problem+json", body: JSON.stringify({ code: "NOT_IN_FIXTURES" }) });
  }
  if (typeof found === "function") {
    const body = request.postData() ? JSON.parse(request.postData()!) : undefined;
    const r = found({ url, body });
    return route.fulfill({ status: r.status ?? 200, contentType: "application/json", body: JSON.stringify(r.body ?? {}) });
  }
  return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(found) });
}

/** A stored OIDC user the app takes as signed in; the token is never checked (every API call is a fixture). */
function signedIn(username: string) {
  const now = Math.floor(Date.now() / 1000);
  const user = {
    access_token: "screens.not-a-real-token",
    token_type: "Bearer",
    scope: "openid",
    expires_at: now + 3600,
    profile: { sub: `screens-${username}`, preferred_username: username, iss: AUTHORITY, aud: CLIENT, exp: now + 3600, iat: now },
  };
  return { key: `oidc.user:${AUTHORITY}:${CLIENT}`, value: JSON.stringify(user) };
}

const cardsFile = (path: string) => sh(`git show origin/main:modules/card/src/main/resources/${path}`, join(ACQUIRING, "cards"));

/** The card zone's real frame (page, script, style) on the stand-in origin; only its API answers are fixtures. */
async function cardFrame(route: Route, fixtures: Fixtures, missing: Set<string>) {
  const url = new URL(route.request().url());
  if (url.pathname.startsWith("/entry/v1/")) return answer(route, fixtures, missing);
  if (url.pathname === "/frame/frame.js")
    return route.fulfill({ contentType: "application/javascript", body: cardsFile("static/frame/frame.js") });
  if (url.pathname === "/frame/frame.css") return route.fulfill({ contentType: "text/css", body: cardsFile("static/frame/frame.css") });
  if (url.pathname.startsWith("/entry/")) {
    const html = cardsFile("frame/index.html").replace("__PARENT_ORIGIN__", APP).replace(/ integrity="__FRAME_(JS|CSS)_SRI__"/g, "");
    return route.fulfill({ contentType: "text/html", body: html });
  }
  return route.fulfill({ status: 404, body: "" });
}

/** The front's strings with the processing-centre overrides applied (screens/overrides.ts). */
async function strings(route: Route) {
  const response = await route.fetch();
  let body = await response.text();
  for (const [from, to] of OVERRIDES) body = body.split(from).join(to);
  return route.fulfill({ response, body });
}

export type Shot = {
  name: string; // the PNG's name
  path: string; // e.g. /merchant
  as?: { username: string }; // signed in (roles come from the GET /api/v1/session fixture); omit for public pages
  fixtures: Fixtures;
  language?: "en" | "ru" | "uz";
  viewport?: { width: number; height: number };
  /** After the page settles: clicks, typing, waits. */
  act?: (page: Page) => Promise<void>;
  wait?: string; // a selector or text (prefix "text=") to wait for before the screenshot
};

/** Takes each shot into `outDir`, and lists the API calls no fixture answered. */
export async function shoot(shots: Shot[], outDir: string) {
  mkdirSync(outDir, { recursive: true });
  // The installed Google Chrome, so no browser download is needed for the front's Playwright version.
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    for (const shot of shots) {
      const missing = new Set<string>();
      const context = await browser.newContext({
        viewport: shot.viewport ?? { width: 1440, height: 900 },
        deviceScaleFactor: 2,
        locale: shot.language ?? "en",
        timezoneId: "UTC", // stable dates in every shot
      });
      if (NEUTRAL_AMOUNTS)
        await context.addInitScript(() => {
          // No real currency on screen: a currency format becomes the same number as a plain decimal.
          const Native = Intl.NumberFormat;
          const Neutral = function (locales?: string | string[], options?: Intl.NumberFormatOptions) {
            if (options?.style !== "currency") return new Native(locales, options);
            const { currency: _currency, currencyDisplay: _display, ...rest } = options;
            return new Native(locales, { ...rest, style: "decimal", minimumFractionDigits: rest.minimumFractionDigits ?? 2, maximumFractionDigits: rest.maximumFractionDigits ?? 2 });
          } as unknown as typeof Intl.NumberFormat;
          Object.assign(Neutral, Native);
          Intl.NumberFormat = Neutral;
        });
      await context.addInitScript(
        ({ language, session }) => {
          localStorage.setItem("i18nextLng", language);
          if (session) sessionStorage.setItem(session.key, session.value);
        },
        { language: shot.language ?? "en", session: shot.as ? signedIn(shot.as.username) : null },
      );
      await context.route(`${AUTH}/**`, (route) =>
        route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            issuer: AUTHORITY,
            authorization_endpoint: `${AUTHORITY}/protocol/openid-connect/auth`,
            token_endpoint: `${AUTHORITY}/protocol/openid-connect/token`,
            end_session_endpoint: `${AUTHORITY}/protocol/openid-connect/logout`,
            jwks_uri: `${AUTHORITY}/protocol/openid-connect/certs`,
          }),
        }),
      );
      await context.route(`${APP}/api/**`, (route) => answer(route, shot.fixtures, missing));
      await context.route(`${APP}/src/i18n/*.json*`, strings);
      await context.route(`${CARDS}/**`, (route) => cardFrame(route, shot.fixtures, missing));
      const page = await context.newPage();
      await page.goto(`${APP}${shot.path}`, { waitUntil: "networkidle" });
      if (shot.act) await shot.act(page);
      if (shot.wait) await page.locator(shot.wait).first().waitFor();
      await page.waitForLoadState("networkidle");
      const file = join(outDir, `${shot.name}.png`);
      mkdirSync(dirname(file), { recursive: true });
      await page.screenshot({ path: file });
      console.log(file + (missing.size ? `\n  not in fixtures: ${[...missing].join(", ")}` : ""));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
