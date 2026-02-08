"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarStats from "./SidebarStats";

export default function Sidebar() {
  const [email, setEmail] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamHandle, setTeamHandle] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    
    async function loadUserData() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      setEmail(user?.email ?? null);
      
      if (user) {
        // Get team info
        const { data: profile } = await supabase
          .from("profiles")
          .select("team_id, teams(name, handle)")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (profile?.teams) {
          const team = Array.isArray(profile.teams) ? profile.teams[0] : profile.teams;
          setTeamName(team?.name ?? null);
          setTeamHandle(team?.handle ?? null);
        }
      }
    }
    
    loadUserData();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
      if (session?.user) {
        loadUserData();
      } else {
        setTeamName(null);
        setTeamHandle(null);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isLoginPage = pathname === "/login";

  if (isLoginPage) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-black/80 backdrop-blur-2xl border-r border-zinc-800/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-8 border-b border-zinc-800/50">
        <Link href="/">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent hover:from-zinc-50 hover:to-zinc-300 transition-all duration-300">
            Vizio
          </h1>
        </Link>
        <p className="text-zinc-500 text-sm mt-2">Takım Ağı</p>
      </div>

      {/* Navigation */}
      <nav className="p-6 space-y-2">
        <Link
          href="/"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
            pathname === "/" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-base">Ana Sayfa</span>
        </Link>

        {email ? (
          <Link
            href="/teams"
            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              pathname === "/teams" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-base">Takımlar</span>
          </Link>
        ) : (
          <div className="relative" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <div className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 text-zinc-600 cursor-not-allowed opacity-50">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-base">Takımlar</span>
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            {showTooltip && (
              <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="bg-zinc-900 text-white text-sm px-4 py-2.5 rounded-xl border border-zinc-800 shadow-xl whitespace-nowrap">
                  Giriş yapmalısınız
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-zinc-900"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Stats */}
      <div className="flex-1 overflow-y-auto">
        <SidebarStats />
      </div>

      {/* User Section */}
      <div className="p-6 border-t border-zinc-800/50">
        {email ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{teamName ? teamName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                {teamName ? (
                  <>
                    <div className="text-white text-sm font-medium truncate">{teamName}</div>
                    <div className="text-zinc-500 text-xs truncate">@{teamHandle}</div>
                  </>
                ) : (
                  <>
                    <div className="text-white text-sm font-medium truncate">{email}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-zinc-500 text-xs">Çevrimiçi</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700 text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış Yap
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black rounded-xl hover:bg-zinc-100 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Giriş Yap
          </Link>
        )}
      </div>
    </aside>
  );
}
