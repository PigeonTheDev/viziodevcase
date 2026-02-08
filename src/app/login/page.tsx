"use client";

import { useState } from "react";
import { signInWithGoogle, signInWithPassword } from "@/lib/auth";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loginGoogle() {
    setMsg(null);
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setMsg(error.message);
      setLoading(false);
    }
  }

  async function loginPassword() {
    setMsg(null);
    if (!email.trim() || !password) {
      setMsg("Lütfen tüm alanları doldurun");
      return;
    }
    setLoading(true);
    const { error } = await signInWithPassword(email.trim(), password);
    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }
    window.location.href = "/";
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center px-4">
      <div className="w-full max-w-md -mt-16 sm:-mt-20">
        <div className="w-full">
          {/* Logo/Brand Area */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">Vizio</h1>
            </Link>
            <p className="text-zinc-500 text-sm">Takımınızla bağlantıda kalın</p>
          </div>

          {/* Main Card */}
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-zinc-600 to-zinc-800 rounded-2xl blur opacity-20"></div>

            {/* Card Content */}
            <div className="relative bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
              <div className="mb-7 sm:mb-9">
                <h2 className="text-2xl font-bold text-white mb-2">Hoş geldiniz</h2>
                <p className="text-zinc-400 text-sm">Devam etmek için giriş yapın</p>
              </div>

              {/* Google Button */}
              <button
                onClick={loginGoogle}
                disabled={loading}
                className="w-full bg-white text-black py-3.5 px-4 rounded-xl font-semibold hover:bg-zinc-100 active:scale-[0.98] transition-all duration-200 mb-7 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {loading ? "Yükleniyor..." : "Google ile devam et"}
              </button>

              {/* Divider */}
              <div className="relative mb-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-zinc-900/90 text-zinc-500 uppercase tracking-wider">veya email ile</span>
                </div>
              </div>

              {/* Email Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loginPassword();
                }}
                className="space-y-4 sm:space-y-5"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      placeholder="ornek@email.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
                    Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !password}
                  className="w-full mt-1 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white py-3.5 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-zinc-700"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Giriş yapılıyor...
                    </span>
                  ) : (
                    "Giriş Yap"
                  )}
                </button>
              </form>

              {/* Error Message */}
              {msg ? (
                <div className="mt-5 bg-red-950/30 border border-red-900/50 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-400 text-sm flex-1">{msg}</p>
                </div>
              ) : null}

              {/* Info Box */}
              <div className="mt-7 bg-zinc-800/30 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-xs text-zinc-400 leading-relaxed">
                    <p className="font-medium text-zinc-300 mb-1">Bilgi</p>
                    <p>Kayıtlı kullanıcılar gönderi paylaşabilir ve takip edebilir. Misafirler sadece ana akışı görüntüleyebilir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
