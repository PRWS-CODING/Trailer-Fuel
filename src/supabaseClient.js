import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * We use a fallback empty string for the key but handle the URL requirement
 * to prevent the library from throwing an uncaught exception if the .env is missing.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabase) {
  if (!supabaseUrl)
    console.error("Environment Check: VITE_SUPABASE_URL is missing.");
    console.error("Supabase Error: VITE_SUPABASE_URL is missing in Project Settings.");
  if (!supabaseAnonKey)
    console.error("Environment Check: VITE_SUPABASE_ANON_KEY is missing.");
    console.error("Supabase Error: VITE_SUPABASE_ANON_KEY is missing in Project Settings.");
  console.warn(
    "Database features are disabled until .env is configured and server is restarted.",
    "Database features are disabled. Add variables to Vercel Settings > Environment Variables and Redeploy.",
  );
}
