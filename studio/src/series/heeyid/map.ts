// The heeyID build map (MVP 1, the master app only): one platform inside the bank's perimeter, with MyID, the SMS vendor and the push service outside; TAF answers through its agent inside.
// Coordinates are in BuildMap's 680×500 design space.
import { siApachekafka, siKeycloak, siPostgresql, siVault } from "simple-icons";
import type { MapDef } from "../../components/BuildMap";

export type HeeyMapId =
  | "customer" | "mobile" | "staff"
  | "edge" | "custgw" | "keycloak" | "admingw" | "workers"
  | "postgres" | "valkey" | "kafka" | "vault" | "adapters"
  | "taf" | "sms" | "myid" | "push"
  | "perimeter";

export const HEEYID_MAP: MapDef<HeeyMapId> = {
  nodes: {
    customer: { label: "Aziz", sub: "Customer", x: 40, y: 10, w: 140, h: 52 },
    mobile: { label: "Mobile bank", sub: "Master app", x: 200, y: 10, w: 160, h: 52 },
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
    adapters: { label: "Adapters", sub: "MyID · TAF · SMS · push", x: 362, y: 220, w: 266, h: 52 },
    taf: { label: "TAF", sub: "Antifraud agent", x: 476, y: 316, w: 110, h: 52 },
    sms: { label: "SMS vendor", sub: "Sends the texts", x: 270, y: 440, w: 120, h: 48 },
    myid: { label: "MyID", sub: "Face · passport", x: 400, y: 440, w: 120, h: 48 },
    push: { label: "Push service", sub: "No personal data", x: 530, y: 440, w: 126, h: 48 },
    perimeter: { label: "The bank's perimeter", x: 20, y: 76, w: 640, h: 330 },
  },
  arrows: [
    [280, 62, 116],
    [560, 62, 116],
    [531, 272, 316],
    [376, 272, 440],
    [460, 272, 440],
  ],
  arrowEnds: [["mobile", "edge"], ["staff", "edge"], ["adapters", "taf"], ["adapters", "sms"], ["adapters", "myid"]],
  units: [{ id: "heeyid", x: 36, y: 92, w: 608, h: 196, label: "heeyID" }],
  // The course's modules (SERIES-HEEYID.md), with the boxes each puts in place.
  parts: [
    { n: 1, title: "Orientation", lessons: 2, nodes: [] },
    { n: 2, title: "Foundations", lessons: 5, nodes: ["edge", "keycloak", "vault", "adapters", "mobile", "postgres"] },
    { n: 3, title: "Registration", lessons: 4, nodes: ["customer", "custgw", "valkey", "taf", "sms"] },
    { n: 4, title: "Proofing", lessons: 4, nodes: ["myid"] },
    { n: 5, title: "The money phone", lessons: 3, nodes: ["push"] },
    { n: 6, title: "Operations and trail", lessons: 4, nodes: ["staff", "admingw", "kafka", "workers", "perimeter"] },
  ],
  frame: "perimeter",
};
