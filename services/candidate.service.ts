import { CandidateRepository } from "@/repositories/candidate.repository";
import type { CandidateUpdateData } from "@/types/candidate-update";
export const CandidateService = {
  getProfile(userId: string) {
    return CandidateRepository.findByUserId(userId);
  },

  updateProfile(userId: string, data: CandidateUpdateData) {
    return CandidateRepository.updateProfile(userId, data);
  },
};