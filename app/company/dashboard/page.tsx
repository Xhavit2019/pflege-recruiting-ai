import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const jobsCount = await prisma.job.count();
  const applicationsCount = await prisma.application.count();
  const candidatesCount = await prisma.candidateProfile.count();

  const applications = await prisma.application.findMany({
    where: {
      matchScore: {
        not: null,
      },
    },
  });

  const recentApplications = await prisma.application.findMany({
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      job: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const averageMatch =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (sum, application) =>
              sum + (application.matchScore || 0),
            0
          ) / applications.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/company/dashboard" />

      <PageHeader
        title="Unternehmen Dashboard"
        subtitle="Verwalten Sie Stellenanzeigen, Bewerbungen und KI-Matching."
        actions={
          <Button href="/company/jobs/new">
            Neue Stelle erstellen
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Stellenanzeigen" value={jobsCount} />
        <StatCard title="Bewerbungen" value={applicationsCount} />
        <StatCard title="Bewerber" value={candidatesCount} />
        <StatCard title="Ø Match Score" value={`${averageMatch}%`} />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Neueste Bewerbungen
          </h2>

          <Button href="/company/applications">
            Alle ansehen
          </Button>
        </div>

        {recentApplications.length === 0 ? (
          <EmptyState
            title="Keine Bewerbungen vorhanden"
            description="Sobald sich Bewerber auf Ihre Stellenanzeigen bewerben, erscheinen sie hier."
            actionLabel="Neue Stelle erstellen"
            actionHref="/company/jobs/new"
          />
        ) : (
          <div className="space-y-3">
            {recentApplications.map((application) => (
              <div
                key={application.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {application.job.title}
                    </p>

                    <p className="text-sm text-slate-600">
                      Bewerber: {application.candidate.user.email}
                    </p>
                  </div>

                  <Badge
                    variant={
                      application.status === "accepted"
                        ? "success"
                        : application.status === "rejected"
                        ? "danger"
                        : application.status === "reviewed"
                        ? "warning"
                        : "default"
                    }
                  >
                    {application.status}
                  </Badge>
                </div>

                {application.matchScore !== null && (
                  <p className="mt-2 text-sm text-slate-600">
                    Match: {application.matchScore}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}