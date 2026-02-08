"use client";

import { Team } from "@/lib/models/TeamList";
import { useState } from "react";

export default function TeamsList({ myTeamId, teams, myFollowed }: { myTeamId: string; teams: Team[]; myFollowed: string[] }) {
  const [followed, setFollowed] = useState(() => new Set(myFollowed));
  const [busyId, setBusyId] = useState<string | null>(null);

  async function follow(targetTeamId: string) {
    setBusyId(targetTeamId);
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetTeamId }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setFollowed((prev) => new Set(prev).add(targetTeamId));
    } finally {
      setBusyId(null);
    }
  }

  async function unfollow(targetTeamId: string) {
    setBusyId(targetTeamId);
    try {
      const res = await fetch(`/api/follows?targetTeamId=${encodeURIComponent(targetTeamId)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setFollowed((prev) => {
        const next = new Set(prev);
        next.delete(targetTeamId);
        return next;
      });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      {teams.map((t) => {
        const isMe = t.id === myTeamId;
        const isFollowed = followed.has(t.id);

        return (
          <div
            key={t.id}
            className="bg-gradient-to-br from-zinc-900/40 to-zinc-900/20 border border-zinc-800/50 rounded-2xl p-6 flex items-center gap-5 hover:border-zinc-700/50 transition-all duration-300 backdrop-blur-sm group hover:shadow-xl hover:shadow-zinc-900/30"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 flex-shrink-0">
              <span className="text-2xl font-bold text-white">{t.name?.charAt(0) || "?"}</span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-white group-hover:text-zinc-100 transition-colors text-lg mb-1">
                {t.name}
                {isMe && (
                  <span className="ml-3 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-300 font-medium">
                    Senin Takımın
                  </span>
                )}
              </div>
              <div className="text-zinc-500 text-sm">@{t.handle}</div>
            </div>

            {!isMe && (
              <div className="flex-shrink-0">
                {isFollowed ? (
                  <button
                    disabled={busyId === t.id}
                    onClick={() => unfollow(t.id)}
                    className="px-6 py-2.5 bg-zinc-800 text-white rounded-xl hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold border border-zinc-700 flex items-center gap-2"
                  >
                    {busyId === t.id ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Takip Ediliyor
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    disabled={busyId === t.id}
                    onClick={() => follow(t.id)}
                    className="px-6 py-2.5 bg-white text-black rounded-xl hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm font-semibold hover:shadow-lg hover:shadow-white/20 flex items-center gap-2"
                  >
                    {busyId === t.id ? (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Takip Et
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
