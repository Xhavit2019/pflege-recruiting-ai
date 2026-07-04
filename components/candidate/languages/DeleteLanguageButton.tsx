"use client";

import { useRouter } from "next/navigation";

type DeleteLanguageButtonProps = {
  languageId: string;
};

export default function DeleteLanguageButton({
  languageId,
}: DeleteLanguageButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Möchten Sie diese Sprache wirklich löschen?"
    );

    if (!confirmed) return;

    await fetch(`/api/candidate/language/${languageId}`, {
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