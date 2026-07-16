import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import { requireCandidate } from "@/lib/auth/require-candidate";

import CandidateProfileForm from "@/components/candidate/profile/CandidateProfileForm";
import ProfileImageCard from "@/components/candidate/profile/ProfileImageCard";
import CvUploadCard from "@/components/candidate/profile/CvUploadCard";
import AiSummaryCard from "@/components/candidate/profile/AiSummaryCard";

import EducationCard from "@/components/candidate/education/EducationCard";
import WorkExperienceCard from "@/components/candidate/work/WorkExperienceCard";
import CertificateCard from "@/components/candidate/certificates/CertificateCard";
import LanguageCard from "@/components/candidate/languages/LanguageCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    editEducation?: string;
    editWorkExperience?: string;
    editCertificate?: string;
    editLanguage?: string;
  }>;
}) {
  const profile = await requireCandidate();
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/candidate/dashboard" />

      <PageHeader
        title="Mein Bewerberprofil"
        subtitle="Pflegen Sie Ihre persönlichen und beruflichen Daten."
      />

      <CandidateProfileForm profile={profile} />

      <ProfileImageCard
        profileImageUrl={profile.profileImageUrl}
      />

      <CvUploadCard cvUrl={profile.cvUrl} />

      <AiSummaryCard
        summary={profile.summary}
        skills={profile.skills}
      />

      <EducationCard
        educations={profile.educations}
        editId={params.editEducation}
      />

      <WorkExperienceCard
        workExperiences={profile.workExperiences}
        editId={params.editWorkExperience}
      />

      <CertificateCard
        certificates={profile.certificates}
        editId={params.editCertificate}
      />

      <LanguageCard
        languages={profile.languages}
        editId={params.editLanguage}
      />
    </div>
  );
}