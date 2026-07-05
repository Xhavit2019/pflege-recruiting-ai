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
        { error: "Nur Administratoren dürfen Benutzer löschen." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const targetUserId = formData.get("userId")?.toString();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Benutzer-ID fehlt." },
        { status: 400 }
      );
    }

    if (targetUserId === currentUserId) {
      return NextResponse.json(
        { error: "Sie können sich nicht selbst löschen." },
        { status: 400 }
      );
    }

    const candidateProfile = await prisma.candidateProfile.findUnique({
      where: { userId: targetUserId },
    });

    if (candidateProfile) {
      await prisma.application.deleteMany({
        where: { candidateId: candidateProfile.id },
      });

      await prisma.candidateProfile.delete({
        where: { id: candidateProfile.id },
      });
    }

    const company = await prisma.company.findUnique({
      where: { userId: targetUserId },
    });

    if (company) {
      const jobs = await prisma.job.findMany({
        where: { companyId: company.id },
        select: { id: true },
      });

      await prisma.application.deleteMany({
        where: {
          jobId: {
            in: jobs.map((job) => job.id),
          },
        },
      });

      await prisma.job.deleteMany({
        where: { companyId: company.id },
      });

      await prisma.company.delete({
        where: { id: company.id },
      });
    }

    await prisma.account.deleteMany({
      where: { userId: targetUserId },
    });

    await prisma.session.deleteMany({
      where: { userId: targetUserId },
    });

    await prisma.user.delete({
      where: { id: targetUserId },
    });

    return NextResponse.redirect(
      new URL("/admin/users?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Benutzer konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}