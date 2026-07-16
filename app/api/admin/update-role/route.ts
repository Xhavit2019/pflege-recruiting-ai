import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Nicht eingeloggt." },
        { status: 401 }
      );
    }

    if (currentUser.role !== Role.admin) {
      return NextResponse.json(
        {
          error:
            "Nur Administratoren dürfen Benutzerrollen ändern.",
        },
        { status: 403 }
      );
    }

    const formData = await req.formData();

    const userId = formData
      .get("userId")
      ?.toString()
      .trim();

    const roleValue = formData
      .get("role")
      ?.toString()
      .trim();

    if (!userId || !roleValue) {
      return NextResponse.json(
        {
          error:
            "Benutzer-ID und Rolle sind erforderlich.",
        },
        { status: 400 }
      );
    }

    if (
      !Object.values(Role).includes(
        roleValue as Role
      )
    ) {
      return NextResponse.json(
        { error: "Ungültige Benutzerrolle." },
        { status: 400 }
      );
    }

    if (userId === currentUser.id) {
      return NextResponse.json(
        {
          error:
            "Die eigene Administratorrolle darf hier nicht geändert werden.",
        },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Benutzer wurde nicht gefunden." },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: roleValue as Role,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/admin/users?roleUpdated=1",
        req.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Benutzerrolle konnte nicht geändert werden:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Die Benutzerrolle konnte nicht geändert werden.",
      },
      { status: 500 }
    );
  }
}