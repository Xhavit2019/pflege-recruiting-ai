import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireCandidate } from "@/lib/auth/require-candidate";

type CandidatePayload = Prisma.CandidateProfileGetPayload<{}>;

function toNullableString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? text : null;
}

function toNullableNumber(value: FormDataEntryValue | null) {
  const text = value?.toString();
  return text ? Number(text) : null;
}

function toNullableDate(value: FormDataEntryValue | null) {
  const text = value?.toString();
  return text ? new Date(text) : null;
}

export async function POST(req: Request) {
  try {
    const candidate = await requireCandidate();
    const formData = await req.formData();

    const skills = (formData.get("skills")?.toString() || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const germanLevelValue = toNullableString(formData.get("germanLevel"));
    const preferredIndustryValue = toNullableString(
      formData.get("preferredIndustry")
    );
    const driverLicenseCategoryValue =
      toNullableString(formData.get("driverLicenseCategory")) || "none";

    await prisma.candidateProfile.update({
      where: {
        id: candidate.id,
      },
      data: {
        firstName: toNullableString(formData.get("firstName")),
        lastName: toNullableString(formData.get("lastName")),
        address: toNullableString(formData.get("address")),
        postalCode: toNullableString(formData.get("postalCode")),
        birthDate: toNullableDate(formData.get("birthDate")),
        nationality: toNullableString(formData.get("nationality")),

        phone: toNullableString(formData.get("phone")),
        city: toNullableString(formData.get("city")),
        profession: toNullableString(formData.get("profession")),
        yearsOfExperience: toNullableNumber(
          formData.get("yearsOfExperience")
        ),
        desiredSalary: toNullableNumber(formData.get("desiredSalary")),
        germanLevel: germanLevelValue as CandidatePayload["germanLevel"],
        preferredIndustry:
          preferredIndustryValue as CandidatePayload["preferredIndustry"],
        expectedEmploymentType: toNullableString(
          formData.get("expectedEmploymentType")
        ),
        driverLicenseCategory:
          driverLicenseCategoryValue as CandidatePayload["driverLicenseCategory"],
        skills,
      },
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?saved=1", req.url),
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