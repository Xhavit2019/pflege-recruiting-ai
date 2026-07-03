import { EducationRepository } from "@/repositories/education.repository";

export const EducationService = {
  async getEducations(candidateProfileId: string) {
    return EducationRepository.findByCandidate(candidateProfileId);
  },

  async createEducation(data: {
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
    return EducationRepository.create(data);
  },

  async updateEducation(
    id: string,
    data: Parameters<typeof EducationRepository.update>[1]
  ) {
    return EducationRepository.update(id, data);
  },

  async deleteEducation(id: string) {
    return EducationRepository.delete(id);
  },

  async getEducation(id: string) {
  return EducationRepository.findById(id);
  },
};