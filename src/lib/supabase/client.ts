import { createClient } from "@supabase/supabase-js";

/** Javni klient — samo za anonimni INSERT (RLS). */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Manjkata NEXT_PUBLIC_SUPABASE_URL ali NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createClient(url, key);
}
