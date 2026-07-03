import { WorkExperienceRepository } from "@/repositories/work-experience.repository";

export const WorkExperienceService = {
  async getWorkExperiences(candidateProfileId: string) {
    return WorkExperienceRepository.findByCandidate(candidateProfileId);
  },

  async getWorkExperience(id: string) {
    return WorkExperienceRepository.findById(id);
  },

  async createWorkExperience(data: {
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
    return WorkExperienceRepository.create(data);
  },

  async updateWorkExperience(
    id: string,
    data: Parameters<typeof WorkExperienceRepository.update>[1]
  ) {
    return WorkExperienceRepository.update(id, data);
  },

  async deleteWorkExperience(id: string) {
    return WorkExperienceRepository.delete(id);
  },
};