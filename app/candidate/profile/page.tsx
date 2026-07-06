import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { requireCandidate } from "@/lib/auth/require-candidate";
import ProfileImageCard from "@/components/candidate/profile/ProfileImageCard";
import AiSummaryCard from "@/components/candidate/profile/AiSummaryCard";
import CandidateProfileForm from "@/components/candidate/profile/CandidateProfileForm";
import CvUploadCard from "@/components/candidate/profile/CvUploadCard";
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
        subtitle="Pflegen Sie Ihre beruflichen Daten, Sprache, Mobilität und Verfügbarkeit."
      />

      <ProfileImageCard profileImageUrl={profile.profileImageUrl} />

      <AiSummaryCard
        summary={profile.summary}
        skills={profile.skills}
      />

      <CvUploadCard
        cvUrl={profile.cvUrl}
      />

      <CandidateProfileForm profile={profile} />

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