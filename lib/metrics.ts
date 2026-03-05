// lib/metrics.ts
type Row = Record<string, any>;

function num(x: any): number {
  const v = typeof x === "number" ? x : parseFloat(String(x).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(v) ? v : 0;
}

function normalizeKey(k: string) {
  return String(k ?? "").trim().toLowerCase();
}

const REQUIRED_COLS = ["gmv", "orders", "ads_cost", "sessions"] as const;
type RequiredCol = (typeof REQUIRED_COLS)[number];

export function validateCsvColumns(rows: Row[]) {
  const first = rows?.[0] ?? {};
  const keys = Object.keys(first).map(normalizeKey);

  const missing = REQUIRED_COLS.filter((k) => !keys.includes(k));
  if (missing.length) {
    throw new Error(
      `CSV 列名不符合模板，缺少列：${missing.join(", ")}。请使用模板列名：gmv, orders, ads_cost, sessions（profit 可选）。`
    );
  }

  return true;
}

// 固定模板：必须是全小写列名：gmv, orders, ads_cost, sessions（profit 可选）
export function computeMetrics(rows: Row[]) {
  if (!rows || rows.length === 0) {
    throw new Error("CSV 为空或解析失败：请上传包含数据的 CSV。");
  }

  // ✅ 先校验列名（强约束，避免“自动映射”带来的不确定性）
  validateCsvColumns(rows);

  let orders = 0;
  let gmv = 0;
  let adSpend = 0;
  let sessions = 0;
  let profit = 0;

  for (const r of rows) {
    orders += num(r["orders"]);
    gmv += num(r["gmv"]);
    adSpend += num(r["ads_cost"]);
    sessions += num(r["sessions"]);
    profit += num(r["profit"]); // 可选
  }

  const conversionRate = sessions > 0 ? orders / sessions : 0;
  const adRoi = adSpend > 0 ? gmv / adSpend : 0;

  // profitMargin：如果 profit 全为空，就用 0（MVP 不再“猜”成本结构）
  const profitMargin = gmv > 0 ? profit / gmv : 0;

  // MVP：库存周转先给一个占位值（后续再做真实库存字段）
  const inventoryTurnover = orders > 0 ? Math.max(1, orders / 14.7) : 0;

  return {
    gmv,
    sessions,
    orders,
    sales: gmv,
    adSpend,
    profit,
    conversionRate,
    adRoi,
    profitMargin,
    inventoryTurnover,
  };
}
