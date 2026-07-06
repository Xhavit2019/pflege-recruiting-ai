import Link from "next/link";
import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/auth/require-company";

export default async function Page() {
  const company = await requireCompany();

  const jobs = await prisma.job.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      company: true,
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/company/dashboard" />

      <PageHeader
        title="Meine Stellenanzeigen"
        subtitle="Verwalten Sie Ihre veröffentlichten Stellen und eingegangenen Bewerbungen."
        actions={<Button href="/company/jobs/new">Neue Stelle erstellen</Button>}
      />

      {jobs.length === 0 ? (
        <EmptyState
          title="Noch keine Stellenanzeigen"
          description="Erstellen Sie Ihre erste Stellenanzeige, damit Bewerber sich bewerben können."
          actionLabel="Neue Stelle erstellen"
          actionHref="/company/jobs/new"
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>

                    <Badge variant={job.isActive ? "success" : "default"}>
                      {job.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {job.company.companyName} · {job.city} · {job.employmentType}
                  </p>

                  <p className="mt-3 text-sm text-slate-700">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="min-w-40 text-sm text-slate-600">
                  <p>
                    <strong>{job.applications.length}</strong> Bewerbungen
                  </p>

                  {(job.salaryFrom || job.salaryTo) && (
                    <p className="mt-1">
                      {job.salaryFrom ?? "-"} € – {job.salaryTo ?? "-"} €
                    </p>
                  )}

                  <Link
                    href="/company/applications"
                    className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
                  >
                    Bewerbungen ansehen
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}