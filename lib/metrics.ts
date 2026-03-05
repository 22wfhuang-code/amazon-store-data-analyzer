// lib/metrics.ts
function num(x: any): number {
  const v = typeof x === "number" ? x : parseFloat(String(x).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(v) ? v : 0;
}

function pick(row: Record<string, any>, keys: string[]) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") return row[k];
  }
  return 0;
}

export function computeMetrics(rows: Record<string, any>[]) {
  // 支持多种列名（你后续可以继续扩展映射）
  let orders = 0;
  let gmv = 0;
  let adSpend = 0;
  let sessions = 0;
  let profit = 0;
  let cogs = 0;

  for (const r of rows) {
    orders += num(pick(r, ["orders", "Orders", "order_count"]));
    gmv += num(pick(r, ["gmv", "GMV", "sales", "Sales"]));
    adSpend += num(pick(r, ["ads_cost", "adSpend", "ad_spend", "Spend"]));
    sessions += num(pick(r, ["sessions", "Sessions", "traffic"]));
    profit += num(pick(r, ["profit", "Profit"]));
    cogs += num(pick(r, ["cogs", "COGS"]));
  }

  const conversionRate = sessions > 0 ? orders / sessions : 0;
  const adRoi = adSpend > 0 ? gmv / adSpend : 0;

  // profitMargin：优先用 profit；没有就用 gmv - adSpend - cogs
  const computedProfit = profit !== 0 ? profit : gmv - adSpend - cogs;
  const profitMargin = gmv > 0 ? computedProfit / gmv : 0;

  // inventoryTurnover：如果有库存/出库字段你再补，这里给一个占位逻辑
  const inventoryTurnover = orders > 0 ? Math.max(1, orders / 14.7) : 0;

  return {
    gmv,
    sessions,
    orders,
    sales: gmv,
    adSpend,
    cogs,
    profit: computedProfit,
    conversionRate,
    adRoi,
    profitMargin,
    inventoryTurnover,
  };
}