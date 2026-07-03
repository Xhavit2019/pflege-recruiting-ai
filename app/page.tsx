import { prisma } from "@/lib/prisma";

import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import JobsSection from "@/components/home/JobsSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

export default async function Home() {
  const jobs = await prisma.job.findMany({
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });

  return (
    <div className="space-y-20">
      <HeroSection />
      <FeaturesSection />
      <JobsSection jobs={jobs} />
      <StatsSection />
      <CTASection />
    </div>
  );
}