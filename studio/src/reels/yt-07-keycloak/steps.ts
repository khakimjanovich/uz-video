import { BuildMapStep, DiagramStep } from "../../components";
import { builtBefore } from "../../series/build/map";
import { BuildId } from "../../series/build/nodes";

// Episode 07: identities in Keycloak, app secrets in Vault (KeycloakAdminServiceImpl, PartnerClientServiceImpl).
export const map: BuildMapStep[] = [
  { cue: 0, part: 1, current: ["keycloak", "vault"], built: builtBefore(1) },
  { cue: 7, part: 1, current: ["partner"], built: builtBefore(1) },
];

export const diagram: DiagramStep<BuildId>[] = [
  { cue: 1, layout: { partner: [0.5, 1], postgres: [2.5, 1] }, edges: [{ from: "partner", to: "postgres", label: "passwords?" }], crossed: ["postgres"], danger: ["postgres"] },
  { cue: 2, layout: { shop: [0, 0], merchant: [0, 2], keycloak: [2, 1] }, edges: [{ from: "shop", to: "keycloak", label: "portal login" }, { from: "merchant", to: "keycloak", label: "machine client" }], accent: ["keycloak"] },
  {
    cue: 3,
    layout: { merchant: [0, 1], keycloak: [1.5, 1], partner: [3, 1] },
    edges: [{ from: "merchant", to: "keycloak", label: "client credentials" }, { from: "keycloak", to: "merchant" }],
    packets: [{ from: "keycloak", to: "merchant", label: "JWT · partner_id", delay: 20 }],
  },
  { cue: 4, layout: { merchant: [0, 1], keycloak: [1.5, 1] }, edges: [{ from: "keycloak", to: "merchant" }], packets: [{ from: "keycloak", to: "merchant", label: "new secret", delay: 15 }], badges: { keycloak: "shown once · rotate" } },
  { cue: 5, layout: { app: [0.5, 1], vault: [2.5, 1] }, edges: [{ from: "app", to: "vault", label: "secret/app" }], packets: [{ from: "vault", to: "app", label: "keycloak password", delay: 15 }], accent: ["vault"] },
  {
    cue: 6,
    layout: { merchant: [0, 0], attacker: [0, 2], partner: [2.5, 1] },
    edges: [{ from: "merchant", to: "partner", label: "JWT" }, { from: "attacker", to: "partner", broken: true, label: "no token" }],
    packets: [{ from: "merchant", to: "partner", label: "request", delay: 10 }, { from: "attacker", to: "partner", label: "request", delay: 30, stopAt: 0.5 }],
    danger: ["attacker"],
  },
];
