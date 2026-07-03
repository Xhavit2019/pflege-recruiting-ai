"use client";

import { useRouter } from "next/navigation";

type EditCertificateButtonProps = {
  certificateId: string;
};

export default function EditCertificateButton({
  certificateId,
}: EditCertificateButtonProps) {
  const router = useRouter();

  function handleEdit() {
    router.push(`/candidate/profile?editCertificate=${certificateId}`);
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