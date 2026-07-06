import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { prisma } from "@/lib/prisma";
import { requireCompany } from "@/lib/auth/require-company";

export default async function Page() {
  const company = await requireCompany();

  const jobsCount = await prisma.job.count({
    where: {
      companyId: company.id,
    },
  });

  const applicationsCount = await prisma.application.count({
    where: {
      job: {
        companyId: company.id,
      },
    },
  });

  const candidateApplications = await prisma.application.findMany({
    where: {
      job: {
        companyId: company.id,
      },
    },
    select: {
      candidateId: true,
    },
    distinct: ["candidateId"],
  });

  const candidatesCount = candidateApplications.length;

  const applicationsWithMatch = await prisma.application.findMany({
    where: {
      job: {
        companyId: company.id,
      },
      matchScore: {
        not: null,
      },
    },
  });

  const recentApplications = await prisma.application.findMany({
    where: {
      job: {
        companyId: company.id,
      },
    },
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
    applicationsWithMatch.length > 0
      ? Math.round(
          applicationsWithMatch.reduce(
            (sum, application) => sum + (application.matchScore || 0),
            0
          ) / applicationsWithMatch.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/company/dashboard" />

      <PageHeader
        title="Unternehmen Dashboard"
        subtitle={`Willkommen bei ${company.companyName}. Verwalten Sie Ihre Stellenanzeigen, Bewerbungen und KI-Matches.`}
        actions={<Button href="/company/jobs/new">Neue Stelle erstellen</Button>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Eigene Stellenanzeigen" value={jobsCount} />
        <StatCard title="Eigene Bewerbungen" value={applicationsCount} />
        <StatCard title="Bewerber auf Ihre Stellen" value={candidatesCount} />
        <StatCard title="Ø Match Score" value={`${averageMatch}%`} />
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Neueste Bewerbungen
          </h2>

          <Button href="/company/applications">Alle ansehen</Button>
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
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {application.job.title}
                    </p>

                    <p className="text-sm text-slate-600">
                      Bewerber:{" "}
                      {application.candidate.user.name ||
                        application.candidate.user.email}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Eingegangen am{" "}
                      {new Date(application.createdAt).toLocaleDateString(
                        "de-DE"
                      )}{" "}
                      um{" "}
                      {new Date(application.createdAt).toLocaleTimeString(
                        "de-DE",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}{" "}
                      Uhr
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
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

                    <a
                      href={`/company/applications/${application.id}`}
                      className="btn inline-block"
                    >
                      Details ansehen
                    </a>
                  </div>
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