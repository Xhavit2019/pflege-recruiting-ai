import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const jobId = formData.get("jobId") as string;

  await prisma.job.delete({
    where: { id: jobId },
  });

  return NextResponse.redirect(
    new URL("/admin/jobs?deleted=1", req.url),
    303
  );
}