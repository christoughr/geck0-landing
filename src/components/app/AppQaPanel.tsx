"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import AppPageHeader from "@/components/app/AppPageHeader";

type Source = { id: string; title: string; source: string };
type HistoryEntry = { id: string; query: string; answer: string; createdAt: string };

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

const modeLabel = (mode: string, ko: boolean) => {
  if (mode === "openai-rag") return ko ? "OpenAI + RAG" : "OpenAI + RAG";
  if (mode === "keyword-rag") return ko ? "키워드 검색" : "Keyword search";
  if (mode === "no-results") return ko ? "결과 없음" : "No results";
  return mode;
};

export default function AppQaPanel({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [mode, setMode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const loadHistory = useCallback(async () => {
    const res = await fetch("/api/app/history");
    if (res.ok) {
      const data = (await res.json()) as { history: HistoryEntry[] };
      setHistory(data.history.slice(0, 8));
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

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
        body: JSON.stringify({ query: q, locale }),
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
      void loadHistory();
    } catch {
      setError(ko ? "네트워크 오류" : "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <AppPageHeader
        title="Q&A"
        description={
          ko
            ? "워크스페이스 지식 베이스를 검색합니다. OPENAI_API_KEY가 있으면 AI가 출처 기반으로 답합니다."
            : "Searches your workspace knowledge index. With OPENAI_API_KEY, AI answers with citations."
        }
      />

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
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
                className="text-xs sm:text-sm px-3 py-2 rounded-full border border-navy-600/50 text-white/55 hover:text-white/90 hover:border-purple-400/40 disabled:opacity-50"
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

          <div className="rounded-2xl border border-navy-600/40 bg-navy-800/30 min-h-[280px] lg:min-h-[360px]">
            {loading && (
              <p className="p-8 text-center text-white/40 text-sm animate-pulse">
                {ko ? "지식 베이스 검색 중…" : "Searching knowledge base…"}
              </p>
            )}
            {!loading && answer && (
              <div className="p-5 sm:p-6 space-y-4">
                <p className="text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {answer}
                </p>
                {sources.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-navy-700/50">
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
                  <p className="text-[10px] text-white/30">{modeLabel(mode, ko)}</p>
                )}
              </div>
            )}
            {!loading && !answer && !error && (
              <p className="p-8 text-center text-white/35 text-sm">
                {ko ? "질문을 입력하거나 추천 질문을 선택하세요." : "Ask a question or pick a suggestion."}
              </p>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-navy-600/40 bg-navy-800/20 p-4">
          <h2 className="text-xs uppercase tracking-wider text-white/40 mb-3">
            {ko ? "최근 질문" : "Recent questions"}
          </h2>
          {history.length === 0 ? (
            <p className="text-xs text-white/30">{ko ? "아직 기록 없음" : "No history yet"}</p>
          ) : (
            <ul className="space-y-2 max-h-[420px] overflow-y-auto">
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => void ask(h.query)}
                    className="text-left w-full text-xs text-white/55 hover:text-purple-300 line-clamp-2"
                  >
                    {h.query}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </div>
  );
}
