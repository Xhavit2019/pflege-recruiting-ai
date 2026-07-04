import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LanguageService } from "@/services/language.service";
import { LanguageLevel } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Bewerberprofil nicht gefunden." },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    await LanguageService.createLanguage({
      candidateProfileId: profile.id,
      language: formData.get("language")?.toString() ?? "",
      level: formData.get("level") as LanguageLevel,
    });

    return NextResponse.redirect(
      new URL("/candidate/profile", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Sprache konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}