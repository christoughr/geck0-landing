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
  const [jiraSite, setJiraSite] = useState("");
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraToken, setJiraToken] = useState("");
  const [slackChannel, setSlackChannel] = useState("");
  const [slackJson, setSlackJson] = useState("");
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

  const post = async (body: Record<string, unknown>) => {
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/app/connectors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMessage(ko ? "완료" : "Done");
      void load();
    } else {
      setMessage(data.error ?? "Failed");
    }
    return res.ok;
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
            ? "Notion, Slack, Google Drive, Jira, 수동 업로드로 지식 베이스를 채웁니다."
            : "Fill your knowledge base via Notion, Slack, Google Drive, Jira, or manual upload."
        }
      />

      <div className="grid sm:grid-cols-2 gap-3">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-navy-600/40 bg-navy-800/20 px-4 py-3"
          >
            <p className="text-sm font-medium text-white capitalize">{c.id}</p>
            <p className="text-[10px] text-white/40 mt-1">
              {statusLabel(c)} · {c.documentCount} docs
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Slack</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/app/oauth/slack"
            className="px-4 py-2 rounded-lg bg-[#4A154B] hover:opacity-90 text-white text-sm font-medium"
          >
            {ko ? "Slack OAuth 연결" : "Connect Slack (OAuth)"}
          </a>
          <button
            type="button"
            disabled={loading}
            onClick={() => void post({ action: "slack_sync" })}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm"
          >
            {ko ? "재동기화" : "Re-sync"}
          </button>
        </div>
        <p className="text-xs text-white/40">{ko ? "또는 export JSON 붙여넣기:" : "Or paste export JSON:"}</p>
        <input
          value={slackChannel}
          onChange={(e) => setSlackChannel(e.target.value)}
          placeholder={ko ? "채널명" : "Channel name"}
          className="w-full min-h-[40px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <textarea
          value={slackJson}
          onChange={(e) => setSlackJson(e.target.value)}
          rows={3}
          placeholder='[{"text":"message"}]'
          className="w-full bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 py-2 text-xs text-white font-mono"
        />
        <button
          type="button"
          disabled={loading || !slackChannel || !slackJson}
          onClick={() => {
            try {
              const messages = JSON.parse(slackJson) as { text?: string }[];
              void post({ action: "slack_export", channel: slackChannel, messages });
            } catch {
              setMessage(ko ? "JSON 형식 오류" : "Invalid JSON");
            }
          }}
          className="text-sm text-purple-300 hover:text-purple-200"
        >
          {ko ? "Slack export 가져오기" : "Import Slack export"}
        </button>
      </section>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Google Drive</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/app/oauth/google"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/20"
          >
            {ko ? "Drive OAuth 연결" : "Connect Google Drive"}
          </a>
          <button
            type="button"
            disabled={loading}
            onClick={() => void post({ action: "drive_sync" })}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm"
          >
            {ko ? "재동기화" : "Re-sync"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Notion</h2>
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
            onClick={() => void post({ action: "notion_token", token: notionToken })}
            className="px-4 py-2 rounded-lg bg-purple-400 hover:bg-purple-600 text-white text-sm font-medium disabled:opacity-50"
          >
            {ko ? "Notion 연결" : "Connect Notion"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void post({ action: "notion_sync" })}
            className="px-4 py-2 rounded-lg border border-white/20 text-white/70 text-sm"
          >
            {ko ? "재동기화" : "Re-sync"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Jira</h2>
        <input
          value={jiraSite}
          onChange={(e) => setJiraSite(e.target.value)}
          placeholder="yourcompany.atlassian.net"
          className="w-full min-h-[40px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <input
          value={jiraEmail}
          onChange={(e) => setJiraEmail(e.target.value)}
          placeholder="email@company.com"
          className="w-full min-h-[40px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <input
          type="password"
          value={jiraToken}
          onChange={(e) => setJiraToken(e.target.value)}
          placeholder="API token"
          className="w-full min-h-[40px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <button
          type="button"
          disabled={loading || !jiraSite || !jiraEmail || !jiraToken}
          onClick={() =>
            void post({
              action: "jira_credentials",
              site: jiraSite,
              email: jiraEmail,
              token: jiraToken,
            })
          }
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium disabled:opacity-50"
        >
          {ko ? "Jira 연결 · 동기화" : "Connect & sync Jira"}
        </button>
      </section>

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">{ko ? "문서 업로드" : "Upload"}</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={ko ? "제목" : "Title"}
          className="w-full min-h-[44px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 py-3 text-sm text-white"
        />
        <button
          type="button"
          disabled={loading || !title || !content}
          onClick={async () => {
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
              setMessage(ko ? "추가됨" : "Added");
              void load();
            }
          }}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {ko ? "추가" : "Add"}
        </button>
      </section>

      {message && <p className="text-sm text-teal-300">{message}</p>}
    </div>
  );
}
