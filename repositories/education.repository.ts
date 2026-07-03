import { prisma } from "@/lib/prisma";

export const EducationRepository = {
  async findByCandidate(candidateProfileId: string) {
    return prisma.education.findMany({
      where: {
        candidateProfileId,
      },
      orderBy: {
        startDate: "desc",
      },
    });
  },

  async create(data: {
    candidateProfileId: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string | null;
    city?: string | null;
    country?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    currentlyStudying?: boolean;
    description?: string | null;
  }) {
    return prisma.education.create({
      data,
    });
  },

  async update(
    id: string,
    data: Partial<{
      degree: string;
      institution: string;
      fieldOfStudy: string | null;
      city: string | null;
      country: string | null;
      startDate: Date | null;
      endDate: Date | null;
      currentlyStudying: boolean;
      description: string | null;
    }>
  ) {
    return prisma.education.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.education.delete({
      where: {
        id,
      },
    });
  },
  async findById(id: string) {
  return prisma.education.findUnique({
    where: {
      id,
    },
  });
  },
};