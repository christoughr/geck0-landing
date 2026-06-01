import { listDocuments } from "./store";
import type { GraphEdge, GraphNode } from "./types";

const teamPositions: Record<string, { x: number; y: number }> = {
  Product: { x: 50, y: 22 },
  Engineering: { x: 78, y: 40 },
  HR: { x: 22, y: 48 },
  Sales: { x: 50, y: 55 },
  default: { x: 50, y: 35 },
};

export async function buildKnowledgeGraph(workspaceId: string): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}> {
  const docs = await listDocuments(workspaceId);
  const teams = new Set<string>();
  for (const d of docs) {
    if (d.team) teams.add(d.team);
  }
  if (teams.size === 0) teams.add("Product");

  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  for (const team of Array.from(teams)) {
    const pos = teamPositions[team] ?? teamPositions.default;
    nodes.push({
      id: `team-${team}`,
      label: team,
      type: "team",
      x: pos.x,
      y: pos.y,
    });
  }

  docs.forEach((doc, i) => {
    const team = doc.team ?? "Product";
    const angle = (i / Math.max(docs.length, 1)) * Math.PI * 1.2;
    const x = 50 + Math.cos(angle) * 28;
    const y = 68 + Math.sin(angle) * 12;
    const label = doc.title.length > 26 ? `${doc.title.slice(0, 24)}…` : doc.title;

    nodes.push({
      id: doc.id,
      label,
      type: "document",
      x,
      y,
    });
    edges.push({ from: `team-${team}`, to: doc.id });

    for (const tag of doc.tags.slice(0, 2)) {
      const related = docs.find(
        (other) => other.id !== doc.id && other.tags.includes(tag)
      );
      if (related && doc.id < related.id) {
        edges.push({ from: doc.id, to: related.id });
      }
    }
  });

  return { nodes, edges };
}
