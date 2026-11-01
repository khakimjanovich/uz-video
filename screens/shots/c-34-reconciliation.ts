// Lesson 34: a day reconciled, its items, the exceptions queue, one exception taken and written off by two admins.
import { join } from "node:path";
import { ADMIN_SESSION } from "../fixtures/common";
import { ADMIN_LOOKUPS, ago, boxes, isoDay, isoTime, tidy } from "../fixtures/m78";
import { prepare, serve, shoot } from "../harness";

type Page = import("@playwright/test").Page;
const FIRST = "sara"; // takes the exception and asks to write it off
const SECOND = "tom"; // approves the write-off
const DAY = isoDay(-1);

const RUN = {
  id: "r0000000-0000-4000-8000-000000000001",
  scheme: "UZCARD",
  day: DAY,
  version: 1,
  state: "DONE",
  startedBy: "SCHEDULE",
  startedAt: ago(7),
  finishedAt: ago(7),
  matched: 412,
  mismatched: 1,
  missingAtScheme: 1,
  missingAtBank: 0,
  bankCount: 414,
  bankSum: 104_812_300,
  schemeCount: 413,
  schemeSum: 104_552_400,
  totalsAgree: false,
};
const item = (id: string, state: string, over: Record<string, unknown>) => ({
  id: `i0000000-0000-4000-8000-00000000000${id}`,
  state,
  kind: "DEBIT",
  terminalId: "T0420017",
  maskedPan: "123456******7890",
  ...over,
});
const ITEMS = [
  item("1", "MISMATCHED", { reason: "AMOUNT_DIFFERS", rrn: "630512004417", bankAmount: 249900, schemeAmount: 24990, feeCharged: 4998 }),
  item("2", "MISSING_AT_SCHEME", { reason: "NO_SCHEME_ITEM", rrn: "630512004502", bankAmount: 10000 }),
  item("3", "MATCHED", { rrn: "630512004388", bankAmount: 129900, schemeAmount: 129900, feeCharged: 2598 }),
  item("4", "MATCHED", { kind: "REFUND", rrn: "630512004391", bankAmount: 49900, schemeAmount: 49900 }),
];

const exception = (over: Record<string, unknown>) => ({
  id: "x0000000-0000-4000-8000-000000000001",
  scheme: "UZCARD",
  day: DAY,
  reason: "AMOUNT_DIFFERS",
  state: "OPEN",
  owner: "OPERATIONS",
  amount: 224910,
  runId: RUN.id,
  terminalId: "T0420017",
  rrn: "630512004417",
  maskedPan: "123456******7890",
  bankAmount: 249900,
  schemeAmount: 24990,
  feeCharged: 4998,
  openedAt: ago(7),
  slaDueAt: isoTime(2, 18),
  overdue: false,
  ...over,
});
const LIST = [
  exception({ id: "x0000000-0000-4000-8000-000000000009", day: isoDay(-6), reason: "UNKNOWN_AT_CLOSE", owner: "FINANCE", amount: 74800, openedAt: ago(5 * 24), slaDueAt: isoTime(-1, 18), overdue: true, state: "IN_PROGRESS", scheme: "HUMO" }),
  exception({}),
  exception({ id: "x0000000-0000-4000-8000-000000000002", reason: "NO_SCHEME_ITEM", amount: 10000 }),
];
const REASON = "The card network booked a tenth of the amount; it confirmed in writing that it won't correct it.";
const OPENED = { action: "OPENED", actor: "SCHEDULE", toState: "OPEN", toOwner: "OPERATIONS", occurredAt: ago(7) };
const TAKEN = { action: "TAKEN", actor: FIRST, fromState: "OPEN", toState: "IN_PROGRESS", toOwner: FIRST, occurredAt: ago(3) };
const NOTED = { action: "NOTED", actor: FIRST, note: "Checked the payment page and the card network's letter.", occurredAt: ago(2.5) };
const ASKED = { action: "WRITE_OFF_REQUESTED", actor: FIRST, fromState: "IN_PROGRESS", toState: "WRITE_OFF_REQUESTED", note: REASON, occurredAt: ago(2) };
const DONE = { action: "WRITTEN_OFF", actor: SECOND, fromState: "WRITE_OFF_REQUESTED", toState: "WRITTEN_OFF", occurredAt: ago(1) };
const detail = (over: Record<string, unknown>, audit: unknown[], writeOffReason?: string) => ({ exception: exception(over), audit, writeOffReason });

const admin = (username: string, fixtures: Record<string, unknown>) => ({ as: { username }, fixtures: { ...ADMIN_SESSION, ...ADMIN_LOOKUPS, ...fixtures } });
const exceptions = (d: unknown) => ({ "GET /api/v1/admin/reconciliation/exceptions": LIST, "GET /api/v1/admin/reconciliation/exceptions/*": d });
const openSecond = async (p: Page) => {
  await p.locator("tbody tr").nth(1).click();
  await p.locator(".mantine-Drawer-body").waitFor();
  await p.waitForTimeout(400);
};

// The exception changes as sara works it: take → note → ask to write off.
let state = detail({}, [OPENED]);
const working = {
  "GET /api/v1/admin/reconciliation/exceptions/*": () => ({ body: state }),
  "POST /api/v1/admin/reconciliation/exceptions/*/take": () => {
    state = detail({ state: "IN_PROGRESS", owner: FIRST }, [OPENED, TAKEN]);
    return { body: state };
  },
  "POST /api/v1/admin/reconciliation/exceptions/*/write-off": () => {
    state = detail({ state: "WRITE_OFF_REQUESTED", owner: FIRST, writeOffRequestedBy: FIRST }, [OPENED, TAKEN, NOTED, ASKED], REASON);
    return { body: state };
  },
};

