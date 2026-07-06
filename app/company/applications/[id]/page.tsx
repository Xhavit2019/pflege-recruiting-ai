import { prisma } from "@/lib/prisma";
import BackButton from "@/components/BackButton";
import Card from "@/components/ui/Card";
import { requireCompany } from "@/lib/auth/require-company";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const company = await requireCompany();

  const { id } = await params;

  const application = await prisma.application.findFirst({
    where: {
      id,
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
      job: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!application) {
    return <Card>Bewerbung nicht gefunden oder kein Zugriff erlaubt.</Card>;
  }

  return (
    <div className="space-y-4">
      <BackButton />

      <Card>
        <h1 className="text-2xl font-bold">Bewerberdetails</h1>

        <p><strong>Name:</strong> {application.candidate.user.name || "-"}</p>
        <p><strong>E-Mail:</strong> {application.candidate.user.email}</p>
        <p><strong>Beruf:</strong> {application.candidate.profession || "-"}</p>
        <p><strong>Stadt:</strong> {application.candidate.city || "-"}</p>
        <p><strong>Erfahrung:</strong> {application.candidate.yearsOfExperience || 0} Jahre</p>
        <p><strong>Status:</strong> {application.status}</p>
        <p>
          <strong>Eingegangen:</strong>{" "}
          {new Date(application.createdAt).toLocaleDateString("de-DE")} um{" "}
          {new Date(application.createdAt).toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          Uhr
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
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
      </Card>

      <Card>
        <h2 className="text-xl font-bold">Stelle</h2>
        <p><strong>Titel:</strong> {application.job.title}</p>
        <p><strong>Firma:</strong> {application.job.company.companyName}</p>
        <p><strong>Ort:</strong> {application.job.city}</p>
      </Card>

      <Card>
        <h2 className="text-xl font-bold">KI-Auswertung</h2>
        <p><strong>Match Score:</strong> {application.matchScore ?? "-"}%</p>
        <p>{application.aiSummary || "Noch keine KI-Auswertung vorhanden."}</p>
      </Card>

      {application.candidate.cvUrl && (
        <Card>
          <h2 className="text-xl font-bold">Lebenslauf</h2>
          <a
            className="btn inline-block"
            href={application.candidate.cvUrl}
            target="_blank"
          >
            PDF ansehen
          </a>
        </Card>
      )}
    </div>
  );
}