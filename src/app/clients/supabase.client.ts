import { createClient } from "@supabase/supabase-js";

export const supabaseCreateClient = () =>
  createClient(
    (process.env["NG_APP_SUPABASE_URL"] =
      "https://joncbucngelhmavuclxm.supabase.co"),
    (process.env["NG_APP_SUPABASE_ANON_KEY"] =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvbmNidWNuZ2VsaG1hdnVjbHhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ5MTU3NTMsImV4cCI6MTk2MDQ5MTc1M30.r-V8YGxQy5jdcGlrFOzwlBeBGp18cn8oKWrmF0UClDc")
  );
