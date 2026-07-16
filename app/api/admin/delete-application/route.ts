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
            "Nur Administratoren dürfen Bewerbungen löschen.",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const applicationId = formData
      .get("applicationId")
      ?.toString()
      .trim();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Bewerbungs-ID fehlt." },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.application.deleteMany({
      where: {
        id: applicationId,
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Bewerbung wurde nicht gefunden." },
        { status: 404 }
      );
    }

    return NextResponse.redirect(
      new URL("/admin/applications?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Bewerbung konnte nicht gelöscht werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Bewerbung konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}