const OUT = join(import.meta.dir, "../../studio/public/screens/c-34-reconciliation");

prepare();
await serve();
await shoot(
  [
    {
      name: "runs",
      path: "/admin/reconciliation",
      ...admin(FIRST, { "GET /api/v1/admin/reconciliation/runs": [RUN] }),
      wait: "text=Differ",
      act: async (p) => {
        await tidy(p);
        await boxes(p, "runs", { network: ".mantine-SegmentedControl-root", reconcile: "button:has-text('Reconcile')", totals: "tbody tr >> text=Differ", row: "tbody tr" });
      },
    },
    {
      name: "items",
      path: "/admin/reconciliation",
      ...admin(FIRST, { "GET /api/v1/admin/reconciliation/runs": [RUN], "GET /api/v1/admin/reconciliation/runs/*/items": ITEMS }),
      act: async (p) => {
        await p.locator("tbody tr").first().click();
        await p.locator("text=Amount differs").waitFor();
        await p.waitForTimeout(300);
        await tidy(p);
        await boxes(p, "items", { items: ".mantine-Card-root >> nth=1", mismatched: "tr:has-text('Amount differs')", totals: "tbody tr >> text=Differ" });
      },
    },
    {
      name: "exceptions",
      path: "/admin/reconciliation/exceptions",
      ...admin(FIRST, exceptions(detail({}, [OPENED]))),
      wait: "text=Overdue",
      act: async (p) => {
        await tidy(p);
        await boxes(p, "exceptions", { table: "table", overdue: "tbody tr:nth-child(1)" });
      },
    },
    {
      name: "open",
      path: "/admin/reconciliation/exceptions",
      ...admin(FIRST, exceptions(detail({}, [OPENED]))),
      act: async (p) => {
        await openSecond(p);
        await tidy(p);
        await boxes(p, "open", { take: ".mantine-Drawer-body button:has-text('Take')", facts: ".mantine-Drawer-body table" });
      },
    },
    {
      // the next two shots share `state`: sara takes it here, then asks to write it off
      name: "taken",
      path: "/admin/reconciliation/exceptions",
      ...admin(FIRST, { "GET /api/v1/admin/reconciliation/exceptions": LIST, ...working }),
      act: async (p) => {
        await openSecond(p);
        await tidy(p);
        await boxes(p, "taken(before)", { take: ".mantine-Drawer-body button:has-text('Take')" });
        await p.locator(".mantine-Drawer-body button:has-text('Take')").click();
        await p.locator("text=You own this exception now").waitFor();
        await p.waitForTimeout(500);
        await tidy(p);
        await boxes(p, "taken", { toast: ".mantine-Notification-root", state: ".mantine-Drawer-body .mantine-Badge-root", owner: ".mantine-Drawer-body td:has-text('sara')" });
      },
    },
    {
      name: "ask-write-off",
      path: "/admin/reconciliation/exceptions",
      ...admin(FIRST, { "GET /api/v1/admin/reconciliation/exceptions": LIST, ...working }),
      act: async (p) => {
        await openSecond(p);
        await p.getByLabel("Note or reason").fill(REASON);
        await tidy(p);
        await boxes(p, "ask-write-off(before)", { text: ".mantine-Drawer-body textarea", ask: "button:has-text('Ask to write off')" });
        await p.screenshot({ path: join(OUT, "reason.png") });
        await p.locator("button:has-text('Ask to write off')").click();
        await p.locator("text=a second admin decides").waitFor();
        await p.waitForTimeout(500);
        await tidy(p);
        await boxes(p, "ask-write-off", { toast: ".mantine-Notification-root", waiting: "text=asked to write this off" });
      },
    },
    {
      name: "requester",
      path: "/admin/reconciliation/exceptions",
      ...admin(FIRST, exceptions(detail({ state: "WRITE_OFF_REQUESTED", owner: FIRST, writeOffRequestedBy: FIRST }, [OPENED, TAKEN, NOTED, ASKED], REASON))),
      act: async (p) => {
        await openSecond(p);
        await tidy(p);
        await boxes(p, "requester", { waiting: "text=asked to write this off", buttons: ".mantine-Drawer-body .mantine-Card-root", reason: "text=Write-off reason" });
      },
    },
    {
      name: "approver",
      path: "/admin/reconciliation/exceptions",
      ...admin(SECOND, exceptions(detail({ state: "WRITE_OFF_REQUESTED", owner: FIRST, writeOffRequestedBy: FIRST }, [OPENED, TAKEN, NOTED, ASKED], REASON))),
      act: async (p) => {
        await openSecond(p);
        await tidy(p);
        await boxes(p, "approver", { approve: "button:has-text('Approve write-off')", reason: "text=Write-off reason" });
      },
    },
    {
      name: "written-off",
      path: "/admin/reconciliation/exceptions",
      ...admin(SECOND, exceptions(detail({ state: "WRITTEN_OFF", owner: FIRST, writeOffRequestedBy: FIRST, resolvedAt: isoTime(0, 11) }, [OPENED, TAKEN, NOTED, ASKED, DONE], REASON))),
      act: async (p) => {
        await openSecond(p);
        await tidy(p);
        await boxes(p, "written-off", { state: ".mantine-Drawer-body .mantine-Badge-root", audit: ".mantine-Timeline-root" });
      },
    },
  ],
  OUT,
);
