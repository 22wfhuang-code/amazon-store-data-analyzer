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