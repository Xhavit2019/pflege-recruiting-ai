import AppNav from "@/components/AppNav";
import Card from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { requireCandidate } from "@/lib/auth/require-candidate";

export default async function Page() {
  const candidate = await requireCandidate();

  const applications = await prisma.application.findMany({
    where: {
      candidateId: candidate.id,
    },
    include: {
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
      <AppNav dashboardHref="/candidate/dashboard" />

      <h1 className="text-2xl font-bold">
        Meine Bewerbungen
      </h1>

      {applications.length === 0 && (
        <Card>
          Sie haben sich bisher auf keine Stelle beworben.
        </Card>
      )}

      {applications.map((application) => (
        <Card key={application.id}>
          <h2 className="text-xl font-bold">
            {application.job.title}
          </h2>

          <p>
            <strong>Unternehmen:</strong>{" "}
            {application.job.company.companyName}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {application.status}
          </p>

          <p>
            <strong>Beworben am:</strong>{" "}
            {new Date(application.createdAt).toLocaleDateString("de-DE")}{" "}
            um{" "}
            {new Date(application.createdAt).toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            Uhr
          </p>

          {application.matchScore !== null && (
            <p>
              <strong>Match Score:</strong> {application.matchScore}%
            </p>
          )}

          {application.aiSummary && (
            <div className="mt-3 rounded-lg border p-3">
              <strong>KI-Auswertung</strong>
              <p className="mt-2">{application.aiSummary}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}