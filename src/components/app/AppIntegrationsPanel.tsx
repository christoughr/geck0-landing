"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import AppPageHeader from "@/components/app/AppPageHeader";

type Connector = {
  id: string;
  status: string;
  lastSyncAt: string | null;
  detail: string | null;
  documentCount: number;
};

export default function AppIntegrationsPanel({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [notionToken, setNotionToken] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/app/connectors");
    if (res.ok) {
      const data = (await res.json()) as { connectors: Connector[] };
      setConnectors(data.connectors);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const connectNotion = async () => {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/app/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notion_token", token: notionToken }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(ko ? `Notion 동기화 완료 (${data.synced ?? 0}페이지)` : `Notion synced (${data.synced ?? 0} pages)`);
      void load();
    } else {
      setMessage(data.error ?? "Failed");
    }
  };

  const syncNotion = async () => {
    setLoading(true);
    const res = await fetch("/api/app/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notion_sync" }),
    });
    const data = await res.json();
    setLoading(false);
    setMessage(res.ok ? (ko ? "재동기화 완료" : "Re-synced") : data.error);
    void load();
  };

  const uploadDoc = async () => {
    setLoading(true);
    const res = await fetch("/api/app/knowledge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, source: "Manual upload" }),
    });
    setLoading(false);
    if (res.ok) {
      setTitle("");
      setContent("");
      setMessage(ko ? "문서가 지식 베이스에 추가되었습니다." : "Document added to knowledge base.");
      void load();
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Upload failed");
    }
  };

  const statusLabel = (c: Connector) => {
    if (c.status === "connected") return ko ? "연결됨" : "Connected";
    if (c.status === "syncing") return ko ? "동기화 중" : "Syncing";
    if (c.status === "error") return ko ? "오류" : "Error";
    return ko ? "미연결" : "Disconnected";
  };

  return (
    <div className="w-full space-y-8">
      <AppPageHeader
        title={ko ? "연동" : "Integrations"}
        description={
          ko
            ? "Notion 토큰 연결 또는 문서 업로드로 실제 지식 베이스를 확장하세요."
            : "Connect Notion or upload documents to expand your live knowledge base."
        }
      />

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Notion</h2>
        <p className="text-xs text-white/45">
          {ko
            ? "Notion Integration 토큰을 붙여넣으면 페이지를 가져옵니다 (integration에 페이지 공유 필요)."
            : "Paste a Notion integration token (pages must be shared with the integration)."}
        </p>
        <input
          type="password"
          value={notionToken}
          onChange={(e) => setNotionToken(e.target.value)}
          placeholder="secret_…"
          className="w-full min-h-[44px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading || !notionToken}
            onClick={() => void connectNotion()}
            className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {ko ? "Notion 연결 · 동기화" : "Connect & sync Notion"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void syncNotion()}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm hover:border-white/40"
          >
            {ko ? "재동기화" : "Re-sync"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">{ko ? "문서 업로드" : "Upload document"}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ko ? "제목" : "Title"}
          className="w-full min-h-[44px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={ko ? "본문 (마크다운 가능)" : "Body (markdown ok)"}
          rows={6}
          className="w-full bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 py-3 text-sm text-white"
        />
        <button
          type="button"
          disabled={loading || !title || !content}
          onClick={() => void uploadDoc()}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium disabled:opacity-50"
        >
          {ko ? "지식 베이스에 추가" : "Add to knowledge base"}
        </button>
      </section>

      <ul className="grid sm:grid-cols-2 gap-3">
        {connectors.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-navy-600/40 bg-navy-800/20 px-4 py-3"
          >
            <span className="text-sm text-white font-medium capitalize">{c.id}</span>
            <span className="text-[10px] text-white/45 text-right">
              {statusLabel(c)}
              <br />
              {c.documentCount} docs
            </span>
          </li>
        ))}
      </ul>

      {message && <p className="text-sm text-teal-300">{message}</p>}
    </div>
  );
}
