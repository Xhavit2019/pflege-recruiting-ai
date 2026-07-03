import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function GET() {
  try {
    await sendEmail(
      "xhavit_mustafa@gmx.de",
      "Pflege Recruiting AI Test",
      `
        <h1>Test erfolgreich</h1>
        <p>Resend funktioniert korrekt.</p>
      `
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "E-Mail Versand fehlgeschlagen" },
      { status: 500 }
    );
  }
}