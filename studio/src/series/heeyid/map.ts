// The heeyID build map: one platform inside the bank's perimeter, with MyID and the push service outside; TAF answers through its agent inside.
// Coordinates are in BuildMap's 680×500 design space.
import { siApachekafka, siKeycloak, siPostgresql, siVault } from "simple-icons";
import type { MapDef } from "../../components/BuildMap";

export type HeeyMapId =
  | "customer" | "apps" | "staff"
  | "edge" | "custgw" | "keycloak" | "admingw" | "workers"
  | "postgres" | "valkey" | "kafka" | "vault" | "adapters"
  | "taf" | "sms" | "lookup" | "myid" | "push"
  | "perimeter";

export const HEEYID_MAP: MapDef<HeeyMapId> = {
  nodes: {
    customer: { label: "Aziz", sub: "Customer", x: 40, y: 10, w: 140, h: 52 },
    apps: { label: "Bank apps", sub: "Master app + side apps", x: 200, y: 10, w: 260, h: 52 },
    staff: { label: "Bank staff", sub: "Admin panel", x: 480, y: 10, w: 160, h: 52 },
    edge: { label: "Edge", x: 52, y: 116, w: 576, h: 28 },
    custgw: { label: "Customer gateway", sub: "The bank's rules", x: 52, y: 156, w: 200, h: 52 },
    keycloak: { label: "Tokens", x: 262, y: 156, w: 110, h: 52, logos: [siKeycloak.path] },
    admingw: { label: "Admin gateway", sub: "Same rules", x: 382, y: 156, w: 140, h: 52 },
    workers: { label: "Workers", sub: "Jobs", x: 532, y: 156, w: 96, h: 52 },
    postgres: { label: "Records", x: 52, y: 220, w: 70, h: 52, logos: [siPostgresql.path] },
    valkey: { label: "Counters", sub: "Valkey", x: 128, y: 220, w: 70, h: 52 },
    kafka: { label: "Events", x: 204, y: 220, w: 70, h: 52, logos: [siApachekafka.path] },
    vault: { label: "Keys", x: 280, y: 220, w: 70, h: 52, logos: [siVault.path] },
    adapters: { label: "Adapters", sub: "One per outside service", x: 362, y: 220, w: 266, h: 52 },
    taf: { label: "TAF", sub: "Antifraud", x: 362, y: 316, w: 90, h: 52 },
    sms: { label: "SMS", sub: "Side apps", x: 476, y: 316, w: 80, h: 52 },
    lookup: { label: "Customers", sub: "The bank's", x: 564, y: 316, w: 88, h: 52 },
    myid: { label: "MyID", sub: "Face · passport", x: 384, y: 440, w: 120, h: 48 },
    push: { label: "Push service", sub: "No personal data", x: 514, y: 440, w: 138, h: 48 },
    perimeter: { label: "The bank's perimeter", x: 20, y: 76, w: 640, h: 330 },
  },
  arrows: [
    [330, 62, 116],
    [560, 62, 116],
    [407, 272, 316],
    [516, 272, 316],
    [608, 272, 316],
    [464, 272, 440],
  ],
  arrowEnds: [["apps", "edge"], ["staff", "edge"], ["adapters", "taf"], ["adapters", "sms"], ["adapters", "lookup"], ["adapters", "myid"]],
  units: [{ id: "heeyid", x: 36, y: 92, w: 608, h: 196, label: "heeyID" }],
  // The course's modules (SERIES-HEEYID.md), with the boxes each puts in place.
  parts: [
    { n: 1, title: "Orientation", lessons: 3, nodes: [] },
    { n: 2, title: "Foundations", lessons: 6, nodes: ["edge", "keycloak", "vault", "adapters", "apps", "postgres"] },
    { n: 3, title: "Registration", lessons: 4, nodes: ["customer", "custgw", "valkey", "taf", "sms"] },
    { n: 4, title: "Proofing", lessons: 6, nodes: ["myid", "lookup"] },
    { n: 5, title: "Devices and login", lessons: 7, nodes: ["push"] },
    { n: 6, title: "Lifecycle and trail", lessons: 4, nodes: ["kafka", "workers"] },
    { n: 7, title: "Operations", lessons: 3, nodes: ["staff", "admingw", "perimeter"] },
  ],
  frame: "perimeter",
};
