import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

/** GET /api/menus/[slug]/items – get menu items by menu slug */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createSupabaseAdminClient();

    const { data: menu } = await supabase
      .from("menus")
      .select("id")
      .eq("slug", slug)
      .single();

    if (!menu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    const { data: items, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("menu_id", menu.id)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(items ?? []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
