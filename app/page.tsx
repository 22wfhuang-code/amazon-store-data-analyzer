import Link from "next/link";
import t from "@/lib/i18n";

type MetricCardProps = {
  title: string;
  rule: string;
  actions: readonly string[];
};

function MetricCard({ title, rule, actions }: MetricCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="font-semibold mb-2">{title}</div>

      <div className="text-sm opacity-80 mb-2">
        {rule}
      </div>

      <ul className="text-sm list-disc pl-4 space-y-1">
        {actions.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">

      {/* 标题 */}
      <section>
        <h1 className="text-3xl font-bold mb-3">
          Amazon Store Data Analyzer
        </h1>

        <p className="opacity-80 mb-4">
          Upload your Amazon data and understand why your store is making or losing money.
        </p>

        <Link className="btn" href="/upload">
          {t.btnUpload}
        </Link>

        <div className="mt-3 text-sm opacity-70">
          {t.demoTip}
        </div>
      </section>

      {/* 规则解释 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="border rounded-lg p-6">
          <div className="text-lg font-semibold mb-3">
            {t.whatTitle}
          </div>

          <div className="grid grid-cols-1 gap-4">

            <MetricCard
              title={t.k_gmv}
              rule={t.k_gmv_rule}
              actions={t.k_gmv_do}
            />

            <MetricCard
              title={t.k_roi}
              rule={t.k_roi_rule}
              actions={t.k_roi_do}
            />

            <MetricCard
              title={t.k_cr}
              rule={t.k_cr_rule}
              actions={t.k_cr_do}
            />

            <MetricCard
              title={t.k_margin}
              rule={t.k_margin_rule}
              actions={t.k_margin_do}
            />

            <MetricCard
              title={t.k_inv}
              rule={t.k_inv_rule}
              actions={t.k_inv_do}
            />

          </div>
        </div>

        {/* 隐私说明 */}
        <div className="border rounded-lg p-6">

          <div className="text-lg font-semibold mb-3">
            {t.privacyTitle}
          </div>

          <p className="opacity-80">
            {t.privacyDesc}
          </p>

          <p className="mt-3 text-sm opacity-70">
            Tip: Data is analyzed locally and not stored.
          </p>

        </div>

      </section>

      <div className="text-xs opacity-60">
        MVP mode: rule-based diagnosis (no external API required)
      </div>

    </main>
  );
}

