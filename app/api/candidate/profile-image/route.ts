import { cookies } from "next/headers";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("profileImage") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile");
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = `${userId}-${Date.now()}-${file.name.replaceAll(" ", "-")}`;
    const filePath = path.join(uploadDir, safeFileName);

    await writeFile(filePath, buffer);

    const profileImageUrl = `/uploads/profile/${safeFileName}`;

    await prisma.candidateProfile.update({
      where: { userId },
      data: { profileImageUrl },
    });

    return NextResponse.redirect(new URL("/candidate/profile", req.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Profilbild konnte nicht hochgeladen werden." },
      { status: 500 }
    );
  }
}