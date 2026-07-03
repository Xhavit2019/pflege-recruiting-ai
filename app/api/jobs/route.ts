import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get("title") as string;
  const city = formData.get("city") as string;
  const employmentType = formData.get("employmentType") as string;
  const description = formData.get("description") as string;
  const salaryFrom = formData.get("salaryFrom") as string;
  const salaryTo = formData.get("salaryTo") as string;
  const requiredSkills = formData.get("requiredSkills") as string;

  let company = await prisma.company.findFirst();

  if (!company) {
    const user = await prisma.user.findFirst({
      where: { role: "company" },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Bitte zuerst ein Unternehmen registrieren." },
        { status: 400 }
      );
    }

    company = await prisma.company.create({
      data: {
        userId: user.id,
        companyName: user.name || "Pflegeunternehmen",
        city,
        isVerified: true,
      },
    });
  }

  await prisma.job.create({
    data: {
      companyId: company.id,
      title,
      city,
      employmentType,
      description,
      salaryFrom: salaryFrom ? Number(salaryFrom) : null,
      salaryTo: salaryTo ? Number(salaryTo) : null,
      requiredSkills: requiredSkills
        ? requiredSkills.split(",").map((s) => s.trim())
        : [],
    },
  });

  return NextResponse.redirect(new URL("/jobs", req.url));
}