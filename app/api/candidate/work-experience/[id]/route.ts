import { NextResponse } from "next/server";
import { WorkExperienceService } from "@/services/work-experience.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();

    await WorkExperienceService.updateWorkExperience(id, {
      company: formData.get("company")?.toString() ?? "",
      position: formData.get("position")?.toString() ?? "",
      city: formData.get("city")?.toString() || null,
      country: formData.get("country")?.toString() || null,
      startDate: formData.get("startDate")
        ? new Date(formData.get("startDate")!.toString())
        : null,
      endDate: formData.get("endDate")
        ? new Date(formData.get("endDate")!.toString())
        : null,
      currentlyWorking: formData.get("currentlyWorking") === "on",
      description: formData.get("description")?.toString() || null,
    });

    return NextResponse.redirect(new URL("/candidate/profile", req.url), 303);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Berufserfahrung konnte nicht gespeichert werden." },
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

    await WorkExperienceService.deleteWorkExperience(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Berufserfahrung konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}