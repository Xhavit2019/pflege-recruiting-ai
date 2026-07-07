import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim().toLowerCase() || "";
    const password = formData.get("password")?.toString() || "";
    const role = formData.get("role")?.toString() as
      | "candidate"
      | "company"
      | "admin";

    if (!name || !email || !password || !role) {
      return NextResponse.redirect(
        new URL("/register?error=missingFields", req.url),
        303
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.redirect(
        new URL("/register?error=userExists", req.url),
        303
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
      },
    });

    if (role === "candidate") {
      await prisma.candidateProfile.create({
        data: {
          userId: user.id,
        },
      });
    }

    if (role === "company") {
      await prisma.company.create({
        data: {
          userId: user.id,
          companyName: name,
          city: "",
          phone: "",
          website: "",
          description: "",
          facilityType: "other",
          industry: "care",
          isVerified: false,
        },
      });
    }

    return NextResponse.redirect(new URL("/login?registered=1", req.url), 303);
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(
      new URL("/register?error=failed", req.url),
      303
    );
  }
}