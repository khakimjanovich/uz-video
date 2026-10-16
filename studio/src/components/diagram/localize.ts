import { DiagramStep } from "./ArchDiagram";
import { NodeDef } from "./ArchNode";

export type Dict = Record<string, string>;

// Swap every on-screen string (node labels, edge labels, packets, stamps) via a dictionary.
// Unknown strings pass through unchanged, so numbers like "8600 **** 9012" need no entry.
const tr = (dict: Dict, s: string) => dict[s] ?? s;

export function localizeCatalog<Id extends string>(catalog: Record<Id, NodeDef>, dict: Dict): Record<Id, NodeDef> {
  const out = {} as Record<Id, NodeDef>;
  for (const id in catalog) {
    const d = catalog[id];
    out[id] = { ...d, label: tr(dict, d.label), sublabel: d.sublabel && tr(dict, d.sublabel) };
  }
  return out;
}

export function localizeSteps<Id extends string>(steps: DiagramStep<Id>[], dict: Dict): DiagramStep<Id>[] {
  return steps.map((step) => {
    let badges = step.badges;
    if (badges) {
      const translated: Partial<Record<Id, string>> = {};
      for (const id in badges) translated[id] = tr(dict, badges[id]!);
      badges = translated;
    }
    return {
      ...step,
      edges: step.edges?.map((e) => ({ ...e, label: e.label && tr(dict, e.label) })),
      packets: step.packets?.map((p) => ({ ...p, label: tr(dict, p.label) })),
      badges,
    };
  });
}
