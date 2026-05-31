import { Locale } from "./translations";

type PageBlock = { heading?: string; body: string };

export interface StaticPage {
  label?: string;
  title: string;
  subtitle?: string;
  blocks: PageBlock[];
  cta?: { label: string; href: string };
}

const pages: Record<Locale, Record<string, StaticPage>> = {
  ko: {
    about: {
      label: "회사",
      title: "geck0 소개",
      subtitle: "회사의 지식을 시냅스처럼 연결하는 AI 플랫폼",
      blocks: [
        { heading: "미션", body: "geck0는 흩어진 조직 지식을 연결하여, 모든 팀이 더 빠르게 학습하고 더 적은 실수로 성장하도록 돕습니다." },
        { heading: "문제", body: "현대 기업의 지식은 Slack, Notion, Drive, Jira, 이메일에 분산되어 있습니다. 직원들은 하루의 19%를 정보를 찾는 데 쓰고, 퇴사와 함께 노하우가 사라집니다." },
        { heading: "솔루션", body: "geck0는 AI 지식 그래프, Q&A 엔진, Insight Pulse를 통해 '물어보기 전에 알려주는' 조직 두뇌를 구축합니다." },
        { heading: "팀", body: "서울과 샌프란시스코를 기반으로, B2B SaaS와 AI 분야 경험을 가진 팀이 geck0를 만들고 있습니다." },
      ],
      cta: { label: "무료 체험 시작", href: "/#contact" },
    },
    careers: {
      label: "채용",
      title: "geck0와 함께하세요",
      subtitle: "지식이 연결될 때, 회사가 진화합니다 — 우리도 마찬가지입니다.",
      blocks: [
        { heading: "Senior Full-Stack Engineer", body: "Next.js, Python, LLM/RAG 파이프라인 경험. 원격/하이브리드." },
        { heading: "AI/ML Engineer", body: "Knowledge graph, embedding, RAG 최적화. NLP 논문 구현 경험 우대." },
        { heading: "Customer Success Manager", body: "B2B SaaS 온보딩, 엔터프라이즈 고객 관리 경험." },
        { body: "위 포지션 외에도 geck0에 열정적인 분이라면 언제든 연락 주세요." },
      ],
      cta: { label: "hello@geck0.ai 으로 지원", href: "mailto:hello@geck0.ai?subject=geck0 Careers" },
    },
    press: {
      label: "언론",
      title: "언론 보도 & 미디어",
      subtitle: "geck0 관련 보도자료, 로고, 팀 정보",
      blocks: [
        { heading: "보도자료", body: "2024.11 — geck0, B2B AI 지식 관리 플랫폼 베타 출시\n2025.01 — 47개 베타 고객사 확보, 시리즈 시드 투자 유치 (예정)" },
        { heading: "브랜드 에셋", body: "로고, 컬러, 태그라인 사용 가이드 — 미디어 문의 시 제공합니다." },
        { heading: "미디어 문의", body: "press@geck0.ai (hello@geck0.ai 으로 대체 가능)" },
      ],
      cta: { label: "미디어 문의", href: "mailto:hello@geck0.ai?subject=Press Inquiry" },
    },
    support: {
      label: "지원",
      title: "고객 지원",
      subtitle: "도움이 필요하신가요? 빠르게 답변드리겠습니다.",
      blocks: [
        { heading: "이메일", body: "hello@geck0.ai — 평균 응답 시간 4시간 (영업일 기준)" },
        { heading: "문서", body: "시작 가이드와 API 레퍼런스는 /docs 에서 확인하세요." },
        { heading: "Enterprise", body: "100명 이상 팀은 전담 Customer Success Manager가 배정됩니다. /enterprise 참고." },
      ],
      cta: { label: "무료 체험 시작", href: "/#contact" },
    },
    status: {
      label: "상태",
      title: "시스템 상태",
      subtitle: "모든 시스템 정상 운영 중",
      blocks: [
        { heading: "API", body: "✅ Operational — 99.9% uptime (30일)" },
        { heading: "Knowledge Graph Sync", body: "✅ Operational" },
        { heading: "AI Q&A Engine", body: "✅ Operational — avg 2.1s response" },
        { heading: "Integrations", body: "✅ Slack, Notion, Drive, Confluence, Jira — All operational" },
        { body: "장애 발생 시 hello@geck0.ai 및 상태 페이지를 통해 공지합니다." },
      ],
    },
    integrations: {
      label: "연동",
      title: "연동 가능한 서비스",
      subtitle: "15분 안에 기존 도구를 geck0에 연결하세요",
      blocks: [
        { heading: "커뮤니케이션", body: "Slack, Microsoft Teams, Discord" },
        { heading: "문서 & 위키", body: "Notion, Confluence, Google Docs, Coda" },
        { heading: "파일 저장", body: "Google Drive, Dropbox, SharePoint, Box" },
        { heading: "개발 & 프로젝트", body: "Jira, Linear, GitHub, GitLab, Figma" },
        { body: "목록에 없는 서비스도 Enterprise 플랜에서 커스텀 연동을 지원합니다." },
      ],
      cta: { label: "무료 체험 시작", href: "/#contact" },
    },
    docs: {
      label: "문서",
      title: "시작 가이드",
      subtitle: "15분 안에 geck0를 설정하고 첫 답변을 받아보세요",
      blocks: [
        { heading: "1. 워크스페이스 생성", body: "이메일로 가입 → /#contact 에서 베타 액세스 요청 → 초대 링크 수신" },
        { heading: "2. 소스 연결", body: "Settings → Integrations에서 Slack, Notion, Google Drive OAuth 연결. 권한은 읽기 전용." },
        { heading: "3. 지식 그래프 빌드", body: "연결 후 자동으로 인덱싱 시작. 15분 내 첫 sync 완료." },
        { heading: "4. 첫 질문", body: "Slack에서 @geck0 mention 또는 웹 대시보드 Q&A 탭에서 자연어 질문." },
        { heading: "정확도 (Accuracy)", body: "내부 Q&A 벤치마크(n=120) 기준 답변 정확도 94%. 출처 인용률 98%. 할루시네이션은 SME gold answer 대비 판정. Enterprise는 전용 eval 리포트 제공. 자세한 방법론은 랜딩 /#accuracy 참고." },
        { heading: "API", body: "프로그래밍 방식 접근은 /docs/api 참고." },
      ],
      cta: { label: "API 레퍼런스", href: "/docs/api" },
    },
    api: {
      label: "API",
      title: "API 레퍼런스",
      subtitle: "geck0 REST API v1",
      blocks: [
        { heading: "Base URL", body: "https://api.geck0.ai/v1" },
        { heading: "Authentication", body: "Bearer token — Dashboard → Settings → API Keys에서 발급" },
        { heading: "POST /query", body: 'Body: { "question": "string", "sources": ["slack","notion"] }\nResponse: { "answer": "string", "sources": [...], "confidence": 0.94 }' },
        { heading: "GET /integrations", body: "연결된 소스 목록 및 sync 상태 반환" },
        { heading: "POST /subscribe", body: "Landing page waitlist: POST /api/subscribe { email }" },
        { body: "전체 OpenAPI spec은 곧 공개됩니다. Enterprise 고객은 전담 지원팀을 통해 early access 가능." },
      ],
      cta: { label: "베타 액세스 요청", href: "/#contact" },
    },
    privacy: {
      title: "개인정보처리방침",
      subtitle: "최종 업데이트: 2025년 1월 1일",
      blocks: [
        { heading: "수집 정보", body: "이름, 이메일, 회사명, 사용 데이터(질문/답변 로그), 연동 서비스 메타데이터." },
        { heading: "이용 목적", body: "서비스 제공, 고객 지원, 제품 개선, 마케팅(동의 시)." },
        { heading: "보관 기간", body: "계정 활성 기간 + 탈퇴 후 30일. 법적 의무 보관 데이터는 별도." },
        { heading: "제3자 제공", body: "고객 동의 없이 제3자에 판매하지 않습니다. 인프라 제공자(Vercel, AWS)에만 처리 위탁." },
        { heading: "문의", body: "hello@geck0.ai" },
      ],
    },
    terms: {
      title: "이용약관",
      subtitle: "최종 업데이트: 2025년 1월 1일",
      blocks: [
        { heading: "서비스", body: "geck0는 B2B AI 지식 관리 SaaS입니다. 베타 기간 기능은 예고 없이 변경될 수 있습니다." },
        { heading: "계정", body: "정확한 정보 제공, 계정 보안 유지는 사용자 책임입니다." },
        { heading: "데이터", body: "고객 데이터 소유권은 고객에게 있습니다. geck0는 AI 학습에 고객 데이터를 사용하지 않습니다(Enterprise opt-in 제외)." },
        { heading: "결제", body: "유료 플랜은 월/연 구독. 14일 무료 체험 후 자동 과금(카드 등록 시)." },
        { heading: "문의", body: "hello@geck0.ai" },
      ],
    },
    cookies: {
      title: "쿠키 정책",
      subtitle: "최종 업데이트: 2025년 1월 1일",
      blocks: [
        { heading: "필수 쿠키", body: "세션, 언어 설정(geck0-locale), 쿠키 동의(geck0-cookie-consent)." },
        { heading: "분석 쿠키", body: "Plausible/Google Analytics(동의 후). IP 익명화 적용." },
        { heading: "관리", body: "브라우저 설정에서 쿠키 삭제 가능. 필수 쿠키 차단 시 일부 기능 제한." },
      ],
    },
    login: {
      label: "로그인",
      title: "geck0에 로그인",
      subtitle: "워크스페이스에 접속하세요",
      blocks: [
        { body: "퍼블릭 베타 기간 중입니다. 워크스페이스 액세스는 초대 또는 waitlist를 통해 제공됩니다." },
      ],
      cta: { label: "베타 액세스 요청", href: "/#contact" },
    },
  },
  en: {
    about: {
      label: "Company",
      title: "About geck0",
      subtitle: "AI platform that connects company knowledge like synapses",
      blocks: [
        { heading: "Mission", body: "geck0 connects scattered organizational knowledge so every team learns faster and grows with fewer repeated mistakes." },
        { heading: "Problem", body: "Modern company knowledge lives across Slack, Notion, Drive, Jira, and email. Employees spend 19% of their day searching, and expertise walks out the door when people leave." },
        { heading: "Solution", body: "geck0 builds an organizational brain with AI knowledge graphs, Q&A engine, and Insight Pulse — proactive intelligence before you ask." },
        { heading: "Team", body: "Built by a team with B2B SaaS and AI experience, based in Seoul and San Francisco." },
      ],
      cta: { label: "Start free trial", href: "/#contact" },
    },
    careers: {
      label: "Careers",
      title: "Join geck0",
      subtitle: "When knowledge connects, companies evolve — so do we.",
      blocks: [
        { heading: "Senior Full-Stack Engineer", body: "Next.js, Python, LLM/RAG pipelines. Remote/hybrid." },
        { heading: "AI/ML Engineer", body: "Knowledge graphs, embeddings, RAG optimization. NLP research experience preferred." },
        { heading: "Customer Success Manager", body: "B2B SaaS onboarding, enterprise customer management." },
        { body: "Passionate about geck0's mission? Reach out even if you don't see your role listed." },
      ],
      cta: { label: "Apply at hello@geck0.ai", href: "mailto:hello@geck0.ai?subject=geck0 Careers" },
    },
    press: {
      label: "Press",
      title: "Press & Media",
      subtitle: "Press releases, logos, and team information",
      blocks: [
        { heading: "Press releases", body: "Nov 2024 — geck0 launches B2B AI knowledge platform beta\nJan 2025 — 47 beta customers, seed round (planned)" },
        { heading: "Brand assets", body: "Logo, colors, tagline guidelines — available on media request." },
        { heading: "Media contact", body: "hello@geck0.ai" },
      ],
      cta: { label: "Media inquiry", href: "mailto:hello@geck0.ai?subject=Press Inquiry" },
    },
    support: {
      label: "Support",
      title: "Customer Support",
      subtitle: "Need help? We'll get back to you quickly.",
      blocks: [
        { heading: "Email", body: "hello@geck0.ai — avg response time 4 hours (business days)" },
        { heading: "Documentation", body: "Getting started and API reference at /docs" },
        { heading: "Enterprise", body: "Teams of 100+ get a dedicated Customer Success Manager. See /enterprise" },
      ],
      cta: { label: "Start free trial", href: "/#contact" },
    },
    status: {
      label: "Status",
      title: "System Status",
      subtitle: "All systems operational",
      blocks: [
        { heading: "API", body: "✅ Operational — 99.9% uptime (30 days)" },
        { heading: "Knowledge Graph Sync", body: "✅ Operational" },
        { heading: "AI Q&A Engine", body: "✅ Operational — avg 2.1s response" },
        { heading: "Integrations", body: "✅ Slack, Notion, Drive, Confluence, Jira — All operational" },
        { body: "Incidents are communicated via hello@geck0.ai and this status page." },
      ],
    },
    integrations: {
      label: "Integrations",
      title: "Integrations",
      subtitle: "Connect your existing tools to geck0 in 15 minutes",
      blocks: [
        { heading: "Communication", body: "Slack, Microsoft Teams, Discord" },
        { heading: "Docs & Wiki", body: "Notion, Confluence, Google Docs, Coda" },
        { heading: "File Storage", body: "Google Drive, Dropbox, SharePoint, Box" },
        { heading: "Dev & Project", body: "Jira, Linear, GitHub, GitLab, Figma" },
        { body: "Custom integrations available on Enterprise plan." },
      ],
      cta: { label: "Start free trial", href: "/#contact" },
    },
    docs: {
      label: "Docs",
      title: "Getting Started",
      subtitle: "Set up geck0 and get your first answer in 15 minutes",
      blocks: [
        { heading: "1. Create workspace", body: "Sign up via waitlist at /#contact → receive invite link" },
        { heading: "2. Connect sources", body: "Settings → Integrations → OAuth connect Slack, Notion, Google Drive. Read-only permissions." },
        { heading: "3. Build knowledge graph", body: "Auto-indexing starts after connect. First sync within 15 minutes." },
        { heading: "4. First question", body: "@geck0 in Slack or use Q&A tab in web dashboard." },
        { heading: "Accuracy", body: "94% answer accuracy on internal Q&A benchmark (n=120). 98% source citation rate. Hallucinations judged against SME gold answers. Enterprise gets dedicated eval reports. See /#accuracy on the landing page." },
        { heading: "API", body: "Programmatic access at /docs/api" },
      ],
      cta: { label: "API Reference", href: "/docs/api" },
    },
    api: {
      label: "API",
      title: "API Reference",
      subtitle: "geck0 REST API v1",
      blocks: [
        { heading: "Base URL", body: "https://api.geck0.ai/v1" },
        { heading: "Authentication", body: "Bearer token — issue at Dashboard → Settings → API Keys" },
        { heading: "POST /query", body: 'Body: { "question": "string", "sources": ["slack","notion"] }\nResponse: { "answer": "string", "sources": [...], "confidence": 0.94 }' },
        { heading: "GET /integrations", body: "Returns connected sources and sync status" },
        { heading: "POST /subscribe", body: "Landing waitlist: POST /api/subscribe { email }" },
        { body: "Full OpenAPI spec coming soon. Enterprise customers get early access via dedicated support." },
      ],
      cta: { label: "Request beta access", href: "/#contact" },
    },
    privacy: {
      title: "Privacy Policy",
      subtitle: "Last updated: January 1, 2025",
      blocks: [
        { heading: "Data collected", body: "Name, email, company, usage data (Q&A logs), integration metadata." },
        { heading: "Purpose", body: "Service delivery, support, product improvement, marketing (with consent)." },
        { heading: "Retention", body: "Active account period + 30 days after deletion. Legal holds excepted." },
        { heading: "Third parties", body: "We never sell customer data. Processors: Vercel, AWS infrastructure only." },
        { heading: "Contact", body: "hello@geck0.ai" },
      ],
    },
    terms: {
      title: "Terms of Service",
      subtitle: "Last updated: January 1, 2025",
      blocks: [
        { heading: "Service", body: "geck0 is a B2B AI knowledge management SaaS. Beta features may change without notice." },
        { heading: "Accounts", body: "Users must provide accurate information and maintain account security." },
        { heading: "Data", body: "Customers own their data. geck0 does not use customer data for AI training (Enterprise opt-in excepted)." },
        { heading: "Billing", body: "Paid plans are monthly/annual subscriptions. 14-day free trial, then auto-billing if card on file." },
        { heading: "Contact", body: "hello@geck0.ai" },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      subtitle: "Last updated: January 1, 2025",
      blocks: [
        { heading: "Essential", body: "Session, language preference (geck0-locale), cookie consent (geck0-cookie-consent)." },
        { heading: "Analytics", body: "Plausible/Google Analytics (after consent). IP anonymization enabled." },
        { heading: "Management", body: "Delete cookies via browser settings. Blocking essential cookies may limit functionality." },
      ],
    },
    login: {
      label: "Login",
      title: "Sign in to geck0",
      subtitle: "Access your workspace",
      blocks: [
        { body: "Public beta is in progress. Workspace access is provided via invite or waitlist." },
      ],
      cta: { label: "Request beta access", href: "/#contact" },
    },
  },
};

export function getPageContent(locale: Locale, slug: string): StaticPage | null {
  return pages[locale][slug] ?? null;
}
