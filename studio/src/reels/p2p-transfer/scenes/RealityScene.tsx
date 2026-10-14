import React from "react";
import { useCurrentFrame } from "remotion";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const RealityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const lockPulse = 1 + Math.sin(frame * 0.25) * 0.08;

  return (
    <div className="absolute top-[780px] left-[60px] right-[60px] h-[690px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="danger" className="p-11 px-9.5 text-center">
          <StatusBadge tone="danger" className="mb-5 uppercase tracking-wider text-lg">
            ⚠️ PARDA ORTIDAGI HAQIQAT
          </StatusBadge>

          <div className="text-[38px] font-extrabold leading-tight mb-6.5 text-primary">
            Banklar hisob raqamlari o&apos;rtasida:
          </div>

          {/* BIG HIGHLIGHT COUNTER */}
          <div className="p-6.5 px-9 rounded-3xl mb-7 bg-danger-subtle border-[2.5px] border-dashed border-danger">
            <div className="text-[74px] font-black text-danger tracking-tight">
              0 SO&apos;M
            </div>
            <div className="text-[22px] font-bold mt-1.5 text-danger">
              Hozirgacha bir so&apos;m ham o&apos;tkazilmagan!
            </div>
          </div>

          <div className="flex justify-between items-center p-5 px-6 rounded-[20px] bg-card border border-border">
            <div className="text-left">
              <div className="text-base font-semibold text-secondary">Bank A Nostro</div>
              <div className="text-xl font-extrabold text-primary">Kapitalbank</div>
            </div>
            <StatusBadge
              tone="danger"
              className="p-2.5 px-5 rounded-2xl text-lg flex items-center gap-2"
              style={{ scale: lockPulse }}
            >
              <span>🔒</span>
              <span>Qatnov yo&apos;q</span>
            </StatusBadge>
            <div className="text-right">
              <div className="text-base font-semibold text-secondary">Bank B Nostro</div>
              <div className="text-xl font-extrabold text-primary">Ipak Yo&apos;li Bank</div>
            </div>
          </div>
        </UiCard>
      </MotionBox>
    </div>
  );
};
