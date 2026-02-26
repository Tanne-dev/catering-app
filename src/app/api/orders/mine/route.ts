import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

const path = require("path");
const fs = require("fs");
const DEBUG_LOG = path.join(process.cwd(), "..", ".cursor", "debug.log");
function agentLog(p: Record<string, unknown>) {
  try {
    fs.mkdirSync(path.dirname(DEBUG_LOG), { recursive: true });
    fs.appendFileSync(DEBUG_LOG, JSON.stringify(p) + "\n");
  } catch (_) {}
}

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  const email = session?.user?.email;
  agentLog({ location: "orders/mine:GET", message: "entry", data: { hasSession: !!session, role, hasEmail: !!email }, timestamp: Date.now(), hypothesisId: "H1_H3" });

  if (role !== "guest" || !email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const emailFilter = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("email", emailFilter)
      .order("created_at", { ascending: false });

    if (error) throw error;
    const list = data ?? [];
    agentLog({ location: "orders/mine:GET", message: "success", data: { count: list.length, emailPrefix: emailFilter.slice(0, 10) }, timestamp: Date.now(), hypothesisId: "H1" });
    return NextResponse.json(list);
  } catch (err) {
    console.error("GET /api/orders/mine:", err);
    return NextResponse.json(
      { error: "Kunde inte hämta dina beställningar." },
      { status: 500 }
    );
  }
}
