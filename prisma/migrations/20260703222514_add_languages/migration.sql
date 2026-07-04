-- CreateTable
CREATE TABLE "public"."Language" (
    "id" TEXT NOT NULL,
    "candidateProfileId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" "public"."LanguageLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Language" ADD CONSTRAINT "Language_candidateProfileId_fkey" FOREIGN KEY ("candidateProfileId") REFERENCES "public"."CandidateProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
