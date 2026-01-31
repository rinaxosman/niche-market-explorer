import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

const BodySchema = z.object({
  input: z.string().min(30),
});

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
    const body = BodySchema.parse(await req.json());

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
Extract 10 to 25 real-world niche local business ideas from the user text.
Return ONLY valid JSON: { "items": [ ... ] }

Rules:
- category must be one of: services, food, retail, b2b, health, pets, events, home, automotive, education, other
- startupCostMin/startupCostMax are integers (USD)
- difficulty is 1-5
- sources: include any links found, otherwise say "user provided text"

User text:
${body.input}
`.trim();

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("AI did not return JSON");
      parsed = JSON.parse(raw.slice(start, end + 1));
    }

    const items = z.array(ItemSchema).parse(parsed.items);
    return NextResponse.json({ items });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 400 }
    );
  }
}