// Supabase has renamed the public API key a couple of times, so the name in your
// .env.local depends on when the project was created. Check all three.
//
// These have to be spelled out in full rather than looked up in a loop: Next.js
// finds NEXT_PUBLIC_* by scanning the source and substituting the value at build
// time, so anything it can't see literally comes back undefined in the browser.
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  return { url, key };
}
