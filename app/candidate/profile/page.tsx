import { cookies } from "next/headers";
import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import { CandidateService } from "@/services/candidate.service";
import ProfileImageCard from "@/components/candidate/profile/ProfileImageCard";
import AiSummaryCard from "@/components/candidate/profile/AiSummaryCard";
import CandidateProfileForm from "@/components/candidate/profile/CandidateProfileForm";
import CvUploadCard from "@/components/candidate/profile/CvUploadCard";
import EducationCard from "@/components/candidate/education/EducationCard";
import WorkExperienceCard from "@/components/candidate/work/WorkExperienceCard";
import CertificateCard from "@/components/candidate/certificates/CertificateCard";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    editEducation?: string;
    editWorkExperience?: string;
    editCertificate?: string;
}>;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return <Card>Bitte zuerst einloggen.</Card>;
  }

  const profile = await CandidateService.getProfile(userId);

  const params = await searchParams;
  const editEducationId = params.editEducation;
  const editWorkExperienceId = params.editWorkExperience;
  const editCertificateId = params.editCertificate;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/candidate/dashboard" />

      <PageHeader
        title="Mein Bewerberprofil"
        subtitle="Pflegen Sie Ihre beruflichen Daten, Sprache, Mobilität und Verfügbarkeit."
      />

      <ProfileImageCard profileImageUrl={profile?.profileImageUrl} />

      <AiSummaryCard
        summary={profile?.summary}
        skills={profile?.skills}
      />

      <CvUploadCard cvUrl={profile?.cvUrl} />

      <CandidateProfileForm profile={profile} />

      <EducationCard
        educations={profile?.educations ?? []}
        editId={editEducationId}
      />

      <WorkExperienceCard
        workExperiences={profile?.workExperiences ?? []}
        editId={editWorkExperienceId}
      />

      <CertificateCard
        certificates={profile?.certificates ?? []}
        editId={editCertificateId}
      />
    </div>
  );
}