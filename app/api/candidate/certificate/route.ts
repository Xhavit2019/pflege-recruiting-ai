import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CertificateService } from "@/services/certificate.service";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Bewerberprofil nicht gefunden." },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    await CertificateService.createCertificate({
      candidateProfileId: profile.id,
      title: formData.get("title")?.toString() ?? "",
      issuer: formData.get("issuer")?.toString() ?? "",
      issueDate: formData.get("issueDate")
        ? new Date(formData.get("issueDate")!.toString())
        : null,
      expiryDate: formData.get("expiryDate")
        ? new Date(formData.get("expiryDate")!.toString())
        : null,
      certificateNumber:
        formData.get("certificateNumber")?.toString() || null,
      description:
        formData.get("description")?.toString() || null,
    });

    return NextResponse.redirect(
      new URL("/candidate/profile", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Zertifikat konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}