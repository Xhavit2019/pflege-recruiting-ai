import { PrismaClient } from "@prisma/client";

export async function seedCompanies(
  prisma: PrismaClient,
  passwordHash: string
) {
  const companiesData = [
    {
      name: "Bayreuth Pflegezentrum GmbH",
      city: "Bayreuth",
      facilityType: "nursing_home",
    },
    {
      name: "Seniorenresidenz Rotmain",
      city: "Bayreuth",
      facilityType: "nursing_home",
    },
    {
      name: "Klinikum Oberfranken",
      city: "Bamberg",
      facilityType: "hospital",
    },
    {
      name: "Mobile Pflege Bayern",
      city: "Nürnberg",
      facilityType: "outpatient_care",
    },
    {
      name: "Reha Zentrum Franken",
      city: "Erlangen",
      facilityType: "rehabilitation",
    },
  ] as const;

  const companies = [];

  for (const company of companiesData) {
    const user = await prisma.user.upsert({
      where: {
        email: `${company.name
          .toLowerCase()
          .replaceAll(" ", ".")
          .replaceAll("ü", "ue")
          .replaceAll("ä", "ae")
          .replaceAll("ö", "oe")}@demo.de`,
      },
      update: {},
      create: {
        name: company.name,
        email: `${company.name
          .toLowerCase()
          .replaceAll(" ", ".")
          .replaceAll("ü", "ue")
          .replaceAll("ä", "ae")
          .replaceAll("ö", "oe")}@demo.de`,
        passwordHash,
        role: "company",
      },
    });

    const createdCompany = await prisma.company.upsert({
      where: {
        userId: user.id,
      },
      update: {},
      create: {
        userId: user.id,
        companyName: company.name,
        city: company.city,
        phone: "0921 000000",
        website: "https://example.com",
        description: `${company.name} ist ein Demo-Unternehmen für NextTech RecruitAI.`,
        facilityType: company.facilityType,
        industry: "care",
        isVerified: true,
      },
    });

    companies.push(createdCompany);
  }

  return companies;
}