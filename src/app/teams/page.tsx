import TeamsList from "../../components/TeamsList";
import { getMyTeamIdOrNull } from "@/lib/db/requireTeam";
import { listTeamsWithMyFollows } from "@/lib/db/teams";
import { Suspense } from "react";
import Loading from "../../components/Loading";

export default async function TeamsPage() {
  const myTeamId = await getMyTeamIdOrNull();
  // middleware sayesinde burada null beklemiyoruz ama guard yine de güvenli
  if (!myTeamId) return null;

  const { teams, myFollowedSet } = await listTeamsWithMyFollows(myTeamId);

  return (
    <Suspense fallback={<Loading />}>
      <div>
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent mb-3">Takımlar</h1>
          <p className="text-zinc-500 text-lg">Diğer takımları keşfet ve bağlantı kur</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-zinc-500 text-sm mb-1">Toplam Takım</div>
            <div className="text-3xl font-bold text-white">{teams.length}</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-zinc-500 text-sm mb-1">Takip Edilen</div>
            <div className="text-3xl font-bold text-white">{myFollowedSet.size}</div>
          </div>
          <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="text-zinc-500 text-sm mb-1">Keşfedilebilir</div>
            <div className="text-3xl font-bold text-white">{teams.length - myFollowedSet.size - 1}</div>
          </div>
        </div>

        <TeamsList myTeamId={myTeamId} teams={teams} myFollowed={Array.from(myFollowedSet)} />
      </div>
    </Suspense>
  );
}
