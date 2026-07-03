import { prisma } from "@/lib/prisma";

type SearchJobsParams = {
  q?: string;
  city?: string;
  employmentType?: string;
};

export const JobRepository = {
  search(params: SearchJobsParams) {
    const q = params.q?.trim();
    const city = params.city?.trim();
    const employmentType = params.employmentType?.trim();

    return prisma.job.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  {
                    title: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                  {
                    description: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {},
          city
            ? {
                city: {
                  contains: city,
                  mode: "insensitive",
                },
              }
            : {},
          employmentType
            ? {
                employmentType: {
                  contains: employmentType,
                  mode: "insensitive",
                },
              }
            : {},
        ],
      },
      include: {
        company: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};