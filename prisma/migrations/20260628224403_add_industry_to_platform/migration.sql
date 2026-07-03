-- CreateEnum
CREATE TYPE "public"."Industry" AS ENUM ('care', 'healthcare', 'it', 'crafts', 'logistics', 'gastronomy', 'administration', 'education', 'industry', 'other');

-- CreateEnum
CREATE TYPE "public"."LanguageLevel" AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE');

-- CreateEnum
CREATE TYPE "public"."FacilityType" AS ENUM ('nursing_home', 'hospital', 'outpatient_care', 'rehabilitation', 'clinic', 'other');

-- AlterTable
ALTER TABLE "public"."CandidateProfile" ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "desiredSalary" INTEGER,
ADD COLUMN     "germanLevel" "public"."LanguageLevel",
ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "public"."Company" ADD COLUMN     "industry" "public"."Industry";

-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "industry" "public"."Industry" NOT NULL DEFAULT 'care';
