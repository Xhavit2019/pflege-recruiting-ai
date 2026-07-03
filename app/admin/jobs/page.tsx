import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
export default async function Page() {
  const jobs = await prisma.job.findMany({
    include: {
      company: true,
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <AppNav dashboardHref="/admin/dashboard" />
      <h1 className="text-3xl font-bold">
        Stellenanzeigen Verwaltung
      </h1>

      {jobs.length === 0 && (
        <div className="card">
          Keine Stellenanzeigen vorhanden.
        </div>
      )}

      {jobs.map((job) => (
        <div key={job.id} className="card">
          <h2 className="text-xl font-bold">
            {job.title}
          </h2>

          <p>
            <strong>Unternehmen:</strong>{" "}
            {job.company.companyName}
          </p>

          <p>
            <strong>Ort:</strong> {job.city}
          </p>

          <p>
            <strong>Anstellungsart:</strong>{" "}
            {job.employmentType}
          </p>

          <p>
            <strong>Bewerbungen:</strong>{" "}
            {job.applications.length}
          </p>

          <form
            method="POST"
            action="/api/admin/delete-job"
            className="mt-3"
          >
            <input
              type="hidden"
              name="jobId"
              value={job.id}
            />

            <button
              className="btn"
              type="submit"
            >
              Job löschen
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}