import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { UiCard, StatusBadge, MotionBox } from "../../../components";

export const VaultTokenScene: React.FC = () => {
  const frame = useCurrentFrame();

  const fullToken = "tok_uz_89f02c19a4e7";
  const tokenLength = Math.min(
    fullToken.length,
    Math.floor(
      interpolate(frame, [15, 55], [0, fullToken.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );
  const displayedToken = fullToken.slice(0, tokenLength);

  return (
    <div className="absolute top-[795px] left-[60px] right-[60px] h-[670px] flex flex-col justify-center">
      <MotionBox enter="pop" delay={1}>
        <UiCard variant="accent" className="p-9 px-9">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-[52px] h-[52px] rounded-2xl bg-[#0284C7] text-white text-[28px] font-black flex items-center justify-center">
              ⚡
            </div>
            <div>
              <div className="text-[32px] font-black text-primary">
                Tokenizatsiya Jarayoni
              </div>
              <div className="text-[17px] font-semibold text-secondary">
                Karta va Ilova o&apos;rtasidagi xavfsiz shlyuz
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Vault Card */}
            <MotionBox enter="slide-up" delay={2}>
              <div className="p-4.5 px-5.5 rounded-[20px] flex items-center gap-4.5 bg-success-subtle border border-success/30">
                <div className="text-[34px]">🏦</div>
                <div className="flex-1">
                  <div className="text-[19px] font-extrabold mb-0.5 text-success">
                    PCI-DSS Bank Shlyuzi (Vault)
                  </div>
                  <div className="text-[15px] text-success">
                    Haqiqiy karta faqat bankda <strong>AES-256</strong> bilan shifrlanadi.
                  </div>
                </div>
                <StatusBadge tone="success">Maxfiy Ombor 🔐</StatusBadge>
              </div>
            </MotionBox>

            {/* Arrow */}
            <div className="text-center text-[22px] font-black text-[#38BDF8]">
              ⬇️ Karta o&apos;rniga Token yaratiladi ⬇️
            </div>

            {/* Merchant Token Card */}
            <MotionBox enter="slide-up" delay={14}>
              <div className="p-4.5 px-5.5 rounded-[20px] flex items-center gap-4.5 bg-accent-subtle border border-accent/30">
                <div className="text-[34px]">📱</div>
                <div className="flex-1">
                  <div className="text-[19px] font-extrabold mb-1 text-accent">
                    Ilova Bazasiga Beriladigan Token:
                  </div>
                  <div className="text-xl font-bold font-mono text-[#0284C7] p-1.5 px-3.5 rounded-xl inline-block bg-card border border-border">
                    {displayedToken || "tok_uz_..."}
                  </div>
                </div>
                <StatusBadge tone="accent">Xavfsiz ✅</StatusBadge>
              </div>
            </MotionBox>
          </div>

          <div className="mt-5 text-center text-[17px] font-bold text-secondary">
            💡 Ilova buzilsa ham, Token begona joyda <strong>0 so&apos;m</strong> ahamiyatga ega!
          </div>
        </UiCard>
      </MotionBox>
    </div>
  );
};
