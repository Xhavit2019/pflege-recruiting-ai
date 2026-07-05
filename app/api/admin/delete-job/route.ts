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
        { error: "Nur Administratoren dürfen Stellen löschen." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const jobId = formData.get("jobId")?.toString();

    if (!jobId) {
      return NextResponse.json(
        { error: "Job-ID fehlt." },
        { status: 400 }
      );
    }

    await prisma.application.deleteMany({
      where: {
        jobId,
      },
    });

    await prisma.job.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.redirect(
      new URL("/admin/jobs?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Stellenanzeige konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}