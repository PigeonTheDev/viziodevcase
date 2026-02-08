"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SidebarStats() {
  const [stats, setStats] = useState({ posts: 0, teams: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createSupabaseBrowserClient();
        
        // Get total posts count
        const { count: postsCount } = await supabase
          .from("posts")
          .select("*", { count: "exact", head: true });
        
        // Get unique teams count
        const { data: teams } = await supabase
          .from("teams")
          .select("id");
        
        setStats({ 
          posts: postsCount || 0, 
          teams: teams?.length || 0 
        });
        setLoading(false);
      } catch (error) {
        console.error("Stats fetch error:", error);
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="px-6 py-4">
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 animate-pulse">
          <div className="h-4 bg-zinc-800 rounded w-20 mb-3"></div>
          <div className="h-8 bg-zinc-800 rounded w-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Platform
        </h3>
        <div className="space-y-4">
          <div>
            <div className="text-zinc-400 text-xs mb-1">Toplam Gönderi</div>
            <div className="text-2xl font-bold text-white">{stats.posts}</div>
          </div>
          <div className="h-px bg-zinc-800"></div>
          <div>
            <div className="text-zinc-400 text-xs mb-1">Aktif Takımlar</div>
            <div className="text-2xl font-bold text-white">{stats.teams}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
