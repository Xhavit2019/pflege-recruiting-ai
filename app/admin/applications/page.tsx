import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
export default async function Page() {
  const applications = await prisma.application.findMany({
    include: {
      candidate: { include: { user: true } },
      job: { include: { company: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <AppNav dashboardHref="/admin/dashboard" />
      <h1 className="text-3xl font-bold">Bewerbungen Verwaltung</h1>

      {applications.length === 0 && (
        <div className="card">Keine Bewerbungen vorhanden.</div>
      )}

      {applications.map((application) => (
        <div key={application.id} className="card space-y-2">
          <h2 className="text-xl font-bold">{application.job.title}</h2>

          <p><strong>Unternehmen:</strong> {application.job.company.companyName}</p>
          <p><strong>Bewerber:</strong> {application.candidate.user.name || "-"}</p>
          <p><strong>E-Mail:</strong> {application.candidate.user.email}</p>
          <p><strong>Status:</strong> {application.status}</p>
          <p><strong>Match Score:</strong> {application.matchScore ?? "-"}%</p>
          <p><strong>Datum:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>

          <form
            method="POST"
            action="/api/admin/delete-application"
            className="mt-3"
          >
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
      ))}
    </div>
  );
}