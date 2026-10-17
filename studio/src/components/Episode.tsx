import { useSubtitlesContext } from "../hooks";
import { BuildMap, BuildMapStep } from "./BuildMap";
import { ArchDiagram, DiagramStep, NodeDef, Zone } from "./diagram";

// 16:9 Series B layout: the build map on map beats, the evolving diagram on story beats,
// the build-progress panel always on the right so the viewer knows where they are.
const DIAGRAM_ZONE: Zone = { x: 60, y: 250, w: 1060, h: 700, cols: 4, rows: 3 };

export function Episode<Id extends string>({
  part,
  map,
  catalog,
  diagram,
}: {
  part: number; // which part this episode belongs to (lit in the panel during story beats)
  map: BuildMapStep[];
  catalog: Record<Id, NodeDef>;
  diagram: DiagramStep<Id>[];
}) {
  const { cueIndex } = useSubtitlesContext();
  const lastMap = Math.max(-1, ...map.filter((s) => s.cue <= cueIndex).map((s) => s.cue));
  const lastDiagram = Math.max(-1, ...diagram.filter((s) => s.cue <= cueIndex).map((s) => s.cue));
  const onMap = lastMap >= lastDiagram;
  const panelOnly: BuildMapStep[] = [{ cue: 0, part }];

  return onMap ? (
    <BuildMap steps={map} x={70} y={238} scale={1.42} panelX={1150} />
  ) : (
    <>
      <ArchDiagram catalog={catalog} steps={diagram} zone={DIAGRAM_ZONE} scale={0.62} />
      <BuildMap steps={panelOnly} x={0} y={238} scale={1} panelX={1150} showMap={false} />
    </>
  );
}
