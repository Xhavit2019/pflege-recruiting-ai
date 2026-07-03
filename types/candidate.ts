import type { Prisma } from "@prisma/client";

type CandidateProfilePayload = Prisma.CandidateProfileGetPayload<{}>;

export type CandidateProfileData = {
  id: string;
  userId: string;

  phone?: string | null;
  city?: string | null;
  profession?: string | null;

  skills: string[];

  cvUrl?: string | null;
  profileImageUrl?: string | null;
  summary?: string | null;

  germanLevel?: CandidateProfilePayload["germanLevel"];

  desiredSalary?: number | null;
  availableFrom?: Date | null;
  yearsOfExperience?: number | null;

  driverLicenseCategory: CandidateProfilePayload["driverLicenseCategory"];

  hasCar: boolean;
  willingToRelocate: boolean;
  willingToTravel: boolean;

  preferredIndustry?: CandidateProfilePayload["preferredIndustry"];

  expectedEmploymentType?: string | null;

  profileCompleted: boolean;
  isAvailable: boolean;

  educations?: {
    id: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string | null;
    city?: string | null;
    country?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    currentlyStudying: boolean;
    description?: string | null;
  }[];

  workExperiences?: {
  id: string;
  company: string;
  position: string;
  city?: string | null;
  country?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  currentlyWorking: boolean;
  description?: string | null;
  }[];

  certificates?: {
  id: string;
  title: string;
  issuer: string;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  certificateNumber?: string | null;
  description?: string | null;
  }[];
  
};