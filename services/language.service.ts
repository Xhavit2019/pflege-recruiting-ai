import { LanguageRepository } from "@/repositories/language.repository";

export const LanguageService = {
  async getLanguages(candidateProfileId: string) {
    return LanguageRepository.findByCandidate(candidateProfileId);
  },

  async getLanguage(id: string) {
    return LanguageRepository.findById(id);
  },

  async createLanguage(data: Parameters<typeof LanguageRepository.create>[0]) {
    return LanguageRepository.create(data);
  },

  async updateLanguage(
    id: string,
    data: Parameters<typeof LanguageRepository.update>[1]
  ) {
    return LanguageRepository.update(id, data);
  },

  async deleteLanguage(id: string) {
    return LanguageRepository.delete(id);
  },
};