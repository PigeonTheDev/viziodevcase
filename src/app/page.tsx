import Feed from "../components/Feed";
import NewPost from "../components/NewPost";
import { getGlobalFeed } from "@/lib/db/feed";
import { getMyTeamIdOrNull } from "@/lib/db/requireTeam";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const feed = await getGlobalFeed(20);

  const supabase = await createSupabaseServerClient();
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;

  const myTeamId = user ? await getMyTeamIdOrNull() : null;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">Keşfet</h1>
        <p className="text-zinc-500 text-lg">Takımlardan en son güncellemeler</p>
      </div>

      {myTeamId ? (
        <NewPost />
      ) : (
        <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Hoş Geldiniz</h3>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">Takımlarla bağlantı kurun, gönderiler paylaşın ve topluluğun bir parçası olun.</p>
          <a href="/login" className="inline-block px-6 py-3 bg-white text-black rounded-xl hover:bg-zinc-100 transition-all duration-200 font-semibold text-sm">
            Giriş Yapın ve Başlayın
          </a>
        </div>
      )}

      <Feed items={feed} />
    </div>
  );
}
