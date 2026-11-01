import { BuildMapStep, DiagramStep, ScreenStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 20: Malika's March team. The rush and a helper (0–2), the bridge (3), one shared login (4–7),
// Users and the four roles (8–14), the invitation and the helper's first sign-in (15–25), least privilege (26–28),
// a role change (29–30), March 9: block the helper (31–34), the last admin (35–38), a login each (39–40), next (41).
const TEAM = { m45Owner: [0, 1], m45Support: [1.5, 1], m45Accountant: [3, 1] } as const;
const SHARED = { m45Owner: [0, 0.2], m45Accountant: [0, 1.1], m45Support: [0, 2], m45Shared: [1.6, 1.1], m45Portal: [3, 1.1] } as const;
const SHARED_EDGES = [
  { from: "m45Owner", to: "m45Shared" },
  { from: "m45Accountant", to: "m45Shared" },
  { from: "m45Support", to: "m45Shared" },
  { from: "m45Shared", to: "m45Portal" },
] as const;
const ROLES = { m45Admin: [0, 0.4], m45Bookkeeper: [1, 0.4], m45Operator: [2, 0.4], m45Observer: [3, 0.4], m45Portal: [1.5, 2] } as const;
const ROLE_EDGES = [
  { from: "m45Admin", to: "m45Portal" },
  { from: "m45Bookkeeper", to: "m45Portal" },
  { from: "m45Operator", to: "m45Portal" },
  { from: "m45Observer", to: "m45Portal" },
] as const;
const INVITE = { m45Admin: [0, 1], m45Inbox: [1.5, 1], m45Operator: [3, 1], m45Login: [3, 2.1] } as const;
const INVITE_EDGES = [{ from: "m45Admin", to: "m45Inbox", label: "invite" }, { from: "m45Inbox", to: "m45Operator" }, { from: "m45Operator", to: "m45Login" }] as const;
const SETUP = { m45Operator: [0, 1], m45Login: [1.5, 1], m45Authenticator: [3, 1] } as const;
const SETUP_EDGES = [{ from: "m45Operator", to: "m45Login", label: "own password" }, { from: "m45Login", to: "m45Authenticator" }] as const;
const OUT = { m45Admin: [0, 1], m45Operator: [1.5, 1], m45History: [3, 1] } as const;
const OUT_EDGES = [{ from: "m45Admin", to: "m45Operator" }, { from: "m45Operator", to: "m45History" }] as const;
const LAST = { m45Admin: [0, 1], m45Portal: [1.5, 1], m45Operator: [3, 1] } as const;
const LAST_EDGES = [{ from: "m45Admin", to: "m45Portal" }, { from: "m45Operator", to: "m45Portal" }] as const;

export const diagram: DiagramStep<BuildId>[] = [
  // The busiest week: Malika needs a helper, and her accountant wants in.
  { cue: 0, layout: { m45Owner: [1.5, 1] }, badges: { m45Owner: "March 8" } },
  { cue: 1, layout: { m45Owner: [1.5, 1] }, danger: ["m45Owner"], badges: { m45Owner: "alone" } },
  { cue: 2, layout: TEAM, accent: ["m45Support", "m45Accountant"], badges: { m45Support: "helper", m45Accountant: "sees payments" } },
  // The easy way: one shared login.
  { cue: 4, layout: SHARED, edges: [...SHARED_EDGES], accent: ["m45Shared"] },
  { cue: 5, layout: SHARED, edges: [...SHARED_EDGES], danger: ["m45Shared"], badges: { m45Shared: "most expensive" } },
  {
    cue: 6,
    layout: { ...SHARED, attacker: [3, 2.1] },
    edges: [...SHARED_EDGES, { from: "m45Shared", to: "attacker" }],
    packets: [{ from: "m45Support", to: "m45Shared", label: "refund" }, { from: "m45Shared", to: "attacker", label: "to a friend", delay: 50 }],
    danger: ["m45Support"],
    badges: { m45Portal: "the shop did it" },
  },
  { cue: 7, layout: SHARED, edges: [...SHARED_EDGES], crossed: ["m45Support"], badges: { m45Shared: "change for everyone" } },
  // Four roles.
  { cue: 10, layout: ROLES, edges: [...ROLE_EDGES], badges: { m45Portal: "one role each" } },
  { cue: 11, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Admin"], badges: { m45Admin: "everything" } },
  { cue: 12, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Bookkeeper"], badges: { m45Bookkeeper: "views · exports" } },
  { cue: 13, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Operator"], badges: { m45Operator: "links · refunds" } },
  { cue: 14, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Observer"], badges: { m45Observer: "views only" } },
  // The helper's own login.
  { cue: 18, layout: INVITE, edges: [...INVITE_EDGES], packets: [{ from: "m45Admin", to: "m45Inbox", label: "invitation" }], badges: { m45Admin: "no one else's password" } },
  { cue: 19, layout: INVITE, edges: [...INVITE_EDGES], accent: ["m45Inbox"], packets: [{ from: "m45Inbox", to: "m45Operator", label: "link" }], badges: { m45Operator: "helper" } },
  { cue: 20, layout: SETUP, edges: [...SETUP_EDGES], packets: [{ from: "m45Operator", to: "m45Login", label: "own password" }, { from: "m45Login", to: "m45Authenticator", label: "scan", delay: 50 }], accent: ["m45Authenticator"] },
  { cue: 21, layout: SETUP, edges: [...SETUP_EDGES], accent: ["m45Authenticator"], badges: { m45Operator: "can give money back" } },
  // Least privilege.
  { cue: 26, layout: ROLES, edges: [...ROLE_EDGES], badges: { m45Portal: "roles per action" } },
  { cue: 27, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Observer"], badges: { m45Portal: "least privilege" } },
  {
    cue: 28,
    layout: { attacker: [0, 1], m45Operator: [1.5, 1], m45Portal: [3, 1] },
    edges: [{ from: "attacker", to: "m45Operator" }, { from: "m45Operator", to: "m45Portal" }],
    packets: [{ from: "m45Operator", to: "m45Portal", label: "add user", stopAt: 0.6 }],
    danger: ["attacker"],
  },
  { cue: 30, layout: OUT, edges: [...OUT_EDGES], packets: [{ from: "m45Admin", to: "m45Operator", label: "new role" }], badges: { m45Operator: "signed out" } },
  // March 9: the rush is over.
  { cue: 31, layout: OUT, edges: [...OUT_EDGES], badges: { m45Operator: "March 9" } },
  { cue: 34, layout: OUT, edges: [...OUT_EDGES], crossed: ["m45Operator"], accent: ["m45History"], badges: { m45History: "names the helper" } },
  // The last admin.
  { cue: 38, layout: LAST, edges: [...LAST_EDGES], accent: ["m45Portal"], badges: { m45Admin: "last admin", m45Portal: "never locked out" } },
  // A login each.
  { cue: 39, layout: ROLES, edges: [...ROLE_EDGES], accent: ["m45Admin", "m45Bookkeeper", "m45Operator", "m45Observer"], badges: { m45Portal: "a real person" } },
  { cue: 40, layout: OUT, edges: [...OUT_EDGES], crossed: ["m45Operator"], badges: { m45Operator: "same minute" } },
];

export const map: BuildMapStep[] = [
  // The bridge: what this lesson uses from the ones before.
  { cue: 3, part: 4, current: ["merchant", "partner", "keycloak", "emailsvc"], units: { ecom: "the team" } },
  { cue: 41, part: 4, current: ["partner", "admin"], units: { ecom: "next: websites" } },
];

const DIR = "screens/c-20-merchant-users";
const TABLE: [number, number, number, number] = [240, 40, 880, 550];
export const screens: ScreenStep[] = [
  { cue: 8, src: `${DIR}/users.png`, title: "Merchant portal · Users", region: TABLE, focus: [[6, 362, 220, 30]], beats: [{ cue: 9, region: TABLE, focus: [[260, 80, 460, 60]] }] },
  { cue: 15, src: `${DIR}/invite.png`, title: "Merchant portal · Users", region: [340, 250, 800, 500], focus: [[521, 594, 402, 135]] },
  { cue: 16, src: `${DIR}/invited.png`, title: "Merchant portal · Users", region: [700, 438, 740, 462], focus: [[996, 838, 390, 44]] },
  {
    cue: 22,
    src: `${DIR}/operator.png`,
    title: "Merchant portal · Signed in as operator",
    region: [0, 0, 1440, 900],
    focus: [[1240, 10, 200, 40]],
    beats: [
      { cue: 23, region: [0, 0, 800, 500], focus: [[6, 160, 220, 30]] },
      { cue: 24, region: [0, 0, 800, 500], focus: [[6, 75, 220, 240]] },
    ],
  },
  { cue: 29, src: `${DIR}/role.png`, title: "Merchant portal · Users", region: [400, 200, 800, 500], focus: [[681, 409, 180, 30], [686, 452, 174, 106]] },
  { cue: 32, src: `${DIR}/users.png`, title: "Merchant portal · Users", region: [560, 40, 880, 550], focus: [[1255, 349, 66, 30]] },
  { cue: 33, src: `${DIR}/block.png`, title: "Merchant portal · Users", region: [380, 280, 680, 425], focus: [[516, 415, 408, 45]] },
  { cue: 35, src: `${DIR}/block-last-admin.png`, title: "Merchant portal · Users", region: [380, 260, 680, 425], focus: [[516, 334, 300, 30]], beats: [{ cue: 37, region: [380, 260, 680, 425], focus: [[516, 440, 408, 66], [849, 530, 76, 36]] }] },
];
