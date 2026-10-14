import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const DatabaseScanScene: React.FC = () => {
  const frame = useCurrentFrame();

  const scanLineY = interpolate(frame % 60, [0, 60], [0, 260], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div className="absolute top-[795px] left-[60px] right-[60px] h-[670px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="danger" className="p-10 px-9.5 relative overflow-hidden text-center">
          {/* Red Laser Scanner */}
          <div
            className="absolute left-0 right-0 h-0.5 shadow-[0_0_12px_#EF4444] opacity-80"
            style={{
              top: 80 + scanLineY,
              background: "linear-gradient(90deg, transparent, #EF4444, transparent)",
            }}
          />

          <div className="mb-6">
            <StatusBadge tone="danger" className="mb-4 uppercase tracking-wider text-lg">
              🔍 MERCHANT BAZASI TEKSHIRILGANDA
            </StatusBadge>
            <div className="text-4xl font-extrabold text-primary">
              Ilova bazasida karta ma&apos;lumotlari:
            </div>
          </div>

          <div className="flex flex-col gap-3.5 mb-6">
            <div className="flex justify-between items-center p-4.5 px-5.5 rounded-[18px] bg-danger-subtle border border-danger/30">
              <span className="text-xl font-bold text-primary">
                16 talik Karta Raqami (PAN)
              </span>
              <StatusBadge tone="danger" className="text-lg">
                ❌ SAQLANMAYDI (0 TA)
              </StatusBadge>
            </div>

            <div className="flex justify-between items-center p-4.5 px-5.5 rounded-[18px] bg-danger-subtle border border-danger/30">
              <span className="text-xl font-bold text-primary">
                CVV / CVC Maxfiy Kod
              </span>
              <StatusBadge tone="danger" className="text-lg">
                🚫 QAT&apos;IYAN TAQIQLANGAN
              </StatusBadge>
            </div>
          </div>

          <div className="p-4 px-5 rounded-[18px] flex items-center gap-3.5 text-left bg-card border border-border">
            <span className="text-[28px]">🛡️</span>
            <span className="text-lg font-semibold text-secondary">
              <strong className="text-primary">PCI-DSS Xalqaro qoidasi:</strong>{" "}
              Ilovaga to&apos;liq karta raqamini saqlash taqiqlanadi!
            </span>
          </div>
        </UiCard>
      </MotionBox>
    </div>
  );
};
