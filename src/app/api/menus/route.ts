import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

/** GET /api/menus – list all menus, optionally filter by slug */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    const supabase = createSupabaseAdminClient();

    let query = supabase
      .from("menus")
      .select("*")
      .order("display_order", { ascending: true });

    if (slug) {
      query = query.eq("slug", slug);
    }

    const { data: menus, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(slug && menus?.length ? menus[0] : menus ?? []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
