import { PrismaClient } from "@prisma/client";
import { randomFrom, randomInt } from "./helpers";

const jobTitles = [
  "Pflegefachkraft m/w/d",
  "Altenpfleger m/w/d",
  "Gesundheits- und Krankenpfleger m/w/d",
  "Pflegehelfer m/w/d",
  "Intensivpfleger m/w/d",
  "Wohnbereichsleitung m/w/d",
  "Praxisanleiter Pflege m/w/d",
];

export async function seedJobs(prisma: PrismaClient, companies: { id: string }[]) {
  const jobs = [];

  for (let i = 1; i <= 50; i++) {
    const company = randomFrom(companies);

    const job = await prisma.job.create({
      data: {
        companyId: company.id,
        title: randomFrom(jobTitles),
        description:
          "Wir suchen engagierte Pflegekräfte für ein modernes und wertschätzendes Arbeitsumfeld.",
        city: randomFrom(["Bayreuth", "Nürnberg", "Bamberg", "Erlangen", "München"]),
        employmentType: randomFrom(["Vollzeit", "Teilzeit", "Schichtdienst"]),
        industry: "care",
        salaryFrom: randomInt(2800, 3600),
        salaryTo: randomInt(3700, 5200),
        requiredSkills: ["Grundpflege", "Dokumentation", "Teamfähigkeit"],
        requiredGermanLevel: randomFrom(["B1", "B2", "C1"]),
        experienceRequired: randomInt(0, 5),
        housingAvailable: Math.random() > 0.6,
        visaSupport: Math.random() > 0.7,
        internationalApplicants: Math.random() > 0.5,
        isActive: true,
        isFeatured: Math.random() > 0.7,
      },
    });

    jobs.push(job);
  }

  return jobs;
}