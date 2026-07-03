import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import JobGrid from "@/components/jobs/JobGrid";
import JobSearch from "@/components/jobs/JobSearch";
import EmptyState from "@/components/ui/EmptyState";
import { searchJobs } from "@/lib/search";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    city?: string;
    employmentType?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q?.trim();
  const city = params.city?.trim();
  const employmentType = params.employmentType?.trim();

  const jobs = await searchJobs({
    q,
    city,
    employmentType,
  });

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/candidate/dashboard" />

      <PageHeader
        title="Stellenanzeigen"
        subtitle="Entdecken Sie aktuelle Jobs in der Pflegebranche."
      />

      <JobSearch
        q={q}
        city={city}
        employmentType={employmentType}
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="Keine passenden Stellen gefunden"
          description="Ändern Sie die Suchbegriffe oder setzen Sie die Filter zurück."
          actionLabel="Alle Jobs anzeigen"
          actionHref="/jobs"
        />
      ) : (
        <JobGrid jobs={jobs} />
      )}
    </div>
  );
}