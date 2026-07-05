import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    if (role !== "company" && role !== "admin") {
      return NextResponse.json(
        { error: "Keine Berechtigung." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const applicationId = formData.get("applicationId")?.toString();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Bewerbung fehlt." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        candidate: true,
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Bewerbung nicht gefunden." },
        { status: 404 }
      );
    }

    if (role === "company") {
      const company = await prisma.company.findUnique({
        where: {
          userId,
        },
      });

      if (!company || application.job.companyId !== company.id) {
        return NextResponse.json(
          { error: "Kein Zugriff auf diese Bewerbung." },
          { status: 403 }
        );
      }
    }

    const candidateSkills = application.candidate.skills || [];
    const jobSkills = application.job.requiredSkills || [];

    const matchingSkills = candidateSkills.filter((skill) =>
      jobSkills.some(
        (jobSkill) => jobSkill.toLowerCase() === skill.toLowerCase()
      )
    );

    const score =
      jobSkills.length > 0
        ? Math.round((matchingSkills.length / jobSkills.length) * 100)
        : 50;

    const summary = `Demo-Matching: ${matchingSkills.length} von ${jobSkills.length} geforderten Skills passen. Erkannte Übereinstimmungen: ${
      matchingSkills.join(", ") || "keine direkten Skill-Treffer"
    }.`;

    await prisma.application.update({
      where: { id: application.id },
      data: {
        matchScore: score,
        aiSummary: summary,
      },
    });

    return NextResponse.redirect(
      new URL("/company/applications?matched=1", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Matching konnte nicht berechnet werden." },
      { status: 500 }
    );
  }
}