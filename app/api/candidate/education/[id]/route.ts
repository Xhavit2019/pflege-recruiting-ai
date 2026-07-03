import { NextResponse } from "next/server";
import { EducationService } from "@/services/education.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    await EducationService.updateEducation(id, {
      degree: formData.get("degree")?.toString() ?? "",
      institution: formData.get("institution")?.toString() ?? "",
      fieldOfStudy: formData.get("fieldOfStudy")?.toString() || null,
      city: formData.get("city")?.toString() || null,
      country: formData.get("country")?.toString() || null,
      startDate: formData.get("startDate")
        ? new Date(formData.get("startDate")!.toString())
        : null,
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate")!.toString())
        : null,
      currentlyStudying: formData.get("currentlyStudying") === "on",
    });

    return NextResponse.redirect(
      new URL("/candidate/profile", req.url),
      303
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Ausbildung konnte nicht gespeichert werden." },
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

    await EducationService.deleteEducation(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Ausbildung konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}