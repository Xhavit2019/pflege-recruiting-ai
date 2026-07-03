import { PrismaClient } from "@prisma/client";
import AppNav from "@/components/AppNav";
const prisma = new PrismaClient();

export default async function Page() {
  const applications = await prisma.application.findMany({
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
      <h1 className="text-2xl font-bold">Meine Bewerbungen</h1>

      {applications.map((application) => (
        <div key={application.id} className="card">
          <h2 className="text-xl font-bold">{application.job.title}</h2>
          <p>{application.job.company.companyName}</p>
          <p>Status: {application.status}</p>
        </div>
      ))}
    </div>
  );
}