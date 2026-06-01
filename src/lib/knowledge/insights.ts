import { listDocuments } from "./store";
import type { InsightPulse } from "./types";

export async function buildInsights(
  workspaceId: string,
  locale: "ko" | "en" = "ko"
): Promise<InsightPulse[]> {
  const docs = await listDocuments(workspaceId);
  const ko = locale === "ko";
  const insights: InsightPulse[] = [];

  const churnDoc = docs.find((d) => d.tags.includes("churn") || d.id.includes("churn"));
  if (churnDoc) {
    insights.push({
      id: "ins-churn",
      title: ko ? "온보딩·이탈 패턴" : "Onboarding & churn pattern",
      detail: ko
        ? "이탈 회고 문서에서 온보딩 지연·API 지연이 반복 언급됩니다."
        : "Churn retrospective mentions onboarding delay and API latency again.",
      severity: "high",
    });
  }

  const openDecisions = docs.filter(
    (d) =>
      d.content.toLowerCase().includes("open item") ||
      d.content.includes("미배정") ||
      d.content.includes("need owner")
  );
  if (openDecisions.length > 0) {
    insights.push({
      id: "ins-decisions",
      title: ko ? "미결정 항목" : "Open decisions",
      detail: ko
        ? `${openDecisions.length}개 문서에 미배정 결정·후속 작업이 있습니다.`
        : `${openDecisions.length} document(s) mention unassigned decisions.`,
      severity: "medium",
    });
  }

  const onboard = docs.find((d) => d.tags.includes("onboarding"));
  if (onboard) {
    insights.push({
      id: "ins-onboard",
      title: ko ? "온보딩 체크리스트" : "Onboarding checklist",
      detail: ko
        ? "HR 플레이북에 1·3·7일 온보딩 단계가 정의되어 있습니다."
        : "HR playbook defines day 1, 3, and 7 onboarding steps.",
      severity: "low",
    });
  }

  if (docs.length >= 5) {
    insights.push({
      id: "ins-coverage",
      title: ko ? "지식 커버리지 확대" : "Growing knowledge coverage",
      detail: ko
        ? `${docs.length}개 문서가 인덱싱되었습니다. Q&A 정확도가 개선됩니다.`
        : `${docs.length} documents indexed — Q&A coverage is improving.`,
      severity: "low",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "ins-empty",
      title: ko ? "문서를 연결하세요" : "Connect your documents",
      detail: ko
        ? "연동 또는 업로드로 문서를 추가하면 인사이트가 생성됩니다."
        : "Add documents via connectors or upload to generate insights.",
      severity: "medium",
    });
  }

  return insights;
}
