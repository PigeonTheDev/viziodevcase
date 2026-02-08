import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getMyTeamIdOrNull() {
  const supabase = await createSupabaseServerClient();

  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("team_id").eq("user_id", user.id).maybeSingle();

  if (error) return null;
  return data?.team_id ?? null;
}
