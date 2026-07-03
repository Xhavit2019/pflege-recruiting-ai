-- DropForeignKey
ALTER TABLE "public"."CandidateProfile" DROP CONSTRAINT "CandidateProfile_userId_fkey";

-- AlterTable
ALTER TABLE "public"."CandidateProfile" ALTER COLUMN "experienceYears" DROP NOT NULL,
ALTER COLUMN "experienceYears" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "public"."CandidateProfile" ADD CONSTRAINT "CandidateProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
