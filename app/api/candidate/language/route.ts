import { LanguageLevel } from "@prisma/client";
import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { LanguageService } from "@/services/language.service";

export async function POST(req: Request) {
  const candidate = await requireCandidate();

  try {
    const formData = await req.formData();

    const language = formData
      .get("language")
      ?.toString()
      .trim();

    const levelValue = formData
      .get("level")
      ?.toString()
      .trim();

    const validLevel =
      levelValue &&
      Object.values(LanguageLevel).includes(
        levelValue as LanguageLevel
      );

    if (!language || !validLevel) {
      return NextResponse.json(
        {
          error:
            "Sprache und ein gültiges Sprachniveau sind erforderlich.",
        },
        { status: 400 }
      );
    }

    await LanguageService.createLanguage({
      candidateProfileId: candidate.id,
      language,
      level: levelValue as LanguageLevel,
    });

    return NextResponse.redirect(
      new URL(
        "/candidate/profile?languageSaved=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Sprache konnte nicht gespeichert werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Sprache konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}