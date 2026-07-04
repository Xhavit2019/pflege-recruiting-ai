import { NextResponse } from "next/server";
import { LanguageService } from "@/services/language.service";
import { LanguageLevel } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    await LanguageService.updateLanguage(id, {
      language: formData.get("language")?.toString() ?? "",
      level: (formData.get("level")?.toString() || "A1") as LanguageLevel,
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await LanguageService.deleteLanguage(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Sprache konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}