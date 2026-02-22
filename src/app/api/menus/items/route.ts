import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

/** POST /api/menus/items – create menu item (admin only) */
export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      menu_id,
      name,
      price,
      description,
      image,
      sort_order,
      nigiri,
      uramaki,
      maki,
      allergens,
    } = body;

    if (!menu_id || !name || !price) {
      return NextResponse.json(
        { error: "menu_id, name, price required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();
    const toArray = (v: unknown): string[] => {
      if (Array.isArray(v)) return v.map(String);
      if (typeof v === "string" && v.trim()) {
        try {
          const parsed = JSON.parse(v);
          return Array.isArray(parsed) ? parsed.map(String) : [];
        } catch {
          return v.split(",").map((x: string) => x.trim()).filter(Boolean);
        }
      }
      return [];
    };

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        menu_id,
        name: String(name),
        price: String(price),
        description: description ?? null,
        image: image ?? null,
        sort_order: Number(sort_order) || 0,
        nigiri: toArray(nigiri),
        uramaki: toArray(uramaki),
        maki: toArray(maki),
        allergens: allergens ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
