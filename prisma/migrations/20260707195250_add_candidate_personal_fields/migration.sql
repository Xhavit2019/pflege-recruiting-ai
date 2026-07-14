-- AlterTable
ALTER TABLE "public"."CandidateProfile" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "postalCode" TEXT;
