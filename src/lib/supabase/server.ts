import { createClient } from "@supabase/supabase-js";

/** Strežniški klient — service role, samo v API / dashboard (obide RLS za branje). */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Manjkata NEXT_PUBLIC_SUPABASE_URL ali SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
