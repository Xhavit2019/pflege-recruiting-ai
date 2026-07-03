import { JobRepository } from "@/repositories/job.repository";

type SearchJobsParams = {
  q?: string;
  city?: string;
  employmentType?: string;
};

export const JobService = {
  searchJobs(params: SearchJobsParams) {
    return JobRepository.search(params);
  },
};