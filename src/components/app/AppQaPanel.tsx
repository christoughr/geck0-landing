"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import AppPageHeader from "@/components/app/AppPageHeader";

type Source = { id: string; title: string; source: string };

const starters = {
  ko: [
    "Q1 고객 이탈 원인은?",
    "프로젝트 A 의사결정 로그는?",
    "신입 온보딩 체크리스트 알려줘",
  ],
  en: [
    "What drove Q1 customer churn?",
    "Where are Project A decision logs?",
    "Employee onboarding checklist?",
  ],
};

export default function AppQaPanel({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    setAnswer(null);
    setSources([]);

    try {
      const res = await fetch("/api/app/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = (await res.json()) as {
        answer?: string;
        sources?: Source[];
        mode?: string;
        error?: string;
      };

      if (!res.ok) {
        setError(
          data.error === "Unauthorized"
            ? ko
              ? "다시 로그인해 주세요."
              : "Please sign in again."
            : ko
              ? "요청 실패"
              : "Request failed"
        );
        return;
      }

      setAnswer(data.answer ?? "");
      setSources(data.sources ?? []);
      setMode(data.mode ?? null);
    } catch {
      setError(ko ? "네트워크 오류" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8">
      <AppPageHeader
        title="Q&A"
        description={
          ko
            ? "데모 지식 베이스로 답변합니다. 커넥터 연동 후 회사 문서를 검색합니다."
            : "Answers from the demo knowledge base until your connectors are linked."
        }
      />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        <div className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void ask(query);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={ko ? "회사 지식에 대해 질문하세요…" : "Ask about your company knowledge…"}
              className="flex-1 min-h-[52px] bg-navy-800/80 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
            />
            <button
              type="submit"
              disabled={loading}
              className="min-h-[52px] px-8 bg-purple-400 hover:bg-purple-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shrink-0"
            >
              {loading ? (ko ? "검색 중…" : "Searching…") : ko ? "질문" : "Ask"}
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {starters[locale].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void ask(s)}
                disabled={loading}
                className="text-xs sm:text-sm px-3 py-2 rounded-full border border-navy-600/50 text-white/55 hover:text-white/90 hover:border-purple-400/40 hover:bg-purple-400/5 transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-coral-300 text-sm bg-coral-950/30 border border-coral-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-navy-600/40 bg-navy-800/30 min-h-[280px] lg:min-h-[360px] flex flex-col">
          {loading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-white/40 text-sm animate-pulse">
                {ko ? "답변 생성 중…" : "Generating answer…"}
              </p>
            </div>
          )}

          {!loading && answer && (
            <div className="p-5 sm:p-6 space-y-4 flex-1">
              <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                {answer}
              </p>
              {sources.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-navy-700/50 mt-auto">
                  <p className="text-[10px] uppercase tracking-wider text-white/35">
                    {ko ? "출처" : "Sources"}
                  </p>
                  {sources.map((s) => (
                    <div key={s.id} className="text-xs sm:text-sm text-white/50">
                      <span className="text-purple-300/90 font-medium">{s.title}</span>
                      <span className="text-white/25"> · {s.source}</span>
                    </div>
                  ))}
                </div>
              )}
              {mode && (
                <p className="text-[10px] text-white/25">
                  {mode === "openai" ? "OpenAI" : ko ? "데모 지식" : "Demo knowledge"}
                </p>
              )}
            </div>
          )}

          {!loading && !answer && !error && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-white/35 text-sm max-w-xs leading-relaxed">
                {ko
                  ? "질문을 입력하거나 추천 질문을 눌러 보세요. 답변이 여기에 표시됩니다."
                  : "Type a question or tap a suggestion. Answers appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
