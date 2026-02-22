import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

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

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/orders:", err);
    return NextResponse.json({ error: "Kunde inte spara beställningen." }, { status: 500 });
  }
}
