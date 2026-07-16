import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(req: Request) {
  const candidate = await requireCandidate();

  try {
    const formData = await req.formData();
    const file = formData.get("cv");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Keine PDF-Datei hochgeladen." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Es sind nur PDF-Dateien erlaubt." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Der Lebenslauf darf maximal 10 MB groß sein.",
        },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "cv"
    );

    await mkdir(uploadDirectory, { recursive: true });

    const fileName =
      `${candidate.userId}-${randomUUID()}.pdf`;

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    await writeFile(filePath, buffer);

    const cvUrl = `/uploads/cv/${fileName}`;

    await prisma.candidateProfile.update({
      where: {
        id: candidate.id,
      },
      data: {
        cvUrl,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/candidate/profile?uploaded=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Lebenslauf konnte nicht hochgeladen werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Der Lebenslauf konnte nicht hochgeladen werden.",
      },
      { status: 500 }
    );
  }
}