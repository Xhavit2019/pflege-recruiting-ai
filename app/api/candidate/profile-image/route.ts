import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedFileTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  const candidate = await requireCandidate();

  try {
    const formData = await req.formData();
    const file = formData.get("profileImage");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Keine Bilddatei hochgeladen." },
        { status: 400 }
      );
    }

    const extension = allowedFileTypes[file.type];

    if (!extension) {
      return NextResponse.json(
        {
          error:
            "Erlaubt sind nur JPG-, PNG- und WebP-Bilder.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Das Profilbild darf maximal 5 MB groß sein.",
        },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "profile"
    );

    await mkdir(uploadDir, { recursive: true });

    const safeFileName =
      `${candidate.userId}-${randomUUID()}.${extension}`;

    const filePath = path.join(uploadDir, safeFileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(filePath, buffer);

    const profileImageUrl =
      `/uploads/profile/${safeFileName}`;

    await prisma.candidateProfile.update({
      where: {
        id: candidate.id,
      },
      data: {
        profileImageUrl,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/candidate/profile?profileImageSaved=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Profilbild konnte nicht hochgeladen werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Das Profilbild konnte nicht hochgeladen werden.",
      },
      { status: 500 }
    );
  }
}