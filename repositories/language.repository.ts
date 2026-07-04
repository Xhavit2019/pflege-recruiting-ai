import { prisma } from "@/lib/prisma";

export const LanguageRepository = {
  async findByCandidate(candidateProfileId: string) {
    return prisma.language.findMany({
      where: {
        candidateProfileId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.language.findUnique({
      where: {
        id,
      },
    });
  },

  async create(data: {
    candidateProfileId: string;
    language: string;
    level: any;
  }) {
    return prisma.language.create({
      data,
    });
  },

  async update(
    id: string,
    data: Partial<{
      language: string;
      level: any;
    }>
  ) {
    return prisma.language.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.language.delete({
      where: {
        id,
      },
    });
  },
};