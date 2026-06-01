/** Demo knowledge base for beta Q&A (until customer connectors ship). */

export type KnowledgeDoc = {
  id: string;
  title: string;
  source: string;
  excerpt: string;
};

export const demoKnowledgeDocs: KnowledgeDoc[] = [
  {
    id: "doc-churn-q1",
    title: "Q1 Customer churn retrospective",
    source: "Notion · Product analytics",
    excerpt:
      "Onboarding delay cited in 42% of churn cases. API p95 latency spikes correlated with 31%. Support SLA misses 27%. Similar pattern noted in Q1 prior year.",
  },
  {
    id: "doc-prd-a",
    title: "Project A PRD v3",
    source: "Notion · PRD",
    excerpt:
      "Decision log: pricing change approved 2026-03-12. Slack thread #proj-a-architecture documents migration plan. Jira EPIC-142 tracks rollout tasks.",
  },
  {
    id: "doc-onboard",
    title: "Employee onboarding playbook",
    source: "Google Drive · HR",
    excerpt:
      "Day 1: Slack, Notion, Drive access. Day 3: first Q&A exercise. Day 7: team knowledge map review. Average time-to-productivity reduced 3× in beta pilots.",
  },
];

const cannedAnswers: Record<string, { answer: string; docIds: string[] }> = {
  churn: {
    answer:
      "Three main patterns: onboarding delay (42%), API response speed (31%), and support SLA misses (27%). A similar cluster appeared in Q1 last year.",
    docIds: ["doc-churn-q1"],
  },
  project: {
    answer:
      "Five decision logs found in Notion PRD v3, the 3/12 Slack architecture thread, and Jira EPIC-142. Two open items still need owner assignment.",
    docIds: ["doc-prd-a"],
  },
  onboard: {
    answer:
      "Day 1: access to Slack, Notion, and Drive. Day 3: first Q&A practice. Day 7: knowledge map review with your team lead.",
    docIds: ["doc-onboard"],
  },
};

export function answerFromDemoKnowledge(query: string): {
  answer: string;
  sources: KnowledgeDoc[];
} {
  const q = query.toLowerCase();
  let key: keyof typeof cannedAnswers = "churn";
  if (q.includes("온보딩") || q.includes("onboard") || q.includes("체크리스트")) {
    key = "onboard";
  } else if (
    q.includes("프로젝트") ||
    q.includes("project") ||
    q.includes("의사결정") ||
    q.includes("decision")
  ) {
    key = "project";
  } else if (q.includes("이탈") || q.includes("churn") || q.includes("분기")) {
    key = "churn";
  }

  const hit = cannedAnswers[key];
  const sources = demoKnowledgeDocs.filter((d) => hit.docIds.includes(d.id));
  return { answer: hit.answer, sources };
}
