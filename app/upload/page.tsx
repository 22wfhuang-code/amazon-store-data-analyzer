"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getLangClient, copy } from "@/lib/i18n";

export default function UploadPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const [lang, setLang] = useState<"zh" | "en">("zh");
  const t = copy[lang];

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const demo = sp.get("demo") === "1";

  useEffect(() => {
    setLang(getLangClient());
  }, []);

  useEffect(() => {
    if (demo) runDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  async function runDemo() {
    setLoading(true);
    try {
      const res = await fetch("/sample.csv");
      const csv = await res.text();

      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      });

      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "Analyze failed");

      sessionStorage.setItem("analyze_result", JSON.stringify(data));
      router.push("/report");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function onAnalyze() {
    if (!file) {
      alert(lang === "zh" ? "请选择文件" : "Please choose a file");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      const r = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await r.json();
      if (!data?.ok) throw new Error(data?.error || "Analyze failed");

      sessionStorage.setItem("analyze_result", JSON.stringify(data));
      router.push("/report");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="text-2xl font-bold">{t.uploadTitle}</div>
        <p className="mt-2 opacity-80">{t.uploadDesc}</p>

        <div className="mt-4 flex items-center gap-3">
          <label className="btn">
            {t.btnChooseFile}
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <button
            className="btn btn-primary"
            onClick={onAnalyze}
            disabled={loading}
          >
            {loading ? t.analyzing : t.btnAnalyze}
          </button>

          <button className="btn" onClick={runDemo} disabled={loading}>
            {t.btnTryDemo}
          </button>
        </div>

        {file && (
          <div className="mt-3 text-sm opacity-70">
            {lang === "zh" ? "已选择：" : "Selected: "} {file.name}（
            {Math.round(file.size / 1024)} KB）
          </div>
        )}
      </div>
    </div>
  );
}