import AppNav from "@/components/AppNav";
import { prisma } from "@/lib/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    companyId?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  const q = params.q ?? "";
  const companyId = params.companyId ?? "";
  const status = params.status ?? "all";
  const sort = params.sort ?? "newest";

  const companies = await prisma.company.findMany({
    orderBy: {
      companyName: "asc",
    },
  });

  const jobs = await prisma.job.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),

      ...(companyId
        ? {
            companyId,
          }
        : {}),

      ...(status === "active"
        ? { isActive: true }
        : status === "inactive"
          ? { isActive: false }
          : {}),
    },
    include: {
      company: true,
      applications: true,
    },
    orderBy:
      sort === "oldest"
        ? { createdAt: "asc" }
        : sort === "title"
          ? { title: "asc" }
          : { createdAt: "desc" },
  });

  const sortedJobs =
  sort === "applications"
    ? [...jobs].sort((a, b) => b.applications.length - a.applications.length)
    : sort === "company"
      ? [...jobs].sort((a, b) =>
          a.company.companyName.localeCompare(b.company.companyName)
        )
      : sort === "active"
        ? [...jobs].sort((a, b) => Number(b.isActive) - Number(a.isActive))
        : sort === "inactive"
          ? [...jobs].sort((a, b) => Number(a.isActive) - Number(b.isActive))
          : jobs;

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/admin/dashboard" />

      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Stellenanzeigen Verwaltung
        </h1>
        <p className="mt-2 text-slate-600">
          Alle Stellenanzeigen prüfen, filtern und verwalten.
        </p>
      </div>

      <form className="card grid gap-4 md:grid-cols-4">
        <input
          className="input"
          name="q"
          placeholder="Suche nach Titel, Ort oder Text"
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

        <select className="input" name="status" defaultValue={status}>
          <option value="all">Alle Status</option>
          <option value="active">Nur aktive</option>
          <option value="inactive">Nur inaktive</option>
        </select>

        <select className="input" name="sort" defaultValue={sort}>
  <option value="newest">Neueste zuerst</option>
  <option value="oldest">Älteste zuerst</option>
  <option value="title">Titel A–Z</option>
  <option value="company">Unternehmen A–Z</option>
  <option value="applications">Meiste Bewerbungen</option>
  <option value="active">Aktive zuerst</option>
  <option value="inactive">Inaktive zuerst</option>
</select>

        <button className="btn md:col-span-4" type="submit">
          Filter anwenden
        </button>
      </form>

      {sortedJobs.length === 0 && (
        <div className="card">Keine Stellenanzeigen gefunden.</div>
      )}

      {sortedJobs.map((job) => (
        <div key={job.id} className="card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>

              <p>
                <strong>Unternehmen:</strong> {job.company.companyName}
              </p>

              <p>
                <strong>Ort:</strong> {job.city}
              </p>

              <p>
                <strong>Anstellungsart:</strong> {job.employmentType}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {job.isActive ? "Aktiv" : "Inaktiv"}
              </p>

              <p>
                <strong>Bewerbungen:</strong> {job.applications.length}
              </p>
            </div>

            <form method="POST" action="/api/admin/delete-job">
              <input type="hidden" name="jobId" value={job.id} />

              <button className="btn" type="submit">
                Job löschen
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}