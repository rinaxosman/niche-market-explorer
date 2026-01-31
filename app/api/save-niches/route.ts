import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ItemSchema = z.object({
  name: z.string(),
  category: z.string(),
  shortDesc: z.string(),
  whyItWorks: z.string(),
  targetCustomers: z.string(),
  startupCostMin: z.number().int().nonnegative(),
  startupCostMax: z.number().int().nonnegative(),
  difficulty: z.number().int().min(1).max(5),
  demandSignals: z.string(),
  moat: z.string(),
  riskFlags: z.string(),
  sources: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = z.array(ItemSchema).parse(body.items);

    await prisma.niche.createMany({
      data: items.map((it) => ({
        ...it,
        startupCostMin: Math.min(it.startupCostMin, it.startupCostMax),
        startupCostMax: Math.max(it.startupCostMin, it.startupCostMax),
      })),
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 400 }
    );
  }
}