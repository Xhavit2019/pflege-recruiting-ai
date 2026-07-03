import { CertificateRepository } from "@/repositories/certificate.repository";

export const CertificateService = {
  async getCertificates(candidateProfileId: string) {
    return CertificateRepository.findByCandidate(candidateProfileId);
  },

  async getCertificate(id: string) {
    return CertificateRepository.findById(id);
  },

  async createCertificate(data: {
    candidateProfileId: string;
    title: string;
    issuer: string;
    issueDate?: Date | null;
    expiryDate?: Date | null;
    certificateNumber?: string | null;
    description?: string | null;
  }) {
    return CertificateRepository.create(data);
  },

  async updateCertificate(
    id: string,
    data: Parameters<typeof CertificateRepository.update>[1]
  ) {
    return CertificateRepository.update(id, data);
  },

  async deleteCertificate(id: string) {
    return CertificateRepository.delete(id);
  },
};