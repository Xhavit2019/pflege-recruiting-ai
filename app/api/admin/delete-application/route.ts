import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const currentUserId = cookieStore.get("userId")?.value;
    const currentRole = cookieStore.get("role")?.value;

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    if (currentRole !== "admin") {
      return NextResponse.json(
        { error: "Nur Administratoren dürfen Bewerbungen löschen." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const applicationId = formData.get("applicationId")?.toString();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Bewerbungs-ID fehlt." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Bewerbung nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.application.delete({
      where: {
        id: applicationId,
      },
    });

    return NextResponse.redirect(
      new URL("/admin/applications?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Bewerbung konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}