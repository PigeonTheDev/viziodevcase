import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

type Args = {
  email: string;
  password: string;
  teamName: string;
  teamHandle: string;
  makePost?: boolean;
};

function parseArgs(): Args {
  const email = process.argv[2];
  const password = process.argv[3];
  const teamName = process.argv[4];
  const teamHandle = process.argv[5];
  const makePost = process.argv.includes("--post");

  if (!email || !password || !teamName || !teamHandle) {
    throw new Error("Usage: ts-node scripts/provision.ts <email> <password> <teamName> <teamHandle> [--post]");
  }

  return { email, password, teamName, teamHandle, makePost };
}

async function main() {
  const { email, password, teamName, teamHandle, makePost } = parseArgs();

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  }

  // service role: bypass RLS (needed for provisioning)
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1) Create user (or fetch existing by email)
  // listUsers pagination is annoying; we do: list first pages with a cap.
  let existingUser: { id: string; email?: string | null } | null = null;
  {
    for (let page = 1; page <= 10; page++) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;

      const found = data.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
      if (found) {
        existingUser = { id: found.id, email: found.email };
        break;
      }
      if (data.users.length < 200) break;
    }
  }

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    console.log("Auth user already exists:", { email, userId });
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // user giriş yapabilsin
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Auth user created:", { email, userId });
  }

  // 2) Check if user already has a team (1 user = 1 team rule)
  const { data: existingProfile } = await supabase.from("profiles").select("team_id, teams(name, handle)").eq("user_id", userId).maybeSingle();

  if (existingProfile?.team_id) {
    const existingTeam = Array.isArray(existingProfile.teams) ? existingProfile.teams[0] : existingProfile.teams;
    throw new Error(
      `User ${email} already belongs to team "${existingTeam?.name}" (@${existingTeam?.handle}). ` +
        `A user can only belong to one team. Use a different email or remove the existing profile mapping.`
    );
  }

  // 3) Upsert team by handle
  const { data: team, error: tErr } = await supabase.from("teams").upsert({ name: teamName, handle: teamHandle }, { onConflict: "handle" }).select("id, name, handle").single();

  if (tErr) throw tErr;

  console.log("Team ready:", team);

  // 4) Insert profile mapping (1 user = 1 team - no upsert, fail if exists)
  const { error: pErr } = await supabase.from("profiles").insert({ user_id: userId, team_id: team.id });

  if (pErr) throw pErr;

  console.log("Profile linked:", { userId, teamId: team.id });

  // 5) Optional post
  if (makePost) {
    const { error: postErr } = await supabase.from("posts").insert({
      team_id: team.id,
      content: `Hello from ${team.name}`,
    });
    if (postErr) throw postErr;

    console.log("Demo post inserted");
  }

  console.log("DONE ✅");
}

main().catch((e) => {
  console.error("FAILED ❌", e);
  process.exit(1);
});
