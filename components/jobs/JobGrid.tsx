import JobCard from "@/components/jobs/JobCard";
import type { JobWithCompany } from "@/types/job";

type JobGridProps = {
  jobs: JobWithCompany[];
};

export default function JobGrid({ jobs }: JobGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}