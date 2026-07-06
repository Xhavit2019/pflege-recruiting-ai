import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./current-user";

export async function getCurrentCompany() {
  const user = await getCurrentUser();

  if (!user || user.role !== "company") {
    return null;
  }

  return prisma.company.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
    },
  });
}