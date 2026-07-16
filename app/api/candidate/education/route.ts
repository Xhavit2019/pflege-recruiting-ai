import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { EducationService } from "@/services/education.service";

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
  // Außerhalb von try/catch, damit der Login-Redirect
  // nicht versehentlich als Serverfehler behandelt wird.
  const candidate = await requireCandidate();

  try {
    const formData = await req.formData();

    const degree = formData
      .get("degree")
      ?.toString()
      .trim();

    const institution = formData
      .get("institution")
      ?.toString()
      .trim();

    if (!degree || !institution) {
      return NextResponse.json(
        {
          error:
            "Abschluss und Bildungseinrichtung sind erforderlich.",
        },
        { status: 400 }
      );
    }

    const currentlyStudying =
      formData.get("currentlyStudying") === "on";

    await EducationService.createEducation({
      candidateProfileId: candidate.id,
      degree,
      institution,
      fieldOfStudy: toNullableString(
        formData.get("fieldOfStudy")
      ),
      city: toNullableString(formData.get("city")),
      country: toNullableString(formData.get("country")),
      startDate: toNullableDate(formData.get("startDate")),
      endDate: currentlyStudying
        ? null
        : toNullableDate(formData.get("endDate")),
      currentlyStudying,
      description: toNullableString(
        formData.get("description")
      ),
    });

    return NextResponse.redirect(
      new URL("/candidate/profile?educationSaved=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Ausbildung konnte nicht gespeichert werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Ausbildung konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}