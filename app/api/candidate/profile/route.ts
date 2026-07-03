import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CandidatePayload = Prisma.CandidateProfileGetPayload<{}>;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const skills = ((formData.get("skills") as string) || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const germanLevelValue = formData.get("germanLevel")?.toString() || null;
    const preferredIndustryValue =
      formData.get("preferredIndustry")?.toString() || null;

    const driverLicenseCategoryValue =
      formData.get("driverLicenseCategory")?.toString() || "none";

    await prisma.candidateProfile.upsert({
      where: { userId },
      update: {
        phone: formData.get("phone")?.toString() || null,
        city: formData.get("city")?.toString() || null,
        profession: formData.get("profession")?.toString() || null,
        yearsOfExperience: Number(formData.get("yearsOfExperience") || 0),
        desiredSalary: Number(formData.get("desiredSalary") || 0),
        germanLevel: germanLevelValue as CandidatePayload["germanLevel"],
        preferredIndustry:
          preferredIndustryValue as CandidatePayload["preferredIndustry"],
        expectedEmploymentType:
          formData.get("expectedEmploymentType")?.toString() || null,
        driverLicenseCategory:
          driverLicenseCategoryValue as CandidatePayload["driverLicenseCategory"],
        skills,
      },
      create: {
        userId,
        phone: formData.get("phone")?.toString() || null,
        city: formData.get("city")?.toString() || null,
        profession: formData.get("profession")?.toString() || null,
        yearsOfExperience: Number(formData.get("yearsOfExperience") || 0),
        desiredSalary: Number(formData.get("desiredSalary") || 0),
        germanLevel: germanLevelValue as CandidatePayload["germanLevel"],
        preferredIndustry:
          preferredIndustryValue as CandidatePayload["preferredIndustry"],
        expectedEmploymentType:
          formData.get("expectedEmploymentType")?.toString() || null,
        driverLicenseCategory:
          driverLicenseCategoryValue as CandidatePayload["driverLicenseCategory"],
        skills,
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/dashboard", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Profil konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}