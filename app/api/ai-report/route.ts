// app/api/ai-report/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: false,
    error: "AI report is disabled in MVP mode (no external API).",
  });
}