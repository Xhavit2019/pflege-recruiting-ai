import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY fehlt in der Umgebungsdatei.");
  }

  return new Resend(apiKey);
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const resend = getResendClient();

  const from =
    process.env.EMAIL_FROM ??
    "Test Pflege Recruiting AI <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("E-Mail-Versand fehlgeschlagen:", error);

    throw new Error(
      error.message || "Die E-Mail konnte nicht versendet werden."
    );
  }

  return data;
}