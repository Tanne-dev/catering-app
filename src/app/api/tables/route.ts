import { NextResponse } from "next/server";
import { getTables, getTableStats } from "@/lib/tables";

export async function GET() {
  try {
    const tables = getTables();
    const stats = getTableStats();
    return NextResponse.json(
      { tables, stats },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("[api/tables] error:", e);
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    );
  }
}
