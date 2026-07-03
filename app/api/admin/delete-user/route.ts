import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const userId = formData.get("userId") as string;

  const candidateProfile = await prisma.candidateProfile.findUnique({
    where: { userId },
  });

  if (candidateProfile) {
    await prisma.application.deleteMany({
      where: { candidateId: candidateProfile.id },
    });

    await prisma.candidateProfile.delete({
      where: { id: candidateProfile.id },
    });
  }

  const company = await prisma.company.findUnique({
    where: { userId },
  });

  if (company) {
    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      select: { id: true },
    });

    await prisma.application.deleteMany({
      where: {
        jobId: {
          in: jobs.map((job) => job.id),
        },
      },
    });

    await prisma.job.deleteMany({
      where: { companyId: company.id },
    });

    await prisma.company.delete({
      where: { id: company.id },
    });
  }

  await prisma.account.deleteMany({
    where: { userId },
  });

  await prisma.session.deleteMany({
    where: { userId },
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.redirect(
    new URL("/admin/users?deleted=1", req.url),
    303
  );
}