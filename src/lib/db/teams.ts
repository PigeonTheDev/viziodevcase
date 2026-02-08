import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function listTeamsWithMyFollows(myTeamId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: teams, error: tErr } = await supabase.from("teams").select("id, name, handle, created_at").order("created_at", { ascending: false });

  if (tErr) throw tErr;

  const { data: follows, error: fErr } = await supabase.from("team_follows").select("followed_team_id").eq("follower_team_id", myTeamId);

  if (fErr) throw fErr;

  const myFollowedSet = new Set((follows ?? []).map((x) => x.followed_team_id));
  return { teams: teams ?? [], myFollowedSet };
}
