import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("cv") as File;

    if (!file) {
      return NextResponse.json({ error: "Keine Datei hochgeladen" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public", "uploads", fileName);

    await writeFile(uploadPath, buffer);

    const user = await prisma.user.findFirst({
      where: { role: "candidate" },
    });

    if (!user) {
      return NextResponse.json({ error: "Kein Bewerber gefunden" }, { status: 400 });
    }

    await prisma.candidateProfile.upsert({
      where: { userId: user.id },
      update: {
        cvUrl: `/uploads/${fileName}`,
      },
      create: {
        userId: user.id,
        cvUrl: `/uploads/${fileName}`,
        skills: [],
      },
    });

    return NextResponse.redirect(new URL("/candidate/profile?uploaded=1", req.url), 303);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload fehlgeschlagen" }, { status: 500 });
  }
}