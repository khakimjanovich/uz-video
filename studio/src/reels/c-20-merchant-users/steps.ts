import { BuildMapStep, DiagramStep } from "../../components";
import { BuildId } from "../../series/build/nodes";

// Lesson 20: staff badges. A shop's badges (cue 1), four roles (3), invites and second factor (4–5),
// least privilege (6), block at once (7), never the last admin (8).
const SHOP = { m45Owner: [0, 1], m45Bookkeeper: [1.5, 1], m45Cashier: [3, 1] } as const;
const ROLES = { m45Admin: [0, 1], m45Accountant: [1, 1], m45Operator: [2, 1], m45Observer: [3, 1] } as const;
const LOW = { m45Admin: [0, 1.9], m45Accountant: [1, 1.9], m45Operator: [2, 1.9], m45Observer: [3, 1.9] } as const;
const INVITE = { m45Admin: [0, 0.3], m45Accountant: [1, 1.9], m45Operator: [2, 1.9], m45Observer: [3, 1.9] } as const;
const OTHERS = ["m45Accountant", "m45Operator", "m45Observer"] as const;

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 0, layout: { shopStaff: [1.5, 1] }, badges: { shopStaff: "everything?" } },
  { cue: 1, layout: SHOP, badges: { m45Owner: "all doors", m45Bookkeeper: "the books", m45Cashier: "the till" } },
  { cue: 3, layout: ROLES, accent: ["m45Admin", "m45Accountant", "m45Operator", "m45Observer"] },
  {
    cue: 4,
    layout: INVITE,
    edges: OTHERS.map((to) => ({ from: "m45Admin" as const, to })),
    packets: OTHERS.map((to, k) => ({ from: "m45Admin" as const, to, label: "invite", delay: 15 + k * 25 })),
    accent: ["m45Admin"],
  },
  {
    cue: 5,
    layout: LOW,
    badges: { m45Admin: "password + app", m45Accountant: "password + app", m45Operator: "password + app", m45Observer: "password + app" },
  },
  {
    cue: 6,
    layout: { ...LOW, m45Refund: [1.5, 0] },
    edges: [{ from: "m45Admin", to: "m45Refund" }, { from: "m45Observer", to: "m45Refund", broken: true }],
    badges: { m45Refund: "named roles only" },
  },
  { cue: 7, layout: ROLES, crossed: ["m45Operator"], danger: ["m45Operator"], badges: { m45Operator: "blocked now" } },
  { cue: 8, layout: ROLES, accent: ["m45Admin"], badges: { m45Admin: "last admin stays" }, shake: { m45Admin: 0.3 } },
];

export const map: BuildMapStep[] = [
  { cue: 2, part: 4, current: ["merchant", "partner", "keycloak"], units: { ecom: "the team" } },
  { cue: 9, part: 4, current: ["partner"], units: { ecom: "next: websites" } },
];
