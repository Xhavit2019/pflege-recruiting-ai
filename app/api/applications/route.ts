import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const jobId = formData.get("jobId") as string;

  let candidate = await prisma.candidateProfile.findFirst({
    include: { user: true },
  });

  if (!candidate) {
    const user = await prisma.user.findFirst({
      where: { role: "candidate" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Bitte zuerst als Bewerber registrieren." },
        { status: 400 }
      );
    }

    candidate = await prisma.candidateProfile.create({
      data: {
        userId: user.id,
        profession: "Pflegekraft",
        skills: [],
      },
      include: { user: true },
    });
  }

  const application = await prisma.application.create({
    data: {
      jobId,
      candidateId: candidate.id,
      status: "pending",
    },
    include: {
      job: {
        include: {
          company: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const companyEmail = application.job.company.user.email;

  await sendEmail(
    companyEmail,
    "Neue Bewerbung eingegangen",
    `
      <h1>Neue Bewerbung</h1>
      <p>Für die Stelle <strong>${application.job.title}</strong> ist eine neue Bewerbung eingegangen.</p>
      <p><strong>Bewerber:</strong> ${candidate.user.name || "-"}</p>
      <p><strong>E-Mail:</strong> ${candidate.user.email}</p>
      <p><strong>Beruf:</strong> ${candidate.profession || "-"}</p>
      <p><strong>Stadt:</strong> ${candidate.city || "-"}</p>
      <p>Bitte im Unternehmens-Dashboard prüfen.</p>
    `
  );

  return NextResponse.redirect(
    new URL("/candidate/applications", req.url),
    303
  );
}