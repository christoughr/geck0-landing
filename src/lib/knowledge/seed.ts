import { demoKnowledgeDocs } from "@/lib/app-knowledge";
import { listDocuments, upsertDocument } from "./store";
import type { ConnectorId } from "./types";

const seedMeta: {
  id: string;
  connector: ConnectorId | "seed";
  tags: string[];
  team?: string;
}[] = [
  { id: "doc-churn-q1", connector: "notion", tags: ["churn", "product", "q1"], team: "Product" },
  { id: "doc-prd-a", connector: "notion", tags: ["project-a", "decisions", "prd"], team: "Product" },
  { id: "doc-onboard", connector: "drive", tags: ["onboarding", "hr"], team: "HR" },
];

export async function ensureWorkspaceSeeded(workspaceId: string): Promise<number> {
  const existing = await listDocuments(workspaceId);
  if (existing.length > 0) return existing.length;

  for (const d of demoKnowledgeDocs) {
    const meta = seedMeta.find((m) => m.id === d.id);
    await upsertDocument({
      id: d.id,
      workspaceId,
      title: d.title,
      source: d.source,
      connector: meta?.connector ?? "seed",
      content: `${d.title}\n\n${d.excerpt}`,
      tags: meta?.tags ?? [],
      team: meta?.team,
    });
  }

  return demoKnowledgeDocs.length;
}
