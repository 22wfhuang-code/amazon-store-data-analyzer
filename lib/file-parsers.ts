// lib/file-parsers.ts
import { parseCsvToRows } from "./schema";

export function parseAnyToRows(input: { csv?: string; filename?: string; buffer?: Buffer }) {
  if (input.csv) {
    return parseCsvToRows(input.csv);
  }

  const name = (input.filename || "").toLowerCase();

  if (name.endsWith(".csv")) {
    const text = input.buffer?.toString("utf-8") || "";
    return parseCsvToRows(text);
  }

  // MVP：xlsx 先提示（你后续要我我可以给你加 xlsx 解析）
  if (name.endsWith(".xlsx")) {
    throw new Error("当前 MVP 仅稳定支持 CSV（.xlsx 解析可后续加入）。");
  }

  throw new Error("Unsupported file type. Please upload .csv (or .xlsx later).");
}

// ✅ 供 field-mapper.ts 复用：归一化表头
export function normalizeHeader(s: string) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    // 空格/下划线/连字符/点/斜杠 统一去掉
    .replace(/[\s\-_./]+/g, "")
    // 去掉其它符号（保留字母数字和中文）
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, "");
}

// ✅ 供 field-mapper.ts / 其它模块使用：构建“归一化表头 -> 列索引”
export function buildNormalizedIndex(headers: string[]) {
  const idx: Record<string, number> = {};

  for (let i = 0; i < headers.length; i++) {
    const key = normalizeHeader(headers[i]);
    if (!key) continue;
    if (idx[key] === undefined) idx[key] = i; // 保留第一次出现
  }

  return { idx, normalizeHeader };
}
