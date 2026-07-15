import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
] as const;

type ApplicationStatus = (typeof allowedStatuses)[number];

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();

    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const applicationId = formData
      .get("applicationId")
      ?.toString();

    const status = formData
      .get("status")
      ?.toString() as ApplicationStatus;

    if (
      !applicationId ||
      !allowedStatuses.includes(status)
    ) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        job: {
          select: {
            companyId: true,
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
        select: {
          id: true,
        },
      });

      if (
        !company ||
        application.job.companyId !== company.id
      ) {
        return NextResponse.json(
          { error: "Kein Zugriff auf diese Bewerbung." },
          { status: 403 }
        );
      }
    } else if (role !== "admin") {
      return NextResponse.json(
        { error: "Keine Berechtigung." },
        { status: 403 }
      );
    }

    const updatedApplication =
      await prisma.application.update({
        where: {
          id: applicationId,
        },
        data: {
          status,
        },
        include: {
          candidate: {
            include: {
              user: true,
            },
          },
          job: {
            include: {
              company: true,
            },
          },
        },
      });

    const statusText =
      status === "reviewed"
        ? "in Prüfung"
        : status === "accepted"
          ? "angenommen"
          : status === "rejected"
            ? "abgelehnt"
            : "offen";

    /*
     * Die Statusänderung wurde bereits erfolgreich gespeichert.
     * Ein Fehler beim E-Mail-Versand darf deshalb nicht den
     * gesamten Vorgang mit einem 500-Fehler abbrechen.
     */
    try {
      await sendEmail(
        updatedApplication.candidate.user.email,
        `Status Ihrer Bewerbung: ${statusText}`,
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2 style="color: #0f766e;">
              Status Ihrer Bewerbung
            </h2>

            <p>
              Hallo${
                updatedApplication.candidate.user.name
                  ? ` ${updatedApplication.candidate.user.name}`
                  : ""
              },
            </p>

            <p>
              Ihre Bewerbung für die Stelle
              <strong>${updatedApplication.job.title}</strong>
              bei
              <strong>${updatedApplication.job.company.companyName}</strong>
              wurde aktualisiert.
            </p>

            <p>
              <strong>Neuer Status:</strong> ${statusText}
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
        "Status wurde gespeichert, aber die Benachrichtigungs-E-Mail konnte nicht gesendet werden:",
        mailError
      );
    }

    const redirectPath =
      role === "admin"
        ? "/admin/applications?statusUpdated=1"
        : "/company/applications?statusUpdated=1";

    return NextResponse.redirect(
      new URL(redirectPath, req.url),
      303
    );
  } catch (error) {
    console.error(
      "Bewerbungsstatus konnte nicht aktualisiert werden:",
      error
    );

    return NextResponse.json(
      {
        error: "Status konnte nicht aktualisiert werden.",
      },
      { status: 500 }
    );
  }
}