import { NextResponse } from "next/server";

import { generatePasswordResetToken } from "@/lib/auth/password-reset-token";
import { sendEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData
      .get("email")
      ?.toString()
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.redirect(
        new URL("/forgot-password?error=missingEmail", req.url),
        303
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
      },
    });

    // Aus Sicherheitsgründen wird nicht angezeigt,
    // ob die E-Mail-Adresse registriert ist.
    if (!user) {
      return NextResponse.redirect(
        new URL("/forgot-password?success=1", req.url),
        303
      );
    }

    const { token, tokenHash } = generatePasswordResetToken();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Alte Reset-Tokens dieses Benutzers löschen.
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const resetToken = await prisma.passwordResetToken.create({
      data: {
        // Nur der Hash wird in der Datenbank gespeichert.
        token: tokenHash,
        userId: user.id,
        expiresAt,
      },
    });

    const appUrl =
      process.env.APP_URL?.replace(/\/$/, "") ??
      new URL(req.url).origin;

    const resetUrl =
      `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;

    try {
      await sendEmail(
        user.email,
        "Passwort zurücksetzen – NextTech RecruitAI",
        `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
            <h2 style="color: #0f766e;">
              Passwort zurücksetzen
            </h2>

            <p>Hallo,</p>

            <p>
              für Ihr Konto bei NextTech RecruitAI wurde eine
              Passwortänderung angefordert.
            </p>

            <p>
              Klicken Sie auf die folgende Schaltfläche:
            </p>

            <p style="margin: 28px 0;">
              <a
                href="${resetUrl}"
                style="
                  display: inline-block;
                  padding: 12px 20px;
                  background-color: #0f766e;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
                "
              >
                Neues Passwort festlegen
              </a>
            </p>

            <p>
              Der Link ist 60 Minuten gültig und kann nur einmal
              verwendet werden.
            </p>

            <p>
              Falls die Schaltfläche nicht funktioniert, kopieren Sie
              diesen Link in Ihren Browser:
            </p>

            <p style="word-break: break-all;">
              ${resetUrl}
            </p>

            <p>
              Falls Sie diese Anfrage nicht gestellt haben, können Sie
              diese E-Mail ignorieren.
            </p>

            <p>
              Viele Grüße<br />
              <strong>NextTech RecruitAI</strong>
            </p>
          </div>
        `
      );
    } catch (mailError) {
      // Token wieder löschen, wenn der Mailversand fehlschlägt.
      await prisma.passwordResetToken.deleteMany({
        where: {
          id: resetToken.id,
        },
      });

      throw mailError;
    }

    return NextResponse.redirect(
      new URL("/forgot-password?success=1", req.url),
      303
    );
  } catch (error) {
    console.error("Passwort-Reset-E-Mail fehlgeschlagen:", error);

    return NextResponse.redirect(
      new URL("/forgot-password?error=failed", req.url),
      303
    );
  }
}