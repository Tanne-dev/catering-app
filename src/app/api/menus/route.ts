import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSupabaseAdminClient } from "@/lib/supabase";

/** POST /api/menus – ensure menu exists (create if not). Admin only. */
export async function POST(request: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const slug = body?.slug as string | undefined;
    const title = (body?.title as string) || slug || "";
    if (!slug?.trim()) {
      return NextResponse.json({ error: "slug krävs" }, { status: 400 });
    }
    const supabase = createSupabaseAdminClient();
    const { data: existing } = await supabase
      .from("menus")
      .select("id, slug, title")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(existing);
    }
    const maxOrderRes = await supabase.from("menus").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle();
    const nextOrder = (maxOrderRes.data?.display_order ?? -1) + 1;
    const { data: created, error } = await supabase
      .from("menus")
      .insert({ slug: slug.trim(), title: title.trim() || slug, display_order: nextOrder })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

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
