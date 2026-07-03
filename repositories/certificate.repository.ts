import { prisma } from "@/lib/prisma";

export const CertificateRepository = {
  async findByCandidate(candidateProfileId: string) {
    return prisma.certificate.findMany({
      where: {
        candidateProfileId,
      },
      orderBy: {
        issueDate: "desc",
      },
    });
  },

  async findById(id: string) {
    return prisma.certificate.findUnique({
      where: {
        id,
      },
    });
  },

  async create(data: {
    candidateProfileId: string;
    title: string;
    issuer: string;
    issueDate?: Date | null;
    expiryDate?: Date | null;
    certificateNumber?: string | null;
    description?: string | null;
  }) {
    return prisma.certificate.create({
      data,
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      issuer: string;
      issueDate: Date | null;
      expiryDate: Date | null;
      certificateNumber: string | null;
      description: string | null;
    }>
  ) {
    return prisma.certificate.update({
      where: {
        id,
      },
      data,
    });
  },

  async delete(id: string) {
    return prisma.certificate.delete({
      where: {
        id,
      },
    });
  },
};