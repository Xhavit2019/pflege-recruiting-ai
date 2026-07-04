import { prisma } from "@/lib/prisma";
import type { CandidateUpdateData } from "@/types/candidate-update";

export const CandidateRepository = {
  findByUserId(userId: string) {
    return prisma.candidateProfile.findUnique({
      where: {
        userId,
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
  },

  updateProfile(userId: string, data: CandidateUpdateData) {
    return prisma.candidateProfile.update({
      where: {
        userId,
      },
      data,
    });
  },
};