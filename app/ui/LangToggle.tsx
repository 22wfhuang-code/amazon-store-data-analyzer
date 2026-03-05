"use client";

import { useRouter } from "next/navigation";
import { setLangClient, type Lang } from "@/lib/i18n";

export default function LangToggle({ lang }: { lang: Lang }) {
  const router = useRouter();
  const next = lang === "zh" ? "en" : "zh";

  return (
    <button
      className="btn"
      onClick={() => {
        setLangClient(next);
        router.refresh();
      }}
      aria-label="toggle language"
    >
      {next === "en" ? "EN" : "中文"}
    </button>
  );
}