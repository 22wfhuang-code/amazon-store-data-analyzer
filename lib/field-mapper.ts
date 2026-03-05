// lib/field-mapper.ts
import { buildNormalizedIndex } from "./file-parsers";

export type SemanticKey =
  | "gmv"
  | "orders"
  | "ads_cost"
  | "profit"
  | "profit_margin"
  | "conversion"
  | "inventory_days";

export type MappingResult = {
  mapping: Partial<Record<SemanticKey, string>>; // semantic -> column name
  confidence: Partial<Record<SemanticKey, number>>; // 0~1
  needsConfirm: boolean;
  candidates: Partial<Record<SemanticKey, string[]>>;
  missing: SemanticKey[];
};

const SYNONYMS: Record<SemanticKey, string[]> = {
  gmv: ["gmv", "sales", "revenue", "amount", "turnover", "销售额", "成交额", "营收", "付款金额", "销售金额"],
  orders: ["orders", "ordercount", "qty", "quantity", "订单数", "订单量", "销量", "件数"],
  ads_cost: ["adspend", "adcost", "ads", "marketing", "promo", "advertising", "广告费", "推广费", "投放", "营销费用"],
  profit: ["profit", "netprofit", "marginamount", "利润", "净利润", "毛利"],
  profit_margin: ["profitmargin", "margin", "利润率", "毛利率"],
  conversion: ["cvr", "conversion", "转化率", "购买率"],
  inventory_days: ["inventorydays", "days", "turnoverdays", "库存周转", "周转天数", "库存天数"],
};

function scoreHeaderMatch(headerNorm: string, tokens: string[]) {
  let best = 0;
  for (const t of tokens) {
    const tn = String(t).trim().toLowerCase().replace(/\s+/g, "");
    if (!tn) continue;
    if (headerNorm === tn) best = Math.max(best, 1);
    else if (headerNorm.includes(tn)) best = Math.max(best, 0.85);
  }
  return best;
}

export function inferMapping(columns: string[]): MappingResult {
  const { normalizeHeader } = buildNormalizedIndex(columns);

  const mapping: MappingResult["mapping"] = {};
  const confidence: MappingResult["confidence"] = {};
  const candidates: MappingResult["candidates"] = {};
  const missing: SemanticKey[] = [];

  (Object.keys(SYNONYMS) as SemanticKey[]).forEach((k) => {
    const scored = columns
      .map((c) => ({ col: c, s: scoreHeaderMatch(normalizeHeader(c), SYNONYMS[k]) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s);

    candidates[k] = scored.slice(0, 5).map((x) => x.col);

    if (scored.length === 0) {
      missing.push(k);
      return;
    }

    const best = scored[0];
    mapping[k] = best.col;
    confidence[k] = best.s;
  });

  // 需要确认：任何关键字段置信度低 或 关键字段缺失
  const critical: SemanticKey[] = ["gmv", "orders"];
  const lowConf = Object.entries(confidence).some(([, v]) => (v ?? 0) < 0.85);
  const missingCritical = critical.some((k) => !mapping[k]);

  return {
    mapping,
    confidence,
    candidates,
    missing,
    needsConfirm: lowConf || missingCritical,
  };
}