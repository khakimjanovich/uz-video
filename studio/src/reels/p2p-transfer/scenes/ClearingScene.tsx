import React from "react";
import { UiCard, MotionBox } from "../../../components";

const PILLARS = [
  {
    num: "1",
    title: "Markaziy Protsessing Kafolati",
    desc: "HUMO & UZCARD banklar o'rtasida to'lov kafolatini oladi.",
    delay: 2,
  },
  {
    num: "2",
    title: "Ichki Daftardagi Yozuv (Ledger)",
    desc: "Qabul qiluvchi bank o'z hisobidan mijozga kredit yozadi.",
    delay: 14,
  },
  {
    num: "3",
    title: "Kechki Kliring & Netting (17:00)",
    desc: "Real pul Markaziy Bank kliring tizimi orqali kechqurun to'planadi.",
    delay: 26,
  },
];

export const ClearingScene: React.FC = () => {
  return (
    <div className="absolute top-[780px] left-[60px] right-[60px] h-[690px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="accent" className="p-10 px-9">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0284C7] text-white text-[32px] font-black flex items-center justify-center">
              ?
            </div>
            <div>
              <div className="text-4xl font-black tracking-tight text-primary">
                Pul qayerdan keldi?
              </div>
              <div className="text-lg font-semibold text-secondary">
                Fintech arxitekturasining 3 asosiy qoidasi:
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {PILLARS.map((item, idx) => (
              <MotionBox key={idx} enter="slide-up" delay={item.delay}>
                <div className="flex items-center gap-4.5 p-4 px-5 rounded-[20px] bg-card border border-border">
                  <div className="w-10.5 h-10.5 rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0 bg-[#0284C7] text-white">
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-extrabold mb-1 text-primary">
                      {item.title}
                    </div>
                    <div className="text-base text-secondary">{item.desc}</div>
                  </div>
                </div>
              </MotionBox>
            ))}
          </div>
        </UiCard>
      </MotionBox>
    </div>
  );
};
