import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const applicationId = formData.get("applicationId") as string;
  const status = formData.get("status") as
    | "pending"
    | "reviewed"
    | "accepted"
    | "rejected";

  const application = await prisma.application.update({
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

  console.log("Sende Status-Mail an:", application.candidate.user.email);

const emailResult = await sendEmail(
  application.candidate.user.email,
  `Status deiner Bewerbung: ${statusText}`,
  
    `
      <h1>Status deiner Bewerbung</h1>
      <p>Hallo ${application.candidate.user.name || ""},</p>
      <p>deine Bewerbung für die Stelle <strong>${application.job.title}</strong> bei <strong>${application.job.company.companyName}</strong> wurde aktualisiert.</p>
      <p><strong>Neuer Status:</strong> ${statusText}</p>
      <p>Viele Grüße<br/>Pflege Recruiting AI</p>
    `
  );

  return NextResponse.redirect(
    new URL("/company/applications?statusUpdated=1", req.url),
    303
  
    );

console.log("Resend Ergebnis:", emailResult);
}