import { Post } from "@/lib/models/Post";

export default function Feed({ items }: { items: Post[] }) {
  return (
    <div className="space-y-6">
      {items.map((p) => (
        <article
          key={p.id}
          className="bg-gradient-to-br mt-4 from-zinc-900/40 to-zinc-900/20 border border-zinc-800/50 rounded-2xl p-7 hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-sm group hover:shadow-xl hover:shadow-zinc-900/30 hover:translate-y-[-2px]"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
                <span className="text-lg font-bold text-white">{p.team?.name?.charAt(0) || "?"}</span>
              </div>
              <div>
                <div className="font-bold text-white group-hover:text-zinc-100 transition-colors flex items-center gap-2">
                  {p.team?.name}
                  <span className="text-zinc-600 font-normal text-sm">•</span>
                  <span className="text-zinc-500 font-normal text-sm">@{p.team?.handle}</span>
                </div>
                <time className="text-xs text-zinc-600 mt-0.5 block">
                  {new Date(p.created_at).toLocaleString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
            </div>
          </div>
          <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-[15px]">{p.content}</p>
        </article>
      ))}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-4">
            <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-zinc-500 text-lg font-medium">Henüz gönderi yok</p>
          <p className="text-zinc-600 text-sm mt-2">İlk gönderen siz olun!</p>
        </div>
      ) : null}
    </div>
  );
}
