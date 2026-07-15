import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

const allowedStatuses = [
  "pending",
  "reviewed",
  "accepted",
  "rejected",
] as const;

type ApplicationStatus = (typeof allowedStatuses)[number];

function escapeHtml(value: string | null | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

    const formData = await req.formData();

    const applicationId = formData
      .get("applicationId")
      ?.toString()
      .trim();

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
      select: {
        id: true,
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

    if (currentUser.role === "company") {
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
          { error: "Kein Zugriff auf diese Bewerbung." },
          { status: 403 }
        );
      }
    } else if (currentUser.role !== "admin") {
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
                  ? ` ${escapeHtml(
                      updatedApplication.candidate.user.name
                    )}`
                  : ""
              },
            </p>

            <p>
              Ihre Bewerbung für die Stelle
              <strong>${escapeHtml(
                updatedApplication.job.title
              )}</strong>
              bei
              <strong>${escapeHtml(
                updatedApplication.job.company.companyName
              )}</strong>
              wurde aktualisiert.
            </p>

            <p>
              <strong>Neuer Status:</strong>
              ${escapeHtml(statusText)}
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
      currentUser.role === "admin"
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