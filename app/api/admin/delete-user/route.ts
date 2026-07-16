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
            "Nur Administratoren dürfen Benutzer löschen.",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const targetUserId = formData
      .get("userId")
      ?.toString()
      .trim();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Benutzer-ID fehlt." },
        { status: 400 }
      );
    }

    if (targetUserId === currentUser.id) {
      return NextResponse.json(
        {
          error:
            "Sie können Ihr eigenes Administratorkonto nicht löschen.",
        },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Benutzer wurde nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const candidateProfile =
        await tx.candidateProfile.findUnique({
          where: {
            userId: targetUserId,
          },
          select: {
            id: true,
          },
        });

      if (candidateProfile) {
        await tx.application.deleteMany({
          where: {
            candidateId: candidateProfile.id,
          },
        });

        await tx.candidateProfile.delete({
          where: {
            id: candidateProfile.id,
          },
        });
      }

      const company = await tx.company.findUnique({
        where: {
          userId: targetUserId,
        },
        select: {
          id: true,
        },
      });

      if (company) {
        const jobs = await tx.job.findMany({
          where: {
            companyId: company.id,
          },
          select: {
            id: true,
          },
        });

        const jobIds = jobs.map((job) => job.id);

        if (jobIds.length > 0) {
          await tx.application.deleteMany({
            where: {
              jobId: {
                in: jobIds,
              },
            },
          });
        }

        await tx.job.deleteMany({
          where: {
            companyId: company.id,
          },
        });

        await tx.company.delete({
          where: {
            id: company.id,
          },
        });
      }

      await tx.account.deleteMany({
        where: {
          userId: targetUserId,
        },
      });

      await tx.session.deleteMany({
        where: {
          userId: targetUserId,
        },
      });

      await tx.passwordResetToken.deleteMany({
        where: {
          userId: targetUserId,
        },
      });

      await tx.user.delete({
        where: {
          id: targetUserId,
        },
      });
    });

    return NextResponse.redirect(
      new URL("/admin/users?deleted=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Benutzer konnte nicht gelöscht werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Benutzer konnte nicht gelöscht werden.",
      },
      { status: 500 }
    );
  }
}