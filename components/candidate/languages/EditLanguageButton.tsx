"use client";

import { useRouter } from "next/navigation";

type EditLanguageButtonProps = {
  languageId: string;
};

export default function EditLanguageButton({
  languageId,
}: EditLanguageButtonProps) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/candidate/profile?editLanguage=${languageId}`);
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