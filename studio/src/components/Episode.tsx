import { useSubtitlesContext } from "../hooks";
import { BuildMap, BuildMapStep } from "./BuildMap";
import { CodeCard, CodeStep } from "./CodeCard";
import { ArchDiagram, DiagramStep, NodeDef, Zone } from "./diagram";

// 16:9 Series B layout: the build map on map beats, the evolving diagram on story beats,
// the build-progress panel always on the right so the viewer knows where they are.
const DIAGRAM_ZONE: Zone = { x: 60, y: 300, w: 1040, h: 650, cols: 4, rows: 3 };

export function Episode<Id extends string>({
  part,
  map,
  catalog,
  diagram,
  code = [],
}: {
  part: number; // which part this episode belongs to (lit in the panel during story beats)
  map: BuildMapStep[];
  catalog: Record<Id, NodeDef>;
  diagram: DiagramStep<Id>[];
  code?: CodeStep[]; // real files from the companion repo, shown on code beats
}) {
  const { cueIndex } = useSubtitlesContext();
  const lastMap = Math.max(-1, ...map.filter((s) => s.cue <= cueIndex).map((s) => s.cue));
  const lastDiagram = Math.max(-1, ...diagram.filter((s) => s.cue <= cueIndex).map((s) => s.cue));
  const codeNow = [...code].sort((a, b) => b.cue - a.cue).find((s) => s.cue <= cueIndex);
  const lastCode = codeNow?.cue ?? -1;
  const onMap = lastMap >= lastDiagram && lastMap >= lastCode;
  const panelOnly: BuildMapStep[] = [{ cue: 0, part }];

  if (onMap) return <BuildMap steps={map} x={70} y={238} scale={1.42} panelX={1150} />;
  if (codeNow && lastCode >= lastDiagram)
    return (
      <>
        <CodeCard step={codeNow} x={60} y={250} w={1050} h={700} />
        <BuildMap steps={panelOnly} x={0} y={238} scale={1} panelX={1150} showMap={false} />
      </>
    );
  return (
    <>
      <ArchDiagram catalog={catalog} steps={diagram} zone={DIAGRAM_ZONE} scale={0.62} />
      <BuildMap steps={panelOnly} x={0} y={238} scale={1} panelX={1150} showMap={false} />
    </>
  );
}
