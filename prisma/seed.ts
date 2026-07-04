import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seed/users";
import { seedCompanies } from "./seed/companies";
import { seedCandidates } from "./seed/candidates";
import { seedJobs } from "./seed/jobs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seed startet...");

  const { passwordHash } = await seedUsers(prisma);

  const companies = await seedCompanies(prisma, passwordHash);

  await seedCandidates(prisma);

  await seedJobs(prisma, companies);

  console.log("Seed abgeschlossen.");
  console.log("Admin: admin@nexttech.ai / 123456");
  console.log("Demo-Passwort für alle Demo-Nutzer: 123456");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });