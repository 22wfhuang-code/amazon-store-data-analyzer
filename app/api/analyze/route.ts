// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { parseAnyToRows } from "@/lib/file-parsers";
import { computeMetrics } from "@/lib/metrics";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";

    let rows: Record<string, any>[] = [];

    // demo: JSON { csv }
    if (ct.includes("application/json")) {
      const body = await req.json();
      const csv = String(body?.csv || "");
      rows = parseAnyToRows({ csv });
    } else {
      // upload: multipart/form-data { file }
      const form = await req.formData();
      const file = form.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json({ ok: false, error: "No file uploaded" }, { status: 400 });
      }

      const buf = Buffer.from(await (file as File).arrayBuffer());
      rows = parseAnyToRows({
        filename: (file as File).name,
        buffer: buf,
      });
    }

    const metrics = computeMetrics(rows);

    // 规则诊断 + 7天计划（不依赖外部API）
    const diagnosis: string[] = [];
    const plan: string[] = [];

    if (Number.isFinite(metrics.profitMargin) && metrics.profitMargin < 0) {
      diagnosis.push("利润率为负：优先核对 COGS/广告花费是否过高，或售价偏低。");
    }
    if (Number.isFinite(metrics.adRoi) && metrics.adRoi < 2) {
      diagnosis.push("广告 ROI 偏低：先暂停 ROI<1 的广告组/关键词，保留高转化词。");
    }
    if (Number.isFinite(metrics.conversionRate) && metrics.conversionRate < 0.02) {
      diagnosis.push("转化率偏低：检查主图/标题/价格/评价；优先做 Listing 优化。");
    }

    // 固定 7 天清单（可后续按指标动态生成）
    plan.push("Day1：梳理亏损来源（COGS/广告/退货/佣金），确认数据口径。");
    plan.push("Day2：广告清洗（暂停 ROI<1 的广告组），保留高转化词。");
    plan.push("Day3：Listing 优化（主图/标题/五点/视频），提升转化率。");
    plan.push("Day4：价格/优惠策略（小幅调价 + coupon），验证对 CR 的影响。");
    plan.push("Day5：库存策略（低周转 SKU 清仓/减少补货）。");
    plan.push("Day6：复盘 ROI/CR/毛利变化，继续迭代。");
    plan.push("Day7：固化规则：建立每周报表与阈值告警。");

    return NextResponse.json({
      ok: true,
      metrics,
      diagnosis,
      plan,
      debug: { rowsCount: rows.length, sampleRow: rows[0] || null, metrics },
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}