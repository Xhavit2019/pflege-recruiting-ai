import { PrismaClient } from "@prisma/client";
import { createPasswordHash } from "./helpers";

export async function seedUsers(prisma: PrismaClient) {
  const passwordHash = await createPasswordHash();

  const admin = await prisma.user.upsert({
    where: { email: "admin@nexttech.ai" },
    update: {},
    create: {
      name: "NextTech Admin",
      email: "admin@nexttech.ai",
      passwordHash,
      role: "admin",
    },
  });

  return {
    admin,
    passwordHash,
  };
}