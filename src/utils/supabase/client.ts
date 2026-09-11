import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./env";

// For use from Client Components. The page is server-rendered today, so nothing
// imports this yet -- it is here for when the app needs browser-side queries.
export function createClient() {
  const { url, key } = getSupabaseEnv();

  return createBrowserClient(url, key);
}
