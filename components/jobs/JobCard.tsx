import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { JobWithCompany } from "@/types/job";

type JobCardProps = {
  job: JobWithCompany;
};

export default function JobCard({ job }: JobCardProps) {
  const salary =
    job.salaryFrom || job.salaryTo
      ? `${job.salaryFrom ?? ""}${
          job.salaryTo ? ` - ${job.salaryTo}` : ""
        } €`
      : "Gehalt nach Vereinbarung";

  return (
    <Card className="transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500">
            {job.company.companyName}
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {job.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>{job.city}</Badge>
          <Badge>{job.employmentType}</Badge>
        </div>

        <p className="text-sm font-medium text-slate-700">
          💶 {salary}
        </p>

        <Button href={`/jobs/${job.id}`}>
          Details ansehen
        </Button>
      </div>
    </Card>
  );
}