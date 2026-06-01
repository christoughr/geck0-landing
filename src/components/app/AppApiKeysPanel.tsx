"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/translations";
import AppPageHeader from "@/components/app/AppPageHeader";

type KeyRecord = {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
};

export default function AppApiKeysPanel({ locale }: { locale: Locale }) {
  const ko = locale === "ko";
  const [keys, setKeys] = useState<KeyRecord[]>([]);
  const [label, setLabel] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/app/api-keys");
    if (res.ok) {
      const data = (await res.json()) as { keys: KeyRecord[] };
      setKeys(data.keys);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    setMessage("");
    setNewKey(null);
    const res = await fetch("/api/app/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", label }),
    });
    const data = await res.json();
    if (res.ok && data.key) {
      setNewKey(data.key as string);
      setLabel("");
      void load();
    } else {
      setMessage(data.error ?? "Failed");
    }
  };

  const revoke = async (id: string) => {
    await fetch("/api/app/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke", id }),
    });
    void load();
  };

  return (
    <div className="space-y-6">
      <AppPageHeader
        title="API"
        description={
          ko
            ? "api.geck0.ai/v1 에서 Bearer 토큰으로 Q&A·지식 목록을 호출합니다."
            : "Call Q&A and knowledge list at api.geck0.ai/v1 with a Bearer token."
        }
      />

      <section className="rounded-2xl border border-navy-600/40 bg-navy-800/30 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">{ko ? "새 API 키" : "New API key"}</h2>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={ko ? "라벨 (예: CI)" : "Label (e.g. CI)"}
          className="w-full min-h-[44px] bg-navy-900/80 border border-navy-600/50 rounded-xl px-4 text-sm text-white"
        />
        <button
          type="button"
          onClick={() => void create()}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium"
        >
          {ko ? "키 생성" : "Create key"}
        </button>
        {newKey && (
          <p className="text-xs text-amber-200/90 break-all bg-amber-950/30 border border-amber-500/30 rounded-lg p-3">
            {ko ? "한 번만 표시됩니다: " : "Shown once: "}
            <code>{newKey}</code>
          </p>
        )}
      </section>

      <pre className="text-[11px] text-white/40 bg-navy-950/50 border border-navy-700/40 rounded-xl p-4 overflow-x-auto">
{`curl -X POST https://api.geck0.ai/v1/qa \\
  -H "Authorization: Bearer gk_…" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"Q1 churn?","locale":"en"}'`}
      </pre>

      <ul className="space-y-2">
        {keys.map((k) => (
          <li
            key={k.id}
            className="flex items-center justify-between rounded-xl border border-navy-600/40 px-4 py-3"
          >
            <div>
              <p className="text-sm text-white">{k.label}</p>
              <p className="text-[10px] text-white/35">{k.prefix}…</p>
            </div>
            <button
              type="button"
              onClick={() => void revoke(k.id)}
              className="text-xs text-coral-300 hover:text-coral-200"
            >
              {ko ? "삭제" : "Revoke"}
            </button>
          </li>
        ))}
      </ul>

      {message && <p className="text-sm text-coral-300">{message}</p>}
    </div>
  );
}
