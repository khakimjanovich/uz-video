import React from "react";
import { deepDive, pad2, SeriesPosition, TIER1 } from "../series/acquiring/map";
import { NodeArt } from "./diagram/illustrations";

// Route strip at the top of the receipt: the 7 Tier 1 stops. A Tier 1 video fills its own stop;
// a deep dive fills its parent stop and hangs a "DD nn · title" tag under it.
export const SeriesMap: React.FC<{ position: SeriesPosition }> = ({ position }) => {
  const current = "part" in position ? position.part : deepDive(position.deepDive).parent;
  const label =
    "part" in position
      ? TIER1[current - 1].short
      : `DD ${pad2(position.deepDive)} · ${deepDive(position.deepDive).title}`;
  const at = (n: number) => `${((n - 1) / (TIER1.length - 1)) * 100}%`;

  return (
    <div className="absolute top-[30px] left-[100px] right-[100px] h-[80px] z-10 font-mono uppercase text-ink">
      <div className="absolute top-[19px] left-0 right-0 border-t-[3px] border-dotted border-ink-muted" />
      {TIER1.map((stop) => {
        const isCurrent = stop.n === current;
        return (
          <div
            key={stop.n}
            className={`absolute top-0 w-[40px] h-[40px] -ml-[20px] flex items-center justify-center text-[20px] font-bold border-[3px] ${
              isCurrent ? "bg-ink text-paper border-ink" : "bg-paper text-ink-muted border-ink-muted"
            }`}
            style={{ left: at(stop.n), borderRadius: 999 }}
          >
            {stop.n}
          </div>
        );
      })}
      <div
        className="absolute top-[48px] flex items-center gap-2 text-[22px] font-bold tracking-wider whitespace-nowrap"
        style={{ left: at(current), translate: current === 1 ? "-20px 0" : current === TIER1.length ? "calc(-100% + 20px) 0" : "-50% 0" }}
      >
        {"deepDive" in position ? (
          <>
            ↳ <NodeArt name={deepDive(position.deepDive).icon} size={36} /> {label}
          </>
        ) : (
          label
        )}
      </div>
    </div>
  );
};
