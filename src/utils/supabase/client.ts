import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./env";

// Supabase client for code that runs in the browser. The sales table is loaded
// on the server, so nothing imports this yet -- it's here for whenever a page
// needs to fetch or update data after it has loaded.
export function createClient() {
  const { url, key } = getSupabaseEnv();

  return createBrowserClient(url, key);
}
