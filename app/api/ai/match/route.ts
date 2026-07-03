import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();
  const applicationId = formData.get("applicationId") as string;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      candidate: true,
      job: true,
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "Bewerbung nicht gefunden." },
      { status: 404 }
    );
  }

  const candidateSkills = application.candidate.skills || [];
  const jobSkills = application.job.requiredSkills || [];

  const matchingSkills = candidateSkills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        jobSkill.toLowerCase() === skill.toLowerCase()
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
}