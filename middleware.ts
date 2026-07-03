import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/company") && role !== "company") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/candidate") && role !== "candidate") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/company/:path*", "/candidate/:path*"],
};