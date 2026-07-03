"use client";

import { useRouter } from "next/navigation";

type DeleteEducationButtonProps = {
  educationId: string;
};

export default function DeleteEducationButton({
  educationId,
}: DeleteEducationButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Möchten Sie diese Ausbildung wirklich löschen?"
    );

    if (!confirmed) return;

    await fetch(`/api/candidate/education/${educationId}`, {
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