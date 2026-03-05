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

  throw new Error("只支持 CSV 文件");
}
