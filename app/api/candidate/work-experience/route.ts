import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { WorkExperienceService } from "@/services/work-experience.service";

function toNullableString(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();

  return text || null;
}

function toNullableDate(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();

  if (!text) {
    return null;
  }

  const date = new Date(text);

  return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(req: Request) {
  const candidate = await requireCandidate();

  try {
    const formData = await req.formData();

    const company = formData
      .get("company")
      ?.toString()
      .trim();

    const position = formData
      .get("position")
      ?.toString()
      .trim();

    if (!company || !position) {
      return NextResponse.json(
        {
          error: "Unternehmen und Position sind erforderlich.",
        },
        { status: 400 }
      );
    }

    const currentlyWorking =
      formData.get("currentlyWorking") === "on";

    await WorkExperienceService.createWorkExperience({
      candidateProfileId: candidate.id,
      company,
      position,
      city: toNullableString(formData.get("city")),
      country: toNullableString(formData.get("country")),
      startDate: toNullableDate(formData.get("startDate")),
      endDate: currentlyWorking
        ? null
        : toNullableDate(formData.get("endDate")),
      currentlyWorking,
      description: toNullableString(
        formData.get("description")
      ),
    });

    return NextResponse.redirect(
      new URL(
        "/candidate/profile?workExperienceSaved=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Berufserfahrung konnte nicht gespeichert werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Berufserfahrung konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}