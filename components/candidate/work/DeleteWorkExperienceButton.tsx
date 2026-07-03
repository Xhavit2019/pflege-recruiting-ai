"use client";

import { useRouter } from "next/navigation";

type DeleteWorkExperienceButtonProps = {
  workExperienceId: string;
};

export default function DeleteWorkExperienceButton({
  workExperienceId,
}: DeleteWorkExperienceButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Möchten Sie diese Berufserfahrung wirklich löschen?"
    );

    if (!confirmed) return;

    await fetch(`/api/candidate/work-experience/${workExperienceId}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      Löschen
    </button>
  );
}