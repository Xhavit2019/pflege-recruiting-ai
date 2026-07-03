import { JobService } from "@/services/job.service";

type SearchJobsParams = {
  q?: string;
  city?: string;
  employmentType?: string;
};

export async function searchJobs(params: SearchJobsParams) {
  return JobService.searchJobs(params);
}