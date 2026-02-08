import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Post } from "@/lib/models/Post";

export async function getGlobalFeed(limit = 20): Promise<Post[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at,
      team:teams (
        id,
        name,
        handle
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const posts: Post[] = (data ?? []).map((item) => ({
    id: item.id,
    content: item.content,
    created_at: item.created_at,
    team: Array.isArray(item.team) ? item.team[0] : item.team,
  }));

  return posts;
}
