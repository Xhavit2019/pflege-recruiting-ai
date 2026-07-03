import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
import Badge from "@/components/ui/Badge";
export default async function Page() {
  const applications = await prisma.application.findMany({
    include: {
      candidate: {
        include: {
          user: true,
        },
      },
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <AppNav dashboardHref="/company/dashboard" />
      <h1 className="text-2xl font-bold">Eingegangene Bewerbungen</h1>

      {applications.length === 0 && (
        <div className="card">Noch keine Bewerbungen vorhanden.</div>
      )}

      {applications.map((application) => (
        <div key={application.id} className="card space-y-2">
          <h2 className="text-xl font-bold">{application.job.title}</h2>

          <p>
            Bewerber: {application.candidate.user.name} (
            {application.candidate.user.email})
          </p>

          <p>Beruf: {application.candidate.profession || "-"}</p>
          <p>Stadt: {application.candidate.city || "-"}</p>
          <p>
            Erfahrung: {application.candidate.experienceYears || 0} Jahre
          </p>

         <p>
  Status:{" "}
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
</p>
<Link
  href={`/company/applications/${application.id}`}
  className="btn inline-block"
>
  Details ansehen
</Link>

          <div className="flex gap-2 flex-wrap">
            {["reviewed", "accepted", "rejected"].map((status) => (
              <form key={status} method="POST" action="/api/applications/status">
                <input type="hidden" name="applicationId" value={application.id} />
                <input type="hidden" name="status" value={status} />
                <button className="btn" type="submit">
                  {status === "reviewed"
                    ? "In Prüfung"
                    : status === "accepted"
                    ? "Angenommen"
                    : "Abgelehnt"}
                </button>
              </form>
            ))}
          </div>

          <form method="POST" action="/api/ai/match" className="mt-3">
            <input type="hidden" name="applicationId" value={application.id} />
            <button className="btn" type="submit">
              KI-Matching berechnen
            </button>
          </form>

          {application.matchScore !== null && (
            <div className="mt-3 rounded-lg border p-3">
              <p>
                <strong>Match Score:</strong> {application.matchScore}%
              </p>
              <p>
                <strong>KI Analyse:</strong>
              </p>
              <p>{application.aiSummary}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}