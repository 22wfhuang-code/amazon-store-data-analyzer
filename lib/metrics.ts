// lib/metrics.ts
type Row = Record<string, any>;

function num(x: any): number {
  const v = typeof x === "number" ? x : parseFloat(String(x).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(v) ? v : 0;
}

const REQUIRED_COLS = ["gmv", "orders", "ads_cost", "sessions"];

export function computeMetrics(rows: Row[]) {

  if (!rows || rows.length === 0) {
    throw new Error("CSV 为空");
  }

  const headers = Object.keys(rows[0]).map(k => k.toLowerCase());

  const missing = REQUIRED_COLS.filter(c => !headers.includes(c));

  if (missing.length) {
    throw new Error(
      `CSV 缺少列: ${missing.join(", ")}\n必须包含: gmv, orders, ads_cost, sessions`
    );
  }

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
    profit += num(r["profit"]);
  }

  const conversionRate = sessions > 0 ? orders / sessions : 0;
  const adRoi = adSpend > 0 ? gmv / adSpend : 0;
  const profitMargin = gmv > 0 ? profit / gmv : 0;

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
