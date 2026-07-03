import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
export async function POST(req: Request) {
  const { cvText } = await req.json();
  const completion = await openai.chat.completions.create({ model: "gpt-4o-mini", messages: [{ role: "system", content: "Extrahiere Skills, Erfahrung und eine kurze Zusammenfassung für Pflege-Recruiting." }, { role: "user", content: cvText }] });
  return NextResponse.json({ summary: completion.choices[0].message.content });
}
