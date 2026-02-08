"use client";

import { useState } from "react";

export default function NewPost() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
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
      window.location.reload();
    } catch (e) {
      if (e instanceof Error) {
        setMsg(e.message ?? "Hata");
      } else {
        setMsg("Hata");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
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
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Gönderiliyor...
              </span>
            ) : (
              "Gönder"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
