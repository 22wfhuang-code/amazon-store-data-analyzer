// app/report/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getLangClient, copy } from "@/lib/i18n";

type AnalyzeResponse = {
  ok: boolean;
  metrics?: any;
  diagnosis?: string[];
  plan?: string[];
  debug?: any;
  error?: string;
};

function toPct(x: number) {
  if (!Number.isFinite(x)) return "-";
  return `${(x * 100).toFixed(2)}%`;
}

function toMoney(x: number) {
  if (!Number.isFinite(x)) return "-";
  return x.toFixed(2);
}

export default function ReportPage() {
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const t = copy[lang];

  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    setLang(getLangClient());
    const raw = sessionStorage.getItem("analyze_result");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const m = data?.metrics || {};

  const isDev = useMemo(() => process.env.NODE_ENV === "development", []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{t.reportTitle}</div>
        <div className="flex gap-2">
          <Link className="btn" href="/upload">
            {t.reupload}
          </Link>
          <Link className="btn" href="/">
            {t.home}
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="text-lg font-semibold mb-3">{t.metrics}</div>
          <div className="space-y-2 text-sm">
            <div>GMV: {toMoney(m.gmv)}</div>
            <div>{lang === "zh" ? "广告 ROI" : "Ad ROI"}: {toMoney(m.adRoi)}</div>
            <div>{lang === "zh" ? "转化率" : "Conversion Rate"}: {toPct(m.conversionRate)}</div>
            <div>{lang === "zh" ? "利润率" : "Profit Margin"}: {toPct(m.profitMargin)}</div>
            <div>{lang === "zh" ? "库存周转" : "Inventory Turnover"}: {toMoney(m.inventoryTurnover)}</div>
          </div>
          <div className="mt-3 text-xs opacity-60">
            * {lang === "zh" ? "本版为 MVP：规则诊断（不调用外部大模型 API）。" : "MVP: rule-based diagnosis (no external LLM API)."}
          </div>
        </div>

        <div className="card p-6">
          <div className="text-lg font-semibold mb-3">{t.conclusion}</div>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {(data?.diagnosis || []).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
            {(!data?.diagnosis || data.diagnosis.length === 0) && (
              <li className="opacity-70">
                {lang === "zh" ? "暂无结论：请先上传数据或使用示例数据。" : "No diagnosis yet. Upload data or try demo."}
              </li>
            )}
          </ul>
        </div>
      </section>

      <section className="card p-6">
        <div className="text-lg font-semibold mb-3">{t.plan}</div>
        <ol className="list-decimal pl-6 space-y-2 text-sm">
          {(data?.plan || []).map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ol>
      </section>

      {/* Debug：开发环境才允许展示，且默认折叠 */}
      {isDev && data?.debug && (
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{t.debugTitle}</div>
              <div className="text-xs opacity-60 mt-1">{t.debugTip}</div>
            </div>
            <button className="btn" onClick={() => setShowDebug((v) => !v)}>
              {showDebug ? t.hide : t.show}
            </button>
          </div>

          {showDebug && (
            <pre className="mt-4 text-xs whitespace-pre-wrap opacity-80">
              {JSON.stringify(data.debug, null, 2)}
            </pre>
          )}
        </section>
      )}
    </div>
  );
}