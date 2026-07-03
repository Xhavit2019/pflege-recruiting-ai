"use client";

import { useRouter } from "next/navigation";

type EditEducationButtonProps = {
  educationId: string;
};

export default function EditEducationButton({
  educationId,
}: EditEducationButtonProps) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/candidate/profile?editEducation=${educationId}`);
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