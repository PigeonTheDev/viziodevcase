"use client";

import { useState } from "react";

export default function NewPost() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setMsg(null);
    const text = content.trim();
    if (!text) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Failed");

      setContent("");
      setReloading(true); // Show reload overlay
      window.location.reload();
    } catch (e) {
      if (e instanceof Error) {
        setMsg(e.message ?? "Hata");
      } else {
        setMsg("Hata");
      }
      setLoading(false);
    }
  }

  return (
    <>
      {/* Reload Overlay */}
      {reloading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-zinc-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
            </div>
            <p className="text-white font-medium">Gönderi paylaşılıyor...</p>
            <p className="text-zinc-500 text-sm">Feed yenileniyor</p>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/30 border border-zinc-800/50 rounded-2xl p-7 mb-8 backdrop-blur-sm shadow-xl">
        <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        <h3 className="font-bold text-xl text-white">Yeni Gönderi Oluştur</h3>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        maxLength={500}
        className="w-full bg-black/40 border border-zinc-800/50 rounded-xl p-5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700/50 focus:border-zinc-700 transition-all duration-200 resize-none text-[15px] leading-relaxed"
        placeholder="Ne düşünüyorsun? Takımınla paylaş..."
      />

      <div className="flex gap-3 mt-5 items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <span className="text-xs text-zinc-600">{content.length}/500</span>
        </div>

        <div className="flex gap-3 items-center">
          {msg && <span className="text-red-400 text-sm">{msg}</span>}
          <button
            onClick={submit}
            disabled={loading || !content.trim()}
            className="px-7 py-3 bg-white text-black rounded-xl font-semibold hover:bg-zinc-100 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-white/20 disabled:hover:shadow-none"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border-2 border-zinc-600 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-transparent border-t-black rounded-full animate-spin"></div>
                </div>
                Gönderiliyor...
              </span>
            ) : (
              "Gönder"
            )}
          </button>
        </div>
      </div>
      </div>
    </>
  );
}
