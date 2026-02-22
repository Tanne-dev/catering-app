import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

/** PUT /api/menus/items/[id] – update menu item (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.price !== undefined) updates.price = body.price;
    if (body.description !== undefined) updates.description = body.description;
    if (body.image !== undefined) updates.image = body.image;
    if (body.sort_order !== undefined) updates.sort_order = Number(body.sort_order);
    if (body.allergens !== undefined) updates.allergens = body.allergens;
    if (body.nigiri !== undefined) {
      updates.nigiri = Array.isArray(body.nigiri)
        ? body.nigiri
        : typeof body.nigiri === "string"
          ? JSON.parse(body.nigiri || "[]")
          : [];
    }
    if (body.uramaki !== undefined) {
      updates.uramaki = Array.isArray(body.uramaki)
        ? body.uramaki
        : typeof body.uramaki === "string"
          ? JSON.parse(body.uramaki || "[]")
          : [];
    }
    if (body.maki !== undefined) {
      updates.maki = Array.isArray(body.maki)
        ? body.maki
        : typeof body.maki === "string"
          ? JSON.parse(body.maki || "[]")
          : [];
    }
    updates.updated_at = new Date().toISOString();

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
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

/** DELETE /api/menus/items/[id] – delete menu item (admin only) */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
