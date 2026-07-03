import Link from "next/link";
import AppNav from "@/components/AppNav";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const usersCount = await prisma.user.count();
  const companiesCount = await prisma.company.count();
  const candidatesCount = await prisma.candidateProfile.count();
  const jobsCount = await prisma.job.count();
  const applicationsCount = await prisma.application.count();

  return (
    <div className="space-y-6">
      <AppNav dashboardHref="/admin/dashboard" />

      <PageHeader
        title="Admin Dashboard"
        subtitle="Zentrale Übersicht über Benutzer, Unternehmen, Stellenanzeigen und Bewerbungen."
      />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="User" value={usersCount} />
        <StatCard title="Unternehmen" value={companiesCount} />
        <StatCard title="Bewerber" value={candidatesCount} />
        <StatCard title="Jobs" value={jobsCount} />
        <StatCard title="Bewerbungen" value={applicationsCount} />
      </div>

      <Card className="flex gap-3 flex-wrap">
        <Button href="/admin/users">User verwalten</Button>
        <Button href="/admin/jobs">Jobs verwalten</Button>
        <Button href="/admin/applications">Bewerbungen</Button>
      </Card>
    </div>
  );
}