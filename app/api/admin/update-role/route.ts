import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const userId = formData.get("userId") as string;
  const role = formData.get("role") as "candidate" | "company" | "admin";

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return NextResponse.redirect(
    new URL("/admin/users?roleUpdated=1", req.url),
    303
  );
}