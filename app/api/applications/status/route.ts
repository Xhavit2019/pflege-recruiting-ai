import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"] as const;

type ApplicationStatus = (typeof allowedStatuses)[number];

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const formData = await req.formData();

    const applicationId = formData.get("applicationId")?.toString();
    const status = formData.get("status")?.toString() as ApplicationStatus;

    if (!applicationId || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Ungültige Anfrage." },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
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
    } else if (role !== "admin") {
      return NextResponse.json(
        { error: "Keine Berechtigung." },
        { status: 403 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
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

    await sendEmail(
      updatedApplication.candidate.user.email,
      `Status deiner Bewerbung: ${statusText}`,
      `
        <h1>Status deiner Bewerbung</h1>
        <p>Hallo ${updatedApplication.candidate.user.name || ""},</p>
        <p>deine Bewerbung für die Stelle <strong>${updatedApplication.job.title}</strong> bei <strong>${updatedApplication.job.company.companyName}</strong> wurde aktualisiert.</p>
        <p><strong>Neuer Status:</strong> ${statusText}</p>
        <p>Viele Grüße<br/>NextTech RecruitAI</p>
      `
    );

    return NextResponse.redirect(
      new URL("/company/applications?statusUpdated=1", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Status konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}