export type ConnectorId = "notion" | "slack" | "drive" | "jira";

export type ConnectorState = {
  id: ConnectorId;
  status: "disconnected" | "connected" | "syncing" | "error";
  lastSyncAt: string | null;
  detail: string | null;
  documentCount: number;
};

export type KnowledgeDocument = {
  id: string;
  workspaceId: string;
  title: string;
  source: string;
  connector: ConnectorId | "upload" | "seed";
  content: string;
  tags: string[];
  team?: string;
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeChunk = {
  id: string;
  docId: string;
  text: string;
  index: number;
};

export type QaHistoryEntry = {
  id: string;
  query: string;
  answer: string;
  sourceIds: string[];
  mode: string;
  createdAt: string;
};

export type GraphNode = {
  id: string;
  label: string;
  type: "team" | "document";
  x: number;
  y: number;
};

export type GraphEdge = { from: string; to: string };

export type InsightPulse = {
  id: string;
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
};
