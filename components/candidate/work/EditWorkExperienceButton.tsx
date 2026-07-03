"use client";

import { useRouter } from "next/navigation";

type EditWorkExperienceButtonProps = {
  workExperienceId: string;
};

export default function EditWorkExperienceButton({
  workExperienceId,
}: EditWorkExperienceButtonProps) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/candidate/profile?editWorkExperience=${workExperienceId}`);
  }

  return (
    <button
      type="button"
      onClick={handleEdit}
      className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
    >
      Bearbeiten
    </button>
  );
}