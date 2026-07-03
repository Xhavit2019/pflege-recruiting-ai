import { NextResponse } from "next/server";
import { CertificateService } from "@/services/certificate.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    await CertificateService.updateCertificate(id, {
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await CertificateService.deleteCertificate(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Zertifikat konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}