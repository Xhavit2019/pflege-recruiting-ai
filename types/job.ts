export type JobWithCompany = {
  id: string;
  title: string;
  city: string;
  employmentType: string;
  salaryFrom?: number | null;
  salaryTo?: number | null;
  company: {
    companyName: string;
  };
};