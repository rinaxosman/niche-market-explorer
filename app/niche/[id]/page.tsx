import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

function scoreChecklist(n: {
  startupCostMin: number;
  difficulty: number;
  demandSignals: string;
  moat: string;
  riskFlags: string;
}) {
  let score = 0;

  if (n.startupCostMin <= 2000) score += 2;
  else if (n.startupCostMin <= 8000) score += 1;

  if (n.difficulty <= 2) score += 2;
  else if (n.difficulty === 3) score += 1;

  if (n.demandSignals.trim().length > 40) score += 2;
  if (n.moat.trim().length > 30) score += 2;

  const rf = n.riskFlags.toLowerCase();
  if (rf.includes("regulat")) score -= 1;
  if (rf.includes("season")) score -= 1;

  return Math.max(0, Math.min(10, score));
}

export default async function NichePage({
  params,
}: {
  params: { id: string };
}) {
  const niche = await prisma.niche.findUnique({ where: { id: params.id } });
  if (!niche) return notFound();

  const score = scoreChecklist(niche);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <a href="/" className="text-sm text-zinc-600 hover:underline">
        ← Back
      </a>

      <div className="mt-4 border rounded-lg p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{niche.name}</h1>
            <p className="text-zinc-600 mt-1">{niche.shortDesc}</p>
          </div>

          <div className="text-right">
            <div className="text-xs text-zinc-500">Validation score</div>
            <div className="text-2xl font-semibold">{score}/10</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
          <div>
            <div className="font-medium">Why it works</div>
            <p className="text-zinc-700 mt-1 whitespace-pre-wrap">
              {niche.whyItWorks}
            </p>
          </div>

          <div>
            <div className="font-medium">Target customers</div>
            <p className="text-zinc-700 mt-1 whitespace-pre-wrap">
              {niche.targetCustomers}
            </p>
          </div>

          <div>
            <div className="font-medium">Demand signals</div>
            <p className="text-zinc-700 mt-1 whitespace-pre-wrap">
              {niche.demandSignals}
            </p>
          </div>

          <div>
            <div className="font-medium">Moat / defensibility</div>
            <p className="text-zinc-700 mt-1 whitespace-pre-wrap">{niche.moat}</p>
          </div>
        </div>

        <div className="mt-6 text-sm">
          <div className="font-medium">Risks</div>
          <p className="text-zinc-700 mt-1 whitespace-pre-wrap">{niche.riskFlags}</p>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          Startup cost: ${niche.startupCostMin}–${niche.startupCostMax} • Difficulty:{" "}
          {niche.difficulty}/5
        </div>

        <div className="mt-6 text-sm">
          <div className="font-medium">Sources</div>
          <p className="text-zinc-700 mt-1 whitespace-pre-wrap">{niche.sources}</p>
        </div>
      </div>
    </main>
  );
}