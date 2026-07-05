import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import AppNav from "@/components/AppNav";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    sort?: string;
  }>;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return <Card>Bitte zuerst einloggen.</Card>;
  }

  const company = await prisma.company.findUnique({
    where: { userId },
  });

  if (!company) {
    return <Card>Kein Unternehmensprofil gefunden.</Card>;
  }

  const params = await searchParams;

  const q = params.q ?? "";
  const status = params.status ?? "all";
  const sort = params.sort ?? "newest";

  const applications = await prisma.application.findMany({
    where: {
      job: {
        companyId: company.id,
      },

      ...(status !== "all"
        ? {
            status: status as "pending" | "reviewed" | "accepted" | "rejected",
          }
        : {}),

      ...(q
        ? {
            OR: [
              {
                candidate: {
                  user: {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
              },
              {
                candidate: {
                  user: {
                    email: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
              },
              {
                candidate: {
                  profession: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
              {
                job: {
                  title: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
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
      <AppNav dashboardHref="/company/dashboard" />

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Eingegangene Bewerbungen
        </h1>
        <p className="mt-2 text-slate-600">
          Bewerbungen auf Ihre eigenen Stellenanzeigen suchen, filtern und
          bearbeiten.
        </p>
      </div>

      <form className="card grid gap-4 md:grid-cols-4">
        <input
          className="input"
          name="q"
          placeholder="Suche nach Bewerber, E-Mail, Beruf oder Stelle"
          defaultValue={q}
        />

        <select className="input" name="status" defaultValue={status}>
          <option value="all">Alle Status</option>
          <option value="pending">Offen</option>
          <option value="reviewed">In Prüfung</option>
          <option value="accepted">Angenommen</option>
          <option value="rejected">Abgelehnt</option>
        </select>

        <select className="input" name="sort" defaultValue={sort}>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
          <option value="matchScore">Bester Match Score</option>
          <option value="status">Status A–Z</option>
        </select>

        <button className="btn" type="submit">
          Filter anwenden
        </button>
      </form>

      {sortedApplications.length === 0 ? (
        <EmptyState
          title="Keine Bewerbungen gefunden"
          description="Es wurden keine Bewerbungen gefunden, die zu Ihren Filtern passen."
          actionLabel="Neue Stelle erstellen"
          actionHref="/company/jobs/new"
        />
      ) : (
        <div className="space-y-4">
          {sortedApplications.map((application) => (
            <Card key={application.id}>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    {application.job.title}
                  </h2>

                  <p>
                    <strong>Bewerber:</strong>{" "}
                    {application.candidate.user.name || "-"} (
                    {application.candidate.user.email})
                  </p>

                  <p>
                    <strong>Beruf:</strong>{" "}
                    {application.candidate.profession || "-"}
                  </p>

                  <p>
                    <strong>Stadt:</strong>{" "}
                    {application.candidate.city || "-"}
                  </p>

                  <p>
                    <strong>Erfahrung:</strong>{" "}
                    {application.candidate.yearsOfExperience || 0} Jahre
                  </p>

                  <p>
                    <strong>Eingegangen:</strong>{" "}
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

                  <p>
                    <strong>Status:</strong>{" "}
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

                  {application.matchScore !== null && (
                    <p>
                      <strong>Match Score:</strong> {application.matchScore}%
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    href={`/company/applications/${application.id}`}
                    className="btn inline-block text-center"
                  >
                    Details ansehen
                  </Link>

                  <div className="flex flex-col gap-2">
                    {["reviewed", "accepted", "rejected"].map((newStatus) => (
                      <form
                        key={newStatus}
                        method="POST"
                        action="/api/applications/status"
                      >
                        <input
                          type="hidden"
                          name="applicationId"
                          value={application.id}
                        />
                        <input
                          type="hidden"
                          name="status"
                          value={newStatus}
                        />

                        <button className="btn w-full" type="submit">
                          {newStatus === "reviewed"
                            ? "In Prüfung"
                            : newStatus === "accepted"
                              ? "Angenommen"
                              : "Abgelehnt"}
                        </button>
                      </form>
                    ))}
                  </div>

                  <form method="POST" action="/api/ai/match">
                    <input
                      type="hidden"
                      name="applicationId"
                      value={application.id}
                    />

                    <button className="btn w-full" type="submit">
                      KI-Matching berechnen
                    </button>
                  </form>
                </div>
              </div>

              {application.matchScore !== null && (
                <div className="mt-4 rounded-lg border p-3">
                  <p>
                    <strong>KI Analyse:</strong>
                  </p>
                  <p>{application.aiSummary}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}