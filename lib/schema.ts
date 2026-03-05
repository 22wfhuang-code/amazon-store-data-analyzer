// lib/schema.ts

// ===== Types used by LLM diagnosis =====
export type Metrics = {
  adRoi: number | null;
  conversionRate: number | null;
  profitMargin: number | null;
  inventoryDays: number | null;

  // 你如果还有别的指标，允许扩展
  [k: string]: any;
};

export type Diagnosis = {
  lang: "zh" | "en";
  score: number;
  summary: string[];
  topProblems: { title: string; why: string; metricHint?: string }[];
  metrics: Metrics;
  actionPlan: { day: string; actions: string[] }[];
};

// ===== CSV helper (你之前放在 schema 里也行，先不动结构) =====
export function parseCsvToRows(csv: string): Record<string, any>[] {
  const lines = csv
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((h) => h.trim());
  const rows: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const row: Record<string, any> = {};
    headers.forEach((h, idx) => (row[h] = cols[idx] ?? ""));
    rows.push(row);
  }

  return rows;
}

function splitCsvLine(line: string): string[] {
  // 简易 CSV 分割（支持引号）
  const out: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQ = !inQ;
      continue;
    }
    if (ch === "," && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}
