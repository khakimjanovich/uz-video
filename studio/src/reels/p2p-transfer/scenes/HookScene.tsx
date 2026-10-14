import React from "react";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const HookScene: React.FC = () => {
  return (
    <div className="absolute top-[780px] left-[60px] right-[60px] h-[690px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="middle" className="p-11 px-9 text-center">
          <div className="text-lg font-bold uppercase tracking-wider mb-3 text-secondary">
            Foydalanuvchi ko&apos;zidagi holat
          </div>
          <div className="text-[34px] font-extrabold mb-8 text-primary">
            To&apos;lov shlyuzi tranzaksiyani bir zumda tasdiqladi
          </div>

          <div className="flex items-center justify-center gap-5">
            <div className="p-4.5 px-7 rounded-[20px] font-bold text-[22px] bg-card border border-border text-primary">
              Kapitalbank (HUMO)
            </div>
            <div className="text-[28px] text-[#10B981] font-black">➔ ⚡ ➔</div>
            <div className="p-4.5 px-7 rounded-[20px] font-bold text-[22px] bg-card border border-border text-primary">
              Ipak Yo&apos;li (UZCARD)
            </div>
          </div>

          <div className="mt-9">
            <StatusBadge tone="success" className="p-3.5 px-7 rounded-full text-xl font-bold">
              <span>⏱️ Tranzaksiya tezligi:</span>
              <span className="font-black text-[#10B981]">0.38 soniya</span>
            </StatusBadge>
          </div>
        </UiCard>
      </MotionBox>
    </div>
  );
};
