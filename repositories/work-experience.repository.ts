import { prisma } from "@/lib/prisma";

export const WorkExperienceRepository = {
  async findByCandidate(candidateProfileId: string) {
    return prisma.workExperience.findMany({
      where: {
        candidateProfileId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.workExperience.findUnique({
      where: {
        id,
      },
    });
  },

  async create(data: {
    candidateProfileId: string;
    company: string;
    position: string;
    city?: string | null;
    country?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    currentlyWorking?: boolean;
    description?: string | null;
  }) {
    return prisma.workExperience.create({
      data,
    });
  },

  async update(
    id: string,
    data: Partial<{
      company: string;
      position: string;
      city: string | null;
      country: string | null;
      startDate: Date | null;
      endDate: Date | null;
      currentlyWorking: boolean;
      description: string | null;
    }>
  ) {
    return prisma.workExperience.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.workExperience.delete({
      where: {
        id,
      },
    });
  },
};