import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export async function signInWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const origin = window.location.origin;

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/api/auth/callback` },
  });
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();
  await supabase.auth.signOut();
  window.location.href = "/";
}
