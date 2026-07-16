import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const path = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const role = token.role;

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(
      new URL("/login?error=forbidden", req.url)
    );
  }

  if (
    path.startsWith("/company") &&
    role !== "company"
  ) {
    return NextResponse.redirect(
      new URL("/login?error=forbidden", req.url)
    );
  }

  if (
    path.startsWith("/candidate") &&
    role !== "candidate"
  ) {
    return NextResponse.redirect(
      new URL("/login?error=forbidden", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/company/:path*",
    "/candidate/:path*",
  ],
};
