import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/** Base URL cho ảnh menu trên Supabase Storage (bucket menu-images) */
export const MENU_IMAGES_BASE_URL =
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://tneqkuvuvttjdymvrbiq.supabase.co").replace(/\/$/, "") +
  "/storage/v1/object/public/menu-images";

/** Chuyển đường dẫn local hoặc relative thành URL Supabase cho ảnh menu */
export function resolveMenuImageUrl(src: string | null | undefined): string | undefined {
  if (!src || typeof src !== "string") return undefined;
  const s = src.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return s.startsWith("/") ? MENU_IMAGES_BASE_URL + s : MENU_IMAGES_BASE_URL + "/" + s;
}

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Server-side Supabase client for admin auth (signInWithPassword) */
export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Saknar Supabase-inställningar. Lägg till NEXT_PUBLIC_SUPABASE_URL och SUPABASE_ANON_KEY (eller NEXT_PUBLIC_SUPABASE_ANON_KEY) i .env.local."
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
