import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WorkExperienceService } from "@/services/work-experience.service";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    const profile = await prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Bewerberprofil nicht gefunden." },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    await WorkExperienceService.createWorkExperience({
      candidateProfileId: profile.id,
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