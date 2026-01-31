"use client";

import { useState } from "react";

type GenItem = {
  name: string;
  category: string;
  shortDesc: string;
  whyItWorks: string;
  targetCustomers: string;
  startupCostMin: number;
  startupCostMax: number;
  difficulty: number;
  demandSignals: string;
  moat: string;
  riskFlags: string;
  sources: string;
};

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GenItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setItems([]);

    try {
      const res = await fetch("/api/generate-niches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to generate");

      setItems(data.items || []);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function saveAll() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/save-niches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");

      window.location.href = "/";
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <a href="/" className="text-sm text-zinc-600 hover:underline">
        ← Back
      </a>

      <h1 className="text-2xl font-semibold mt-4">Generate niche database</h1>
      <p className="text-zinc-600 mt-1">
        Paste Reddit posts, comments, article snippets, or links. We’ll extract niche business ideas into clean entries.
      </p>

      <div className="mt-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste sources here..."
          className="w-full min-h-[180px] border rounded-lg p-3 text-sm"
        />

        <div className="flex gap-3 mt-3">
          <button
            onClick={onGenerate}
            disabled={loading || text.trim().length < 30}
            className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {items.length > 0 && (
            <button
              onClick={saveAll}
              disabled={loading}
              className="px-4 py-2 rounded-md border text-sm"
            >
              Save to database
            </button>
          )}
        </div>

        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <h2 className="font-medium">Preview ({items.length})</h2>
          <div className="grid sm:grid-cols-2 gap-4 mt-3">
            {items.map((it, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{it.name}</div>
                  <span className="text-xs px-2 py-1 rounded-full bg-zinc-100">
                    {it.category}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 mt-2">{it.shortDesc}</p>
                <div className="text-xs text-zinc-500 mt-3">
                  ${it.startupCostMin}–${it.startupCostMax} • Difficulty {it.difficulty}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}