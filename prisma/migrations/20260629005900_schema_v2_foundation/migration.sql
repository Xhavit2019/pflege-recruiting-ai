/*
  Warnings:

  - You are about to drop the column `experienceYears` on the `CandidateProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."DriverLicenseCategory" AS ENUM ('none', 'B', 'C', 'D', 'other');

-- AlterEnum
ALTER TYPE "public"."FacilityType" ADD VALUE 'staffing_agency';

-- AlterTable
ALTER TABLE "public"."CandidateProfile" DROP COLUMN "experienceYears",
ADD COLUMN     "driverLicenseCategory" "public"."DriverLicenseCategory" NOT NULL DEFAULT 'none',
ADD COLUMN     "expectedEmploymentType" TEXT,
ADD COLUMN     "hasCar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "preferredIndustry" "public"."Industry",
ADD COLUMN     "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "willingToRelocate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "willingToTravel" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "description" TEXT,
ADD COLUMN     "facilityType" "public"."FacilityType",
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "carRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "driverLicenseNeeded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "experienceRequired" INTEGER,
ADD COLUMN     "housingAvailable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internationalApplicants" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nightShift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requiredGermanLevel" "public"."LanguageLevel",
ADD COLUMN     "shiftWork" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "visaSupport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weekendWork" BOOLEAN NOT NULL DEFAULT false;
