import AppNav from "@/components/AppNav";
import { prisma } from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
    },
  });

  if (!job) {
    return (
      <div className="card">
        Stelle nicht gefunden.
      </div>
    );
  }

  return (
    <div className="card mx-auto max-w-3xl space-y-4">
      <AppNav dashboardHref="/candidate/dashboard" />

      <h1 className="text-3xl font-bold">
        {job.title}
      </h1>

      <p>
        {job.city} · {job.employmentType}
      </p>

      <p className="font-semibold">
        {job.company.companyName}
      </p>

      <p>{job.description}</p>

      <p>
        Gehalt: {job.salaryFrom ?? "-"} € bis{" "}
        {job.salaryTo ?? "-"} €
      </p>

      <p>
        Skills:{" "}
        {job.requiredSkills.length > 0
          ? job.requiredSkills.join(", ")
          : "Keine besonderen Skills angegeben"}
      </p>

      <form method="POST" action="/api/applications">
        <input
          type="hidden"
          name="jobId"
          value={job.id}
        />

        <button className="btn" type="submit">
          Jetzt bewerben
        </button>
      </form>
    </div>
  );
}