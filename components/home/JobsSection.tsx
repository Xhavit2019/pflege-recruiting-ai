import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import type { JobWithCompany } from "@/types/job";
import JobGrid from "@/components/jobs/JobGrid";

type JobsSectionProps = {
  jobs: JobWithCompany[];
};

export default function JobsSection({ jobs }: JobsSectionProps) {
  return (
    <section>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Stellenangebote
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Aktuelle Jobs in der Pflege
          </h2>

          <p className="mt-3 text-slate-600">
            Entdecken Sie neue Stellenangebote von Pflegeeinrichtungen.
          </p>
        </div>

        <Button href="/jobs">Alle Jobs ansehen</Button>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="Noch keine Stellenangebote vorhanden"
          description="Sobald Unternehmen Stellen veröffentlichen, erscheinen sie hier."
          actionLabel="Registrieren"
          actionHref="/register"
        />
      ) : (
        <JobGrid jobs={jobs} />
      )}
    </section>
  );
}