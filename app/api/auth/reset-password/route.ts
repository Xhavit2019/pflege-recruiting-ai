import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { hashPasswordResetToken } from "@/lib/auth/password-reset-token";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const token = formData.get("token")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!token || !password) {
      return NextResponse.redirect(
        new URL("/login?error=invalidReset", req.url),
        303
      );
    }

    if (password.length < 8) {
      return NextResponse.redirect(
        new URL("/login?error=passwordTooShort", req.url),
        303
      );
    }

    // Der echte Token aus der E-Mail wird gehasht.
    const tokenHash = hashPasswordResetToken(token);

    // In der Datenbank suchen wir nur nach dem Hash.
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token: tokenHash,
      },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });

    if (!resetToken) {
      return NextResponse.redirect(
        new URL("/login?error=invalidToken", req.url),
        303
      );
    }

    if (resetToken.expiresAt < new Date()) {
      await prisma.passwordResetToken.deleteMany({
        where: {
          id: resetToken.id,
        },
      });

      return NextResponse.redirect(
        new URL("/login?error=tokenExpired", req.url),
        303
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Passwort ändern und alle Reset-Tokens des Benutzers löschen.
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          passwordHash,
        },
      }),

      prisma.passwordResetToken.deleteMany({
        where: {
          userId: resetToken.userId,
        },
      }),
    ]);

    return NextResponse.redirect(
      new URL("/login?passwordReset=1", req.url),
      303
    );
  } catch (error) {
    console.error("Passwort konnte nicht geändert werden:", error);

    return NextResponse.redirect(
      new URL("/login?error=failed", req.url),
      303
    );
  }
}