import Card from "@/components/ui/Card";
import EditCertificateButton from "./EditCertificateButton";
import DeleteCertificateButton from "./DeleteCertificateButton";
import CertificateForm from "./CertificateForm";

type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issueDate?: Date | null;
  expiryDate?: Date | null;
  certificateNumber?: string | null;
  description?: string | null;
};

type CertificateCardProps = {
  certificates: Certificate[];
  editId?: string;
};

export default function CertificateCard({
  certificates,
  editId,
}: CertificateCardProps) {
  const editingCertificate = certificates.find(
    (certificate) => certificate.id === editId
  );

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-900">Zertifikate</h2>

      {certificates.length > 0 && (
        <div className="mt-4 space-y-3">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900">
                    {certificate.title}
                  </h3>

                  <p className="text-sm text-slate-600">
                    {certificate.issuer}
                  </p>

                  {certificate.certificateNumber && (
                    <p className="mt-1 text-sm text-slate-500">
                      Nr. {certificate.certificateNumber}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <EditCertificateButton certificateId={certificate.id} />
                  <DeleteCertificateButton certificateId={certificate.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CertificateForm
        certificateId={editingCertificate?.id}
        title={editingCertificate?.title}
        issuer={editingCertificate?.issuer}
        issueDate={editingCertificate?.issueDate}
        expiryDate={editingCertificate?.expiryDate}
        certificateNumber={editingCertificate?.certificateNumber}
        description={editingCertificate?.description}
      />
    </Card>
  );
}