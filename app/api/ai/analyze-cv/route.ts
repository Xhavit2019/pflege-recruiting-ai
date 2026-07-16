import { NextResponse } from "next/server";
import OpenAI from "openai";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { prisma } from "@/lib/prisma";

const demoSkills = [
  "Pflege",
  "Patientenbetreuung",
  "Kommunikation",
  "Teamarbeit",
  "Dokumentation",
];

export async function POST(req: Request) {
  const candidate = await requireCandidate();

  if (!candidate.cvUrl) {
    return NextResponse.json(
      { error: "Kein Lebenslauf gefunden." },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      await prisma.candidateProfile.update({
        where: {
          id: candidate.id,
        },
        data: {
          summary:
            "Demo-Auswertung: Erfahrung in Pflege, Patientenbetreuung, Kommunikation, Teamarbeit und Dokumentation erkannt. Die echte KI-Analyse wird aktiviert, sobald der OpenAI-Zugang vollständig eingerichtet ist.",
          skills: demoSkills,
        },
      });

      return NextResponse.redirect(
        new URL("/candidate/profile?demoAi=1", req.url),
        303
      );
    }

    const openai = new OpenAI({
      apiKey,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Analysiere das Profil dieses Bewerbers für eine Pflege-Recruiting-Plattform.

Beruf: ${candidate.profession || "-"}
Stadt: ${candidate.city || "-"}
Erfahrung: ${candidate.yearsOfExperience || 0} Jahre
Vorhandene Skills: ${candidate.skills.join(", ") || "-"}

Erstelle eine kurze professionelle Zusammenfassung und nenne fünf relevante Kompetenzen.
`,
    });

    const summary = response.output_text?.trim();

    await prisma.candidateProfile.update({
      where: {
        id: candidate.id,
      },
      data: {
        summary:
          summary ||
          "Die KI konnte keine Zusammenfassung erstellen.",
        skills: demoSkills,
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?analyzed=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "OpenAI-Analyse fehlgeschlagen, Demo-Auswertung wird verwendet:",
      error
    );

    await prisma.candidateProfile.update({
      where: {
        id: candidate.id,
      },
      data: {
        summary:
          "Demo-Auswertung: Erfahrung in Pflege, Patientenbetreuung, Kommunikation, Teamarbeit und Dokumentation erkannt. Die echte KI-Analyse war momentan nicht verfügbar.",
        skills: demoSkills,
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?demoAi=1", req.url),
      303
    );
  }
}