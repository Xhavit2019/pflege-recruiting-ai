import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash || ""
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Falsches Passwort" },
        { status: 401 }
      );
    }

    const redirectUrl =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "company"
        ? "/company/dashboard"
        : "/candidate/dashboard";

    const response = NextResponse.redirect(
      new URL(redirectUrl, req.url),
      303
    );

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    response.cookies.set("role", user.role, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Login fehlgeschlagen" },
      { status: 500 }
    );
  }
}