import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMyTeamIdOrNull } from "@/lib/db/requireTeam";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const myTeamId = await getMyTeamIdOrNull();
  if (!myTeamId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const targetTeamId = (body?.targetTeamId ?? "").toString();
  if (!targetTeamId) return NextResponse.json({ error: "targetTeamId required" }, { status: 400 });

  // A team cannot follow itself
  if (targetTeamId === myTeamId) {
    return NextResponse.json({ error: "A team cannot follow itself" }, { status: 400 });
  }

  const { error } = await supabase.from("team_follows").insert({
    follower_team_id: myTeamId,
    followed_team_id: targetTeamId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient();
  const myTeamId = await getMyTeamIdOrNull();
  if (!myTeamId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const targetTeamId = searchParams.get("targetTeamId");
  if (!targetTeamId) return NextResponse.json({ error: "targetTeamId required" }, { status: 400 });

  const { error } = await supabase.from("team_follows").delete().eq("follower_team_id", myTeamId).eq("followed_team_id", targetTeamId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 200 });
}
