"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b border-zinc-800/50 bg-black/80 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link 
              href="/" 
              className="text-3xl font-bold bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent hover:from-zinc-50 hover:to-zinc-300 transition-all duration-300"
            >
              Vizio
            </Link>
            <nav className="flex gap-8">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === "/" 
                    ? "text-white" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Ana Sayfa
                {pathname === "/" && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-white to-zinc-400"></span>
                )}
              </Link>
              <Link 
                href="/teams" 
                className={`text-sm font-medium transition-all duration-200 relative group ${
                  pathname === "/teams" 
                    ? "text-white" 
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                Takımlar
                {pathname === "/teams" && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-white to-zinc-400"></span>
                )}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {email ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-zinc-400">{email}</span>
                </div>
                <button 
                  onClick={() => signOut()} 
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all duration-200 border border-zinc-800 hover:border-zinc-700 text-sm font-medium hover:shadow-lg hover:shadow-zinc-900/50"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-white text-black rounded-xl hover:bg-zinc-100 transition-all duration-200 font-semibold text-sm hover:shadow-lg hover:shadow-white/20"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
