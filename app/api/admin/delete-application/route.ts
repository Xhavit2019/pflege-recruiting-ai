import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const applicationId = formData.get("applicationId") as string;

  await prisma.application.delete({
    where: { id: applicationId },
  });

  return NextResponse.redirect(
    new URL("/admin/applications?deleted=1", req.url),
    303
  );
}