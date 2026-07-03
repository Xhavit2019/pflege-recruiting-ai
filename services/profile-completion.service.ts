import type { CandidateProfile } from "@prisma/client";

export const ProfileCompletionService = {
  calculate(profile: CandidateProfile | null) {
    if (!profile) {
      return {
        percentage: 0,
        completed: 0,
        total: 12,
      };
    }

    const fields = [
      profile.phone,
      profile.city,
      profile.profession,
      profile.germanLevel,
      profile.yearsOfExperience,
      profile.desiredSalary,
      profile.driverLicenseCategory !== "none",
      profile.preferredIndustry,
      profile.expectedEmploymentType,
      profile.cvUrl,
      profile.summary,
      profile.skills.length > 0,
    ];

    const completed = fields.filter(Boolean).length;

    return {
      completed,
      total: fields.length,
      percentage: Math.round((completed / fields.length) * 100),
    };
  },
};