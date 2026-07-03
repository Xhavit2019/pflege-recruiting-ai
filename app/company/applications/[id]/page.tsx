import { prisma } from "@/lib/prisma";
import BackButton from "@/components/BackButton";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const application = await prisma.application.findUnique({
    where: { id },
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
  });

  if (!application) {
    return <div className="card">Bewerbung nicht gefunden.</div>;
  }

  return (
    <div className="space-y-4">
      <BackButton />

      <div className="card">
        <h1 className="text-2xl font-bold">Bewerberdetails</h1>

        <p><strong>Name:</strong> {application.candidate.user.name}</p>
        <p><strong>E-Mail:</strong> {application.candidate.user.email}</p>
        <p><strong>Beruf:</strong> {application.candidate.profession || "-"}</p>
        <p><strong>Stadt:</strong> {application.candidate.city || "-"}</p>
        <p><strong>Erfahrung:</strong> {application.candidate.experienceYears || 0} Jahre</p>
        <p><strong>Status:</strong> {application.status}</p>

        <div className="flex gap-2 flex-wrap mt-4">
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
      </div>

      <div className="card">
        <h2 className="text-xl font-bold">Stelle</h2>
        <p><strong>Titel:</strong> {application.job.title}</p>
        <p><strong>Firma:</strong> {application.job.company.companyName}</p>
        <p><strong>Ort:</strong> {application.job.city}</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold">KI-Auswertung</h2>
        <p><strong>Match Score:</strong> {application.matchScore ?? "-"}%</p>
        <p>{application.aiSummary || "Noch keine KI-Auswertung vorhanden."}</p>
      </div>

      {application.candidate.cvUrl && (
        <div className="card">
          <h2 className="text-xl font-bold">Lebenslauf</h2>
          <a className="btn inline-block" href={application.candidate.cvUrl} target="_blank">
            PDF ansehen
          </a>
        </div>
      )}
    </div>
  );
}