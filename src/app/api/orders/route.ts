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
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("GET /api/orders:", err);
    return NextResponse.json({ error: "Kunde inte hämta beställningar." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, event_date, guests, service, message, cart_summary } = body;

    if (!name || !email) {
      return NextResponse.json({ error: "Namn och e-post krävs." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        event_date: event_date ? String(event_date).trim() : null,
        guests: guests ? String(guests).trim() : null,
        service: service ? String(service).trim() : null,
        message: message ? String(message).trim() : null,
        cart_summary: cart_summary ? String(cart_summary).trim() : null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("POST /api/orders Supabase error:", error);
      agentLog({ location: "orders:POST", message: "supabase_error", data: { msg: error.message }, timestamp: Date.now(), hypothesisId: "H4" });
      return NextResponse.json(
        { error: error.message || "Kunde inte spara beställningen." },
        { status: 500 }
      );
    }
    agentLog({ location: "orders:POST", message: "success", data: { id: (data as { id?: string })?.id }, timestamp: Date.now(), hypothesisId: "H4" });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Kunde inte spara beställningen.";
    console.error("POST /api/orders:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
