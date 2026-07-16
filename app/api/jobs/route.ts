import { NextResponse } from "next/server";

import { requireCompany } from "@/lib/auth/require-company";
import { prisma } from "@/lib/prisma";

function parseOptionalSalary(
  value: FormDataEntryValue | null
) {
  const text = value?.toString().trim();

  if (!text) {
    return null;
  }

  const salary = Number(text);

  if (!Number.isFinite(salary) || salary < 0) {
    return undefined;
  }

  return salary;
}

export async function POST(req: Request) {
  const company = await requireCompany();

  try {
    const formData = await req.formData();

    const title = formData
      .get("title")
      ?.toString()
      .trim();

    const city = formData
      .get("city")
      ?.toString()
      .trim();

    const employmentType = formData
      .get("employmentType")
      ?.toString()
      .trim();

    const description = formData
      .get("description")
      ?.toString()
      .trim();

    if (
      !title ||
      !city ||
      !employmentType ||
      !description
    ) {
      return NextResponse.json(
        {
          error:
            "Titel, Ort, Beschäftigungsart und Beschreibung sind erforderlich.",
        },
        { status: 400 }
      );
    }

    const salaryFrom = parseOptionalSalary(
      formData.get("salaryFrom")
    );

    const salaryTo = parseOptionalSalary(
      formData.get("salaryTo")
    );

    if (
      salaryFrom === undefined ||
      salaryTo === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "Das Gehalt muss eine gültige positive Zahl sein.",
        },
        { status: 400 }
      );
    }

    if (
      salaryFrom !== null &&
      salaryTo !== null &&
      salaryFrom > salaryTo
    ) {
      return NextResponse.json(
        {
          error:
            "Das Mindestgehalt darf nicht höher als das Maximalgehalt sein.",
        },
        { status: 400 }
      );
    }

    const requiredSkillsValue = formData
      .get("requiredSkills")
      ?.toString();

    const requiredSkills = Array.from(
      new Set(
        (requiredSkillsValue ?? "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      )
    );

    await prisma.job.create({
      data: {
        companyId: company.id,
        title,
        city,
        employmentType,
        description,
        salaryFrom,
        salaryTo,
        requiredSkills,
      },
    });

    return NextResponse.redirect(
      new URL("/company/jobs?created=1", req.url),
      303
    );
  } catch (error) {
    console.error(
      "Stellenanzeige konnte nicht erstellt werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Stellenanzeige konnte nicht erstellt werden.",
      },
      { status: 500 }
    );
  }
}