import React from "react";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const MisconceptionScene: React.FC = () => {
  return (
    <div className="absolute top-[795px] left-[60px] right-[60px] h-[670px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="middle" className="p-10.5 px-9 text-center">
          <div className="text-lg font-bold uppercase tracking-wider mb-3.5 text-secondary">
            Ko&apos;pchilik o&apos;ylaydigan xato tasavvur
          </div>
          <div className="text-[34px] font-extrabold leading-tight mb-7.5 text-primary">
            16 talik raqam yetkazib berish ilovasi serveriga saqlanadimi?
          </div>

          <div className="flex justify-center items-center gap-6 mb-8">
            <div className="p-4.5 px-6.5 rounded-[20px] font-bold text-[22px] bg-card border border-border text-primary">
              📱 Ilova bazasi
            </div>
            <div className="text-[32px] text-[#EF4444] font-black">❌ ??? ❌</div>
            <StatusBadge tone="danger" className="p-4.5 px-6.5 rounded-[20px] text-[22px]">
              👨‍💻 Xakerlar xavfi?
            </StatusBadge>
          </div>

          <StatusBadge tone="warning" className="p-3 px-6 rounded-full text-xl font-bold">
            🤔 Haqiqatda qayerda saqlanadi?
          </StatusBadge>
        </UiCard>
      </MotionBox>
    </div>
  );
};
