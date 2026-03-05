// lib/llm.ts
import { Diagnosis, Metrics } from "./schema";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function fmtPct(x: number | null): string {
  if (x === null) return "-";
  return (x * 100).toFixed(1) + "%";
}

function fmtNum(x: number): string {
  return Number.isFinite(x) ? x.toFixed(2) : "-";
}

export function generateDiagnosis(metrics: Metrics, lang: "zh" | "en"): Diagnosis {
  let score = 70;

  // Ad ROI
  if (metrics.adRoi !== null) {
    if (metrics.adRoi < 1.2) score -= 20;
    else if (metrics.adRoi < 2.0) score -= 10;
    else score += 5;
  } else {
    score -= 5;
  }

  // Conversion
  if (metrics.conversionRate !== null) {
    if (metrics.conversionRate < 0.02) score -= 10;
    else if (metrics.conversionRate < 0.04) score -= 5;
    else score += 5;
  }

  // Profit margin
  if (metrics.profitMargin !== null) {
    if (metrics.profitMargin < 0.1) score -= 10;
    else if (metrics.profitMargin < 0.2) score -= 5;
    else score += 5;
  }

  // Inventory days
  if (metrics.inventoryDays !== null) {
    if (metrics.inventoryDays > 90) score -= 10;
    else if (metrics.inventoryDays > 60) score -= 5;
    else score += 5;
  }

  score = clamp(Math.round(score), 0, 100);

  const isZH = lang === "zh";
  const summary: string[] = [];
  const topProblems: { title: string; why: string; metricHint?: string }[] = [];

  if (metrics.adRoi !== null && metrics.adRoi < 2.0) {
    topProblems.push({
      title: isZH ? "广告 ROI 偏低" : "Ad ROI is low",
      why: isZH
        ? "广告花费消耗了利润，但投放带来的销售增长不足。优先排查低 ROI 广告组/关键词、Listing 转化与定价。"
        : "Ad spend is not converting into proportional sales. Review low-ROI campaigns/keywords and improve listing conversion & pricing.",
      metricHint: `ROI=${metrics.adRoi.toFixed(2)}`,
    });
  }

  if (metrics.conversionRate !== null && metrics.conversionRate < 0.03) {
    topProblems.push({
      title: isZH ? "转化率偏低" : "Conversion rate is low",
      why: isZH
        ? "说明流量质量或详情页承接不足。重点优化主图/标题关键词/价格、评价与A+页面，减少无效流量。"
        : "Traffic quality or listing page is underperforming. Improve images/title/keywords/price, reviews and A+ content; reduce irrelevant traffic.",
      metricHint: `CVR=${fmtPct(metrics.conversionRate)}`,
    });
  }

  if (metrics.inventoryDays !== null && metrics.inventoryDays > 60) {
    topProblems.push({
      title: isZH ? "库存周转慢" : "Inventory turns slowly",
      why: isZH
        ? "资金被库存占用、仓储费用上升。需要识别滞销 SKU、做清货/降价/捆绑，集中资源在高周转款。"
        : "Cash is tied up and storage costs rise. Identify slow-moving SKUs, discount/bundle/liquidate, and focus on fast movers.",
      metricHint: `Days=${fmtNum(metrics.inventoryDays)}`,
    });
  }

  if (metrics.profitMargin !== null && metrics.profitMargin < 0.15) {
    topProblems.push({
      title: isZH ? "利润率偏低" : "Profit margin is low",
      why: isZH
        ? "可能是定价偏低、成本上升或广告占比过高。需拆解到 SKU 级别利润与广告占比，做结构性调价/控费。"
        : "Pricing may be too low, costs too high, or ads too heavy. Break down SKU-level margin and ad ratio; adjust pricing and costs.",
      metricHint: `Margin=${fmtPct(metrics.profitMargin)}`,
    });
  }

  while (topProblems.length < 3) {
    topProblems.push({
      title: isZH ? "数据字段不足" : "Insufficient columns",
      why: isZH
        ? "当前上传的数据缺少关键字段（如 sessions、ads_cost、profit 或库存周转），建议补齐后再分析以提升准确性。"
        : "Missing key columns (sessions, ads_cost, profit, inventory_days). Upload richer data for a more accurate diagnosis.",
    });
  }

  summary.push(isZH ? `健康度评分：${score}/100` : `Health score: ${score}/100`);
  if (metrics.adRoi !== null) summary.push((isZH ? "广告ROI" : "Ad ROI") + `：${metrics.adRoi.toFixed(2)}`);
  if (metrics.conversionRate !== null) summary.push((isZH ? "转化率" : "CVR") + `：${fmtPct(metrics.conversionRate)}`);
  if (metrics.inventoryDays !== null) summary.push((isZH ? "库存周转(天)" : "Inventory days") + `：${fmtNum(metrics.inventoryDays)}`);

  const actionPlan = [
    {
      day: isZH ? "Day 1-2（广告）" : "Day 1-2 (Ads)",
      actions: isZH
        ? ["关停 ROI<1 的广告组/关键词", "聚焦 10-20 个高意图关键词，控制 CPC", "将预算从低转化词迁移到高转化词"]
        : ["Pause campaigns/keywords with ROI<1", "Focus on 10–20 high-intent keywords; control CPC", "Shift budget to better converting terms"],
    },
    {
      day: isZH ? "Day 3（Listing）" : "Day 3 (Listing)",
      actions: isZH
        ? ["优化主图与标题关键词", "检查价格带与竞品对比", "补齐 A+ 与卖点结构，提升承接"]
        : ["Improve main image & title keywords", "Review pricing vs competitors", "Enhance A+ and value propositions"],
    },
    {
      day: isZH ? "Day 4（转化）" : "Day 4 (Conversion)",
      actions: isZH
        ? ["梳理差评点并修复（包装/质量/描述偏差）", "引导售后与好评（合规前提）", "减少无效流量来源"]
        : ["Fix issues causing negative reviews", "Improve post-purchase experience (compliant)", "Reduce irrelevant traffic sources"],
    },
    {
      day: isZH ? "Day 5（选品/结构）" : "Day 5 (Assortment)",
      actions: isZH
        ? ["识别高转化 SKU：增加曝光与预算", "识别低毛利 SKU：调价或停推", "建立 SKU 级别利润表"]
        : ["Identify high-converting SKUs and boost exposure", "Adjust/stop low-margin SKUs", "Create SKU-level margin table"],
    },
    {
      day: isZH ? "Day 6（库存）" : "Day 6 (Inventory)",
      actions: isZH
        ? ["滞销 SKU 清货：降价/捆绑/促销", "限制补货到高周转款", "设定库存天数目标：45 天"]
        : ["Clear slow-moving SKUs via discount/bundles", "Replenish fast movers first", "Set target inventory days: 45"],
    },
    {
      day: isZH ? "Day 7（复盘）" : "Day 7 (Review)",
      actions: isZH
        ? ["复盘 7 天前后 ROI/CVR/库存天数变化", "固化有效规则到投放与选品 SOP", "准备下一轮测试数据上传"]
        : ["Review changes in ROI/CVR/inventory days", "Turn wins into SOPs", "Prepare next data upload cycle"],
    },
  ];

  return {
    lang,
    score,
    summary,
    topProblems: topProblems.slice(0, 3),
    metrics,
    actionPlan,
  };
}
