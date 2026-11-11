import { siKeycloak } from "simple-icons";
import { NodeDef } from "../../components/diagram";
import { Course } from "../../utils/createEpisode";
import { HEEYID_MAP, HeeyMapId } from "./map";

// Boxes for the heeyID story diagrams. New actors go here, never inline in a lesson.
export const HEEYID_CATALOG = {
  aziz: { label: "Aziz", sublabel: "Customer", art: "buyer" },
  stranger: { label: "Stranger", sublabel: "Aziz's number, new SIM", art: "attacker" },
  trusted: { label: "Aziz's phone", sublabel: "Trusted device", art: "phone" },
  newPhone: { label: "New phone", sublabel: "Unknown device", art: "unknownPhone" },
  mobileBank: { label: "Mobile bank", sublabel: "Master app", art: "salespoint" },
  marketplace: { label: "Marketplace", sublabel: "Side app", art: "store" },
  credit: { label: "Credit service", sublabel: "Needs level 2", art: "wallet" },
  platform: { label: "heeyID", sublabel: "In the bank", art: "bank" },
  taf: { label: "TAF", sublabel: "Antifraud verdict", art: "sim" },
  myid: { label: "MyID", sublabel: "Face · passport", art: "checker" },
  records: { label: "Customer records", sublabel: "Of the bank", art: "journal" },
  person: { label: "Person", sublabel: "PINFL · level", art: "buyer" },
  login: { label: "Phone number", sublabel: "One password", art: "phone" },
  laptop: { label: "Work laptop", sublabel: "Browser", art: "admin" },
  operator: { label: "Bank operator", sublabel: "Ends sessions", art: "reviewer" },
  checkLog: { label: "Check log", sublabel: "Provider · app · time", art: "journal" },
  secondBank: { label: "Second bank", sublabel: "Own installation", art: "bank" },
  keycloak: { label: "Keycloak", sublabel: "Access grant", logo: siKeycloak.path },
} satisfies Record<string, NodeDef>;

export type HeeyId = keyof typeof HEEYID_CATALOG;

export const HEEYID: Course<HeeyId, HeeyMapId> = {
  name: "Build a customer identity platform",
  footerLabel: "heeyID",
  catalog: HEEYID_CATALOG,
  map: HEEYID_MAP,
};
