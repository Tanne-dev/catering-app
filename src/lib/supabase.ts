import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/** Server-side Supabase client for admin auth (signInWithPassword) */
export function createSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
