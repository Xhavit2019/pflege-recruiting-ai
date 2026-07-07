import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const email = formData.get("email")?.toString().trim().toLowerCase() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email || !password) {
      return NextResponse.redirect(
        new URL("/login?error=missingFields", req.url),
        303
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?error=userNotFound", req.url),
        303
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash || ""
    );

    if (!validPassword) {
      return NextResponse.redirect(
        new URL("/login?error=wrongPassword", req.url),
        303
      );
    }

    const redirectUrl =
      user.role === "admin"
        ? "/admin/dashboard"
        : user.role === "company"
          ? "/company/dashboard"
          : "/candidate/dashboard";

    const response = NextResponse.redirect(new URL(redirectUrl, req.url), 303);

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

    return NextResponse.redirect(
      new URL("/login?error=failed", req.url),
      303
    );
  }
}