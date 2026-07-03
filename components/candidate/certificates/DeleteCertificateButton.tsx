"use client";

import { useRouter } from "next/navigation";

type DeleteCertificateButtonProps = {
  certificateId: string;
};

export default function DeleteCertificateButton({
  certificateId,
}: DeleteCertificateButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = confirm(
      "Möchten Sie dieses Zertifikat wirklich löschen?"
    );

    if (!confirmed) return;

    await fetch(`/api/candidate/certificate/${certificateId}`, {
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