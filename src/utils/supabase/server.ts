import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "./env";

// Supabase client for server-side code: pages, layouts, route handlers.
// Async because Next 16 made cookies() async, so callers need to await it.
export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabaseEnv();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Pages can read cookies but not write them, so this throws when the
          // client tries to save a refreshed login. Harmless while the app is
          // read-only; revisit if we ever add accounts.
        }
      },
    },
  });
}
