import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./current-user";

export async function getCurrentCandidate() {
  const user = await getCurrentUser();

  if (!user || user.role !== "candidate") {
    return null;
  }

  return prisma.candidateProfile.findUnique({
    where: {
      userId: user.id,
    },
    include: {
      user: true,

      educations: {
        orderBy: {
          startDate: "desc",
        },
      },

      workExperiences: {
        orderBy: {
          startDate: "desc",
        },
      },

      certificates: {
        orderBy: {
          issueDate: "desc",
        },
      },

      languages: {
        orderBy: {
          createdAt: "desc",
        },
      },

      applications: {
        include: {
          job: {
            include: {
              company: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}