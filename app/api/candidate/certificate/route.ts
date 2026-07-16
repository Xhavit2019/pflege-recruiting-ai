import { NextResponse } from "next/server";

import { requireCandidate } from "@/lib/auth/require-candidate";
import { CertificateService } from "@/services/certificate.service";

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

    const title = formData
      .get("title")
      ?.toString()
      .trim();

    const issuer = formData
      .get("issuer")
      ?.toString()
      .trim();

    if (!title || !issuer) {
      return NextResponse.json(
        {
          error:
            "Zertifikatsname und Aussteller sind erforderlich.",
        },
        { status: 400 }
      );
    }

    await CertificateService.createCertificate({
      candidateProfileId: candidate.id,
      title,
      issuer,
      issueDate: toNullableDate(formData.get("issueDate")),
      expiryDate: toNullableDate(formData.get("expiryDate")),
      certificateNumber: toNullableString(
        formData.get("certificateNumber")
      ),
      description: toNullableString(
        formData.get("description")
      ),
    });

    return NextResponse.redirect(
      new URL(
        "/candidate/profile?certificateSaved=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Zertifikat konnte nicht gespeichert werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Das Zertifikat konnte nicht gespeichert werden.",
      },
      { status: 500 }
    );
  }
}