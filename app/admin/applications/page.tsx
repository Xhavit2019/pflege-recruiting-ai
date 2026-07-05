import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    companyId?: string;
    jobId?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const companyId = params.companyId ?? "";
  const jobId = params.jobId ?? "";
  const status = params.status ?? "all";
  const sort = params.sort ?? "newest";

  const companies = await prisma.company.findMany({
    orderBy: { companyName: "asc" },
  });

  const jobs = await prisma.job.findMany({
    orderBy: { title: "asc" },
  });

  const applications = await prisma.application.findMany({
    where: {
      ...(status !== "all" ? { status: status as any } : {}),
      ...(jobId ? { jobId } : {}),
      ...(companyId ? { job: { companyId } } : {}),
      ...(q
        ? {
            OR: [
              { candidate: { user: { name: { contains: q, mode: "insensitive" } } } },
              { candidate: { user: { email: { contains: q, mode: "insensitive" } } } },
              { job: { title: { contains: q, mode: "insensitive" } } },
              { job: { company: { companyName: { contains: q, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    include: {
      candidate: { include: { user: true } },
      job: { include: { company: true } },
    },
    orderBy:
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "status"
          ? { status: "asc" }
          : { createdAt: "desc" },
  });

  const sortedApplications =
    sort === "matchScore"
      ? [...applications].sort(
          (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0)
        )
      : applications;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/admin/dashboard" />

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bewerbungen Verwaltung
        </h1>
        <p className="mt-2 text-slate-600">
          Alle Bewerbungen suchen, filtern und verwalten.
        </p>
      </div>

      <form className="card grid gap-4 md:grid-cols-5">
        <input
          className="input"
          name="q"
          placeholder="Suche Bewerber, E-Mail, Job, Firma"
          defaultValue={q}
        />

        <select className="input" name="companyId" defaultValue={companyId}>
          <option value="">Alle Unternehmen</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.companyName}
            </option>
          ))}
        </select>

        <select className="input" name="jobId" defaultValue={jobId}>
          <option value="">Alle Stellen</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </select>

        <select className="input" name="status" defaultValue={status}>
          <option value="all">Alle Status</option>
          <option value="pending">Offen</option>
          <option value="reviewed">Geprüft</option>
          <option value="accepted">Angenommen</option>
          <option value="rejected">Abgelehnt</option>
        </select>

        <select className="input" name="sort" defaultValue={sort}>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="matchScore">Match Score</option>
          <option value="status">Status A–Z</option>
        </select>

        <button className="btn md:col-span-5" type="submit">
          Filter anwenden
        </button>
      </form>

      {sortedApplications.length === 0 && (
        <div className="card">Keine Bewerbungen gefunden.</div>
      )}

      <div className="space-y-4">
        {sortedApplications.map((application) => (
          <div key={application.id} className="card">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {application.job.title}
                </h2>

                <p>
                  <strong>Unternehmen:</strong>{" "}
                  {application.job.company.companyName}
                </p>

                <p>
                  <strong>Bewerber:</strong>{" "}
                  {application.candidate.user.name || "-"}
                </p>

                <p>
                  <strong>E-Mail:</strong> {application.candidate.user.email}
                </p>

                <p>
                  <strong>Status:</strong> {application.status}
                </p>

                <p>
                  <strong>Match Score:</strong>{" "}
                  {application.matchScore ?? "-"}%
                </p>

                <p>
                  <strong>Datum:</strong>{" "}
                  {new Date(application.createdAt).toLocaleDateString("de-DE")}
                </p>
              </div>

              <form method="POST" action="/api/admin/delete-application">
                <input
                  type="hidden"
                  name="applicationId"
                  value={application.id}
                />

                <button className="btn" type="submit">
                  Bewerbung löschen
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}