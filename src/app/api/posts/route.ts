import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getMyTeamIdOrNull } from "@/lib/db/requireTeam";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();
  const myTeamId = await getMyTeamIdOrNull();

  if (!myTeamId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const content = (body?.content ?? "").toString().trim();

  // Content validation
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });
  if (content.length > 500) return NextResponse.json({ error: "Content too long (max 500 characters)" }, { status: 400 });

  const { data, error } = await supabase.from("posts").insert({ team_id: myTeamId, content }).select("id, created_at").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true, post: data }, { status: 200 });
}
