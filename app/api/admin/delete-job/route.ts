import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json(
        {
          error:
            "Nur Administratoren dürfen Stellenanzeigen löschen.",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const jobId = formData
      .get("jobId")
      ?.toString()
      .trim();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job-ID fehlt." },
        { status: 400 }
      );
    }

    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
      select: {
        id: true,
      },
    });

    if (!job) {
      return NextResponse.json(
        {
          error:
            "Die Stellenanzeige wurde nicht gefunden.",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.application.deleteMany({
        where: {
          jobId,
        },
      });

      await tx.job.delete({
        where: {
          id: jobId,
        },
      });
    });

    return NextResponse.redirect(
      new URL("/admin/jobs?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Stellenanzeige konnte nicht gelöscht werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Stellenanzeige konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}