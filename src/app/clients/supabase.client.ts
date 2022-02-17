import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () =>
  createClient(
    process.env["NG_APP_SUPABASE_URL"],
    process.env["NG_APP_SUPABASE_ANON_KEY"]
  );
