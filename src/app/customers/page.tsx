import PageShell from "@/components/PageShell";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import { getServerLocale } from "@/lib/locale-server";

export async function generateMetadata() {
  const locale = await getServerLocale();
  const ko = locale === "ko";
  return buildPageMetadata({
    path: "/customers",
    title: {
      ko: "고객 사례 — geck0",
      en: "Customers — geck0",
    },
    description: {
      ko: "베타 파일럿 팀의 geck0 도입 이야기 (익명 처리)",
      en: "Stories from geck0 beta pilot teams (anonymized)",
    },
  });
}

export default async function CustomersPage() {
  const locale = await getServerLocale();
  const ko = locale === "ko";
  const copy = ko
    ? {
        title: "베타 파일럿 고객",
        subtitle: "실명·로고는 고객 승인 후 공개됩니다. 아래는 익명화된 인사이트입니다.",
        cta: "웨이트리스트 등록",
        demo: "데모 보기",
        stories: [
          {
            industry: "Fintech · Series A",
            quote:
              "신규 입사자 온보딩 설명 시간이 줄었고, 슬랙·노션에 흩어진 답을 한곳에서 찾습니다.",
          },
          {
            industry: "B2B SaaS · 40명",
            quote: "시니어 개발자 퇴사 후에도 의사결정 맥락이 geck0에 남아 있어 안심이 됩니다.",
          },
          {
            industry: "E-commerce · Growth",
            quote: "도입 한 달 만에 정보 탐색 시간이 눈에 띄게 줄었습니다.",
          },
        ],
      }
    : {
        title: "Beta pilot customers",
        subtitle: "Names and logos publish after customer approval. Insights below are anonymized.",
        cta: "Join waitlist",
        demo: "Watch demo",
        stories: [
          {
            industry: "Fintech · Series A",
            quote:
              "Onboarding explanations dropped; we find answers across Slack and Notion in one place.",
          },
          {
            industry: "B2B SaaS · 40 people",
            quote: "When a senior dev left, their decision context stayed in geck0.",
          },
          {
            industry: "E-commerce · Growth",
            quote: "Within a month, team search time fell noticeably.",
          },
        ],
      };

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto px-6 py-16 sm:py-20">
        <Reveal className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">{copy.title}</h1>
          <p className="text-white/50">{copy.subtitle}</p>
        </Reveal>
        <div className="space-y-5">
          {copy.stories.map((s) => (
            <Reveal key={s.industry}>
              <blockquote className="bg-navy-800/60 border border-navy-600/30 rounded-2xl p-6">
                <p className="text-white/70 text-sm leading-relaxed italic mb-4">
                  &ldquo;{s.quote}&rdquo;
                </p>
                <footer className="text-white/35 text-xs">{s.industry}</footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
        <Reveal className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
          <Link
            href="/#contact"
            className="text-center bg-purple-400 hover:bg-purple-600 text-white font-semibold px-8 py-3 rounded-xl"
          >
            {copy.cta}
          </Link>
          <Link
            href="/demo"
            className="text-center border border-white/20 text-white/70 hover:text-white px-8 py-3 rounded-xl"
          >
            {copy.demo}
          </Link>
        </Reveal>
      </div>
    </PageShell>
  );
}
