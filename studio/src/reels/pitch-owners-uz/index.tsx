import React from "react";
import { ArchDiagram, DiagramStep, ReelScaffold, SubtitleCue } from "../../components";
import { ReelProps } from "../../themes";
import { createReelComposition } from "../../utils/createReelComposition";
import { ACQUIRING_NODES, AcquiringNodeId } from "../../series/acquiring/nodes";
import { acts, steps } from "../pitch-owners/steps";
import subtitlesJson from "./subtitles.json";

// Uzbek copy of the owner pitch: same beats and pictures, Uzbek voice and on-screen text.
const subtitles = subtitlesJson as SubtitleCue[];

const TITLES = [
  "Aziza",
  "Boy berilgan",
  "Komissiya",
  "Depozitlar",
  "Firibgarlar",
  "To'rt xavf",
  "1 · Soxta sayt",
  "Faqat haqiqiy",
  "2 · Qalbaki",
  "Rad etildi",
  "3 · Takror?",
  "Bir marta",
  "4 · Karta",
  "Kod, xolos",
  "Har kuni",
  "Ertasi kuni",
  "Bir yil o'tib",
  "Tavsiya",
];

const CATALOG = {
  ...ACQUIRING_NODES,
  bank: { label: "Bank", sublabel: "Ekvayer", art: "bank" },
  aziza: { label: "Aziza", sublabel: "Bankingiz mijozi", art: "aziza" },
  shoeshop: { label: "Azizaning do'koni", sublabel: "Onlayn poyabzal", art: "shoeshop" },
  payorg: { label: "Payme / Click", sublabel: "To'lov tashkiloti", art: "buyer" },
  feeacc: { label: "Bank komissiyasi", sublabel: "45265", art: "fee" },
  storeacc: { label: "Do'kon hisobi", sublabel: "20208", art: "wallet" },
  attacker: { label: "Xaker", sublabel: "Firibgar", art: "attacker" },
  fakesite: { label: "iPhone aksiyasi", sublabel: "Juda arzon", art: "salespoint" },
  admin: { label: "Admin", sublabel: "Bank xodimi", art: "admin" },
  checker: { label: "Admin 2", sublabel: "Tasdiqlovchi", art: "checker" },
  buyer: { label: "Xaridor", art: "buyer" },
  payment: { label: "To'lov", sublabel: "Yozuv", art: "receipt" },
  store2: { label: "Do'kon B", art: "store" },
  store3: { label: "Do'kon C", art: "store" },
  merchant: { label: "Do'kon", sublabel: "Savdogar", art: "store" },
} as const;

const UZ: Record<string, string> = {
  commission: "komissiya",
  fee: "komissiya",
  rest: "qoldiq",
  deposit: "depozit",
  account: "hisob",
  "at risk?": "xavf ostida?",
  "fake shop": "soxta do'kon",
  "forged payment": "qalbaki to'lov",
  "double charge": "ikki marta",
  "stolen card": "karta o'g'irligi",
  checked: "tekshirildi",
  rejected: "rad etildi",
  signed: "imzolangan",
  "charged once": "bir marta",
  "card numbers?": "karta raqamlari?",
  "nothing to steal": "hech narsa yo'q",
  card: "karta",
  code: "kod",
  "every day": "har kuni",
  "next day": "ertasi kuni",
  "at your bank": "bankingizda",
  "a year later": "bir yildan so'ng",
  recommends: "tavsiya",
  "word of mouth": "og'izdan og'izga",
  "new merchant": "yangi savdogar",
  "commission + deposit": "komissiya + depozit",
};

// Swap every English badge, edge and packet label for its Uzbek text; numbers pass through unchanged.
const tr = (text?: string) => (text === undefined ? text : (UZ[text] ?? text));
const stepsUz: DiagramStep<AcquiringNodeId>[] = steps.map((s) => ({
  ...s,
  edges: s.edges?.map((e) => ({ ...e, label: tr(e.label) })),
  packets: s.packets?.map((p) => ({ ...p, label: tr(p.label) ?? p.label })),
  badges: s.badges && Object.fromEntries(Object.entries(s.badges).map(([id, b]) => [id, tr(b) ?? b])),
}));

const PitchOwnersUz: React.FC<ReelProps> = ({ theme }) => (
  <ReelScaffold
    theme={theme}
    reelId="pitch-owners-uz"
    subtitles={subtitles}
    acts={acts}
    series="HEEYPAY ACQ · BANK EGALARI UCHUN"
    title={(cue) => TITLES[cue] ?? TITLES[TITLES.length - 1]}
    footer={{ label: "Bankingiz", value: "O'z ekvayringi" }}
  >
    <ArchDiagram catalog={CATALOG} steps={stepsUz} />
  </ReelScaffold>
);

export const PitchOwnersUzComposition = createReelComposition({
  id: "pitch-owners-uz",
  component: PitchOwnersUz,
  subtitles,
});
