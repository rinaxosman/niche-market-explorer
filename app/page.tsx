import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const niches = await prisma.niche.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-5xl mx-auto p-6">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Niche Market Explorer</h1>
          <p className="text-zinc-600 mt-1">
            Local niche businesses summarized into actionable research.
          </p>
        </div>

        <Link
          href="/generate"
          className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm"
        >
          Generate from sources
        </Link>
      </header>

      {niches.length === 0 ? (
        <div className="mt-10 border rounded-lg p-6 text-zinc-600">
          No niches yet. Click <b>Generate from sources</b> to create your starter database.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {niches.map((n) => (
            <Link
              key={n.id}
              href={`/niche/${n.id}`}
              className="border rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-medium">{n.name}</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-100">
                  {n.category}
                </span>
              </div>

              <p className="text-sm text-zinc-600 mt-2">{n.shortDesc}</p>

              <div className="text-xs text-zinc-500 mt-3">
                Startup: ${n.startupCostMin}–${n.startupCostMax} • Difficulty: {n.difficulty}/5
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
