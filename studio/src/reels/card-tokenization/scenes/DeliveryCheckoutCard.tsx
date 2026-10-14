import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const DeliveryCheckoutCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardDigitsDisappear = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 85 },
  });

  return (
    <MotionBox enter="pop" delay={2} className="absolute top-[275px] left-[60px] right-[60px]">
      <UiCard className="p-8 flex flex-col gap-5">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#7000FF] text-white flex items-center justify-center text-[22px] font-black">
              🛵
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary">
                Yetkazib berish ilovasi
              </div>
              <div className="text-base text-secondary">
                Buyurtma: Issiq Lavash + Cola • 85 000 so&apos;m
              </div>
            </div>
          </div>
          <StatusBadge>Buyurtma #4821</StatusBadge>
        </div>

        {/* Bank Card Input Box */}
        <div
          className="p-5 px-6 rounded-[22px] text-white flex justify-between items-center shadow-md"
          style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
        >
          <div>
            <div className="text-[13px] tracking-wider text-slate-400 uppercase mb-1.5">
              Kiritilgan Bank Kartasi
            </div>
            <div className="text-[26px] tracking-widest font-bold font-mono">
              {frame < 55 ? (
                <span>8600 4521 8901 9912</span>
              ) : (
                <span style={{ opacity: cardDigitsDisappear }}>
                  8600 •••• •••• <span className="text-[#38BDF8]">9912</span>
                </span>
              )}
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 text-base font-bold text-[#38BDF8]">
            UZCARD
          </div>
        </div>

        {/* Toggle & Submit Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 p-3 px-4.5 rounded-2xl bg-card border border-border">
            <div className="w-6 h-6 rounded-md bg-[#10B981] text-white flex items-center justify-center text-base font-black">
              ✓
            </div>
            <span className="text-lg font-bold text-primary">
              Kartani saqlash (Eslab qolish)
            </span>
          </div>

          <div
            className="p-4 px-7 rounded-[18px] text-white text-xl font-extrabold flex items-center gap-2.5 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7000FF 0%, #5800CC 100%)",
              scale: interpolate(frame, [40, 46, 54], [1, 0.94, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <span>To&apos;lash va Saqlash</span>
            {frame >= 45 && <span>⚡</span>}
          </div>
        </div>
      </UiCard>
    </MotionBox>
  );
};
