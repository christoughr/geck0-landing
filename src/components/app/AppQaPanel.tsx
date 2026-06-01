"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/translations";

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
        setError(data.error === "Unauthorized" ? (ko ? "다시 로그인해 주세요." : "Please sign in again.") : (ko ? "요청 실패" : "Request failed"));
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">{ko ? "Q&A" : "Q&A"}</h1>
        <p className="text-white/45 text-sm">
          {ko
            ? "데모 지식 베이스로 답변합니다. 커넥터 연동 후 회사 문서를 검색합니다."
            : "Answers from the demo knowledge base until your connectors are linked."}
        </p>
      </div>

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
          className="flex-1 min-h-[48px] bg-navy-800/80 border border-navy-600/50 text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-purple-400/60"
        />
        <button
          type="submit"
          disabled={loading}
          className="min-h-[48px] px-6 bg-purple-400 hover:bg-purple-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm shrink-0"
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
            className="text-xs px-3 py-1.5 rounded-full border border-navy-600/50 text-white/50 hover:text-white/80 hover:border-purple-400/40"
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-coral-400 text-sm">{error}</p>}

      {answer && (
        <div className="rounded-xl border border-navy-600/40 bg-navy-800/40 p-4 space-y-4">
          <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">{answer}</p>
          {sources.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-navy-700/50">
              <p className="text-[10px] uppercase tracking-wider text-white/35">
                {ko ? "출처" : "Sources"}
              </p>
              {sources.map((s) => (
                <div key={s.id} className="text-xs text-white/50">
                  <span className="text-purple-300/90">{s.title}</span>
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
    </div>
  );
}
