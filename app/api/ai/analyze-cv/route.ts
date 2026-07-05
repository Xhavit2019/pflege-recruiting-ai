import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const profile = await prisma.candidateProfile.findFirst();

  if (!profile || !profile.cvUrl) {
    return NextResponse.json(
      { error: "Kein Lebenslauf gefunden." },
      { status: 400 }
    );
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Analysiere diesen Bewerber für eine Pflege-Recruiting-Plattform.

Aktuelle Profil-Daten:
Beruf: ${profile.profession || "-"}
Stadt: ${profile.city || "-"}
Erfahrung: ${profile.yearsOfExperience || 0} Jahre
Skills: ${profile.skills.join(", ") || "-"}

Gib eine kurze professionelle Zusammenfassung und 5 relevante Skills zurück.
`,
    });

    const text = response.output_text || "";

    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        summary: text,
        skills: [
          "Pflege",
          "Patientenbetreuung",
          "Kommunikation",
          "Teamarbeit",
          "Dokumentation",
        ],
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?analyzed=1", req.url),
      303
    );
  } catch (error) {
    console.error("OpenAI Fehler, Demo-Auswertung wird verwendet:", error);

    await prisma.candidateProfile.update({
      where: { id: profile.id },
      data: {
        summary:
          "Demo-Auswertung (muss AI KEY bezahlen damit funktioniert): Erfahrung in Pflege, Patientenbetreuung, Kommunikation, Teamarbeit und Dokumentation erkannt. Diese Demo wird angezeigt, weil OpenAI-Billing oder API-Guthaben aktuell nicht verfügbar ist.",
        skills: [
          "Pflege",
          "Patientenbetreuung",
          "Kommunikation",
          "Teamarbeit",
          "Dokumentation",
        ],
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?demoAi=1", req.url),
      303
    );
  }
}