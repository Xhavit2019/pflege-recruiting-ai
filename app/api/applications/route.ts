import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: Request) {
  // Nur ein tatsächlich angemeldeter Bewerber darf sich bewerben.
  const authenticatedCandidate = await requireCandidate();

  try {
    const formData = await req.formData();
    const jobId = formData.get("jobId")?.toString().trim();

    if (!jobId) {
      return NextResponse.json(
        { error: "Die Stellen-ID fehlt." },
        { status: 400 }
      );
    }

    const candidate = await prisma.candidateProfile.findUnique({
      where: {
        id: authenticatedCandidate.id,
      },
      include: {
        user: true,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Das Bewerberprofil wurde nicht gefunden." },
        { status: 404 }
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
        { error: "Die Stelle wurde nicht gefunden." },
        { status: 404 }
      );
    }

    // Doppelte Bewerbung verhindern.
    const existingApplication =
      await prisma.application.findFirst({
        where: {
          jobId,
          candidateId: candidate.id,
        },
        select: {
          id: true,
        },
      });

    if (existingApplication) {
      return NextResponse.redirect(
        new URL(
          "/candidate/applications?alreadyApplied=1",
          req.url
        ),
        303
      );
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

    /*
     * Die Bewerbung wurde bereits erfolgreich gespeichert.
     * Ein Fehler beim E-Mail-Versand darf den Hauptvorgang
     * nicht mehr mit einem 500-Fehler abbrechen.
     */
    try {
      await sendEmail(
        application.job.company.user.email,
        "Neue Bewerbung eingegangen – NextTech RecruitAI",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2 style="color: #0f766e;">
              Neue Bewerbung eingegangen
            </h2>

            <p>
              Für die Stelle
              <strong>${escapeHtml(application.job.title)}</strong>
              ist eine neue Bewerbung eingegangen.
            </p>

            <p>
              <strong>Bewerber:</strong>
              ${escapeHtml(candidate.user.name) || "-"}
            </p>

            <p>
              <strong>E-Mail:</strong>
              ${escapeHtml(candidate.user.email)}
            </p>

            <p>
              <strong>Beruf:</strong>
              ${escapeHtml(candidate.profession) || "-"}
            </p>

            <p>
              <strong>Stadt:</strong>
              ${escapeHtml(candidate.city) || "-"}
            </p>

            <p>
              Bitte prüfen Sie die Bewerbung in Ihrem
              Unternehmens-Dashboard.
            </p>

            <p>
              Viele Grüße<br />
              <strong>NextTech RecruitAI</strong>
            </p>
          </div>
        `
      );
    } catch (mailError) {
      console.warn(
        "Bewerbung wurde gespeichert, aber die Benachrichtigungs-E-Mail konnte nicht gesendet werden:",
        mailError
      );
    }

    return NextResponse.redirect(
      new URL(
        "/candidate/applications?submitted=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Bewerbung konnte nicht erstellt werden:",
      error
    );

    return NextResponse.json(
      { error: "Die Bewerbung konnte nicht gesendet werden." },
      { status: 500 }
    );
  }
}