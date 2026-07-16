import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

function normalizeSkill(skill: string) {
  return skill.trim().toLocaleLowerCase("de-DE");
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    if (
      currentUser.role !== Role.company &&
      currentUser.role !== Role.admin
    ) {
      return NextResponse.json(
        {
          error:
            "Nur Unternehmen und Administratoren dürfen das Matching ausführen.",
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

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      select: {
        id: true,
        candidate: {
          select: {
            skills: true,
          },
        },
        job: {
          select: {
            companyId: true,
            requiredSkills: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Bewerbung wurde nicht gefunden." },
        { status: 404 }
      );
    }

    if (currentUser.role === Role.company) {
      const company = await prisma.company.findUnique({
        where: {
          userId: currentUser.id,
        },
        select: {
          id: true,
        },
      });

      if (
        !company ||
        application.job.companyId !== company.id
      ) {
        return NextResponse.json(
          {
            error:
              "Kein Zugriff auf diese Bewerbung.",
          },
          { status: 403 }
        );
      }
    }

    const candidateSkills =
      application.candidate.skills ?? [];

    const jobSkills =
      application.job.requiredSkills ?? [];

    const normalizedJobSkills = new Set(
      jobSkills.map(normalizeSkill)
    );

    const matchingSkills = Array.from(
      new Set(
        candidateSkills.filter((skill) =>
          normalizedJobSkills.has(
            normalizeSkill(skill)
          )
        )
      )
    );

    const score =
      jobSkills.length > 0
        ? Math.round(
            (matchingSkills.length /
              jobSkills.length) *
              100
          )
        : 50;

    const summary =
      jobSkills.length === 0
        ? "Demo-Matching: Für diese Stelle wurden noch keine erforderlichen Skills hinterlegt."
        : `Demo-Matching: ${matchingSkills.length} von ${jobSkills.length} geforderten Skills stimmen überein. Erkannte Übereinstimmungen: ${
            matchingSkills.join(", ") ||
            "keine direkten Skill-Treffer"
          }.`;

    await prisma.application.update({
      where: {
        id: application.id,
      },
      data: {
        matchScore: score,
        aiSummary: summary,
      },
    });

    const redirectPath =
      currentUser.role === Role.admin
        ? "/admin/applications?matched=1"
        : "/company/applications?matched=1";

    return NextResponse.redirect(
      new URL(redirectPath, req.url),
      303
    );
  } catch (error) {
    console.error(
      "Matching konnte nicht berechnet werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Das Matching konnte nicht berechnet werden.",
      },
      { status: 500 }
    );
  }
}