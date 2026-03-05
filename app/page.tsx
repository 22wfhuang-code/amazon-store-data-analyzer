// app/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { copy, normalizeLang, LANG_COOKIE } from "@/lib/i18n";

function MetricCard({
  title,
  rule,
  actions,
}: {
  title: string;
  rule: string;
  actions: string[];
}) {
  return (
    <div className="card p-5">
      <div className="text-base font-semibold mb-2">{title}</div>
      <div className="text-sm opacity-80 mb-3">{rule}</div>
      <div className="text-sm">
        <div className="opacity-70 mb-2">你现在就可以做：</div>
        <ul className="list-disc pl-5 space-y-1">
          {actions.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HomePage() {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const t = copy[lang];

  return (
    <div className="space-y-6">
      <section className="card p-8">
        <h1 className="text-3xl font-bold leading-snug">
          <div>{t.heroTitle1}</div>
          <div>{t.heroTitle2}</div>
          <div>{t.heroTitle3}</div>
        </h1>
        <p className="mt-4 opacity-80">{t.heroDesc}</p>

        <div className="mt-6 flex gap-3">
          <Link className="btn btn-primary" href="/upload?demo=1">
            {t.btnTryDemo}
          </Link>
          <Link className="btn" href="/upload">
            {t.btnUpload}
          </Link>
        </div>

        <div className="mt-3 text-sm opacity-70">{t.demoTip}</div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="text-lg font-semibold mb-3">{t.whatTitle}</div>
          <div className="grid grid-cols-1 gap-4">
            <MetricCard title={t.k_gmv} rule={t.k_gmv_rule} actions={t.k_gmv_do} />
            <MetricCard title={t.k_roi} rule={t.k_roi_rule} actions={t.k_roi_do} />
            <MetricCard title={t.k_cr} rule={t.k_cr_rule} actions={t.k_cr_do} />
            <MetricCard title={t.k_margin} rule={t.k_margin_rule} actions={t.k_margin_do} />
            <MetricCard title={t.k_inv} rule={t.k_inv_rule} actions={t.k_inv_do} />
          </div>
        </div>

        <div className="card p-6">
          <div className="text-lg font-semibold mb-3">{t.privacyTitle}</div>
          <p className="opacity-80">{t.privacyDesc}</p>
          <p className="mt-3 text-sm opacity-70">
            Tip: 以后你可以加“本地浏览器存储/可选上传到服务器”的开关增强信任。
          </p>
        </div>
      </section>

      <div className="text-xs opacity-60">
        MVP mode: rule-based diagnosis (no external API required).
      </div>
    </div>
  );
}